var data = data3
var chartwidth = 500
var chartheight = 500

const points = [
    { "x": chartwidth / 2, "y": 50 },       // 上顶点
    { "x": 30, "y": chartheight - 50 },     // 左下顶点
    { "x": chartwidth - 30, "y": chartheight - 50 } // 右下顶点
  ];


// 创建 SVG 画布
const svg7 = d3.select("#d3-container333").append("svg")
  .attr("width", chartwidth)
  .attr("height", chartheight)
  .attr('transform','translate(50,50)');

// 绘制三角形
svg7.selectAll("polygon")
  .data([points])
  .enter().append("polygon")
  .attr("points", d => d.map(p => [p.x, p.y].join(",")).join(" "))
  .attr("stroke", "black")
  .attr("fill", "none");

// 计算并绘制数据点
svg7.selectAll("circle")
  .data(data)
  .enter().append("circle")
  .attr("cx", d => (d["错误"] * points[0].x + d["其他"] * points[1].x + d["学术不端"] * points[2].x) / (d["错误"] + d["其他"] + d["学术不端"]))
  .attr("cy", d => (d["错误"] * points[0].y + d["其他"] * points[1].y + d["学术不端"] * points[2].y) / (d["错误"] + d["其他"] + d["学术不端"]))
  .attr("r", 7)
  .attr("fill", "red");

let tooltip7 = d3.select('#d3-container333').append('div')
.style('position', 'absolute')
.style('z-index', '10')
.style('visibility', 'hidden') // 一开始设置为隐藏
.style('background', '#fff')
.style('border', '1px solid #000')
.style('padding', '5px');

svg7.selectAll('circle')
  .data(data)
  // ... 设置圆形的属性
  .on('mouseover', function(event, d) {
    console.log(0)
    tooltip7.style('visibility', 'visible')
      .text(`${d['subject']} 学术不端: ${d["学术不端"].toFixed(2)}, 错误: ${d["错误"].toFixed(2)}, 其他: ${d["其他"].toFixed(2)}`);
  })
  .on('mousemove', function(event, d) {
    tooltip7.style('top', (event.pageY - 10) + 'px')
      .style('left', (event.pageX + 10) + 'px');
  })
  .on('mouseout', function() {
    tooltip7.style('visibility', 'hidden');
  });

svg7.append('text')
.attr('x',250)
.attr('y',50)
.style('text-anchor', 'middle') // 设置文本居中对齐
.text('其他')

svg7.append('text')
.attr('x',35)
.attr('y',465)
.style('text-anchor', 'end') // 设置文本居中对齐
.text('错误')

svg7.append('text')
.attr('x',435)
.attr('y',465)
.style('text-anchor', 'start') // 设置文本居中对齐
.text('学术不端')