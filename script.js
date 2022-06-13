
//DOM
const showWrongLetters = document.getElementById("wrongLetters");
const letters = document.getElementsByClassName("letters");
const submit = document.getElementById("submit");


//Global variables - create an array of arrays. 1st Array for (3) letter words, 2nd Array for (4) letter words etc.
const wordsByLength = [
    three = ["cat", "dog", "tip", "bee", "fly", "man", "sin", "pop", "red", "sit", "dot", "van", "rot", "bye", "dye", "sad", "arm"],
    four = ["jazz", "high", "jerk", "lamb", "jump", "hazy", "jabs", "foxy", "fuze", "joke", "hope", "pray", "play", "stay", "buzz", "pool", "link", "hint", "junk", "jaws", "jams", "ripe", "hand", "site", "shot", "fort", "mean", "lean", "team", "meat", "seat", "unit", "hurt", "slog"],
    five = ["abuse", "adult", "agent", "beach", "basis", "break", "chain", "brown", "chest", "china", "claim", "class", "dream", "final", "floor", "grass", "glass", "green", "group", "heart", "horse", "hotel", "motor", "mouth", "music", "novel", "nurse", "order", "owner", "panel", "phone", "point", "power", "radio", "scope", "score", "sheet", "shirt", "shift", "shock", "youth", "watch", "water", "whole", "while", "white", "woman", "unity", "union", "uncle", "truth"],
    six = ["abroad", "afraid", "agenda", "anyway", "arrive", "barely", "avenue", "august", "become", "castle", "center", "caught", "choice", "custom", "debate", "defend", "defeat", "escape", "enough", "fabric", "fourth", "health", "hidden", "income", "inside", "island", "killed", "lawyer", "legacy", "launch", "manual", "margin", "people", "permit", "player", "policy", "police", "public", "reward", "return", "sample", "search", "select", "sexual", "silent", "simple", "sister", "survey", "ticket", "toward", "weight", "winter", "worker"]
];
//Store core game data in an Object 
const game = {
    hangImages : [], //update with local images
    wrongLetters : [], //store incorrect letters to help player
    level : 0,         //game diffilculty level
    winStreak : 0,     //how many games player has won in a row
    word : "",         //random word that player has to guess
    interval : 2000   //pause timer between rounds
}

//Clear existing inputs for next level
const clearAll = () => {
    const words = document.querySelector("#words");
    while(words.hasChildNodes()) {
      words.firstChild.remove();
    }
    game.wrongLetters = [];
    showWrongLetters.textContent = "";
}

//Create letter input boxes based on the games level
const createLetterBoxes = () => {
    const words = document.querySelector("#words");
    for (let i = 0; i < game.level + 3; i++) {
        const input = document.createElement("input");
        input.classList.add("letters");
        input.classList.add("animate");
        input.maxLength = 1;

        //Event listener - show focus 
        input.addEventListener("focus", function(e) {
            e.target.style.border = "solid aqua 3px";
            e.target.style.outline = "solid yellow 1px";
            e.target.select();
        })
        //Event listener - remove focus
        input.addEventListener("blur", function(e) {
            e.target.style.border = "solid black 1px";
            e.target.style.outline = "none";
        })
        //Event listener - accept A-Z only and convert to Uppercase
        input.addEventListener("input", function(e) {
            const userInput = e.target.value.replace(/[^a-zA-Z\s]/g, "").toUpperCase();
            if (userInput !== "") {
                console.log(e.target.textContent)
                console.log(e.target);
                e.target.value = userInput;
            } else {
                e.target.previousSibling.focus();
                //fix code so focus on first item if no previous sibling
                //can we merge this into the KEYUP function to avoid conflict?
            }
        })
        //Event listener - change focus to next available input /or button
        input.addEventListener("keyup", function(e) {
            let next = e.target.nextSibling;
            if (next === null) {
                submit.focus();
            } else if (next.disabled === true) {
                while (next !== null && next.disabled === true) {
                    next = next.nextSibling;                                  
                }
                if (next === null) {
                    submit.focus();
                } else {
                    next.focus(); 
                }
            } else {
                next.focus();
            }
        });
        words.appendChild(input);
        letters[0].focus();
    }
}

//choose word from array, depending on level. 
const chooseWord = () => {
    const index = game.level;
    const wordIndex = Math.floor(Math.random() * wordsByLength[index].length);
    game.word = wordsByLength[index][wordIndex].toUpperCase();
    console.log(game.word);
}

const checkAnswer = (answer) => {
    //breakdown choices to compare letter-by-letter
    const comparePlayerChoice = answer.split("");
    const compareGameChoice = game.word.split("");

    //check for exact match, same position
    for (let i = 0; i < answer.length; i++) {
        if (comparePlayerChoice[i] === compareGameChoice[i]) {  
            letters[i].style.backgroundColor = "yellowgreen";
            letters[i].disabled = true;
            comparePlayerChoice[i] = 1;
        } 
        else {
            letters[i].style.backgroundColor = "red";            
        }
    }  

    //check for match, but in wrong position
    for (let i = 0; i < answer.length; i++) { 
        if ((compareGameChoice.includes(comparePlayerChoice[i])) && (compareGameChoice[i] === comparePlayerChoice[i])) {
            console.log(compareGameChoice[i] + comparePlayerChoice[i])
            letters[i].style.backgroundColor = "orange";
        //display incorrect letters to help player
        } else if ((!game.wrongLetters.includes(letters[i].value)) && (letters[i].disabled === false)) {         
                game.wrongLetters.push(letters[i].value);
                const display = game.wrongLetters.join(', ');
                showWrongLetters.textContent = `Incorrect letters: ${display}`;
            } 
    }
    //if correct word, move to next level of game
    if (answer === game.word) {
        game.winStreak++;
        game.level++;
        showWrongLetters.textContent = "CORRECT!!!"
        //refresh hangman
        //display winstreak on screen
        //history of winning words? side panel?

        //delay code for visual effect. Prep next level
        setTimeout(() => {
            clearAll();
            chooseWord();
            //update hangman to next state
            createLetterBoxes();
        }, game.interval);
     } else {
         //refocus on the first incorrect letter to try again
         //change border/background color when nearing final guesses
         for (const letter of letters) {
             if (letter.disabled === false) {
                return letter.focus();
             }
         }
     }
}

//EVENT LISTENERS
//update event listener to only accept letters A-Z (genexp)
//switch case to change behavious of DELETE, ENTER, TAB
//convert all letters to uppercase

//Start Game
const startGame = document.querySelector("#submit");
startGame.addEventListener("click", () => {
    let answer = "";
    const letters = document.querySelectorAll(".letters");
    for (const letter of letters) {
        answer += letter.value;
    }
    checkAnswer(answer);
});


//ON FIRST LOAD - TESTING
createLetterBoxes(game.level);
chooseWord(game.level);