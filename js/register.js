document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Validate that all fields are filled
    var firstName = document.getElementById('firstName').value.trim();
    var lastName = document.getElementById('lastName').value.trim();
    var email = document.getElementById('emailSignUp').value.trim();
    var password = document.getElementById('passwordSignUp').value.trim();

    if (!firstName || !lastName || !email || !password) {
        alert('Please fill in all fields.');
        return; // Stop the function if any field is empty
    }

    // Simulate registration process
    console.log('Registration complete:', firstName, lastName, email, password);
    alert('Registration successful.');

    // Redirect to login page
    window.location.href = 'login.html';
});

// for the register function from register page