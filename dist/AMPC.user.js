// ==UserScript==
// @name        AnimeMerchPriceConverter
// @namespace   http://mrkannah.com
// @description Converts prices from Japanese yen to popular currencies for amiami, mandarake, myfigurecollection (MFC), HobbySearch, Jungle, Good Smile Online Shop, and Big in Japan. This scripts gets the conversion rates from Yahoo Finance daily.
// @version     1.0.2
// @author      Fadee Kannah
// @license     GPL-3.0
// @include     http://slist.amiami.com/top/search/*
// @include     http://www.amiami.com/*
// @include     http://myfigurecollection.net/item/*
// @include     http://order.mandarake.co.jp/*
// @include     http://www.1999.co.jp/eng/*
// @include     http://jungle-scs.co.jp/sale_en/*
// @include     http://goodsmile-global.ecq.sc/*
// @include     http://biginjap.com/*
// @include     https://slist.amiami.com/top/search/*
// @include     https://www.amiami.com/*
// @include     https://myfigurecollection.net/item/*
// @include     https://order.mandarake.co.jp/*
// @include     https://www.1999.co.jp/eng/*
// @include     https://jungle-scs.co.jp/sale_en/*
// @include     https://goodsmile-global.ecq.sc/*
// @include     https://biginjap.com/*
// @require     http://code.jquery.com/jquery-2.1.3.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
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

//add settings icon
var img = document.createElement( 'img' );
img.setAttribute('src','http://png-5.findicons.com/files/icons/949/token/256/gear.png');
img.setAttribute('class','settings');
img.setAttribute('id','AMPCsettings');
jQuery('body').append(img);

//icon click handler
jQuery( '#AMPCsettings' ).click(function() {
 jQuery('#settingsPanel').show();
});

function setUpSettings(currentUnit, UNITS){
  //generate the options to select from
  var options='';
  for(var unit in UNITS){
      options += '<option value="'+unit+'">'+UNITS[unit].name+' ('+unit+')</option>';
  }

  jQuery( 'body' ).append('<div id="settingsPanel"><span style="float:right;margin-top: -8px;margin-right: -5px;">X</span><h1 style="text-align: center;">AMPC Settings</h1>Currency: <select class="UNITS">'+options+'</select><h2>Styles</h2><span>Background Color: </span><input id="color" type="color"/><br/><span>Border Color: </span><input id="border" type="color"/><br/><span>Font Color: </span><input id="font" type="color"/><br/><br/><button id="update">Update</button></div></div>');
  //sets the settings page to the current options
  jQuery('.UNITS').val(currentUnit);
  jQuery('#color').val(color);
  jQuery('#border').val(border);
  jQuery('#font').val(font);
  //hide settings page
  jQuery('#settingsPanel').hide();
  //update handler
  jQuery( '#update' ).click(function() {
    GM_setValue('currentUnit',jQuery('.UNITS').val());
    GM_setValue('color',jQuery('#color').val());
    GM_setValue('font',jQuery('#font').val());
    GM_setValue('border',jQuery('#border').val());
    location.reload(true);
  });
  //color change handlers
  jQuery( '#color' ).change(function() {
    jQuery('#settingsPanel,.settings,.convertedPrice').css('background', jQuery('#color').val());
  });
  jQuery( '#font' ).change(function() {
    jQuery('#settingsPanel,.settings,.convertedPrice').css('color', jQuery('#font').val());
  });
  jQuery( '#border' ).change(function() {
    jQuery('#settingsPanel,.settings,.convertedPrice').css('border-color', jQuery('#border').val());
  });
  //close settings handler
  jQuery( '#settingsPanel span' ).click(function() {
   jQuery('#settingsPanel').hide();
  });
}

function getPrices(){
  //returns the elements that have the prices on them
  if(window.location.href.indexOf('myfigurecollection.net/') > -1) {
     return jQuery('.sd:first li label:contains("Price")').closest('li').children( 'div' );
  }
  else if(window.location.href.indexOf('www.1999.co.jp/eng') > -1) {
    return jQuery('[id^=masterBody_ProductList_lvProductListTop_lblPrice]');
  }
  else if(window.location.href.indexOf('jungle-scs.co.jp/') > -1 || window.location.href.indexOf('goodsmile-global.ecq.sc/') > -1) {
    return jQuery('.price');
  }
  else if(window.location.href.indexOf('biginjap.com/') > -1 ) {
    return jQuery('.price, #our_price_display');
  }
  else if(window.location.href.indexOf('order.mandarake.co.jp/') > -1 ) {
    return jQuery('div.basicinfo dl :nth-child(6) p, div.price > p');
  }
  else{
    return jQuery('li.product_price, li.selling_price:first, li.price');
  }
}


//adds the style for converted Price
GM_addStyle('.convertedPrice{background:'+color+';border-radius: 7px;text-align: center;border: 2px solid '+border+';color: '+font+';font-weight: 600;display: inline-block;padding: 0 3px;}');

//settings icon
GM_addStyle('.settings{position: fixed;bottom: 10px;right: 10px;width: 40px;background: '+color+';border-radius: 50px;z-index: 100;};');

//settings panel
GM_addStyle('#settingsPanel{z-index: 100;position: fixed;top: 100px;background: '+color+';border-radius: 10px;left: 50%;transform: translate(-50%, 0);border: 3px solid '+border+';box-shadow: 0 2px 2px rgba(0,0,0,.18);color:'+font+';padding:10px;text-align: center;};');
GM_addStyle('#settingsPanel span{margin-top: 4px;float:left;} #settingsPanel input{float:right;} #settingsPanel br{clear:both;}');
