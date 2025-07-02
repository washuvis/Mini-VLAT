import React, { Component } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import '../App.css';
import data_usa from './data/USA.json';
import data from './data/Choropleth.csv';

class ChoroplethMini extends Component {
    componentDidMount() {
        this.drawChart();
    }

    componentDidUpdate() {
        this.drawChart();
    }

    drawChart() {
        // Remove previous SVG
        d3.select("#graph_box").select("svg").remove();

        // Increase map size: use 99% of the smaller dimension for the map
        var e = document.getElementById("graph_box");
        const containerWidth = e.clientWidth || 600;
        const containerHeight = e.clientHeight || 400;
        const length = Math.floor(1.1 * Math.min(containerWidth, containerHeight)); // increase map size
        const margin = { top: length / 16, right: length / 16, bottom: length / 16, left: length / 16 },
            width = length - margin.left - margin.right,
            height = length - margin.top - margin.bottom;

        // SVG setup
        const svg = d3.select("#graph_box")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom + 70)
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom + 70}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top + 60})`);

        // Projection and path
        var projection = d3.geoAlbersUsa()
            .translate([width / 2, height / 2])
            .scale(Math.min(width, height));
        var path = d3.geoPath().projection(projection);

        // Load CSV data for unemployment values and codes
        d3.csv(data).then(csvData => {
            // Map state names to values and codes
            const valueMap = {};
            const codeMap = {};
            csvData.forEach(d => {
                valueMap[d.state] = +d.value;
                codeMap[d.state] = d.code;
            });

            // Get TopoJSON features
            const usa = topojson.feature(data_usa, data_usa.objects.states).features;

            // Assign value to each state
            usa.forEach(d => {
                d.properties.value = valueMap[d.properties.name];
                d.properties.code = codeMap[d.properties.name];
            });

            // Color scale
            const lowColor = '#f7fbff', highColor = '#084594';
            const values = Object.values(valueMap);
            const minVal = d3.min(values), maxVal = d3.max(values);
            const ramp = d3.scaleLinear()
                .domain([minVal, maxVal])
                .range([lowColor, highColor]);

            // --- Legend ---
            const legendWidth = Math.max(180, width * 0.5);
            const legendHeight = 16;
            const legendMargin = 10;
            const legendSvg = d3.select("#graph_box svg")
                .append("g")
                .attr("class", "legend")
                .attr("transform", `translate(${margin.left + (width - legendWidth) / 2},${margin.top + 100})`); // move legend further down

            // Gradient
            const defs = d3.select("#graph_box svg").append("defs");
            const linearGradient = defs.append("linearGradient")
                .attr("id", "legend-gradient");
            linearGradient.selectAll("stop")
                .data([
                    { offset: "0%", color: lowColor },
                    { offset: "100%", color: highColor }
                ])
                .enter()
                .append("stop")
                .attr("offset", d => d.offset)
                .attr("stop-color", d => d.color);

            legendSvg.append("rect")
                .attr("width", legendWidth)
                .attr("height", legendHeight)
                .style("fill", "url(#legend-gradient)");

            // Legend axis
            const legendScale = d3.scaleLinear()
                .domain([minVal, maxVal])
                .range([0, legendWidth]);
            const legendAxis = d3.axisBottom(legendScale)
                .ticks(6)
                .tickFormat(d => d + "%");
            legendSvg.append("g")
                .attr("transform", `translate(0,${legendHeight})`)
                .call(legendAxis)
                .selectAll("text")
                .style("font-size", "12px");

            legendSvg.append("text")
                .attr("x", legendWidth / 2)
                .attr("y", -8)
                .attr("text-anchor", "middle")
                .style("font-size", "14px")
                .style("font-weight", "bold")
                .text("Unemployment Rate (%)");

            // Draw states
            svg.selectAll("path")
                .data(usa)
                .enter().append("path")
                .attr("d", path)
                .style("fill", d => ramp(d.properties.value))
                .style("stroke", d => (
                    d.properties.name === "Washington" || d.properties.name === "Wisconsin"
                        ? "black" : "#ccc"
                ))
                .style("stroke-width", d => (
                    d.properties.name === "Washington" || d.properties.name === "Wisconsin"
                        ? 1.5 : 1 // decrease border size
                ));

            // Add acronyms for WA and WI only, with smaller font size
            svg.selectAll("text.state-acronym")
                .data(usa.filter(d =>
                    d.properties.name === "Washington" || d.properties.name === "Wisconsin"
                ))
                .enter()
                .append("text")
                .attr("class", "state-acronym")
                .attr("x", d => path.centroid(d)[0])
                .attr("y", d => path.centroid(d)[1])
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .style("font-weight", "bold")
                .style("font-size", `${Math.max(7, Math.floor(length * 0.018))}px`) // smaller font for acronyms
                .text(d => d.properties.code);

            // Title: decrease font size
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", -margin.top / 2)
                .attr("text-anchor", "middle")
                .style("font-weight", "bold")
                .style("font-size", 0.035 * height) // smaller title
                .text("Unemployment Rates for States in 2020");
        });
    }

    render() {
        // Make the container responsive
        return (
            <div
                id={'graph_box'}
                style={{
                    width: "100%",
                    height: "min(70vw, 70vh)",
                    minHeight: "350px",
                    minWidth: "350px",
                    maxWidth: "1100px",
                    margin: "auto"
                }}
            ></div>
        );
    }
}

export default ChoroplethMini;