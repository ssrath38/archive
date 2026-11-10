class BankAccount {
  constructor(customerName, balance = 0) {
    this.customerName = customerName;
    this.customerId = Date.now();
    this.balance = balance;
  }

  deposit(amount) {
    this.balance += amount;
  }
  withdraw(amount) {
    this.balance -= amount;
  }
}

const rakeshAccount = new BankAccount("Rakesh");
const johnAccount = new BankAccount("John", 1200);

console.log(rakeshAccount);
console.log(johnAccount);
johnAccount.deposit(1200);
console.log(johnAccount);
