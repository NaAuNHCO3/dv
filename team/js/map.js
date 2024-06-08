// Set the dimensions and margins of the map
const width = 960;
const height = 600;

// Create an SVG element and append it to the map div
const svg3 = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Create a projection and path generator
const projection = d3.geoMercator()
    .scale(130)
    .translate([width / 2, height / 1.5]);

const path = d3.geoPath().projection(projection);

// Create a tooltip
const tooltip = d3.select("#map")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Define a color scale
const colorScaleMap = d3.scaleSequential(d3.interpolateBlues)
    .domain([0, 30000]); // Adjust the domain based on your data

// Load and process the data
d3.json("https://d3js.org/world-110m.v1.json").then(worldData => {
    d3.csv("cn2.csv").then(effortData => {
        // Process population data
        const effortMap = new Map();
        effortData.forEach(d => {
            effortMap.set(d.country, { name: d.name, effort: +d.effort });
        });

        // Draw the map
        svg3.append("g")
            .selectAll("path")
            .data(topojson.feature(worldData, worldData.objects.countries).features)
            .enter().append("path")
            .attr("d", path)
            .attr("fill", d => {
                const countryData = effortMap.get(d.id);
                return countryData ? colorScaleMap(countryData.effort) : "#ccc";
            })
            .on("mouseover", function (event, d) {
                const countryData = effortMap.get(d.id);
                if (countryData) {
                    tooltip.transition().duration(200).style("opacity", .9);
                    tooltip.html(countryData.name + "<br/>effort: " + countryData.effort.toLocaleString())
                        .style("left", (event.pageX) + "px")
                        .style("top", (event.pageY - 28) + "px");
                } else {
                    tooltip.transition().duration(200).style("opacity", .9);
                    tooltip.html("Unknown Country<br/>effort: N/A")
                        .style("left", (event.pageX) + "px")
                        .style("top", (event.pageY - 28) + "px");
                }
            })
            .on("mouseout", function () {
                tooltip.transition().duration(500).style("opacity", 0);
            });

        // Add legend for the map
        const legendWidth1 = 300;
        const legendHeight1 = 20;
        const legendSvgMap1 = svg3.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width - legendWidth1 - 20},${height - legendHeight1 - 30})`);

        const gradientMap1 = legendSvgMap1.append("defs")
            .append("linearGradient")
            .attr("id", "legendGradientMap")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");

        gradientMap1.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", d3.interpolateBlues(0));
        gradientMap1.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", d3.interpolateBlues(1));

        legendSvgMap1.append("rect")
            .attr("width", legendWidth1)
            .attr("height", legendHeight1)
            .style("fill", "url(#legendGradientMap)");

        const xScaleMap1 = d3.scaleLinear()
            .domain(colorScaleMap.domain())
            .range([0, legendWidth1]);

        const xAxisMap1 = d3.axisBottom(xScaleMap1)
            .ticks(5)
            .tickFormat(d3.format(".2s"));

        legendSvgMap1.append("g")
            .attr("transform", `translate(0, ${legendHeight1})`)
            .call(xAxisMap1);
        
        legendSvgMap1.append("text")
            .attr("class", "legend-title")
            .attr("x", legendWidth1 / 2-200)
            .attr("y", legendHeight1 + 15)
            .attr("text-anchor", "middle")
            .style("font-size", "10px")
            .text("监察力度");
    });
});
