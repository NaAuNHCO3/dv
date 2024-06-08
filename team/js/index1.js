
d3.select("#d3-container").append("text")
    .attr("transform", "rotate(180)")
    .attr("y", 20)
    .attr("x", 250)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("撤稿数");

    var data=data1
    var svg8 = d3.select("#d3-container").append("svg")
    .attr('width',900)
    .attr('height',500)
    // 创建比例尺
    const xScale8 = d3.scaleTime()
    .domain([new Date(1979), new Date(2023)])
    .range([0, 700]);
    const x8 = d3.scaleTime()
    .domain([new Date('1979'), new Date('2023')])
    .range([0, 700]);
    const yScale8 = d3.scaleLinear()
    .domain([0, 1]) // 根据你的数据范围设置
    .range([400, 0]);
    
    const xAxis8 = d3.axisBottom(x8)
    .tickFormat(d3.timeFormat("%Y")); // 设置刻度格式为年份
    const yAxis8 = d3.axisLeft(yScale8);
    // 创建堆叠数据
    const stack8 = d3.stack()
    .keys(["学术不端", "错误", "其他"])
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);
    
    const stackedData8 = stack8(data);
    // 创建路径
    const area8 = d3.area()
    .x(d => xScale8(new Date(d.data.year)))
    .y0(d => yScale8(d[0]))
    .y1(d => yScale8(d[1]));
    
    // 绘制河流图
    svg8.selectAll("path")
    .data(stackedData8)
    .enter()
    .append("path")
    .attr("d", area8)
    .attr("fill", (d, i) => d3.schemeSet3[i])
    .attr("transform",`translate(50,50)`)
    
    // 添加g(axis)
    svg8.append("g")
    .attr("transform", "translate(50,450)") // 将 X 轴移动到底部
    .call(xAxis8);
    
    svg8.append("g")
    .attr("transform", "translate(50,50)") // 将 Y 轴移动到左侧
    .call(yAxis8);
  svg8.append('text')
    .attr('class', 'x-axis-label') // 添加一个类名，方便样式设置
    .attr('x', 400) // 设置x轴轴名的x坐标
    .attr('y', 490) // 设置x轴轴名的y坐标
    .style('text-anchor', 'middle') // 设置文本居中对齐
    .text("年份"); // 设置x轴轴名的文本
  
    
    
    // 添加动画效果
    d3.selectAll("path")
    .attr("opacity", 0)
    .transition()
    .duration(1000)
    .attr("opacity", 1);
    
    var color1 = d3.schemeSet3[0]
    var color2 = d3.schemeSet3[1]
    var color3 = d3.schemeSet3[2]
    
    console.log(color1)
    // 绘制图例的颜色块
    svg8.append('rect')
      .attr('class','bar')
      .attr('x', 780)
      .attr('y', 40) // 设置图例颜色块的横坐标位置
      .attr('width', 25) // 设置图例颜色块的宽度
      .attr('height', 25) // 设置图例颜色块的高度
      .attr('fill', color3);
    
      svg8.append('rect')
      .attr('class','bar')
      .attr('x', 780)
      .attr('y', 80) // 设置图例颜色块的横坐标位置
      .attr('width', 25) // 设置图例颜色块的宽度
      .attr('height', 25) // 设置图例颜色块的高度
      .attr('fill', color2);
    
      svg8.append('rect')
      .attr('class','bar')
      .attr('x', 780)
      .attr('y', 120) // 设置图例颜色块的横坐标位置
      .attr('width', 25) // 设置图例颜色块的宽度
      .attr('height', 25) // 设置图例颜色块的高度
      .attr('fill', color1);
    // 添加文本标签
    svg8.append('text')
      .attr('x', 820) // 设置文本标签的横坐标位置
      .attr('y', 50) // 设置文本标签的纵坐标位置
      .attr('dy', '.35em')
      .style('text-anchor', 'start')
      .text('其他');
    svg8.append('text')
      .attr('x', 820) // 设置文本标签的横坐标位置
      .attr('y', 90) // 设置文本标签的纵坐标位置
      .attr('dy', '.35em')
      .style('text-anchor', 'start')
      .text('错误');
    svg8.append('text')
      .attr('x', 820) // 设置文本标签的横坐标位置
      .attr('y', 130) // 设置文本标签的纵坐标位置
      .attr('dy', '.35em')
      .style('text-anchor', 'start')
      .text('学术不端');
    