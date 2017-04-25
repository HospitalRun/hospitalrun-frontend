import Ember from 'ember';
import InputComponent from 'ember-rapid-forms/components/em-input';

const { isEmpty } = Ember;

export default InputComponent.extend({
  fileInputEl: null,
  isImage: true,
  resizeFile: true,
  selectedFile: null,
  type: 'file',

  _fileChanged() {
    let inputEl = this.get('fileInputEl');
    let resize = this.get('resizeFile');

    if (!isEmpty(inputEl.files[0]) && resize) {
      // Derived from https://github.com/josefrichter/resize/blob/master/public/preprocess.js
      let blobURL = window.URL.createObjectURL(inputEl.files[0]); // and get it's URL
      // helper Image object
      let image = new Image();
      image.src = blobURL;
      image.addEventListener('load', function() {
        window.URL.revokeObjectURL(blobURL);
        // have to wait till it's loaded
        this.set('selectedFile', this._resizeImage(image)); // send it to canvas
        this.set('isImage', true);
      }.bind(this));
      image.addEventListener('error', function() {
        // if image load fails, file probably isn't an image, so don't resize
        window.URL.revokeObjectURL(blobURL);
        this.set('selectedFile', inputEl.files[0]);
        this.set('isImage', false);
      }.bind(this));
    } else {
      this.set('isImage', false);
      this.set('selectedFile', inputEl.files[0]);
    }
  },

  /**
   * Resize the image to no larger than 1024px so that file sizes
   * are not too large.
   */
  _resizeImage(img) {
    // Derived from https://github.com/josefrichter/resize/blob/master/public/preprocess.js
    let canvas = document.createElement('canvas');
    let { height, width } = img;
    let maxHeight = 1024;
    let maxWidth = 1024;

    // calculate the width and height, constraining the proportions
    if (width > height) {
      if (width > maxWidth) {
        // height *= max_width / width;
        height = Math.round(height *= maxWidth / width);
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        // width *= max_height / height;
        width = Math.round(width *= maxHeight / height);
        height = maxHeight;
      }
    }

    // resize the canvas and draw the image data into it
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    let dataURI = canvas.toDataURL('image/png');
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/png' });
  },

  didInsertElement() {
    let $input = this.$('input');
    this.set('fileInputEl', $input[0]);
    $input.on('change', this._fileChanged.bind(this));
  }

});
