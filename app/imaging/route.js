import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import UserSession from "hospitalrun/mixins/user-session";
export default AbstractModuleRoute.extend(UserSession, {
    addCapability: 'add_imaging',
    allowSearch: false,
    modelName: 'imaging',
    moduleName: 'imaging',
    newButtonText: '+ new imaging',
    sectionTitle: 'Imaging',

    additionalModels: [{
        name: 'patientList',
        findArgs: ['patient']
    }, {
        name: 'imagingTypesList',
        findArgs: ['lookup','imaging_types']
    }],
    
    subActions: [{
        text: 'Requests',
        linkTo: 'imaging.index'
    }, {
        text: 'Completed',
        linkTo: 'imaging.completed'
    }],

    getNewData: function() {
        return {
            selectPatient: true,
            requestDate: moment().startOf('day').toDate()
        };
    }
});

