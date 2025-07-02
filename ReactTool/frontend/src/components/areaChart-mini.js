//Using monthly coffee price dataset 
import React, { Component } from 'react';
import * as d3 from 'd3'
import { Container, Col, Row, Navbar, Button, ButtonGroup, ToggleButton, Form, InputGroup } from 'react-bootstrap';
import '../App.css';
import data from './data/AreaChart-2.csv';
import img10 from '../components/data/Mini-VLAT/AreaChart.png'



class AreaChartMini extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.drawAreaChart()
    }
    divResize(e) {
        console.log('div was resized', e)
    }

    componentDidUpdate() {
        this.drawAreaChart()
    }


    drawAreaChart() {
        //https://www.ico.org/new_historical.asp
        //https://bl.ocks.org/interwebjill/8122dd08da9facf8c6ef6676be7da03f

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
            svg.append("text").attr("class", 'bubbleTitle').text("Average Coffee Bean Price from 2013 to 2014").style("font-weight", 'bolder').attr('x', 1.2 * margin.top).attr('y', 1.2 * margin.top).style('font-size', 0.04 * height)

            var image = svg.append('image').attr('width', 1.2 * width).attr('x', 0).attr('y', margin.top * height / width).attr('xlink:href', img10).attr('height', 1.1 * height)

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
                .attr("transform", `translate(${margin.left},${margin.top})`)

            var data = [0.8865, 0.8924, 0.8818, 0.8831, 0.8874, 0.8607, 0.8442, 0.8074, 0.7670, 0.8532, 0.8352, 0.7757, 0.7824, 0.7865, 0.7696, 0.7328, 0.7112, 0.7402, 0.7393, 0.7078, 0.7064, 0.6863, 0.7328, 0.7322]

            // Set up time scale for 24 months starting Jan 2018
            var months = [];
            for (let i = 0; i < data.length; i++) {
                months.push(new Date(2018, i, 1));
            }

            var xScale = d3.scaleTime()
                .domain([months[0], months[months.length - 1]])
                .range([0, width]);

            var yScale = d3.scaleLinear()
                .domain([0.5, 0.9])
                .range([height, 0]);

            // X gridlines
            function make_x_gridlines() {
                return d3.axisBottom(xScale).ticks(8);
            }
            // Y gridlines
            function make_y_gridlines() {
                return d3.axisLeft(yScale).ticks(11);
            }

            // Draw gridlines first (behind area)
            svg.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(0," + height + ")")
                .call(make_x_gridlines()
                    .tickSize(-height)
                    .tickFormat("")
                );

            svg.append("g")
                .attr("class", "grid")
                .call(make_y_gridlines()
                    .tickSize(-width)
                    .tickFormat("")
                );

            // Area chart
            var area = d3.area()
                .x(function (d, i) {
                    return xScale(months[i]);
                })
                .y0(height)
                .y1(function (d) {
                    return yScale(d);
                });

            svg.append("path")
                .datum(data)
                .attr("fill", "#0171b3")
                .attr("stroke-width", 1.5)
                .attr("opacity", 0.7)
                .attr("d", area);

            // X axis with custom tick format
            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0, ${height})`)
                .call(
                    d3.axisBottom(xScale)
                        .ticks(d3.timeMonth.every(3))
                        .tickFormat(d3.timeFormat("%b %Y"))
                );

            // Y axis
            svg.append("g")
                .attr("class", "y-axis")
                .call(d3.axisLeft(yScale));

            svg.append("text")
                .attr("class", "y-label")
                .attr("transform", "rotate(-90)")
                .attr("y", function () {
                    if (width < 500 && width > 400) {
                        return 0 - margin.left + 0.1 * (margin.top / 2.5) * e.clientWidth / e.clientHeight
                    }
                    else if (width < 400) {
                        return 0 - margin.left + 0.005 * (margin.top / 2.5) * e.clientWidth / e.clientHeight
                    }
                    else {
                        return 0 - margin.left + (margin.top / 2.5) * e.clientWidth / e.clientHeight
                    }
                })
                .attr("x", 0 - (height / 1.9))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Coffee Price ($/lb)")
                .style("font-weight", "bold")

            svg
                .append("text")
                .attr("class", "title")
                .attr("x", width / 3)
                .attr("y", -length / margin.top)
                .text("Robusta Coffee Price")
                .attr("fill", "black")
                .style("font-weight", "bold")
        }
    }


    render() {

        return (
            <div id={'graph_box'}>
            </div>
        );
    }
}

export default AreaChartMini;