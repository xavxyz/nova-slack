# nova-slack
A package for [Telescope Nova](http://www.telescopeapp.org): automatically send your posts as messages to any connected Slack Team.

# Installation

Type `meteor add xavcz:nova-slack` in your console within the Nova folder. 

Once the package is installed:

* You first need to create a [Slack App](https://api.slack.com/applications/new).

* Configure the redirect URI as `http://your-telescope-app.com/`.

* Register your App Client Id & App Client Secret to `your settings.json` file: 
```
{
  public: {
    ...
    "slackAppClientId": "my-slack-app-client-id"
  },
  ...
  "slackAppClientSecret": "my-slack-app-secret"
}
```

* Add a wild "Add to Slack" button by extending any components of your choice :
```
<Telescope.components.SlackButton />
```

* Spread the word and let your content be distributed! \o/
[![Ziuuu](https://d13yacurqjgara.cloudfront.net/users/39185/screenshots/2591998/egg.jpg)](https://dribbble.com/shots/2591998-Egg)
