Meteor.methods({
  requestSlackToken(code) {

    check(code, String);

    var botName = Settings.get("title", "Slackscope"),
        botIcon = Settings.get("logoUrl");

    try {
      var credentials = SlackAPI.oauth.access(Settings.get("slackAppClientId"), Settings.get("slackAppClientSecret"), code);

      try {
        var message = SlackAPI.chat.postMessage(
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
            { postId: 'connection_success', ts: message.ts }
          ]
        });

      } catch(messageError) {
        throw messageError;
      }
    } catch(oauthError) {
      throw oauthError;
    }
  },

  sendToSlack(text, attachments, postId) {
    check(text, String);
    check(attachments, Match.Any);
    check(postId, String);

    if (!Settings.get("slackAppClientId") && !Settings.get("slackAppClientSecret")) {
      console.log('slackscope is not connected, add your app id & secret or remove the package');
      return undefined;
    }

    var teams = Slackscope.find({}).fetch(),
        //imageUrl = post.thumbnailUrl === undefined ? "" : "http:"+ post.thumbnailUrl,
        botName = Settings.get("title", "Slackscope"),
        botIcon = Settings.get("logoUrl");

    _.each(teams, function(team) {
      console.log('posting to channel '+ team.channel);

      try {
        var result = SlackAPI.chat.postMessage(
          team.accessToken,
          team.channel,
          text,
          {
            username: botName,
            as_user: false,
            attachments,
            unfurl_text: false,
            unfurl_media: false,
            icon_url: botIcon
          }
        );

        // the post id is not defined yet, so we use the timestamp of post creation to identify it
        team.messages.push({
          postId: postId,
          ts: result.ts
        });

        Slackscope.update({accessToken: team.accessToken}, {$set: {messages: team.messages}});

      } catch(error) {
        if (!error.ok && error.error === 'token_revoked') {
          Slackscope.remove({_id: team._id});
          console.log('token revoked by user -> team removed from the collection!');
        }
      }
    });
  }
});
