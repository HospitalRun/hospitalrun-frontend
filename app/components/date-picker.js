//Dervied from http://spin.atomicobject.com/2013/10/29/ember-js-date-picker/
export default Em.Forms.FormInputComponent.extend({
    currentDate: null,
    dateProperty: null,
    minDate: null,
    maxDate: null,
    format: 'l',
    yearRange: 10,
    
    _picker: null,
    
    /**
     * Map the propertyName to a "displayPropertyName" so that
     * we can maintain a display date (used by pikadate) and
     * also bind to the date property specified to the component.
     */
    _setup: function() {
        var dateProperty = this.get('propertyName');
        this.set('propertyName','display_'+dateProperty);
        this.set('dateProperty', dateProperty);
        Ember.Binding.from("model." + dateProperty).to('currentDate').connect(this);
    }.on('init'),
    
        
    currentDateChangedValue: function(){
        var currentDate = this.get('currentDate'),
            picker = this.get('_picker');
        if (picker && (Ember.isEmpty(currentDate) || 
                       Ember.isEmpty(picker.getDate()) || 
                       picker.getDate().getTime() !== currentDate.getTime())){
            picker.setDate(currentDate);
        }
    }.observes('currentDate'),

    dateSet: function() {
        var currentDate = this.get('currentDate'),
            picker = this.get('_picker');
        if (picker && (Ember.isEmpty(currentDate) || 
                       picker.getDate().getTime() !== currentDate.getTime())){
            this.set('currentDate', picker.getDate());
        }
    },

    didInsertElement: function(){
        var currentDate = this.get('currentDate'),
            $input = this.$('input'),
            picker = null,
            props = this.getProperties('format','yearRange');
        
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