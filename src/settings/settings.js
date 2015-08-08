//add styles
var css = '.settings{position: fixed;bottom: 10px;right: 10px;width: 40px;background: #57C553;border-radius: 50px;z-index: 100;};';
var style = document.createElement('style');
style.appendChild(document.createTextNode(css));
document.getElementsByTagName('head')[0].appendChild(style);

var css = '#settingsPanel{z-index: 100;position: fixed;top: 100px;width: 80%;background: #57C553;border-radius: 10px;left: 50%;margin: 0 0 0 -40%;border: 6px solid #f4f4f4;box-shadow: 0 2px 2px rgba(0,0,0,.18);color:#FFF;padding:10px;text-align: center;};';
var style = document.createElement('style');
style.appendChild(document.createTextNode(css));
document.getElementsByTagName('head')[0].appendChild(style);

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
