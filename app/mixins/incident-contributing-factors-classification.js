import Ember from "ember";
export default Ember.Mixin.create({
    patientFactors: [
        {type: 'Clinical condition', components: ['Pre-existing co-morbidity', 'Complexity of condition', 'Seriousness of condition', 
        'Limited options available to treat condition','Disability']},
        {type: 'Physical Factors', components: ['Poor general physical state','Malnourished', 'Dehydrated','Age related issues', 
          'Obese','Poor sleep pattern']},
        {type: 'Social Factors ', components: ['Cultural / religious beliefs','Language', 'Lifestyle (smoking/ drinking/ drugs/diet)',
         'Sub-standard living accommodation (e.g. dilapidated)', 'Life events','Lack of support networks / (social protective factors -Mental Health Services)',
         'Engaging in high risk activity']},
        {type: 'Mental/Psychological Factors', components: ['Motivation issue','Stress / Trauma','Existing mental health disorder',
         'Lack of intent (Mental Health Services)','Lack of mental capacity','Learning Disability']},
        {type: 'Interpersonal relationships', components: ['Staff to patient and patient to staff', 'Patient engagement with services', 
        'Staff to family and family to staff', 'Patient to patient', 'Family to patient or patient to family', 'Family to family (Siblings, parents, children)']}
        ]        
});
    