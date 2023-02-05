import React, { Component } from 'react';
import * as d3 from 'd3'
import { Container, Col, Row, Navbar, Button, ButtonGroup, ToggleButton, Form, InputGroup } from 'react-bootstrap';
import '../App.css';
import data from './data/BarGraph.csv';
import img9 from '../components/data/Mini-VLAT/BarChart.png'



class BarChartMini extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //var e = document.getElementById("graph_box");
        //e.addEventListener('resize', this.divResize.bind(this))
        this.drawChart()
    }

    divResize(e) {
        console.log('div was resized', e)
    }

    componentDidUpdate() {
        this.drawChart()
    }

    drawChart() {
        //https://www.speedtest.net/global-index (for October 21)
        //https://www.d3-graph-gallery.com/graph/barplot_ordered.html
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
            //svg.append("text").attr("class", 'bubbleTitle').text("Average Internet Speeds in Asia").style("font-weight", 'bolder').attr('x', 1.2 * margin.top).attr('y', 1.2 * margin.top).style('font-size', 0.04 * height)

            var image = svg.append('image').attr('width', 1.2 * width).attr('x', 0).attr('y', margin.top * height / width).attr('xlink:href', img9).attr('height', 1.1 * height)

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

            d3.csv(data).then(function (data) {
                data.forEach(function (d) {
                    d.Speed = parseFloat(d.Speed);
                    d.Country = d.Country;
                })
                const x = d3.scaleBand()
                    .range([0, width])
                    .domain(data.map(d => d.Country))
                    .padding(0.3);

                svg.append("g")
                    .attr("transform", `translate(0, ${height})`)
                    .call(d3.axisBottom(x))
                    .selectAll("text")
                    .attr("y", 10)
                    .attr("x", 9)
                    .attr("class", "x-axis")
                    .attr("dy", ".35em")
                    .attr("transform", "rotate(40)")
                    .style("text-anchor", "start")
                // .attr("transform", "translate(10,-10)rotate(-180)")
                //.style("text-anchor", "end");

                // Add Y axis
                const y = d3.scaleLinear()
                    .domain([5, 100])
                    .range([height, 0]);

                svg.append("g")
                    .call(d3.axisLeft(y).tickSizeOuter(0))
                    .selectAll("text")
                    .attr("class", "y-axis");

                function make_y_axis() {
                    return d3.axisLeft(y).ticks(11).tickSizeInner(-width + margin.left + margin.right);
                }


                svg.append("g")
                    .attr("class", "grid")
                    .call(make_y_axis()
                        .tickSize(-width, 0, 0)
                        .tickFormat("")
                        .tickSizeOuter(0)
                    )

                // Bars
                svg.selectAll("mybar")
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("x", d => x(d.Country))
                    .attr("y", d => y(d.Speed))
                    .attr("width", x.bandwidth())
                    .attr("height", d => height - y(d.Speed))
                    .attr("fill", "#3182bd")

                svg.append("text")
                    .attr("class", "y-label")
                    .attr("transform", "rotate(-90)")
                    .attr("y", function () {
                        if (Math.min(length, height) < 500) {
                            return 0.1 * margin.left + (- 3 * margin.top / 2.5) * e.clientWidth / e.clientHeight
                        }
                        else {
                            return 0 - margin.left + (margin.top / 2.5) * e.clientWidth / e.clientHeight
                        }
                    })
                    .attr("x", 0 - (height / 1.9))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Internet Speed (Mbps)")
                    .style("font-weight", "bold")

                svg
                    .append("text")
                    .attr("x", width / 4)
                    .attr("y", -3 * length / margin.top)    // +20 to adjust position (lower)
                    .text("Global Internet Speed (Mbps)")
                    .attr("class", "title")
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

export default BarChartMini;