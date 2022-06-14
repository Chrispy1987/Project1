
//DOM
const showWrongLetters = document.getElementById("wrongLetters");
const letters = document.getElementsByClassName("letters");
const submit = document.getElementById("submit");
const hang = document.getElementById("hang");

//Words stored in an array of arrays. 1st Array for (3) letter words, 2nd Array for (4) letter words etc.
const wordsByLength = [
    // three = ["fly"], //for testing!
    three = ["cat", "dog", "tip", "bee", "fly", "man", "sin", "pop", "red", "sit", "dot", "van", "rot", "bye", "dye", "sad", "arm"],
    // four = ["jazz"], //for testing!
    four = ["jazz", "high", "jerk", "lamb", "jump", "hazy", "jabs", "foxy", "joke", "hope", "pray", "play", "stay", "buzz", "pool", "link", "hint", "junk", "jaws", "jams", "ripe", "hand", "site", "shot", "fort", "mean", "lean", "team", "meat", "seat", "unit", "hurt", "slog"],
    // five = ["chain"], //for testing!
    five = ["abuse", "adult", "agent", "beach", "basis", "break", "chain", "brown", "chest", "china", "claim", "class", "dream", "final", "floor", "grass", "glass", "green", "group", "heart", "horse", "hotel", "motor", "mouth", "music", "novel", "nurse", "order", "owner", "panel", "phone", "point", "power", "radio", "scope", "score", "sheet", "shirt", "shift", "shock", "youth", "watch", "water", "whole", "while", "white", "woman", "unity", "union", "uncle", "truth"],
    // six = ["island"], //for testing!
    six = ["abroad", "afraid", "agenda", "anyway", "arrive", "barely", "avenue", "august", "become", "castle", "center", "caught", "choice", "custom", "debate", "defend", "defeat", "escape", "enough", "fabric", "fourth", "health", "hidden", "income", "inside", "island", "killed", "lawyer", "legacy", "launch", "manual", "margin", "people", "permit", "player", "policy", "police", "public", "reward", "return", "sample", "search", "select", "sexual", "silent", "simple", "sister", "survey", "ticket", "toward", "weight", "winter", "worker"]
];
//Store core game data in an Object 
const game = {
    hangImages : ["images/1.png", "images/2.png", "images/3.png", "images/4.png", "images/5.png", "images/6.png", "images/7.png", "images/8.png"], //update with local images
    hangIndex : 0,      //record hangman image state
    wrongLetters : [], //store incorrect letters to help player
    level : 0,         //game diffilculty level
    winStreak : 0,     //how many games player has won in a row
    word : "",         //random word that player has to guess
    interval : 2000   //pause timer between rounds
}

//Clear existing inputs for next level
const clearAll = () => {
    const tiles = document.querySelector("#tiles");
    while(tiles.hasChildNodes()) {
      tiles.firstChild.remove();
    }
    game.wrongLetters = [];
    showWrongLetters.textContent = "";
    hang.src = game.hangImages[0];
    game.hangIndex = 0;
}

//Create letter input boxes based on the games level
const createLetterBoxes = () => {
    const tiles = document.querySelector("#tiles");
    for (let i = 0; i < game.level + 3; i++) {
        const input = document.createElement("input");
        input.required;
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
        //- change focus to next available input /or button
        input.addEventListener("keyup", function(e) {
            const key = e.key;
            switch (key) {
                case "Delete" :
                case "Backspace" :
                    if (e.target !== e.target.parentElement.firstChild) {   
                        let previous = e.target.previousSibling;         
                        if (previous.disabled === true) {
                            while (previous !== null && previous.disabled === true) {
                                previous = previous.previousSibling;                                  
                            }
                        }
                        if (previous === null) {
                            e.target.focus();
                            e.target.select();
                        } else {
                            previous.focus(); 
                        }
                        return;
                    }
            }
            
            const userInput = e.target.value.replace(/[^a-zA-Z\s]/g, "").toUpperCase();
            if (userInput !== "") {
                e.target.value = userInput;
            } else {
                console.log('invalid key entered');
                e.target.select();
                return e.target.focus();
            }
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
                    next.select();
                }
            } else {
                next.focus();
                next.select();
            }
        });
        tiles.appendChild(input);
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
    
    //check for exact match - turn tile green    
    for (let i = 0; i < answer.length; i++) {
        if (comparePlayerChoice[i] === compareGameChoice[i]) {  
            letters[i].classList.remove("almost", "incorrect");
            letters[i].classList.add("correct");
            letters[i].disabled = true;
            compareGameChoice[i] = null;
        }
    }    
    
    //create new array to get around 'passing by reference' issue.
    const compareRemaining = [];
    for (let i = 0; i < compareGameChoice.length; i++) {
        compareRemaining.push(compareGameChoice[i]);
    }

    //check for match but wrong position - turn tile orange    
    for (let i = 0; i < answer.length; i++) {        
        if (compareRemaining.includes(comparePlayerChoice[i])) {
            const index = compareRemaining.indexOf(comparePlayerChoice[i]);
            compareRemaining[index] = null;
            letters[i].classList.remove("incorrect");  
            letters[i].classList.add("almost");
    //check for no match - turn tile red and log incorrect letter                      
        } else if (letters[i].disabled === false) {
            letters[i].classList.remove("almost");  
            letters[i].classList.add("incorrect");
            if ((!game.wrongLetters.includes(letters[i].value))) {         
                game.wrongLetters.push(letters[i].value);
                const display = game.wrongLetters.join(', ');
                showWrongLetters.textContent = display;
            } 
        }
    }

    //if correct word, move to next level of game
    if (answer === game.word) {
        game.winStreak++;
        game.level++;         
        //Record winstreak value to right panel list
        const winStreak = document.getElementById("winStreak");        
        winStreak.textContent = game.winStreak;
        //Record correct word to right panel list
        const correctGuess = document.getElementById("correctGuess");
        const newItem2 = document.createElement("li");
        newItem2.textContent = answer;
        correctGuess.appendChild(newItem2);

        //delay code for visual effect. Prep next level
        setTimeout(() => {
            clearAll();
            chooseWord();
            createLetterBoxes();
        }, game.interval);
     } else {
        if (game.hangIndex < 7) {
            hang.src = game.hangImages[game.hangIndex];
            game.hangIndex += 1;
        } else {
            hang.src = game.hangImages[game.hangIndex];
            hang.style.padding = "20px"
            showWrongLetters.textContent = "GAME OVER!!!"
        }
         for (const letter of letters) {
             if (letter.disabled === false) {
                return letter.focus();
             }
         }
     }
}

//EVENT LISTENERS
//switch case to change behavious of DELETE, ENTER, TAB

//Start Game
const startGame = document.querySelector("#submit");
startGame.addEventListener("click", () => {
    let answer = "";
    const letters = document.querySelectorAll(".letters");
    for (const letter of letters) {
        if (letter.value === "") {
            letter.focus();
            return letter.select();
        }
        answer += letter.value;
    }
    checkAnswer(answer);
});
startGame.addEventListener("keyup", function(e) {
    const key = e.key;

    switch(key) {
        case "Delete" :
        case "Backspace" : {
            let previous = e.target.parentElement.children[0].lastChild;      
                        if (previous.disabled === true) {
                            while (previous !== null && previous.disabled === true) {
                                previous = previous.previousSibling;                                  
                            }
                        }
                            if (previous === null) {
                                e.target.focus();
                                e.target.select();
                            } else {
                                previous.focus(); 
                            }
                            return;
        }
    }
})


//ON FIRST LOAD - TESTING
createLetterBoxes(game.level);
chooseWord(game.level);