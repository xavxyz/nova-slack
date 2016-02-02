Meteor.methods({
  requestSlackToken: function(code) {

    check(code, String);

    var syncSlackOAuth = Meteor.wrapAsync(SlackAPI.oauth.access),
        syncSlackPostMessage = Meteor.wrapAsync(SlackAPI.chat.postMessage);

    var botName = Settings.get("title", "Slackscope"),
        botIcon = Settings.get("logoUrl");

    try {
      var credentials = syncSlackOAuth(Settings.get("slackAppClientId"), Settings.get("slackAppClientSecret"), code);

      try {
        var message = syncSlackPostMessage(
          credentials.access_token,
          credentials.incoming_webhook.channel,
          'Howdy! '+ botName +' connected successfully :ok_hand:',
          {
            username: botName,
            as_user: false,
            icon_url: botIcon
          }
        );

        Slackscope.insert({
          accessToken: credentials.access_token,
          createdAt: Date.now(),
          teamName: credentials.team_name,
          channel: credentials.incoming_webhook.channel,
          messages: [
            { postCreatedAt: Date.now(), ts: message.ts }
          ]
        }, function(err, res) {
          console.log('Slackscope connected successfully');
        });


      } catch(messageError) {
        throw messageError;
      }
    } catch(oauthError) {
      throw oauthError;
    }
  },

  sendToSlack: function(post) {

    check(post, Posts.simpleSchema());

    if (!Settings.get("slackAppClientId") && !Settings.get("slackAppClientSecret")) {
      console.log('slackscope is not connected, add your app id & secret or remove the package');
      return undefined;
    }

    var teams = Slackscope.find({}).fetch(),
        imageUrl = post.thumbnailUrl === undefined ? "" : "http:"+ post.thumbnailUrl,
        botName = Settings.get("title", "Slackscope"),
        botIcon = Settings.get("logoUrl"),
        syncSlackPostMessage = Meteor.wrapAsync(SlackAPI.chat.postMessage);

    _.each(teams, function(team) {
      console.log('posting to channel '+ team.channel);

      try {
        var result = syncSlackPostMessage(
          team.accessToken,
          team.channel,
          "", // empty message, use of the attachments below instead to recreate it
          {
            username: botName,
            as_user: false,
            attachments: [
              {
                "fallback": "New post! "+ post.title +" - "+ post.url,
                "pretext": "New post! :simple_smile:",
                "title": post.title,
                "title_link": post.url,
                "text": post.body,
                "image_url": imageUrl,
                "color": Settings.get('accentColor', "#7CD197"),
                "fields": [
                  {
                    "title": "Author",
                    "value": post.author,
                    "short": true
                  },
                  {
                    "title": "This has been posted on "+ Settings.get("title", "Telescope"),
                    "value": Meteor.absoluteUrl(),
                    "short": true
                  }
                ],
              },
            ],
            unfurl_text: false,
            unfurl_media: false,
            icon_url: botIcon
          }
        );

        // the post id is not defined yet, so we use the timestamp of post creation to identify it
        team.messages.push({
          postCreatedAt: post.createdAt,
          ts: result.ts
        });

        Slackscope.update({accessToken: team.accessToken}, {$set: {messages: team.messages}}, function(err, res) {
          console.log('logged post created at '+ post.createdAt +' sent to '+ result.channel +' at '+ result.ts);
        });

      } catch(error) {
        if (!error.ok && error.error === 'token_revoked') {
          Slackscope.remove({_id: team._id});
          console.log('token revoked by user -> team removed from the collection!');
        }
      }
    });

    return post;
  }
});