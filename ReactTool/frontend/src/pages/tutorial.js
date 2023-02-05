import React, { Component, useState, useEffect } from 'react';
import { Col, Row, Navbar, Button, Image, ButtonGroup } from 'react-bootstrap';
import '../App.css';

// uncomment if running on local backend
const backend_path_prefix = '.'

class Tutorial extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    onUnload(e) {

    }

    on_experiment_click(e) {
        var pageType = {
            pathname: '/experiment',
            state: {
                data: {
                    'session_id': this.state.session_id,
                }
            }
        }
        console.log(pageType)
        this.props.history.push(pageType)
    }

    componentDidMount() {

        fetch('./new_session_id', {
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                start_time: 'TODO'
            })
        })
            .then(res => res.json()).then(data => {
                console.log(data.new_id)
                this.setState({
                    session_id: data.new_id
                })
            })

    }

    componentWillUnmount() {
        //window.removeEventListener("beforeunload", this.onUnload);
    }

    render() {

        if (this.props.location.state == null) {
            return (<p>Unknown session. Please start from the <a href={'#/'}> consent page</a></p>)
        }

        return (
            <>
                <Row className={'justify-content-center tutorial-body'}>
                    <Col lg={6} className={'text-box text-justify'}>

                        <p className='head_1'>Intructions</p>
                        <ul>
                            <li className='int_1'>You will be given 12 multiple-choice questions</li>
                            <li className='int_1'>Answer to the best of your ability. If you are unsure,you may skip the questions instead of guessing.</li>
                            {/* <li className='int_1'>Please do not take this test if you are color blind. Here is a link to a separate test: <a href='https://colormax.org/color-blind-test/' target="_blank">https://colormax.org/color-blind-test/</a></li> */}
                            {/* <li>We will store information about your mouse interaction (e.g. what you clicked) when answering the survey questions.</li> */}

                        </ul>
                        <p className='head_2'><b>Important: You will have 25 seconds to answer each question.</b> Answer to the best of your ability. You may <b>skip the questions instead of guessing</b> if you are unsure.</p>

                        <div className={'text-center'}>
                            <Button onClick={this.on_experiment_click.bind(this)}
                                className={'btn-sm'} variant={"success"}>
                                Start the experiment.
                            </Button>
                        </div>


                        <p className={'text-box'}></p>

                    </Col>

                </Row>
            </>
        );
    }
}

export default Tutorial;
