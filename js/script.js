// script.js

document.getElementById("menu-toggle").addEventListener("click", function(e) {
    e.preventDefault();
    var wrapper = document.getElementById("wrapper");
    wrapper.classList.toggle("toggled");
});

document.getElementById('registerButton').addEventListener('click', function() {
    window.location.href = 'register.html';
});

document.getElementById('loginButton').addEventListener('click', function() {
    window.location.href = 'login.html';
});
