import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
export default AbstractModuleRoute.extend({
    allowSearch: false,
    modelName: 'lab',
    moduleName: 'labs',
    newButtonText: '+ new lab',
    sectionTitle: 'Labs',

    additionalModels: [{
        name: 'patientList',
        findArgs: ['patient']
    }, {
        name: 'labTypesList',
        findArgs: ['lookup','lab_types']
    }],
    
    subActions: [{
        text: 'Requests',
        linkTo: 'labs.index'
    }, {
        text: 'Completed',
        linkTo: 'labs.completed'
    }],

    getNewData: function() {
        return {
            selectPatient: true,
            requestDate: moment().startOf('day').toDate()
        };
    }
});

