// models/user.js
var User = DS.Model.extend(Ember.Validations.Mixin, {
    derived_key: DS.attr('string'),
    email: DS.attr('string'),
    iterations: DS.attr(),
    name: DS.attr('string'),
    password: DS.attr('string'),
    password_scheme: DS.attr('string'),
    password_sha: DS.attr('string'),
    rev: DS.attr('string'),
    roles: DS.attr(),
    salt: DS.attr('string'),
     validations: {
        email: {
            format: { 
                with: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
                allowBlank: false, 
                message: 'please enter a valid email address'
            }
        }
    }
});

export default User;
