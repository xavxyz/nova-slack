function sendNewPostToSlack (post) {
  Meteor.call('sendToSlack', post);
  return post;
}
Telescope.callbacks.add("postSubmit", sendNewPostToSlack); // post submit server side