# [Anime-merch-price-converter](https://github.com/fadeenk/Anime-merch-price-converter)
Converts prices from Japanese yen to popular currencies for amiami and mandarake. This scripts gets the conversion rates from [Yahoo Finance](https://finance.yahoo.com) daily.

## Installation
This is a user script and it needs a script manager extension for the browser

1. Install the user script manager
    * Chrome, Chromium: [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
    * Firefox: [greasemonkey](https://addons.mozilla.org/zh-TW/firefox/addon/greasemonkey/)
    * Opera: [Tampermonkey](https://addons.opera.com/zh-tw/extensions/details/tampermonkey-beta/?display=en)
    * Safari: [Tampermonkey](https://tampermonkey.net)
2. Install the script
	- From greasyfork
		1. Go to [https://greasyfork.org/en/scripts/11560-animemerchpriceconverter](https://greasyfork.org/en/scripts/11560-animemerchpriceconverter)
		2. Click `Install this script`
	- Directly from [here](https://github.com/fadeenk/Anime-merch-price-converter/raw/master/dist/AMPC.user.js)

## Usage:

Visit amiami or mandarake the script will automatically start, it defaults to US dollars. If you want to change the currency click on the green settings icon in the lower right icon.

## Screenshots

![screenshot_1](http://i.imgur.com/SETTxux.png)
![screenshot_2](http://i.imgur.com/HEm2RaY.jpg)
![screenshot_3](http://i.imgur.com/VjTkEDh.png)

## Issues

[https://github.com/fadeenk/Anime-merch-price-converter/issues](https://github.com/fadeenk/Anime-merch-price-converter/issues)

## Developers
If you are interested in improving this script feel free to fork and clone.

1. Install required packages by using the following command in the root directory  `npm install`
2. Do your magic
3. Build your code and test it `grunt build`
4. Once satisfied submit a pull request :)
