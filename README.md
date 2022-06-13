# Javascript Game Project

A practice project to combine HTML, CSS and vanilla JavaScript.
This is for educational purposes and purely to learn and reflect on 

## Styling
The styling is inspired by the Apple IIc
I'm using the google font Press Start 2P as it is the only font Google offers that is close to the Chicago font used on old Apple devices.
The colours used are primarily a black, beige and some greens.

## Slap a Rabbit
A whack-a-mole clone.
Coding along with these tutorials:
- [From Ania Kubow](https://www.youtube.com/watch?v=rJU3tHLgb_c&ab_channel=CodewithAniaKub%C3%B3w)
- [From Franks Laboratory](https://www.youtube.com/watch?v=RTb8icFiSfk&ab_channel=Frankslaboratory)

The big head scratcher was trying to code three different difficulty levels. When I first coded this project, I had the different levels on different pages as I could link the difficulty to the class found on the start button element. Then the if statement in the popUp function would determine variable speeds (with the levelSpeed function) based on that class. Three pages with identical code - aside from the class on the start button - was, of course, incredibly redundant. 
I attempted varieties of if statements and different functions, which often ended up setting a single speed per level or not working at all! Eventually, I finally decided on a button each for the levels, which each had their own Event Listener that trigger different functions, which in turn set the difficulty level that the if statement in the popUp function uses to determine the speeds. And now the game is condensed to one page.

## Rock, Paper, Scissors
There's roughly one million tutorials for a rock, paper, scissors game online using JavaScript.
I used these:
- [From Web Dev Simplified](https://www.youtube.com/watch?v=1yS-JV4fWqY&ab_channel=WebDevSimplified)
- [From Ania Kubow](https://www.youtube.com/watch?v=RwFeg0cEZvQ&t=1s&ab_channel=CodewithAniaKub%C3%B3w)

I have changed it a bit from when I first created the project as a bare bones example of RPS. Today I used a ![free clipart image](https://www.clipartmax.com/middle/m2i8i8G6H7K9Z5H7_rock-paper-scissors-clipart-rock-paper-scissors-clip-art/) to create images that could be clicked to make your selection. Then your own and the computer's selections are displayed and the result of the immediate game is updated. Your scores are incremented. And I adapted my game over screen from the Slap a Rabbit game to play after 5 wins or losses. From there you can play again or go home. I think there is probably a simple way to make that game over screen more reusable, I'll have to look into it.
It's not too fancy, but I like it. I like the interactivity and feedback to the user with all the updating parts when a selection is made. I think I could easily update it to add more variants (lizard, Spock, for example). I also think it looks pretty good on the game screen. I think it fits the theme quite well. 

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
There is a bit where when the missile goes off screen it logs an error to the console. SO, I need to fix that. The game is still playable with that though. It's probably a case of finding the zero index and remove the class missile? I'm not sure exactly - okay, so it was trickier than I though and probably not the best fix, but the simplest way I found was to remove the missile and clear the interval when it reached the top row. HOWEVER, this obvious would prevent killing enemies in the top row. Which is something to consider if I expand on it... I just couldn't watch those errors ticking up anymore!