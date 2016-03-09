FlowRouter.route('/slack-connected', {
	name: "slack-connected",
	action: function(params, queryParams) {	
	  if (queryParams.code) {
	    Meteor.call('requestSlackToken', queryParams.code);
  	}
  	BlazeLayout.render("layout", { main: "slack_connected" });
  }
});