const sectorColors = {
  'Technology': '#002f61',              // Your highlight - deep navy
  'Communication Services': '#0066cc',  // Bright blue
  'Financial Services': '#2d5f3f',      // Forest green
  'Healthcare': '#8b1538',              // Deep red/burgundy
  'Consumer Cyclical': '#d97706',       // Amber/orange
  'Consumer Defensive': '#7c3aed',      // Purple
  'Energy': '#059669'                   // Emerald green
};


// Initial metric combinations and sort
const metricPresets = [{

  'value-vs-growth': {
    name: 'Value vs. Growth',
    x: {
      field: 'pe_ratio',
      label: 'P/E Ratio',
      format: d => d.toFixed(1)
    },
    y: {
      field: 'rev_growth',
      label: 'Revenue Growth (%)',
      format: d => d.toFixed(1) + '%'
    },
    r: {
      field: 'market_cap',
      label: 'Market Cap',
      scale: d3.scaleSqrt().range([5, 50]), // Bubble size range
      format: d => `$${(d / 1e12).toFixed(2)}T`
    },
    color: {
      field: 'sector',
      type: 'categorical'
    },
    description: 'Identifies undervalued growth opportunities. Companies in the upper-left quadrant offer strong growth at reasonable valuations, while those in the lower-right show premium pricing with slower expansion.'
  },
  
  'risk-return': {
    name: 'Risk vs. Return',
    x: {
      field: 'beta',
      label: 'Beta (Volatility)',
      format: d => d.toFixed(2)
    },
    y: {
      field: 'one_year_return',
      label: '1-Year Return (%)',
      format: d => d.toFixed(1) + '%'
    },
    r: {
      field: 'market_cap',
      label: 'Market Cap',
      scale: d3.scaleSqrt().range([5, 50]),
      format: d => `$${(d / 1e12).toFixed(2)}T`
    },
    color: {
      field: 'sector',
      type: 'categorical'
    },
    description: 'Evaluates risk-adjusted performance. Upper-left stocks deliver strong returns with lower volatility, while upper-right shows high returns at the cost of increased market risk.'
  },
  
  'profitability-efficiency': {
    name: 'Profitability vs. Efficiency',
    x: {
      field: 'roe',
      label: 'Return on Equity (%)',
      format: d => d.toFixed(1) + '%'
    },
    y: {
      field: 'profit_margin',
      label: 'Net Margin (%)',
      format: d => d.toFixed(1) + '%'
    },
    r: {
      field: 'market_cap',
      label: 'Market Cap',
      scale: d3.scaleSqrt().range([5, 50]),
      format: d => `$${(d / 1e12).toFixed(2)}T`
    },
    color: {
      field: 'sector',
      type: 'categorical'
    },
    description: 'Separates operational excellence from capital efficiency. High-margin tech companies cluster in the upper-right, while capital-intensive businesses show strong ROE with thinner margins.'
  },
  
  'quality-valuation': {
    name: 'Quality vs. Valuation',
    x: {
      field: 'pb_ratio',
      label: 'Price-to-Book Ratio',
      format: d => d.toFixed(1)
    },
    y: {
      field: 'roe',
      label: 'Return on Equity (%)',
      format: d => d.toFixed(1) + '%'
    },
    r: {
      field: 'market_cap',
      label: 'Market Cap',
      scale: d3.scaleSqrt().range([5, 50]),
      format: d => `$${(d / 1e12).toFixed(2)}T`
    },
    color: {
      field: 'sector',
      type: 'categorical'
    },
    description: 'Classic Buffett-style analysis finding quality at reasonable prices. Upper-left stocks generate strong returns on equity without excessive valuation premiums.'
  },
  
  'growth-efficiency': {
    name: 'Growth Efficiency',
    x: {
      field: 'ps_ratio',
      label: 'Price-to-Sales Ratio',
      format: d => d.toFixed(1)
    },
    y: {
      field: 'rev_growth',
      label: 'Revenue Growth (%)',
      format: d => d.toFixed(1) + '%'
    },
    r: {
      field: 'market_cap',
      label: 'Market Cap',
      scale: d3.scaleSqrt().range([5, 50]),
      format: d => `$${(d / 1e12).toFixed(2)}T`
    },
    color: {
      field: 'sector',
      type: 'categorical'
    },
    description: 'Evaluates how efficiently companies convert revenue into market value. Upper-left shows rapid growth without excessive valuation multiples—the sweet spot for growth investors.'
  },
  
  'leverage-coverage': {
    name: 'Leverage vs. Coverage',
    x: {
      field: 'debt_to_equity',
      label: 'Debt-to-Equity Ratio',
      format: d => d.toFixed(2)
    },
    y: {
      field: 'interest_coverage',
      label: 'Interest Coverage Ratio',
      format: d => d.toFixed(1) + 'x'
    },
    r: {
      field: 'market_cap',
      label: 'Market Cap',
      scale: d3.scaleSqrt().range([5, 50]),
      format: d => `$${(d / 1e12).toFixed(2)}T`
    },
    color: {
      field: 'sector',
      type: 'categorical'
    },
    description: 'Assesses financial stability and credit risk. Companies in the upper-left maintain conservative balance sheets with strong debt servicing capacity, while lower-right positions indicate potential stress.'
  },
  
  'momentum-value': {
    name: 'Momentum vs. Value',
    x: {
      field: 'pe_ratio',
      label: 'P/E Ratio',
      format: d => d.toFixed(1)
    },
    y: {
      field: 'six_month_return',
      label: '6-Month Return (%)',
      format: d => d.toFixed(1) + '%'
    },
    r: {
      field: 'market_cap',
      label: 'Market Cap',
      scale: d3.scaleSqrt().range([5, 50]),
      format: d => `$${(d / 1e12).toFixed(2)}T`
    },
    color: {
      field: 'sector',
      type: 'categorical'
    },
    description: 'Contrasts recent momentum with valuation discipline. Upper-left represents strong performance at reasonable prices, while upper-right shows momentum trades at premium valuations.'
  }
}];