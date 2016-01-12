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
  "messages.$.postId": {
    type: String
  },
  "messages.$.ts": {
    type: Number
  }
});

Slackscope.attachSchema(slackSchema);
