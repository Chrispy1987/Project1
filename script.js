
//DOM
const showWrongLetters = document.getElementById("wrongLetters");
const letters = document.getElementsByClassName("letters");
const submit = document.getElementById("submit");
const hang = document.getElementById("hang");
const focusFriend = document.getElementById("focusFriend");

//Words stored in an array of arrays. 1st Array for (3) letter words, 2nd Array for (4) letter words etc.
const wordsByLength = [
    // three = ["fly"], //for testing!
    three = ["cat", "dog", "tip", "bee", "fly", "man", "sin", "pop", "red", "sit", "dot", "van", "rot", "bye", "dye", "sad", "arm"],
    // four = ["jazz"], //for testing!
    four = ["jazz", "high", "jerk", "lamb", "jump", "hazy", "jabs", "foxy", "joke", "hope", "pray", "play", "stay", "buzz", "pool", "link", "hint", "junk", "jaws", "jams", "ripe", "hand", "site", "shot", "fort", "mean", "lean", "team", "meat", "seat", "unit", "hurt", "slog"],
    // five = ["chain"], //for testing!
    five = ["abuse", "adult", "agent", "beach", "basis", "break", "chain", "brown", "chest", "china", "claim", "class", "dream", "final", "floor", "grass", "glass", "green", "group", "heart", "horse", "hotel", "motor", "mouth", "music", "novel", "nurse", "order", "owner", "panel", "phone", "point", "power", "radio", "scope", "score", "sheet", "shirt", "shift", "shock", "youth", "watch", "water", "whole", "while", "white", "woman", "unity", "union", "uncle", "truth"],
    // six = ["anyway"], //for testing!
    six = ["abroad", "afraid", "agenda", "anyway", "arrive", "barely", "avenue", "august", "become", "castle", "center", "caught", "choice", "custom", "debate", "defend", "defeat", "escape", "enough", "fabric", "fourth", "health", "hidden", "income", "inside", "island", "killed", "lawyer", "legacy", "launch", "manual", "margin", "people", "permit", "player", "policy", "police", "public", "reward", "return", "sample", "search", "select", "sexual", "silent", "simple", "sister", "survey", "ticket", "toward", "weight", "winter", "worker"]
];
//Store core game data in an Object 
const game = {
    hangImages : ["images/intro.png", "images/0.png", "images/1.png", "images/2.png", "images/3.png", "images/4.png", "images/5.png", "images/6.png", "images/7.png", "images/8.png"], //update with local images
    hangIndex : 2,     //record hangman image state
    friendIndex : 99,   //record which friend is focused
    wrongLetters : [], //store incorrect letters to help player
    level : 0,         //game diffilculty level
    winStreak : 0,     //how many games player has won in a row
    word : "",         //random word that player has to guess
    interval : 2000   //pause timer between rounds
}
//Friend data
const friends = [
    Bobby = {
     name : "Bobby", 
     images : ["images/bobby.png", "images/bobby-jail.png", "images/bobby-rip.png", "images/bobby-safe.png"],
     story : "Bobby had a little too much to drink and punched a man at the bar. Unfortunately for Bobby, the man he assaulted was Chief Constable Brown",
     isAlive : true,
     isFree : false
    },
    Timmay = {
     name : "Timmay",
     images : ["images/timmay.jpg", "images/timmay.jpg", "images/timmay.jpg", "images/timmay.jpg"],
     story: "TIMMAY!",
     isAlive : true,
     isFree : false
    },
    Amber = {
     name : "Amber",
     images : ["images/amber.jpg", "images/amber.jpg", "images/amber.jpg", "images/amber.jpg" ],
     story: "Amber did things",
     isAlive : true,
     isFree : false
    }
]
//delay code for visual effect. Prep next level
const gameTransition = (condition) => {
    setTimeout(() => {
        if (condition === "endGame") {
            game.level = 0;
            game.winStreak = 0;
            const parent = document.querySelector(".left");  
            parent.firstChild.remove();                          
            focusFriend.style.visibility = "hidden";
            createFriends();
        }
        clearAll();
        chooseWord();
        createLetterBoxes();
    }, game.interval);
}

//Clear existing inputs for next level
const clearAll = () => {
    const tiles = document.querySelector("#tiles");
    while(tiles.hasChildNodes()) {
      tiles.firstChild.remove();
    }
    game.wrongLetters = [];
    showWrongLetters.textContent = "";
    hang.style.padding = "0px"
    hang.hangIndex = 2;
}


//Create friends boxes
const createFriends = () => {
    const leftPanel = document.querySelector(".left");
    for (let i = 0; i < 3; i++) {
        const image = document.createElement("img");
        image.classList.add("friends");
        leftPanel.appendChild(image);  
    }     
    
    const friendList = document.getElementsByClassName("friends");
    let index = 0;

    for (const friend of friendList) {
        //check that friend is alive
        if ((friends[index].isAlive === true) && (friends[index].isFree === false)) {
            friend.id = index;
            friend.src = friends[index].images[0];
            
            friend.addEventListener("click", function (e) {
                const parent = document.querySelector(".left");
                game.friendIndex = e.target.id;
                hang.src = game.hangImages[1];
                focusFriend.src = friends[game.friendIndex].images[1]; 
                focusFriend.style.visibility = "visible";        
                while (parent.hasChildNodes()) {
                    parent.firstChild.remove();
                }
                const story = document.createElement("p");
                story.textContent = friends[game.friendIndex].story;
                parent.appendChild(story);
            })
        } else if (friends[index].isFree === true) {
            friend.src = friends[index].images[3];
            friend.style.opacity = "0.3";
        } else {
            friend.src = friends[index].images[2];
            friend.style.opacity = "0.3";
        }
        index++;
    }
}

//Create letter input boxes based on the games level
const createLetterBoxes = () => {
    const tiles = document.querySelector("#tiles");
    if (game.level === 0) {
        hang.src = game.hangImages[0];
    } else {
        hang.src = game.hangImages[1];
    }
    for (let i = 0; i < game.level + 3; i++) {
        const input = document.createElement("input");
        input.required;
        input.classList.add("letters");
        input.classList.add("animate");
        input.maxLength = 1;
        //Event listener - select focus 
        input.addEventListener("focus", function(e) {
            e.target.select();
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
        if (compareRemaining.includes(comparePlayerChoice[i]) & (letters[i].disabled == false)) {
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
        if (game.level < 3) {
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
        gameTransition(); 
        } else {
            focusFriend.src = friends[game.friendIndex].images[3]; 
            friends[game.friendIndex].isFree = true;
            gameTransition("endGame");
        }
     } else if (game.hangIndex < game.hangImages.length - 1) {
            hang.src = game.hangImages[game.hangIndex];
            game.hangIndex++;
        } else {
            hang.src = game.hangImages[game.hangIndex];
            focusFriend.src = friends[game.friendIndex].images[2]; 
            friends[game.friendIndex].isAlive = false;
            hang.style.padding = "20px"            
            gameTransition("endGame");
        }
         for (const letter of letters) {
             if (letter.disabled === false) {
                return letter.focus();
             }
         }
}


//EVENT LISTENERS
//switch case to change behavious of DELETE, ENTER, TAB

//Start Game
const startGame = document.querySelector("#submit");
startGame.addEventListener("click", () => {
    if (game.friendIndex === 99) {
        return alert("Please select which friend you'd like to hang out with first");
    }
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
createLetterBoxes();
createFriends();
chooseWord();