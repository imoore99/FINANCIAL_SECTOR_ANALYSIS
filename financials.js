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
    
    // Hover state data
    stocks
        .append("rect")
        .attr("x", -90)
        .attr("y", (d, i) => {return -1 * scaleR(d[valueR]) - 65})
        .attr("width", 180)
        .attr("height", 60)
        .attr("fill", (d, i) => {return sectorColors[d.sector]})
        .attr("opacity", 0)

    stocks
        .append("text")
        .attr("x", 0)
        .attr("y", (d, i) => {return -1 * scaleR(d[valueR]) - 52})
        .attr("text-anchor", "middle")
        .text((d, i) => {return d.ticker})
        .attr("fill", "var(--background)")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("opacity", 0)

    stocks
        .append("text")
        .attr("x", 0)
        .attr("y", (d, i) => {return -1 * scaleR(d[valueR]) - 38})
        .attr("text-anchor", "middle")
        .text((d, i) => {return `${inputLabelX}: ${axisFormatX(d[valueX])}`})
        .attr("fill", "var(--background)")  
        .attr("font-size", "12px")
        .attr("opacity", 0)
        

    stocks
        .append("text")
        .attr("x", 0)
        .attr("y", (d, i) => {return -1 * scaleR(d[valueR]) - 24})
        .attr("text-anchor", "middle")
        .text((d, i) => {return `${inputLabelY}: ${axisFormatX(d[valueY])}`})
        .attr("fill", "var(--background)")  
        .attr("font-size", "12px")
        .attr("opacity", 0)

    stocks
        .append("text")
        .attr("x", 0)
        .attr("y", (d, i) => {return -1 * scaleR(d[valueR]) - 10})
        .attr("text-anchor", "middle")
        .text((d, i) => {return `${inputLabelR}:$ ${axisFormatX(d[valueR]/1000000000000) }T`})
        .attr("fill", "var(--background)")  
        .attr("font-size", "12px")
        .attr("opacity", 0)



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
   


}

// Bar Chart for Market Cap Visualization
const marketCapSvg = d3.select("svg.market-cap")
    .attr("viewBox", "0 0 960 200")

var minRange = 0 //defines start range for scaling
var maxRange = 112 //defines end range for scaling
var textStart = 130 //defines y position for bars
var textLabel = textStart+20 //hour label positioning
var textMarketCap = textStart-10 //data labels positioning

const barScale = d3.scaleLinear()
    .domain([0, 6000000000000])
    .range([minRange, maxRange])

const marketCapFormat = d3.format(".2s")

const marketCapGroups = marketCapSvg
    .selectAll("g")
    .data(stock_data.sort((a, b) => b.market_cap - a.market_cap))
    .enter().append("g")
    .attr("transform", (d, i) => {return "translate(" + (i*36) +", 0)"})

marketCapGroups
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 24)
    .attr("height", textLabel)
    .attr("class", "transparent")

marketCapGroups
    .append("rect")
    .attr("x", 0)
    .attr("y", (d, i) => {return textStart})
    .attr("width", 24)
    .attr("height", 0).transition().duration(500).delay((d,i) => {return i * 20}).ease(d3.easeCubicOut)
    .attr("y", (d, i) => {return textStart-barScale(d.market_cap)})
    .attr("height", (d, i) => {return barScale(d.market_cap)})

// marketCapGroups
//     .append("text")
//     .attr("x", 12)
//     .attr("y", textLabel)
//     .attr("class", "labels")
//     .text((d,i) => {return marketCapFormat(d.ticker)})

// marketCapGroups
//     .append("text")
//     .attr("x", 12)
//     .attr("y", (d,i) => {return textMarketCap-barScale(d.market_cap)})
//     .attr("class", "marketcap")
//     .text((d,i) => {return d.market_cap})

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


// const todaySvg = d3.select("svg.today")

// var minRange = 1 //defines start range for scaling
// var maxRange = 112 //defines end range for scaling
// var textStart = 130 //defines y position for bars
// var textHour = textStart+20 //hour label positioning
// var textSteps = textStart-10 //data labels positioning

// const barScale = d3.scaleLinear()
//     .domain([0, 2000])
//     .range([minRange, maxRange])

// const hourFormat = d3.format("02d")

// const todayGroups = todaySvg
//     .selectAll("g")
//     .data(todayData)
//     .enter().append("g")
//     .attr("transform", (d, i) => {return "translate(" + (i*36) +", 0)"})

// todayGroups
//     .append("rect")
//     .attr("x", 0)
//     .attr("y", 0)
//     .attr("width", 24)
//     .attr("height", textHour)
//     .attr("class", "transparent")

// todayGroups
//     .append("rect")
//     .attr("x", 0)
//     .attr("y", (d, i) => {return textStart})
//     .attr("width", 24)
//     .attr("height", 0).transition().duration(500).delay((d,i) => {return i * 20}).ease(d3.easeCubicOut)
//     .attr("y", (d, i) => {return textStart-barScale(d)})
//     .attr("height", (d, i) => {return barScale(d)})

// todayGroups
//     .append("text")
//     .attr("x", 12)
//     .attr("y", textHour)
//     .attr("class", "hours")
//     .text((d,i) => {return hourFormat(i)})

// todayGroups
//     .append("text")
//     .attr("x", 12)
//     .attr("y", (d,i) => {return textSteps-barScale(d)})
//     .attr("class", "steps")
//     .text((d,i) => {return d})