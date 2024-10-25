// Event handling for loading content and additional functions
document.addEventListener('DOMContentLoaded', function() {
    // Add other event listeners if needed
    document.getElementById('loginButton').addEventListener('click', login);
    document.getElementById('logoutButton').addEventListener('click', logout);

    // Example of setting up event listeners for hypothetical buttons
    // Make sure to add these buttons in your HTML or adjust as necessary
});


// Utility function to hide modal and clear input
function hideModalAndClearInput(modalId, inputId = null) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    modal.hide();
    if (inputId) {
        document.getElementById(inputId).value = '';
    }
}

// Save data to a specific table
function saveDataToTable(inputId, tableId) {
    const input = document.getElementById(inputId);
    const table = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    const cell = newRow.insertCell(0);
    cell.textContent = input.value;
    hideModalAndClearInput(inputId.replace('Input', 'Modal'), inputId);
}

// Generic function to add row to table
function addRowToTable(tableId, rowData) {
    const table = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.innerHTML = rowData.map(data => `<td>${data}</td>`).join('');
}

document.addEventListener('DOMContentLoaded', function() {
    // Event listener for saving address and phone
    document.getElementById('addressSaveBtn').addEventListener('click', () => saveDataToTable('addressInput', 'addressesTable'));
    document.getElementById('phoneSaveBtn').addEventListener('click', () => saveDataToTable('phoneInput', 'phonesTable'));

    // Save insurance
    document.getElementById('insuranceSaveBtn').addEventListener('click', function() {
        const provider = document.getElementById('insuranceProvider').value;
        const policy = document.getElementById('policyNumber').value;
        const coverage = document.getElementById('coverageType').value;
        const valid = document.getElementById('validUntil').value;
        addRowToTable('insuranceTable', [provider, policy, coverage, valid]);
        hideModalAndClearInput('insuranceModal');
    });

    // Set self-pay
    document.getElementById('selfPayBtn').addEventListener('click', function() {
        addRowToTable('selfPayTable', ['Self-pay Confirmed']);
        hideModalAndClearInput('selfPayModal');
    });

    // Adding appointment via form
    document.getElementById('appointmentForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const date = document.getElementById('appointmentDate').value;
        const doctor = document.getElementById('doctorName').value;
        const reason = document.getElementById('appointmentReason').value;
        addRowToTable('appointmentsTable', [date, doctor, reason]);
        hideModalAndClearInput('appointmentModal');
    });

    // Viewing appointment history
    const appointmentHistoryTable = document.getElementById('appointmentHistoryTable');
    const appointments = [
        { date: "March 15, 2023", doctor: "Dr. Smith", reason: "Routine Check-up", outcome: "Follow-up in 6 months" },
        { date: "January 10, 2023", doctor: "Dr. Brown", reason: "Blood Pressure Check", outcome: "Medication Adjusted" },
        { date: "October 5, 2022", doctor: "Dr. White", reason: "Flu Symptoms", outcome: "Prescribed Antibiotics" }
    ];
    appointments.forEach(appointment => {
        addRowToTable('appointmentHistoryTable', [appointment.date, appointment.doctor, appointment.reason, appointment.outcome]);
    });

    // For Medical History
    document.getElementById('addRecordForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const date = document.getElementById('recordDate').value;
        const condition = document.getElementById('condition').value;
        const treatment = document.getElementById('treatment').value;
        addRowToTable('medicalHistoryTable', [date, condition, treatment]);
        hideModalAndClearInput('addRecordModal');
    });
});
