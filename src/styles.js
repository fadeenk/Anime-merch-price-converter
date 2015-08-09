
//adds the style for converted Price
GM_addStyle('.convertedPrice{background:'+color+';border-radius: 7px;text-align: center;border: 2px solid '+border+';color: '+font+';font-weight: 600;display: inline-block;padding: 0 3px;}');

//settings icon
GM_addStyle('.settings{position: fixed;bottom: 10px;right: 10px;width: 40px;background: '+color+';border-radius: 50px;z-index: 100;};');

//settings panel
GM_addStyle('#settingsPanel{z-index: 100;position: fixed;top: 100px;background: '+color+';border-radius: 10px;left: 50%;transform: translate(-50%, 0);border: 3px solid '+border+';box-shadow: 0 2px 2px rgba(0,0,0,.18);color:'+font+';padding:10px;text-align: center;};');
GM_addStyle('#settingsPanel span{margin-top: 4px;float:left;} #settingsPanel input{float:right;} #settingsPanel br{clear:both;}');
