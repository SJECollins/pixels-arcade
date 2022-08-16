# Javascript Game Project

A practice project to combine HTML, CSS and vanilla JavaScript.
This is for educational purposes and purely for learning and reflection as I work through some tutorials. Also, it's a bit of a refresher on HTML and CSS.

## Styling
The styling is inspired by the Apple IIc.

I'm using the google font Press Start 2P as it is the only font Google offers that is close to the bitmap font used on old Apple devices.

The colours used are primarily a black, beige and some greens.

## Slap a Rabbit
A whack-a-mole clone.
Coding along with these tutorials:
- [From Ania Kubow](https://www.youtube.com/watch?v=rJU3tHLgb_c&ab_channel=CodewithAniaKub%C3%B3w)
- [From Franks Laboratory](https://www.youtube.com/watch?v=RTb8icFiSfk&ab_channel=Frankslaboratory)

The big head scratcher was trying to code three different difficulty levels. When I first coded this project, I had the different levels on different pages as I could link the difficulty to the class found on the start button element. Then the if statement in the popUp function would determine variable speeds (with the levelSpeed function) based on that class. Three pages with identical code - aside from the class on the start button - was, of course, incredibly redundant. 

I attempted varieties of if statements and different functions, which often ended up setting a single speed per level or not working at all! Eventually, I finally decided on a button each for the levels, which each had their own Event Listener that trigger different functions, which in turn set the difficulty level that the if statement in the popUp function uses to determine the speeds. And now the game is condensed to one page.

**02/07** Reworked code a little for CI PP2 to make 3 levels that are created by functions in the JS. Think I'd like to push a little more and have a wider range of levels. Maybe a bigger board? Maybe different obstacles, like a mole or something that pops out and you have to avoid hitting or you lose? Yeah, lots of fun ideas.

## Rock, Paper, Scissors
There's roughly one million tutorials for a rock, paper, scissors game online using JavaScript.
I used these:
- [From Web Dev Simplified](https://www.youtube.com/watch?v=1yS-JV4fWqY&ab_channel=WebDevSimplified)
- [From Ania Kubow](https://www.youtube.com/watch?v=RwFeg0cEZvQ&t=1s&ab_channel=CodewithAniaKub%C3%B3w)

I have changed it a bit from when I first created the project as a bare bones example of RPS. Today I used a ![free clipart image](https://www.clipartmax.com/middle/m2i8i8G6H7K9Z5H7_rock-paper-scissors-clipart-rock-paper-scissors-clip-art/) to create images that could be clicked to make your selection. Then your own and the computer's selections are displayed and the result of the immediate game is updated. Your scores are incremented. And I adapted my game over screen from the Slap a Rabbit game to play after 5 wins or losses. From there you can play again or go home. I think there is probably a simple way to make that game over screen more reusable, I'll have to look into it.

It's not too fancy, but I like it. I like the interactivity and feedback to the user with all the updating parts when a selection is made. I think I could easily update it to add more variants (lizard, Spock, for example). I also think it looks pretty good on the game screen. I think it fits the theme quite well. 

**02/07** Largely unchanged from when the first iteration, the layouts just a little better.

## Minesweeper

From this tutorial:
- [From Web Dev Simplified](https://www.youtube.com/watch?v=kBMnD_aElCQ&ab_channel=WebDevSimplified)

I haven't made any big changes to it yet, so will come back to this. Really, it seems like it would be very difficult to improve.
But I need to remember to fix how the flag is displaying on the board. - have now corrected flag position

## Memory Card Game
This should have been very easy. And then I decided to make it very difficult for myself. Because I'm an idiot.

I orginally followed this very good, easy tutorial:
- [From Marina Ferriera](https://marina-ferreira.github.io/tutorials/js/memory-game/)

And it was very good and easy to implement. And then, the part of my brain that enjoys suffering and doesn't understand that I don't know how to do what I want to do, thought, "but what if I could generate the cards from an array?? And then I could do all sorts of wonderful things like generate the board depending on what level the player selects!" And so on until I bit off more than I could chew.

So I read this very interesting tutorial which involved generating the board and cards:
- [From Tania Rascia](https://www.taniarascia.com/how-to-create-a-memory-game-super-mario-with-plain-javascript/)

That looked fun and simple. And ended up leading me down a several hour long rabbit of hole of learning that you can't add Event Listeners to objects in an array! So I added them as the cards were created. It took so long because DevTools would only helpfully tell me that whatever.addEventListener "is not a function". Thanks, DevTools. Also, figuring out where to best shuffle the cards was extremely tricky and it took a bit to find a solution which didn't end up shuffling my array before my cards were safely paired! Can't just concat the original array once you've shuffled and sliced your initial selection, cause then you just end up with pairs with only another card between them.

I think I must have said "Okay, so what I want to do is-" several dozen times out loud to the empty room during this. I want to go back and make it so you can click through the board generation before starting the game itself. I'm sure it would be as simple as setting some booleans somewhere. But not just yet.

**02/07** Has been updated since submitting as part of project to CI. Now 3 levels with different numbers of cards. Have 18 cards in an array in total but max drawing 10 at a time so there's room to increase, but need to find a way to increase the size of the game board and still make it look nice. Although, now that I'm not restricted by the project parameters, do I have to? Would still be nice to figure it out.

## Snake
Classic.
I watched this 15 minute tutorial:
- [From Ania Kubow](https://www.youtube.com/watch?v=rui2tRRVtc0&ab_channel=CodewithAniaKub%C3%B3w)

She does a lot of these pure vanilla Javascript games which are pretty fun. And I like that it's pretty clear that she doesn't 100% know everything about Javascript. It's like she's learning as she's creating her videos too. 
It's a pretty straightforward game to code. Graphically it works pretty well just with CSS styling because everyone remembers what it looked like on old Nokia phones so there's no expectation for fancier graphics. Although... maybe fancying it up is something I'll think about??

Anyway, I decided to change it so the board was generated from a function in the Javascript instead of hardcoding 100 divs in the html. The JS is still hardcoded to make a 10x10 board, but after I eventually figured out how to generate the board I think I could revisit it to create different boards in the future. HOWEVER, I would need to reconsider the controls as well because they're based on the width of the board. It's possibly a case of changing the width variable in JS when a larger board is generated. Say you generate a 20x20 board, change the width to 20? I'm just typing out loud.

Being a mobile game and mobiles no longer having buttons, I also added arrow keys on the screen to control the game without the keyboard. There are keyboard controls too in a separate function, but I could probably combine both control methods into neater code. Change the keybinding to call the individual move functions for the arrows? I'll take another look.

Also, added a timer and a game over screen, cause why not? 

## Space Invaders
Well, I'm an idiot. 
In this tutorial,
- [From Ania Kubow](https://www.youtube.com/watch?v=3Nz4Yp7Y_uA&ab_channel=CodewithAniaKub%C3%B3w)

Ania generates the board with a simple for loop. She uses a pretty interesting function to move the invaders left and right across the screen.

Honestly, the code is largely unchanged. I styled it a bit and clumsily added buttons to control the game on screen. AND in the process learned to create keyboard events from clicking buttons.

There is a bit where when the missile goes off screen it logs an error to the console. SO, I need to fix that. The game is still playable with that though. It's probably a case of finding the zero index and remove the class missile? I'm not sure exactly   -- okay, so it was trickier than I though and probably not the best fix, but the simplest way I found was to remove the missile and clear the interval when it reached the top row. HOWEVER, this obviously would prevent killing enemies in the top row. Which is something to consider if I expand on it... I just couldn't watch those errors ticking up anymore!

**02/07** Updated now to have a boss which appears about 10 seconds into the game (to account for the longer time it'll take invaders to get out of the way if user turns wrap on). Now have to kill all the invaders and the boss to end the game.

The boss drops bombs and the tank has lives now. The bombs fall at a set interval but may update so it's more random? Also considering a progressive level system with different layouts of invaders, increasing speeds, different types of enemies. But lets not get ahead of ourselves.

**03/07** Okay, so now there's 3 levels. The invaders and boss increase their speed when they respawn. It's rough, and it was a headache, but the rudiments are there. It plays through and it triggers win or lose correctly so. There's definitely a nicer way to do it, but it was pretty fun.

## Simon
- [From Free Code Camp](https://www.youtube.com/watch?v=n_ec3eowFLQ&ab_channel=freeCodeCamp.org)

Again, largely unchanged code. I removed the dependency for the on button. It's a neat trick but not really something I was interested in. It's a nice touch though! I did also change the CSS so it's a more straightforward square board rather than the round one. Also, reduced the amount of redundant code in the CSS. It's nice to see professionals do that though! 

I think I will add a "level select" type ability to the game where you can decided between a standard 20 round game or play endless mode. I think as well it may be interesting to increase the speed? Or perhaps, like the strict mode, there could be a speed round? So if you don't get it right in a certain length of time, you lose? I'm pretty sure traditional simon games have something similar. 

Anyway, for the time being just some little changes to styling and making the code simpler.

**16/08** Some changes for bug fixing, etc. There was an issue where you could click all over the board while the computer was doing it's turn, which caused a bug where the board would flash "no" but still run through the array of flashes, and then also somehow the speed of the computer's turn would increase? It was a little bit of a disaster if you're the kind of person (me) who liked messing. So - also to make expanding easier - I put all the board's event listeners into functions so I could add and remove them around the computer's turn and now you can't be a jerk who clicks all over the board while the computer is doing it's turn. I think, there's surely another way to break it, I'll just have to poke at it some more. But I feel better about it now anyway.

I also renamed the sections of the board to reflect that I'm going to add more sections.

## Missing Item Game
03/07
I can't think of a good name for it yet.

I saw someone on the slack channel made a missing item game for their PP2. It looked like an interesting idea and something that hadn't occurred to me before, but obviously it fits in perfectly with the type of games I'm making for this website. And, like a fool, I figured how hard could it be? It's just displaying an array of images to a board and then having the user select the missing card, right? I could probably do that just based on everything I've done so far... right?

Well, it works. I haven't done the final styling for it and I'm definitely going to not look at it for a while before I come back and do that, but man was it a headache. I did learn something interesting things about arrays and attributes, and the whole thing is filled with console.logs I have to get rid of, but boy does it feel satisfying playing through it and getting the game over overlay to pop up correctly.

Unfortunately, I also discovered typos in my memory-card JS file. It's just nonsense that doesn't effect the code itself running but it will definitely get me dinged when it's evaluated. At best I'll get a pass. I knew I shouldn't have submitted while I was sick and tired.

Anyway, that'll keep me awake tonight, but for now I'm done. I'll come back and finish styling another day. 

## Anagram Game
24/07
I haven't updated this in a few weeks. I just finished my PP3 for CI this morning (or at least until my mentor meeting tomorrow) and figured I'd update this project with something simple.

I don't know where exactly I got the idea for an anagram, but the basics of it turned out to be fairly straightforward. I have a few categories of words in lists. The pickAnagram function chooses a random number then if/else statements select a category based on the random number and also saves the category title to display on screen. The function then selects a random word from the chosen category. The random word gets passed to the scramble function and the scrambled word gets displayed on screen. THEN, theres a function that compares the random word with the user input. If the player gets 5 right in a row, they win. But if they get one wrong they lose.

I'd like to fine tune this so you can't get the same category multiple times. It's tricky. I'm still working on that. Overall the game needs to be styled more. And I'd like to display the correct word in the round display - that should be easy. AND I think it would be fun to have an option to play against a timer. I haven't thought that one through yet, but it's on the list.

Not super impressive, but not a bad Sunday afternoon. And I learned a little about user inputs in JS, which was interesting after doing a whole Python project that involved user inputs in the terminal.

25/07
Update the UI a little. Now there's mouseover/mouseout events to the enter button. And the user can submit there answer by clicking enter when in the input field. Also update the input field so it's a line rather than a box and the text is centered. And the game-over/round pop-ups display the correct word. 

Why doesn't JS have a .capitalize() function? So silly...

# General
## 02/07

Submitted smaller arcade project based on this idea for PP2 to CI on 30/06.

So, now I've updated the page to include the revisions I've made to the four games I submitted.

## 05/07

Finished styling the Missing Item game and added the instructions pop up and now the reset button works too.

Also updated the index to display all the games. Still trying to decide what to do with the navbar. Eight isn't a bad number if I want to stack the links on top of each other, but that might look a little funny.

## 24/07

Moved all html files into their own folder. Broke everything. Think I have everything fixed but we'll see 