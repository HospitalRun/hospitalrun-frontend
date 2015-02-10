import Ember from 'ember';
export default Ember.Mixin.create({
    /**
     * Display a message in a closable modal.
     * @param title string containing the title to display.
     * @param message string containing the message to display.
     */
    displayAlert: function(title, message) {
        this.send('openModal', 'dialog', Ember.Object.create({
            title: title,
            message: message,
            hideCancelButton: true,
            updateButtonAction: 'ok',
            updateButtonText: 'Ok'
        }));        
    },
});