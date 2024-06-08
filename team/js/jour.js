const margin = { top: 20, right: 20, bottom: 200, left: 60 }; // 调整了旋转文本的底部边距
const width1 = 800 - margin.left - margin.right;
const height1 = 500 - margin.top - margin.bottom;

const svg = d3.select("#d3container")
    .append("svg")
    .attr("width", width1 + margin.left + margin.right)
    .attr("height", height1 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleBand().range([0, width1]).padding(0.1);
const y = d3.scaleLinear().range([height1, 0]);

// 加载数据
d3.csv("jour.csv").then(data => {
    data.forEach(d => {
        d.counts = +d.counts;
    });

    x.domain(data.map(d => d.journal));
    y.domain([0, d3.max(data, d => d.counts)]);

    // X 轴
    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", `translate(0,${height1})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "-0.55em")
        .attr("transform", "rotate(-45)");

    // X 轴标签
    svg.append("text")
        .attr("transform", `translate(${width1 / 2},${height1 + margin.top + 170})`)
        .style("text-anchor", "middle")
        .text("期刊");

    // Y 轴
    svg.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10));

    // Y 轴标签
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height1 / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("撤稿数");

    // 柱状图
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.journal))
        .attr("y", d => y(d.counts))
        .attr("width", x.bandwidth())
        .attr("height", d => height1 - y(d.counts))
        .attr("fill", "lightblue") // 设置柱子的颜色
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`<strong>期刊名:</strong> ${d.journal}<br/><strong>撤稿数:</strong> ${d.counts}`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function (event, d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // 提示框
    const tooltip = d3.select("#d3container")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
});
