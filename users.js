class User {
    constructor(username, pin, balance) {
        this.username = username;
        this.pin = pin;
        this.balance = balance;
    }

    authenticate(pin) {
        return this.pin === pin;
    }

    viewBalance() {
        console.log(`Your current balance is: $${this.balance.toFixed(2)}`);
    }

    deposit(amount) {
        if (isNaN(amount) || amount <= 0) {
            console.log("Invalid amount. Please enter a positive number.");
            return;
        }
        this.balance += amount;
        console.log(`Deposited $${amount.toFixed(2)}. New balance: $${this.balance.toFixed(2)}`);
    }
    
    withdraw(amount) {
        if (isNaN(amount) || amount <= 0) {
            console.log("Invalid amount. Please enter a positive number.");
            return false;
        }
        if (amount > this.balance) {
            console.log("Insufficient funds.");
            return false;
        }
        this.balance -= amount;
        console.log(`Withdrew $${amount.toFixed(2)}. New balance: $${this.balance.toFixed(2)}`);
        return true;
    }
}

module.exports = User;
