import React, { Component } from 'react';
import * as d3 from 'd3'
import { Container, Col, Row, Navbar, Button, ButtonGroup, ToggleButton, Form, InputGroup } from 'react-bootstrap';
import '../App.css';
import data from './data/BubbleChart.csv';
import img3 from '../components/data/Mini-VLAT/BubbleChart.png'



class BubbleChartMini extends Component {

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
        //https://en.wikipedia.org/wiki/List_of_metro_systems
        //https://www.d3-graph-gallery.com/bubble
        var e = document.getElementById("graph_box");
        let length = Math.min(e.clientWidth, e.clientHeight);

        if (length < 570) {
            const margin = { top: length / 7, right: length / 9, bottom: length / 7, left: length / 9 },
                width = length - margin.left - margin.right,
                height = length - margin.top - margin.bottom;

            d3.select("#graph_box").select("svg").remove();
            const svg = d3.select("#graph_box")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")

            //svg.append("text").attr("class", 'bubbleTitle').text("Metro System of the World").style("font-weight", 'bolder').attr('x', 1.2 * margin.top).attr('y', 1.2 * margin.top).style('font-size', 0.04 * height)

            var image = svg.append('image').attr('width', 1.2 * width).attr('x', 0).attr('y', margin.top * height / width).attr('xlink:href', img3).attr('height', 1.1 * height)
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
                .attr("transform", `translate(${margin.left},${margin.top})`)


            d3.csv(data).then(function (data) {
                data.forEach(function (d) {
                    d.City = d.City;
                    d.Length = parseInt(d.Length);
                    d.NumberofStations = parseInt(d.NumberofStations);
                    d.Ridership = parseFloat(d.Ridership);
                })
                // Add X axis
                var x = d3.scaleLinear()
                    .domain([150, 800])
                    .range([0, width]);
                svg.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x))

                // Add Y axis
                var y = d3.scaleLinear()
                    .domain([150, 500])
                    .range([height, 0]);
                svg.append("g")
                    .attr("class", "y-axis")
                    .call(d3.axisLeft(y))

                // Add a scale for bubble size
                var z = d3.scaleLinear()
                    .domain([0, 5])
                    .range([0, length / 20]);

                // Add dots
                var dots = svg.append('g')
                    .selectAll("dot")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) {
                        return x(d.NumberofStations);
                    })
                    .attr("cy", function (d) {
                        return y(d.Length);
                    })
                    .attr("r", function (d) {
                        return z(d.Ridership);
                    })
                    .style("fill", "#3182bd")
                    .style("opacity", "0.7")
                    .attr("stroke", "black")

                svg.selectAll("g")
                    .selectAll("text")
                    .data(data)
                    .enter()
                    .append("text")
                    .attr("class", "x-label")
                    .attr("x", function (d) {
                        if (d.City === "Tokyo") {
                            return x(d.NumberofStations) + z(d.Ridership) + z(d.Ridership) / 4;
                        }
                        else {
                            return x(d.NumberofStations) + z(d.Ridership) + z(d.Ridership) / 2;
                        }
                    })
                    .attr("y", function (d) {
                        if (d.City === "Tokyo") {
                            return y(d.Length) + z(d.Ridership) - z(d.Ridership) / 2 - z(d.Ridership) / 2;
                        }
                        else {
                            return y(d.Length) + z(d.Ridership) - z(d.Ridership) / 2;
                        }
                    })
                    .attr("font-family", "sans-serif")
                    .text(function (d) {
                        return d.City;
                    });


                function make_x_gridlines() {
                    return d3.axisBottom(x).ticks(8);
                }

                // gridlines in y axis function
                function make_y_gridlines() {
                    return d3.axisLeft(y)
                        .ticks(11)
                }
                svg.append("g")
                    .attr("class", "grid")
                    .attr("transform", "translate(0," + height + ")")
                    .call(make_x_gridlines()
                        .tickSize(-height)
                        .tickFormat("").ticks(11)
                    )

                // add the Y gridlines
                svg.append("g")
                    .attr("class", "grid")
                    .call(make_y_gridlines()
                        .tickSize(-width)
                        .tickFormat("")
                    )

                var size = d3.scaleSqrt()
                    .domain([0, 5])  // What's in the data, let's say it is percentage
                    .range([0, 40])  // Size in pixel

                // Add legend: circles
                var valuesToShow = [3.5, 2.5, 1.5]
                var xCircle = width / 6
                var xLabel = height / 2

                svg.append("text")
                    .attr("class", "legend-title")
                    .attr("x", function () {
                        if (width < 400) {
                            return width + (0.1 * width / margin.left)
                        }
                        else {
                            return width + (2 * width / margin.left)
                        }
                    })
                    .attr("y", function () {
                        if (width < 400) {
                            return 0.5 * height / margin.bottom
                        }
                        else {
                            return height / margin.bottom
                        }
                    })
                    .style("font-weight", "bold")
                    .text("Ridership")

                svg.append("text")
                    .attr("class", "legend-title")
                    .attr("x", function () {
                        if (width < 400) {
                            return 0.94 * width + width / height
                        }
                        else {
                            return width + width / height
                        }
                    })
                    .attr("y", function () {
                        if (width < 400) {
                            return height / (0.8 * margin.bottom)
                        }
                        else {
                            return height / (0.3 * margin.bottom)
                        }
                    })
                    .style("font-weight", "bold")
                    .text("(bn per year)")

                svg
                    .selectAll("legend")
                    .data(valuesToShow)
                    .enter()
                    .append("circle")
                    .attr("cx", xCircle * 6 + margin.left / 3.5)
                    .attr("cy", function () {
                        if (width < 500) {
                            return xLabel / 4.0;
                        }
                        else {
                            return xLabel / 5.5;
                        }
                    })
                    .attr("r", z(3.5))
                    .style("fill", "none")
                    .attr("stroke", "black")

                svg
                    .selectAll("legend")
                    .data(valuesToShow)
                    .enter()
                    .append("circle")
                    .attr("cx", xCircle * 6 + margin.left / 3.5)
                    .attr("cy", function () {
                        if (width < 500) {
                            return xLabel / 4.0 + 2.8 * z(2.5)
                        }
                        else {
                            return xLabel / 5.5 + 2.8 * z(2.5)
                        }
                    })
                    .attr("r", z(2.5))
                    .style("fill", "none")
                    .attr("stroke", "black")

                svg
                    .selectAll("legend")
                    .data(valuesToShow)
                    .enter()
                    .append("circle")
                    .attr("cx", xCircle * 6 + margin.left / 3.5)
                    .attr("cy", function () {
                        if (width < 500) {
                            return xLabel / 1.6 - (0.3) * z(2.5)
                        }
                        else {
                            return xLabel / 1.9 - (0.3) * z(2.5);
                        }
                    })
                    .attr("r", z(1.5))
                    .style("fill", "none")
                    .attr("stroke", "black")
                // Add legend: labels
                svg
                    .selectAll("legend")
                    .data(valuesToShow)
                    .enter()
                    .append("text")
                    .attr("class", "legend-value")
                    .attr('x', xCircle * 6 + margin.left / 1.7)
                    .attr('y', function () {
                        if (width < 500) {
                            return xLabel / 4.0
                        }
                        else {
                            return xLabel / 5.5
                        }
                    })
                    .text(3.5)
                    .attr('alignment-baseline', 'middle')

                svg
                    .selectAll("legend")
                    .data(valuesToShow)
                    .enter()
                    .append("text")
                    .attr("class", "legend-value")
                    .attr('x', xCircle * 6 + margin.left / 1.7)
                    .attr('y', function () {
                        if (width < 500) {
                            return xLabel / 4.0 + 2.8 * z(2.5);
                        }
                        else {
                            return xLabel / 5.5 + 2.8 * z(2.5);
                        }
                    })
                    .text(2.5)
                    .attr('alignment-baseline', 'middle')

                svg
                    .selectAll("legend")
                    .data(valuesToShow)
                    .enter()
                    .append("text")
                    .attr("class", "legend-value")
                    .attr('x', xCircle * 6 + margin.left / 1.7)
                    .attr('y', function () {
                        if (width < 500) {
                            return xLabel / 1.6 - (0.3) * z(2.5);
                        }
                        else {
                            return xLabel / 1.9 - (0.3) * z(2.5);
                        }
                    })
                    .text(1.5)
                    .attr('alignment-baseline', 'middle')

                svg.append("text")
                    .attr("class", "y-label")
                    .attr("transform", "rotate(-90)")
                    .attr("y", function () {
                        if (width > 400 && width < 500) {
                            return 0 - margin.left + (margin.top / 6.5) * e.clientWidth / e.clientHeight
                        }
                        else if (width < 400) {
                            return 0 - margin.left + 0.05 * (margin.top / 9.5) * e.clientWidth / e.clientHeight
                        }
                        else {
                            return 0 - margin.left + (margin.top / 2.5) * e.clientWidth / e.clientHeight
                        }
                    })
                    .attr("x", 0 - (height / 1.9))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Total System Length (Km)")
                    .style("font-weight", "bold")

                svg.append("text")
                    .attr("class", "x-label")
                    .attr("transform", function () {
                        if (width < 500) {
                            return "translate(" + (width / 1.9) + " ," + (height + 1.4 * margin.top - (margin.top / 1.5)) + ")"
                        }
                        else {
                            return "translate(" + (width / 1.9) + " ," + (height + 1.1 * margin.top - (margin.top / 1.5)) + ")"
                        }
                    })
                    .style("text-anchor", "middle")
                    .style("font-weight", "bold")
                    .text("Number of Stations")

                svg
                    .append("text")
                    .attr("class", "title")
                    .attr("x", width / 3)
                    .attr("y", -length / margin.top)    // +20 to adjust position (lower)
                    .text("Metro Systems of the World")
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

export default BubbleChartMini;