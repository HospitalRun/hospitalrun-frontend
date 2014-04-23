export default function register(){
    Ember.EasyForm.Config.registerWrapper('twitter-bootstrap', {
        // Define the custom template
        inputTemplate: 'bootstrap-input',

        // Define a custom config used by the template
        controlsWrapperClass: 'controls',

        // Define the classes for the form, label, error...
        formClass: '',
        fieldErrorClass: 'has-error',
        //errorClass: 'help-inline',
        errorClass: 'help-block',
        hintClass: 'help-block',
        labelClass: 'control-label',
        inputClass: 'form-group'
    });
}