import AbstractModel from "hospitalrun/models/abstract";
import NumberFormat from "hospitalrun/mixins/number-format";

export default AbstractModel.extend(NumberFormat,{    
    category: DS.attr('string'),
    description: DS.attr('string'),    
    details: DS.attr(), /* The individual objects that make up this line item. */
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