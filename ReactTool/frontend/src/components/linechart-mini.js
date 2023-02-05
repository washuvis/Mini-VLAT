import React, { Component } from 'react';
import * as d3 from 'd3'
import * as topojson from 'topojson';
import { Container, Col, Row, Navbar, Button, ButtonGroup, ToggleButton, Form, InputGroup } from 'react-bootstrap';
import '../App.css';
import img12 from '../components/data/Mini-VLAT/LineChart.png';


class LineChartMini extends Component {

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
        //https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s=RWTC&f=M
        //https://www.d3-graph-gallery.com/line

        var e = document.getElementById("graph_box");
        const length = Math.min(e.clientHeight, e.clientWidth)

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

            //svg.append("text").attr("class", 'bubbleTitle').text("Monthly Oil Price History in 2015").style("font-weight", 'bolder').attr('x', 1.2 * margin.top).attr('y', 1.2 * margin.top).style('font-size', 0.04 * height)

            var image = svg.append('image').attr('width', 1.2 * width).attr('x', 0).attr('y', margin.top * height / width).attr('xlink:href', img12).attr('height', 1.1 * height)

        }
        else {
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
            // svg.append("text").attr("class", 'bubbleTitle').text("Monthly Oil Price History in 2015").style("font-weight", 'bolder').attr('x', 1.2 * margin.top).attr('y', 1.2 * margin.top).style('font-size', 0.04 * height)

            // var image = svg.append('image').attr('width', 1.2 * width).attr('x', 0).attr('y', margin.top * height / width).attr('xlink:href', img12).attr('height', 1.1 * height)

            var data = [57.52, 50.54, 29.21, 16.55, 28.56, 38.31, 40.71, 42.34, 39.63, 39.4, 40.94, 47.02]


            var xScale = d3.scaleTime()
                .domain([new Date(2020, 0, 1), new Date(2020, 11, 31)]).range([0, width])

            svg.append("g")
                //.attr("class", "axis")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%B")))
                /*
                .style("font-size", function() {
                    if (length < 700){
                        return (length/margin.top)
                    }
                    else {
                        return 1.3*(length/margin.top)
                    }
                }) */
                .selectAll("text")
                .attr("class", "x-axis")
                .attr("transform", function () {
                    if (width < 500) {
                        return "rotate(25)"
                    }
                    else {
                        return "rotate(15)"
                    }
                })
                .attr("x", function () {
                    if (length < 900) {
                        return 2 * length / margin.right
                    }
                })
                .attr("y", function () {
                    if (width < 950 && width > 400) {
                        return (2.5) * length / margin.right
                    }
                    else if (width < 400) {
                        return (1.5) * length / margin.right
                    }
                })
                .attr("dy", function () {
                    return "0.3em"
                })


            // Add Y axis
            var yScale = d3.scaleLinear()
                .domain([0, 60])
                .range([height, 0]);

            svg.append("g")
                //.attr("class", "axis")
                .call(d3.axisLeft(yScale))
                .selectAll("text")
                .attr("class", "y-axis");

            var x = d3.scaleLinear().domain([0, data.length]).range([0, width]);
            var y = d3.scaleLinear().domain([0, 60]).range([height, 0]);
            var line = d3.line()
                .x(function (d, i) {
                    return x(i);
                })
                .y(function (d) {
                    return y(d);
                })

            // Add the line
            svg.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "#3182bd")
                .attr("stroke-width", function () {
                    if (length < 700) {
                        return 1.5
                    }
                    else {
                        return 2.5
                    }
                })
                .attr("d", line(data));

            function make_x_gridlines() {
                return d3.axisBottom(xScale)
                    .ticks(11)
            }

            // gridlines in y axis function
            function make_y_gridlines() {
                return d3.axisLeft(yScale)
                    .ticks(11)
            }
            svg.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(0," + height + ")")
                .call(make_x_gridlines()
                    .tickSize(-height)
                    .tickFormat("")
                )

            // add the Y gridlines
            svg.append("g")
                .attr("class", "grid")
                .call(make_y_gridlines()
                    .tickSize(-width)
                    .tickFormat("")
                )

            svg.selectAll("myCircles")
                .data(data)
                .enter()
                .append("circle")
                .attr("fill", "#3182bd")
                .attr("stroke", "none")
                .attr("cx", function (d, i) { return x(i) })
                .attr("cy", function (d) { return y(d) })
                .attr("r", function () {
                    if (length < 700) {
                        return "2";
                    }
                    else {
                        return "4"
                    }
                })

            svg.append("text")
                .attr("class", "y-label")
                .attr("transform", "rotate(-90)")
                .attr("y", function () {
                    if (width < 500 && width > 400) {
                        return 0 - margin.left + (margin.top / 5.5) * e.clientWidth / e.clientHeight
                    }
                    else if (width < 400) {
                        return 0 - margin.left + (margin.top / 8.5) * e.clientWidth / e.clientHeight
                    }
                    else {
                        return 0 - margin.left + (margin.top / 2.5) * e.clientWidth / e.clientHeight
                    }
                })
                .attr("x", 0 - (height / 1.9))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Oil Price ($)")
                .style("font-weight", "bold")

            svg
                .append("text")
                .attr("class", "title")
                .attr("x", width / 2.5)
                .attr("y", -length / margin.top)    // +20 to adjust position (lower)
                .text("Oil Prices in 2020")
                .attr("fill", "black")
                .style("font-weight", "bold")

            svg.append("text")
                .attr("class", "x-label")
                .attr("transform", function () {
                    if (width < 500 && width > 400) {
                        return "translate(" + (width / 1.9) + " ," + (height + 1.6 * margin.top - (margin.top / 1.5)) + ")"
                    }
                    else if (width < 400) {
                        return "translate(" + (width / 1.9) + " ," + (height + 1.6 * margin.top - (margin.top / 1.5)) + ")"
                    }
                    else {
                        return "translate(" + (width / 1.9) + " ," + (height + 1.1 * margin.top - (margin.top / 1.5)) + ")"
                    }
                })
                .style("text-anchor", "middle")
                .style("font-weight", "bold")
                .text("Month")


        }


    }


    render() {

        return (
            <div id={'graph_box'}>
            </div>
        );
    }
}

export default LineChartMini;