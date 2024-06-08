// Set the dimensions and margins of the map
const width5 = 960;
const height5 = 600;

// Create an SVG element and append it to the map div
const svg5 = d3.select("#d34container")
    .append("svg")
    .attr("width", width5)
    .attr("height", height5);

// Create a projection and path generator
const projection5 = d3.geoMercator()
    .scale(130)
    .translate([width5 / 2, height5 / 1.5]);

const path5 = d3.geoPath().projection(projection5);

// Create a tooltip
const tooltip5 = d3.select("#d34container")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Load and process the data
Promise.all([
    d3.json("https://d3js.org/world-110m.v1.json"),
    d3.csv("cn3.csv") // Replace with the path to your actual CSV file
]).then(([worldData, yourData]) => {
    // Add a select dropdown to select year
    const years = Array.from(new Set(yourData.map(d => +d.year))) // Get unique years
        .sort((a, b) => a - b); // Sort years in ascending order

    const dropdown = d3.select("#dropdown");

    dropdown.selectAll("option")
        .data(years)
        .enter().append("option")
        .attr("value", d => d)
        .text(d => d);

    dropdown.on("change", function () {
        const selectedYear = +this.value;
        updateMap(selectedYear);
    });

    // Initial map display
    const initialYear = 2023;

    // Call updateMap to initially display the map and legend
    updateMap(initialYear);

    // Set dropdown value to the initial year
    dropdown.property("value", initialYear);

    function updateMap(selectedYear) {
        // Process your data for the selected year
        const filteredData = yourData.filter(d => +d.year === +selectedYear);
        const filteredDataMap = new Map();
        filteredData.forEach(d => {
            filteredDataMap.set(d.country, { name: d.name, ret: +d.ret });
        });

        // Define a color scale based on the selected year's data
        const maxRet = d3.max(filteredData, d => +d.ret);
        const colorScale5 = d3.scaleSequential(d3.interpolateBlues)
            .domain([0, maxRet]);

        // Draw the map
        svg5.selectAll("path")
            .data(topojson.feature(worldData, worldData.objects.countries).features)
            .join("path")
            .attr("d", path5)
            .attr("fill", d => {
                const countryData = filteredDataMap.get(d.id);
                return countryData ? colorScale5(countryData.ret) : "#ccc";
            })
            .on("mouseover", function (event, d) {
                const countryData = filteredDataMap.get(d.id);
                if (countryData) {
                    tooltip5.transition().duration(200).style("opacity", .9);
                    tooltip5.html(countryData.name + "<br/>ret: " + countryData.ret.toFixed(6))
                        .style("left", (event.pageX) + "px")
                        .style("top", (event.pageY - 28) + "px");
                } else {
                    tooltip5.transition().duration(200).style("opacity", .9);
                    tooltip5.html("Unknown Country<br/>ret: N/A")
                        .style("left", (event.pageX) + "px")
                        .style("top", (event.pageY - 28) + "px");
                }
            })
            .on("mouseout", function () {
                tooltip5.transition().duration(500).style("opacity", 0);
            });

        // Update legend
        const legendWidth = 300;
        const legendHeight = 20;

        const legendSvg = svg5.select(".legend");
        legendSvg.selectAll("*").remove();

        const gradient = legendSvg.append("defs")
            .append("linearGradient")
            .attr("id", "legendGradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", d3.interpolateBlues(0));
        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", d3.interpolateBlues(1));

        legendSvg.append("rect")
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .style("fill", "url(#legendGradient)");

        const xScale = d3.scaleLinear()
            .domain([0, maxRet])
            .range([0, legendWidth]);

        const xAxis = d3.axisBottom(xScale)
            .ticks(5)
            .tickFormat(d3.format(".5f"));

        legendSvg.append("g")
            .attr("transform", `translate(0, ${legendHeight})`)
            .call(xAxis);

        legendSvg.append("text")
            .attr("class", "legend-title")
            .attr("x", legendWidth / 2 - 210)
            .attr("y", legendHeight + 15)
            .attr("text-anchor", "middle")
            .style("font-size", "10px")
            .text("撤稿率");
    }

    // Add legend container
    svg5.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width5 - 320},${height5 - 50})`);
});
