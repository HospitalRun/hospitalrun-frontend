function createAndRegister(data, name, app) {
    var ICD10Bloodhound = new Bloodhound( {
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: data
    });
    ICD10Bloodhound.initialize();
    var bloodhoundName = 'bloodhound:%@'.fmt(name);
    app.register(bloodhoundName, ICD10Bloodhound, {instantiate: false});
    app.inject('component:%@-typeahead'.fmt(name), 'bloodhound', bloodhoundName);   
}

import icd10Generator from 'hospitalrun/utils/icd10';
import icd10PCSGenerator from 'hospitalrun/utils/icd10-pcs';

export default {
    name: 'icd10-bloodhound',
    
    initialize: function(container, app) {
        createAndRegister(icd10Generator(), 'icd10', app);
        createAndRegister(icd10PCSGenerator(), 'icd10-pcs', app);
    }
};