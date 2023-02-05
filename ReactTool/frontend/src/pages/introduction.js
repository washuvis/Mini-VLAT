import React, { Component, useState, useEffect } from 'react';
import { Col, Row, Navbar, Button } from 'react-bootstrap';
import { PDFViewer } from '@react-pdf/renderer';
import { Document, Page } from 'react-pdf';

class Intro extends Component {

  constructor(props) {
    super(props)
  }

  go_to_tutorial() {
    var pageType = {
      pathname: '/tutorial',
      state: {
        data: {
        }
      }
    }
    this.props.history.push(pageType)

  }



  render() {
    var user = navigator.userAgent
    var browser_supported = true //user.includes('Chrome')

    console.log(user)
    var mobile_device = /Opera Mini/i.test(navigator.userAgent)
    if (mobile_device || !browser_supported) {
      return (<>
        <Row className={'justify-content-center'}>
          <Col lg={6} className={'text-box text-justify'}>

            <p>Sorry, your browser is not supported.</p>
            <p>Please download <a href={'https://www.mozilla.org/en-US/firefox/new/'}>Firefox</a> (version 80 or newer) or <a href={'https://www.google.com/chrome/'}>Chrome</a> (version 85 or newer) on your computer and try again.</p>

          </Col>

        </Row>
      </>
      );
    }

    return (
      <>
        <Row className={'justify-content-center no-margin-row'}>
          <div className='heading-term'>Consent Form</div>
          <div className={'terms-container'}>
            <div className='terms'>
              <p>We invite you to participate in a research study being conducted by investigators from Washington University in St. Louis. You are being asked to participate in this research study because you are an English-speaking adult in the United States. The purpose of the study is to develop an instrument that measures how well people can read, understand, and use data visualizations to solve problems.</p>
              <p>If you agree to participate, we would like you to questions about a series of data visualization. For each question, you will see a data visualization and a problem to solve. Choose the BEST answer to the questions. If you are unsure, Select ''Skip'' instead of guessing. You are also free to skip any questions that you prefer not to answer. In the end, you will complete a brief demographic survey.</p>
              <p>We would like to use the data we are obtaining in this study for studies going on right now as well as studies that are conducted in the future.</p>
              <p>These studies may provide additional information that will be helpful in developing better visual communication tools. It is unlikely that what we learn from these studies will have a direct benefit to you.  There are no plans to provide financial compensation to you should this occur.  By allowing us to use your data you give up any property rights you may have in the data.</p>
              <p>We will share your data with other researchers. They may be doing research in areas similar to this research or in other unrelated areas.  These researchers may be at Washington University, at other research centers and institutions, or industry sponsors of research.  We may also share your research data with large data repositories (a repository is a database of information) for broad sharing with the research community.  If your individual research data is placed in one of these repositories only qualified researchers, who have received prior approval from individuals that monitor the use of the data, will be able to look at your information.</p>
              <p>Your data will be stored without your name or any other kind of link that would enable us to identify which data are yours.  Therefore, it will be available indefinitely for use in future research studies without your additional consent and cannot be removed.</p>
              {/* <p>Approximately 5100 people will take part in this study at Washington University.</p> */}
              <p>There are no known risks from being in this study.</p>
              <p>You will not benefit personally.  However, we hope that others may benefit in the future from what we learn as a result of this study. You will not have any costs for being in this research study.</p>
              <p>You will be paid for being in this research study. You will receive a pay of $8 for completing this quiz. At the end of the study, copy your survey code back to Prolific to receive your payment.</p>
              <p>We will keep the information you provide confidentially. This survey is completely anonymous; we will not collect any personally identifiable information. We will only have access to your Prolific ID only, which we will use solely for payment purposes. </p>
              <p>Any report or article that we write will not include information that can directly identify you.  The journals that publish these reports or articles require that we share the information that was collected for this study with others to make sure the results of this study are correct and help develop new ideas for research. Your information will be shared in a way that cannot directly identify you.</p>
              <p>Federal regulatory agencies and Washington University, including the Washington University Institutional Review Board (a committee that reviews and approves research studies) and the Human Research Protection Office, may inspect and copy records pertaining to this research.

                Your participation in this study is completely voluntary.  You may choose not to take part at all.  If you decide to participate in the study, you may stop participating at any time. Any data that was collected as part of this study will remain as part of the study records and cannot be removed.  If you decide not to take part in the study or if you stop participating at any time, you won’t be penalized or lose any benefits for which you otherwise qualify.
              </p>
              <p>If you do not wish to participate in this study or want to end your participation in the study, close the browser tab without answering any of the questions.</p>

              <p> We encourage you to ask questions.  If you have any questions about the research study itself, please contact Saugat Pandey (p.saugat@wustl.edu). If you feel you have been harmed from being in the study, please contact Alvitta Ottley (alvitta@wustl.edu).  If you have questions, concerns, or complaints about your rights as a research participant, please contact the Human Research Protection Office at 1-(800)-438-0445 or email hrpo@wustl.edu.   General information about being a research participant can be found on the Human Research Protection Office website, http://hrpo.wustl.edu.  To offer input about your experiences as a research participant or to speak to someone other than the research staff, call the Human Research Protection Office at the number above.</p>

              <p>Thank you very much for your consideration of this research study.</p>
            </div>
            {/* <p>Taking part in this research study is completely voluntary. You may choose not to take part at all.
              If you decide to be in this study, you may stop participating at any time. Any data that was collected
              as part of your participation in the study will remain as part of the study records and cannot be removed.
              As a part of this study:
              <ul>
                <li><b>We will not collect your name or any identifying information about you. It will not be possible
                  to link you to your responses on the survey.</b></li>

                <li>We will store you response to every question along with the time taken to solve every question and total score.</li>


                {/* <li>We will store information about your mouse interaction (e.g. what you clicked) when answering the survey questions.</li> 

                <li>We may allow other researchers to use the interaction data that we collect.
                  Researchers from other universities can request to use the data.</li>
              </ul>



            </p>
            <p>
              We encourage you to ask questions. If you have any questions about the research study itself, please contact: Alvitta Ottley (alvitta@wustl.edu). If you have questions, concerns, or complaints about your rights as a research participant, please contact the Human Research Protection Office at 660 South Euclid Avenue, Campus Box 8089, St. Louis, MO 63110, 1-(800)-438-0445 or email hrpo@wusm.wustl.edu. General information about being a research participant can be found on the Human Research Protection Office web site, http://hrpo.wustl.edu/. To offer input about your experiences as a research participant or to speak to someone other than the research staff, call the Human Research Protection Office at the number above.
              Thank you very much for your consideration of this research study.
            </p> */}

            <div className={'text-center'}><Button onClick={this.go_to_tutorial.bind(this)} className={'btn-sm'} variant={"success"}>
              I agree to participate.
            </Button></div>
          </div>

        </Row>
      </>
    );
  }
}

export default Intro;
