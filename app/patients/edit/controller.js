import GenderList from 'hospitalrun/mixins/gender-list';    
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    

export default AbstractEditController.extend(GenderList, {
    title: function() {
        if (this.get('isNew')) {
            return 'New Patient';
        } else {
            return 'Edit Patient';
        }
    }.property('isNew'),

    afterUpdate: function(record) {
        this.transitionToRoute('/patients/search/'+record.get('id'));
    }
});
