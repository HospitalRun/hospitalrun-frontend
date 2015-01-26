import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import PublishStatuses from 'hospitalrun/mixins/publish-statuses';

export default AbstractEditController.extend(PatientSubmodule, PublishStatuses, {
    needs: ['pouchdb'],
    updateCapability: 'add_invoice',
    
    visitChanged: function() {
        var visit = this.get('visit'),
            lineItems = this.get('lineItems');
        if (!Ember.isEmpty(visit) && Ember.isEmpty(lineItems)) {
            var promises = this.resolveVisitChildren();            
            Ember.RSVP.all(promises, 'Resolved visit children before generating invoice').then(function() {
                this._generateLineItems(visit);
            }.bind(this));
        }
    }.property('visit'),
    
    _completeBeforeUpdate: function(sequence, resolve, reject) {
        var invoiceId = 'inv',
            sequenceValue;
        sequence.incrementProperty('value',1);
        sequenceValue = sequence.get('value');
        if (sequenceValue < 100000) {
            invoiceId += String('00000' + sequenceValue).slice(-5);
        } else {
            invoiceId += sequenceValue;
        }
        this.set('id',invoiceId);
        sequence.save().then(resolve, reject);
    },
    
    _generateLineItems: function(visit) {
        var endDate = visit.get('endDate'),
            lineItems = this.get('lineItems'),
            startDate = visit.get('startDate');
        if (!Ember.isEmpty(endDate) && !Ember.isEmpty(startDate)) {
            endDate = moment(endDate);
            startDate = moment(startDate);
            var stayDays = endDate.diff(startDate, 'days');
            if (stayDays > 1) {
                var lineItem = this.store.createRecord('billing-line-item', {
                    name: 'Room/Accomodation',
                    description: stayDays +' days'
                });
                lineItems.addObject(lineItem);
            }
        }
    },
    
    beforeUpdate: function() {
        if (this.get('isNew')) {            
            return new Ember.RSVP.Promise(function(resolve, reject){
                this.store.find('sequence', 'invoice').then(function(sequence) {
                    this._completeBeforeUpdate(sequence, resolve, reject);
                }.bind(this), function() {
                    var newSequence = this.get('store').push('sequence',{
                        id: 'invoice',
                        value: 0
                    });
                    this._completeBeforeUpdate(newSequence, resolve, reject);
                }.bind(this));
            }.bind(this));
        } else {
            return Ember.RSVP.Promise.resolve();
        }
    },    

    afterUpdate: function(record) {
        var message =  'The invoice record has been saved.'.fmt(record.get('displayName'));
        this.displayAlert('Invoice Saved', message);        
    }
});
