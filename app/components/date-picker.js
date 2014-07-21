//Dervied from http://spin.atomicobject.com/2013/10/29/ember-js-date-picker/
export default Em.Forms.FormInputComponent.extend({
    minDate: null,
    maxDate: null,
    format: 'l',
    yearRange: 10,
    
    _picker: null,

    currentDate: function() {
        return this.get('model').get(this.get('propertyName'));
    }.property('model', 'propertyName'),
    
    modelChangedValue: function(){
        var picker = this.get("_picker");
        if (picker){
            picker.setDate(this.get("currentDate"));
        }
    }.observes("currentDate"),
 
    didInsertElement: function(){
        var currentDate = this.get('currentDate'),
            $input = this.$('input'),
            picker = null,
            props = this.getProperties('format','yearRange');
    
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
        //Temporarily set the date to a formatted string so it looks correct in the pikaday input.
        this.get('model').set(this.get('propertyName'), moment(currentDate).format('l'));
        props.field = $input[0];
        picker = new Pikaday(props);
        
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