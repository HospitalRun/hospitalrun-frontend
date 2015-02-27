import AbstractModel from 'hospitalrun/models/abstract';
import Ember from 'ember';
import NumberFormat from 'hospitalrun/mixins/number-format';

export default AbstractModel.extend(NumberFormat,{    
    category: DS.attr('string'),
    description: DS.attr('string'),    
    details: DS.hasMany('line-item-detail'), /* The individual objects that make up this line item. */
    discount: DS.attr('number'),
    name: DS.attr('string'),
    nationalInsurance: DS.attr('number'),
    privateInsurance: DS.attr('number'),
    total: DS.attr('number'),
    
    amountOwed: function() {
        var discount = this._getValidNumber(this.get('discount')),
        nationalInsurance = this._getValidNumber(this.get('nationalInsurance')),
        privateInsurance = this._getValidNumber(this.get('privateInsurance')),
        amountOwed = this._getValidNumber(this.get('total'));        
        amountOwed = amountOwed - discount - nationalInsurance - privateInsurance;        
        if (amountOwed < 0) {
            amountOwed = 0;
        }
        return amountOwed;
    }.property('discount','nationalInsurance','privateInsurance','total'),
    
    
    
    discountChanged: function() {        
        var details = this.get('details'),
            total = 0;
        if (!Ember.isEmpty('details')) {
            total = this._calculateTotal(details, 'discount');
            this.set('discount', this._numberFormat(total, true));
        }        
    }.observes('details.@each.discount'),
    
    totalChanged: function() {        
        var details = this.get('details'),
            total = 0;
        if (!Ember.isEmpty('details')) {
            total = this._calculateTotal(details, 'total');
            this.set('total', this._numberFormat(total, true));
        }        
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