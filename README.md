# [Anime-merch-price-converter](https://github.com/fadeenk/Anime-merch-price-converter)
Converts prices from Japanese yen to popular currencies for the popular anime merchandise websites. This scripts gets the conversion rates from [Yahoo Finance](https://finance.yahoo.com) daily.

|Supported Sites|Supported Currencies
|:-:|:-:
|amiami|US Dollar
|mandarake|Euro
|myfigurecollection (MFC)|British Pound
|HobbySearch|Canadian Dollar
|Jungle|Swiss Franc
|Good Smile Online Shop|Australia Dollar
|Big in Japan| Mexican Pesos

## Features
* Works automatically (No setup required other than having a user script manager)
* Configurable through settings panel (lower right corner)
* Easy to switch between currency
* Easy to change colors to match your taste
* Settings are global and shared between the Different sites

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

## Screenshots

![screenshot_1](http://i.imgur.com/jzVl8ez.png)
![screenshot_2](http://i.imgur.com/oA5Uopg.png)
![screenshot_3](http://i.imgur.com/65ZHzha.png)
![screenshot_4](http://i.imgur.com/pRYejdv.png)
![screenshot_5](http://i.imgur.com/vEZmX65.png)
![screenshot_6](http://i.imgur.com/4QrjRZJ.png)

## Issues

[https://github.com/fadeenk/Anime-merch-price-converter/issues](https://github.com/fadeenk/Anime-merch-price-converter/issues)

## Developers
If you are interested in improving this script feel free to fork and clone.

1. Install required packages by using the following command in the root directory  `npm install`
2. Do your magic
3. Build your code and test it `grunt build`
4. Once satisfied submit a pull request :)

## Release History
* Sep 5, 2015   v1.0.1   Added Mexican Pesos support
* Aug 8, 2015   v1.0.0   Improved styling to better fit different websites, Styles are not configurable through the settings panel. Added global shared variables for the currency and styles. Improved code readability. Settings Panel is more organized and fully responsive. Changed $ to jQuery to avoid conflict with $ on goodsmile. And added more websites and currencies.
* Aug 7, 2015   v0.5.4   Added support for myfigurecollection (MFC) and implemented a new system for detecting prices on different sites
* Aug 7, 2015   v0.5.3   Fixed issue where setUpSettings function was not injected into the page and updated descriptions
* Aug 7, 2015   v0.5.2   Changed the way styles were injected to the page
* Aug 7, 2015   v0.5.1   Removed uglify and added support for userscripts (greasyfork)
* Aug 7, 2015   v0.5.0   Initial Release works only on amiami and mandarake and converts to Euro and American Dollars
