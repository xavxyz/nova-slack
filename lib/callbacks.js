const sendNewPostToSlack = (post) => {
  const attachments = [
    {
      "fallback": "New post! "+ post.title +" - "+ post.url,
      "pretext": "New post! :simple_smile:",
      "title": post.title,
      "title_link": Meteor.absoluteUrl() +'posts/'+ post._id +'/'+ post.slug,
      "text": post.body,
      "image_url": post.thumbnailUrl,
      "color": Settings.get('accentColor', "#7CD197"),
      "fields": [
        {
          "title": "Author",
          "value": post.author,
          "short": true
        },
        {
          "title": "This has been posted on "+ Settings.get("title", "Telescope"),
          "value": Telescope.utils.getSiteUrl(),
          "short": true
        }
      ],
    },
  ];

  Meteor.call('sendToSlack', "", attachments, post._id);
  return post;
};

Telescope.callbacks.add("postSubmitAsync", sendNewPostToSlack);