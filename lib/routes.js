FlowRouter.route('/add-to-slack', {
	name: "add-to-slack",
	action: function(params, queryParams) {	
	  if (queryParams.code) {
	    Meteor.call('requestSlackToken', queryParams.code);
  	}
  	BlazeLayout.render("layout", {main: "howdy"});
  }
});