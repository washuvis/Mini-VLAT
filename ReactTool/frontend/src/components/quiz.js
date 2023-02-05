const questions = [
    {
        question: "What was the price range of a barrel of oil in 2020?",
        optionA: "$16.55 - $57.52",
        optionB: "$19.52 - $59.00",
        optionC: "$23.43 - $60.72",
        optionD: "$21.82 - $87.52",
        correctOption: "optionA",
    },

    {
        question: "What is the range of the average internet speed in Asia?",
        optionA: "5.50Mbps - 30.60Mbps",
        optionB: "7.00Mbps - 29.40Mbps",
        optionC: "6.40Mbps - 27.38Mbps",
        optionD: "5.50Mbps - 28.60Mbps",
        correctOption: "optionD",
    },
    {
        question: "What is the cost of peanuts in Las Vegas?",
        optionA: "$9.0",
        optionB: "$6.1",
        optionC: "$10.3",
        optionD: "$4.3",
        correctOption: "optionB",
    },

    {
        question: "What is the approval rating of Republicans among the people who have the education level of Postgraduate Study?",
        optionA: "35%",
        optionB: "27%",
        optionC: "23%",
        optionD: "20%",
        correctOption: "optionB",
    },

    {
        question: "About what is the global smartphone market share of Samsung?",
        optionA: "20%",
        optionB: "25%",
        optionC: "30%",
        optionD: "15%",
        correctOption: "optionB",
    },

    {
        question: "How many people have rated the taxi between 4.2 and 4.4?",
        optionA: "270",
        optionB: "190",
        optionC: "300",
        optionD: "290",
        correctOption: "optionB",
    },

    {
        question: "There is a negative linear relationship between the height and the weight of the 85 males.",
        optionA: "True",
        optionB: "False",
        optionC: "",
        optionD: "",
        correctOption: "optionB",
    },

    {
        question: "What was the average price of a pound of coffee beans in September 2013?",
        optionA: "$5.15",
        optionB: "$6.2",
        optionC: "$4.8",
        optionD: "$4.3",
        correctOption: "optionA",
    },

    {
        question: "What was the number of girls named 'Olivia' in 2010 in the UK?",
        optionA: "2000",
        optionB: "2500",
        optionC: "1700",
        optionD: "2400",
        correctOption: "optionC",
    },

    {
        question: "What is the total length of the metro system in Beijing?",
        optionA: "525 km",
        optionB: "495 km",
        optionC: "305 km",
        optionD: "475 km",
        correctOption: "optionA",
    },

    {
        question: "In 2015, the unemployment rate for Washington (WA) was higher than that of Wisconsin (WI)",
        optionA: "True",
        optionB: "False",
        optionC: "",
        optionD: "",
        correctOption: "optionA",
    },

    {
        question: "For which website was the number of unique visitors the largest in 2010?",
        optionA: "Amazon",
        optionB: "Chase",
        optionC: "PayPal",
        optionD: "Citibank",
        correctOption: "optionD",
    }

]
var graph_box = document.getElementById('graph_box');
var question = document.getElementById("question");
var option1 = document.querySelector("#option1");
var option2 = document.querySelector("#option2");
var option3 = document.querySelector("#option3");
var option4 = document.querySelector("#option4");
var next = document.querySelector("#sub-button");
var answers = document.querySelectorAll('.answer');
var showScore = document.querySelector('#showScore');
var cont = document.querySelector(".continue");
var timeCount = document.querySelector(".timer");

var questionCount = 0;
var score = 0;
var counter;
var loadQuestion = () => {
    var questionList = questions[questionCount];
    question.innerText = questionList.question;
    option1.innerText = questionList.optionA;
    option2.innerText = questionList.optionB;
    option3.innerText = questionList.optionC;
    option4.innerText = questionList.optionD;
}
loadQuestion();


var checkAnswer = () => {
    var answer;
    answers.forEach((curAnsElem) => {
        if (curAnsElem.checked) {
            answer = curAnsElem.id;
        }
    })
    return answer;
}

next.addEventListener('click', () => {
    var checkedAnswer = checkAnswer();
    console.log(checkedAnswer);

    if (checkedAnswer === questions[questionCount].correctOption) {
        score++;
        console.log("Score:" + score);
        sessionStorage.setItem("scores", score)
    };

    questionCount++;
    deSelectAll();

    if (questionCount < questions.length) {

        if (questionCount === 1) {
            BarChart();
            loadQuestion();
        }
        else if (questionCount === 2) {
            StackedBar();
            loadQuestion();
        }
        else if (questionCount === 3) {
            stacked100();
            loadQuestion();

        }
        else if (questionCount === 4) {
            pieChart();
            loadQuestion();
        }
        else if (questionCount === 5) {
            histogram();
            loadQuestion();
        }
        else if (questionCount === 6) {
            scatterplot();
            loadQuestion();
            document.getElementById("optionC").disabled = true;
            document.getElementById("optionD").disabled = true;
        }
        else if (questionCount === 7) {
            areaChart();
            loadQuestion();
            document.getElementById("optionC").disabled = false;
            document.getElementById("optionD").disabled = false;
        }
        else if (questionCount === 8) {
            stackedArea();
            loadQuestion();
            document.getElementById("optionC").disabled = false;
            document.getElementById("optionD").disabled = false;
        }
        else if (questionCount === 9) {
            bubbleChart();
            loadQuestion();
            document.getElementById("optionC").disabled = false;
            document.getElementById("optionD").disabled = false;
        }
        else if (questionCount === 10) {
            choropleth();
            loadQuestion();
            document.getElementById("optionC").disabled = true;
            document.getElementById("optionD").disabled = true;
        }
        else if (questionCount === 11) {
            treemap();
            loadQuestion();
            document.getElementById("optionC").disabled = false;
            document.getElementById("optionD").disabled = false;
        }
        else {
            loadQuestion();
        }
        console.log(questionCount);
    }
    else {
        location.href = "score.html"
    }
})

var deSelectAll = () => {
    answers.forEach((curAnsElem) => curAnsElem.checked = false);
}
if (questionCount === 0) {
    linechart();
}