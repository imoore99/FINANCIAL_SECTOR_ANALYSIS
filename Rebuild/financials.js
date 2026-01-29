// two places we want to run our data viz
// 1. on page load
// 2. on on any select box
// all of them will run the same code

const svg = d3.select("svg.chart")

svg
    .attr("viewBox", "0 0 900 900")
    .attr("preserveAspectRatio", "xMidYMid meet")
    

// Here is the things we want to setup
// axes, scales, text elements

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
    console.log("Running stock data function")

    // Identify select tag name
    let input = document.querySelector("select[name=metricPreset]")
    // Identify select tag value
    let valueSelect = input.value

    console.log("Value Selected:", valueSelect)
    console.log("mm", metricPresets[0][valueSelect])
    // Filter metric presets for values
    const metricSelect = metricPresets[0][valueSelect]  
    console.log("Metric Presets:", metricSelect)
    
    //Identify and extract metric names
    const inputFieldX = metricSelect.x.field
    const inputFieldY = metricSelect.y.field
    const inputFieldR = metricSelect.r.field

    console.log("selects:", inputFieldX, inputFieldY, inputFieldR)

    //Identify and extract metric chart labels
    const inputLabelX = metricSelect.x.label
    const inputLabelY = metricSelect.y.label
    const inputLabelR = metricSelect.r.label

    console.log("selects:", inputLabelX, inputLabelY, inputLabelR)

    const axisFormatX = metricSelect.x.format
    const axisFormatY = metricSelect.y.format
    const axisFormatR = metricSelect.r.format
    console.log("formats:", axisFormatX, axisFormatY, axisFormatR)

    // here is the place we update things
    let valueX = inputFieldX
    let valueY = inputFieldY
    let valueR = inputFieldR

    // Filter out stocks with null/undefined values for current metrics
    const validData = stock_data.filter(d => 
        d[valueX] != null && 
        d[valueY] != null && 
        d[valueR] != null
    );

    let textX = inputLabelX
    let textY = inputLabelY

    axisXText.text(textX)
    axisYText.text(textY)

    const selectDescription = document.querySelector("#presetDescription" )
    console.log("description:", metricSelect.description)
    selectDescription.innerHTML = metricSelect.description


    //max values for scales
    let maxValueX = d3.max(validData, (d, i) => {return d[valueX]})
    let maxValueY = d3.max(validData, (d, i) => {return d[valueY]})
    let maxValueR = d3.max(validData, (d, i) => {return d[valueR]})

    //max values for scales
    let minValueX = d3.min(validData, (d, i) => {return d[valueX]})
    let minValueY = d3.min(validData, (d, i) => {return d[valueY]})
    let minValueR = d3.min(validData, (d, i) => {return d[valueR]})

    

    // create scales based on select box values
    const scaleX = d3.scaleLinear()
        .domain([
                minValueX < 0 ? minValueX*1.1 : minValueX*0.8,
                maxValueX < 0 ? maxValueX*0.8 : maxValueX*1.1
        ])
        .range([100, 900])
    const scaleY = d3.scaleLinear()
        .domain([
                minValueY < 0 ? minValueY*1.1 : minValueY*0.8,
                maxValueY < 0 ? maxValueY*0.8 : maxValueY*1.1
        ])
        .range([800, 0])
    const scaleR = d3.scaleSqrt()
        .domain([minValueR*0.8, maxValueR*1.1])
        .range([0, 40])

    // create and call axes based on select box values
    const axisX = d3.axisBottom(scaleX)
        .tickSizeInner(-800)
        .tickSizeOuter(0)
        .tickPadding(10)
        .ticks(10)
        .tickFormat(axisFormatX)
    axisXGroup.call(axisX)
    axisXGroup.selectAll(".tick text").style("font-size", "14px")

    const axisY = d3.axisLeft(scaleY)
        .tickSizeInner(-800)
        .tickSizeOuter(0)
        .tickPadding(10)
        .ticks(10)
        .tickFormat(axisFormatY)
    axisYGroup.call(axisY)
    axisYGroup.selectAll(".tick text").style("font-size", "14px")

    //Connect inputs to actual values from validData
    const stocks = svg
        .selectAll("g.stocks")
        .data(validData, (d, i) => {return d.ticker})
        .enter()  // On load
        .append("g")
        .attr("class", "stocks")
        .attr("transform", (d, i) => {
            const x = scaleX(d[valueX])
            console.log("X:", x)
            const y = scaleY(d[valueY])
            console.log("Y:", y)
            return `translate(${x}, ${y})`
        })

    stocks
        .append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 0)
        .transition()
        .duration(500)
        .attr("stroke", (d, i) => {return sectorColors[d.sector]})
        .attr("stroke-width", 5)
        .attr("r", (d, i) => {return scaleR(d[valueR])})

    // Bind validData and handle enter/update/exit
    const stockGroups = svg.selectAll("g.stocks")
        .data(validData, d => d.ticker);

    // Remove stocks that are no longer valid
    stockGroups.exit()
        .transition()
        .duration(500)
        .style("opacity", 0)
        .remove();

    // Update text labels for valid stocks only
    stockGroups.each(function(d) {
        const group = d3.select(this);
        const texts = group.selectAll("text").nodes();
        
        // Now d is guaranteed to be from validData
        d3.select(texts[1])
            .text(`${inputLabelX}: ${axisFormatX(d[valueX])}`);
        
        d3.select(texts[2])
            .text(`${inputLabelY}: ${axisFormatY(d[valueY])}`);
        
        d3.select(texts[3])
            .text(`${inputLabelR}: ${axisFormatR(d[valueR])}`);
    });

    // Transition valid stocks to new positions
    stockGroups
        .transition()
        .duration(500)
        .attr("transform", (d, i) => {
            const x = scaleX(d[valueX]);
            const y = scaleY(d[valueY]);
            return `translate(${x}, ${y})`;
        });

    // Bar Chart for Market Cap Visualization
    const marketCapSvg = d3.select("svg.market-cap")
        .attr("viewBox", "0 0 280 520")
        .attr("preserveAspectRatio", "xMidYMid meet")

    // Sort by market cap descending
    const sortedData = [...validData].sort((a, b) => b.market_cap - a.market_cap)

    // Scale for horizontal bars
    const barScale = d3.scaleLinear()
        .domain([0, d3.max(sortedData, d => d.market_cap)])
        .range([0, 250]) // Max bar width

    const barHeight = 520 / sortedData.length // Auto-calculates spacing
    const barPadding = 10

    const barGroups = marketCapSvg
        .selectAll("g")
        .data(sortedData)
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(10, ${i * barHeight + barPadding})`)

    // Horizontal bars
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

    // Ticker labels at end of bars
    barGroups
        .append("text")
        .attr("x", d => barScale(d.market_cap)+ 5)
        .attr("y", (barHeight - barPadding) / 2+ 4)
        .attr("class", "bar-label")
        .attr("font-size", "12px")
        .attr("fill", "var(--primary-color)")
        .text(d => d.ticker)

    // Add hover listeners for legend display
    svg.selectAll("g.stocks")
        .on("mouseenter", function(event) {
            const d = d3.select(this).datum()
            console.log("Hovering over:", d.ticker)

            // Build legend items 
            legendSvg.selectAll("text.legend")
                .data([
                    `Ticker: ${d.ticker}`,
                    `Sector: ${d.sector}`,
                    `${inputLabelX}: ${axisFormatX(d[valueX])}`,
                    `${inputLabelY}: ${axisFormatY(d[valueY])}`,
                    `${inputLabelR}: ${axisFormatR(d[valueR])}`
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

            // Highlight the matching bar in the bar chart (dim others)
            console.log("Trying to highlight bar for:", d.ticker)
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
            const d = d3.select(this).datum()
            console.log("Left:", d.ticker)
            // Fade out legend content on mouse leave
            legendSvg.selectAll("text.legend-item")
                .transition()
                .duration(300)
                .style("opacity", 0)
                .remove()
            
            // Reset all bars to original color/opacity
            d3.select("svg.market-cap")
                .selectAll("rect.bars")
                .transition()
                .duration(250)
                .style("fill", (barData) => sectorColors[barData.sector])
                .style("opacity", 1)
                .attr("stroke", "none")
                .attr("stroke-width", 0)
        })
}



// var minRange = 0 //defines start range for scaling
// var maxRange = 112 //defines end range for scaling
// var textStart = 130 //defines y position for bars
// var textLabel = textStart+20 //hour label positioning
// var textMarketCap = textStart-10 //data labels positioning

// const barScale = d3.scaleLinear()
//     .domain([0, 6000000000000])
//     .range([minRange, maxRange])

// const marketCapGroups = marketCapSvg
//     .selectAll("g")
//     .data(stock_data.sort((a, b) => a.market_cap - b.market_cap))
//     .enter()
//     .append("g")
//     .attr("transform", (d, i) => {return "translate(" + (i*36) +", 0)"})

// marketCapGroups
//     .append("rect")
//     .attr("class", "bars")
//     .attr("x", 120)
//     .attr("y", (d, i) => {return textStart})
//     .attr("width", 24)
//     .attr("height", 0)
//     .style("fill", (d) => sectorColors[d.sector])
//     .style("opacity", 1)
//     .transition().duration(500).delay((d,i) => {return i * 24}).ease(d3.easeCubicOut)
//     .attr("y", (d, i) => {return textStart-barScale(d.market_cap)})
//     .attr("height", (d, i) => {return barScale(d.market_cap)})
    

// marketCapGroups
//     .append("text")
//     .attr("x", 132)
//     .attr("y", (d,i) => {return textMarketCap-barScale(d.market_cap) - 25})
//     .attr("class", "marketcap")
//     .attr("text-anchor", "end")
//     .text((d, i) => {return `${d.market_cap/1000000000000}`.slice(0, 4) + "T"})
//     .attr("transform", (d, i) => { return `rotate(-90, 132, ${textMarketCap-barScale(d.market_cap) - 30})`})

// marketCapGroups
//     .append("text")
//     .attr("x", 132)
//     .attr("y", textLabel)
//     .attr("class", "labels")
//     .text((d,i) => {return d.ticker})
//     .attr("transform", "translate(-12,320) rotate(-90)")


//on page load
stockData()

//on any select box
const selectTags = document.querySelectorAll("select")
selectTags.forEach(selectTag => {
    selectTag.addEventListener("change", function () {
        stockData()
        console.log("Selection changed, data updated.")
    });
})


