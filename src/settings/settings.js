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
