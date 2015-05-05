import Ember from "ember";
//Dervied from http://spin.atomicobject.com/2013/10/29/ember-js-date-picker/
export default Ember.Forms.FormInputComponent.extend({
    currentDate: null,
    currentDisplayDate: null,
    dateProperty: null,
    minDate: null,
    maxDate: null,
    format: 'l',
    showTime: false,
    yearRange: 10,
    
    _picker: null,
    
    showTimeChanged: function() {
        var picker = this.get('_picker');
        if (picker) {
            picker.destroy();
            this.didInsertElement();
        }
    }.observes('showTime'),
    
    /**
     * Map the propertyName to a "displayPropertyName" so that
     * we can maintain a display date (used by pikadate) and
     * also bind to the date property specified to the component.
     */
    _setup: function() {
        var dateProperty = this.get('propertyName'),
            displayPropertyName = 'display_'+dateProperty;
        this.set('doingSetup', true);
        this.set('propertyName',displayPropertyName);
        this.set('dateProperty', dateProperty);
        if (Ember.isEmpty(this.get('currentDate'))) {
            Ember.Binding.from("model." + dateProperty).to('currentDate').connect(this);
        }
        if (Ember.isEmpty(this.get('currentDisplayDate'))) {
            Ember.Binding.from("model." + displayPropertyName).to('currentDisplayDate').connect(this);
        }
        
        Ember.Binding.from('model.errors.'+dateProperty).to('model.errors.'+displayPropertyName).connect(this);
        this.set('doingSetup', false);
    }.on('init'),
    
    _shouldSetDate: function(currentDate, picker) {
        return (picker && (Ember.isEmpty(currentDate) || 
                       Ember.isEmpty(picker.getDate()) || 
                       picker.getDate().getTime() !== currentDate.getTime()));
        
    },
        
    currentDateChangedValue: function(){
        var currentDate = this.get('currentDate'),
            picker = this.get('_picker');
        if (this._shouldSetDate(currentDate, picker)){
            picker.setDate(currentDate);
        }
    }.observes('currentDate'),
    
    currentDisplayDateChangedValue: function(){
        if (!this.get('doingSetup')) {
            var currentDisplayDate = this.get('currentDisplayDate');
            if (Ember.isEmpty(currentDisplayDate)) {
                this.set('currentDate');
            }
        }
    }.observes('currentDisplayDate'),

    dateSet: function() {
        var currentDate = this.get('currentDate'),
            picker = this.get('_picker');
        if (this._shouldSetDate(currentDate, picker)){
            this.set('currentDate', picker.getDate());
        }
    },

    didInsertElement: function(){
        var currentDate = this.get('currentDate'),
            $input = this.$('input'),
            picker = null,
            props = this.getProperties('format','yearRange','showTime');
        
        props.onSelect = this.dateSet.bind(this);
    
        if (!Ember.isEmpty(this.get('minDate'))) {
            props.minDate = this.get('minDate');
            if (props.minDate === 'now') {
                props.minDate = new Date();
            }            
        }
        if (!Ember.isEmpty(this.get('maxDate'))) {
            props.maxDate = this.get('maxDate');
            if (props.maxDate === 'now') {
                props.maxDate = new Date();
            }            
        }
        props.field = $input[0];
        picker = new Pikaday(props);
        picker.setDate(currentDate);
        this.set("_picker", picker);
    },
 
    willDestroyElement: function(){
        var picker = this.get("_picker");
        if (picker) {
            picker.destroy();
        }
        this.set("_picker", null);
    }
});