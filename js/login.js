function login() {
    var email = document.getElementById('emailSignUp').value;
    var password = document.getElementById('passwordSignUp').value;

    // Example: Add your validation and authentication logic here
    console.log('Logging in with:', email, password);

    // Simulate successful login
    alert('Login successful.');
    window.location.href = 'main.html';
}

// for the login function from login