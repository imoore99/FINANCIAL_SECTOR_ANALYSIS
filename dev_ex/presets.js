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
      field: 'revenue_growth',
      label: 'Revenue Growth (%)',
      format: d => d.toFixed(1) + '%'
    },
    r: {
      field: 'marketCap',
      label: 'Market Cap',
      scale: d3.scaleSqrt().range([5, 50]), // Bubble size range
      format: d => `$${(d / 1e12).toFixed(2)}T`
    },
    color: {
      field: 'sector',
      type: 'categorical'
    },
    description: 'Identifies undervalued growth stocks'
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
      field: 'marketCap',
      label: 'Market Cap',
      scale: d3.scaleSqrt().range([5, 50]),
      format: d => `$${(d / 1e12).toFixed(2)}T`
    },
    color: {
      field: 'sector',
      type: 'categorical'
    },
    description: 'Shows volatility vs. performance'
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
      field: 'marketCap',
      label: 'Market Cap',
      scale: d3.scaleSqrt().range([5, 50]),
      format: d => `$${(d / 1e12).toFixed(2)}T`
    },
    color: {
      field: 'sector',
      type: 'categorical'
    },
    description: 'Separates high-margin tech from capital-intensive businesses'
  }
  
  // Need to add remaining presets after test...
}];