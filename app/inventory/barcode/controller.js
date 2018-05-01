import $ from 'jquery';
import Controller from '@ember/controller';
export default Controller.extend({
  selectedPrinter: null,

  barcodeUri: function() {
    let id = this.get('model.id');
    let name = this.get('model.name');

    /* eslint new-cap: ['error', { 'capIsNew': false }]  */
    return $(document).JsBarcode(id, {
      width: 1,
      height: 20,
      fontSize: 10,
      displayValue: name,
      returnUri: true
    });
  }.property('model.id', 'model.name'),

  printers: function() {
    return dymo.label.framework.getTapePrinters();
  }.property(),

  havePrinters: function() {
    let printers = this.get('printers');
    if (printers.length > 0) {
      return true;
    } else {
      return false;
    }
  }.property('printers'),

  singlePrinter: function() {
    let printers = this.get('printers');
    if (printers.length === 1) {
      return true;
    } else {
      return false;
    }
  }.property('printers'),

  actions: {
    print() {
      let barcodeUri = this.get('barcodeUri');
      let selectedPrinter = this.get('selectedPrinter');
      if (!selectedPrinter) {
        selectedPrinter = this.get('printers')[0].name;
      }
      $.get('/dymo/BarcodeAsImage.label', function(labelXml) {
        let barcodeAsImageLabel = dymo.label.framework.openLabelXml(labelXml);
        let pngBase64 = barcodeUri.substr('data:image/png;base64,'.length);
        barcodeAsImageLabel.setObjectText('Image', pngBase64);
        barcodeAsImageLabel.print(selectedPrinter);
      }, 'text');
    }
  }

});
