const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// In-memory storage for votes, voters, and their information
let votes = [0, 0, 0]; // For 3 contestants
let voters = new Set(); // To track unique voters
let voterDetails = []; // To store email and IP address

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Log votes to in-memory storage
app.post('/vote', (req, res) => {
    const { contestant, email } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // Capture IP address

    // Check if the email has already voted
    if (voters.has(email)) {
        return res.status(400).send('You have already voted!');
    }

    // Validate contestant number
    if (contestant >= 1 && contestant <= votes.length) {
        votes[contestant - 1]++;
        voters.add(email); // Add email to the set of voters
        voterDetails.push({ email, ip, contestant }); // Store voter details
        res.send('Vote recorded successfully');
    } else {
        res.status(400).send('Invalid contestant number');
    }
});

// Serve the results page
app.get('/results', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'results.html'));
});

// Provide current vote counts for the results page
app.get('/vote-counts', (req, res) => {
    res.json({ votes });
});

// Admin page to view voters
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Provide voter details for the admin page
app.get('/voter-details', (req, res) => {
    res.json(voterDetails);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
