import * as d3 from 'd3'

let quotesButton=d3.select('#quotesButton')
quotesButton.style('pointer-events','all')
quotesButton.style('opacity',1)

let quotesCounter = 0
let quoresArray = [
  "The only one who can tell you 'you can't' is you. And you don't have to listen. (Nike)",
  "If you want to run, run a mile. If you want to experience a different life, run a marathon. (Emit Zatopek)",
  "When you run the marathon, you run against the distance, not against the other runners and not against the time. (Haile Gebrselassie)",
"You have to forget your last marathon before you try another. You mind can’t know what’s coming. (Frank Shorter)",
"If you are losing faith in human nature, go out and watch a marathon. (Katrine Switzer)",
"Nothing hurts more, but is so rewarding at the same time. (Sandy Zanchi)",
"No one said this would be easy, just know that nothing beats the feeling of accomplishment.",
"You will never know your limits until you push yourself to them.",
"It's not whether you get knocked down; it's whether you get up.(Vince Lombardi) ",
"Marathoning. The triumph of desire over reason. (New Balance) ",
"It is going to get harder before it gets easier. But it will get better, you just have to make it through the hard stuff first.",
"When I do the best I can with what I have, then I have won my race. (Jay Foonberg, 72-year-old runner) ",
"One day I will not be able to do this, today is not that day." ,
"There is a moment in every race. A moment where you can either quit, fold, or say to yourself, 'I can do this.' (Gatorade Ad)" ,
"Victory is paid for in sweat, courage, and preparation. (Nike)"  ,
"You don't have to go fast; you just have to GO." ,
"The marathon. How an average runner becomes more than average.",
"The person who starts the race is not the same person who finishes the race." ,
"If it was easy, everyone would do it."
]

quotesButton.on('click',() => {
    document.getElementById("marathonQuote").innerHTML = quoresArray[quotesCounter];
    quotesCounter = quotesCounter + 1
    if (quotesCounter == quoresArray.length) quotesCounter = 0;
})
quotesButton.on('mouseover', () => {
    startButton.style('background','rgba(255,0,0,0.8)')
    startButton.style('color','white')
    startButton.style('cursor','pointer')
})
quotesButton.on('mouseout', () => {
    startButton.style('background','rgba(255,255,255,0.8)')
    startButton.style('color','red')
})
