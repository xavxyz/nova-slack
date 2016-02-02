// This code is an extract from Kris Hamoud package : https://github.com/krishamoud/meteor-slack-api
// I've made a PR in order to handle attachments.
// As it's not accepted yet, I'm using some parts of its wrap with my modifications :)

Future = Npm.require('fibers/future');
SlackAPI = {

    // base api call
    _apiCall: function(method, params, callback) {
        callback  = typeof callback  !== "undefined" ? callback  : false;
        if(!callback){
            var future = new Future();
            HTTP.get("https://slack.com/api/" + method, {
                params: params
            }, function(err, message) {
                if(err) {
                    future.throw(err);
                } else if(!message.data.ok){
                    future.return(message.data);
                } else {
                    // Send back the relevant part of the payload.
                    future.return(message.data)
                }
            })
            return future.wait();
        } else {
            HTTP.get("https://slack.com/api/" + method, {
                params: params
            }, function(err, message) {
                if(err) {
                    return callback(err)
                } else if(!message.data.ok){
                    return callback(message.data);
                } else {
                    // Send back the relevant part of the payload.
                    return callback(null, message.data)
                }
            })
        }
    },

    // api
    api: {
        test:function(params, callback){
            return SlackAPI._apiCall('api.test', params, callback);
        }
    },

    // auth
    auth: {
        test:function(token, callback){
            var params = {
                token:token
            };

            return SlackAPI._apiCall('auth.test', params, callback);
        }
    },

    // chat
    chat:{
        delete:function(token, ts, channel, callback){
            var params = {
                token: token,
                ts: ts,
                channel: channel
            };
            return SlackAPI._apiCall('chat.delete', params, callback);
        },
        postMessage:function(accessToken, channelId, message, options, callback){
            var params = {
                token: accessToken,
                channel: channelId,
                text: message
            };
            // List of possible options fields in options.
            var optionsList = ['as_user', 'parse', 'attachments', 'link_names', 'unfurl_links', 'username', 'icon_url', 'icon_emoji'];
            // Append relevant params from options.
            _.each(optionsList, function(opt) {
                if (!_.isUndefined(options[opt])) {
                    if (opt === 'attachments') {
                        options[opt] = JSON.stringify(options[opt]);
                    }
                    params[opt] = options[opt];
                }
            });
            return SlackAPI._apiCall('chat.postMessage', params, callback);
        },
        update:function(token, ts, channel, text, callback){
            var params = {
                token: token,
                ts: ts,
                channel: channel,
                text: text
            };
            return SlackAPI._apiCall('chat.update', params, callback);
        }
    },

    // OAuth
    oauth:{
        access:function(client_id, client_secret, code, callback){
            var params = {
                client_id:client_id,
                client_secret:client_secret,
                code:code
            };
            return SlackAPI._apiCall('oauth.access', params, callback);
        }
    },

    // rtm
    rtm:{
        start:function(token, callback){
            var params = {
                token: token
            };
            return SlackAPI._apiCall('rtm.start', params, callback);
        }
    }
};
