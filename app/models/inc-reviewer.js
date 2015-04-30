import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
    addedBy: DS.attr('string'),
	dateRecorded: DS.attr('date'),
	reviewerEmail: DS.attr('string'),
	reviewerName: DS.attr('string'),
	incident: DS.belongsTo('incident')
});
