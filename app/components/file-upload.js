export default Em.Forms.FormInputComponent.extend({
    type: 'file',
    selectedFile: null,
    
    didInsertElement: function() {
        var $input = this.$('input');
        this.set('fileInputEl', $input[0]);
        $input.on('change', function() {
            var inputEl = this.get('fileInputEl');
            this.set('selectedFile', inputEl.files[0]);
        }.bind(this));
    }
});