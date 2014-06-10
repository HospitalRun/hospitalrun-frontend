import GenderList from 'hospitalrun/mixins/gender-list';    
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    

export default AbstractEditController.extend(GenderList, {
    afterUpdate: function(record) {
        this.transitionToRoute('/patients/search/'+record.get('id'));
    }
});
