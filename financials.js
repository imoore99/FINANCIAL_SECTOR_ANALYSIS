const svg = d3.select("svg.chart")

svg
    .attr("viewBox", "0 0 900 900")
    .attr("preserveAspectRatio", "xMidYMid meet")

// Initialize chart axes and labels
const axisXGroup = svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0, 800)")

const axisYGroup = svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(100, 0)")

const axisXText = svg
    .append("text")
    .attr("class", "x-axis")
    .attr("transform", "translate(420, 860)")

const axisYText = svg
    .append("text")
    .attr("class", "y-axis")
    .attr("transform", "translate(25, 360) rotate(-90)")

const legendSvg = d3.select("svg.legend")
    .attr("viewBox", "0 0 280 120")

const stockData = function() {
    // Get selected metric preset from dropdown
    const input = document.querySelector("select[name=metricPreset]")
    const valueSelect = input.value
    const metricSelect = metricPresets[0][valueSelect]
    
    // Extract field names and labels for current metrics
    const inputFieldX = metricSelect.x.field
    const inputFieldY = metricSelect.y.field
    const inputFieldR = metricSelect.r.field

    const inputLabelX = metricSelect.x.label
    const inputLabelY = metricSelect.y.label
    const inputLabelR = metricSelect.r.label

    const axisFormatX = metricSelect.x.format
    const axisFormatY = metricSelect.y.format
    const axisFormatR = metricSelect.r.format

    // Filter stocks with valid (non-null, numeric) values for all three metrics
    const validData = stock_data.filter(d => {
        const xVal = d[inputFieldX];
        const yVal = d[inputFieldY];
        const rVal = d[inputFieldR];

        return xVal != null && !isNaN(xVal) &&
            yVal != null && !isNaN(yVal) &&
            rVal != null && !isNaN(rVal);
    });

    // Update axis labels and description
    axisXText.text(inputLabelX)
    axisYText.text(inputLabelY)

    const selectDescription = document.querySelector("#presetDescription")
    selectDescription.innerHTML = metricSelect.description

    // Calculate min/max values for scaling
    const maxValueX = d3.max(validData, d => d[inputFieldX])
    const maxValueY = d3.max(validData, d => d[inputFieldY])
    const maxValueR = d3.max(validData, d => d[inputFieldR])

    const minValueX = d3.min(validData, d => d[inputFieldX])
    const minValueY = d3.min(validData, d => d[inputFieldY])
    const minValueR = d3.min(validData, d => d[inputFieldR])

    // Create scales with padding to prevent edge clipping
    const scaleX = d3.scaleLinear()
        .domain([
            minValueX < 0 ? minValueX * 1.1 : minValueX * 0.8,
            maxValueX < 0 ? maxValueX * 0.8 : maxValueX * 1.1
        ])
        .range([100, 900])

    const scaleY = d3.scaleLinear()
        .domain([
            minValueY < 0 ? minValueY * 1.1 : minValueY * 0.8,
            maxValueY < 0 ? maxValueY * 0.8 : maxValueY * 1.1
        ])
        .range([800, 0])

    const scaleR = d3.scaleSqrt()
        .domain([minValueR * 0.8, maxValueR * 1.1])
        .range([0, 40])

    // Create and render X axis
    const axisX = d3.axisBottom(scaleX)
        .tickSizeInner(-800)
        .tickSizeOuter(0)
        .tickPadding(10)
        .ticks(10)
        .tickFormat(axisFormatX)
    
    axisXGroup.call(axisX)
    axisXGroup.selectAll(".tick text").style("font-size", "14px")

    // Create and render Y axis
    const axisY = d3.axisLeft(scaleY)
        .tickSizeInner(-800)
        .tickSizeOuter(0)
        .tickPadding(10)
        .ticks(10)
        .tickFormat(d => {
            if (d == null || isNaN(d)) return '';
            return axisFormatY(d);
        })
    
    axisYGroup.call(axisY)
    axisYGroup.selectAll(".tick text").style("font-size", "14px")

    // Render scatter plot circles
    const stocks = svg
        .selectAll("g.stocks")
        .data(validData, d => d.ticker)
        .enter()
        .append("g")
        .attr("class", "stocks")
        .attr("transform", d => {
            const x = scaleX(d[inputFieldX])
            const y = scaleY(d[inputFieldY])
            return `translate(${x}, ${y})`
        })

    stocks
        .append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 0)
        .transition()
        .duration(500)
        .attr("stroke", d => sectorColors[d.sector])
        .attr("stroke-width", 5)
        .attr("r", d => scaleR(d[inputFieldR]))

    // Handle data updates (enter/update/exit pattern)
    const stockGroups = svg.selectAll("g.stocks")
        .data(validData, d => d.ticker);

    // Remove stocks no longer in filtered dataset
    stockGroups.exit()
        .transition()
        .duration(500)
        .style("opacity", 0)
        .remove();

    // Update tooltip text for remaining stocks
    stockGroups.each(function(d) {
        const group = d3.select(this);
        const texts = group.selectAll("text").nodes();
        
        d3.select(texts[1]).text(`${inputLabelX}: ${axisFormatX(d[inputFieldX])}`);
        d3.select(texts[2]).text(`${inputLabelY}: ${axisFormatY(d[inputFieldY])}`);
        d3.select(texts[3]).text(`${inputLabelR}: ${axisFormatR(d[inputFieldR])}`);
    });

    // Transition stocks to new positions
    stockGroups
        .transition()
        .duration(500)
        .attr("transform", d => {
            const x = scaleX(d[inputFieldX]);
            const y = scaleY(d[inputFieldY]);
            return `translate(${x}, ${y})`;
        });

    // Market cap bar chart
    const marketCapSvg = d3.select("svg.market-cap")
        .attr("viewBox", "0 0 280 520")
        .attr("preserveAspectRatio", "xMidYMid meet")

    const sortedData = [...validData].sort((a, b) => b.market_cap - a.market_cap)

    const barScale = d3.scaleLinear()
        .domain([0, d3.max(sortedData, d => d.market_cap)])
        .range([0, 220])

    const barHeight = 520 / sortedData.length
    const barPadding = 10

    const barGroups = marketCapSvg
        .selectAll("g")
        .data(sortedData)
        .enter()
        .append("g")
        .attr("class", "bars")
        .attr("transform", (d, i) => `translate(10, ${i * barHeight + barPadding})`)

    // Render horizontal bars with animation
    barGroups
        .append("rect")
        .attr("class", "bars")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 0)
        .attr("height", barHeight - barPadding)
        .style("fill", d => sectorColors[d.sector])
        .style("opacity", 1)
        .transition()
        .duration(500)
        .attr("width", d => barScale(d.market_cap))

    // Add ticker labels at end of bars
    barGroups
        .append("text")
        .attr("x", d => barScale(d.market_cap) + 5)
        .attr("y", (barHeight - barPadding) / 2 + 4)
        .attr("class", "bar-label")
        .attr("font-size", "12px")
        .attr("fill", "var(--primary-color)")
        .text(d => d.ticker)

    // Scatter plot hover interactions
    svg.selectAll("g.stocks")
        .on("mouseenter", function(event) {
            const d = d3.select(this).datum()

            // Display stock details in legend
            legendSvg.selectAll("text.legend")
                .data([
                    `Ticker: ${d.ticker}`,
                    `Sector: ${d.sector}`,
                    `${inputLabelX}: ${axisFormatX(d[inputFieldX])}`,
                    `${inputLabelY}: ${axisFormatY(d[inputFieldY])}`,
                    `${inputLabelR}: ${axisFormatR(d[inputFieldR])}`
                ])
                .enter()
                .append("text")
                .attr("class", "legend-item")
                .attr("x", 10)
                .attr("y", (data, i) => 20 + i * 20)
                .attr("font-size", "14px")
                .attr("font-weight", "600")
                .attr("fill", "var(--primary-color)")
                .style("opacity", 0)
                .text(data => data)
                .transition()
                .duration(300)
                .style("opacity", 1)

            // Highlight corresponding bar in market cap chart
            d3.select("svg.market-cap")
                .selectAll("rect.bars")
                .transition()
                .duration(500)
                .style("fill", (barData) => barData.ticker === d.ticker ? sectorColors[d.sector] : "#cccccc")
                .style("opacity", (barData) => barData.ticker === d.ticker ? 1 : 0.4)
                .attr("stroke", (barData) => barData.ticker === d.ticker ? sectorColors[d.sector] : "none")
                .attr("stroke-width", (barData) => barData.ticker === d.ticker ? 2 : 0)
        })
        .on("mouseleave", function(event) {
            legendSvg.selectAll("text.legend-item")
                .transition()
                .duration(300)
                .style("opacity", 0)
                .remove()
            
            d3.select("svg.market-cap")
                .selectAll("rect.bars")
                .transition()
                .duration(250)
                .style("fill", (barData) => sectorColors[barData.sector])
                .style("opacity", 1)
                .attr("stroke", "none")
                .attr("stroke-width", 0)
        })

    // Bar chart hover interactions
    barGroups.selectAll("rect.bars")
        .on("mouseenter", function(event) {
            const d = d3.select(this).datum()

            // Display stock details in legend with enter/update/exit pattern
            legendSvg.selectAll("text.legend")
                .data([
                    `Ticker: ${d.ticker}`,
                    `Sector: ${d.sector}`,
                    `${inputLabelX}: ${axisFormatX(d[inputFieldX])}`,
                    `${inputLabelY}: ${axisFormatY(d[inputFieldY])}`,
                    `${inputLabelR}: ${axisFormatR(d[inputFieldR])}`
                ])
                .join(
                    enter => enter.append("text")
                        .attr("class", "legend-item")
                        .attr("x", 10)
                        .attr("y", (data, i) => 20 + i * 20)
                        .attr("font-size", "14px")
                        .attr("font-weight", "600")
                        .attr("fill", "var(--primary-color)")
                        .style("opacity", 0)
                        .text(data => data)
                        .call(enter => enter.transition().duration(300).style("opacity", 1)),
                    update => update
                        .text(data => data)
                        .call(update => update.transition().duration(300).style("opacity", 1)),
                    exit => exit.call(exit => exit.transition().duration(300).style("opacity", 0).remove())
                );

            // Highlight matching bar and dim scatter plot
            d3.select("svg.market-cap")
                .selectAll("rect.bars")
                .transition()
                .duration(500)
                .style("fill", (barData) => barData.ticker === d.ticker ? sectorColors[d.sector] : "#cccccc")
                .style("opacity", (barData) => barData.ticker === d.ticker ? 1 : 0.4)
                .attr("stroke", (barData) => barData.ticker === d.ticker ? sectorColors[d.sector] : "none")
                .attr("stroke-width", (barData) => barData.ticker === d.ticker ? 2 : 0)

            svg.selectAll("g.stocks circle")
                .transition()
                .duration(500)
                .style("opacity", (circleData) => circleData.ticker === d.ticker ? 1 : 0.6)
        })
        .on("mouseleave", function(event) {
            legendSvg.selectAll("text.legend-item")
                .transition()
                .duration(300)
                .style("opacity", 0.4)
                .remove()
            
            d3.select("svg.market-cap")
                .selectAll("rect.bars")
                .transition()
                .duration(250)
                .style("fill", (barData) => sectorColors[barData.sector])
                .style("opacity", 1)
                .attr("stroke", "none")
                .attr("stroke-width", 0);
            
            svg.selectAll("g.stocks circle")
                .transition()
                .duration(250)
                .style("opacity", 0.6);
        })
}

// Initialize on page load
stockData()

// Re-run on metric selection change
const selectTags = document.querySelectorAll("select")
selectTags.forEach(selectTag => {
    selectTag.addEventListener("change", () => {
        stockData()
    });
})