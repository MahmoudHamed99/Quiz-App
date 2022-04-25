let countSpan = document.querySelector(".quiz-info .num span"),
    bulletsCont = document.querySelector(".count ul"),
    countCont = document.querySelector(".count"),
    quesCont = document.querySelector(".question"),
    ansCont = document.querySelector(".answers"),
    subButton = document.querySelector(".sub"),
    counterCont = document.querySelector(".counter"),
    resultCont = document.querySelector(".result"),
    rightAnswers = 0,
    countDownInterval,
    currentIndex = 0;

function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let myObject = JSON.parse(this.responseText);
            numOfQuestions(myObject.length);
            quesAndAns(myObject[currentIndex], myObject.length);
            countDown(60);
            subButton.onclick = () => {
                let rightAns = myObject[currentIndex]['right-answer'];
                currentIndex++;
                checkAns(rightAns, myObject.length);
                if (currentIndex < myObject.length) {
                    quesCont.innerHTML = "";
                    ansCont.innerHTML = "";
                    quesAndAns(myObject[currentIndex], myObject.length);
                    handleBullets();
                    if (currentIndex == (myObject.length - 1)) {
                        subButton.innerHTML = "Show Results";
                    }
                    clearInterval(countDownInterval);
                    countDown(60);
                }
                if (currentIndex == myObject.length) {
                    showResult(rightAnswers, myObject.length);
                    quesCont.remove();
                    ansCont.remove();
                    bulletsCont.remove();
                    countCont.remove();
                    subButton.remove();
                }
            }
        }
    }
    myRequest.open("GET", "questions.json", true);
    myRequest.send();
}
getQuestions();

function numOfQuestions(num) {
    // Create Number Of Questions Span
    countSpan.innerHTML = num;
    // Create Bullets
    for (let i=1 ; i<=num ; i++) {
        let bullet = document.createElement("li");
        if (i == 1) {
            bullet.className = "on";
        }
        bulletsCont.appendChild(bullet);
    }
}
function quesAndAns(obj, num) {
    // Create Question
    let ques = document.createElement("h2");
    ques.appendChild(document.createTextNode(obj.title));
    quesCont.appendChild(ques);
    // Create Answers
    for (let i=1 ; i<=4 ; i++) {
        let ans = document.createElement("div"),
        ansRadio = document.createElement("input"),
        ansLabel = document.createElement("label");
        ans.className = "ans";
        ansRadio.type = "radio";
        ansRadio.name = "answer";
        ansRadio.id = `answer-${i}`;
        ansRadio.dataset.answer = obj[`answer-${i}`];
        if (i === 1) {
            ansRadio.checked = true;
        }
        ansLabel.htmlFor = `answer-${i}`;
        ansLabel.appendChild(document.createTextNode(obj[`answer-${i}`]))
        ans.appendChild(ansRadio);
        ans.appendChild(ansLabel);
        ansCont.appendChild(ans);
    }
}
function checkAns(rans, count) {
    let myAnswers = document.getElementsByName("answer");
    myAnswers.forEach((myanswer) => {
        if (myanswer.checked) {
            if (myanswer.dataset.answer === rans) {
                rightAnswers++;
            }
        }
    })
}
function handleBullets() {
    let myBullets = document.querySelectorAll(".count ul li");
    myBullets.forEach((bullet, index) => {
        if (index == currentIndex) {
            bullet.className = "on";
        }
    })
}
function showResult(right, count) {
    let myRank,
        myResult;
    if (right < parseInt(count/2)) {
        myRank = "bad";
        myResult = `<p class="res-text"><span class="${myRank}">${myRank}</span> You Answered ${right} From ${count}</p>`;
    } else if (right > parseInt(count/2) && right < count) {
        myRank = "good";
        myResult = `<p class="res-text"><span class="${myRank}">${myRank}</span> You Answered ${right} From ${count}</p>`;
    } else {
        myRank = "perfect";
        myResult = `<p class="res-text"><span class="${myRank}">${myRank}</span> You Answered ${right} From ${count}</p>`;
    }
    resultCont.innerHTML = ""
    resultCont.innerHTML = myResult;
}
function countDown(duration) {
    let minutes, seconds;
    countDownInterval = setInterval(() => {
        minutes = Math.floor(duration / 60);
        seconds = duration % 60;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;
        counterCont.innerHTML = `${minutes} : ${seconds}`;
        if (--duration < 0) {
            clearInterval(countDownInterval);
            subButton.click();
        }
    }, 1000)
}