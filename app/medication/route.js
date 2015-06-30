import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
export default AbstractModuleRoute.extend({
    addCapability: 'add_medication',    
    moduleName: 'medication',
    newButtonText: '+ new request',
    sectionTitle: 'Medication',
    
    additionalButtons: function() {
        if (this.currentUserCan(this.get('addCapability'))) {
            return [{
                buttonIcon: 'octicon octicon-mail-reply',
                buttonAction: 'returnMedication',
                buttonText: 'return medication',
                class: 'btn btn-primary'
            }];
        }
    }.property(),

    additionalModels: [{ 
        name: 'aisleLocationList',
        findArgs: ['lookup','aisle_location_list']
    }, {
        name: 'expenseAccountList',
        findArgs: ['lookup','expense_account_list']
    }, {
        name: 'warehouseList',
        findArgs: ['lookup','warehouse_list']
    }],
    
    subActions: [{
        text: 'Requests',
        linkTo: 'medication.index'
    }, {
        text: 'Completed',
        linkTo: 'medication.completed'
    }],
    
    actions: {
        returnMedication: function(){
            if (this.currentUserCan(this.get('addCapability'))) {
                this.transitionTo('medication.return', 'new');
            }
        }
    }
});

