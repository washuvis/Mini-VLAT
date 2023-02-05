import React, { Component } from 'react';
import * as d3 from 'd3'
import * as topojson from 'topojson';
import { Container, Col, Row, Navbar, Button, ButtonGroup, ToggleButton, Form, InputGroup } from 'react-bootstrap';
import '../App.css';
import data from './data/Treemap.json';
import img4 from '../components/data/Mini-VLAT/TreeMap.png'



class TreeMapMini extends Component {

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
        //Data Source: Nielsen Top 100 January 2010 Unique Visitors
        //https://www.d3-graph-gallery.com/treemap.html
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
            //svg.append("text").attr("class", 'bubbleTitle').text("The Number of Unique Visitors for Websites in 2010").style("font-weight", 'bolder').attr('x', 1.2 * margin.top).attr('y', 1.2 * margin.top).style('font-size', 0.04 * height)

            var image = svg.append('image').attr('width', 1.2 * width).attr('x', 0).attr('y', margin.top * height / width).attr('xlink:href', img4).attr('height', 1.1 * height)
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

            svg.append("rect").attr("width", "100%").attr("height", "100%").attr("fill", "black")


            // Give the data to this cluster layout:
            const root = d3.hierarchy(data).sum(function (d) {
                return d.value
            }) // Here the size of each leave is given in the 'value' field in input data


            // Then d3.treemap computes the position of each element of the hierarchy
            d3.treemap()
                .size([width, height])
                .paddingTop(25)
                .paddingRight(7)
                .paddingInner(3)      // Padding between each rectangle
                //.paddingOuter(1)
                //.padding(20)
                (root)

            // prepare a color scale
            const color = d3.scaleOrdinal()
                .domain(["boss1", "boss2", "boss3", "boss4", "boss5"])
                .range(['#7fc97f', '#beaed4', '#fdc086', '#fb9a99', '#386cb0'])

            // And a opacity scale
            const opacity = d3.scaleLinear()
                .domain([10, 30])
                .range([.5, 1])

            // use this information to add rectangles:


            svg
                .selectAll("rect")
                .data(root.leaves())
                .join("rect")
                .attr("class", "tree-rect")
                .attr('x', function (d) {
                    return d.x0;
                })
                .attr('y', function (d) {
                    return d.y0;
                })
                .attr('width', function (d) {
                    return d.x1 - d.x0;
                })
                .attr('height', function (d) {
                    return d.y1 - d.y0;
                })
                .style("stroke", "black")
                .style("fill", function (d) {
                    return color(d.parent.data.name)
                })
                .style("opacity", function (d) {
                    return 0.7
                })

            // and to add the text labels
            svg
                .selectAll("text")
                .data(root.leaves())
                .enter()
                .append("text")
                //.attr("class", "tree-text")
                .attr("transform", function (d) {
                    if (d.data.name === "LinkedIn" || d.data.name === "MSN/WindowsLive/Bing") {
                        return "translate(" + (d.x0 + 5) + "," + (d.y0 + 20) + ")" + " " + "rotate(90)";
                    }
                    else if (d.data.name === "Wal-Mart" || d.data.name === "Craigslist" || d.data.name === 'Target') {
                        return "translate(" + (d.x0 + 4) + "," + (d.y0 + 15) + ")" + " " + "rotate(45)";
                    }
                    else {
                        return "translate(" + (d.x0 + 5) + "," + (d.y0 + 20) + ")" + " " + "rotate(0)";
                    }

                })     // +20 to adjust position (lower)
                .text(function (d) {
                    return d.data.name.replace('mister_', '')
                })
                .attr("class", "treemap-label")
                .attr("x", function (d) {
                    if (length < 600) {
                        if (d.data.name == "LinkedIn" || d.data.name == 'MSN/WindowsLive/Bing') {
                            return -16 * length / length
                        }
                        else {
                            return -3 * length / length
                        }
                    }
                })
                .attr("y", function (d) {
                    if (length < 650) {
                        if (d.data.name == "LinkedIn") {
                            return "0"
                        }
                        else if (d.data.name == "Conduit") {
                            return -0.5 * (d.y1 - d.y0);
                        }
                        else {
                            return -length / margin.top
                        }
                    }
                })
                .style('font-size', function (d) {
                    if (width < 500) {
                        return 1.1 * (length / margin.top)
                    }

                })

            // Add title for the 3 groups
            svg
                .selectAll("titles")
                .data(root.descendants().filter(function (d) {
                    return d.depth == 1
                }))
                .enter()
                .append("text")
                .attr("x", function (d) {
                    return d.x0
                })
                .attr("y", function (d) {
                    return d.y0 + 21
                })
                .text(function (d) {
                    return d.data.name
                })
                //.attr("class", "tree-labels")
                .style("font-weight", "bold")
                .attr("class", "x-label")

            // Add title for the 3 groups
            svg
                .append("text")
                .attr("class", "title")
                .attr("x", width / margin.left)
                .attr("y", -length / margin.top)    // +20 to adjust position (lower)
                .text("The Number of Unique Visitors for Websites")
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

export default TreeMapMini;