
//DOM
const showWrongLetters = document.getElementById("wrongLetters");
const letters = document.getElementsByClassName("letters");
const submit = document.getElementById("submit");


//Global variables - create an array of arrays. 1st Array for (3) letter words, 2nd Array for (4) letter words etc.
const wordsByLength = [
    three = ["cat", "dog", "tip", "bee", "fly", "man", "sin", "pop", "red", "sit", "dot", "van", "rot", "bye", "dye", "sad", "arm"],
    four = ["jazz", "high", "jerk", "lamb", "jump", "hazy", "jabs", "foxy", "fuze", "joke", "hope", "pray", "play", "stay", "buzz", "pool", "link", "hint", "junk", "jaws", "jams", "ripe", "hand", "site", "shot", "fort", "mean", "lean", "team", "meat", "seat", "unit", "hurt", "slog"],
    five = ["abuse", "adult", "agent", "beach", "basis", "break", "chain", "brown", "chest", "china", "claim", "class", "dream", "final", "floor", "grass", "glass", "green", "group", "heart", "horse", "hotel", "motor", "mouth", "music", "novel", "nurse", "order", "owner", "panel", "phone", "point", "power", "radio", "scope", "score", "sheet", "shirt", "shift", "shock", "youth", "watch", "water", "whole", "while", "white", "woman", "unity", "union", "uncle", "truth"]
];
//Store core game data in an Object 
const game = {
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

//Create letter input boxes based on the level
const createLetterBoxes = () => {
    const words = document.querySelector("#words");
    for (let i = 0; i < game.level + 3; i++) {
        const input = document.createElement("input");
        input.classList.add("letters");
        input.classList.add("animate");
        input.maxLength = 1;

        //Input field event listeners to add/remove focus, and auto change focus to next Sibling on key press
        input.addEventListener("focus", function(e) {
            e.target.style.border = "solid aqua 3px";
            e.target.style.outline = "solid yellow 1px";
            e.target.select();
        })
        input.addEventListener("blur", function(e) {
            e.target.style.border = "solid black 1px";
            e.target.style.outline = "none";
        })
        input.addEventListener("keyup", function(e) {
            let next = e.target.nextSibling;
            if (next === null) {
                submit.focus();
            } else if(next.disabled === true) {
                //keep checking next sibling for an available input
                //otherwise, switch focus to the button
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

//choose word from array, depending on level. Eg level 1 = 3 letter words, level 2 = 4 letter words, etc
const chooseWord = () => {
    const wordIndex = Math.round(Math.random() * wordsByLength[game.level].length);
    game.word = wordsByLength[game.level][wordIndex];
    console.log(game.word);
}

const checkAnswer = (answer, letters) => {
    //breakdown choices to compare letter-by-letter
    const comparePlayerChoice = answer.split("");
    const compareGameChoice = game.word.split("");

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
        } else if (!game.wrongLetters.includes(letters[i].value) && (!letters[i].disabled)) {
                game.wrongLetters.push(letters[i].value);
                const display = game.wrongLetters.join(', ');
                showWrongLetters.textContent = `Incorrect letters: ${display}`;
            } 
    }
    
    //if correct word, move to next level of game
    if (answer === game.word) {
        game.winStreak++;
        //refresh hangman
        //display winstreak on screen
        //history of winning words? side panel?
        game.level++;
        showWrongLetters.textContent = "CORRECT!!!"
        setTimeout( () => {
            clearAll();
            chooseWord();
            createLetterBoxes();
        }, game.interval);
     } 
    //  else {
    //     let index = 0;
    //     for (const letter of letters) {
    //         //console.log(letters[index].disabled);
    //         if (letters[index].disabled) {
    //             index += 1;
    //             letters[index].focus();
    //         } else {
    //             letters[index].focus();
    //         }
    //     }
        //create array to store different stages of hangman
        //update to next state
        //change border color to red when nearing final chances?
    // }
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
createLetterBoxes(game.level);
chooseWord(game.level);