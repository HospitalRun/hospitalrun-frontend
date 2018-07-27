import $ from 'jquery';
import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { equal, gt } from '@ember/object/computed';

export default Controller.extend({
  selectedPrinter: null,
  barcodeUri: computed('model.id', function() {
    return $(`#barcode-${this.get('model.id')}`).attr('src');
  }),
  printers: computed(function() {
    return dymo.label.framework.getTapePrinters();
  }),
  havePrinters: gt('printers.length', 0),
  singlePrinter: equal('printers.length', 1),
  actions: {
    print() {
      let barcodeUri = this.get('barcodeUri');
      let selectedPrinter = this.get('selectedPrinter');
      if (!selectedPrinter) {
        selectedPrinter = this.get('printers')[0].name;
      }
      $.get('/dymo/BarcodeAsImage.label', function(labelXml) {
        let barcodeAsImageLabel = dymo.label.framework.openLabelXml(labelXml);
        let pngBase64 = barcodeUri.substr('data:image/png;base64,'.length)
        barcodeAsImageLabel.setObjectText('Image', pngBase64);
        barcodeAsImageLabel.print(selectedPrinter);
      }, 'text');
    }
  }

});
