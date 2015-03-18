import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
	incident: DS.belongsTo('incident')
    /*givenBy: DS.attr('string'),
	description: DS.attr('string'),
    dateRecorded: DS.attr('date'),*/
});
