import React, { Component, useLayoutEffect, useState, useEffect, FunctionComponent } from 'react';
import { Container, Col, Row, Navbar, Button, ButtonGroup, ToggleButton, Form, InputGroup } from 'react-bootstrap';
import '../App.css';
import ProgressBar from "@ramonak/react-progress-bar";
import Countdown from 'react-countdown';

import AreaChartMini from "../components/areaChart-mini";
import BarChartMini from "../components/barChart-mini";
import BubbleChartMini from "../components/bubbleChart-mini";
import ChoroplethMini from "../components/choropleth-mini";
import HistogramMini from "../components/histogram-mini";
import LineChartMini from "../components/linechart-mini";
import PieChartMini from "../components/pieChart-mini";
import ScatterPlotMini from "../components/scatterplot-mini";
import StackedBarChartMini from "../components/stacked100bar-mini";
import StackedAreaPlotMini from "../components/stackedArea-mini";
import StackedBarChart2Mini from "../components/stackedbar-mini";
import TreeMapMini from "../components/treeMap-mini";
import axios from 'axios';

import img1 from '../components/data/VLAT-Pics/Scatterplot.png'
import img2 from '../components/data/VLAT-Pics/StackedBar.png'
import img3 from '../components/data/VLAT-Pics/BubbleChart.png'
import img4 from '../components/data/VLAT-Pics/TreeMap.png'
import img5 from '../components/data/VLAT-Pics/StackedBar100.png'
import img6 from '../components/data/VLAT-Pics/Histogram.png'
import img7 from '../components/data/VLAT-Pics/StackedArea.png'
import img8 from '../components/data/VLAT-Pics/Choropleth.png'
import img9 from '../components/data/VLAT-Pics/BarGraph.png'
import img10 from '../components/data/VLAT-Pics/AreaChart.png'
import img11 from '../components/data/VLAT-Pics/Pie.png'
import img12 from '../components/data/VLAT-Pics/LineChart.png'



let minivis = [
    { 'vis': BarChartMini, 'type': 'Bar Chart', 'question': 'What is the average internet speed in Japan?', 'options': ["42.30 Mbps", "40.51 Mbps", "35.25 Mbps", "16.16 Mbps", "Skip"], 'correct_answer': 1, 'cimage': img9 },
    { 'vis': AreaChartMini, 'type': 'Area Chart', 'question': 'What was the average price of pount of coffee beans in October 2019?', 'options': ["$0.71", "$0.90", "$0.80", "$0.63", "Skip"], 'correct_answer': 0, 'cimage': img10 },
    { 'vis': BubbleChartMini, 'type': 'Bubble Chart', 'question': 'Which city\'s metro system has the largest number of stations?', 'options': ['Beijing', 'Shanghai', 'London', 'Seoul', "Skip"], 'correct_answer': 1, 'cimage': img3 },
    { 'vis': ChoroplethMini, 'type': 'Choropleth', 'question': 'In 2020, the unemployment rate for Washington (WA) was higher than that of Wisconsin (WI).', 'options': ['True', 'False', "Skip"], 'correct_answer': 0, 'cimage': img8 },
    { 'vis': HistogramMini, 'type': 'Histogram', 'question': 'What distance have customers traveled in the taxi the most?', 'options': ["60 - 70 Km", "30 - 40 Km", "20 - 30 Km", "50 - 60 Km", "Skip"], 'correct_answer': 1, 'cimage': img6 },
    { 'vis': LineChartMini, 'type': 'Line Chart', 'question': 'What was the price of a barrel of oil in February 2020?', 'options': ["$50.54", "$47.02", "$42.34", "$42.34", "Skip"], 'correct_answer': 0, 'cimage': img12 },
    { 'vis': TreeMapMini, 'type': 'Treemap', 'question': 'eBay is nested in the Software category.', 'options': ['True', 'False', 'Skip'], 'correct_answer': 1, 'cimage': img4 },
    { 'vis': ScatterPlotMini, 'type': 'Scatterplot', 'question': 'There is a negative linear relationship between the height and the weight of the 85 males.', 'options': ['True', 'False', 'Skip'], 'correct_answer': 1, 'cimage': img1 },
    { 'vis': StackedBarChartMini, 'type': '100% Stacked Bar', 'question': 'Which country has the lowest proportion of Gold medals?', 'options': ["Great Britain", "U.S.A.", "Japan", "Australia", 'Skip'], 'correct_answer': 0, 'cimage': img5 },
    { 'vis': StackedAreaPlotMini, 'type': 'Stacked Area', 'question': 'What was the ratio of girls named \'Isla\' to girls named \'Amelia\' in 2012 in the UK?', 'options': ["1 to 1", "1 to 2", "1 to 3", "1 to 4", "Skip"], 'correct_answer': 1, 'cimage': img7 },
    { 'vis': StackedBarChart2Mini, 'type': 'Stacked Bar', 'question': 'What is the cost of peanuts in Seoul?', 'options': ["$6.1", "$5.2", "$7.5", "$4.5", "Skip"], 'correct_answer': 0, 'cimage': img2 },
    { 'vis': PieChartMini, 'type': 'Pie Chart', 'question': 'What is the approximate global smartphone market share of Samsung?', 'options': ["17.6%", "25.3%", "10.9%", "35.2%", 'Skip'], 'correct_answer': 0, 'cimage': img11 }
];

var record_ques = {}

var score_2 = 0
let initTime = 0
let endTime = 0
var num = 12


class VisQuiz extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.setState({
            session_id: this.props.location.state.data.session_id,
            current_visualization_index: 0,
            score: 0,
            current_mini_index: 0,
            list_of_min_vis: this.shuffle(minivis),
            responses: {},
            mini_responses: {},
            resize_bool: true,
            device_info: '',
            form_incomplete: false,
            demographic_questions: {
                'sex': null,
                'age': null,
                'education': null,
                'familiarity': null
            },
            demographics_incomplete: true,
            comment: '',
            width: 0,
            height: 0,
            mini_score: 0,
            ip_address: "",
        }
        )

        window.addEventListener('resize', this.handleWindowResize.bind(this))
    }

    handleWindowResize(e) {
        this.setState({
            resize_bool: !this.state.resize_bool
        })
    }
    handleTextChange(e) {
        this.setState({ comment: e.target.value })
    }

    handleDemographicChange(e) {
        console.log(this.state)
        var new_dq = this.state.demographic_questions
        new_dq[e.target.id] = e.target.value

        var incomplete = false
        for (var key in new_dq) {
            if (new_dq[key] == null) {
                incomplete = true
            }
        }
        if (e.value == 'oth') {
            alert('Hello')
        }

        this.setState({ demographic_questions: new_dq, demographics_incomplete: incomplete })
    }
    getData = async () => {
        //https://medium.com/how-to-react/how-to-get-user-ip-address-in-react-js-73eb295720d0
        const res = await axios.get('https://geolocation-db.com/json/')
        console.log("IP Address:  ", res.data);
        this.setState({
            ip_address: res.data.IPv4
        })
    }

    clicked_mini_answer(type, question, response, truth, time) {
        this.getData()
        if (response === minivis[this.state.current_mini_index]['options'][truth]) {
            this.state.mini_score = this.state.mini_score + 1
        }
        this.setState({
            current_mini_index: this.state.current_mini_index + 1,
        })
        endTime = Math.abs((Date.now() - initTime) / 1000)
        this.state.mini_responses[question] = { response: response, truth: truth, time: endTime }
        this.setState({
            device_info: navigator.userAgent
        })
        score_2 = this.state.mini_score

        if (response === minivis[this.state.current_mini_index]['options'][truth]) {
            record_ques[type] = 'Correct'
        }
        else if (response === 'Skip') {
            record_ques[type] = 'Skip'
        }
        else {
            record_ques[type] = 'Wrong'
        }
        console.log("The dictionary is: ", record_ques)
    }



    shuffle(array) {
        //https://bost.ocks.org/mike/shuffle/
        var m = array.length, t, i;

        // While there remain elements to shuffle…
        while (m) {

            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }



    on_survey_click() {

        fetch('./record_responses_to_db', {
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                session_id: this.state.session_id,
                responses: this.state.responses,
                mini_responses: this.state.mini_responses,
                score: this.state.score,
                mini_score: this.state.mini_score,
                device: this.state.device_info,
                demographic_responses: this.state.demographic_questions,
                comment: this.state.comment,
                height: window.innerHeight,
                width: window.innerWidth,
                ipaddress: this.state.ip_address
            })
        })
            .then(res => res.json()).then(data => {
                //var message = 'Warning!\n\nNavigating away from this page will delete your text if you haven\'t already saved it.';
                //e.returnValue = message;
                //return message;
            })

        var pageType = {
            pathname: '/thank_you',
            state: {
                data: {
                    'session_id': this.state.session_id,
                }
            }
        }
        this.props.history.push(pageType)
    }
    timeout() {
        alert("Time is up! Please select 'Ok' to proceed to the next question.")
        this.setState({
            current_visualization_index: this.state.current_visualization_index + 1,
        })
    }
    getRandom() {
        return Math.random();
    }
    minitimeout() {
        alert("Time is up! Please select 'Ok' to proceed to the next question.")
        this.setState({
            current_mini_index: this.state.current_mini_index + 1,
        })
    }


    render() {
        const hoursMinSecs = { hours: 0, minutes: 0, seconds: 10 }
        initTime = Date.now()
        console.log("Starting Time is : " + initTime)
        console.log('render')

        if (this.props.location.state == undefined) {
            window.location.href = "/";
            return (<p>Unknown session. Please start from the <a href={'/'}> consent page</a></p>)
        }
        let ages = []
        for (var i = 18; i < 100; i++) {
            ages.push(i)
        }

        if (this.state == null) {
            return (<p>Loading...</p>)
        }
        if (this.state.current_mini_index < this.state.list_of_min_vis.length) {
            const options = minivis[this.state.current_mini_index]['options'].map((item, i) =>

                <Button variant="secondary" size="sm" className={'question-option'} id={`button_option_${i}`} key={`button_option_${i}`} onClick={() =>
                    this.clicked_mini_answer(minivis[this.state.current_mini_index]['type'], minivis[this.state.current_mini_index]['question'], item, minivis[this.state.current_mini_index]['correct_answer'], 'timeTaken')}>
                    {item}
                </Button>
            )
            let VisComp = minivis[this.state.current_mini_index]['vis']
            //console.log(VisComp)
            return (
                <Container className={'container-class'} fluid>
                    <Row className={'vis-quiz-row'}>
                        <Col lg={6} className={'vis-column'}>
                            <VisComp width={window.innerWidth} height={window.innerHeight} resized={this.state.resize_bool}></VisComp>
                        </Col>
                        <Col lg={6} className={'quiz-column'}>
                            <div className='timeStamp'>
                                <Countdown date={Date.now() + 25000} renderer={({ minutes, seconds, completed }) => {
                                    return <span>Time Remaining: {minutes}:{seconds}</span>;
                                }} autoStart={true} key={Date.now()} onComplete={() => this.minitimeout()} />
                                {/* <CountDownTimer hoursMinSecs={hoursMinSecs} /> */}
                            </div>
                            <div className={'question-container'}>
                                <div className={'question-text'}>
                                    <p>{minivis[this.state.current_mini_index]['question']}</p>
                                </div>

                                <div className={'question-options d-grid gap-2 btn-block'}>
                                    {options}
                                </div>
                            </div>

                        </Col>
                    </Row>
                    <Row className={'progress-bar-row'}>
                        <ProgressBar completed={(parseInt(this.state.current_mini_index)).toString()} maxCompleted={num.toString()} length={Math.min(window.innerWidth, window.innerHeight)} />
                    </Row>
                </Container>
            );
        }
        else {
            return (
                <>
                    <Row className={'justify-content-center no-margin-row'}>
                        <Col lg={6} className={'text-box text-justify'}>


                            <Form.Group className={'question'}>
                                <Form.Label>Please select your age.</Form.Label>
                                <Form.Select as="select" id={'age'} onChange={this.handleDemographicChange.bind(this)}>
                                    <option value={null} selected={true} disabled={true}></option>
                                    {ages.map((d, i) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <hr />

                            <Form.Group className={'question'}>
                                <Form.Label>Please select your gender.</Form.Label>
                                <Form.Select as="select" id={'sex'} onChange={this.handleDemographicChange.bind(this)}>
                                    <option value={null} selected={true} disabled={true}></option>
                                    <option key={'male'} value={'male'}>Male</option>
                                    <option key={'female'} value={'female'}>Female</option>
                                    <option key={'other'} value={'other'}>Other</option>
                                    <option key={'withdraw'} value={'withdraw'}>I do not wish to disclose.</option>
                                </Form.Select>
                            </Form.Group>
                            <hr />

                            <Form.Group className={'question'}>
                                <Form.Label>Please select your highest level of completed education.</Form.Label>
                                <Form.Select as="select" id={'education'} onChange={this.handleDemographicChange.bind(this)}>
                                    <option value={null} selected={true} disabled={true}></option>
                                    <option value={'highschool'}>High School Diploma / GED</option>
                                    <option value={'associate'}>Associate Degree</option>
                                    <option value={'bachelors'}>Bachelors Degree</option>
                                    <option value={'masters'}>Masters Degree</option>
                                    <option value={'doctorate'}>Doctorate Degree</option>
                                </Form.Select>
                            </Form.Group>
                            <hr />
                            <Form.Group className={'question'}>
                                <Form.Label>Are you color-blind?</Form.Label>
                                <Form.Select as="select" id={'color-blind'} onChange={this.handleDemographicChange.bind(this)}>
                                    <option value={null} selected={true} disabled={true}></option>
                                    <option value={'yes'}>Yes</option>
                                    <option value={'no'}>No</option>
                                    <option value={'maybe'}>I do not wish to disclose.</option>
                                </Form.Select>
                            </Form.Group>
                            <hr />

                            <Form.Group className={'question'}>
                                <Form.Label>Please select your familiarity with visualization.</Form.Label>
                                <Form.Select as="select" id={'familiarity'} onChange={this.handleDemographicChange.bind(this)}>
                                    <option value={null} selected={true} disabled={true}></option>
                                    <option value={'not_familiar'}>I have never created a visualization.</option>
                                    <option value={'somewhat'}>I am somewhat familiar.</option>
                                    <option value={'very_familiar'}>I have created visualization systems before. </option>
                                </Form.Select>
                            </Form.Group>
                            <hr />


                            <Form.Group>
                                <Form.Label>Please include any additional comments below. (optional)</Form.Label>
                                <Form.Control as="textarea" id={'comments'} rows={3} onChange={this.handleTextChange.bind(this)}>
                                </Form.Control>
                            </Form.Group>
                            <hr />


                            <div className={'text-center'}><Button className={'btn-sm'}
                                variant={"success"}
                                onClick={this.on_survey_click.bind(this)}
                                disabled={(this.state.form_incomplete || this.state.demographics_incomplete)}
                                id={'survey_submit-btn'}>
                                Submit Responses
                            </Button></div>

                            <p className={'text-box'}></p>
                        </Col>

                    </Row>
                </>

            )
        }
    }
}



export default VisQuiz;
export { score_2 };
export { record_ques };
