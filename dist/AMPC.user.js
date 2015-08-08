// ==UserScript==
// @name        AnimeMerchPriceConverter
// @namespace   http://mrkannah.com
// @description Converts prices from Japanese yen to popular currencies for amiami and mandarake. This scripts gets the conversion rates from Yahoo Finance daily.
// @include     http://slist.amiami.com/top/search/*
// @include     http://www.amiami.com/*
// @include     http://order.mandarake.co.jp/*
// @grant       GM_setValue
// @license     GPL-3.0
// @author      Fadee Kannah
// @grant       GM_getValue
// @grant       GM_addStyle
// @version     0.5.3
// @require     http://code.jquery.com/jquery-2.1.3.min.js
// ==/UserScript==

/*
Copyright (C) 2015  Fadee Kannah

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

//avoid jquery conflict
this.$ = this.jQuery = jQuery.noConflict(true);

var currentUnit = localStorage.getItem('currentUnit') || 'USD';
var conversionDate = GM_getValue(currentUnit+'.date') || 0;
var now = Date.now();

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

injectJs(applyConversions);

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
        return $(this).clone().children().remove()
        .end().text().replace( /\D+/g, '');
    };

    var UNITS = {
        USD:{symbol:'$',name:'US Dollar'},
        EUR:{symbol:'€',name:'Euro'}
    };

    //generates and configures the settings page
    setUpSettings(currentUnit, UNITS);

    //get conversion rate
    var conversion = parseFloat(localStorage.getItem(currentUnit+'.rate'));

    //find the prices
    var prices = $('li.product_price, li.selling_price:first, li.price, div.basicinfo dl :nth-child(6) p, div.price > p');
    for(var i =0; i<prices.length;i++){
        var price=$(prices[i]).justNumber();
        //multiply by the magic number
        var convertedPrice = (price * conversion).toFixed(2);
        $(prices[i]).append('<p class="convertedPrice">'+UNITS[currentUnit].symbol + convertedPrice + '</p>');
    }
}

//add settings icon
var img = document.createElement( 'img' );
img.setAttribute('src','http://png-5.findicons.com/files/icons/949/token/256/gear.png');
img.setAttribute('class','settings');
img.setAttribute('id','AMPCsettings');
$('body').append(img);

//icon click handler
$( '#AMPCsettings' ).click(function() {
 $('#settingsPanel').show();
});

injectJs(setUpSettings);

function setUpSettings(currentUnit, UNITS){
  //generate the options to select from
  var options='';
  for(var unit in UNITS){
      options += '<option value="'+unit+'">'+UNITS[unit].name+' ('+unit+')</option>';
  }

  $( 'body' ).append('<div id="settingsPanel"><span style="float:right;margin-top: -10px;margin-right: -5px;">X</span><h1 style="text-align: center;font-size: 24px;font-weight: 500;">AMPC Settings</h1>Select your currency: <select class="UNITS">'+options+'</select><br><button id="update">Update</button></div></div>');
  $('.UNITS').val(currentUnit); //sets the option to the current option
  $('#settingsPanel').hide(); //hide settings page
  $( '#update' ).click(function() { //update handler
    localStorage.setItem('currentUnit',$('.UNITS').val());
   location.reload(true);
  });
  $( '#settingsPanel span' ).click(function() { //close settings handler
   $('#settingsPanel').hide();
  });
}


//adds the style for converted Price
GM_addStyle('.convertedPrice{background-color: #57C553;border-radius: 7px;text-align: center;border: 4px solid #f4f4f4;box-shadow: 0 2px 2px rgba(0,0,0,.18);font-size: 20px;color: #fff;font-weight: 600;display: block;margin-left: auto !important;margin-right: auto !important;width:100px;}');

//settings icon
GM_addStyle('.settings{position: fixed;bottom: 10px;right: 10px;width: 40px;background: #57C553;border-radius: 50px;z-index: 100;};');

//settings panel
GM_addStyle('#settingsPanel{z-index: 100;position: fixed;top: 100px;width: 80%;background: #57C553;border-radius: 10px;left: 50%;margin: 0 0 0 -40%;border: 6px solid #f4f4f4;box-shadow: 0 2px 2px rgba(0,0,0,.18);color:#FFF;padding:10px;text-align: center;};');
