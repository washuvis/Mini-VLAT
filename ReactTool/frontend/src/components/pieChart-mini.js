import React, { Component } from 'react';
import * as d3 from 'd3'
import * as topojson from 'topojson';
import { Container, Col, Row, Navbar, Button, ButtonGroup, ToggleButton, Form, InputGroup } from 'react-bootstrap';
import '../App.css';
import data from './data/Histogram.csv';
import img11 from '../components/data/Mini-VLAT/PieChart.png'



class PieChartMini extends Component {

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
        //https://www.gartner.com/en/newsroom/press-releases/2021-09-01-2q21-smartphone-market-share
        //https://www.d3-graph-gallery.com/pie
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
            //svg.append("text").attr("class", 'bubbleTitle').text("Global Smartphone Market Share (%)").style("font-weight", 'bolder').attr('x', 1.2 * margin.top).attr('y', 1.2 * margin.top).style('font-size', 0.04 * height)

            var image = svg.append('image').attr('width', 1.2 * width).attr('x', 0).attr('y', margin.top * height / width).attr('xlink:href', img11).attr('height', 1.1 * height)
        }

        else {
            //var e = document.getElementById("graph_box");
            var width = e.clientWidth, height = e.clientHeight, margin = width / 5;

            var radius = Math.min(width, height) / 2 - margin;

            d3.select("#graph_box").select("svg").remove();
            const svg = d3.select("#graph_box")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${width / 2}, ${height / 2})`);

            var data = { Samsung: 17.6, Xiaomi: 15.5, Apple: 15.0, Oppo: 10.2, Vivo: 9.8, Others: 31.9 }

            const color = d3.scaleOrdinal()
                .range(['#0868ac', '#f03b20', '#feb24c', '#78c679', '#ffffb2', '#756bb1'])

            const pie = d3.pie()
                .value(function (d) {
                    return d[1]
                })

            const data_ready = pie(Object.entries(data))

            const arcGenerator = d3.arc()
                .innerRadius(0)
                .outerRadius(function () {
                    if (width < 500 && width > 400) {
                        return 1.2 * radius;
                    }
                    else if (width < 400) {
                        return 3.5 * radius
                    }
                    else {
                        return radius;
                    }
                })

            svg
                .selectAll('mySlices')
                .data(data_ready)
                .join('path')
                .attr('d', arcGenerator)
                .attr('fill', function (d) {
                    return (color(d.data[0]))
                })
                .attr("stroke", "black")
                .style("stroke-width", "0px")
                .style("opacity", 0.7)

            // Now add the annotation. Use the centroid method to get the best coordinates
            svg
                .selectAll('mySlices')
                .data(data_ready)
                .join('text')
                .text(function (d) {
                    return d.data[0]
                })
                .attr("transform", function (d) {
                    return `translate(${arcGenerator.centroid(d)})`
                })
                .style("fill", "#252525")
                .style("text-anchor", "middle")
                .style('font-weight', "bold")
                .attr("class", "x-label")

            svg
                .append("text")
                .attr("class", "title")
                .attr("x", -width / 5.5)
                .attr("y", -width / 3)    // +20 to adjust position (lower)
                .text("Global Smartphone Market Share in 2021")
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

export default PieChartMini;


function pieChart() {


}