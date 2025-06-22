const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    signDisplay: "always",
});

const list = document.getElementById("transactionList");
const form = document.getElementById("transactionForm");
const status = document.getElementById("status");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const searchInput = document.getElementById("search");
const categoryDropdown = document.getElementById("category");
const newCategoryField = document.getElementById("newCategoryField");
const newCategoryInput = document.getElementById("newCategory");

let transactions = [];

categoryDropdown.addEventListener('change', (e) => {
    if (e.target.value === 'other') {
        newCategoryField.style.display = 'block';
        newCategoryInput.required = true;
    } else {
        newCategoryField.style.display = 'none';
        newCategoryInput.required = false;
    }
});

form.addEventListener("submit", addTransaction);
searchInput.addEventListener("input", renderList);

function updateTotal() {
    const incomeTotal = transactions
        .filter(trx => trx.type === "income")
        .reduce((total, trx) => total + trx.amount, 0);

    const expenseTotal = transactions
        .filter(trx => trx.type === "expense")
        .reduce((total, trx) => total + trx.amount, 0);

    const balanceTotal = incomeTotal - expenseTotal;

    balance.textContent = formatter.format(balanceTotal);
    income.textContent = formatter.format(incomeTotal);
    expense.textContent = formatter.format(expenseTotal);
}

function renderList() {
    const searchQuery = searchInput.value.toLowerCase();
    list.innerHTML = "";

    status.textContent = "";
    if (transactions.length === 0) {
        status.textContent = "No transactions.";
        return;
    }

    const filteredTransactions = transactions.filter(({ name }) =>
        name.toLowerCase().includes(searchQuery)
    );

    if (filteredTransactions.length === 0) {
        status.textContent = "No matching transactions.";
        return;
    }

    filteredTransactions.forEach(({ id, name, amount, date, type, category }) => {
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = name;
        li.append(span);

        const amountEl = document.createElement("span");
        amountEl.textContent = formatter.format(amount);
        li.append(amountEl);

        const dateEl = document.createElement("span");
        dateEl.textContent = new Date(date).toLocaleDateString();
        li.append(dateEl);

        const typeEl = document.createElement("span");
        typeEl.textContent = type;
        li.append(typeEl);

        const categoryEl = document.createElement("span");
        categoryEl.textContent = category;
        li.append(categoryEl);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.dataset.id = id;
        deleteBtn.onclick = deleteTransaction;
        li.append(deleteBtn);

        list.append(li);
    });
}

async function fetchTransactions() {
    const res = await fetch("fetch_transactions.php");
    transactions = await res.json();

    transactions = transactions.map(trx => ({
        ...trx,
        amount: parseFloat(trx.amount),
    }));

    updateTotal();
    renderList();
}

async function addTransaction(event) {
    event.preventDefault();

    const formData = new FormData(form);
    const isIncome = formData.get("type") =="on";	
    const data = {
        name: formData.get("name"),
        amount: parseFloat(formData.get("amount")),
        date: formData.get("date"),
        type: isIncome ? "income" : "expense",
        category: formData.get("category") === "other" ? formData.get("newCategory") : formData.get("category"),
    };

    const response = await fetch("add_transaction.php", {
        method: "POST",
        body: new URLSearchParams(data),
    });

    if (response.ok) {
        form.reset();
        fetchTransactions();
    } else {
        console.error("Error adding transaction:", response.statusText);
    }
}

async function deleteTransaction(event) {
    const id = event.target.dataset.id;
    const response = await fetch(`delete_transaction.php?id=${id}`);

    if (response.ok) {
        fetchTransactions();
    } else {
        console.error("Error deleting transaction:", response.statusText);
    }
}

fetchTransactions();
