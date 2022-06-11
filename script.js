//DOM


//Global variables - create an array of arrays. 1st Array for (3) letter words, 2nd Array for (4) letter words etc.
let testArray = ["cat", "dog", "tip", "bee", "fly", "man", "sin", "pop", "red", "sit", "dot", "van", "rot", "bye", "dye", "sad", "arm"]
let diffilculty = 3;
let word = "";

//Create letter boxes based on the diffilculty
const createLetterBoxes = () => {
    const words = document.querySelector("#words");
    for (let i = 0; i < diffilculty; i++) {
        const newBox = document.createElement("input");
        newBox.classList = "letters";
        words.appendChild(newBox);
    }
}

const chooseWord = () => {
    const index = Math.round(Math.random() * testArray.length);
    word = testArray[index];
    console.log(word);
}

//ON FIRST LOAD
createLetterBoxes();
chooseWord();
