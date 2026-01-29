# FINANCIAL_SECTOR_ANALYSIS

An interactive D3.js visualization dashboard for exploring financial metrics across the top 20 U.S. stocks by market capitalization, powered by real-time AWS data orchestration and deployed on Railway.

---

## What It Does

Explore the 20 largest U.S. stocks with:
- **Dynamic scatter plots** - Visualize relationships between key financial metrics
- **Market cap rankings** - Side-by-side bar chart showing company sizes
- **Preset metric combinations** - 8 curated views highlighting different investment strategies
- **Interactive tooltips** - Hover to see detailed stock information
- **Cross-chart highlighting** - Linked interactions between scatter plot and bar chart
- **Daily data updates** - Automated refresh via AWS Lambda

---

## Features

- **8 Preset Metric Views** - Pre-configured combinations for common financial analyses
- **Real-time Chart Updates** - Smooth transitions when switching between metrics
- **Sector Color Coding** - Visual grouping by industry sector
- **Responsive Design** - Adapts to desktop and mobile viewports
- **Smart Data Filtering** - Automatically excludes stocks with missing data
- **Dynamic Scaling** - Auto-adjusts axes based on data ranges with padding
- **Cloud-Powered Data** - Pulls fresh financial data daily from AWS S3
- **Railway Deployment** - Instant global access with zero-downtime updates

---

## Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Local Development
```bash
# Clone the repository
git clone https://github.com/imoore99/FINANCIAL_SECTOR_ANALYSIS.git
cd FINANCIAL_SECTOR_ANALYSIS

# Option 1: Use Python's built-in server
python -m http.server 8000

# Option 2: Use Node.js http-server
npx http-server
```

Open http://localhost:8000 in your browser.

---

## How to Use

1. **Select a Metric Preset**
   - Use the dropdown menu to choose from 8 analysis views
   - Each preset highlights different investment strategies

2. **Explore the Scatter Plot**
   - X-axis and Y-axis show selected metrics
   - Circle size represents the third metric dimension
   - Colors indicate sector groupings

3. **Interact with Visualizations**
   - Hover over circles to see stock details in the legend
   - Hover over bar chart to highlight corresponding stock
   - Cross-chart interactions link both visualizations

4. **Interpret Patterns**
   - Read the dynamic description below the dropdown
   - Identify outliers, clusters, and sector trends
   - Compare market cap rankings alongside metric performance

---

## Architecture

```
┌─────────────────────────────────────────────┐
│      AWS Lambda (Python + yfinance)         │
│  - Fetches top 20 stocks by market cap      │
│  - Pulls 20+ financial metrics per stock    │
│  - Runs daily via EventBridge schedule      │
│  - Outputs JSON to S3 bucket                │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│       AWS S3 Bucket (Public JSON)           │
│  - Stores stock_data.json                   │
│  - Public read access via HTTPS             │
│  - Updated daily with fresh data            │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│         Railway Deployment                  │
│  - Serves static HTML/CSS/JS                │
│  - Auto-deploys from GitHub main branch     │
│  - Global CDN for fast loading              │
│  - HTTPS enabled by default                 │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│          Frontend (index.html)              │
│  - Fetches JSON from S3 on page load        │
│  - D3.js renders interactive charts         │
│  - Responsive design adapts to viewport     │
└─────────────────────────────────────────────┘
```

**Key Design Patterns:**
- **Serverless Data Pipeline** - Lambda function eliminates manual data updates
- **Static Site Deployment** - Railway serves frontend with instant global access
- **JAMstack Architecture** - JavaScript, APIs (S3), and Markup
- **D3.js Enter/Update/Exit** - Efficient DOM manipulation for data changes
- **Data Joins** - Consistent stock identification via ticker keys
- **Scale Domains** - Dynamic padding (±10-20%) to prevent edge clipping
- **Linked Interactions** - Bi-directional highlighting between charts
- **Responsive SVG** - ViewBox scaling for device compatibility

---

## Tech Stack

### **Frontend**
| Component | Technology |
|-----------|------------|
| Visualization | D3.js v7 |
| JavaScript | Vanilla JavaScript (ES6+) |
| Styling | CSS3 with CSS Variables |
| Layout | Flexbox with responsive breakpoints |
| Typography | Work Sans (Google Fonts) |

### **Backend (AWS)**
| Component | Technology |
|-----------|------------|
| Orchestration | AWS Lambda (Python 3.x) |
| Data Source | yfinance API |
| Storage | AWS S3 (public bucket) |
| Scheduling | AWS EventBridge |
| Data Format | JSON |

### **Deployment**
| Component | Technology |
|-----------|------------|
| Hosting | Railway |
| CI/CD | GitHub integration (auto-deploy on push) |
| Domain | Railway-provided subdomain |
| CDN | Railway global edge network |

---

## Data Pipeline Details

### **AWS Lambda Function**
- **Runtime:** Python 3.x
- **Trigger:** EventBridge daily schedule
- **Dependencies:** yfinance, pandas, boto3
- **Process:**
  1. Fetch current top 20 stocks by market cap
  2. Pull 20+ financial metrics per stock using yfinance
  3. Transform data to JSON format
  4. Upload to S3 bucket with public read access

### **Financial Metrics Collected**
- **Company Info** - Ticker, name, sector
- **Valuation Metrics** - P/E, P/B, P/S, PEG ratios
- **Profitability** - ROE, ROA, profit margin, operating margin
- **Growth** - Revenue growth, EPS growth
- **Financial Health** - Debt-to-equity, current ratio, free cash flow
- **Dividends** - Yield, payout ratio
- **Risk** - Beta coefficient
- **Size** - Market capitalization

---

## Deployment (Railway)

### **Initial Setup**
```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# Connect to Railway
# 1. Visit https://railway.app
# 2. Sign in with GitHub
# 3. "New Project" → "Deploy from GitHub repo"
# 4. Select FINANCIAL_SECTOR_ANALYSIS
# 5. Railway auto-detects static site
```

### **Auto-Deployment**
- **Trigger:** Push to `main` branch
- **Build Time:** ~30 seconds
- **Zero Downtime:** Rolling deployments
- **Custom Domain:** Available in Railway settings

### **Environment**
- Static site hosting (no server required)
- HTTPS enabled automatically
- Global CDN for fast load times
- No build step needed (pure HTML/CSS/JS)


## AWS Setup (For Reproduction)

### **Lambda Function Requirements**
```python
# Lambda layer dependencies
yfinance>=0.2.0
pandas>=2.0.0
boto3>=1.28.0
```


### **EventBridge Schedule**
- **Rate:** Daily at 7 PM EST (after market close)
- **Target:** Lambda function ARN

## Testing

**Recommended exploration path:**
1. Start with "Value vs Growth" to identify investment opportunities
2. Switch to "Risk Assessment" to evaluate portfolio balance
3. Try "Profitability Analysis" to find efficient operators
4. Hover over outliers to investigate unusual metrics

**Known edge cases:**
- Negative P/E ratios (losses) appear on left side of chart
- Very large market caps dominate bar chart
- Some stocks missing specific metrics (auto-filtered)
- Top 20 composition changes daily

---

### LIVE PROJECT:
- **View Interactive Dashboard** → [Your Railway URL]
- Explore the complete project with live AWS data updates

### CONTACT:

Ian Moore - Business Intelligence, Credit Risk and Financial Analytics Leader

📧 EMAIL: ian.moore@hey.com

💼 LinkedIn: https://www.linkedin.com/in/ian-moore-analytics/

🌐 Portfolio: https://www.ianmooreanalytics.com

---

**⚠️ Note:** This is a learning project demonstrating full-stack development from AWS serverless architecture to D3.js visualization and Railway deployment. 