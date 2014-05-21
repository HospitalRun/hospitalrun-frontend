Introduction
----
JsBarcode is a simple way to create different types of 1d barcodes.  
The plugin uses Html5Canvas to generate draw the barcodes

#### This is the list of supported barcodes:
*  CODE128 (B)
*  EAN (13)
*  UPC-A
*  CODE39
*  ITF14

Use
----
####A Html5Canvas barcode generator is included to draw the barcodes.
````javascript
$(object).JsBarcode(string,options);
````
####Where:
*  string is the sring to be encoded to the barcode
*  options is additional options put in an object (look below)

####The default options:
````javascript
{
	displayValue: true, //True to display the encoded string; false to hide; other values get printed
	fontFace: 'arial', //Font face to use for the display value
	fontSize: 12, //Font size to use for the display value    
	width:	2, //Width of barcode lines
	height:	100, //Height of barcode
	quiet: 10, //Barcode quiet zone
	format:	"CODE128" //Barcode format
}
````


Examples
----

####First we need an image
````html
<img id="barcode">
````

#### This code:
````javascript
$("#barcode").JsBarcode("Hi!");
````

#### Will generate this image:
![Result](http://i.imgur.com/eSKThTK.png)
  
  
  
#### This code:
````javascript
$("#barcode").JsBarcode("Javascript is fun!",{width:1,height:25});
````
#### Will generate this image:
![Result](http://i.imgur.com/sD9Ougw.png)
  
  
  
#### This code:
````javascript
$("#barcode").JsBarcode("9780199532179",{format:"EAN"});
````
#### Will generate this image:
![Result](http://i.imgur.com/ntpr27d.png)
  
  
  
#### This code:
````javascript
setInterval(function(){
	var date = new Date();
	$("#barcode").JsBarcode(date.getHours()+":"+date.getMinutes()+":"+date.getSeconds());
},1000);
````
#### Will create a barcode clock:
[Click here to see it](http://fleo.se/barcode/example/barcodeClock.html)



Minify the latest code
----
Use the [closure compiler](http://closure-compiler.appspot.com/home) with this input
````
// ==ClosureCompiler==
// @output_file_name JsBarcode.all.min.js
// @code_url https://raw.github.com/hospitalrun/JsBarcode/master/CODE39.js
// @code_url https://raw.github.com/hospitalrun/JsBarcode/master/CODE128.js
// @code_url https://raw.github.com/hospitalrun/JsBarcode/master/EAN_UPC.js
// @code_url https://raw.github.com/hospitalrun/JsBarcode/master/ITF14.js
// @code_url https://raw.github.com/hospitalrun/JsBarcode/master/JsBarcode.js
// ==/ClosureCompiler==
````
