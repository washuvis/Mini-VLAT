import React, { Component } from 'react';
import * as d3 from 'd3'
import * as topojson from 'topojson';
import { Container, Col, Row, Navbar, Button, ButtonGroup, ToggleButton, Form, InputGroup } from 'react-bootstrap';
import '../App.css';
import data_usa from './data/USA.json';
import data from './data/Choropleth.csv';
import img8 from '../components/data/Mini-VLAT/Choropleth_New.png'



class ChoroplethMini extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log(String(data_usa))
        this.drawChart()
    }
    divResize(e) {
        console.log('div was resized', e)
    }

    componentDidUpdate() {
        this.drawChart()
    }

    drawChart() {
        //https://www.statista.com/statistics/223675/state-unemployment-rate-in-the-us/
        //https://bl.ocks.org/wboykinm/dbbe50d1023f90d4e241712395c27fb3
        var e = document.getElementById("graph_box");
        const length = Math.min(e.clientHeight, e.clientWidth)

        const margin = { top: length / 5, right: length / 5, bottom: length / 5, left: length / 5 },
            width = length - margin.left - margin.right,
            height = length - margin.top - margin.bottom;

        // append the svg object to the body of the page
        //d3.select("#graph_box").selectAll("svg").remove();
        d3.select("#graph_box").select("svg").remove();
        const svg = d3.select("#graph_box")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")

        svg.append("text").attr("class", 'bubbleTitle').text("Unemployment Rates for States in 2020").style("font-weight", 'bolder').attr('x', 1.2 * margin.top).attr('y', 0.9 * margin.top).style('font-size', 0.04 * height)

        var image = svg.append('image').attr('width', 1.4 * width).attr('x', 0).attr('y', margin.top * height / width).attr('xlink:href', img8).attr('height', 1.1 * height)

        // else {
        //     const margin = { top: length / 7, right: length / 7, bottom: length / 7, left: length / 7 },
        //         width = length - margin.left - margin.right,
        //         height = length - margin.top - margin.bottom;

        //     // append the svg object to the body of the page
        //     //d3.select("#graph_box").selectAll("svg").remove();
        //     d3.select("#graph_box").select("svg").remove();
        //     const svg = d3.select("#graph_box")
        //         .append("svg")
        //         .attr("width", width + margin.left + margin.right)
        //         .attr("height", height + margin.top + margin.bottom)
        //         .append("g")
        //         .attr("transform", `translate(${margin.left},${margin.top})`);

        //     // svg.append("text").attr("class", 'bubbleTitle').text("Unemployment Rates for States in 2015").style("font-weight", 'bolder').attr('x', 1.2 * margin.top).attr('y', 1.2 * margin.top).style('font-size', 0.04 * height)

        //     // var image = svg.append('image').attr('width', 1.4 * width).attr('x', 0).attr('y', margin.top * height / width).attr('xlink:href', img8).attr('height', 1.1 * height)

        //     var projection = d3.geoAlbersUsa()
        //         .translate([width / 2, height / 2])
        //         .scale(Math.min(e.clientHeight, e.clientWidth));

        //     var path = d3.geoPath()
        //         .projection(projection)

        //     var lowColor = '#f7fbff'
        //     var highColor = '#084594'

        //     d3.csv(data).then(function (data) {
        //         var names = {};
        //         data.forEach(function (d) {
        //             d.state = d.state;
        //             d.value = parseFloat(d.value);
        //             names[d.id] = d.code;
        //         })
        //         var dataArr = [];
        //         for (var d = 0; d < data.length; d++) {
        //             dataArr.push(parseFloat(data[d].value))
        //         }
        //         var minVal = d3.min(dataArr);
        //         var maxVal = d3.max(dataArr);
        //         var ramp = d3.scaleLinear().domain([minVal, maxVal]).range([lowColor, highColor])

        //         for (var i = 0; i < data.length; i++) {
        //             var dataState = data[i].state;
        //             var dataVal = data[i].value;
        //             var usa = topojson.feature(data_usa, data_usa.objects.states).features;
        //             for (var j = 0; j < usa.length; j++) {
        //                 var jsonState = usa[j].properties.name;
        //                 if (dataState == jsonState) {
        //                     usa[j].properties.value = dataVal;
        //                     break;
        //                 }
        //             }
        //         }
        //         // Render the U.S. by using the path generator
        //         svg.selectAll("path")
        //             .data(usa)
        //             .enter().append("path")
        //             .attr("d", path)
        //             .style("stroke", "#ffff")
        //             .style("stroke-width", "1")
        //             .style("fill", function (d) {
        //                 return ramp(d.properties.value)
        //             });

        //         svg.selectAll("text").data(usa).enter().append("text")
        //             .text(function (d) {
        //                 return names[d.id];
        //             })
        //             .attr("x", function (d) {
        //                 return path.centroid(d)[0];
        //             })
        //             .attr("y", function (d) {
        //                 return path.centroid(d)[1];
        //             })
        //             .attr("class", "state-abbr")
        //             .attr("text-anchor", "middle")
        //             .attr("fill", "black")
        //             .style("font-weight", "bold")

        //         //var w = e.clientWidth/4, h = e.clientHeight/6;
        //         //d3.select("body").select("svg").remove();
        //         //d3.selectAll("svg").select(".legend").remove();

        //         var legend = svg.append("defs")
        //             .append("svg:linearGradient")
        //             .attr("id", "gradient")
        //             .attr("x1", "0%")
        //             .attr("y1", "100%")
        //             .attr("x2", "100%")
        //             .attr("y2", "100%")
        //             .attr("spreadMethod", "pad");

        //         legend.append("stop")
        //             .attr("offset", "0%")
        //             .attr("stop-color", highColor)
        //             .attr("stop-opacity", 1);

        //         legend.append("stop")
        //             .attr("offset", "100%")
        //             .attr("stop-color", lowColor)
        //             .attr("stop-opacity", 1);

        //         if (width < 350) {
        //             svg.append("rect")
        //                 .attr("width", length / 4)
        //                 .attr("height", length / 5.5 - margin.top)
        //                 .style("fill", "url(#gradient)")
        //                 .attr("transform", "translate(0," + (length / 5.4 - margin.left / 0.8) + ")");

        //             svg.append("text").attr("x", 0).attr("y", length / 8.5 - 0.4 * margin.top).text("12%").style("font-weight", "bold").attr("class", "legend-value")
        //             svg.append("text").attr("x", length / 20).attr("y", length / 8.5 - 0.4 * margin.top).text("10%").style("font-weight", "bold").attr("class", "legend-value")
        //             svg.append("text").attr("x", length / 10).attr("y", length / 8.5 - 0.4 * margin.top).text("8%").style("font-weight", "bold").attr("class", "legend-value")
        //             svg.append("text").attr("x", length / 7).attr("y", length / 8.5 - 0.4 * margin.top).text("6%").style("font-weight", "bold").attr("class", "legend-value")
        //             svg.append("text").attr("x", length / 5).attr("y", length / 8.5 - 0.4 * margin.top).text("4%").style("font-weight", "bold").attr("class", "legend-value")
        //         }
        //         else {
        //             svg.append("rect")
        //                 .attr("width", length / 4)
        //                 .attr("height", length / 5.5 - margin.top)
        //                 .style("fill", "url(#gradient)")
        //                 .attr("transform", "translate(0," + (length / 5.4 - margin.left / 1) + ")");

        //             svg.append("text").attr("x", 0).attr("y", length / 6.5 - 0.4 * margin.top).text("12%").style("font-weight", "bold").attr("class", "legend-value")
        //             svg.append("text").attr("x", length / 20).attr("y", length / 6.5 - 0.4 * margin.top).text("10%").style("font-weight", "bold").attr("class", "legend-value")
        //             svg.append("text").attr("x", length / 10).attr("y", length / 6.5 - 0.4 * margin.top).text("8%").style("font-weight", "bold").attr("class", "legend-value")
        //             svg.append("text").attr("x", length / 7).attr("y", length / 6.5 - 0.4 * margin.top).text("6%").style("font-weight", "bold").attr("class", "legend-value")
        //             svg.append("text").attr("x", length / 5).attr("y", length / 6.5 - 0.4 * margin.top).text("4%").style("font-weight", "bold").attr("class", "legend-value")
        //         }





        //         /*
        //         var y = d3.scaleLinear()
        //             .range([length/4 - length/3.3, length/4.4 - length/(margin.left/4.0)])
        //             //.domain([maxVal, minVal]);
        //         //ar formatPercent = d3.format("%");
        //         var yAxis = d3.axisBottom(y).tickValues(["12%", "11%", "10%", "9%"]);
        //         svg.append("g")
        //             //.attr("class", "axis")
        //             .attr("transform", "translate(" + (length/5.45-margin.left/1.1) + "," + margin.right/0.75 + ")")
        //             .call(yAxis)
        //             .style("font-weight", "bold")
        //             .style("font-size", 1.3*(length/margin.top)); */

        //         svg
        //             .append("text")
        //             .attr("x", width / 5.5)
        //             .attr("y", -length / margin.top)    // +20 to adjust position (lower)
        //             .text("Unemployment Rate for States in 2020 ")
        //             .attr("class", "title")
        //             .attr("fill", "black")
        //             .style("font-weight", "bold")

        //     });

        // }


    }


    render() {

        return (
            <div id={'graph_box'}>
            </div>
        );
    }
}

export default ChoroplethMini;