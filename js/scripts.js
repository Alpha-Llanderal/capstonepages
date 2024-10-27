/////////////////////////////////////////////////////////////////////////////// Login Section
// Ensure the script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Reference to the login form
    const loginForm = document.querySelector('form');
    const emailInput = document.getElementById('emailSignUp');
    const passwordInput = document.getElementById('passwordSignUp');

    // Function to handle login
    window.login = function() {
        // Get the input values
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Basic client-side validation
        if (!validateEmail(email)) {
            showAlert('Please enter a valid email address.', 'danger');
            return;
        }

        if (password.length < 6) {
            showAlert('Password must be at least 6 characters long.', 'danger');
            return;
        }

        // Prepare data to send to the server
        const loginData = {
            email: email,
            password: password
        };

        // Send login request to the backend
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData),
            credentials: 'include' // Include cookies for session management
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Login successful, redirect to dashboard or home page
                window.location.href = 'dashboard.html';
            } else {
                // Display error message from server
                showAlert(data.message || 'Login failed. Please try again.', 'danger');
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            showAlert('Invalid Username or Password. Please try again later.', 'danger');
        });
    };

    // Function to display alerts
    function showAlert(message, type) {
        // Remove existing alert if any
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} mt-3`;
        alertDiv.textContent = message;

        // Insert alert into the DOM
        loginForm.parentNode.insertBefore(alertDiv, loginForm.nextSibling);

        // Automatically remove alert after 5 seconds
        setTimeout(() => {
            if (alertDiv) {
                alertDiv.remove();
            }
        }, 5000);
    }

    // Function to validate email format
    function validateEmail(email) {
        // Simple email regex pattern
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});

/////////////////////////////////////////////////////////////////////////////// Registration Section
// Ensure the script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Reference to the registration form and alert div
    const registrationForm = document.getElementById('registrationForm');
    const registrationAlert = document.getElementById('registrationAlert');

    // Input field references
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('emailSignUp');
    const passwordInput = document.getElementById('passwordSignUp');

    // Handle form submission
    registrationForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Clear any existing alerts
        registrationAlert.classList.add('d-none');
        registrationAlert.textContent = '';

        // Get input values and trim whitespace
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validate inputs
        const errors = [];

        if (!firstName) {
            errors.push('First name is required.');
        }

        if (!lastName) {
            errors.push('Last name is required.');
        }

        if (!email) {
            errors.push('Email address is required.');
        } else if (!validateEmail(email)) {
            errors.push('Please enter a valid email address.');
        }

        if (!password) {
            errors.push('Password is required.');
        } else if (password.length < 6) {
            errors.push('Password must be at least 6 characters long.');
        }

        if (errors.length > 0) {
            // Display errors
            registrationAlert.classList.remove('d-none');
            registrationAlert.innerHTML = errors.join('<br>');
            return;
        }

        // Prepare data to send to the server
        const registrationData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        };

        // Send registration data to the backend
        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registrationData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Registration successful
                    showAlert('Registration successful! Redirecting to login page...', 'success');
                    // Optionally redirect after a delay
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    // Display server error message
                    showAlert(data.message || 'Registration failed. Please try again.', 'danger');
                }
            })
            .catch(error => {
                console.error('Error during registration:', error);
                showAlert('An error occurred during registration. Please try again later.', 'danger');
            });
    });

    // Function to display alerts
    function showAlert(message, type) {
        registrationAlert.className = `alert alert-${type}`;
        registrationAlert.textContent = message;
        registrationAlert.classList.remove('d-none');
    }

    // Function to validate email format
    function validateEmail(email) {
        // Simple email regex pattern
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});

/////////////////////////////////////////////////////////////////////////////// Logout Section
// Ensure the script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Reference to the logout button
    const logoutButton = document.getElementById('logoutButton');

    if (logoutButton) {
        logoutButton.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default link behavior if it's an anchor tag

            // Send a request to the server to invalidate the session
            fetch('/api/logout', {
                method: 'POST',
                credentials: 'include' // Include cookies for session management
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Clear any client-side stored data if necessary
                    // For example, remove tokens from localStorage or sessionStorage
                    localStorage.removeItem('authToken');

                    // Redirect the user to the login page
                    window.location.href = 'login.html';
                } else {
                    // Handle any errors returned by the server
                    console.error('Logout failed:', data.message);
                    alert('An error occurred while logging out. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error during logout:', error);
                alert('An error occurred while logging out. Please try again.');
            });
        });
    }
});

/////////////////////////////////////////////////////////////////////////////// Personal Information Section
// Utility function to hide modal and clear input
function hideModalAndClearInput(modalId, inputIds = []) {
    const modalElement = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
    inputIds.forEach(id => {
        const input = document.getElementById(id);
        input.value = '';
    });
}

// Generic function to add row to table
function addRowToTable(tableId, rowData) {
    const table = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    rowData.forEach(data => {
        const cell = newRow.insertCell();
        cell.textContent = data;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Profile Picture Upload
    const profilePictureInput = document.getElementById('profilePictureInput');
    const profilePicture = document.getElementById('profilePicture');
    const uploadButton = document.getElementById('uploadButton');

    uploadButton.addEventListener('click', function() {
        profilePictureInput.click();
    });

    profilePictureInput.addEventListener('change', function() {
        const file = profilePictureInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePicture.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Save Address Function
    document.getElementById('saveAddressButton').addEventListener('click', function() {
        const addressInput = document.getElementById('addressInput');
        const addressAlert = document.getElementById('addressAlert');
        const address = addressInput.value.trim();
        if (address === '') {
            addressAlert.textContent = 'Address cannot be empty.';
            addressAlert.classList.remove('d-none');
        } else {
            addressAlert.classList.add('d-none');
            addRowToTable('addressesTable', [address]);
            hideModalAndClearInput('addressModal', ['addressInput']);
        }
    });

    // Save Phone Number Function
    document.getElementById('savePhoneButton').addEventListener('click', function() {
        const phoneInput = document.getElementById('phoneInput');
        const phoneAlert = document.getElementById('phoneAlert');
        const phone = phoneInput.value.trim();
        if (phone === '') {
            phoneAlert.textContent = 'Phone number cannot be empty.';
            phoneAlert.classList.remove('d-none');
        } else {
            phoneAlert.classList.add('d-none');
            addRowToTable('phonesTable', [phone]);
            hideModalAndClearInput('phoneModal', ['phoneInput']);
        }
    });

    // Save Changes Function
    document.getElementById('saveChangesButton').addEventListener('click', function() {
        // Collect form data
        const profileData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            birthDate: document.getElementById('birthDate').value,
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            addresses: [],
            phoneNumbers: []
        };

        // Get addresses
        const addressesTable = document.getElementById('addressesTable').getElementsByTagName('tbody')[0];
        for (let row of addressesTable.rows) {
            profileData.addresses.push(row.cells[0].textContent);
        }

        // Get phone numbers
        const phonesTable = document.getElementById('phonesTable').getElementsByTagName('tbody')[0];
        for (let row of phonesTable.rows) {
            profileData.phoneNumbers.push(row.cells[0].textContent);
        }

        // Send data to backend
        fetch('/api/updateProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        })
        .then(response => response.json())
        .then(data => {
            alert('Profile updated successfully.');
        })
        .catch(error => {
            console.error('Error updating profile:', error);
        });

        // Upload profile picture if changed
        if (profilePictureInput.files.length > 0) {
            const formData = new FormData();
            formData.append('profilePicture', profilePictureInput.files[0]);

            fetch('/api/uploadProfilePicture', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log('Profile picture uploaded successfully.');
            })
            .catch(error => {
                console.error('Error uploading profile picture:', error);
            });
        }
    });
});

/////////////////////////////////////////////////////////////////////////////// Insurance Section
document.addEventListener('DOMContentLoaded', function() {
    // Utility function to hide modal and clear input
    function hideModalAndClearInput(modalId, inputIds = []) {
        const modalElement = document.getElementById(modalId);
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        inputIds.forEach(id => {
            const input = document.getElementById(id);
            input.value = '';
        });
    }

    // Function to add insurance details to the table with a remove button
    function addInsuranceToTable(insuranceData) {
        const table = document.getElementById('insuranceTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();

        // Add insurance data cells
        Object.values(insuranceData).forEach(data => {
            const cell = newRow.insertCell();
            cell.textContent = data;
        });

        // Add action cell with a remove button
        const actionCell = newRow.insertCell();
        const removeButton = document.createElement('button');
        removeButton.className = 'btn btn-danger btn-sm';
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to remove this insurance entry?')) {
                // Remove the row from the table
                table.deleteRow(newRow.rowIndex - 1); // Adjust for header row

                // Optionally, update the backend to remove this insurance entry

                // If no more insurance entries, you might want to handle that
            }
        });
        actionCell.appendChild(removeButton);
    }

    // Function to handle "Save Insurance" button click
    document.getElementById('saveInsuranceButton').addEventListener('click', function() {
        const provider = document.getElementById('insuranceProvider').value.trim();
        const policy = document.getElementById('policyNumber').value.trim();
        const coverage = document.getElementById('coverageType').value.trim();
        const validUntil = document.getElementById('validUntil').value;

        const insuranceAlert = document.getElementById('insuranceAlert');

        // Validation
        if (!provider || !policy || !coverage || !validUntil) {
            insuranceAlert.textContent = 'All fields are required.';
            insuranceAlert.classList.remove('d-none');
            return;
        } else {
            insuranceAlert.classList.add('d-none');
        }

        // Create insurance data object
        const insuranceData = {
            provider,
            policy,
            coverage,
            validUntil
        };

        // Add to table
        addInsuranceToTable(insuranceData);

        // Hide modal and clear inputs
        hideModalAndClearInput('insuranceModal', ['insuranceProvider', 'policyNumber', 'coverageType', 'validUntil']);

        // Reset Self-Pay status if any
        document.getElementById('selfPayStatus').innerHTML = '';

        // Show "I am Self-pay" button in case user wants to switch
        document.getElementById('selfPayButton').classList.remove('d-none');

        // Hide "Reset Self-Pay Status" button if visible
        document.getElementById('resetSelfPayButton').classList.add('d-none');
    });

    // Handle "Self-pay" button click
    document.getElementById('selfPayButton').addEventListener('click', function() {
        // Clear insurance table
        const insuranceTableBody = document.getElementById('insuranceTable').getElementsByTagName('tbody')[0];
        insuranceTableBody.innerHTML = '';

        // Display self-pay status
        document.getElementById('selfPayStatus').innerHTML = `
            <div class="alert alert-success" role="alert">
                You have set your payment method to <strong>Self-pay</strong>.
            </div>
        `;

        // Hide "Add Primary Insurance" and "I am Self-pay" buttons
        document.getElementById('addInsuranceButton').classList.add('d-none');
        document.getElementById('selfPayButton').classList.add('d-none');

        // Show "Reset Self-Pay Status" button
        document.getElementById('resetSelfPayButton').classList.remove('d-none');
    });

    // Handle "Reset Self-Pay Status" button click
    document.getElementById('resetSelfPayButton').addEventListener('click', function() {
        // Clear self-pay status
        document.getElementById('selfPayStatus').innerHTML = '';

        // Show "Add Primary Insurance" and "I am Self-pay" buttons
        document.getElementById('addInsuranceButton').classList.remove('d-none');
        document.getElementById('selfPayButton').classList.remove('d-none');

        // Hide "Reset Self-Pay Status" button
        document.getElementById('resetSelfPayButton').classList.add('d-none');
    });
});

/////////////////////////////////////////////////////////////////////////////// Appointments Section
document.addEventListener('DOMContentLoaded', function() {
    // Function to add appointment to the table
    function addAppointmentToTable(appointmentData) {
        const table = document.getElementById('appointmentsTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();

        // Add appointment data cells
        const dateCell = newRow.insertCell();
        dateCell.textContent = appointmentData.date;

        const doctorCell = newRow.insertCell();
        doctorCell.textContent = appointmentData.doctor;

        const reasonCell = newRow.insertCell();
        reasonCell.textContent = appointmentData.reason;

        // Action cell with a cancel button
        const actionCell = newRow.insertCell();
        const cancelButton = document.createElement('button');
        cancelButton.className = 'btn btn-danger btn-sm';
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel this appointment?')) {
                // Send request to backend to cancel the appointment
                fetch('/api/cancelAppointment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ appointmentId: appointmentData.id })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Remove the row from the table
                        table.deleteRow(newRow.rowIndex - 1); // Adjust for header row
                        alert('Appointment cancelled successfully.');
                    } else {
                        alert('Failed to cancel appointment: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error cancelling appointment:', error);
                    alert('An error occurred while cancelling the appointment.');
                });
            }
        });
        actionCell.appendChild(cancelButton);
    }

    // Handle appointment form submission
    document.getElementById('appointmentForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const date = document.getElementById('appointmentDate').value;
        const doctor = document.getElementById('doctorName').value.trim();
        const reason = document.getElementById('appointmentReason').value.trim();
        const appointmentAlert = document.getElementById('appointmentAlert');

        // Validation
        if (!date || !doctor || !reason) {
            appointmentAlert.textContent = 'All fields are required.';
            appointmentAlert.classList.remove('d-none');
            return;
        } else {
            appointmentAlert.classList.add('d-none');
        }

        // Create appointment data object
        const appointmentData = {
            date,
            doctor,
            reason
        };

        // Send data to backend to save the appointment
        fetch('/api/scheduleAppointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointmentData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Assign an ID to the appointment data
                appointmentData.id = data.appointmentId;

                // Add to table
                addAppointmentToTable(appointmentData);

                // Hide modal and reset form
                const appointmentModal = bootstrap.Modal.getInstance(document.getElementById('appointmentModal'));
                appointmentModal.hide();
                document.getElementById('appointmentForm').reset();

                alert('Appointment scheduled successfully.');
            } else {
                alert('Failed to schedule appointment: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error scheduling appointment:', error);
            alert('An error occurred while scheduling the appointment.');
        });
    });

    // Handle cancel appointment form submission
    document.getElementById('cancelAppointmentForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const date = document.getElementById('cancelAppointmentDate').value;
        const doctor = document.getElementById('cancelDoctorName').value.trim();
        const cancelAppointmentAlert = document.getElementById('cancelAppointmentAlert');

        // Validation
        if (!date || !doctor) {
            cancelAppointmentAlert.textContent = 'All fields are required.';
            cancelAppointmentAlert.classList.remove('d-none');
            return;
        } else {
            cancelAppointmentAlert.classList.add('d-none');
        }

        // Send request to backend to cancel the appointment
        fetch('/api/cancelAppointmentByDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date, doctor })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Remove the appointment from the table if it exists
                const table = document.getElementById('appointmentsTable').getElementsByTagName('tbody')[0];
                let appointmentFound = false;
                for (let i = 0; i < table.rows.length; i++) {
                    const row = table.rows[i];
                    if (row.cells[0].textContent === date && row.cells[1].textContent === doctor) {
                        table.deleteRow(i);
                        appointmentFound = true;
                        break;
                    }
                }
                if (appointmentFound) {
                    alert('Appointment cancelled successfully.');
                } else {
                    alert('Appointment cancelled successfully, but it was not found in the upcoming appointments list.');
                }

                // Hide modal and reset form
                const cancelAppointmentModal = bootstrap.Modal.getInstance(document.getElementById('cancelAppointmentModal'));
                cancelAppointmentModal.hide();
                document.getElementById('cancelAppointmentForm').reset();
            } else {
                alert('Failed to cancel appointment: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error cancelling appointment:', error);
            alert('An error occurred while cancelling the appointment.');
        });
    });

    // Load appointment history (example data)
    const appointmentHistoryData = [
        { date: '2023-03-15', doctor: 'Dr. Smith', reason: 'Routine Check-up', outcome: 'Follow-up in 6 months' },
        { date: '2023-01-10', doctor: 'Dr. Brown', reason: 'Blood Pressure Check', outcome: 'Medication Adjusted' },
        { date: '2022-10-05', doctor: 'Dr. White', reason: 'Flu Symptoms', outcome: 'Prescribed Antibiotics' }
    ];

    const historyTable = document.getElementById('appointmentHistoryTable').getElementsByTagName('tbody')[0];

    appointmentHistoryData.forEach(appointment => {
        const newRow = historyTable.insertRow();

        const dateCell = newRow.insertCell();
        dateCell.textContent = appointment.date;

        const doctorCell = newRow.insertCell();
        doctorCell.textContent = appointment.doctor;

        const reasonCell = newRow.insertCell();
        reasonCell.textContent = appointment.reason;

        const outcomeCell = newRow.insertCell();
        outcomeCell.textContent = appointment.outcome;
    });
});

/////////////////////////////////////////////////////////////////////////////// Medical Section
document.addEventListener('DOMContentLoaded', function() {
    // Function to add medical record to the table
    function addMedicalRecordToTable(recordData) {
        const table = document.getElementById('medicalHistoryTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();

        const dateCell = newRow.insertCell();
        dateCell.textContent = recordData.date;

        const conditionCell = newRow.insertCell();
        conditionCell.textContent = recordData.condition;

        const treatmentCell = newRow.insertCell();
        treatmentCell.textContent = recordData.treatment;
    }

    // Handle medical record form submission
    document.getElementById('addRecordForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const date = document.getElementById('recordDate').value;
        const condition = document.getElementById('condition').value.trim();
        const treatment = document.getElementById('treatment').value.trim();
        const recordAlert = document.getElementById('recordAlert');

        // Validation
        if (!date || !condition || !treatment) {
            recordAlert.textContent = 'All fields are required.';
            recordAlert.classList.remove('d-none');
            return;
        } else {
            recordAlert.classList.add('d-none');
        }

        // Create record data object
        const recordData = {
            date,
            condition,
            treatment
        };

        // Add to table
        addMedicalRecordToTable(recordData);

        // Optionally, send data to backend to save the medical record

        // Hide modal and reset form
        const addRecordModal = bootstrap.Modal.getInstance(document.getElementById('addRecordModal'));
        addRecordModal.hide();
        document.getElementById('addRecordForm').reset();
    });

    // Function to add laboratory test to the table
    function addLabTestToTable(labData) {
        const table = document.getElementById('laboratoryTestsTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();

        const dateCell = newRow.insertCell();
        dateCell.textContent = labData.dateUploaded;

        const testCell = newRow.insertCell();
        testCell.textContent = labData.labTestName;

        const fileCell = newRow.insertCell();
        const fileLink = document.createElement('a');
        fileLink.href = labData.fileURL;
        fileLink.target = '_blank';
        fileLink.textContent = 'View';
        fileCell.appendChild(fileLink);
    }

    // Handle laboratory test form submission
    document.getElementById('uploadLabForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const labTestName = document.getElementById('labTestName').value.trim();
        const labFileInput = document.getElementById('labFile');
        const labAlert = document.getElementById('labAlert');

        // Validation
        if (!labTestName || labFileInput.files.length === 0) {
            labAlert.textContent = 'All fields are required.';
            labAlert.classList.remove('d-none');
            return;
        } else {
            labAlert.classList.add('d-none');
        }

        const labFile = labFileInput.files[0];

        // Create FormData to send file to backend
        const formData = new FormData();
        formData.append('labTestName', labTestName);
        formData.append('labFile', labFile);

        // Send data to backend to save the laboratory test
        fetch('/api/uploadLabTest', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const labData = {
                    dateUploaded: data.dateUploaded, // Assuming backend returns the upload date
                    labTestName: labTestName,
                    fileURL: data.fileURL // Assuming backend returns the URL to the uploaded file
                };

                // Add to table
                addLabTestToTable(labData);

                // Hide modal and reset form
                const uploadLabModal = bootstrap.Modal.getInstance(document.getElementById('uploadLabModal'));
                uploadLabModal.hide();
                document.getElementById('uploadLabForm').reset();

                alert('Laboratory test uploaded successfully.');
            } else {
                alert('Failed to upload laboratory test: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error uploading laboratory test:', error);
            alert('An error occurred while uploading the laboratory test.');
        });
    });

    // Load existing medical history (example data)
    const medicalHistoryData = [
        { date: '2023-05-12', condition: 'Hypertension', treatment: 'Medication prescribed' },
        { date: '2022-11-08', condition: 'Diabetes', treatment: 'Dietary changes recommended' },
        { date: '2022-07-19', condition: 'Back Pain', treatment: 'Physical therapy sessions' }
    ];

    medicalHistoryData.forEach(record => {
        addMedicalRecordToTable(record);
    });

    // Load existing laboratory tests (example data)
    const laboratoryTestsData = [
        { dateUploaded: '2023-02-20', labTestName: 'Blood Test', fileURL: 'path/to/blood_test_report.pdf' },
        { dateUploaded: '2023-04-05', labTestName: 'X-Ray', fileURL: 'path/to/xray_image.jpg' },
        { dateUploaded: '2023-07-12', labTestName: 'ECG', fileURL: 'path/to/ecg_report.pdf' }
    ];

    laboratoryTestsData.forEach(labTest => {
        addLabTestToTable(labTest);
    });
});

