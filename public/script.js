async function vote(contestant) {
    const email = prompt("Please enter your email address to vote:");

    if (!email) {
        alert("You must enter an email address to vote!");
        return;
    }

    const response = await fetch('/vote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ contestant, email })
    });

    if (response.ok) {
        alert("Vote recorded successfully!");
        updateVoteCounts();
    } else {
        const errorMessage = await response.text();
        alert(errorMessage);
    }
}

// Function to update vote counts dynamically
async function updateVoteCounts() {
    const response = await fetch('/vote-counts');
    const data = await response.json();

    document.getElementById('votes1').innerText = data.votes[0];
    document.getElementById('votes2').innerText = data.votes[1];
    document.getElementById('votes3').innerText = data.votes[2];
}

// Call the function to update counts when the page loads
updateVoteCounts();
