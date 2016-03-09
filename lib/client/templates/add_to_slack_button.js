Template.add_to_slack_button.helpers({
  slackAppClientId: function() {
    return Settings.get("slackAppClientId");
  }
});