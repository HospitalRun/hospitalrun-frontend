import couchOauthSign from "hospitalrun/utils/couch-oauth-sign";

export default Ember.SimpleAuth.Authorizers.Base.extend({
    _decodeParameters: function(param_string) {
        var return_params = {},
        params = decodeURIComponent(param_string).split('&'),
        param_parts,
        i;
        for (i=0;i<params.length;i++) {
            param_parts = params[i].split('=');
            return_params[param_parts[0]] =param_parts[1];            
        }
        return return_params;
    },
    
    authorize: function(jqXHR, requestOptions) {
        if (this.get('session.google_auth') && requestOptions.url.indexOf('/db/') === 0) {
            var signature_url = requestOptions.url.replace('/db/', 'http://localhost:5984/'),
                params = {};

            if (requestOptions.type === 'POST' || requestOptions.type === 'GET') {                
                params = this._decodeParameters(requestOptions.data);
            } else {
                if(signature_url.indexOf("?") > 0) {
                    var url_params = signature_url.split("?");
                    params = this._decodeParameters(url_params[1]);
                }
            }

            params = couchOauthSign(requestOptions.url, {
                consumerKey: this.get('session.consumer_key'),
                consumerSecret: this.get('session.consumer_secret'),
                token: this.get('session.token'),
                tokenSecret: this.get('session.token_secret'),
                type: requestOptions.type,
                requestParams: params
            });

            if (requestOptions.type === 'POST' || requestOptions.type === 'GET') {                
                requestOptions.data = decodeURIComponent($.param( params ));
            } else {
                var oauth_header = 'OAuth realm=""';
                for (var parameter in params) {
                    if (parameter.indexOf("oauth_") === 0) {                        
                        oauth_header += ', '+parameter+'="'+params[parameter]+'"';
                    }
                }
                jqXHR.setRequestHeader('Authorization', oauth_header);            
            }            
        }
    }    
});