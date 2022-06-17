//DOM
const showWrongLetters = document.getElementById("wrongLetters");
const letters = document.getElementsByClassName("letters");
const submit = document.getElementById("submit");
const hang = document.getElementById("hang");
const focusFriend = document.getElementById("focusFriend");
//Words stored in an array of arrays. 1st Array for (3) letter words, 2nd Array for (4) letter words etc.
const wordsByLength = [
    three = ["cat", "dog", "tip", "bee", "fly", "man", "sin", "pop", "red", "sit", "dot", "van", "rot", "bye", "dye", "sad", "arm"],
    four = ["jazz", "high", "jerk", "lamb", "jump", "hazy", "jabs", "foxy", "joke", "hope", "pray", "play", "stay", "buzz", "pool", "link", "hint", "junk", "jaws", "jams", "ripe", "hand", "site", "shot", "fort", "mean", "lean", "team", "meat", "seat", "unit", "hurt", "slog"],
    five = ["abuse", "adult", "agent", "beach", "basis", "break", "chain", "brown", "chest", "china", "claim", "class", "dream", "final", "floor", "grass", "glass", "green", "group", "heart", "horse", "hotel", "motor", "mouth", "music", "novel", "nurse", "order", "owner", "panel", "phone", "point", "power", "radio", "scope", "score", "sheet", "shirt", "shift", "shock", "youth", "watch", "water", "whole", "while", "white", "woman", "unity", "union", "uncle", "truth"],
    six = ["abroad", "afraid", "agenda", "anyway", "arrive", "barely", "avenue", "august", "become", "castle", "center", "caught", "choice", "custom", "debate", "defend", "defeat", "escape", "enough", "fabric", "fourth", "health", "hidden", "income", "inside", "island", "killed", "lawyer", "legacy", "launch", "manual", "margin", "people", "permit", "player", "policy", "police", "public", "reward", "return", "sample", "search", "select", "sexual", "silent", "simple", "sister", "survey", "ticket", "toward", "weight", "winter", "worker"]
];
//Store core game data in an Object 
const game = {
    hangImages : ["images/intro.png", "images/0.png", "images/1.png", "images/2.png", "images/3.png", "images/4.png", "images/5.png", "images/6.png", "images/7.png", "images/8.png"], //update with local images
    hangIndex : 2,     //record hangman image state
    friendIndex : 99,  //record which friend is focused
    wrongLetters : [], //store incorrect letters to help player
    level : 0,         //game diffilculty level
    score : 0,         //how many games player has won in a row
    word : "",         //random word that player has to guess
    interval : 2000,   //pause timer between rounds
    fearLevel : 4,     //animation gets faster as more wrong guesses are made
    inPlay : false,    //toggle when game is and is not in play 
    over : false       //toggle when all 3 friends have been played
}
//Store core friend data in Object(s)
const friends = [
    Bobby = {
     name : "Bobby", 
     images : ["images/bobby.png", "images/bobby-jail.png", "images/bobby-rip.png", "images/bobby-safe.png"],
     story : "It's 5pm on a Friday and you're looking forward to a quiet night in. Bobby slides into your DM's, keen for 'a drink or two'. You reluctantly agree to hang out, with the night soon turning into a vivid blur and the next thing you know it's 2am and you see Bobby being dragged away by the Police for instigating a bar fight! They don't take kindly to violence in these parts, so you hobble along and try to get your friend out of trouble!",
     isAlive : true,
     isFree : false
    },
    Jack = {
     name : "Jack",
     images : ["images/jack.png", "images/jack-jail.png", "images/jack-rip.png", "images/jack-safe.png"],
     story: "You and Jack go way back, having been friends since preschool. Jack was always dealt the best hand in life - he had the fastest car, the perfect family, an amazing house and cash to boot. At least... that's what you thought! At his weekend BBQ, detectives stormed in and arrested Jack on conspiracy of money laundering and insider trading! Surely there's something you can do to save Jack from his new-found fate? You run over to the lead detective...",
     isAlive : true,
     isFree : false
    },
    Amber = {
     name : "Amber",
     images : ["images/amber.png", "images/amber-jail.png", "images/amber-rip.png", "images/amber-safe.png"],
     story: "Amber is that annoying coworker that you'd normally try to avoid, however you've been feeling sorry for her as her dog recently stepped on a bee! 'How are you holding up?', you ask sympathetically. Amber turned to you with a disgruntled look and launched a nearby bottle toward you. With cat-like reflexes, you dodged the projectile but the manager, Johnny, was not so lucky. The Police have taken Amber into custody! You feel obliged to help for some reason.",
     isAlive : true,
     isFree : false
    }
]

//Timeout code for visual effect. Prep page for next level
const gameTransition = (condition) => {
    setTimeout(() => {
        if (condition === "endGame") {
            game.level = 0;
            game.friendIndex = 99;
            const parent = document.querySelector(".left");  
            parent.firstChild.remove();                          
            createFriends();
            const correctGuess = document.getElementById("correctGuess");
            while (correctGuess.hasChildNodes()) {
                correctGuess.firstChild.remove();
            }
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
    game.hangIndex = 2;
    game.fearLevel = 4; 
    focusFriend.style.animation = `jail ${game.fearLevel}s infinite`;
}


//Create friend panels
const createFriends = () => {
    const leftPanel = document.querySelector(".left");
    leftPanel.style.gridArea = "1/1/4/2";
    for (let i = 0; i < 3; i++) {
        const image = document.createElement("img");
        image.classList.add("friends");
        leftPanel.appendChild(image);  
    }     
    
    const friendList = document.getElementsByClassName("friends");
    let index = 0;
    
    for (const friend of friendList) {
        //check that friend is still alive and not yet free
        if ((friends[index].isAlive === true) && (friends[index].isFree === false)) {
            friend.id = index;
            friend.src = friends[index].images[0];
            
            //Event listener - switch view to friend in jail with origin story beneath
            friend.addEventListener("click", function (e) {
                //After first load, manipulate grid area to display friend jail box and story
                if (game.inPlay === true) {
                        leftPanel.style.gridArea = "2/1/4/2";
                    }
                const parent = document.querySelector(".left");
                game.friendIndex = e.target.id;
                hang.src = game.hangImages[1];
                focusFriend.src = friends[game.friendIndex].images[1]; 
                focusFriend.style.animation = `jail ${game.fearLevel}s infinite`;       
                while (parent.hasChildNodes()) {
                    parent.firstChild.remove();
                }
                const story = document.createElement("p");
                story.textContent = friends[game.friendIndex].story;
                parent.appendChild(story);
                letters[0].focus();
                letters[0].select();
            })
            //Friend is free = load SAFE image from array and reduce visual opacity
        } else if (friends[index].isFree === true) {
            friend.src = friends[index].images[3];
            friend.style.opacity = "0.3";
            //Friend is dead = load RIP image from array and reduce visual opacity
        } else {
            friend.src = friends[index].images[2];
            friend.style.opacity = "0.3";
        }
        index++;
    }

    //check if all three friends have been played   
    let hung = 0;
    let free = 0;
    for (const i in friends) {
        if (friends[i].isFree === true) {
            free++;
        } else if (friends[i].isAlive === false){
            hung++;
        }
    }
    //announce end of game with results
    if (hung + free === 3) {
        game.over = true;
        submit.textContent = "PLAY AGAIN!"
        alert(`[GAME OVER!] You saved ${free} of your friends and let ${hung} hang out to dry! Your final score was ${game.score} (out of 18)`)
    }
}

//Create letter input boxes based on the games level
const createLetterBoxes = () => {
    game.inPlay = true;
    const tiles = document.querySelector("#tiles");
    for (let i = 0; i < game.level + 3; i++) {
        const input = document.createElement("input");
        input.classList.add("letters");
        input.classList.add("animate");
        input.maxLength = 1;
        //Event listener - select focus 
        input.addEventListener("focus", function(e) {
            e.target.select();
        })
        //Event listener - accept A-Z only and convert to Uppercase
        //- change focus to next available input /or button
        //- delete or backspace will reverse order of focus to next available
        //- ignore Enter or Tab keypress
        input.addEventListener("keyup", function(e) {
            const key = e.key;
            switch (key) {
                case "Enter" :
                case "Tab" :
                    return;
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
            //Use general expression to only accept letters & convert them to uppercase
            const userInput = e.target.value.replace(/[^a-zA-Z\s]/g, "").toUpperCase();
            //Check for and remove invalid keys
            if (userInput !== "") {
                e.target.value = userInput;
            } else {
                console.log('invalid key entered');
                e.target.value = "";
                e.target.select();
                return e.target.focus();
            }
            //Automatically shift focus to next available input/button
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
    console.log("SECRET WORD: " + game.word);
    if (game.level === 0) {
        hang.src = game.hangImages[0];
    } else {
        hang.src = game.hangImages[1];
    }
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
                game.wrongLetters.sort();
                const display = game.wrongLetters.join(' - ');
                showWrongLetters.textContent = display;
            } 
        }
    }
    //if correct word, move to next level of game
    if (answer === game.word) {
        if (game.level < 3) {
            game.inPlay = false;
            game.score++;
            game.level++;         
            //Record score to right panel list
            const score = document.getElementById("score");        
            score.textContent = game.score;
            //Record correct word to right panel list
            const correctGuess = document.getElementById("correctGuess");
            const newItem2 = document.createElement("p");
            newItem2.textContent = answer;
            correctGuess.appendChild(newItem2);
            gameTransition(); 
        } else {
            //All words guessed correctly - friend gets to live!
            game.inPlay = false;
            game.score += 3;
            score.textContent = game.score;
            focusFriend.src = friends[game.friendIndex].images[3]; 
            friends[game.friendIndex].isFree = true;
            focusFriend.style.removeProperty("animation");
            focusFriend.style.border = "solid green 7px";
            const newItem2 = document.createElement("p");
            newItem2.textContent = answer;
            correctGuess.appendChild(newItem2);
            gameTransition("endGame");
        }
     } else if (game.hangIndex < game.hangImages.length - 1) {
            //Incorrect word, progress the hangman state
            hang.src = game.hangImages[game.hangIndex];
            game.hangIndex++;
            game.fearLevel -= 0.5;
            focusFriend.style.animation = `jail ${game.fearLevel}s infinite`;
        } else {
            //All chances used up - friend is hung! Reveal correct answer to player
            hang.src = game.hangImages[game.hangIndex];
            focusFriend.src = friends[game.friendIndex].images[2]; 
            friends[game.friendIndex].isAlive = false;
            hang.style.padding = "15px";
            focusFriend.style.removeProperty("animation");
            focusFriend.style.border = "solid red 7px"; 
            alert(`The correct word was '${game.word}'. Your friend will be "hangin out" for a while!`);
            gameTransition("endGame");
        }
        //refocus to the start of the input
         for (const letter of letters) {
             if (letter.disabled === false) {
                return letter.focus();
             }
         }
}

//Event Listener - Start Game
const startGame = document.querySelector("#submit");
startGame.addEventListener("click", () => {
    //If game is not in play, do not accept extra clicks from the player
    if (game.inPlay === false) {
        return console.log('ignored click');
    }
    //If the game is over, clicking button will reload page for a new game
    if (game.over === true) {
        return window.location.reload();
    }
    //Alert the player if they have not yet chosen a friend to hang out with
    if (game.friendIndex === 99) {
        return alert("Please select which friend you'd like to hang out with first");
    }
    //Check that all inputs have been entered correctly and concatenate answer
    let answer = "";
    const letters = document.querySelectorAll(".letters");
    for (const letter of letters) {
        if (letter.value === "" || letter.value === " ") {
            letter.style.backgroundColor = "lightblue";
            letter.focus();
            return letter.select();
        }
        answer += letter.value;
    }
    checkAnswer(answer);
});
//Event listener - delete or backspace will allow the button focus to shift back to inputs
startGame.addEventListener("keyup", function(e) {
    const key = e.key;
    switch(key) {
        case "Delete" :
        case "Backspace" : {
            let previous = e.target.parentElement.parentElement.children[0].children[0].lastChild;      
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
createFriends();
createLetterBoxes();
chooseWord();