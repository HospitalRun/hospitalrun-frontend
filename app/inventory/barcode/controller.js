import Ember from 'ember';
export default Ember.ObjectController.extend({
  selectedPrinter: null,

  barcodeUri: function() {
    var id = this.get('model.id'),
      name = this.get('model.name');
    return Ember.$(document).JsBarcode(id, {
      width: 1,
      height: 20,
      fontSize: 10,
      displayValue: name,
      returnUri: true
    });
  }.property('id', 'name'),

  printers: function() {
    return dymo.label.framework.getTapePrinters();
  }.property(),

  havePrinters: function() {
    var printers = this.get('printers');
    if (printers.length > 0) {
      return true;
    } else {
      return false;
    }
  }.property('printers'),

  singlePrinter: function() {
    var printers = this.get('printers');
    if (printers.length === 1) {
      return true;
    } else {
      return false;
    }
  }.property('printers'),

  actions: {
    print: function() {
      var barcodeUri = this.get('barcodeUri'),
        selectedPrinter = this.get('selectedPrinter');
      if (!selectedPrinter) {
        selectedPrinter = this.get('printers')[0].name;
      }
      Ember.$.get('/dymo/BarcodeAsImage.label', function(labelXml) {
        var barcodeAsImageLabel = dymo.label.framework.openLabelXml(labelXml);
        var pngBase64 = barcodeUri.substr('data:image/png;base64,'.length);
        barcodeAsImageLabel.setObjectText('Image', pngBase64);
        barcodeAsImageLabel.print(selectedPrinter);
      }, 'text');
    }
  }

});
