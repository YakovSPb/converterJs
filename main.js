const elementUSD = document.querySelector('[data-value="USD"]')
const elementEUR = document.querySelector('[data-value="EUR"]')
const selectConverter = document.getElementById('select')
const inputConverter = document.getElementById('input')
const btnFavorite = document.querySelector('.add_btn')
const resultConverter = document.getElementById('result')
const header = document.querySelector('.header')
const resertBtn = document.querySelector('.btn_reset')


async function getCurrencies() {
    const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js')
    const rates = await response.json().then(data=> data.Valute)


    elementUSD.textContent = rates.USD.Value.toFixed(2)
    elementEUR.textContent = rates.EUR.Value.toFixed(2)

    rates.USD.Value <  rates.USD.Previous ? elementUSD.classList.add('top') : elementUSD.classList.add('bottom')
    rates.EUR.Value <  rates.EUR.Previous ? elementEUR.classList.add('top') : elementEUR.classList.add('bottom')



    let htmlConverter = ''
        for (let e in rates){
            htmlConverter  += `
            <option>${e}</option>
            `
            }
    selectConverter.innerHTML = htmlConverter



    inputConverter.oninput = convertValue
    selectConverter.oninput = convertValue

        function convertValue () {
           let result = (parseFloat(inputConverter.value) / rates[selectConverter.value].Value).toFixed((2))
            resultConverter.value = result
        }

    btnFavorite.addEventListener('click', function() {
        let value = selectConverter.value;
        putFavorite(value)
        setHeader(rates)
    })

    setTimeout(setHeader(rates), 1000)
}
getCurrencies()


function getFavorite() {
    const productsLocalStorage = localStorage.getItem("value")
    if (productsLocalStorage !== null){
      return JSON.parse(productsLocalStorage)
    }
    return [];
}

function putFavorite(valute) {
    let favorites = getFavorite()
    const index = favorites.indexOf(valute)

    if(index === -1) {
        favorites.push(valute)
    }

    localStorage.setItem('value',JSON.stringify(favorites))
}




function setHeader(rates) {
    let favorites = getFavorite()
    let htmlHeader = ''

    favorites.forEach(element=>{
        let searchValue = element;
        let value = rates[`${searchValue}`].Value.toFixed(2)

        htmlHeader += `
        <div class="fav_item">
            <div class="fav_item__name"><b>${searchValue}</b></div> - <div class="fav_item__value">${value}</div>
        </div>
        `;
    })

    header.innerHTML = htmlHeader;

}



resertBtn.addEventListener('click', function(){
    localStorage.clear()
    header.innerHTML = '';
})


