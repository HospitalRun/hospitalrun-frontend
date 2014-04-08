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
            //Signature url is different because it gets proxied server side.
            var signature_url = requestOptions.url.replace('/db/', 'http://localhost:5984/'),            
            consumerSecret = this.get('session.consumer_secret'),
            params = {},
            tokenSecret = this.get('session.token_secret');            
                
            if (requestOptions.type === 'POST' || requestOptions.type === 'GET') {                
                params = this._decodeParameters(requestOptions.data);
            } else {
                if(signature_url.indexOf("?") > 0) {
                    var url_params = signature_url.split("?");
                    params = this._decodeParameters(url_params[1]);
                }
            }
            
            params.oauth_consumer_key = this.get('session.consumer_key');
            params.oauth_token = this.get('session.token');
            params.oauth_signature_method = 'HMAC-SHA1';
            params.oauth_version = '1.0';            
            params.oauth_signature = oauthSignature.generate(requestOptions.type, signature_url, params, consumerSecret, tokenSecret);
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