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
        const length = Math.min(e.clientHeight, e.clientWidth)

        if (length < 570) {
            const margin = { top: length / 7, right: length / 9, bottom: length / 7, left: length / 9 },
                width = length - margin.left - margin.right,
                height = length - margin.top - margin.bottom;


            // append the svg object to the body of the page
            d3.select("#graph_box").select("svg").remove();
            const svg = d3.select("#graph_box")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
            //.attr("transform", `translate(${margin.left},${margin.top})`);

            //svg.append("text").attr("class", 'bubbleTitle').text("Hotel Costs of Room Service").style("font-weight", 'bolder').attr('x', 1.2 * margin.top).attr('y', 1.2 * margin.top).style('font-size', 0.04 * height)

            var image = svg.append('image').attr('width', 1.2 * width).attr('x', 0).attr('y', margin.top * height / width).attr('xlink:href', img2).attr('height', 1.1 * height)

        }
        else {
            const margin = { top: length / 7, right: length / 7, bottom: length / 7, left: length / 7 },
                width = length - margin.left - margin.right,
                height = length - margin.top - margin.bottom;


            // append the svg object to the body of the page
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

                if (width < 500) {
                    svg.append("g")
                        .attr("class", "x-axis")
                        .attr("transform", `translate(0, ${height})`)
                        .call(d3.axisBottom(xScale).tickSizeOuter(0))
                        .selectAll("text")
                        .attr("dy", ".35em")
                        .attr("transform", "rotate(40)")
                        .style("text-anchor", "start")
                }
                else {
                    svg.append("g")
                        .attr("class", "x-axis")
                        .attr("transform", `translate(0, ${height})`)
                        .call(d3.axisBottom(xScale).tickSizeOuter(0))
                        .selectAll("text")
                }




                var yScale = d3.scaleLinear().domain([0, 70]).range([height, 0]);
                svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale)).selectAll("text")
                    .style("font-size", function () {
                        if (length < 700) {
                            return 1.4 * (length / margin.top)
                        }
                    })

                const color = d3.scaleOrdinal()
                    .domain(subgroups)
                    .range(['#7fc97f', '#beaed4', '#fdc086', '#fb9a99', '#386cb0'])

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

                svg.append("text")
                    .attr("class", "x-label")
                    .attr("transform", function () {
                        if (window.innerWidth < 500) {
                            return "translate(" + (width / 1.9) + " ," + (height + 1.6 * margin.top - (margin.top / 1.5)) + ")"
                        }
                        else {
                            return "translate(" + (width / 1.9) + " ," + (height + 1.1 * margin.top - (margin.top / 1.5)) + ")"
                        }
                    })
                    .style("text-anchor", "middle")
                    .style("font-weight", "bold")
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

                svg
                    .append("text")
                    .attr("class", "title")
                    .attr("x", width / 3)
                    .attr("y", -length / margin.top)    // +20 to adjust position (lower)
                    .text("Room Service Prices")
                    .attr("fill", "black")
                    .style("font-weight", "bold")
            })

        }
    }


    render() {

        return (
            <div id={'graph_box'}>
            </div>
        );
    }
}

export default StackedBarChart2Mini;