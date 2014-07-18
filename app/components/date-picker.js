//Dervied from http://spin.atomicobject.com/2013/10/29/ember-js-date-picker/
export default Em.Forms.FormInputComponent.extend({
    minDate: null,
    maxDate: null,
    format: 'l',
    yearRange: 10,
    
    _picker: null,

    modelChangedValue: function(){
        var picker = this.get("_picker");
        if (picker){
            picker.setDate(this.get("value"));
        }
    }.observes("value"),
 
    didInsertElement: function(){
        var $input = this.$('input'),
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