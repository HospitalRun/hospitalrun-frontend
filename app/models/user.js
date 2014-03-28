// models/user.js
var User = DS.Model.extend({
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
    
});

export default User;
