Template.add_to_slack.helpers({
  slackAppClientId: function() {
    return Settings.get("slackAppClientId");
  },
  redirectUri: function() {
    return Meteor.absoluteUrl() + 'add-to-slack';
  }
});