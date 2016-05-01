# SlackScope
A package for [Telescope](http://www.telescopeapp.org): automatically send your posts as messages to any connected Slack Team.

### Compatibility
This package has not tested with Nova branch of Telescope (the default one). This has been built for the Legacy version.
You can still try to use it, but you will have to add the settings yourself and tweak the UI.

# Installation

Type `meteor add xavcz:slackscope` in your console within the Telescope folder. 

Once the package is installed:

1. You first need to create a [Slack App](https://api.slack.com/applications/new).

2. Configure the redirect URI as `http://your-telescope-app.com/slack-connected`.

3. Register your App Client ID & App Client Secret to your Telescope Settings.

4. A wild "Add to Slack" button appeared in the footer of your app! Anyone can get your posts automatically in their Slack team, hooray!
