import React, { Component } from 'react';
import * as d3 from 'd3'
import * as topojson from 'topojson';
import { Container, Col, Row, Navbar, Button, ButtonGroup, ToggleButton, Form, InputGroup } from 'react-bootstrap';
import '../App.css';
import data from './data/StackedBarGraph.csv';
import img2 from '../components/data/Mini-VLAT/StackedBar.png'



class StackedBarChart2Mini extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.drawChart()
    }
    divResize(e) {
        console.log('div was resized', e)
    }

    componentDidUpdate() {
        this.drawChart()
    }

    drawChart() {
        //https://www.statista.com/chart/3358/room-service-prices/
        //https://www.d3-graph-gallery.com/graph/barplot_stacked_basicWide.html
        var e = document.getElementById("graph_box");
        const length = Math.min(e.clientHeight, e.clientWidth) * 0.85; // Decrease chart size
        const margin = { top: length / 7, right: length / 7, bottom: length / 7, left: length / 7 },
            width = length - margin.left - margin.right,
            height = length - margin.top - margin.bottom;

        d3.select("#graph_box").select("svg").remove();
        const svg = d3.select("#graph_box")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        d3.csv(data).then(function (data) {
            data.forEach(function (d) {
                d.Sandwich = parseFloat(d.Sandwich);
                d.Water = parseFloat(d.Water);
                d.Peanut = parseFloat(d.Peanut);
                d.CanOfSoda = parseFloat(d.CanOfSoda);
                d.Vodka = parseFloat(d.Vodka);
                d.City = d.City;
            })
            console.log(data)

            var subgroups = data.columns.slice(1);

            var groups = data.map(d => (d.City));

            console.log(subgroups)

            var xScale = d3.scaleBand().domain(groups).range([0, width]).padding([0.2])

            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(xScale).tickSizeOuter(0))
                .selectAll("text")
                .attr("dy", ".35em")
                .attr("transform", "rotate(40)")
                .style("text-anchor", "start")
                .style("font-size", "1.2em"); // Make x-axis labels bigger

            var yScale = d3.scaleLinear().domain([0, 70]).range([height, 0]);
            svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale)).selectAll("text")
                .style("font-size", "1.2em"); // Make y-axis labels bigger

            const color = d3.scaleOrdinal()
                .domain(subgroups)
                .range(['#c36a76', '#94caec', '#dccd7d', '#5da899', '#9e4a97']); // Sandwich, Water, Peanut, Soda, Vodka

            //stack the data? --> stack per subgroup
            const stackedData = d3.stack()
                .keys(subgroups)
                (data)

            // gridlines in y axis function
            function make_y_gridlines() {
                return d3.axisLeft(yScale)
                    .ticks(11)
            }

            // add the Y gridlines
            svg.append("g")
                .attr("class", "grid")
                .call(make_y_gridlines()
                    .tickSize(-width)
                    .tickFormat("")
                )
            //This is for Stacked Bar Graph
            // Show the bars
            svg.append("g")
                .selectAll("g")
                // Enter in the stack data = loop key per key = group per group
                .data(stackedData)
                .enter().append("g")
                .attr("fill", function (d) { return color(d.key); })
                .selectAll("rect")
                // enter a second time = loop subgroup per subgroup to add all rectangles
                .data(function (d) { return d; })
                .enter().append("rect")
                .attr("x", function (d) { return xScale(d.data.City); })
                .attr("y", function (d) { return yScale(d[1]); })
                .attr("height", function (d) { return yScale(d[0]) - yScale(d[1]); })
                .attr("width", xScale.bandwidth())

            // Add chart title
            svg.append("text")
                .attr("class", "title")
                .attr("x", width / 2)
                .attr("y", -margin.top / 2.5)
                .attr("text-anchor", "middle")
                .text("Room Service Prices")
                .attr("fill", "black")
                .style("font-weight", "bold")
                .style("font-size", `${Math.max(14, Math.floor(length * 0.045))}px`);

            svg.append("text")
                .attr("class", "y-label")
                .attr("transform", "rotate(-90)")
                .attr("y", function () {
                    if (width < 500 && width > 400) {
                        return - margin.left + (margin.top / 5) * e.clientWidth / e.clientHeight
                    }
                    else if (width < 400) {
                        return - margin.left + (margin.top / 19.5) * e.clientWidth / e.clientHeight
                    }
                    else {
                        return - margin.left + (margin.top / 2.5) * e.clientWidth / e.clientHeight
                    }
                })
                .attr("x", - (height / 1.9))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Cost ($)")
                .style("font-weight", "bold")
                .style("font-size", `${Math.max(12, Math.floor(length * 0.035))}px`); // Smaller y-axis title

            svg.append("text")
                .attr("class", "x-label")
                .attr("transform", function () {
                    if (window.innerWidth < 500) {
                        return "translate(" + (width / 1.9) + " ," + (height +  margin.top - (margin.top / 1.5)) + ")"
                    }
                    else {
                        return "translate(" + (width / 1.9) + " ," + (height +  margin.top) + ")"
                    }
                })
                .style("text-anchor", "middle")
                .style("font-weight", "bold")
                .style("font-size", `${Math.max(12, Math.floor(length * 0.035))}px`) // Smaller x-axis title
                .text("Cities")

            var dataNormalized = []
            data.forEach(function (d) {
                // Compute the total
                var tot = 0
                for (var i in subgroups) { const name = subgroups[i]; tot += +d[name] }
                // Now normalize
                for (var i in subgroups) { const name = subgroups[i]; d[name] = d[name] / tot * 100 }
            })

            svg.append("rect")
                .attr("x", function () {
                    if (width < 400) {
                        return width + (0.6 * width / margin.left)
                    }
                    else {
                        return width + (2 * width / margin.left)
                    }
                })
                .attr("y", height / margin.bottom)
                .attr("width", function () {
                    if (width < 400) {
                        return 0.9 * length / margin.left
                    }
                    else {
                        return 1.7 * length / margin.left
                    }
                })
                .attr("height", function () {
                    if (width < 400) {
                        return 0.9 * length / margin.left
                    }
                    else {
                        return 1.7 * length / margin.left
                    }
                })
                .attr("fill", "#386cb0")

            svg.append("rect")
                .attr("x", function () {
                    if (width < 400) {
                        return width + (0.6 * width / margin.left)
                    }
                    else {
                        return width + (2 * width / margin.left)
                    }
                })
                .attr("y", (height / margin.bottom) * height / margin.bottom)
                .attr("width", function () {
                    if (width < 400) {
                        return 0.9 * length / margin.left
                    }
                    else {
                        return 1.7 * length / margin.left
                    }
                })
                .attr("height", function () {
                    if (width < 400) {
                        return 0.9 * length / margin.left
                    }
                    else {
                        return 1.7 * length / margin.left
                    }
                })
                .attr("fill", "#fb9a99")

            svg.append("rect")
                .attr("x", function () {
                    if (width < 400) {
                        return width + (0.6 * width / margin.left)
                    }
                    else {
                        return width + (2 * width / margin.left)
                    }
                })
                .attr("y", ((height / margin.bottom) / 2.7) * (height / margin.bottom) * height / margin.bottom)
                .attr("width", function () {
                    if (width < 400) {
                        return 0.9 * length / margin.left
                    }
                    else {
                        return 1.7 * length / margin.left
                    }
                })
                .attr("height", function () {
                    if (width < 400) {
                        return 0.9 * length / margin.left
                    }
                    else {
                        return 1.7 * length / margin.left
                    }
                })
                .attr("fill", "#fdc086")

            svg.append("rect")
                .attr("x", function () {
                    if (width < 400) {
                        return width + (0.6 * width / margin.left)
                    }
                    else {
                        return width + (2 * width / margin.left)
                    }
                })
                .attr("y", ((height / margin.bottom) / 1.85) * (height / margin.bottom) * height / margin.bottom)
                .attr("width", function () {
                    if (width < 400) {
                        return 0.9 * length / margin.left
                    }
                    else {
                        return 1.7 * length / margin.left
                    }
                })
                .attr("height", function () {
                    if (width < 400) {
                        return 0.9 * length / margin.left
                    }
                    else {
                        return 1.7 * length / margin.left
                    }
                })
                .attr("fill", "#beaed4")

            svg.append("rect")
                .attr("x", function () {
                    if (width < 400) {
                        return width + (0.6 * width / margin.left)
                    }
                    else {
                        return width + (2 * width / margin.left)
                    }
                })
                .attr("y", ((height / margin.bottom) / 1.4) * (height / margin.bottom) * height / margin.bottom)
                .attr("width", function () {
                    if (width < 400) {
                        return 0.9 * length / margin.left
                    }
                    else {
                        return 1.7 * length / margin.left
                    }
                })
                .attr("height", function () {
                    if (width < 400) {
                        return 0.9 * length / margin.left
                    }
                    else {
                        return 1.7 * length / margin.left
                    }
                })
                .attr("fill", "#7fc97f")

            // Legend rectangles and labels with matching colors/order
            // Vodka
            svg.append("rect")
                .attr("x", function () {
                    if (width < 400) {
                        return width + (0.6 * width / margin.left)
                    }
                    else {
                        return width + (2 * width / margin.left)
                    }
                })
                .attr("y", height / margin.bottom)
                .attr("width", function () {
                    if (width < 400) {
                        return 0.9 * length / margin.left
                    }
                    else {
                        return 1.7 * length / margin.left
                    }
                })
                .attr("height", function () {
                    if (width < 400) {
                        return 0.9 * length / margin.left
                    }
                    else {
                        return 1.7 * length / margin.left
                    }
                })
                .attr("fill", "#9e4a97");
            svg.append("text")
                .text("Vodka")
                .attr("x", function () {
                    if (width < 500 && width > 400) {
                        return width + (5 * width / margin.left)
                    }
                    else if (width < 400) {
                        return width + (2 * width / margin.left)
                    }
                    else {
                        return width + (6 * width / margin.left)
                    }
                })
                .attr("y", function () {
                    if (width < 500 && width > 400) {
                        return height / margin.bottom + (1.3 * length / margin.left)
                    }
                    else if (width < 400) {
                        return height / margin.bottom + (0.7 * length / margin.left)
                    }
                    else {
                        return height / margin.bottom + (1.7 * length / margin.left)
                    }
                })
                .attr("class", "legend-value")
                .style("font-weight", "bold")
                .style("fill", "#9e4a97");

            // Soda
            svg.append("rect")
                .attr("x", function () {
                    if (width < 400) {
                        return width + (0.6 * width / margin.left)
                    }
                    else {
                        return width + (2 * width / margin.left)
                    }
                })
                .attr("y", (height / margin.bottom) * height / margin.bottom)
                .attr("width", function () {
                    if (width < 400) {
                        return 0.9 * length / margin.left
                    }
                    else {
                        return 1.7 * length / margin.left
                    }
                })
                .attr("height", function () {
                    if (width < 400) {
                        return 0.9 * length / margin.left
                    }
                    else {
                        return 1.7 * length / margin.left
                    }
                })
                .attr("fill", "#5da899");
            svg.append("text")
                .text("Soda")
                .attr("x", function () {
                    if (width < 500 && width > 400) {
                        return width + (5 * width / margin.left)
                    }
                    else if (width < 400) {
                        return width + (2 * width / margin.left)
                    }
                    else {
                        return width + (6 * width / margin.left)
                    }
                })
                .attr("y", function () {
                    if (width < 500 && width > 400) {
                        return ((height / margin.bottom) * height / margin.bottom + (1.3 * length / margin.left));
                    }
                    else if (width < 400) {
                        return ((height / margin.bottom) * height / margin.bottom + (0.7 * length / margin.left));
                    }
                    else {
                        return ((height / margin.bottom) * height / margin.bottom + (1.7 * length / margin.left));
                    }
                })
                .attr("class", "legend-value")
                .style("font-weight", "bold")
                .style("fill", "#5da899");

            // Peanut
            svg.append("rect")
                .attr("x", function () {
                    if (width < 400) {
                        return width + (0.6 * width / margin.left)
                    }
                    else {
                        return width + (2 * width / margin.left)
                    }
                })
                .attr("y", ((height / margin.bottom) / 2.7) * (height / margin.bottom) * height / margin.bottom)
                .attr("width", function () {
                    if (width < 400) {
                        return 0.9 * length / margin.left
                    }
                    else {
                        return 1.7 * length / margin.left
                    }
                })
                .attr("height", function () {
                    if (width < 400) {
                        return 0.9 * length / margin.left
                    }
                    else {
                        return 1.7 * length / margin.left
                    }
                })
                .attr("fill", "#dccd7d");
            svg.append("text")
                .text("Peanut")
                .attr("x", function () {
                    if (width < 500 && width > 400) {
                        return width + (5 * width / margin.left)
                    }
                    else if (width < 400) {
                        return width + (2 * width / margin.left)
                    }
                    else {
                        return width + (6 * width / margin.left)
                    }
                })
                .attr("y", function () {
                    if (width < 500 && width > 400) {
                        return ((height / margin.bottom) / 2.7) * (height / margin.bottom) * height / margin.bottom + (1.3 * length / margin.left);
                    }
                    else if (width < 400) {
                        return ((height / margin.bottom) / 2.7) * (height / margin.bottom) * height / margin.bottom + (0.7 * length / margin.left);
                    }
                    else {
                        return ((height / margin.bottom) / 2.7) * (height / margin.bottom) * height / margin.bottom + (1.7 * length / margin.left);
                    }
                })
                .attr("class", "legend-value")
                .style("font-weight", "bold")
                .style("fill", "#dccd7d");

            // Water
            svg.append("rect")
                .attr("x", function () {
                    if (width < 400) {
                        return width + (0.6 * width / margin.left)
                    }
                    else {
                        return width + (2 * width / margin.left)
                    }
                })
                .attr("y", ((height / margin.bottom) / 1.85) * (height / margin.bottom) * height / margin.bottom)
                .attr("width", function () {
                    if (width < 400) {
                        return 0.9 * length / margin.left
                    }
                    else {
                        return 1.7 * length / margin.left
                    }
                })
                .attr("height", function () {
                    if (width < 400) {
                        return 0.9 * length / margin.left
                    }
                    else {
                        return 1.7 * length / margin.left
                    }
                })
                .attr("fill", "#94caec");
            svg.append("text")
                .text("Water")
                .attr("x", function () {
                    if (width < 500 && width > 400) {
                        return width + (5 * width / margin.left)
                    }
                    else if (width < 400) {
                        return width + (2 * width / margin.left)
                    }
                    else {
                        return width + (6 * width / margin.left)
                    }
                })
                .attr("y", function () {
                    if (width < 500 && width > 400) {
                        return ((height / margin.bottom) / 1.85) * (height / margin.bottom) * height / margin.bottom + (1.3 * length / margin.left)
                    }
                    else if (width < 400) {
                        return ((height / margin.bottom) / 1.85) * (height / margin.bottom) * height / margin.bottom + (0.7 * length / margin.left)
                    }
                    else {
                        return ((height / margin.bottom) / 1.85) * (height / margin.bottom) * height / margin.bottom + (1.7 * length / margin.left)
                    }
                })
                .attr("class", "legend-value")
                .style("font-weight", "bold")
                .style("fill", "#94caec");

            // Sandwich
            svg.append("rect")
                .attr("x", function () {
                    if (width < 400) {
                        return width + (0.6 * width / margin.left)
                    }
                    else {
                        return width + (2 * width / margin.left)
                    }
                })
                .attr("y", ((height / margin.bottom) / 1.4) * (height / margin.bottom) * height / margin.bottom)
                .attr("width", function () {
                    if (width < 400) {
                        return 0.9 * length / margin.left
                    }
                    else {
                        return 1.7 * length / margin.left
                    }
                })
                .attr("height", function () {
                    if (width < 400) {
                        return 0.9 * length / margin.left
                    }
                    else {
                        return 1.7 * length / margin.left
                    }
                })
                .attr("fill", "#c36a76");
            svg.append("text")
                .text("Sandwich")
                .attr("x", function () {
                    if (width < 500 && width > 400) {
                        return width + (5 * width / margin.left)
                    }
                    else if (width < 400) {
                        return width + (2 * width / margin.left)
                    }
                    else {
                        return width + (6 * width / margin.left)
                    }
                })
                .attr("y", function () {
                    if (width < 500 && width > 400) {
                        return ((height / margin.bottom) / 1.4) * (height / margin.bottom) * height / margin.bottom + (1.3 * length / margin.left)
                    }
                    else if (width < 400) {
                        return ((height / margin.bottom) / 1.4) * (height / margin.bottom) * height / margin.bottom + (0.7 * length / margin.left)
                    }
                    else {
                        return ((height / margin.bottom) / 1.4) * (height / margin.bottom) * height / margin.bottom + (1.7 * length / margin.left)
                    }
                })
                .attr("class", "legend-value")
                .style("font-weight", "bold")
                .style("fill", "#c36a76");

        });

    }

    render() {
        return (
            <div id="graph_box" className='graphBox' style={{ width: '100%', height: '100%' }}>

            </div>
        );
    }
}

export default StackedBarChart2Mini;