import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
    otherIncome: DS.attr('string'),
    expenses: DS.attr(),
    familyInfo: DS.attr(),
    additionalData: DS.attr(),
    economicClassification: DS.attr('string'),
    notes: DS.attr('string')
});
