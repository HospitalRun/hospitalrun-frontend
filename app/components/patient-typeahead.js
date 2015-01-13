import PatientName from 'hospitalrun/mixins/patient-name';
import TypeAhead from "hospitalrun/components/type-ahead";
export default TypeAhead.extend(PatientName, {
    displayKey: 'name', 
    setOnBlur: true,
    
    
    _mapPatient: function(item) {
        var returnObj = {};
        item.doc.id = item.id.substr(8);
        returnObj.name = '%@ - %@'.fmt(this.getPatientDisplayName(item.doc), item.doc.id);
        returnObj[this.get('selectionKey')] = item.doc;
        return returnObj;
    },
    
    contentChanged: function() {
        var bloodhound = this.get('bloodhound'),
            content = this.get('content');
        if (bloodhound) {
            bloodhound.clear();
            bloodhound.add(content.map(this._mapPatient.bind(this)));
        }        
    }.observes('content.[]'),
    
    mappedContent: function() {
        var content = this.get('content'),
            mapped = [];
        if (content) {
            mapped = content.map(this._mapPatient.bind(this));
        }
        return mapped;
    }.property('content')
    
});