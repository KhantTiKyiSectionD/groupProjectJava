const User = require('./users');
const ETransfer = require('./etransfer');
const { loadData, saveData } = require('./utils');

class BankingApp {
    constructor() {
        this.users = loadData('./users.json').map(user => new User(user.username, user.pin, user.balance));
        this.pendingTransfers = loadData('./etransfers.json').map(
            transfer => new ETransfer(transfer.sender, transfer.recipient, transfer.amount, transfer.securityQuestion, transfer.securityAnswer)
        );
    }

    saveChanges() {
        saveData('./users.json', this.users);
        saveData('./etransfers.json', this.pendingTransfers);
    }

    findUser(email) {
        return this.users.find(user => user.username === email);
    }

    authenticateUser(email, pin) {
        const user = this.findUser(email);
        if (!user || !user.authenticate(pin)) {
            console.log("Authentication failed.");
            return null;
        }
        console.log("Authentication successful.");
        return user;
    }

    mainMenu(user, prompt) {
        let choice;
        do {
            console.log(`
                1. View Balance
                2. Deposit Funds
                3. Withdraw Funds
                4. Send E-Transfer
                5. Accept E-Transfer
                6. Exit
            `);
            choice = parseInt(prompt("Enter your choice: "), 10);
            switch (choice) {
                case 1:
                    user.viewBalance();
                    break;
                case 2:
                    const depositAmount = parseFloat(prompt("Enter amount to deposit: "));
                    user.deposit(depositAmount);
                    break;
                case 3:
                    const withdrawAmount = parseFloat(prompt("Enter amount to withdraw: "));
                    user.withdraw(withdrawAmount);
                    break;
                case 4:
                    this.sendETransfer(user, prompt);
                    break;
                case 5:
                    this.acceptETransfer(user, prompt);
                    break;
                case 6:
                    console.log("Thank you for using our bank app!");
                    break;
                default:
                    console.log("Invalid choice. Please try again.");
            }
            this.saveChanges();
        } while (choice !== 6);
    }

    sendETransfer(sender, prompt) {
        const recipientEmail = prompt("Enter recipient's email: ");
        const recipient = this.findUser(recipientEmail);
        if (!recipient) {
            console.log("Recipient not found.");
            return;
        }
    
        let amount = prompt("Enter amount to send: ");
        if (isNaN(amount) || parseFloat(amount) <= 0) {
            console.log("Invalid amount. Please enter a number.");
            return;
        }
    
        amount = parseFloat(amount);
        if (amount > sender.balance) {
            console.log("Insufficient funds.");
            return;
        }
    
        const securityQuestion = prompt("Enter a security question: ");
        const securityAnswer = prompt("Enter the security answer: ");
        sender.withdraw(amount);
        this.pendingTransfers.push(new ETransfer(sender.username, recipient.username, amount, securityQuestion, securityAnswer));
        console.log("E-transfer sent successfully.");
    }

    acceptETransfer(user,prompt) {
        const transfer = this.pendingTransfers.find(t => t.recipient === user.username);
        if (!transfer) {
            console.log("No pending e-transfers.");
            return;
        }

        console.log(`Security Question: ${transfer.securityQuestion}`);
        const answer = prompt("Enter the security answer: ");
        if (transfer.accept(answer)) {
            user.deposit(transfer.amount);
            this.pendingTransfers = this.pendingTransfers.filter(t => t !== transfer);
            console.log("E-transfer accepted successfully.");
        } else {
            console.log("Incorrect security answer.");
        }
    }
}

module.exports = BankingApp;
