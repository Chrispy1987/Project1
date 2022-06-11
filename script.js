
//DOM
const showWrongLetters = document.getElementById("wrongLetters");

//Global variables - create an array of arrays. 1st Array for (3) letter words, 2nd Array for (4) letter words etc.
const wordsByLength = [
    three = ["cat", "dog", "tip", "bee", "fly", "man", "sin", "pop", "red", "sit", "dot", "van", "rot", "bye", "dye", "sad", "arm"],
    four = ["jazz", "high", "jerk", "lamb", "jump", "hazy", "jabs", "foxy", "fuze", "joke", "hope", "pray", "play", "stay", "buzz", "pool", "link", "hint", "junk", "jaws", "jams", "ripe", "hand", "site", "shot", "fort", "mean", "lean", "team", "meat", "seat", "unit", "hurt", "slog"],
    five = ["abuse", "adult", "agent", "beach", "basis", "break", "chain", "brown", "chest", "china", "claim", "class", "dream", "final", "floor", "grass", "glass", "green", "group", "heart", "horse", "hotel", "motor", "mouth", "music", "novel", "nurse", "order", "owner", "panel", "phone", "point", "power", "radio", "scope", "score", "sheet", "shirt", "shift", "shock", "youth", "watch", "water", "whole", "while", "white", "woman", "unity", "union", "uncle", "truth"]
];
let wrongLetters = [];    
let level = 0;
let winStreak = 0;
let word = "";

//Clear existing inputs for next level
const clearAll = () => {
    const words = document.querySelector("#words");
    while(words.hasChildNodes()) {
      words.firstChild.remove();
    }
    wrongLetters = [];
    showWrongLetters.textContent = "";
}

//Create letter input boxes based on the level
const createLetterBoxes = (level) => {
    const words = document.querySelector("#words");
    for (let i = 0; i < level + 3; i++) {
        const input = document.createElement("input");
        input.classList = "letters";
        input.maxLength = 1;
        words.appendChild(input);
    }
}

//choose word from array, depending on level. Eg level 1 = 3 letter words, level 2 = 4 letter words, etc
const chooseWord = (level) => {
    const wordIndex = Math.round(Math.random() * wordsByLength[level].length);
    word = wordsByLength[level][wordIndex];
    console.log(word);
}

const checkAnswer = (answer, letters) => {
    //breakdown choices to compare letter-by-letter
    const comparePlayerChoice = answer.split("");
    const compareGameChoice = word.split("");

    //check for exact match, same position
    for (let i = 0; i < answer.length; i++) {
        if (comparePlayerChoice[i] === compareGameChoice[i]) {  
            letters[i].style.backgroundColor = "yellowgreen";
            letters[i].disabled = true;
            compareGameChoice[i] = null;
        } else {
            letters[i].style.backgroundColor = "red";            
        }
    }  
    
    //check for match, but in wrong position
    for (let i = 0; i < answer.length; i++) { 
        if (compareGameChoice.includes(comparePlayerChoice[i])) {
            letters[i].style.backgroundColor = "orange";
        //display incorrect letters
        } else if (!wrongLetters.includes(letters[i].value) && (!letters[i].disabled)) {
                wrongLetters.push(letters[i].value);
                const display = wrongLetters.join(', ');
                showWrongLetters.textContent = `Incorrect letters: ${display}`;
            } 
    }
    
    //if correct word, move to next level of game
    if (answer === word) {
        alert("CORRECT");
        winStreak++;
        //refresh hangman
        //display winstreak on screen
        //history of winning words? side panel?
        level++;
        clearAll();
        chooseWord(level);
        createLetterBoxes(level);
    } else {
        //create array to store different stages of hangman
        //update to next state
        //change border color to red when nearing final chances?
    }
}

//EVENT LISTENERS
//Add focus/blur event listeners to highlight focus input box
//Add keyup event listner to automatically change focus to next input (ignore disabled)

//Start Game
const startGame = document.querySelector("#submit");
startGame.addEventListener("click", () => {
    let answer = "";
    const letters = document.querySelectorAll(".letters");
    for (const letter of letters) {
        answer += letter.value;
    }
    checkAnswer(answer, letters);
});

//ON FIRST LOAD - TESTING
createLetterBoxes(level);
chooseWord(level);