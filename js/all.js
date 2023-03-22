// Pages
const splashPage = document.getElementById("splash-page");
const countdownPage = document.getElementById("countdown-page");
const gamePage = document.getElementById("game-page");
const scorePage = document.getElementById("score-page");
// Splash page
const startForm = document.getElementById("start-form");
const radioContainers = document.querySelectorAll(".radio-container");
const radioInputs = document.querySelectorAll("input");
const bestScores = document.querySelectorAll(".best-score-value");
// Countdown Page
const countdown = document.querySelector(".countdown");
// Game Page
const itemContainer = document.querySelector(".item-container");
// Score Page
const finalTimeEl = document.querySelector(".final-time");
const baseTimeEl = document.querySelector(".base-time");
const penaltyTimeEl = document.querySelector(".penalty-time");
const playAgainBtn = document.querySelector(".play-again");

//Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];

// Game page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongforamt = [];

//Time
let timer;
let timeplayed = 0;
let basetime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = "0.0";

//scroll
let valueY = 0;

//refresh splash page best score to dom
function bestScoresToDom() {
  bestScores.forEach((bestScore, index) => {
    const bestScoreEl = bestScore;
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}s`;
  });
}

//check localStorage for best score,set bestScoresArray
function getSavedBestScores() {
  if (localStorage.getItem("bestScores")) {
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      { question: 10, bestScore: finalTimeDisplay },
      { question: 25, bestScore: finalTimeDisplay },
      { question: 50, bestScore: finalTimeDisplay },
      { question: 99, bestScore: finalTimeDisplay },
    ];
    localStorage.setItem("bestScores", JSON.stringify(bestScoreArray));
  }
  bestScoresToDom();
}

//update bestscoreArry
function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    if (questionAmount == score.question) {
      const savedBestScore = Number(bestScoreArray[index].bestScore);
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  //update splash page
  bestScoresToDom();
  //save on local storage
  localStorage.setItem("bestScores", JSON.stringify(bestScoreArray));
}

//Reset Game
function playAgain() {
  gamePage.addEventListener("click", startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
}

//format and display time to dom
function scoresToDom() {
  finalTimeDisplay = finalTime.toFixed(1);
  basetime = timeplayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${basetime}s`;
  penaltyTimeEl.textContent = `Penalty Time: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore();
  //scroll to top ,go to score page
  itemContainer.scrollTo({ top: 0, behavior: "instant" });
  showScorePage();
}

//show score page
function showScorePage() {
  //show playagainbtn after 1s
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);

  gamePage.hidden = true;
  scorePage.hidden = false;
}

//stop timer,process results,go to score page
function checkTime() {
  console.log(timeplayed);
  if (playerGuessArray.length == questionAmount) {
    console.log("player guess array", playerGuessArray.length);
    clearInterval(timer);
    equationsArray.forEach((equation, index) => {
      if (equation.evaluated === playerGuessArray[index]) {
        //correct guess , no penalty
      } else {
        //wrong guess, penalty
        penaltyTime += 0.5;
      }
    });
    //check for wrong guesses, and penalty time
    finalTime = timeplayed + penaltyTime;
    console.log(
      "final",
      finalTime,
      "penalty",
      penaltyTime,
      "timeplayed",
      timeplayed
    );
    scoresToDom();
  }
}

//add teneh of a second to timeplayed
function addTime() {
  timeplayed += 0.1;
  checkTime();
}

//start timer when game page is clicked
function startTimer() {
  //reset time
  timeplayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener("click", startTimer);
}

//scroll, player Array
function select(guessedtrue) {
  console.log(playerGuessArray);
  valueY += 80;
  itemContainer.scroll(0, valueY);
  //Add player guess to array
  return guessedtrue
    ? playerGuessArray.push("true")
    : playerGuessArray.push("false");
}

//產生亂數
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

//產生算式
function createEquations() {
  const correctEquations = getRandomInt(questionAmount);

  const wrongEqustions = questionAmount - correctEquations;

  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} * ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: "true" };
    equationsArray.push(equationObject);
  }

  for (let i = 0; i < wrongEqustions; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongforamt[0] = `${firstNumber} * ${secondNumber + 1} = ${equationValue}`;
    wrongforamt[1] = `${firstNumber} * ${secondNumber} = ${equationValue - 1}`;
    wrongforamt[2] = `${firstNumber + 1} * ${secondNumber} = ${equationValue}`;
    const formatChioce = getRandomInt(3);
    const equation = wrongforamt[formatChioce];
    equationObject = { value: equation, evaluated: "false" };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

//產出隨機算式的html
function equationToDom() {
  equationsArray.forEach((equation) => {
    const item = document.createElement("div");
    item.classList.add("item");
    const equationText = document.createElement("h1");
    equationText.textContent = equation.value;
    //append
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

function populateGamePage() {
  itemContainer.textContent = "";
  const topSpacer = document.createElement("div");
  topSpacer.classList.add("height-240");
  const selectedItem = document.createElement("div");
  selectedItem.classList.add("selected-item");
  itemContainer.append(topSpacer, selectedItem);

  createEquations();
  equationToDom();

  const bottomSpacer = document.createElement("div");
  bottomSpacer.classList.add("height-500");
  itemContainer.appendChild(bottomSpacer);
}

//display game page
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

//display 3 2 1 go!
function countdownStart() {
  countdown.textContent = "3";
  setTimeout(() => {
    countdown.textContent = "2";
  }, 1000);
  setTimeout(() => {
    countdown.textContent = "1";
  }, 2000);
  setTimeout(() => {
    countdown.textContent = "Go!";
  }, 3000);
}
//Navigate from splash page to countdown page
function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countdownStart();
  populateGamePage();
  setTimeout(showGamePage, 4000);
}
//Splash page
function getRadioValue() {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}

function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  console.log(questionAmount);
  if (questionAmount) {
    showCountdown();
  }
}

startForm.addEventListener("click", () => {
  radioContainers.forEach((radioEl) => {
    radioEl.classList.remove("selected-label");
    if (radioEl.children[1].checked) {
      radioEl.classList.add("selected-label");
    }
  });
});

startForm.addEventListener("submit", selectQuestionAmount);
gamePage.addEventListener("click", startTimer);

//on load
getSavedBestScores();
