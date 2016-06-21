import rp from 'request-promise';

import slackFetchOptions from './utils';

// **********************
// Posts collection hooks
// **********************

const sendNewPostToSlack = function(post) {
  if (!Telescope.settings.get("slackAppClientId") && !Telescope.settings.get("slackAppClientSecret")) {
    console.log('slackscope is not connected, add your app id & secret or remove the package');
    return undefined;
  }

  const attachments = [
    {
      "fallback": "New post! "+ post.title +" - "+ post.url,
      "title": post.title,
      "title_link": Telescope.utils.getSiteUrl() +'posts/'+ post._id +'/'+ post.slug,
      "text": post.body,
      "image_url": post.thumbnailUrl,
      "color": "#7CD197",
      "fields": [
        {
          "title": "Author",
          "value": post.author,
          "short": true
        },
        {
          "title": "This has been posted on "+ Telescope.settings.get("title", "Telescope"),
          "value": Telescope.utils.getSiteUrl(),
          "short": true
        }
      ],
    },
  ];
  // const attachments = [
  //       {
  //           "fallback": "Required plain-text summary of the attachment.",
  //           "color": "#36a64f",
  //           "pretext": "Optional text that appears above the attachment block",
  //           "author_name": "Bobby Tables",
  //           "author_link": "http://flickr.com/bobby/",
  //           "author_icon": "http://flickr.com/icons/bobby.jpg",
  //           "title": "Slack API Documentation",
  //           "title_link": "https://api.slack.com/",
  //           "text": "Optional text that appears within the attachment",
  //           "fields": [
  //               {
  //                   "title": "Priority",
  //                   "value": "High",
  //                   "short": false
  //               }
  //           ],
  //           "image_url": "http://my-website.com/path/to/image.jpg",
  //           "thumb_url": "http://example.com/path/to/thumb.png",
  //           "footer": "Slack API",
  //           "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
  //           "ts": 123456789
  //       }
  //   ];

  Slack.find({}).forEach(async function(team) {
    try {
      console.log('posting to channel '+ team.channel);
      const params = {
        token: team.accessToken,
        channel: team.channel,
        text: "New post! :simple_smile:",
        username: Telescope.settings.get("title"),
        as_user: false,
        unfurl_text: false,
        unfurl_media: false,
        icon_url: Telescope.settings.get("logoUrl"),
        attachments,
      };

      const message = await rp(slackFetchOptions('chat.postMessage', params, 'POST'));
      console.log(message);
    } catch(e) {
      console.log('error posting to ', team.channel, e);
    }
  });

  return post;
};

Telescope.callbacks.add("posts.new.async", sendNewPostToSlack);

// **********************
// Slack collection hooks
// **********************

const sendWelcomeMessage = async function(team) {
  try {
    const params = {
      token: team.accessToken,
      channel: team.channel,
      text: `Howdy! ${Telescope.settings.get("title")} connected successfully :ok_hand:`,
      username: Telescope.settings.get("title"),
      as_user: false,
      icon_url: Telescope.settings.get("logoUrl")
    }

    console.log('welcome message triggered');

    const message = await rp(slackFetchOptions('chat.postMessage', params, 'POST'));

    // handle {ok: false, ...} errors

    console.log('result', message);
  } catch(e) {
    console.log('// callback error: send welcome message', e);
  }
};

Telescope.callbacks.add("slack.welcome.async", sendWelcomeMessage);