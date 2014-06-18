import icd10Generator from 'hospitalrun/utils/icd10';    

export default {
    name: 'icd10-bloodhound',

    initialize: function(container, app) {
        var ICD10Bloodhound = new Bloodhound( {
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: icd10Generator()
        });
        ICD10Bloodhound.initialize();
        app.register('bloodhound:icd10', ICD10Bloodhound, {instantiate: false});
        app.inject('component:icd10-typeahead', 'bloodhound', 'bloodhound:icd10');
    }
};