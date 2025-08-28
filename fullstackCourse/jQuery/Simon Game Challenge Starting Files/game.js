


var buttonColors = ["green", "red", "yellow", "blue"];

var gameArray = [];

var userClickedPattern = [];

var level = 0;

$(".btn").click(function () {
    
    var userChosenColour = this.id;
    console.log(userChosenColour);
    flash(userChosenColour);
    userClickedPattern.push(userChosenColour);
    animatePress(userChosenColour);
    console.log(level);
    console.log(userClickedPattern.length);
    if (userClickedPattern.length === gameArray.length) {
        checkAnswer(userClickedPattern.length-1);
    }
});


$(document).keydown(function (event) {
    if (level === 0) {
        nextSequence();
     
    }
});


function nextSequence() {
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber];
    gameArray.push(randomChosenColor);
    flash(randomChosenColor);
    playSound(randomChosenColor);
    level++;
    $("h1").text("Level " + level);

};

function flash(randomChosenColor) {
    console.log( $("#"+ randomChosenColor));
   
    $("#" + randomChosenColor).animate({ opacity: 0.5 }, 100).animate({ opacity: 1 }, 100);
    playSound(randomChosenColor);
  
};


function playSound(name) {
    console.log("sounds/" + name + ".mp3");
    new Audio("sounds/" + name +".mp3").play();
}

function animatePress(currentColour) {
    $("#" + currentColour).addClass("pressed");
    setTimeout(function() {
        $("#" + currentColour).removeClass("pressed");
    }, 100);
}




    function checkAnswer(currentLevel) {
   if (gameArray[currentLevel] === userClickedPattern[currentLevel]) {
      if (userClickedPattern.length === gameArray.length){
        setTimeout(function () {
          nextSequence();
        }, 1000);
      }
    } else {
      playSound("wrong");
      $("body").addClass("game-over");
      $("#level-title").text("Game Over, Press Any Key to Restart");

      setTimeout(function () {
        $("body").removeClass("game-over");
      }, 200);

      startOver();
    }
}


function gameOver() {
    level = 0;
    userClickedPattern = [];
    gameArray = [];
}