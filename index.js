import Freecurrencyapi from './node_modules/@everapi/freecurrencyapi-js/index.js';


// Freecurrencyapi instance
const freecurrencyapi = new Freecurrencyapi("fca_live_hxWwg1IV3tRaUrBRwZtvb2RX2RsCSORhZCtUOpsa");

function fetchCurrencies() {
    freecurrencyapi.currencies().then(response => {
        const currencySelectFrom = document.getElementById('currency-select-from');
        const currencySelectTo = document.getElementById('currency-select-to');
        const currencySymbolGet = document.getElementById('symbol-get')
        const currencySymbolHave = document.getElementById('symbol-have')
        const currencies = response.data;
        // console.log(currencies.AUD.name)
       
        // 'from' select
        Object.keys(currencies).forEach(currencyCode => {
            const option = document.createElement('option');
            option.value = currencyCode;
            option.textContent = currencyCode;
            currencySelectFrom.appendChild(option);
        });
        currencySelectFrom.addEventListener('change', () => {
            const selectedCurrencyCode = currencySelectFrom.value;
            const currency = currencies[selectedCurrencyCode];
            if (currency) {
                currencySymbolHave.textContent = `${currency.name}`;
            }
        });
        
        
        // 'to' select
        Object.keys(currencies).forEach(currencyCode => {
            const option = document.createElement('option');
            option.value = currencyCode;
            option.textContent = currencyCode;
            currencySelectTo.appendChild(option);
        });
        
       
        currencySelectTo.addEventListener('change', () => {
            const selectedCurrencyCode = currencySelectTo.value;
            const currency = currencies[selectedCurrencyCode];
            if (currency) {
                currencySymbolGet.textContent = `${currency.name}`;
            }
        });
        
    }).catch(error => {
        console.error("Error fetching currencies:", error);
    });
}

fetchCurrencies();




//DOM elements

const convertButton = document.querySelector('.exchange-btn');
const youHaveElement = document.querySelector('.converter-have-number');
const youGetElement = document.getElementById('youget');
const inputElement1 = document.getElementById('number');
const currencySelectFrom = document.getElementById('currency-select-from');
const currencySelectTo = document.getElementById('currency-select-to');


//"Convert Currency" button

convertButton.addEventListener('click', () => {
    const amount = parseFloat(inputElement1.value.replace(/,/g, ''));
    console.log(amount)

    const fromCurrency = currencySelectFrom.value;
    const toCurrency = currencySelectTo.value;  // Target currency
    
    console.log(currencySelectTo.value)
    
    freecurrencyapi.latest({
        base_currency: fromCurrency, 
        currencies: toCurrency       
    }).then(response => {
       
        let conversionRate = response.data[toCurrency];
        console.log("Conversion Rate:", conversionRate);

        conversionRate = parseFloat(conversionRate.toFixed(3));
       
       
        if (!conversionRate || isNaN(conversionRate)) {
            console.error("Invalid conversion rate received.");
            return;
        }

       
        const convertedAmount = Math.round(amount * conversionRate); 
        console.log("Converted Amount:", convertedAmount); 
        
      
        saveConversionHistory(amount, fromCurrency, convertedAmount, toCurrency);

        
        youGetElement.textContent = convertedAmount;
    }).catch(error => {
        console.error("Error fetching conversion rate:", error);
    });
});



function saveConversionHistory(amount, fromCurrency, convertedAmount, toCurrency) {
    const history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
    
    
    const newEntry = {
        id: Date.now(),
        amount,
        fromCurrency,
        convertedAmount,
        toCurrency,
      
    };

   
    history.push(newEntry);

   
    localStorage.setItem('conversionHistory', JSON.stringify(history));

   
    updateHistorySection();
}


function updateHistorySection() {
    const historySection = document.querySelector('.history');
    const historyTrackContainer = historySection.querySelector('.history-hap');
    const history = JSON.parse(localStorage.getItem('conversionHistory')) || [];

   
    historyTrackContainer.innerHTML = '';

  
    history.forEach(entry => {
        const historyDiv = document.createElement('div');
        historyDiv.classList.add('history-track');

        historyDiv.innerHTML = `
            <div class='history-sec'>
            <div class="currency-number">
                <p class="currency-num">${entry.amount}</p>
                <p class="currency-history-usd">${entry.fromCurrency}</p>
                <img src="assets/arrowright.svg" alt="">
                <p class="currency-num">${entry.convertedAmount}</p>
                <p class="currency-history-usd">${entry.toCurrency}</p>
            </div>
            <img src="assets/cancel.svg" alt="cancel" class="cancel-img" data-id="${entry.id}">

            </div>
        `;
      
        historyTrackContainer.appendChild(historyDiv);
       
        
    });
     

     document.querySelectorAll('.cancel-img').forEach(cancelBtn => {
        cancelBtn.addEventListener('click', clearHistoryById);
    });
}

function clearAllHistory(){
    const clearBtn = document.querySelector('.clear-btn')
    clearBtn.addEventListener('click', ()=>{
        console.log('clearall')
        localStorage.clear()
    })
}

function clearHistoryById(event) {
    const entryId = event.target.getAttribute('data-id'); 
    let history = JSON.parse(localStorage.getItem('conversionHistory')) || [];
    console.log("Entry ID to delete:", entryId);
    
    history = history.filter(entry => entry.id != entryId);

   
    localStorage.setItem('conversionHistory', JSON.stringify(history));

    
    updateHistorySection();
}

document.addEventListener('DOMContentLoaded', () => {
    updateHistorySection();  
});


updateHistorySection();
clearAllHistory()





