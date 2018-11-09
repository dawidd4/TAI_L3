let quizContainer = document.getElementsByClassName('quiz-container')[0];
let progressBar = quizContainer.getElementsByClassName('progress')[0];
let cardQuestionStart = document.getElementById('question-start');
let cardQuestionResults = document.getElementById('question-results');
let questionNavButtons = document.getElementById('question-nav-buttons').children;

let buttonStart = questionNavButtons[0];
let buttonNext = questionNavButtons[1];
let buttonReset = questionNavButtons[2];
let buttonEnd = questionNavButtons[3];

let tempResults = [70, 80, 40, 50, -1, -1, -1, -1, -1, -1];
localStorage.setItem('tempResults', JSON.stringify(tempResults));
let retrievedObject = localStorage.getItem('tempResults');
console.log('retrievedObject: ', JSON.parse(retrievedObject)[3]);

let resultsUpdate = function () {
    let resultsStorage = JSON.parse(localStorage.getItem('tempResults'));
    console.log(resultsStorage);

    let resultsAverage = (() => {
        let el = 10;
        let sum = 0;
        for (let i of resultsStorage) {
            if (i == -1) {
                el--;
            } else {
                sum += i;
            };
        }
        return sum/el;
    })();

    console.log(resultsAverage);
}

let disableRestOfButtons = function () {
    for (let button of questionNavButtons) {
        if (!button.classList.contains('disabled')) {
            button.classList.add('disabled');
        } else {
            button.classList.remove('disabled');
        }
    }
}
let enableRestOfButtons = function () {
    for (let button of questionNavButtons) {
        if (button.classList.contains('disabled')) {
            button.classList.remove('disabled');
        } else {
            button.classList.add('disabled');
        }
    }
}

let results = function () {
    cardQuestionStart.classList.add('d-none');
    cardQuestionResults.classList.remove('d-none');
    resultsUpdate();
}
let quizMain = function () {
    cardQuestionStart.classList.remove('d-none');
    cardQuestionResults.classList.add('d-none');
}

let startQuiz = function () {
    buttonStart.removeEventListener('click', startQuiz);
    enableRestOfButtons();
    cardQuestionStart.classList.add('d-none');
    cardQuestionResults.classList.add('d-none');

}

fetch('questions.json')
    .then(response => response.json())
    .then(quiz => {
        //console.log(quiz[0].prompts[0]);
        return;
    });

buttonStart.addEventListener('click', startQuiz);
resultsUpdate();
