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
