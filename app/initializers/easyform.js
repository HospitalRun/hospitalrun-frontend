import SmartPrescription from "hospitalrun/components/smart-prescription";

export default {
    name: 'easyform',
    
    initialize: function(container, application) {
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
        Ember.EasyForm.Config.registerInputType('smart-prescription', SmartPrescription);
    }    
};