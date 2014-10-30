import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import UserSession from "hospitalrun/mixins/user-session";
export default AbstractEditController.extend(UserSession, {
    canAddSocialWork: function() {        
        return this.currentUserCan('add_socialwork');
    }.property(),
    
    canDeleteSocialWork: function() {        
        return this.currentUserCan('delete_socialwork');
    }.property(),
        
    economicClassificationTypes: [
        'A',
        'B',
        'C1',
        'C2',
        'C3',
        'D'
    ],

    livingArrangementList: [
        'Homeless',
        'Institution',
        'Owned',
        'Rent',
        'Shared'
    ],
    
    philhealthTypes: [         
        'Employed: Government',
        'Employed: Non Paying Member/Lifetime',
        'Employed: OWWA/OFW',
        'Employed: Private',
        'Employed: Sponsored/Indigent',
        'Self Employed'      
    ],
    
    
    
    actions: {        
        deleteExpense: function(model) {
            var expense = model.get('expenseToDelete'),
                expenses = this.get('expenses');
            expenses.removeObject(expense);
            this.set('expenses', expenses);
            this.send('update', true);
        },

        deleteFamily: function(model) {
            var family = model.get('familyToDelete'),
                familyInfo = this.get('familyInfo');
            familyInfo.removeObject(family);
            this.set('familyInfo', familyInfo);
            this.send('update', true);
        },
        
        showDeleteExpense: function(expense) {
            this.send('openModal', 'dialog', Ember.Object.create({
                confirmAction: 'deleteExpense',
                title: 'Delete Expense',
                message: 'Are you sure you want to delete this expense?',
                expenseToDelete: expense,
                updateButtonAction: 'confirm',
                updateButtonText: 'Ok'
            }));   
        },
        
        showDeleteFamily: function(familyInfo) {
            this.send('openModal', 'dialog', Ember.Object.create({
                confirmAction: 'deleteFamily',
                title: 'Delete Family Member',
                message: 'Are you sure you want to delete this family member?',
                familyToDelete: familyInfo,
                updateButtonAction: 'confirm',
                updateButtonText: 'Ok'
            }));   
            
        },
        
        showEditExpense: function(model) {
            if (Ember.isEmpty(model)) {
                model = this.store.createRecord('social-expense', {isNew:true});
            }
             this.send('openModal', 'socialwork.expense', model);            
        },
        
        showEditFamily: function(model) {
            if (Ember.isEmpty(model)) {
                model = this.store.createRecord('family-info', {isNew:true});
            }
            this.send('openModal', 'socialwork.family-info', model);
        },
        
        updateExpense: function(model) {
            var expenses = this.get('expenses'),
                isNew = model.get('isNew');
            if (isNew) {
                expenses.addObject(model);
            }
            this.send('closeModal');
        },        

        updateFamilyInfo: function(model) {
            var familyInfo = this.get('familyInfo'),
                isNew = model.get('isNew');
            if (isNew) {
                familyInfo.addObject(model);
            }
            this.send('closeModal');
        }
    },    
    
    totalExpenses: function() {
        var expenses = this.get('expenses');
        if (!Ember.isEmpty(expenses)) {
            var total = expenses.map(function(previousValue, expense) {
                if (!Ember.isEmpty(expense.cost)) {
                    total += expense.cost;
                }            
            }, 0);
        }
    }.property('expenses@each')
});