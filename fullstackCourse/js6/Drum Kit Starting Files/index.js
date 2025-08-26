var buttons = document.querySelectorAll(".drum");

var soundMap = {
    "w": "sounds/tom-1.mp3",
    "a": "sounds/tom-2.mp3", 
    "s": "sounds/tom-3.mp3",
    "d": "sounds/tom-4.mp3",
    "j": "sounds/crash.mp3",
    "k": "sounds/kick-bass.mp3",
    "l": "sounds/snare.mp3"
};

function playSound(key) {
    if (soundMap[key]) {
        new Audio(soundMap[key]).play();
    }
}

for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function() {
        playSound(this.innerHTML);
        buttonAnimation(this.innerHTML);
    });
    
 
};

document.addEventListener("keydown", function(event) {
    playSound(event.key);
     buttonAnimation(event.key);
    });

var housekeeper = {
    yearsOfExperience: 12,
    name: "Jane",
    cleaningReportoire: ["bathroom", "lobby", "bedroom"]
}

function HouseKeeper (yearsOfExperience, name, cleaningReportoire) {
    this.yearsOfExperience = yearsOfExperience;
    this.name = name;
    this.cleaningReportoire = cleaningReportoire;
}

var housekeeper1 = new HouseKeeper(14, "Janet", ["bathroom", "lobby", "bedroom"]);


function buttonAnimation(currentKey) {
    var activeButton = document.querySelector("." + currentKey);
    activeButton.classList.add("pressed");
    setTimeout(function () {
        activeButton.classList.remove("pressed")
    }, 100);
}