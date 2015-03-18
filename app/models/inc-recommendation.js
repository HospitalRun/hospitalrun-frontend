import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
	activity: DS.attr('string'),
	responsibility: DS.attr('string'),
	startDate: DS.attr('date'),
	targetDateOfCompletion: DS.attr('date'),
	status: DS.attr('boolean'),
    dateRecorded: DS.attr('date'),
    incident: DS.belongsTo('incident')	
/*
    availableLocations: function() {
        var locations = this.get('locations').filter(function(location) {
            return location.get('quantity') > 0;
        });
        return locations;
    }.property('locations@each.lastModified'),
    
    validations: {
        purchaseCost: {
            numericality: {
                if: function(object) {
                    //Only validate on new items that are not assets
                    return (object.get('isNew') && object.get('type') !== 'Asset');
                }
            }
        },
        name: {
            presence: true,
        },
        quantity: {
            numericality: true
        },
        price: {
            numericality: {
                allowBlank: true
            }
        },
        reorderPoint: {
            numericality: {
                allowBlank: true
            }
        },
        type: {
            presence: true,
        },
    },

    updateQuantity: function() {
        if (this.get('type') === 'Asset') {
            //Asset quantity is edited directly
            return;
        }
        var purchases = this.get('purchases');
        var newQuantity = purchases.reduce(function(previousItem, currentItem) {
            var currentQuantity = 0;
            if (!currentItem.get('expired')) {
                currentQuantity = currentItem.get('currentQuantity');
            }
            return previousItem + currentQuantity;
        }, 0);
        this.set('quantity', newQuantity);
    }*/

});
