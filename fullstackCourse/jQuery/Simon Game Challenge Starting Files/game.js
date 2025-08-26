

function nextSequence() {
    var randomNumber = Math.round(Math.random() * 3);
    return randomNumber;
}

var buttonColors = ["green", "red", "yellow", "blue"];

var gameArray = [];

var userClickedPattern = [];

function flash(randomChosenColor) {
    console.log(randomChosenColor);
    switch (randomChosenColor) {
    case 0:
            $("#green").animate({ opacity: 0.5 }, 100).animate({ opacity: 1 }, 100);
            playSound(randomChosenColor);
        break;
    case 1:
            $("#red").animate({ opacity: 0.5 }, 100).animate({ opacity: 1 }, 100);
            playSound(randomChosenColor);
            break;
    case 2:
            $("#yellow").animate({ opacity: 0.5 }, 100).animate({ opacity: 1 }, 100);
            playSound(randomChosenColor);
            break;
    case 3:
            $("#blue").animate({ opacity: 0.5 }, 100).animate({ opacity: 1 }, 100);
            playSound(randomChosenColor);
        break;
    default:
        break;
}
};





function playSound(name) {

    new Audio("sounds/" + name +".mp3").play();
}

var randomChosenColor = nextSequence();

$(".btn").click(function () {
    
    var userChosenColour = this.id;
    console.log(userChosenColour);
    userClickedPattern.push(userChosenColour);
        }
    
)



