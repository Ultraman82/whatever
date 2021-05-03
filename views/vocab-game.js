let vocabList = [
  {
    word: "bag",
    word_id: "233",
    box:"",
    answer: "가구",
    options: ["가구", "가방", "강아지", "shinbal"],
  },
  {
    word: "cat",
    answer: "goyangi",
    optionss: ["ge", "bal", "jib", "be"],
  },
  {
    word: "train",
    answer: "jiha",
    options: ["cha", "jadongcha", "gonda"],
  },
];

function hi() {
  console.log(arr);
}

/* neccesary global variables */
var round = 0;
var interval = 0,
  processedWordObj,
  timeElapsed = 0;

function createIndividualQuestionObject(allWordsObj) {
  var cummulativeReformattedQuestions = [];

  allWordsObj.forEach((element, index) => {
    element.options.push(element.answer);
    var shuffledArray = shuffleArray(element.options);
    var buttonArray = [];
    shuffledArray.forEach((word) => {
      buttonArray.push(word);
    });

    var tempArray = [];
    tempArray.push(element.word);
    tempArray.push(buttonArray);
    tempArray.push(element.answer);
    cummulativeReformattedQuestions.push(tempArray);
  });
  return cummulativeReformattedQuestions;
}

function generateRandomOptions(vocabList) {
  for (var i = 0; i < vocabList.length; i++) {
    vocabList[i].options.push(vocabList[i].answer);
    shuffleArray(vocabList[i].options);
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startGame() {
  console.log("start_game")
  processedWordObj = createIndividualQuestionObject(vocabList);
  loadNextRound();
}

function loadNextRound() {
  document.getElementById("thought").innerHTML = "";
  document.getElementById("answerBox").innerHTML = "";

  document.getElementById("thought").innerHTML = processedWordObj[round][0];

  processedWordObj[round][1].forEach((answer) => {
    var div = document.createElement("div");
    div.classList.add("w-20");
    div.classList.add("ma-3");

    var randomDivClass = Math.round(Math.random() * 5);
    switch (randomDivClass) {
      case 0:
        if (div.classList.contains("muffin") == false) {
          div.classList.add("muffin");
          break;
        }

      case 1:
        if (div.classList.contains("hotdog") == false) {
          div.classList.add("hotdog");
          break;
        }
      case 2:
        if (div.classList.contains("wrap") == false) {
          div.classList.add("wrap");
          break;
        }
      case 3:
        if (div.classList.contains("pizza") == false) {
          div.classList.add("pizza");
          break;
        }
      case 4:
        if (div.classList.contains("burger") == false) {
          div.classList.add("burger");
          break;
        }
      case 5:
        if (div.classList.contains("fries") == false) {
          div.classList.add("fries");
          break;
        }
    }

    var button = document.createElement("button");

    button.onclick = function () {
      checkAnswer(answer);
    };
    button.innerHTML = answer;
    div.appendChild(button);
    document.getElementById("answerBox").appendChild(div);
  });
  document.getElementById("thought").innerHTML = processedWordObj[round][0];
  startTimer();
}

function refreshButtonValues(vocabObj, index) {
  vocabObj[index][1].forEach((element, i) => {
    document.getElementById("button" + i) = vocabObj[index][i];
  });
}
function startTimer() {
  timeElapsed = 0;
  interval = setInterval(updateTimeVar, 100);

  function updateTimeVar() {
    timeElapsed += 1;
  }
}

function checkAnswer(guess) {
  var correctAnswer = processedWordObj[round][2];
  var wrongCount = 0;

  clearInterval(interval);
  var time = timeElapsed;
  console.log(timeElapsed);

  if (guess == correctAnswer && round == processedWordObj.length - 1) {
    console.log("last round");
    document.getElementById("thought").innerHTML = "finished";
    document.getElementById("answerBox").innerHTML = "submit score";
    return;
  } else if (guess == correctAnswer) {
    if (time <= 30 && wrongCount == 0) {
      processedWordObj[round].points = Math.floor(Math.random() * 5 + 6);
    } //between 5-9
    else if (wrongCount > 3) {
      processedWordObj[round].points = 0;
    } else if (wrongCount > 2) {
      processedWordObj[round].points = 1;
    } else if (wrongCount == 0) {
      processedWordObj[round].points = Math.floor(Math.random() * 5 + 2);
    }

    round++;
    loadNextRound();
  } else {
    wrongCount = wrongCount + 1;
    console.log(`${guess} is wrong. ${wrongCount} wrong guesses.`);
  }
}
