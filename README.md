# 🤖 InvestIQ AI — AI Investment Research Agent

> An AI-powered investment research platform that analyzes companies using real-time web search and Large Language Models, delivering professional investment recommendations with confidence scoring.

⚡ **Live Demo Link**: [ai-investment-research-agent-lime.vercel.app](https://ai-investment-research-agent-lime.vercel.app/)

![InvestIQ AI](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge) ![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white) ![LangChain](https://img.shields.io/badge/LangChain-JS-green?style=for-the-badge)

---

## 📋 Overview

InvestIQ AI is a full-stack web application that takes a **company name** as input, researches the company using real-time web search, and uses an AI model to provide a structured investment analysis.
<img width="1918" height="925" alt="image" src="https://github.com/user-attachments/assets/fa2df482-d22b-4ae8-a010-88b8ac7d25f6" />
<img width="1917" height="917" alt="image" src="https://github.com/user-attachments/assets/cec5ce3f-e921-4bf8-9019-2dff1a39bd38" />



**Key differentiator**: The focus is not on predicting stock prices. Instead, it explains **WHY** the AI recommends investing or passing, making it educational and transparent.

### What the AI Analyzes

| Category | Description |
|---|---|
| Business Overview | Company description and what they do |
| Financial Health | Revenue, profitability, and financial stability |
| Growth Potential | Revenue growth trends and expansion opportunities |
| Market Position | Competitive advantage and market share |
| Innovation | R&D, patents, and technological advancement |
| Recent News | Latest developments and events |
| Risks | Potential threats to the investment |
| Opportunities | Potential upsides and growth catalysts |

### What You Get

- ✅ **INVEST or PASS** recommendation
- 📊 **Overall Score** (0-100)
- 🎯 **Confidence Score** (0-100%)
- ⚠️ **Risk Level** (Low / Medium / High)
- 👍 **Pros** — Key strengths
- 👎 **Cons** — Key weaknesses
- 📝 **Detailed Reasoning**
- 🧒 **Beginner-Friendly Explanation** ("Explain Like I'm 15")

---

## 🚀 How to Run It

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/Hansh07/AI-Investment-Research-Agent.git
cd AI-Investment-Research-Agent
```

### 2. Set Up Environment Variables
Create a `.env` file inside the `server/` directory:
```bash
cp .env.example server/.env
```

Edit `server/.env` and add your API keys:
```
GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
PORT=5000
```

**Where to get API keys:**
- **Groq**: Sign up at [console.groq.com](https://console.groq.com) (free tier available)
- **Tavily**: Sign up at [tavily.com](https://tavily.com) (free tier: 1000 searches/month)
- **Alpha Vantage**: Get a free API key at [alphavantage.co](https://www.alphavantage.co/support/#api-key) (free tier: 25 requests/day)

### 3. Install Dependencies
```bash
# Install root concurrency dependencies
npm install

# Install backend dependencies
cd server && npm install --legacy-peer-deps

# Install frontend dependencies
cd ../client && npm install
```

### 4. Run the Application
You can now start both the frontend Vite development server and backend Express server concurrently with a single command from the root directory:
```bash
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000 (proxied through the client on port 5173 to prevent CORS blocks)

---

## ⚡ Deployed & Ready: Verifying Real-Time Stock Data

We added real-time financial fundamentals from **Alpha Vantage** directly alongside the AI research agent:
* **Interactive Stock Quote Card**: Displays live stock prices, daily change %, Market Cap, P/E Ratio, EPS, Volume, Beta, and Dividend Yield.
* **Auto Ticker Disambiguation**: Uses Alpha Vantage `SYMBOL_SEARCH` to resolve search shorthand (e.g. "TCS" correctly pulls the Indian ticker `TCS.BSE` instead of the US company `TCS` - The Container Store).
* **Multi-Currency UI**: Automatic detection of currency symbols (e.g., `₹` for Indian stocks, `$` for US stocks).
* **Robust JSON Auto-Repair**: Intercepts and corrects common LLM output formatting errors (unescaped quotes, trailing commas) with automatic retry functionality.
* **Smart Caching Layer**: Uses an in-memory caching mechanism (10-minute TTL) to store resolved ticker metrics, preventing rate-limiting on the free tier.

---

## 🧠 How It Works (Approach & Architecture)

```
User Input (Company Name)
        │
        ▼
┌─────────────────────────────────────────┐
│              React Frontend              │
│  (Vite + Tailwind CSS + Framer Motion)  │
│                                          │
│  Landing Page ──► Analyze Page           │
│                   │                      │
│                   ▼                      │
│  POST /api/analyze ──► Loading UX        │
│                        │                 │
│                        ▼                 │
│              Analysis Dashboard          │
│  ┌──────┐ ┌───────┐ ┌──────┐ ┌───────┐ │
│  │Scores│ │Charts │ │Pros/ │ │Report │ │
│  │      │ │Radar  │ │Cons  │ │Actions│ │
│  └──────┘ └───────┘ └──────┘ └───────┘ │
└──────────────────┬──────────────────────┘
                   │ HTTP POST
                   ▼
┌─────────────────────────────────────────┐
│            Express Backend               │
│                                          │
│  Route ──► Controller ──► Service        │
│                            │             │
│               ┌────────────┼──────────┐  │
│               ▼            ▼          │  │
│         ┌──────────┐ ┌──────────────┐ │  │
│         │  Tavily   │ │  LangChain   │ │  │
│         │  Search   │ │    Chain     │ │  │
│         │  (3 queries│ │  (Prompt +   │ │  │
│         │   parallel)│ │   Groq LLM)  │ │  │
│         └──────────┘ └──────────────┘ │  │
│               │            │          │  │
│               └────────────┘──────────┘  │
│                        │                 │
│                        ▼                 │
│              Validated JSON Output       │
└─────────────────────────────────────────┘
```

The application uses a modular service-oriented architecture:

1. **Client-Side Requests**: The user inputs a company name. The React application triggers a multi-step loading experience while sending an asynchronous POST request to the Express backend.
2. **Real-time Research**: The backend's `searchService` uses **Tavily Search API** to fetch the latest company information. It executes **three concurrent searches** to gather separate details for financial performance, recent news/developments, and market position.
3. **Structured Context Injection**: The raw results are compiled into formatted text context.
4. **LangChain LLM Chain**: We construct a LangChain pipeline using a customized `SystemMessage` containing the persona, instructions, and target output schema, followed by a `HumanMessage` with the search context. The chain sends the messages to Groq's high-speed inference API running `llama-3.3-70b-versatile`.
5. **Robust Parsing and Sanitization**: The response is captured, JSON content is extracted, and it passes through a validation layer that clamps scores to `[0, 100]`, normalizes recommendations to `[INVEST, PASS]`, and supplies fallback values for missing keys to ensure absolute frontend stability.

---

## 🔑 Key Decisions & Trade-offs

During development, we made several conscious engineering choices:

### 1. Chain-of-Thought Prompting vs. Autonomous Agent Loop
- **Decision**: Used a sequential prompt-stuffing chain (Search -> Context -> LLM Generation) rather than a fully autonomous ReAct agent loop.
- **Why**: ReAct agents can loop indefinitely, hallucinate search queries, consume high numbers of API tokens, and take upwards of a minute to complete. A deterministic search-then-generate chain is highly reliable, consistently fast (< 3 seconds on Groq), and returns exactly the structured JSON schema required.

### 2. Multi-Query Parallelized Search vs. Single Search Query
- **Decision**: Structured three separate search queries (Financials, News, Market position) executed in parallel using `Promise.all`.
- **Why**: A single query like "Tesla overview 2025" often misses critical details. By splitting the queries, we ensure rich coverage of financial health, competitor comparisons, and latest press releases, while keeping search execution time minimal.

### 3. Client-Side State with LocalStorage vs. Remote Database
- **Decision**: Stored search history entirely in client-side LocalStorage.
- **Why**: Keeping the backend completely stateless simplifies local deployment and reduces architecture complexity for review, while still offering users persistent search history, recent results, and light/dark theme settings.

---

## 📈 Example Runs

Here are raw samples of the structured outputs returned by the AI Investment Agent for different company inputs:

### Run 1: Tesla (INVEST)
```json
{
  "company": "Tesla",
  "recommendation": "INVEST",
  "overallScore": 82,
  "confidence": 90,
  "risk": "Medium",
  "financialHealth": 85,
  "growth": 80,
  "marketPosition": 70,
  "innovation": 95,
  "summary": "Tesla is a leading electric vehicle manufacturer with a strong brand and innovative products, but faces increasing competition in the market.",
  "pros": [
    "Strong brand and market position",
    "Innovative products and technology",
    "Growing demand for electric vehicles",
    "Vertical integration in the supply chain"
  ],
  "cons": [
    "Increasing competition in the market",
    "Delays in launching and manufacturing new products",
    "Dependence on government subsidies"
  ],
  "news": [
    "Tesla plans to start production of a new mass market electric vehicle in mid-2025",
    "Tesla's U.S. market share dropped to a near eight-year low in August"
  ],
  "explanation": "Tesla's strong brand, technological leadership in batteries and software, and high-quality charging network make it a compelling investment. While competitive pressures are rising from legacy automakers and Chinese brands, its market position remains highly resilient.",
  "beginnerExplanation": "Think of Tesla as the biggest kid on the block making electric cars. Lots of people want their cars, but now other kids are starting to build electric cars too. Tesla is still the leader because they are super smart with technology, but they have to work hard to stay ahead."
}
```

---

## ⏳ What We Would Improve with More Time

If we had more time, we would implement the following production-grade enhancements:

1. **Iterative Search Refinement (LangGraph)**: Re-architect the backend using **LangGraph** to construct a stateful graph. If the initial Tavily search returns low-confidence or sparse financial numbers, the agent would enter a loop to execute follow-up queries until a set threshold is met.
2. **Multi-Agent Debates**: Spawn two concurrent LLM agents: a "Bull Analyst" and a "Bear Analyst." The agents would debate the merits of the company, and a third "Synthesizer Agent" would weigh their arguments to make the final recommendation.
3. **Advanced Database Layer**: Transition from client-side LocalStorage to a persistent database (PostgreSQL/Prisma) to enable social elements, like trending analysis score sheets or user watchlists.

---

## 🌐 Deployment Guide (Render + Vercel)

The codebase is fully environment-aware and optimized for direct cloud deployment.

### 1. Deploy the Backend to Render (or Heroku/Railway)
1. Sign up on [Render.com](https://render.com) and create a new **Web Service**.
2. Connect your GitHub repository.
3. Set the **Root Directory** to `server`.
4. Configure the following environment variables:
   * `GROQ_API_KEY`: *[Your Groq key]*
   * `TAVILY_API_KEY`: *[Your Tavily key]*
   * `ALPHA_VANTAGE_API_KEY`: *[Your Alpha Vantage key]*
   * `CLIENT_URL`: `https://your-frontend-app.vercel.app` *(Optional: restricts CORS to your frontend URL)*
5. Render will automatically install dependencies and start the app using `npm start`.

### 2. Deploy the Frontend to Vercel
1. Sign up on [Vercel.com](https://vercel.com) and select **Add New Project**.
2. Connect your GitHub repository.
3. Set the **Root Directory** to `client`.
4. Configure the following environment variable in the Vercel dashboard:
   * `VITE_API_URL`: `https://your-backend-service.onrender.com/api` *(Your Render backend API URL)*
5. Click **Deploy**. Vercel will automatically build the static Vite application.

---

## 💬 LLM Chat Session Transcript/Logs (BONUS)

Per the assignment guidelines, the full, interactive chat transcript detailing the collaborative build process with the AI is attached.
You can find the logs at the root of the project:
📄 **[chat_transcript.md](file:///c:/Users/Hansh Raj/OneDrive/Desktop/Ai Investment/chat_transcript.md)**

---

## 🛠️ Tech Stack & Details

### Frontend
- **React 19 & Vite** (Build system)
- **Tailwind CSS 3** (Theme configurations & utility layout)
- **Framer Motion** (Spring-physics micro-interactions & multi-step loader animations)
- **Recharts** (Visualizing performance radar & bar chart distributions)
- **jsPDF** (Client-side vector PDF report layout generation)

### Backend
- **Node.js & Express** (Server framework)
- **LangChain.js** (Standard abstraction for prompts, LLM invocations)
- **Groq API** (`llama-3.3-70b-versatile` running at 500+ tokens/sec)
- **Tavily Search API** (Targeted developer web search engine)

---

## ⚠️ Disclaimer

This project is for **educational purposes only**. It should not be used as actual financial advice. Always consult with qualified financial professionals before making investment decisions.

---

Built with ❤️ using AI • React • Node.js • LangChain
