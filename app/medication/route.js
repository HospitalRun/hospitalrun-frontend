import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
export default AbstractModuleRoute.extend({
    addCapability: 'add_medication',    
    moduleName: 'medication',
    newButtonText: '+ new request',
    sectionTitle: 'Medication',

    additionalModels: [{
        name: 'patientList',
        findArgs: ['patient']
    }, {
        name: 'medicationFrequencyList',
        findArgs: ['lookup','medication_frequency']
    }, {
        name: 'visitList',
        findArgs: ['visit']
    }],
    
    subActions: [{
        text: 'Requests',
        linkTo: 'medication.index'
    }, {
        text: 'Completed',
        linkTo: 'medication.completed'
    }],

    getNewData: function() {
        return {
            selectPatient: true,
            prescriptionDate: moment().startOf('day').toDate()
        };
    }
});

