import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
export default AbstractModuleRoute.extend({        
    modelName: 'medication',
    moduleName: 'medication',
    newButtonText: '+ new request',
    sectionTitle: 'Medication',

    additionalModels: [{ 
        name: 'medicationList',
        findArgs: ['inventory',{type: 'Medication'}]
    },  {
        name: 'patientList',
        findArgs: ['patient']
    }, {
        name: 'medicationFrequencyList',
        findArgs: ['lookup','medication_frequency']
    }], 

    getNewData: function() {
        return {
            selectPatient: true,
            prescriptionDate: moment().startOf('day').toDate()
        };
    }
});

