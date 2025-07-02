import React, { Component } from 'react';
import * as d3 from 'd3'
import * as topojson from 'topojson';
import { Container, Col, Row, Navbar, Button, ButtonGroup, ToggleButton, Form, InputGroup } from 'react-bootstrap';
import '../App.css';
import data from './data/100StackedBarGraph.csv';
import img5 from '../components/data/Mini-VLAT/Stacked100.png'



class StackedBarChartMini extends Component {

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
        //https://olympics.com/en/olympic-games/tokyo-2020/medals
        //https://www.d3-graph-gallery.com/graph/barplot_stacked_percent.html
        var e = document.getElementById("graph_box");
        const length = Math.min(e.clientHeight, e.clientWidth) * 0.8; // Decrease plot size a bit more
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
            //svg.append("text").attr("class", 'bubbleTitle').text("Election Exit Poll of California State by Education Level").style("font-weight", 'bolder').attr('x', 1.2 * margin.top).attr('y', 1.2 * margin.top).style('font-size', 0.04 * height)

            var image = svg.append('image').attr('width', 1.2 * width).attr('x', 0).attr('y', margin.top * height / width).attr('xlink:href', img5).attr('height', 1.1 * height)
        }

        else {
            //var e = document.getElementById("graph_box");
            //const length = Math.min(e.clientHeight, e.clientWidth)
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
                    d.Gold = parseFloat(d.Gold);
                    d.Silver = parseFloat(d.Silver);
                    d.Bronze = parseFloat(d.Bronze);
                    d.Countries = d.Countries;
                })

                var subgroups = data.columns.slice(1);

                var groups = data.map(d => (d.Countries));


                var xScale = d3.scaleBand().domain(groups).range([0, width]).padding([0.2])

                svg.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", `translate(0, ${height})`)
                    .call(d3.axisBottom(xScale).tickSizeOuter(0))
                    .selectAll("text")
                    .style("font-size", "1.5em"); // Increase x-axis label size

                var yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

                svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale)).selectAll("text")
                    .style("font-size", "1.5em"); // Increase y-axis label size

                const color = d3.scaleOrdinal()
                    .domain(subgroups)
                    .range(['#ecbf32', '#afb3b8', '#cc7e32']); // Gold, Silver, Bronze

                //stack the data? --> stack per subgroup
                const stackedData = d3.stack()
                    .keys(subgroups)
                    (data)

                data.forEach(function (d) {
                    // Compute the total
                    var tot = 0
                    for (var i in subgroups) {
                        const n = subgroups[i];
                        tot += +d[n]
                    }
                    // Now normalize
                    for (i in subgroups) {
                        const n = subgroups[i];
                        d[n] = d[n] / tot * 100
                    }
                })

                function make_y_axis() {
                    return d3.axisLeft(yScale).ticks(11).tickSizeInner(-width + margin.left + margin.right);
                }


                svg.append("g")
                    .attr("class", "grid")
                    .call(make_y_axis()
                        .tickSize(-width, 0, 0)
                        .tickFormat("")
                        .tickSizeOuter(0)
                    )
                svg.append("g")
                    .selectAll("g")
                    // Enter in the stack data = loop key per key = group per group
                    .data(stackedData)
                    .join("g")
                    .attr("fill", d => color(d.key))
                    .selectAll("rect")
                    // enter a second time = loop subgroup per subgroup to add all rectangles
                    .data(d => d)
                    .join("rect")
                    .attr("x", d => xScale(d.data.Countries) + length / 50)
                    .attr("y", d => yScale(d[1]))
                    .attr("height", d => yScale(d[0]) - yScale(d[1]))
                    .attr("width", xScale.bandwidth() - length / 60)

                svg.append("text")
                    .attr("class", "y-label")
                    .attr("transform", "rotate(-90)")
                    .attr("y", function () {
                        if (width < 500 && width > 400) {
                            return 0 - margin.left + (margin.top / 7.5) * e.clientWidth / e.clientHeight
                        }
                        else if (width < 400) {
                            return 0 - margin.left + (margin.top / 9.5) * e.clientWidth / e.clientHeight
                        }
                        else {
                            return 0 - margin.left + (margin.top / 2.5) * e.clientWidth / e.clientHeight
                        }
                    })
                    .attr("x", 0 - (height / 1.9))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Olympic Medals (%)")
                    .style("font-weight", "bold")
                    .style("font-size", `${Math.max(12, Math.floor(length * 0.030))}px`);

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
                    .style("font-size", `${Math.max(12, Math.floor(length * 0.030))}px`)
                    .text("Countries")

                svg
                    .append("text")
                    .attr("class", "title")
                    .attr("x", width / 2)
                    .attr("y", -margin.top / 2)
                    .attr("text-anchor", "middle")
                    .text("Tokyo 2020 Olympics Performance Summary")
                    .attr("fill", "black")
                    .style("font-weight", "bold")
                    .style("font-size", `${Math.max(14, Math.floor(length * 0.045))}px`); // Decrease title size

                // Legend on right, vertical
                const legendItems = [
                    { label: "Gold", color: "#ecbf32" },
                    { label: "Silver", color: "#afb3b8" },
                    { label: "Bronze", color: "#cc7e32" }
                ];
                const legendRectSize = Math.max(12, Math.floor(length * 0.025));
                const legendSpacing = Math.max(22, Math.floor(length * 0.045));
                const legendX = width + margin.right / 2;
                const legendY = 10;

                const legend = svg.append("g")
                    .attr("class", "legend")
                    .attr("transform", `translate(${legendX},${legendY})`);

                legendItems.forEach((item, i) => {
                    legend.append("rect")
                        .attr("x", -25)
                        .attr("y", i * legendSpacing)
                        .attr("width", legendRectSize)
                        .attr("height", legendRectSize)
                        .attr("fill", item.color);

                    legend.append("text")
                        .attr("x", -10)
                        .attr("y", i * legendSpacing + legendRectSize * 0.8)
                        .attr("class", "legend-value")
                        .style("font-size", `${Math.max(8, Math.floor(length * 0.025))}px`) // Decrease legend label size
                        .style("font-weight", "bold")
                        .style("fill", item.color)
                        .text(item.label);
                });
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

export default StackedBarChartMini;