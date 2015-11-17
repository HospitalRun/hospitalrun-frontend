import AbstractModel from 'hospitalrun/models/abstract';
import Ember from 'ember';
import NumberFormat from 'hospitalrun/mixins/number-format';

export default AbstractModel.extend(NumberFormat,{
    amountOwed: DS.attr('number'),
    category: DS.attr('string'),
    description: DS.attr('string'),    
    details: DS.hasMany('line-item-detail'), /* The individual objects that make up this line item. */
    discount: DS.attr('number'),
    name: DS.attr('string'),
    nationalInsurance: DS.attr('number'),
    privateInsurance: DS.attr('number'),
    total: DS.attr('number'),
    
    amountOwedChanged: function() {
        Ember.run.debounce(this, function() {
            var discount = this._getValidNumber(this.get('discount')),
            nationalInsurance = this._getValidNumber(this.get('nationalInsurance')),
            privateInsurance = this._getValidNumber(this.get('privateInsurance')),
            amountOwed = this._getValidNumber(this.get('total'));        
            amountOwed = amountOwed - discount - nationalInsurance - privateInsurance;        
            if (amountOwed < 0) {
                amountOwed = 0;
            }
            this.set('amountOwed',this._numberFormat(amountOwed,true));
        }, 150);
    }.observes('discount','nationalInsurance','privateInsurance','total'),
    
    discountChanged: function() {
        Ember.run.debounce(this, function() {
            var details = this.get('details'),
                total = 0;
            if (!Ember.isEmpty('details')) {
                total = this._calculateTotal(details, 'discount');
                this.set('discount', this._numberFormat(total, true));
            }
        }, 150);
    }.observes('details.@each.discount'),
    
    totalChanged: function() {
        Ember.run.debounce(this, function() {
            var details = this.get('details'),
                total = 0;
            if (!Ember.isEmpty('details')) {
                total = this._calculateTotal(details, 'total');
                this.set('total', this._numberFormat(total, true));
            }
        }, 150);
    }.observes('details.@each.total'),
    
    validations: {
        category: {
            presence: true
        },
        discount: { 
            numericality: {
                allowBlank: true                
            }
        },
        nationalInsurance: { 
            numericality: {
                allowBlank: true                
            }
        },
        name: {
            presence: true            
        },
        privateInsurance: { 
            numericality: {
                allowBlank: true                
            }
        },
        total: { 
            numericality: {
                allowBlank: true                
            }
        }
    }
});