function BankAccount(customerName, balance = 0) {
  this.customerName = customerName;
  this.customerId = Date.now();
  this.balance = balance;
}

BankAccount.prototype.deposit = function (amount) {
  this.balance += amount;
};

BankAccount.prototype.withdraw = function (amount) {
  this.balance -= amount;
};

const rakeshAccount = new BankAccount("Rakesh", 4000);
const johnAccount = new BankAccount("John");

console.log("rakeshAccount", rakeshAccount);
console.log("johnAccount", johnAccount);
