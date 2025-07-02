import React, { Component } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import { record_ques } from './visualization_quiz';
import { minivis } from './visualization_quiz'; // Import minivis
import jsPDF from 'jspdf';
import { FaXTwitter, FaFacebook, FaEnvelope } from 'react-icons/fa6'; 

class ThankYou extends Component {

    constructor(props) {
        super(props)
        this.state = {
            value: "",
            copied: false,
            detailed: []
        }
    }

    componentDidMount() {
        if (this.props.location.state != null) {
            this.setState({
                value: this.props.location.state !== undefined ? this.props.location.state.data.session_id : "Invalid value",
                copied: false,
            });
        }
        // Build detailed report data
        let mini_responses = {}
        if (
          this.props.location &&
          this.props.location.state &&
          this.props.location.state.data &&
          this.props.location.state.data.mini_responses
        ) {
            mini_responses = this.props.location.state.data.mini_responses
        } else if (window && window.mini_responses) {
            mini_responses = window.mini_responses
        }
        console.log("mini_responses in ThankYou page:", mini_responses);

        // Use the imported minivis array below, not minivisArr
        const details = minivis.map((q) => {
            let response = '', correctAnswer = '', timeSpent = '', result = '';
            // Find the corresponding minivis object by question
            let minivisObj = null;
            if (typeof minivis !== "undefined" && Array.isArray(minivis)) {
                minivisObj = minivis.find(mv => mv.question === q.question);
            }
            // Get mini_responses for this question
            let miniResp = mini_responses[q.question] || null;
            if (miniResp && minivisObj) {
                // If user response is stored as an index, convert it to text
                if (Array.isArray(minivisObj.options) && typeof miniResp.response === 'number') {
                    response = minivisObj.options[miniResp.response];
                } else {
                    response = miniResp.response || '';
                }
                timeSpent = typeof miniResp.time !== "undefined" ? miniResp.time : '';
                // Get correct answer from the index
                if (Array.isArray(minivisObj.options) && typeof miniResp.truth !== "undefined") {
                    correctAnswer = minivisObj.options[miniResp.truth];
                }
                // Determine result
                if (response === correctAnswer) result = 'Correct';
                else if (response === 'Skip') result = 'Skip';
                else result = 'Wrong';
            } else {
                // fallback to record_ques for result
                result = record_ques[q.vis] || '';
            }
            return {
                ...q,
                response: response,
                correctAnswer: correctAnswer,
                result: result,
                timeSpent: timeSpent
            };
        });
        this.setState({ detailed: details });
    }

    countResults() {
        let correct = 0, wrong = 0, skipped = 0;
        Object.values(record_ques).forEach(val => {
            if (val === 'Correct') correct++;
            else if (val === 'Wrong') wrong++;
            else skipped++;
        });
        return { correct, wrong, skipped };
    }

    handleShare(platform) {
        const { correct, wrong, skipped } = this.countResults();
        const text = encodeURIComponent(
            `I just completed the Mini-VLAT quiz!\nCorrect: ${correct}, Wrong: ${wrong}, Skipped: ${skipped}.`
        );
        const url = encodeURIComponent(window.location.href);
        if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
        } else if (platform === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
        } else if (platform === 'email') {
            window.open(`mailto:?subject=Mini-VLAT Quiz Results&body=${text} ${url}`);
        }
    }

    renderTable() {
        return (
            <table
                style={{
                    borderCollapse: 'collapse',
                    margin: '20px auto',
                    border: '1px solid #aaa',
                    width: '90%',
                    maxWidth: '600px'
                }}
            >
                <thead style={{ backgroundColor: '#f0f0f0' }}>
                    <tr>
                        <th style={{ border: '1px solid #aaa', padding: '8px' }}>Question</th>
                        <th style={{ border: '1px solid #aaa', padding: '8px' }}>Result</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(record_ques).map(([question, answer]) => (
                        <tr key={question}>
                            <td style={{ border: '1px solid #aaa', padding: '8px' }}>{question}</td>
                            <td style={{ border: '1px solid #aaa', padding: '8px' }}>
                                {answer === 'Correct'
                                    ? <span>&#10004;</span>
                                    : answer === 'Time-Out'
                                        ? 'Time-Out'
                                        : answer === 'Wrong'
                                            ? <span>&#10060;</span>
                                            : answer}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    generatePDF() {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Mini-VLAT Quiz Report", 10, 15);
        let y = 25;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        this.state.detailed.forEach((item, idx) => {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            const wrappedQuestion = doc.splitTextToSize(`Question: ${item.question}`, pageWidth - 20);
            y += 7;
            doc.text(wrappedQuestion, 10, y);
            y += wrappedQuestion.length * 7;

            // Add image if possible (images must be base64 or dataURL)
            if (item.cimage) {
                try {
                    const imgProps = doc.getImageProperties(item.cimage);
                    const maxWidth = pageWidth - 20;
                    const maxHeight = pageHeight - y - 20;
                    let ratio = Math.min(maxWidth / imgProps.width, maxHeight / imgProps.height);
                    ratio *= 0.5; // Add 0.5× of actual dimension
                    const newWidth = imgProps.width * ratio;
                    const newHeight = imgProps.height * ratio;
                    doc.addImage(item.cimage, 'PNG', 10, y, newWidth, newHeight);
                    y += newHeight + 5;
                } catch (e) {
                    y += 2;
                }
            }

            doc.setFont('helvetica', 'normal'); // Reset font for subsequent text
            doc.text(`Your Answer: ${item.response || 'N/A'}`, 10, y);
            y += 7;
            doc.text(`Correct Answer: ${item.correctAnswer || 'N/A'}`, 10, y);
            y += 7;
            doc.text(`Result: ${item.result || 'N/A'}`, 10, y);
            y += 7;
            doc.text(`Time Spent (s): ${item.timeSpent || 'N/A'}`, 10, y);
            y += 10;

            // Add page if near bottom
            if (y > 260) {
                doc.addPage();
                y = 15;
            }
        });

        doc.save("MiniVLAT-Quiz-Report.pdf");
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

        const { correct, wrong, skipped } = this.countResults();

        return (
            <Row className={'justify-content-center no-margin-row'}>
                <Col lg={6} className={'text-box text-justify'}>
                    <p style={{ marginBottom: '20px', fontSize: '18px' }}>
                        Great job finishing the quiz!<br />
                        You got <span style={{ color: 'green' }}>{correct}</span> correct and 
                        <span style={{ color: 'red' }}> {wrong}</span> wrong questions.<br />
                        Download your PDF report for more details or share your results on X, Facebook, or email!
                    </p>
                    {this.renderTable()}
                    <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Button variant="primary" onClick={() => this.generatePDF()}>
                            Download PDF Report
                        </Button>
                        <Button variant="light" style={{ padding: 8 }} onClick={() => this.handleShare('twitter')}>
                            <FaXTwitter size={22} />
                        </Button>
                        <Button variant="light" style={{ padding: 8 }} onClick={() => this.handleShare('facebook')}>
                            <FaFacebook size={22} color="#4267B2" />
                        </Button>
                    </div>
                </Col>
            </Row>
        );
    }
}

export default ThankYou;
