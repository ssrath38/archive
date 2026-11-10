// The parameters which the BankAccount constructor function recieves are assigned to the (this.customerName , this.balance). Here this refers to that current object instance

function BankAccount(customerName, balance = 0) {
  // Properties
  this.customerName = customerName;
  this.customerId = Date.now();
  this.balance = balance;

  //   The problem with this type of method declaration is excess memory use each object will have different functions for this we have to add the methods to the prototype of the BankAccount constructor so that from there all object instance can access that.

  // Methods
  this.deposit = function (amount) {
    this.balance += amount;
  };

  this.withdraw = (amount) => {
    this.balance -= amount;
  };
}

// Create Object Instance
const rakeshAccount = new BankAccount("Rakesh", 4000);
const johnAccount = new BankAccount("John");

console.log("rakeshAccount", rakeshAccount);
rakeshAccount.deposit(500);

console.log("rakeshAccount", rakeshAccount);
console.log("johnAccount", johnAccount);

// The UI Part

const accounts = [];
const accountCreateForm = document.getElementById("account-create-form");
const customerName = document.getElementById("customer-name");
const balance = document.getElementById("balance");

const depositForm = document.getElementById("deposit-form");
const depositAccountNumber = document.getElementById("deposit-account-number");
const depositAmount = document.getElementById("deposit-amount");

const withdrawForm = document.getElementById("withdraw-form");
const withdrawAccountNumber = document.getElementById(
  "withdraw-account-number"
);
const withdrawAmount = document.getElementById("withdraw-amount");

accountCreateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const account = new BankAccount(customerName.value, +balance.value);
  accounts.push(account);
  console.log(accounts);
});

depositForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const account = accounts.find(
    (account) => account.customerId === +depositAccountNumber.value
  );
  account.deposit(+depositAmount.value);
  console.log(accounts);
});

withdrawForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const account = accounts.find(
    (account) => account.customerId === +withdrawAccountNumber.value
  );
  account.withdraw(+withdrawAmount.value);
  console.log(accounts);
});
