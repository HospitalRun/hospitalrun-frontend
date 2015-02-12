import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import UserSession from "hospitalrun/mixins/user-session";
export default AbstractModuleRoute.extend(UserSession, {
    addCapability: 'add_imaging',
    additionalModels: [{ 
        name: 'imagingPricingTypes',
        findArgs: ['lookup','imaging_pricing_types']
    }],
    allowSearch: false,
    moduleName: 'imaging',
    newButtonText: '+ new imaging',
    sectionTitle: 'Imaging',
    
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

