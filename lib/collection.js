Slack = new Mongo.Collection("slack");

const slackSchema = new SimpleSchema({
	accessToken: {
		type: String
	},
	createdAt: {
		type: Date
	},
	teamName: {
		type: String
	},
	channel: {
		type: String
	}
});

Slack.attachSchema(slackSchema);

Slack.after.insert(function (teamId, team) {
  console.log(team);
});