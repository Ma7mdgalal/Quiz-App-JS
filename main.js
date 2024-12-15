// Select Elements
let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsArea = document.querySelector(".results");
// set Options
let currentIndex = 0;
let rightAnswers = 0;
function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let questionsObjects = JSON.parse(this.responseText);
      let qCount = questionsObjects.length;
      // add the count to the span and create bullets
      createBullets(qCount);
      //add questions data
      addQuestionsData(questionsObjects[currentIndex], qCount);
      // add conunt down
      countDown(5, qCount);
      // click on submit button
      submitButton.onclick = () => {
        // current answer
        let curentanswer = document.querySelector(
          'input[name="questions"]:checked'
        ).dataset.answer;
        //right answer
        let rightAnswer = questionsObjects[currentIndex].right_answer;
        currentIndex++;
        checkAnswer(curentanswer, rightAnswer);
        // add question data
        answersArea.innerHTML = "";
        quizArea.innerHTML = "";
        addQuestionsData(questionsObjects[currentIndex], qCount);
        // remove the active class from the previous bullets
        let bullets = document.querySelectorAll(".bullets .spans span");
        //bullets[currentIndex - 1].classList.remove("on");
        // add class active to the next bullet
        bullets[currentIndex].classList.add("on");
        clearInterval(countDownInterval);
        countDown(5, qCount);
        showResult(qCount);
      };
      // show result
    }
  };
  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}

getQuestions();
function createBullets(num) {
  countSpan.innerHTML = num;
  for (let i = 0; i < num; i++) {
    if (i == 0) {
      bulletsSpanContainer.innerHTML += `<span class="on"></span>`;
    } else {
      bulletsSpanContainer.innerHTML += `<span></span>`;
    }
  }
}
function addQuestionsData(question, count) {
  if (currentIndex < count) {
    // creat question title
    let title = document.createElement("h2");
    title.innerText = question.title;
    quizArea.appendChild(title);
    // creat answers  area
    for (let i = 1; i <= 4; i++) {
      // create main div answer
      let answer = document.createElement("div");
      answer.className = "answer";
      // create radio input
      let input = document.createElement("input");
      // add type + id + name + dataAttribute
      input.type = "radio";
      input.id = `answer_${i}`;
      input.name = "questions";
      input.dataset.answer = question[`answer_${i}`];
      // make first input checked
      if (i == 1) {
        input.checked = true;
      }
      // create label question and add for
      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;
      label.textContent = question[`answer_${i}`];
      answer.appendChild(input);
      answer.appendChild(label);
      // add answers to answers area
      answersArea.appendChild(answer);
    }
  }
}
function checkAnswer(currentAnswer, rightAnswer) {
  if (currentAnswer == rightAnswer) {
    rightAnswers++;
    console.log("right");
  } else {
    console.log("wrong");
  }
}
function showResult(count) {
  console.log(currentIndex);
  console.log(count);

  let theResults;
  if (currentIndex === count - 1) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bulletsSpanContainer.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
    }

    resultsArea.innerHTML = theResults;
    resultsArea.style.padding = "10px";
    resultsArea.style.backgroundColor = "white";
    resultsArea.style.marginTop = "10px";
  }
}
function countDown(duration, count) {
  if (currentIndex < count) {
    countDownInterval = setInterval(() => {
      let minutes = parseInt(duration / 60);
      let seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      document.querySelector(
        ".bullets .countdown"
      ).innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
