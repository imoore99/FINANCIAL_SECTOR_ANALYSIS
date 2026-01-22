// two places we want to run our data viz
// 1. on page load
// 2. on on any select box
// all of them will run the same code

const svg = d3.select("svg.chart")

svg
    .attr("viewBox", "0 0 960 720")
    

// Here is the things we want to setup
// axes, scales, text elements

const axisXGroup = svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0, 620)")

const axisYGroup = svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(100, 0)")


const axisXText = svg
    .append("text")
    .attr("class", "x-axis")
    .attr("transform", "translate(450, 670)")

    
const axisYText = svg
    .append("text")
    .attr("class", "y-axis")
    .attr("transform", "translate(30, 450) rotate(-90)")

const legendSvg = d3.select("svg.legend")
    .attr("viewBox", "0 0 960 40")
    .attr("width", 960)
    .attr("height", 40)

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

    let textX = inputLabelX
    let textY = inputLabelY

    axisXText.text(textX)
    axisYText.text(textY)

    const selectDescription = document.querySelector("#presetDescription" )
    console.log("description:", metricSelect.description)
    selectDescription.innerHTML = metricSelect.description


    //max values for scales
    let maxValueX = d3.max(stock_data, (d, i) => {return d[valueX]})
    let maxValueY = d3.max(stock_data, (d, i) => {return d[valueY]})
    let maxValueR = d3.max(stock_data, (d, i) => {return d[valueR]})

    //max values for scales
    let minValueX = d3.min(stock_data, (d, i) => {return d[valueX]})
    let minValueY = d3.min(stock_data, (d, i) => {return d[valueY]})
    let minValueR = d3.min(stock_data, (d, i) => {return d[valueR]})

    

    // create scales based on select box values
    const scaleX = d3.scaleLinear()
        .domain([
                minValueX < 0 ? minValueX*1.1 : minValueX*0.8,
                maxValueX < 0 ? maxValueX*0.8 : maxValueX*1.1
        ])
        .range([100, 860])
    const scaleY = d3.scaleLinear()
        .domain([
                minValueY < 0 ? minValueY*1.1 : minValueY*0.8,
                maxValueY < 0 ? maxValueY*0.8 : maxValueY*1.1
        ])
        .range([620, 100])
    const scaleR = d3.scaleSqrt()
        .domain([minValueR*0.8, maxValueR*1.1])
        .range([0, 30])

    // create and call axes based on select box values
    const axisX = d3.axisBottom(scaleX)
        .tickSizeInner(-520)
        .tickSizeOuter(0)
        .tickPadding(10)
        .ticks(10)
        .tickFormat(axisFormatX)
    axisXGroup.call(axisX)
    axisXGroup.selectAll(".tick text").style("font-size", "14px")

    const axisY = d3.axisLeft(scaleY)
        .tickSizeInner(-760)
        .tickSizeOuter(0)
        .tickPadding(10)
        .ticks(10)
        .tickFormat(axisFormatY)
    axisYGroup.call(axisY)
    axisYGroup.selectAll(".tick text").style("font-size", "14px")

    //Connect inputs to actual values from stock_data
    const stocks = svg
        .selectAll("g.stocks")
        .data(stock_data, (d, i) => {return d.ticker})
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

    svg.selectAll("g.stocks")
        .each(function(d) {
            const group = d3.select(this);
            const texts = group.selectAll("text").nodes();
            
            // Update second text (X metric)
            d3.select(texts[1])
                .text(`${inputLabelX}: ${axisFormatX(d[valueX])}`);
            
            // Update third text (Y metric)  
            d3.select(texts[2])
                .text(`${inputLabelY}: ${axisFormatY(d[valueY])}`);
            
            // Update fourth text (R metric)
            d3.select(texts[3])
                .text(`${inputLabelR}: ${axisFormatR(d[valueR])}`);
        });
    svg
        .selectAll("g.stocks")
        .transition()
        .duration(500)
        .attr("transform", (d, i) => {
            const x = scaleX(d[valueX])
            console.log("X:", x)
            const y = scaleY(d[valueY])
            console.log("Y:", y)
            return `translate(${x}, ${y})`
        })

    // Add hover listeners for legend display
    svg.selectAll("g.stocks")
        .on("mouseenter", function(event) {
            const d = d3.select(this).datum()
            console.log("Hovering over:", d.ticker)

            // Build legend items (flex-like spacing)
            const items = [
                `Stock: ${d.ticker} `, '|',
                `Sector: ${d.sector} `,'|',
                `${inputLabelX}: ${axisFormatX(d[valueX])} `, '|',
                `${inputLabelY}: ${axisFormatY(d[valueY])} `, '|',
                `${inputLabelR}: ${axisFormatR(d[valueR])}`
            ]

            const w = parseFloat(legendSvg.attr('width')) || (legendSvg.node()?.getBoundingClientRect().width || 960)
            const band = d3.scaleBand()
                .domain(d3.range(items.length))
                .range([0, w])
                .padding(0.2)

            const legendTexts = legendSvg
                .selectAll('text.legend-item')
                .data(items)

            legendTexts.join(
                enter => {
                    const enterSel = enter.append('text')
                        .attr('class', 'legend-item')
                        .attr('y', 24)
                        .attr('text-anchor', 'middle')
                        .attr('font-weight', 'bold')
                        .attr('font-size', '14px')
                        .attr('x', (t, i) => band(i) + band.bandwidth() / 2)
                        .style('opacity', 0)
                        .text(t => t)
                    enterSel.transition().duration(500).style('opacity', 1)
                    return enterSel
                },
                update => {
                    update.text(t => t)
                    update.transition().duration(500).attr('x', (t, i) => band(i) + band.bandwidth() / 2)
                    return update
                },
                exit => {
                    exit.transition().duration(500).style('opacity', 0).remove()
                    return exit
                }
            )

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

// Bar Chart for Market Cap Visualization
const marketCapSvg = d3.select("svg.market-cap")
    .attr("viewBox", "0 0 960 200")
    .attr("width", 960)
    .attr("height", 200)

var minRange = 0 //defines start range for scaling
var maxRange = 112 //defines end range for scaling
var textStart = 130 //defines y position for bars
var textLabel = textStart+20 //hour label positioning
var textMarketCap = textStart-10 //data labels positioning

const barScale = d3.scaleLinear()
    .domain([0, 6000000000000])
    .range([minRange, maxRange])

const marketCapGroups = marketCapSvg
    .selectAll("g")
    .data(stock_data.sort((a, b) => a.market_cap - b.market_cap))
    .enter()
    .append("g")
    .attr("transform", (d, i) => {return "translate(" + (i*36) +", 0)"})

marketCapGroups
    .append("rect")
    .attr("class", "bars")
    .attr("x", 120)
    .attr("y", (d, i) => {return textStart})
    .attr("width", 24)
    .attr("height", 0)
    .style("fill", (d) => sectorColors[d.sector])
    .style("opacity", 1)
    .transition().duration(500).delay((d,i) => {return i * 24}).ease(d3.easeCubicOut)
    .attr("y", (d, i) => {return textStart-barScale(d.market_cap)})
    .attr("height", (d, i) => {return barScale(d.market_cap)})
    

marketCapGroups
    .append("text")
    .attr("x", 132)
    .attr("y", (d,i) => {return textMarketCap-barScale(d.market_cap) - 25})
    .attr("class", "marketcap")
    .attr("text-anchor", "end")
    .text((d, i) => {return `${d.market_cap/1000000000000}`.slice(0, 4) + "T"})
    .attr("transform", (d, i) => { return `rotate(-90, 132, ${textMarketCap-barScale(d.market_cap) - 30})`})

marketCapGroups
    .append("text")
    .attr("x", 132)
    .attr("y", textLabel)
    .attr("class", "labels")
    .text((d,i) => {return d.ticker})
    .attr("transform", "translate(-12,320) rotate(-90)")


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

