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

      Telescope.callbacks.runAsync("slack.welcome.async", Slack.findOne({_id: slackTeam}));
    } catch(e) {
      console.log('something bad happened', e);
      throw new Meteor.Error(e.message)
    }
  }
});
