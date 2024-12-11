const BankingApp = require('./bankingApp');
const prompt = require('prompt-sync')();

const app = new BankingApp();

const email = prompt("Enter your email: ");
const pin = prompt("Enter your PIN: ");
const user = app.authenticateUser(email, pin);

if (user) {
    app.mainMenu(user, prompt);
}
