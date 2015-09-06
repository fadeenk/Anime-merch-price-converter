//avoid jquery conflict
this.$ = this.jQuery = jQuery.noConflict(true);

//load variables from script if does not exists loads defaults
var conversionDate = GM_getValue(currentUnit+'.date') || 0;
var currentUnit = GM_getValue('currentUnit') || 'USD';
var color = GM_getValue('color') || '#57C553';
var border = GM_getValue('border') || '#f4f4f4';
var font = GM_getValue('font') || '#FFFFFF';
var now = Date.now();
var UNITS = {
    USD:{symbol:'$',name:'US Dollar'},
    EUR:{symbol:'€',name:'Euro'},
    GBP:{symbol:'£',name:'British Pound'},
    CAD:{symbol:'$',name:'Canadian Dollar'},
    CHF:{symbol:'',name:'Swiss Franc'},
    AUD:{symbol:'$',name:'Australia Dollar'},
    MXN:{symbol:'$',name:'Mexican Pesos'},    
};

//check the script and localstorage for the conversion rate and date
//the script stores the values so they sync between different sites
//because the rate is returned through a callback, it executes on the page rather than the script which means that the function only has access to localstorage
//the following mess of checks ensures that the date is synced
if(GM_getValue(currentUnit+'.rate') && localStorage.getItem(currentUnit+'.rate')){
    if(parseInt(localStorage.getItem(currentUnit+'.date')) < conversionDate){
        localStorage.setItem(currentUnit+'.rate', GM_getValue(currentUnit+'.rate'));
        localStorage.setItem(currentUnit+'.date', conversionDate);
    }
    else if(parseInt(localStorage.getItem(currentUnit+'.date')) > conversionDate){
        GM_setValue(currentUnit+'.rate', localStorage.getItem(currentUnit+'.rate'));
        GM_setValue(currentUnit+'.date', localStorage.getItem(currentUnit+'.date'));
    }
}
else if(GM_getValue(currentUnit+'.rate')){
    localStorage.setItem(currentUnit+'.rate', GM_getValue(currentUnit+'.rate'));
    localStorage.setItem(currentUnit+'.date', conversionDate);
}
else if(localStorage.getItem(currentUnit+'.rate')){
    GM_setValue(currentUnit+'.rate', localStorage.getItem(currentUnit+'.rate'));
}

//check if it has been a day since last conversion rate update for the current preferred currency
if(now - conversionDate > 60000 * 60 * 24){
    injectJs(parseExchangeRate); //inject the parse function
    getRate('JPY',currentUnit); //request rate
}else{
    applyConversions(currentUnit);
}
//inject the scripts into the page (thoes function execute on the page scope rather than the tampermonkey scope)
injectJs(getPrices);
injectJs(applyConversions);
injectJs('var UNITS = '+JSON.stringify(UNITS));

//generates and configures the settings page
setUpSettings(currentUnit, UNITS);

//inject js functions to the page so it can run on the page rather than the script
function injectJs(JS) {
    var script = document.createElement('script');
    script.appendChild(document.createTextNode(JS));
    document.getElementsByTagName('head')[0].appendChild(script);
}

//gets the rate from yahoo's finance exchange rate api
function getRate(from, to) {
    var script = document.createElement('script');
    script.setAttribute('src', 'http://query.yahooapis.com/v1/public/yql?q=select%20rate%2Cname%20from%20csv%20where%20url%3D"http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes%3Fs%3D'+from+to+'%253DX%26f%3Dl1n"%20and%20columns%3D"rate%2Cname"&format=json&callback=parseExchangeRate');
    document.body.appendChild(script);
    localStorage.setItem(currentUnit+'.date', now);
}

//parses the rate returned and calls apply conversions
function parseExchangeRate(data) {
    var rate = parseFloat(data.query.results.row.rate, 10);
    var currentUnit = data.query.results.row.name.split('/')[1];
    localStorage.setItem(currentUnit+'.rate', rate);
    applyConversions(currentUnit);
}


//actually converts the prices and adds them to our page
function applyConversions(currentUnit) {
    //cleans up the html content to only return the cost as a number
    jQuery.fn.justNumber = function() {
        return jQuery(this).clone().children().remove()
        .end().text().replace( /\D+/g, '');
    };

    //get conversion rate
    var conversion = parseFloat(localStorage.getItem(currentUnit+'.rate'));
    var prices = getPrices();
    for(var i =0; i<prices.length;i++){
        var price=jQuery(prices[i]).justNumber();
        //multiply by the magic number
        var convertedPrice = (price * conversion).toFixed(2);
        jQuery(prices[i]).append('<p class="convertedPrice">'+UNITS[currentUnit].symbol + convertedPrice + '</p>');
    }
}
