// ============================================================
// LangChain Investment Analysis Chain
// ============================================================
// This is the core AI pipeline. It uses LangChain to:
//   1. Create a ChatGroq model instance (Llama 3 70B)
//   2. Build a prompt from our template
//   3. Send it to Groq's ultra-fast inference API
//   4. Parse the structured JSON response
//
// Why LangChain?
//   - Provides a clean abstraction over LLM providers
//   - Makes it easy to swap models (e.g., Groq → OpenAI)
//   - Handles message formatting automatically
// ============================================================

import { ChatGroq } from '@langchain/groq';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { buildInvestmentPrompt } from '../prompts/investmentPrompt.js';

// Initialize the Groq LLM with Llama 3 70B model
// Temperature 0.3 = more focused/deterministic responses
// Max tokens 4096 = enough for our detailed JSON output
let llm = null;

function getLLM() {
  if (!llm) {
    llm = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      maxTokens: 4096,
    });
  }
  return llm;
}

/**
 * Runs the investment analysis chain.
 * @param {string} company - Company name
 * @param {string} searchResults - Formatted search results from Tavily
 * @returns {object} - Parsed JSON analysis
 */
export async function runAnalysisChain(company, searchResults) {
  console.log(`🤖 Running AI analysis for "${company}"...`);

  // Build the prompt from our template
  const { systemPrompt, userPrompt } = buildInvestmentPrompt(company, searchResults);

  // Create LangChain messages
  const messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(userPrompt),
  ];

  // Call the Groq LLM via LangChain
  const model = getLLM();
  const response = await model.invoke(messages);

  // Extract the text content from the LangChain response
  const rawText = response.content;
  console.log(`📝 Received AI response (${rawText.length} chars)`);

  // Parse the JSON from the response (with repair + retry)
  const jsonString = extractJSON(rawText);
  try {
    return JSON.parse(jsonString);
  } catch (firstError) {
    console.warn(`⚠️  JSON parse failed, attempting repair...`);
    try {
      const repaired = repairJSON(jsonString);
      return JSON.parse(repaired);
    } catch {
      // Retry once with a fresh LLM call
      console.warn(`⚠️  Repair failed. Retrying LLM call...`);
      const retryResponse = await model.invoke(messages);
      const retryText = retryResponse.content;
      const retryJson = extractJSON(retryText);
      try {
        return JSON.parse(retryJson);
      } catch {
        return JSON.parse(repairJSON(retryJson));
      }
    }
  }
}

/**
 * Extracts JSON from LLM response text.
 * Handles cases where the LLM wraps JSON in ```json ... ``` blocks.
 */
function extractJSON(text) {
  // Try to find JSON in code blocks first
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  // Try to find a JSON object directly
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0].trim();
  }

  // Return as-is and let JSON.parse handle the error
  return text.trim();
}

/**
 * Attempts to repair common JSON issues from LLM output:
 * - Trailing commas before } or ]
 * - Unescaped newlines inside strings
 * - Smart quotes
 */
function repairJSON(text) {
  let fixed = text;
  // Replace smart quotes with regular quotes
  fixed = fixed.replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");
  // Remove trailing commas before } or ]
  fixed = fixed.replace(/,\s*([\]}])/g, '$1');
  // Fix unescaped newlines inside string values
  fixed = fixed.replace(/"([^"]*?)"/g, (match) => {
    return match.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
  });
  return fixed;
}

