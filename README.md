# Javascript Game Project

A practice project to combine HTML, CSS and vanilla JavaScript.

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
I attempted varieties of if statements and different functions, which often ended up determining a single speed per level or not working at all! Eventually, I finally decided on a button each for the levels, which each had their own Event Listener that trigger different functions, which in turn set the difficulty level that the if statement in the popUp function uses to determine the speeds. And now the game is condensed to one page.