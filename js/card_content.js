function showCardContent(cardId) {
    // Hide all cards
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('d-none');
    });
    // Show the selected card
    document.getElementById(cardId).classList.remove('d-none');
}

//for the showCardContent function of main