const fs = require('fs');

function loadData(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error loading ${filename}:`, error.message);
        return [];
    }
}

function saveData(filename, data) {
    try {
        fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Error saving ${filename}:`, error.message);
    }
}

module.exports = { loadData, saveData };