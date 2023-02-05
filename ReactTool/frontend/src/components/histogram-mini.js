import React, { Component } from 'react';
import * as d3 from 'd3'
import * as topojson from 'topojson';
import { Container, Col, Row, Navbar, Button, ButtonGroup, ToggleButton, Form, InputGroup } from 'react-bootstrap';
import '../App.css';
import data from './data/Histogram-3-2.csv';
import img6 from '../components/data/Mini-VLAT/Histogram.png'



class HistogramMini extends Component {

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
        //https://www.kaggle.com/arashnic/taxi-pricing-with-mobility-analytics
        //https://www.d3-graph-gallery.com/graph/histogram_basic.html
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

            //svg.append("text").attr("class", 'bubbleTitle').text("Taxi Passenger Ratings").style("font-weight", 'bolder').attr('x', 1.2 * margin.top).attr('y', 1.0 * margin.top).style('font-size', 0.04 * height)

            var image = svg.append('image').attr('width', 1.4 * width).attr('x', 0).attr('y', margin.top * height / width).attr('xlink:href', img6).attr('height', 1.1 * height)

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

            // svg.append("text").attr("class", 'bubbleTitle').text("Taxi Passenger Ratings").style("font-weight", 'bolder').attr('x', 1.2 * margin.top).attr('y', 1.0 * margin.top).style('font-size', 0.04 * height)

            // var image = svg.append('image').attr('width', 1.4 * width).attr('x', 0).attr('y', margin.top * height / width).attr('xlink:href', img6).attr('height', 1.1 * height)

            d3.csv(data).then(function (data) {
                data.forEach(function (d) {
                    d.Trip_Distance = parseFloat(d.Trip_Distance);
                })
                var x = d3.scaleLinear()
                    .domain([d3.min(data, function (d) { return d.Trip_Distance }), 110])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
                    .range([0, width]);

                svg.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x))
                //.style("font-size", 1.3*(length/margin.top));

                var histogram = d3.histogram()
                    .value(function (d) {
                        return d.Trip_Distance;
                    })   // I need to give the vector of value
                    .domain(x.domain())  // then the domain of the graphic
                    .thresholds(x.ticks(10)); // then the numbers of bins

                var bins = histogram(data);

                var y = d3.scaleLinear()
                    .range([height, 0]);
                y.domain([0, 260]);   // d3.hist has to be called before the Y axis obviously

                svg.append("g")
                    .attr("class", "y-axis")
                    .call(d3.axisLeft(y))
                //.style("font-size", 1.3*(length/margin.top));

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

                // append the bar rectangles to the svg element
                svg.selectAll("rect")
                    .data(bins)
                    .enter()
                    .append("rect")
                    .attr("x", 1)
                    .attr("transform", function (d) {
                        return "translate(" + x(d.x0) + "," + y(d.length) + ")";
                    })
                    .attr("width", function (d) {
                        return x(d.x1) - x(d.x0);
                    })
                    .attr("height", function (d) {
                        return height - y(d.length);
                    })
                    .style("fill", "#3182bd")

                svg.append("text")
                    .attr("class", "y-label")
                    .attr("transform", "rotate(-90)")
                    .attr("y", function () {
                        if (width < 500 && width > 400) {
                            return -1.4 * margin.left + (margin.top / 2.5) * e.clientWidth / e.clientHeight
                        }
                        else if (width < 400) {
                            return -1.7 * margin.left + (margin.top / 2.5) * e.clientWidth / e.clientHeight
                        }
                        else {
                            return - margin.left + (margin.top / 2.5) * e.clientWidth / e.clientHeight
                        }
                    })
                    .attr("x", - (height / 1.9))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Number of Customers")
                    .style("font-weight", "bold")

                svg.append("text")
                    .attr("class", "x-label")
                    .attr("transform", function () {
                        if (width < 500 && width > 400) {
                            return "translate(" + (width / 1.9) + " ," + (height + 1.3 * margin.top - (margin.top / 1.5)) + ")"
                        }
                        else if (width < 400) {
                            return "translate(" + (width / 1.9) + " ," + (height + 1.5 * margin.top - (margin.top / 1.5)) + ")"
                        }
                        else {
                            return "translate(" + (width / 1.9) + " ," + (height + 1.1 * margin.top - (margin.top / 1.5)) + ")"
                        }
                    })
                    .style("text-anchor", "middle")
                    .style("font-weight", "bold")
                    .text("Distance (in Km)")

                svg
                    .append("text")
                    .attr("class", "title")
                    .attr("x", width / 3)
                    .attr("y", -length / margin.top)    // +20 to adjust position (lower)
                    .text("Trip Distance and Customers")
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

export default HistogramMini;