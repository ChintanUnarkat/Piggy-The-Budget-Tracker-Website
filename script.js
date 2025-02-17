let expenseChart; // Store the chart instance
let tipIndex = 0; // Index for investment tips
let currentCurrency = 'USD'; // Track selected currency

// Mock conversion rates
const conversionRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.75,
    INR: 74.5,
    JPY: 110.5
};

// Investment tips to display in the toggle bar
const investmentTips = [
    "Diversify your portfolio to minimize risk.",
    "Invest in index funds for steady growth.",
    "Review your investments regularly.",
    "Keep an emergency fund before investing.",
    "Start investing as early as possible.",
    "Avoid emotional decision-making in trading.",
    "Consider low-cost mutual funds for stability."
];

// Load data from Local Storage
function loadBudgetData() {
    return JSON.parse(localStorage.getItem("budgetData")) || { income: 0, expenses: [] };
}

// Save data to Local Storage
function saveBudgetData(data) {
    localStorage.setItem("budgetData", JSON.stringify(data));
}

// Function to update the pie chart
function updateExpenseChart() {
    const budgetData = loadBudgetData();
    const expenseNames = budgetData.expenses.map(exp => exp.name);
    const expenseAmounts = budgetData.expenses.map(exp => exp.amount);

    if (expenseChart) expenseChart.destroy();

    const ctx = document.getElementById("expenseChart").getContext("2d");
    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: expenseNames,
            datasets: [{
                data: expenseAmounts,
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40'],
                hoverOffset: 4
            }]
        }
    });
}

// Update income, expenses, and balance
function updateSummary() {
    const budgetData = loadBudgetData();
    const totalExpenses = budgetData.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const balance = budgetData.income - totalExpenses;

    document.getElementById("total-income").textContent = (budgetData.income * conversionRates[currentCurrency]).toFixed(2);
    document.getElementById("total-expenses").textContent = (totalExpenses * conversionRates[currentCurrency]).toFixed(2);
    document.getElementById("balance").textContent = (balance * conversionRates[currentCurrency]).toFixed(2);

    const expenseList = document.getElementById("expense-list");
    expenseList.innerHTML = "";
    budgetData.expenses.forEach(exp => {
        const li = document.createElement("li");
        li.textContent = `${exp.name} - ${(exp.amount * conversionRates[currentCurrency]).toFixed(2)} (${exp.date})`;
        expenseList.appendChild(li);
    });

    updateExpenseChart();
}

// Set income
function setIncome() {
    const income = parseFloat(document.getElementById("income").value);
    if (isNaN(income) || income <= 0) {
        alert("Please enter a valid income.");
        return;
    }

    const budgetData = loadBudgetData();
    budgetData.income = income;
    saveBudgetData(budgetData);
    updateSummary();
    document.getElementById("income").value = "";
}

// Add expense
function addExpense() {
    const name = document.getElementById("expense-name").value.trim();
    const amount = parseFloat(document.getElementById("expense-amount").value);
    const date = document.getElementById("expense-date").value;

    if (!name || isNaN(amount) || amount <= 0 || !date) {
        alert("Please enter valid expense details.");
        return;
    }

    const budgetData = loadBudgetData();
    budgetData.expenses.push({ name, amount, date });
    saveBudgetData(budgetData);
    updateSummary();

    document.getElementById("expense-name").value = "";
    document.getElementById("expense-amount").value = "";
    document.getElementById("expense-date").value = "";
}

// Clear all data
function clearBudgetData() {
    localStorage.removeItem("budgetData");
    updateSummary();
}

// Show investment tips
function showInvestmentTips() {
    const tipText = document.getElementById("tip-text");
    tipText.textContent = investmentTips[tipIndex];
    tipIndex = (tipIndex + 1) % investmentTips.length;
}
setInterval(showInvestmentTips, 5000);

// Convert currency
function convertCurrency()
