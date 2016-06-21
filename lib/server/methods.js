import rp from 'request-promise';
import slackFetchOptions from './utils.js';

Meteor.methods({
  'slack.requestToken': async function(code) {
    check(code, String);

    try {
      // query strings for oauth request token
      const oAuthParams = {
        client_id: Telescope.settings.get('slackAppClientId'),
        client_secret: Telescope.settings.get('slackAppClientSecret'),
        code,
      };

      // ping slack to get access token and hook data
      const credentials = await rp(slackFetchOptions('oauth.access', oAuthParams));

      // handle {ok: false, ...} errors

      const slackTeam = await Slack.insert({
        accessToken: credentials.access_token,
        createdAt: Date.now(),
        teamName: credentials.team_name,
        channel: credentials.incoming_webhook.channel
      });

      Telescope.callbacks.runAsync("slackAsync", Slack.findOne({_id: slackTeam}));
    } catch(e) {
      console.log('something bad happened', e);
      throw new Meteor.Error(e.message)
    }
  }
})

// Meteor.methods({
//   requestSlackToken: async function(code) {
//     check(code, String);

//     try {
//       // webclient without token
//       const client = new WebClient();

//       // get credentials
//       const credentials = await client.oauth.access(Settings.get("slackAppClientId"), Settings.get("slackAppClientSecret"), code);

//       // if there is not an integration registered for this team and this channel -> todo: tweak this to accept multiple youtube channels
//       if (!Slackscope.findOne({ teamName: credentials.team_name, channel: credentials.incoming_webhook.channel })) {

//         // auth a new client with the access token
//         const authClient = new WebClient(credentials.access_token);

//         // send a welcome message
//         await authClient.chat.postMessage(
//           credentials.incoming_webhook.channel,
//           //'WOYOYOYOYO! I\'m connected using NPM Modules + Promises + Async/Await Meteor *Validated* Methods <3 ',
//           'Howdy! '+ Settings.get("title", "Slackscope") +' connected successfully :ok_hand:',
//           {
//             username: Settings.get("title", "Slackscope"),
//             as_user: false,
//             icon_url: Settings.get("logoUrl")
//           }
//         );

//         // store the credentials
//         return Slackscope.insert({
//           accessToken: credentials.access_token,
//           createdAt: Date.now(),
//           teamName: credentials.team_name,
//           channel: credentials.incoming_webhook.channel
//         });
//       } else {
//         console.log('team already exists!');
//         return false;
//       }
//     } catch(e) {
//       console.log('something weird has happened', e);
//       return false;
//     }
//   },

//   sendToSlack: async function(text, attachments, postId) {
//     check(text, String);
//     check(attachments, Match.Any);
//     check(postId, String);

//     if (!Settings.get("slackAppClientId") && !Settings.get("slackAppClientSecret")) {
//       console.log('slackscope is not connected, add your app id & secret or remove the package');
//       return undefined;
//     }

//     var teams = Slackscope.find({}).fetch(),
//         //imageUrl = post.thumbnailUrl === undefined ? "" : "http:"+ post.thumbnailUrl,
//         botName = Settings.get("title", "Slackscope"),
//         botIcon = Settings.get("logoUrl");

//     _.each(teams, function(team) {
//       console.log('posting to channel '+ team.channel);

//       try {
//         var result = await SlackAPI.chat.postMessage(
//           team.accessToken,
//           team.channel,
//           text,
//           {
//             username: botName,
//             as_user: false,
//             attachments,
//             unfurl_text: false,
//             unfurl_media: false,
//             icon_url: botIcon
//           }
//         );

        

//       } catch(error) {
//         if (!error.ok && error.error === 'token_revoked') {
//           Slackscope.remove({_id: team._id});
//           console.log('token revoked by user -> team removed from the collection!');
//         }
//       }
//     });
//   }
// });
