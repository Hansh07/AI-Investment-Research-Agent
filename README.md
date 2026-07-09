# 🤖 InvestIQ AI — AI Investment Research Agent

> An AI-powered investment research platform that analyzes companies using real-time web search and Large Language Models, delivering professional investment recommendations with confidence scoring.

![InvestIQ AI](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge) ![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white) ![LangChain](https://img.shields.io/badge/LangChain-JS-green?style=for-the-badge)

---

## 📋 Overview

InvestIQ AI is a full-stack web application that takes a **company name** as input, researches the company using real-time web search, and uses an AI model to provide a structured investment analysis.

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

## 🏗️ Architecture

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

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite** | Build tool and dev server |
| **Tailwind CSS 3** | Utility-first styling |
| **Framer Motion** | Animations and transitions |
| **React Router v7** | Client-side routing |
| **Recharts** | Data visualization (charts) |
| **React Icons** | Icon library |
| **Axios** | HTTP client |
| **jsPDF** | PDF report generation |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express** | Web framework |
| **LangChain.js** | AI/LLM orchestration |
| **Groq API** | Ultra-fast LLM inference (Llama 3 70B) |
| **Tavily Search** | Real-time web search |
| **express-rate-limit** | API rate limiting |

---

## 📁 Project Structure

```
investiq-ai/
├── .env.example              # Environment variable template
├── .gitignore
├── README.md
│
├── server/                   # Backend
│   ├── package.json
│   ├── index.js              # Express server entry point
│   ├── routes/
│   │   └── analyzeRoutes.js  # API route definitions
│   ├── controllers/
│   │   └── analyzeController.js  # Request handling logic
│   ├── services/
│   │   ├── analysisService.js    # Orchestrates the analysis pipeline
│   │   └── searchService.js      # Tavily search integration
│   ├── chains/
│   │   └── investmentChain.js    # LangChain + Groq LLM chain
│   ├── prompts/
│   │   └── investmentPrompt.js   # System prompt template
│   ├── middleware/
│   │   ├── errorHandler.js       # Global error handling
│   │   └── rateLimiter.js        # Rate limiting (10 req/min)
│   └── utils/
│       └── validator.js          # Input/output validation
│
└── client/                   # Frontend
    ├── package.json
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx              # React entry point
        ├── App.jsx               # Root component + routing
        ├── index.css             # Global styles + Tailwind
        ├── context/
        │   └── ThemeContext.jsx   # Dark/light mode provider
        ├── hooks/
        │   ├── useAnalysis.js    # Analysis API state management
        │   ├── useSearchHistory.js # localStorage search history
        │   └── useTheme.js       # Theme context hook
        ├── services/
        │   └── api.js            # Axios API client
        ├── utils/
        │   ├── formatters.js     # Display formatting helpers
        │   └── pdfGenerator.js   # PDF report generation
        ├── pages/
        │   ├── LandingPage.jsx   # Marketing landing page
        │   └── AnalyzePage.jsx   # Main analysis page
        └── components/
            ├── Navbar.jsx            # Glass navigation bar
            ├── Footer.jsx            # Page footer
            ├── ThemeToggle.jsx       # Dark/light switch
            ├── AnimatedCounter.jsx   # Number animation
            ├── ErrorState.jsx        # Error display + retry
            ├── HeroSection.jsx       # Landing hero
            ├── FeatureCards.jsx      # Feature grid
            ├── HowItWorks.jsx        # Timeline steps
            ├── DashboardPreview.jsx  # Mock dashboard
            ├── SearchBar.jsx         # Company input
            ├── LoadingExperience.jsx # Loading animation
            ├── SearchHistory.jsx     # History sidebar
            ├── AnalysisDashboard.jsx # Dashboard container
            ├── RecommendationCard.jsx # INVEST/PASS card
            ├── ScoreCard.jsx         # Overall score gauge
            ├── RiskMeter.jsx         # Risk level indicator
            ├── ConfidenceMeter.jsx   # Confidence gauge
            ├── CompanySummary.jsx    # Company overview
            ├── ProsCons.jsx          # Pros & cons list
            ├── NewsTimeline.jsx      # News events
            ├── ExplanationCard.jsx   # AI reasoning
            ├── ScoreCharts.jsx       # Recharts visualizations
            └── ReportActions.jsx     # Copy/PDF/Share
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher

### 1. Clone the Repository
```bash
git clone <repository-url>
cd investiq-ai
```

### 2. Set Up Environment Variables
```bash
cp .env.example server/.env
```

Edit `server/.env` and add your API keys:
```
GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
PORT=5000
```

**Where to get API keys:**
- **Groq**: Sign up at [console.groq.com](https://console.groq.com) (free tier available)
- **Tavily**: Sign up at [tavily.com](https://tavily.com) (free tier: 1000 searches/month)

### 3. Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 4. Run the Application
Open two terminal windows:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 🧠 How LangChain Works in This Project

**LangChain** is a framework for building applications with LLMs. In InvestIQ AI, we use a simple chain:

```
Prompt Template → ChatGroq Model → JSON Output
```

### The Flow:
1. **Prompt Template** (`server/prompts/investmentPrompt.js`): Defines the system prompt that instructs the AI to act as a Senior Investment Analyst and return structured JSON.

2. **ChatGroq Model** (`server/chains/investmentChain.js`): Uses LangChain's `ChatGroq` class to send messages to Groq's API, which runs Llama 3 70B at ultra-fast speeds.

3. **Messages**: LangChain uses a message-based format:
   - `SystemMessage` — The analyst persona and JSON schema
   - `HumanMessage` — The company name + search results

4. **Output Parsing**: The raw LLM text is parsed into JSON, with fallback handling for markdown code blocks.

### Why LangChain Instead of Direct API Calls?
- **Abstraction**: Easy to swap Groq for OpenAI, Anthropic, etc.
- **Message formatting**: Handles chat message types automatically
- **Community tools**: Tavily search integration comes built-in
- **Industry standard**: Widely used in production AI applications

---

## ⚡ How Groq Works

**Groq** provides ultra-fast LLM inference using custom hardware (LPUs — Language Processing Units).

- **Model Used**: `llama-3.3-70b-versatile` (Meta's Llama 3 70B parameter model)
- **Speed**: Groq can generate ~500 tokens/second (vs ~50 for typical GPU providers)
- **Temperature**: Set to 0.3 for focused, consistent outputs
- **Max Tokens**: 4096 (enough for our detailed JSON response)

### Why Groq?
1. **Free tier** available for development
2. **Extremely fast** inference (great for user experience)
3. **Supports Llama 3** which is excellent for structured output tasks
4. **Simple API** that works great with LangChain

---

## 📡 API Documentation

### `POST /api/analyze`

Analyzes a company for investment potential.

**Request:**
```json
{
  "company": "Apple"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "company": "Apple",
    "recommendation": "INVEST",
    "overallScore": 89,
    "confidence": 87,
    "risk": "Low",
    "financialHealth": 92,
    "growth": 78,
    "marketPosition": 95,
    "innovation": 88,
    "summary": "Apple Inc. is a...",
    "pros": ["Strong brand loyalty", "..."],
    "cons": ["High product prices", "..."],
    "news": ["Apple announced...", "..."],
    "explanation": "Apple represents a...",
    "beginnerExplanation": "Imagine Apple as..."
  },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### `GET /api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "InvestIQ AI server is running"
}
```

---

## ✨ Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | AI Analysis | LLM-powered company analysis with structured output |
| 2 | Real-Time Search | Tavily API searches for latest company data |
| 3 | Investment Scoring | Multi-dimensional 0-100 scoring system |
| 4 | Risk Detection | Low/Medium/High risk classification |
| 5 | Confidence Score | Data quality-based confidence rating |
| 6 | Explain Like I'm 15 | Toggle between expert and beginner explanations |
| 7 | Interactive Charts | Radar and bar charts via Recharts |
| 8 | Copy Report | One-click formatted report to clipboard |
| 9 | Download PDF | Professional PDF report via jsPDF |
| 10 | Share Report | Web Share API with clipboard fallback |
| 11 | Search History | localStorage-persisted recent searches |
| 12 | Dark/Light Mode | Theme toggle with persistence |
| 13 | Animated Counters | Smooth number counting animations |
| 14 | Loading Experience | 5-step progress animation while AI works |
| 15 | Responsive Design | Mobile-first, works on all screen sizes |

---

## 🚀 Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import project in Vercel
3. Set root directory to `client`
4. Build command: `npm run build`
5. Output directory: `dist`

### Backend (Render)
1. Push to GitHub
2. Create a new Web Service in Render
3. Set root directory to `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables (`GROQ_API_KEY`, `TAVILY_API_KEY`)

> **Note**: Update the API base URL in `client/src/services/api.js` to your Render URL.

---

## 🔮 Future Improvements

- [ ] Compare multiple companies side-by-side
- [ ] Historical analysis tracking with charts over time
- [ ] User authentication for saved portfolios
- [ ] WebSocket for real-time streaming analysis
- [ ] More LLM providers (OpenAI, Anthropic)
- [ ] Technical analysis with stock price charts
- [ ] Sector-based analysis and industry comparison
- [ ] Email report delivery

---

## ⚠️ Disclaimer

This project is for **educational purposes only**. It should not be used as actual financial advice. Always consult with qualified financial professionals before making investment decisions.

---

## 📄 License

MIT License — feel free to use this project for learning and portfolio purposes.

---

Built with ❤️ using AI • React • Node.js • LangChain
