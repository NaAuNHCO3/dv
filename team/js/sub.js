

const margin4 = { top: 50, right: 70, bottom: 100, left: 90 };
const width4 = 800 - margin4.left - margin4.right;
const height4 = 500 - margin4.top - margin4.bottom;

const svg4 = d3.select("#d33container")
    .append("svg")
    .attr("width", width4 + margin4.left + margin4.right)
    .attr("height", height4 + margin4.top + margin4.bottom)
    .append("g")
    .attr("transform", `translate(${margin4.left},${margin4.top})`);

// 加载数据
d3.csv("sub.csv").then(data => {
    // 数据预处理：将字符串转换为数值
    data.forEach(d => {
        d.year = +d.year;
        d.count = +d.count;
    });

    // 获取所有学科
    const majors = [...new Set(data.map(d => d.major_themescl))];

    // 颜色比例尺
    const color = d3.scaleOrdinal()
        .domain(majors)
        .range(d3.schemeCategory10);

    // X 轴比例尺
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width4]);

    // Y 轴比例尺
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .nice()
        .range([height4, 0]);

    // 定义折线生成器
    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.count));

    // 添加折线路径
    majors.forEach(major => {
        const filteredData = data.filter(d => d.major_themescl === major);

        svg4.append("path")
            .datum(filteredData)
            .attr("class", "line")
            .attr("d", line)
            .style("stroke", color(major));
        svg4.append("rect")
            .attr("x", width4 + 10)
            .attr("y", color.domain().indexOf(major) * 20 + 20)
            .attr("width", 10)
            .attr("height", 2)
            .attr("fill", color(major));
        svg4.append("text")
            .attr("x", width4 + 70)
            .attr("y", color.domain().indexOf(major) * 20 + 20)
            .attr("dy", "0.32em")
            .text(major)
            .attr("fill", color(major))
            .attr("class", "legend")
            .style("text-anchor", "end");
    });

    // 添加 X 轴
    svg4.append("g")
        .attr("transform", `translate(0,${height4})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // 添加 Y 轴
    svg4.append("g")
        .call(d3.axisLeft(y));

    svg4.append("text")
        .attr("transform", `translate(${width4 / 2},${height4 + margin4.top + 10})`)
        .style("text-anchor", "middle")
        .text("时间");
    
    svg4.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin4.left )
        .attr("x", 0 - (height4 / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("撤稿数");
    // 添加交互式 tooltip
    const tooltip = d3.select("#d33container")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    
    svg4.selectAll(".line")
        .on("mouseover", function(event, d) {
            const major = d[0].major_themescl;
            const count = d[0].count;
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`<strong>学科:</strong> ${major}<br><strong>数量:</strong> ${count}`)
                .style("left", (event.pageX) + 17 + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
});
