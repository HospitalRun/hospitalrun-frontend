var bodyParser = require('body-parser'),
    config =  require('../config.js'), 
    nano = require('nano')(config.couch_auth_db_url),
    users = nano.use('_users'); 

function find_user(userName, callback) {
    var user_key = 'org.couchdb.user:'+userName;
    users.get(user_key, {}, function(err, body) {
        if (err) {
            callback(err);
            return;
        }        
        callback(null, body);
    });    
}

function get_primary_role(user) {
    var primaryRole = '';
    if (user.roles) {
        user.roles.forEach(function(role) {
            if (role !== 'user' && role !== 'admin') {
                primaryRole = role;
            }
        });
    }
    return primaryRole;
}
        
module.exports = function(app) { 
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));
    app.post('/chkuser', function(req, res){
        find_user(req.body.name, function(err, user) {
            if (err) {
                res.json({error:true, errorResult: err});
            } else {
                res.json({
                    displayName: user.displayName,
                    prefix: user.userPrefix,
                    role: get_primary_role(user)
                });
            }            
        });
    });
};