import React, { Component } from 'react';
import * as d3 from 'd3'
import * as topojson from 'topojson';
import { Container, Col, Row, Navbar, Button, ButtonGroup, ToggleButton, Form, InputGroup } from 'react-bootstrap';
import '../App.css';
import data from './data/scatter-2.csv';
import img1 from '../components/data/Mini-VLAT/Scatterplot.png'



class ScatterPlotMini extends Component {

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
        //http://wiki.stat.ucla.edu/socr/index.php/SOCR_Data_Dinov_020108_HeightsWeights
        //https://www.d3-graph-gallery.com/graph/scatter_basic.html
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
            //svg.append("text").attr("class", 'bubbleTitle').text("Height and Weight of 85 Males").style("font-weight", 'bolder').attr('x', 1.2 * margin.top).attr('y', 1.2 * margin.top).style('font-size', 0.04 * height)

            var image = svg.append('image').attr('width', 1.2 * width).attr('x', 0).attr('y', margin.top * height / width).attr('xlink:href', img1).attr('height', 1.1 * height)
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
                    d.Height = parseFloat(d.Height);
                    d.Weight = parseFloat(d.Weight);
                })
                const x = d3.scaleLinear()
                    .domain([155, 190])
                    .range([0, width]);

                svg.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", `translate(0, ${height})`)
                    .call(d3.axisBottom(x))

                // Add Y axis
                const y = d3.scaleLinear()
                    .domain([40, 75])
                    .range([height, 0]);

                svg.append("g")
                    .attr("class", "y-axis")
                    .call(d3.axisLeft(y))


                function make_x_gridlines() {
                    return d3.axisBottom(x)
                        .ticks(5)
                }

                // gridlines in y axis function
                function make_y_gridlines() {
                    return d3.axisLeft(y)
                        .ticks(8)
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
                // Add dots
                svg.append('g')
                    .selectAll("dot")
                    .data(data)
                    .join("circle")
                    .attr("cx", function (d) { return x(d.Height); })
                    .attr("cy", function (d) { return y(d.Weight); })
                    .attr("r", 3.0)
                    .style("fill", "#3182bd")

                svg.append("text")
                    .attr("class", "y-label")
                    .attr("transform", "rotate(-90)")
                    .attr("y", function () {
                        if (width < 400) {
                            return 0 - margin.left + (margin.top / 8.5) * e.clientWidth / e.clientHeight
                        }
                        else {
                            return 0 - margin.left + (margin.top / 2.5) * e.clientWidth / e.clientHeight
                        }
                    })
                    .attr("x", 0 - (height / 1.9))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Weight (kg)")
                    .style("font-weight", "bold")

                svg
                    .append("text")
                    .attr("class", "title")
                    .attr("x", width / 4)
                    .attr("y", -length / margin.top)    // +20 to adjust position (lower)
                    .text("Weight and Height of 85 Individuals")
                    .attr("fill", "black")
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
                    .text("Height (cm)")


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

export default ScatterPlotMini;