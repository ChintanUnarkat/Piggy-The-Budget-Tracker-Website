let expenseChart; 
let tipIndex = 0; 
let currentCurrency = 'USD';

// Currency conversion rates
const conversionRates = {
    USD: 1, EUR: 0.85, GBP: 0.75, INR: 74.5, JPY: 110.5
};

// Investment Tips
const investmentTips = [
    "Diversify your portfolio to minimize risk.",
    "Invest in index funds for steady growth.",
    "Review your investments regularly.",
    "Keep an emergency fund before investing.",
    "Start investing as early as possible."
];

// Load budget data from localStorage
function loadBudgetData() {
    return JSON.parse(localStorage.getItem("budgetData")) || { income: 0, expenses: [] };
}

// Save budget data to localStorage
function saveBudgetData(data) {
    localStorage.setItem("budgetData", JSON.stringify(data));
}

// Update summary display
function updateSummary() {
    const budgetData = loadBudgetData();
    const selectedCurrency = document.getElementById("currency").value;

    // Convert stored USD income & expenses back to selected currency
    const totalIncome = (budgetData.income * conversionRates[selectedCurrency]).toFixed(2);
    const totalExpenses = budgetData.expenses.reduce((sum, exp) => sum + (exp.amount * conversionRates[selectedCurrency]), 0).toFixed(2);
    const balance = (totalIncome - totalExpenses).toFixed(2);

    // Display values in the correct currency
    document.getElementById("total-income").textContent = totalIncome;
    document.getElementById("total-expenses").textContent = totalExpenses;
    document.getElementById("balance").textContent = balance;

    document.getElementById("currency-symbol").textContent = selectedCurrency;
    document.getElementById("currency-symbol-exp").textContent = selectedCurrency;
    document.getElementById("currency-symbol-bal").textContent = selectedCurrency;

    updateExpenseChart();
}

// Set Income
function setIncome() {
    const incomeInput = document.getElementById("income").value;
    const income = parseFloat(incomeInput);
    const selectedCurrency = document.getElementById("currency").value;

    if (isNaN(income) || income <= 0) {
        alert("Please enter a valid income amount.");
        return;
    }

    const budgetData = loadBudgetData();

    // Convert entered income to USD for consistent storage
    budgetData.income = income / conversionRates[selectedCurrency];

    saveBudgetData(budgetData);
    document.getElementById("income").value = ""; // Clear input
    updateSummary();
}

// Add Expense
function addExpense() {
    const name = document.getElementById("expense-name").value.trim();
    const amountInput = document.getElementById("expense-amount").value;
    const amount = parseFloat(amountInput);
    const date = document.getElementById("expense-date").value;
    const selectedCurrency = document.getElementById("currency").value;

    if (!name || isNaN(amount) || amount <= 0 || !date) {
        alert("Please enter valid expense details.");
        return;
    }

    const budgetData = loadBudgetData();

    // Convert expense to USD for consistent storage
    const amountInUSD = amount / conversionRates[selectedCurrency];
    budgetData.expenses.push({ name, amount: amountInUSD, date });

    saveBudgetData(budgetData);

    // Clear input fields
    document.getElementById("expense-name").value = "";
    document.getElementById("expense-amount").value = "";
    document.getElementById("expense-date").value = "";

    updateSummary();
}

// Clear all data
function clearBudgetData() {
    localStorage.removeItem("budgetData");
    updateSummary(); // Refresh UI
}

// Update the Expense Breakdown Chart
function updateExpenseChart() {
    const budgetData = loadBudgetData();
    const selectedCurrency = document.getElementById("currency").value;

    // Convert expense amounts back to selected currency
    const expenseNames = budgetData.expenses.map(exp => exp.name);
    const expenseAmounts = budgetData.expenses.map(exp => (exp.amount * conversionRates[selectedCurrency]).toFixed(2));

    if (expenseChart) {
        expenseChart.destroy(); // Prevent duplicate charts
    }

    const ctx = document.getElementById("expenseChart").getContext("2d");
    expenseChart = new Chart(ctx, {
        type: 'doughnut',
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

// Show rotating investment tips
function showInvestmentTips() {
    document.getElementById("tip-text").textContent = investmentTips[tipIndex];
    tipIndex = (tipIndex + 1) % investmentTips.length;
}

// Convert currency and refresh data
function convertCurrency() {
    currentCurrency = document.getElementById("currency").value;
    updateSummary();
}

// Initialize app on page load
document.addEventListener("DOMContentLoaded", () => {
    updateSummary();
    showInvestmentTips();
    setInterval(showInvestmentTips, 5000);
});
