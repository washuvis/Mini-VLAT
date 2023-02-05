import React, { Component } from 'react';
import * as d3 from 'd3'
import * as topojson from 'topojson';
import { Container, Col, Row, Navbar, Button, ButtonGroup, ToggleButton, Form, InputGroup } from 'react-bootstrap';
import '../App.css';
import data from './data/StackedArea.csv';
import img7 from '../components/data/Mini-VLAT/StackedArea.png'



class StackedAreaPlotMini extends Component {

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
        //https://www.theguardian.com/news/datablog/2011/jul/28/top-100-baby-names-oliver-olivia
        //https://www.theguardian.com/news/datablog/2010/oct/27/baby-names-children-oliver-olivia
        //https://www.theguardian.com/news/datablog/2012/aug/14/baby-names-2011-harry-amelia-data
        //https://www.theguardian.com/news/datablog/2013/aug/12/top-100-baby-names-2012-girls-boys-list
        //https://www.theguardian.com/news/datablog/2014/aug/15/the-top-100-baby-names-in-england-and-wales-2013
        //https://www.theguardian.com/news/datablog/ng-interactive/2015/aug/17/100-most-popular-baby-names-england-wales-full-list
        //https://www.d3-graph-gallery.com/stackedarea
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
            //svg.append("text").attr("class", 'bubbleTitle').text("Popular Girls' Names in UK").style("font-weight", 'bolder').attr('x', 1.2 * margin.top).attr('y', 1.2 * margin.top).style('font-size', 0.04 * height)
            var image = svg.append('image').attr('width', 1.4 * width).attr('x', 0).attr('y', margin.top * height / width).attr('xlink:href', img7).attr('height', 1.1 * height)
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

            const format = d3.timeFormat("%Y");

            d3.csv(data).then(function (data) {
                data.forEach(function (d) {
                    d.Isla = parseInt(d.Isla);
                    d.Amelia = parseInt(d.Amelia);
                    d.Olivia = parseInt(d.Olivia);
                    //d.Year = format(d.Year);
                })
                const keys = data.columns.slice(1)
                const stackedData = d3.stack()
                    .keys(keys)
                    (data)

                const color = d3.scaleOrdinal()
                    .range(['#3182bd', '#9ecae1', '#deebf7'])

                const x = d3.scaleLinear()
                    .domain(d3.extent(data, function (d) {
                        return d.Year;
                    }))
                    .range([0, width]);

                const y = d3.scaleLinear()
                    .domain([0, 19000])
                    .range([height, 0]);

                function make_x_gridlines() {
                    return d3.axisBottom(x)
                        .ticks(5)
                }

                svg.append("g")
                    .attr("class", "y-axis")
                    .call(d3.axisLeft(y))


                svg.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", `translate(0, ${height})`)
                    .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d")))


                svg.append("text")
                    .attr("class", "y-label")
                    .attr("transform", "rotate(-90)")
                    .attr("y", function () {
                        if (width < 500 && width > 400) {
                            return -1.4 * margin.left + (margin.top / 1.5) * e.clientWidth / e.clientHeight;
                        }
                        else if (width < 400) {
                            return -1.9 * margin.left + (margin.top / 1.5) * e.clientWidth / e.clientHeight;
                        }
                        else {
                            return - 1.3 * margin.left + (margin.top / 1.5) * e.clientWidth / e.clientHeight;
                        }
                    })
                    .attr("x", 0 - (height / 1.9))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Number of Girls")
                    .style("font-weight", "bold")
                    .style('font-size', function () {
                        if (width < 500) {
                            return "1.2vh"
                        }
                    })

                svg.append("text")
                    .attr("class", "x-label")
                    .attr("transform", function () {
                        if (width < 500) {
                            return "translate(" + (width / 1.9) + " ," + (height + 1.5 * margin.top - (margin.top / 1.5)) + ")"
                        }
                        else {
                            return "translate(" + (width / 1.9) + " ," + (height + 1.1 * margin.top - (margin.top / 1.5)) + ")"
                        }
                    })
                    .style("text-anchor", "middle")
                    .style("font-weight", "bold")
                    .text("Year")

                const areaChart = svg.append('g')
                    .attr("clip-path", "url(#clip)")

                const area = d3.area()
                    .x(function (d) {
                        return x(d.data.Year);
                    })
                    .y0(function (d) {
                        return y(d[0]);
                    })
                    .y1(function (d) {
                        return y(d[1]);
                    })

                areaChart
                    .selectAll("mylayers")
                    .data(stackedData)
                    .join("path")
                    .attr("class", function (d) {
                        return "myArea " + d.key
                    })
                    .style("fill", function (d) {
                        return color(d.key);
                    })
                    .attr("d", area)

                svg.append("g")
                    .attr("class", "grid")
                    .attr("transform", "translate(0," + height + ")")
                    .call(make_x_gridlines()
                        .tickSize(-height)
                        .tickFormat("")
                    )
                function make_y_gridlines() {
                    return d3.axisLeft(y)
                        .ticks(8)
                }

                // add the Y gridlines
                svg.append("g")
                    .attr("class", "grid")
                    .call(make_y_gridlines()
                        .tickSize(-width)
                        .tickFormat("")
                    )

                svg.append("rect")
                    .attr("x", function () {
                        if (width < 400) {
                            return width + (width / margin.left)
                        }
                        else {
                            return width + (2 * width / margin.left)
                        }
                    })
                    .attr("y", height / margin.bottom)
                    .attr("width", function () {
                        if (width < 500) {
                            return length / 30;
                        }
                        else {
                            return length / 50;
                        }
                    })
                    .attr("height", function () {
                        if (width < 500) {
                            return length / 30;
                        }
                        else {
                            return length / 50;
                        }
                    })
                    .attr("fill", "#deebf7")

                svg.append("rect")
                    .attr("x", function () {
                        if (width < 400) {
                            return width + (width / margin.left)
                        }
                        else {
                            return width + (2 * width / margin.left)
                        }
                    })
                    .attr("y", (height / margin.bottom) * height / margin.bottom)
                    .attr("width", function () {
                        if (width < 500) {
                            return length / 30;
                        }
                        else {
                            return length / 50;
                        }
                    })
                    .attr("height", function () {
                        if (width < 500) {
                            return length / 30;
                        }
                        else {
                            return length / 50;
                        }
                    })
                    .attr("fill", "#9ecae1")

                svg.append("rect")
                    .attr("x", function () {
                        if (width < 400) {
                            return width + (width / margin.left)
                        }
                        else {
                            return width + (2 * width / margin.left)
                        }
                    })
                    .attr("y", ((height / margin.bottom) / 2.8) * (height / margin.bottom) * height / margin.bottom)
                    .attr("width", function () {
                        if (width < 500) {
                            return length / 30;
                        }
                        else {
                            return length / 50;
                        }
                    })
                    .attr("height", function () {
                        if (width < 500) {
                            return length / 30;
                        }
                        else {
                            return length / 50;
                        }
                    })
                    .attr("fill", "#3182bd")

                svg.append("text")
                    .text("Olivia")
                    .attr("x", function () {
                        if (width < 500 && width > 400) {
                            return width + (2 * width / margin.left) + length / 25;
                        }
                        else {
                            return ((width + (2 * width / margin.left)) + length / 40);
                        }
                    })
                    .attr("y", function () {
                        if (width < 500) {
                            return height / margin.bottom + length / 45
                        }
                        else {
                            return (0.7 * (height / margin.bottom)) * height / margin.bottom
                        }
                    })
                    .attr("class", "legend-value")

                svg.append("text")
                    .text("Isla")
                    .attr("x", function () {
                        if (width < 500 && width > 400) {
                            return width + (2 * width / margin.left) + length / 25;
                        }
                        else {
                            return ((width + (2 * width / margin.left)) + length / 40);
                        }
                    })
                    .attr("y", function () {
                        if (width < 500) {
                            return (height / margin.bottom) * height / margin.bottom + length / 45;
                        }
                        else {
                            return (1.5) * (height / margin.bottom) * height / margin.bottom
                        }

                    })
                    .attr("class", "legend-value")

                svg.append("text")
                    .text("Amelia")
                    .attr("x", function () {
                        if (width < 500 && width > 400) {
                            return width + (2 * width / margin.left) + length / 25;
                        }
                        else {
                            return ((width + (2 * width / margin.left)) + length / 40);
                        }
                    })
                    .attr("y", function () {
                        if (width < 500) {
                            return ((height / margin.bottom) / 2.8) * (height / margin.bottom) * height / margin.bottom + length / 35
                        }
                        else {
                            return (1.25) * ((height / margin.bottom) / 2.7) * (height / margin.bottom) * height / margin.bottom
                        }

                    })
                    .attr("class", "legend-value")

                svg
                    .append("text")
                    .attr("class", "title")
                    .attr("x", function () {
                        if (width < 400) {
                            return width / 6
                        }
                        else {
                            return width / 3
                        }
                    })
                    .attr("y", -length / margin.top)    // +20 to adjust position (lower)
                    .text("Popular Girls' names in the UK")
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

export default StackedAreaPlotMini;