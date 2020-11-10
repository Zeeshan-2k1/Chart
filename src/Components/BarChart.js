import { axisBottom, axisRight, scaleBand, scaleLinear, select } from 'd3';
import React, { useEffect, useRef, useState } from 'react';

const useResize = (ref) => {
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    const Target = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });
    resizeObserver.observe(Target);
    return () => {
      resizeObserver.unobserve(Target);
    };
  }, [ref]);

  return dimensions;
};

const BarChart = ({ data }) => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResize(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);
    console.log(dimensions);
    if (!dimensions) return;

    const xScale = scaleBand()
      .domain(data.map((v, i) => i))
      .range([0, dimensions.width])
      .padding(0.5);

    const yScale = scaleLinear().domain([0, 150]).range([dimensions.height, 0]);

    const colorScale = scaleLinear()
      .domain([65, 100, 150])
      .range(['green', 'orange', 'red'])
      .clamp(true);

    const xAxis = axisBottom(xScale).ticks(data.length);
    svg
      .select('.x-axis')
      .style('transform', `translateY(${dimensions.height}px)`)
      .call(xAxis);

    const yAxis = axisRight(yScale);
    svg
      .select('.y-axis')
      .style('transform', `translateX(${dimensions.width}px)`)
      .call(yAxis);

    svg
      .selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('fill', colorScale)
      .attr('x', (v, i) => xScale(i))
      .attr('y', -150)
      .style('transform', 'scale(1,-1)')
      .attr('width', xScale.bandwidth())
      .on('mouseenter', function (event, value) {
        const index = svg.selectAll('.bar').nodes().indexOf(this);
        svg
          .selectAll('.tooltip')
          .data([value])
          .join('text')
          .attr('class', 'tooltip')
          .text(value)
          .attr('x', xScale(index) + xScale.bandwidth() / 4)
          .transition()
          .attr('y', yScale(value) - 4)
          .attr('opacity', '1');
      })
      .transition()
      .attr('height', (v) => 150 - yScale(v));
  }, [data, dimensions]);

  return (
    <div ref={wrapperRef}>
      <svg ref={svgRef}>
        <g className="x-axis"> </g>
        <g className="y-axis"></g>
      </svg>
    </div>
  );
};

export default BarChart;
