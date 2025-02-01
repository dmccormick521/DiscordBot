const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the database file path
const dbPath = path.join(__dirname, 'database.db');

// Create or open the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Database opened successfully.');
    }
});

// Create the table if it doesn't exist
const createTableQuery = `
CREATE TABLE IF NOT EXISTS audio_preferences (
    user_id TEXT PRIMARY KEY,
    audio_file TEXT
);
`;

db.run(createTableQuery, (err) => {
    if (err) {
        console.error('Error creating table:', err);
    } else {
        console.log('Table created or already exists.');
    }
});


// Get user audio preference
function getAudioPreference(userId) {
    return new Promise((resolve, reject) => {
        const query = `SELECT audio_file FROM audio_preferences WHERE user_id = ?`;
        db.get(query, [userId], (err, row) => {
            if (err) {
                console.error('Error fetching audio preference:', err);
                return reject(err);
            }
            if (row) {
                console.log(`Audio file found for user ${userId}`);
                resolve({ found: true, audioFile: row.audio_file });
            } else {
                console.log(`No audio preference set for user ${userId}.`);
                resolve({ found: false });
            }
        });
    });
}

module.exports = { db, saveAudioPreference, getAudioPreference };


// Insert or replace a user's audio preference (audio file path)
// Save or update user audio preference
function saveAudioPreference(userId, audioFilePath) {
    return new Promise((resolve, reject) => {
        const query = `INSERT OR REPLACE INTO audio_preferences (user_id, audio_file) VALUES (?, ?)`;
        db.run(query, [userId, audioFilePath], function (err) {
            if (err) {
                console.error('Error saving audio preference:', err);
                return reject(false); // Return false if there is an error
            }
            console.log(`Saved audio preference for user ${userId}.`);
            resolve(true); // Return true if saved successfully
        });
    });
}

function deleteAudioPreference(userId) {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM audio_preferences WHERE user_id = ?`;
        db.run(query, [userId], function (err) {
            if (err) {
                console.error('Error deleting audio preference:', err);
                return reject(false); // Return false if there is an error
            }
            console.log(`Delete audio preference for user ${userId}.`);
            resolve(true); // Return true if deleted successfully
        });
    });
}

module.exports = { db, getAudioPreference, saveAudioPreference, deleteAudioPreference };
