Slackscope = new Mongo.Collection("slackscope");

var messageSchema= new SimpleSchema({

});

var slackSchema = new SimpleSchema({
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
	},
  messages: {
    type: [Object]
  },
  "messages.$.postCreatedAt": {
    type: Date
  },
  "messages.$.ts": {
    type: String
  }
});

Slackscope.attachSchema(slackSchema);
