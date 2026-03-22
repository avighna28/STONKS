const usdInput = document.getElementById('usd-amount');
const inrOutput = document.getElementById('inr-amount');
const exchangeRateInfo = document.getElementById('exchange-rate-info');
const refreshBtn = document.getElementById('refresh-btn');

let exchangeRate = 0;

// Fetch exchange rate from API
async function fetchExchangeRate() {
    exchangeRateInfo.textContent = "Fetching rates... 🌐";
    exchangeRateInfo.classList.add('calculating');

    try {
        const url = "https://api.exchangerate-api.com/v4/latest/USD";
        const response = await fetch(url);
        if (!response.ok) throw new Error("Market issues!");
        
        const data = await response.json();
        exchangeRate = data.rates.INR;
        
        exchangeRateInfo.textContent = `1 USD = ₹${exchangeRate.toFixed(2)} (Bussin'!)`;
        exchangeRateInfo.classList.remove('calculating');
        
        // Trigger calculation if there's already a value in input
        calculateINR();
    } catch (error) {
        console.error("Fetch error:", error);
        exchangeRateInfo.textContent = "Error fetching rates! Market is tripping. 💀";
        exchangeRateInfo.classList.remove('calculating');
    }
}

// Calculate INR based on USD input
function calculateINR() {
    const usdVal = parseFloat(usdInput.value);
    
    if (isNaN(usdVal) || usdVal < 0) {
        inrOutput.value = "";
        inrOutput.placeholder = "Enter amount...";
        return;
    }

    if (exchangeRate === 0) {
        inrOutput.value = "Fetching...";
        return;
    }

    const result = usdVal * exchangeRate;
    
    // Smoothly update the value with a small animation/delay feel
    animateValue(result);
}

// Animate the result for extra Gen Z flair
function animateValue(value) {
    const startValue = parseFloat(inrOutput.value.replace(/,/g, '')) || 0;
    const duration = 500; // 500ms
    const startTime = performance.now();

    function step(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const currentAmount = progress * (value - startValue) + startValue;
        
        inrOutput.value = currentAmount.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

// Event Listeners
usdInput.addEventListener('input', calculateINR);

refreshBtn.addEventListener('click', () => {
    // Add a spin animation to the icon
    refreshBtn.style.animation = "none";
    void refreshBtn.offsetWidth; // trigger reflow
    refreshBtn.style.animation = "spin 1s ease";
    fetchExchangeRate();
});

// Auto-fetch on load
window.addEventListener('load', fetchExchangeRate);
