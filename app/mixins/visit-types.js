import Ember from "ember";
export default Ember.Mixin.create({
    visitTypes: [
        'Clinic',
        'Followup',
        'Imaging',
        'Lab',
        'Pharmacy',
        'Surgery'
    ]
});