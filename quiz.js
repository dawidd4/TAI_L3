let quizContainer = document.getElementsByClassName('quiz-container')[0];
let progressBar = quizContainer.getElementsByClassName('progress-bar')[0];
let cardQuestionStart = document.getElementById('question-start');
let cardQuestionResults = document.getElementById('question-results');
let questionNavButtons = document.getElementById('question-nav-buttons').children;
let cardQuestions = document.getElementById('questions');
let questionsList = {};
let guesses;
let questionNumber = document.getElementById('question-number');
let questionText = document.getElementById('question-text');
let questionPrompts = document.getElementsByClassName('prompt');
let questionIndex = 0;

let buttonStart = questionNavButtons[0];
let buttonNext = questionNavButtons[1];
let buttonReset = questionNavButtons[2];
let buttonEnd = questionNavButtons[3];

const numberOfRestults = 10; //changing this resets stored results

let buttonStartEnable = () => {
    buttonStart.addEventListener('click', startQuiz);
    buttonStart.classList.remove('disabled');
}
let buttonNextEnable = () => {
    buttonNext.addEventListener('click', nextQuestion);
    buttonNext.classList.remove('disabled');
}
let buttonResetEnable = () => {
    buttonReset.addEventListener('click', resetQuiz);
    buttonReset.classList.remove('disabled');
}
let buttonEndEnable = () => {
    buttonEnd.addEventListener('click', endQuiz);
    buttonEnd.classList.remove('disabled');
}

let buttonStartDisable = () => {
    buttonStart.removeEventListener('click', startQuiz);
    buttonStart.classList.add('disabled');
}
let buttonNextDisable = () => {
    buttonNext.removeEventListener('click', nextQuestion);
    buttonNext.classList.add('disabled');
}
let buttonResetDisable = () => {
    buttonReset.removeEventListener('click', resetQuiz);
    buttonReset.classList.add('disabled');
}
let buttonEndDisable = () => {
    buttonEnd.removeEventListener('click', endQuiz);
    buttonEnd.classList.add('disabled');
}

let average = function (arr) {
    let el = numberOfRestults;
    let sum = 0;
    for (let i in arr) {
        if (arr[i] === -1 || arr[i] == null) {
            if (i == 0) {
                return -1;
            } else if (i == 1) {
                return sum;
            }
            el = i;
            break;
        } else {
            sum += arr[i];
        }
    }
    return Math.round(sum / el);
}

let getResults = function () {
    let resultsStorage = {};
    if('resutlsStorage' in localStorage){
        resultsStorage = JSON.parse(localStorage.getItem('resultsStorage'));
    }
    if (
        resultsStorage == null ||
        resultsStorage.length != numberOfRestults
    ) {
        localStorage.setItem('resultsStorage', JSON.stringify(new Array(numberOfRestults).fill(-1)));
    }

    let resultsAverage = average(resultsStorage);
    localStorage.setItem('resultsAverage', JSON.stringify(resultsAverage));

}

let saveResult = function () {
    let resultsStorage = JSON.parse(localStorage.getItem('resultsStorage'));
    let result = (() => {
        let totalHits = 0;
        for (let i = 0; i < guesses.length; i++) {
            //console.log(i + ": " + questionsList[i].answer + ", " + guesses[i]);
            if (guesses[i] == (questionsList[i].answer - 1)) {
                totalHits++;
            }
        }
        return Math.round(100 * totalHits / (guesses.length));
    })();
    resultsStorage.pop();
    resultsStorage.unshift(result);

    localStorage.setItem('resultsStorage', JSON.stringify(resultsStorage));
    localStorage.setItem('resultsAverage', JSON.stringify(average(resultsStorage)));
}

let resultsFillCard = function (cardToFill) {
    let resultsStorage = JSON.parse(localStorage.getItem('resultsStorage'));
    let avgStorage = JSON.parse(localStorage.getItem('resultsAverage'));
    const columns = 2;
    const elements = resultsStorage.length;
    let headings = cardToFill.querySelectorAll("h4,h5,h6");
    if (headings == null) return; // Oops, this card has no headings
    let lastHeading = headings[headings.length - 1];
    let row = document.getElementById('results');
    let avgContainer = document.getElementById('average');
    let avgValueContainer = document.createElement('strong');
    if (row === null) {
        //if div with id 'row' does not exist in this card, add it
        row = document.createElement('div');
        row.id = 'results';
        row.className = 'row';
        lastHeading.after(row);
    }
    while (row.firstChild) {
        row.removeChild(row.firstChild);
    }
    if (resultsStorage[0] === -1 || resultsStorage[0] == null) {
        let hContent = document.createTextNode("Brak wyników");
        lastHeading.replaceChild(hContent, lastHeading.childNodes[0]);
        return;
    }
    const cols = (columns <= 3) ? columns : 3;
    const elementsInCols = Math.floor(elements / cols);
    outerloop:
        for (let i = 0; i < cols; i++) {
            let col = document.createElement('div');
            col.classList.add('col-4');
            if (i === 0) {
                if (cols === 1) {
                    col.classList.add('offset-4');
                } else if (cols === 2) {
                    col.classList.add('offset-2');
                }
            }
            row.appendChild(col);
            let start = 0;
            let ol = document.createElement('ol');
            if (i) {
                start = i * elementsInCols;
                ol.setAttribute('start', (start + 1).toString());
            }
            col.appendChild(ol);
            for (let i = start; i < (start + elementsInCols); i++) {
                let li = document.createElement('li');
                let b = document.createElement('b');
                if (resultsStorage[i] == -1) break outerloop;
                let content = document.createTextNode(resultsStorage[i].toString() + "%");
                ol.appendChild(li);
                li.appendChild(b);
                b.appendChild(content);
            }
        }
    if (avgContainer) {
        while (avgContainer.lastChild.tagName == 'STRONG') {
            avgContainer.removeChild(avgContainer.lastChild);
        }
        avgValueContainer.appendChild(document.createTextNode(avgStorage + '%'));
        avgContainer.appendChild(avgValueContainer);
    }

}

let results = function () {
    cardQuestionStart.classList.add('d-none');
    cardQuestionResults.classList.remove('d-none');
    resultsFillCard(cardQuestionResults);
}
let quizMain = function () {
    cardQuestionStart.classList.remove('d-none');
    cardQuestionResults.classList.add('d-none');
}
let updateProgressBar = function () {
    progressBar.textContent = (questionIndex + 1) + "/" + guesses.length;
    progressBar.style.width = (100 * (questionIndex + 1) / guesses.length) + '%';
}

let guess = function (guess) {
    guesses[questionIndex - 1] = guess;
    for (let i = 0; i < questionPrompts.length; i++) {
        questionPrompts[i].classList.replace('btn-primary', 'btn-secondary');
    }
    questionPrompts[guess].classList.replace('btn-secondary', 'btn-primary');
    //disableAnswering();
}
guessA = function () {
    guess(0);
}
guessB = function () {
    guess(1);
}
guessC = function () {
    guess(2);
}
guessD = function () {
    guess(3);
}

function disableAnswering() {
    questionPrompts[0].removeEventListener('click', guessA);
    questionPrompts[1].removeEventListener('click', guessB);
    questionPrompts[2].removeEventListener('click', guessC);
    questionPrompts[3].removeEventListener('click', guessD);
    for (let prompt of questionPrompts) {
        prompt.classList.add('disabled');
    }
}

function enableAnswering() {
    questionPrompts[0].addEventListener('click', guessA);
    questionPrompts[1].addEventListener('click', guessB);
    questionPrompts[2].addEventListener('click', guessC);
    questionPrompts[3].addEventListener('click', guessD);
    for (let prompt of questionPrompts) {
        prompt.classList.remove('disabled');
    }
}

function startQuiz() {
    buttonStartDisable();
    buttonNextEnable();
    buttonResetEnable();
    buttonEndEnable();
    cardQuestionStart.classList.add('d-none');
    cardQuestionResults.classList.add('d-none');
    cardQuestions.classList.remove('d-none');
    guesses = new Array(questionsList.length).fill(-1);
    progressBar.parentNode.classList.remove('invisible');
    progressBar.textContent = '0/' + guesses.length;

    nextQuestion();

}

function nextQuestion() {

    updateProgressBar();

    if (questionIndex == questionsList.length - 1) {
        buttonNextDisable();
    }

    questionNumber.textContent = (questionIndex + 1).toString();
    questionText.textContent = questionsList[questionIndex].question;
    for (let i = 0; i < questionPrompts.length; i++) {
        questionPrompts[i].textContent = questionsList[questionIndex].prompts[i];
        questionPrompts[i].classList.replace('btn-primary', 'btn-secondary');
        questionPrompts[i].classList.remove('disabled');
    }
    enableAnswering();
    questionIndex++;

}

function resetQuiz() {
    buttonStartEnable();
    buttonNextDisable();
    buttonResetDisable();
    buttonEndDisable();
    cardQuestions.classList.add('d-none');
    cardQuestionStart.classList.remove('d-none');
    guesses.fill(-1);
    questionIndex = 0;
    progressBar.parentNode.classList.add('invisible');
    updateProgressBar();
}

function endQuiz() {
    saveResult();
    resultsFillCard(cardQuestionResults);
    resetQuiz();
    cardQuestionStart.classList.add('d-none');
    cardQuestionResults.classList.remove('d-none');
}



let readyForQuiz = function () {
    buttonStart.classList.remove('disabled');
    buttonStart.addEventListener('click', startQuiz);
    enableAnswering();
}


fetch('questions.json')
    .then(response => response.json())
    .then(quiz => {
        readyForQuiz();
        questionsList = quiz;
        return;
    });

getResults();
