import Freecurrencyapi from './node_modules/@everapi/freecurrencyapi-js/index.js';


const freecurrencyapi = new Freecurrencyapi("cur_live_pNo7vl0mhoseoBjMxotDoQ9UPuIO4Eu3HcWC03qj");
console.log(freecurrencyapi.baseUrl)
freecurrencyapi.latest({
    base_currency: 'USD',
    currencies: 'EUR'
}).then(response => {
    console.log(response);
});