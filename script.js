// script.js

document.getElementById("menu-toggle").addEventListener("click", function(e) {
    e.preventDefault();
    var wrapper = document.getElementById("wrapper");
    wrapper.classList.toggle("toggled");
});
