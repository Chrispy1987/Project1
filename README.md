# General Assembly - Project 1 

## An adaption of the game 'Wordle"

[Link to my game](https://chrispy1987.github.io/Project1)
> Created by Chris Holliday-Smith

# Tecnologies used:
> HTML
> CSS
> JavaScript

# Approach taken:
I started by getting the basic functionality working - concatenating a users input and comparing it to the secret word. If correct, the tile needed to turn green. If correct but in the wrong position, the tile needed to turn orange. And if not included in the secret word at all, the tile needed to turn red.

Once the basic functionality was set up, I increased the complexity by adding additional arrays and merged them into an array of arrays (for better readability and to keep the code organised)

I also found that I had many 'trigger' variables, to track the games state, and therefore created an object container to hold all of these values. This made coding future functions a lot easier, and again allowed my code to keep more organised.

Once I had my game successfully looping between the arrays of 3,4,5 & 6 words, I then started concentrating on the appearance/CSS of my game. I started by setting up a grid and took pen to paper, to visualise how I wanted my containers to fit on the page. I used the grid-area to implement this and then begun adding styling to make it looks nicer.

Animations, using keyframes, were added for some extra flare!

Now that I had the overall game working and looking good, I took the time to add last minute updates to improve the games flow (for example, not allowing a word to be entered until a friend had been selected, or changing the button to read 'Play Again' once all friends had been used up)

# Unsolved problems:
> When player presses the TAB or ENTER key, it bypasses my codes intention of avoiding unwanted characters.

# Installation instructions:
> This page is hosted on GitHub and no installation is required.

