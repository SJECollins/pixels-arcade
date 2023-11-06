# Javascript Game Project

A practice project to combine HTML, CSS and vanilla JavaScript.
This is for educational purposes and purely for learning and reflection as I work through some tutorials. Also, it's a bit of a refresher on HTML and CSS.

[Live Site](https://sjecollins.github.io/javascript-game-project/)

[Submitted CI project](https://github.com/SJECollins/ci-pp2-pixels-arcade)

## Styling
The styling is inspired by the Apple IIc.

I'm using the google font Press Start 2P as it is the only font Google offers that is close to the bitmap font used on old Apple devices.

The colours used are primarily a black, beige and some greens.

## Slap a Rabbit
A whack-a-mole clone.
Coding along with these tutorials:
- [From Ania Kubow](https://www.youtube.com/watch?v=rJU3tHLgb_c&ab_channel=CodewithAniaKub%C3%B3w)
- [From Franks Laboratory](https://www.youtube.com/watch?v=RTb8icFiSfk&ab_channel=Frankslaboratory)

3 difficulty levels - different number of holes for rabbits to pop out of and different speeds.

TODO: add a mole that if the user whacks they automatically lose.

## Rock, Paper, Scissors
There's roughly one million tutorials for a rock, paper, scissors game online using JavaScript.
I used these:
- [From Web Dev Simplified](https://www.youtube.com/watch?v=1yS-JV4fWqY&ab_channel=WebDevSimplified)
- [From Ania Kubow](https://www.youtube.com/watch?v=RwFeg0cEZvQ&t=1s&ab_channel=CodewithAniaKub%C3%B3w)

Basic RPS. Can choose from best of 3 or 5.

Images for the game from [here](https://publicdomainvectors.org/en/free-clipart/Rock-Paper-Scissors/51207.html)

TODO: ~~add LS option.~~

~~Update CSS to style choices better - too large~~

## Minesweeper

From this tutorial:
- [From Web Dev Simplified](https://www.youtube.com/watch?v=kBMnD_aElCQ&ab_channel=WebDevSimplified)

Very similar to tutorial, but 3 difficulty levels with different sized boards and different number of bombs.

## Memory Card Game

Based on:
- [From Marina Ferriera](https://marina-ferreira.github.io/tutorials/js/memory-game/)

- [From Tania Rascia](https://www.taniarascia.com/how-to-create-a-memory-game-super-mario-with-plain-javascript/)

3 difficulty levels - different numbers of card pairs that work reasonably well on mobile.

## Snake
Classic.
I watched this 15 minute tutorial:
- [From Ania Kubow](https://www.youtube.com/watch?v=rui2tRRVtc0&ab_channel=CodewithAniaKub%C3%B3w)

Currently just a 10x10 board size. Arrow keys on screen for mobile.

COULDDO: different boards? Increase size or different dimensions? Obstacles?


## Space Invaders
In this tutorial,
- [From Ania Kubow](https://www.youtube.com/watch?v=3Nz4Yp7Y_uA&ab_channel=CodewithAniaKub%C3%B3w)

Progress through 3 levels with different enemy patterns. Each level has a boss which drops bombs. All enemies and the boss have to be destroyed to progress.

COULDDO: More levels, more bosses.

## Simon
- [From Free Code Camp](https://www.youtube.com/watch?v=n_ec3eowFLQ&ab_channel=freeCodeCamp.org)

3 board options - 4, 6 and 9 squares -, checkbox for speed, options for numbers of rounds - ten, twenty or "endless" (200).

TODO: style radio buttons and checkboxes.

## Missing Item Game
03/07
I can't think of a good name for it.

I saw someone on the slack channel made a missing item game for their PP2. Looked like an interesting idea to try.

User has 10 seconds to memorise 9 cards then one is removed and displayed at the top of the screen along with two new cards. User then has to pick the right one. Have 3 lives and if they pick the right card 3 times, they win.

## Anagram Game
24/07

Straightforward Anagram game. 5 categories/rounds. User is told what category, but no clues otherwise.

COULDDO: Add clues for word - could rebuild category arrays from arrays of strings to arrays of objects maybe with words and clues for each entry.

## Monkey Run
28/12
- [Franks Laboratory SideScroller](https://www.youtube.com/watch?v=7JtLHJbm0kA&ab_channel=Frankslaboratory)

Infinite runner/sidescroller with HTML5 canvas. Tap/click/spacebar to jump. 2 enemies, bananas to collect and kind of a neat sort-of parallax effect for the background.

COULDDO: different levels? Even just different backgrounds and alternative enemies. Bonus bananas?

## Survive The Horde
31/12
- [Coding With Adam](https://www.youtube.com/watch?v=i7FzA4NavDs&ab_channel=CodingWithAdam)

A wave-based, top-down shooter using HTML5 canvas and JS. Zombies spawn in the fog and chase the player around the screen, and you shoot them to survive. More zombies spawn per wave. So far there's no true win condition, theoretically you could play it forever?? Would probably break. Added mobile controls that sort of work, haha.

TODO: Revisit bullet collision with the zombies

## Hide & Seek
02/01/2023

Rebuild of [Python PP3](https://github.com/SJECollins/ci-pp3-hide-and-seek) in JS. Mock terminal text adventure type game.

TODO: Actually test it and see how buggy it is.

## Breakout
16/02/2023

- [Conor Bailey](https://www.youtube.com/watch?v=ifJLNsG57hQ&ab_channel=ConorBailey)

Similar to tutorial except not an endless restart - has gameover if you lose. Also, every time the screen clears adds a new row of blocks.

## Apocalypse Trail
21/02

Oregon Trail style HTML5 Canvas game. Manage rest, food, water for 1-3 characters. Random encounters/obstacles throughout.

01/07 - the animals can now join you...

## Blackjack
21/02

Very basic Blackjack game. Currently only simple rules for hit and stay.

## Guess Who
23/04

The images were made using this [avatar maker](https://avatarmaker.com/).

Fairly straightforward to create an array of objects, append the cards with the images and names to the HTML board, and pick the person. Right now, it's kind of limited on character details. I made an autoflip thing to test the input while I was making it, but I've left it in cause it's funny.

TODO: trait guessing system - needs to be more robust.

## Quiz
24/04

Alright, this was just cause everyone makes a JS quiz game as one of their first JS projects and I hadn't done one yet. It's like 80 lines of code, it's nothing fancy, I just wanted to make one to make it.

Using [The Trivia API](https://the-trivia-api.com/) to generate the quiz based on selected category and difficulty.

Quick and fun. Need to update the menus.

## Typing Test
01/06/23

- [Coding Nepal](https://www.youtube.com/watch?v=Hg80AjDNnJk&ab_channel=CodingNepal)

Not very original - I think mostly based off of the Coding Nepal video above. The only really unique thing is the scroll effect, which could be better.

## Sliding Puzzle
12/07/23

Basically playing with one dimensional arrays. Fairly straightforward in the end, it was all just checking indexes and swapping positions in arrays! Did use a nice function from [Bobby Hadz](https://bobbyhadz.com/blog/javascript-check-if-two-arrays-have-same-elements) to compare if two arrays are identical.

Only has two puzzles at the moment as was testing different sizes.

COULDDO: more images. Display completed image at the end?

## Hangman
22/10/23

Added Hangman. Using [this API](https://random-word-api.herokuapp.com) to get words. Short, barely 120 or so lines of code. Very similar to something I [previously did in Python](https://github.com/SJECollins/python-arcade).

## Connect 4
23/10/23

Like Hangman, have done [something similar in Python](https://github.com/SJECollins/python-arcade). Options for human vs human or human vs computer, and can pick colours which effect who goes first. 

03/11 did seem to be working okay but played a quick round today and the computer made some weird choices so need to revist.

TODO: fix computer. Also make computer smarter.

## Stock Boy!
27/10

Thinking about [Mad Nurse](https://en.wikipedia.org/wiki/Mad_Nurse) alot recently for some reason. Had this stock boy idea on the list for a while. HTML5 Canvas game. Stock shelves, clean up spills that customers can slip in, survive as long as possible. If 5 shelves go empty, game over.

COULDDO: More chaos.

## Deli Master
02/11

Saw an interesting video from [Banana Coding](https://www.youtube.com/watch?v=xbdJf9MRL7A&ab_channel=BananaCoding) on adding a click eventlistener to objects on a canvas. Using that for user to select the ingredients for the rolls, etc.

COULDDO: figure out a way to enlarge canvas on large screens without affecting x,y coords for the click even.

# General
## 02/07/22

Submitted smaller arcade project based on this idea for PP2 to CI on 30/06.

So, now I've updated the page to include the revisions I've made to the four games I submitted.

## 05/07/22

Finished styling the Missing Item game and added the instructions pop up and now the reset button works too.

Also updated the index to display all the games. Still trying to decide what to do with the navbar. Eight isn't a bad number if I want to stack the links on top of each other, but that might look a little funny.

## 24/07/22

Moved all html files into their own folder. Broke everything. Think I have everything fixed but we'll see 

## 02/01/23

Remove commented out code for menu and unused social media links. Need to revisit menu in the header - some sort of drop down?? A search? We'll see

## 16/01/23

Added menu to header for all pages for quicker navigation.

## 21/02/23

Updated all the menus to include Blackjack and Apocalypse Trail. Added Blackjack to main menu. Also fixed CSS for menus so home is unordered and games are in ordered list. Was weird having "Home" as #1.