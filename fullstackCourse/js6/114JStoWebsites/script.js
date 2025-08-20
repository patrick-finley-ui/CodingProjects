document.querySelector("h1").innerHTML = "Hello World";

document.querySelector("button").addEventListener("click", function() {
    document.querySelector("h1").innerHTML = "Button Clicked";
});

document.querySelector("button").addEventListener("mouseover", function() {
    document.querySelector("h1").innerHTML = "Button Hovered";
});
