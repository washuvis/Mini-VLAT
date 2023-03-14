import React, { Component } from 'react';
import { Col, Row, Button, InputGroup, FormControl } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { score_2 } from './visualization_quiz';
import { record_ques } from './visualization_quiz';

class ThankYou extends Component {


    constructor(props) {
        super(props)
    }

    componentDidMount() {
        if (this.props.location.state != null) {
            this.setState({
                value: this.props.location.state !== undefined ? this.props.location.state.data.session_id : "Invalid value",
                copied: false,
            })
        }
    }
    renderTable() {
        return (
            <table style={{ borderCollapse: 'collapse', margin: 'auto' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '5px' }}>Question</th>
                        <th style={{ border: '1px solid black', padding: '5px' }}>Result</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(record_ques).map(([question, answer]) => (
                        <tr key={question}>
                            <td style={{ border: '1px solid black', padding: '5px' }}>{question}</td>
                            <td style={{ border: '1px solid black', padding: '5px' }}>
                                {answer === 'Correct' ? <span>&#10004;</span> : answer === 'Wrong' ? <span>&#10060;</span> : answer}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    render() {
        console.log('attempting to render')
        console.log("The keys of the dictionary is: " + Object.keys(record_ques))
        console.log("The values of the dictionary is: " + Object.values(record_ques))

        if (this.props.location.state == null) {
            return (<p>Unknown session. Please start from the <a href={'#/'}> consent page</a></p>)
        }

        if (this.state == null) {
            return (<p>Loading...</p>)
        }

        return (
            <Row className={'justify-content-center no-margin-row'}>
                <Col lg={6} className={'text-box text-justify'}>
                    <h3 style={{ marginBottom: '20px' }}>You scored {score_2} out of 12. Thank you for participating in our study. Your responses have been recorded.</h3>
                    {this.renderTable()}
                </Col>
            </Row>

        );
    }
}

export default ThankYou;
