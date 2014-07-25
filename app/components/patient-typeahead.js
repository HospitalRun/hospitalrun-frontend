import TypeAhead from "hospitalrun/components/type-ahead";
export default TypeAhead.extend({
    displayKey: 'name', 
    setOnBlur: true,
    
    mappedContent: function() {
        var content = this.get('content'),
            mapped;
        if (content) {
            mapped = content.map(function(item) {
                var returnObj = {};
                returnObj.name = '%@ (%@)'.fmt(item.get('displayName'), item.get('id'));
                returnObj[this.get('selectionKey')] = item;
                return returnObj;
            }.bind(this));
            return mapped;
        } else {
            return [];
        }        
    }.property('content')
});