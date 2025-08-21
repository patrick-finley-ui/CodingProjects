
var buttons = document.querySelectorAll(".drum");

var keys = ['w', 'a', 's', 'd', 'j', 'k', 'l'];

buttons.forEach((num, index) => {
    num.addEventListener("click", handleClick);
    document.addEventListener("keydown", (event) => {
        if (event.key === 'w') {
            var audio = new Audio("sounds/tom-1.mp3");
            audio.play();
        }
        else { }
    });
        
});


function handleClick() {
    var audio = new Audio(src = "sounds/tom-1.mp3");
    audio.play();
}