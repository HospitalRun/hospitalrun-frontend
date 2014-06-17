(function(root, factory) {
    if(typeof define === 'function' && define.amd) {
        define([
            'ember',
            './components/date-picker-controls.js',
            './components/date-picker-input.js',
        ], function(Ember, Controls, Input) { 
            return factory(Ember, Controls, Input); 
        });
    } else if(typeof exports === 'object') {
        module.exports = factory(
            require('ember'),
            require('./components/date-picker-controls.js'),
            require('./components/date-picker-input.js')
        );
    } else {
        factory(
            Ember,
            root.DatePickerControlsComponent,
            root.DatePickerInputComponent
        );
    }
})(this, function(Ember, Controls, Input) {

    Ember.Application.initializer({
        name: 'date-picker',
        initialize: function(container, application) {
            container.register('component:date-picker-controls', Controls);
            container.register('component:date-picker-input', Input);
        }
    });

    return {
        DatePickerControls: Controls,
        DatePickerInput: Input
    };
});