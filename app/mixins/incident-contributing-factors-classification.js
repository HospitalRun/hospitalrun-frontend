import Ember from "ember";
export default Ember.Mixin.create({
    patientFactors: [
        {type: 'Clinical condition',components: [{id:'cf1',name:'Pre-existing co-morbidity'},{id:'cf2',name:'Complexity of condition'}, 
        {id:'cf3',name:'Seriousness of condition'}, {id:'cf4', name:'Limited options available to treat condition'},{id:'cf5',name:'Disability'}]},
        {type: 'Physical Factors',components: [{id:'cf6',name: 'Poor general physical state'},{id:'cf7',name:'Malnourished'},{id:'cf8',name:'Dehydrated'},
        {id:'cf9',name:'Age related issues'},{id:'cf10',name:'Obese'},{id:'cf11',name:'Poor sleep pattern'}]},
        {type: 'Social Factors ',components: [{id:'cf12',name: 'Cultural / religious beliefs'},{id:'cf13',name: 'Language'},
        {id:'cf14',name: 'Lifestyle (smoking/ drinking/ drugs/diet)'},{id:'cf15',name: 'Sub-standard living accommodation (e.g. dilapidated)'},
        {id:'cf16',name: 'Life events'},{id:'cf17',name: 'Lack of support networks / (social protective factors -Mental Health Services)'},
        {id:'cf18',name: 'Engaging in high risk activity'}]},
        {type: 'Mental/Psychological Factors', components: [{id:'cf19',name: 'Motivation issue'},{id:'cf20',name: 'Stress / Trauma'},
        {id:'cf21',name: 'Existing mental health disorder'},{id:'cf21',name: 'Lack of intent (Mental Health Services)'},{id:'cf22',name: 'Lack of mental capacity'},
        {id:'cf23',name: 'Learning Disability'}]},
        {type: 'Interpersonal relationships', components: [{id:'cf24',name: 'Staff to patient and patient to staff'},{id:'cf25',name: 'Patient engagement with services'}, 
        {id:'cf26',name: 'Staff to family and family to staff'},{id:'cf27',name: 'Patient to patient'},{id:'cf28',name: 'Family to patient or patient to family'},
        {id:'cf29',name: 'Family to family (Siblings, parents, children)'}]}
        ]        
});
    