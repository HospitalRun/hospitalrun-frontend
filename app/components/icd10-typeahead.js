import TypeAhead from "hospitalrun/components/type-ahead";
export default TypeAhead.extend({
    minlength: 2,
    selectionKey: 'id', 
    setOnBlur: true,
    
    _getSource: function() {
        return this.bloodhound.ttAdapter();
    }
});