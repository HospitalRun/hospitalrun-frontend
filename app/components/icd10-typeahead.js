import TypeAhead from "hospitalrun/components/type-ahead";
export default TypeAhead.extend({
    selectionKey: 'id', 
    setOnBlur: true,
    
    _getSource: function() {
        return this.bloodhound.ttAdapter();
    }
});