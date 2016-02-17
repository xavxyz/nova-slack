function sendNewPostToSlack (post) {
  Meteor.call('sendToSlack', post);
  return post;
}
Telescope.callbacks.add("postSubmitAsync", sendNewPostToSlack);