// tools.js - Budget calculator functionality

document.addEventListener('DOMContentLoaded', () => {
  const calculateBtn = document.getElementById('calculateBtn');
  calculateBtn.addEventListener('click', calculateBudget);
});

function calculateBudget() {
  const income = parseFloat(document.getElementById('income').value) || 0;
  const rent = parseFloat(document.getElementById('rent').value) || 0;
  const otherCosts = parseFloat(document.getElementById('otherCosts').value) || 0;

  const totalCosts = rent + otherCosts;
  const rentPercentage = income > 0 ? (rent / income) * 100 : 0;

  let recommendation = '';
  if (rentPercentage <= 40) {
    recommendation = 'OK - Rozpočet vypadá dobře.';
  } else {
    recommendation = 'Rizikové - Nájem přesahuje 40% příjmu.';
  }

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `
    <p class="text-lg font-semibold">Celkové náklady: ${totalCosts} Kč</p>
    <p class="text-lg">Nájem tvoří ${rentPercentage.toFixed(1)}% příjmu</p>
    <p class="text-lg font-semibold ${rentPercentage <= 40 ? 'text-green-600' : 'text-red-600'}">${recommendation}</p>
  `;
}