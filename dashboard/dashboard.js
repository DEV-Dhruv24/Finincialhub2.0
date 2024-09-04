// Function to calculate Indian tax based on the income
function calculateIndianTax(annualIncome) {
    let tax = 0;
    if (annualIncome <= 250000) {
        tax = 0;
    } else if (annualIncome <= 500000) {
        tax = (annualIncome - 250000) * 0.05;
    } else if (annualIncome <= 1000000) {
        tax = 12500 + (annualIncome - 500000) * 0.1;
    } else {
        tax = 12500 + 50000 + (annualIncome - 1000000) * 0.15;
    }
    return tax;
}

// Function to initialize and update charts
function initializeChart(ctx, type, labels, datasets) {
    return new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount (₹)'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return `${tooltipItem.dataset.label}: ₹${tooltipItem.raw}`;
                        }
                    }
                }
            }
        }
    });
}

// Function to load and render charts
function loadCharts() {
    const financialData = JSON.parse(localStorage.getItem('financialData'));

    if (!financialData) {
        handleInvalidData();
        return;
    }

    document.getElementById('userName').textContent = financialData.username;

    const chartsConfig = [
        {
            id: 'incomeVsExpenseChart',
            type: 'bar',
            labels: ['Income', 'Expenses'],
            datasets: [{
                label: 'Income vs Expenses',
                data: [financialData.monthlyIncome, financialData.expenses],
                backgroundColor: ['rgba(0, 123, 255, 0.6)', 'rgba(220, 53, 69, 0.6)']
            }]
        },
        {
            id: 'annualIncomeChart',
            type: 'bar',
            labels: ['Annual Income'],
            datasets: [{
                label: 'Annual Income',
                data: [financialData.monthlyIncome * 12],
                backgroundColor: 'rgba(40, 167, 69, 0.6)'
            }]
        },
        {
            id: 'taxAnalysisChart',
            type: 'bar',
            labels: ['Income', 'Tax'],
            datasets: [{
                label: 'Tax Analysis',
                data: [financialData.monthlyIncome * 12, calculateIndianTax(financialData.monthlyIncome * 12)],
                backgroundColor: ['rgba(0, 123, 255, 0.6)', 'rgba(255, 193, 7, 0.6)']
            }]
        },
        {
            id: 'incomeVsDebtChart',
            type: 'bar',
            labels: ['Income', 'Debt'],
            datasets: [{
                label: 'Income vs Debt',
                data: [financialData.monthlyIncome, financialData.currentDebt],
                backgroundColor: ['rgba(0, 123, 255, 0.6)', 'rgba(220, 53, 69, 0.6)']
            }]
        },
        {
            id: 'savingsVsGoalChart',
            type: 'bar',
            labels: ['Savings', 'Goal'],
            datasets: [{
                label: 'Savings vs Goal',
                data: [financialData.currentSavings, financialData.financialGoal],
                backgroundColor: ['rgba(0, 123, 255, 0.6)', 'rgba(255, 193, 7, 0.6)']
            }]
        },
        {
            id: 'dailyEarningChart',
            type: 'bar',
            labels: ['Daily Earning'],
            datasets: [{
                label: 'Daily Earning',
                data: [financialData.monthlyIncome / 30],
                backgroundColor: 'rgba(40, 167, 69, 0.6)'
            }]
        },
        {
            id: 'expensesBreakdownChart',
            type: 'bar',
            labels: ['Expenses'],
            datasets: [{
                label: 'Expenses Breakdown',
                data: [financialData.expenses],
                backgroundColor: 'rgba(220, 53, 69, 0.6)'
            }]
        }
    ];

    chartsConfig.forEach(config => {
        const ctx = document.getElementById(config.id).getContext('2d');
        initializeChart(ctx, config.type, config.labels, config.datasets);
    });

    loadSpendingComparisonChart(); // Call this function to render the spending comparison chart
}

// Function to load and render the spending comparison chart
let spendingChartInstance;

function loadSpendingComparisonChart() {
    const financialData = JSON.parse(localStorage.getItem('financialData'));

    if (!financialData) {
        handleInvalidData();
        return;
    }

    const averageSpending = {
        food: 10000,
        rent: 20000,
        transportation: 3000,
        entertainment: 5000,
    };

    const userSpending = {
        food: financialData.expenses * 0.4,
        rent: financialData.expenses * 0.5,
        transportation: financialData.expenses * 0.2,
        entertainment: financialData.expenses * 0.1
    };

    const ctx = document.getElementById('spendingComparisonChart').getContext('2d');

    if (spendingChartInstance) {
        spendingChartInstance.destroy();
    }

    spendingChartInstance = initializeChart(ctx, 'bar', Object.keys(averageSpending), [
        {
            label: 'Minimum Spending',
            data: Object.values(userSpending),
            backgroundColor: 'rgba(0, 123, 255, 0.5)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1
        },
        {
            label: 'Max Spending',
            data: Object.values(averageSpending),
            backgroundColor: 'rgba(255, 193, 7, 0.5)',
            borderColor: 'rgba(255, 193, 7, 1)',
            borderWidth: 1
        }
    ]);
}

// Handle form submissions and updates
function handleFormChange() {
    const username = document.getElementById('username').value;
    const monthlyIncome = parseFloat(document.getElementById('monthlyIncome').value);
    const expenses = parseFloat(document.getElementById('expenses').value);
    const currentSavings = parseFloat(document.getElementById('currentSavings').value);
    const financialGoal = parseFloat(document.getElementById('financialGoal').value);
    const currentDebt = parseFloat(document.getElementById('currentDebt').value);

    if (isNaN(monthlyIncome) || isNaN(expenses) || isNaN(currentSavings) || isNaN(financialGoal) || isNaN(currentDebt)) {
        handleInvalidData();
        return;
    }

    const financialData = {
        username,
        monthlyIncome,
        expenses,
        currentSavings,
        financialGoal,
        currentDebt
    };

    localStorage.setItem('financialData', JSON.stringify(financialData));
    loadCharts();
}

// Attach event listeners to form fields
document.querySelectorAll('#financialForm input').forEach(input => {
    input.addEventListener('input', handleFormChange);
});

// Handle form submission
document.getElementById('generateDashboardBtn').addEventListener('click', function () {
    handleFormChange();
});

// Load dashboard data on page load
window.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem('financialData')) {
        loadCharts();
    }
});

// Function to update the Report section
function updateReport() {
    const financialData = JSON.parse(localStorage.getItem('financialData'));

    if (!financialData) {
        console.error('No financial data found.');
        return;
    }

    // Calculate projected savings and net worth
    const projectedSavings = (financialData.currentSavings + (financialData.monthlyIncome - financialData.expenses) * 12).toFixed(2);
    const netWorth = (financialData.currentSavings - financialData.currentDebt).toFixed(2);
    const goalEfficiency = ((financialData.currentSavings / financialData.financialGoal) * 100).toFixed(2);

    // Update Report section with calculated values
    document.getElementById('projectedSavings').textContent = projectedSavings;
    document.getElementById('currentDebtDisplay').textContent = financialData.currentDebt.toFixed(2);
    document.getElementById('netWorthValue').textContent = netWorth;
    document.getElementById('reportIncome').textContent = financialData.monthlyIncome.toFixed(2);
    document.getElementById('reportExpenses').textContent = financialData.expenses.toFixed(2);
    document.getElementById('reportSavings').textContent = financialData.currentSavings.toFixed(2);
    document.getElementById('reportDebt').textContent = financialData.currentDebt.toFixed(2);
    document.getElementById('goalEfficiency').textContent = goalEfficiency;
}

// Function to handle report download
function downloadReport() {
    const financialData = JSON.parse(localStorage.getItem('financialData'));
    const reportContent = `
        Financial Report\n
        -----------------\n
        Username: ${financialData.username}\n
        Monthly Income: ₹${financialData.monthlyIncome}\n
        Expenses: ₹${financialData.expenses}\n
        Current Savings: ₹${financialData.currentSavings}\n
        Financial Goal: ₹${financialData.financialGoal}\n
        Current Debt: ₹${financialData.currentDebt}\n
        Projected Savings: ₹${(financialData.currentSavings + (financialData.monthlyIncome - financialData.expenses) * 12).toFixed(2)}\n
        Net Worth: ₹${(financialData.currentSavings - financialData.currentDebt).toFixed(2)}\n
        Goal Efficiency: ${((financialData.currentSavings / financialData.financialGoal) * 100).toFixed(2)}%\n
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'financial_report.txt';
    a.click();
    URL.revokeObjectURL(url);
}

// Ensure the Report section updates if data is available in local storage on page load
document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem('financialData')) {
        updateReport();
    }
});