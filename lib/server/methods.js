var syncSlackOAuth = Meteor.wrapAsync(SlackAPI.oauth.access),
    syncSlackPostMessage = Meteor.wrapAsync(SlackAPI.chat.postMessage);

Meteor.methods({
  requestSlackToken: function(code) {

    check(code, String);
    var botName = Settings.get("title", "Slackscope");
    var botIcon = Settings.get("logoUrl");

    try {
      var credentials = syncSlackOAuth(Settings.get("slackAppClientId"), Settings.get("slackAppClientSecret"), code, Meteor.absoluteUrl() +' add-to-slack');

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
            { postId: 'first_message', ts: 0 }
          ]
        });

        console.log('Slackscope connected successfully');
      } catch(messageError) {
        throw new Meteor.Error(messageError);
      }
    } catch(oauthError) {
      throw new Meteor.Error(oauthError);
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
        botIcon = Settings.get("logoUrl");

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
                "fallback": "New post from "+ post.author +" - "+ post.title +" - "+ post.url,
                "pretext": "New post from "+ post.author +" ! :simple_smile:",
                "title": post.title,
                "title_link": post.url,
                "text": post.body,
                "image_url": imageUrl,
                "color": Settings.get('accentColor', "#7CD197"),
                "fields": [
                  {
                    "title": "Score",
                    "value": post.score + " :+1:",
                    "short": true
                  },
                  {
                    "title": "Comments",
                    "value": post.commentCount +" :speech_balloon:",
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

        /*
        team.messages.push({
          postId: post._id,
          ts: result.ts
        });

        Slackscope.update({accessToken: team.accessToken}, {messages: team.messages}, function(err, res) {
          console.log('logged post '+ post._id +' sent to '+ result.channel +' at '+ result.ts);
        });
        */
      } catch(error) {
        if (!error.ok && error.error === 'token_revoked') {
          Slackscope.remove({_id: team._id});
          throw new Meteor.Error('token revoked by user -> team removed from the collection!');
        }
      }
    });
  }
});
