import InputComponent from 'ember-idx-forms/input'; 
export default InputComponent.extend({
    fileInputEl: null,
    resizeFile: true,
    selectedFile: null,
    type: 'file',
    
    _fileChanged: function() {
        var inputEl = this.get('fileInputEl'),
            resize = this.get('resizeFile');

        if (resize) {
            //Derived from https://github.com/josefrichter/resize/blob/master/public/preprocess.js
            window.URL = window.URL || window.webkitURL;
            var blobURL = window.URL.createObjectURL(inputEl.files[0]); // and get it's URL
            // helper Image object
            var image = new Image();
            image.src = blobURL;
            image.onload = function() {
                window.URL.revokeObjectURL(blobURL);
                // have to wait till it's loaded
                this.set('selectedFile', this._resizeImage(image)); // send it to canvas
                
            }.bind(this);
        } else {            
            this.set('selectedFile', inputEl.files[0]);
        }        
    },
    
    /**
     * Resize the image to no larger than 1024px so that file sizes
     * are not too large.
     */
    _resizeImage: function(img) {
        //Derived from https://github.com/josefrichter/resize/blob/master/public/preprocess.js
        var canvas = document.createElement('canvas'),
            height = img.height,
            width = img.width,
            max_height = 1024,
            max_width = 1024;

        // calculate the width and height, constraining the proportions
        if (width > height) {
            if (width > max_width) {
                //height *= max_width / width;
                height = Math.round(height *= max_width / width);
                width = max_width;
            }
        } else {
            if (height > max_height) {
                //width *= max_height / height;
                width = Math.round(width *= max_height / height);
                height = max_height;
            }
        }
  
        // resize the canvas and draw the image data into it
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
          
        var dataURI = canvas.toDataURL("image/png");        
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: 'image/png'});
    },
    
    didInsertElement: function() {
        var $input = this.$('input');
        this.set('fileInputEl', $input[0]);
        $input.on('change', this._fileChanged.bind(this));
    }
    
    
});