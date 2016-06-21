import rp from 'request-promise';

import slackFetchOptions from './utils';

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

  // send to slack with rp
  return post;
};

Telescope.callbacks.add("postSubmitAsync", sendNewPostToSlack);

// **********************
// Slack collection hooks
// **********************

const sendWelcomeMessage = async function(team) {
  try {
    const messageParams = {
      token: team.accessToken,
      channel: team.channel,
      text: `Howdy! ${Telescope.settings.get("title")} connected successfully :ok_hand:`,
      username: Telescope.settings.get("title"),
      as_user: false,
      icon_url: Telescope.settings.get("logoUrl")
    }

    console.log('welcome message triggered');

    const message = await rp(slackFetchOptions('chat.postMessage', messageParams, 'POST'));

    // handle {ok: false, ...} errors

    console.log('result', message);
  } catch(e) {
    console.log('// callback error: send welcome message', e);
  }
};

Telescope.callbacks.add("slackAsync", sendWelcomeMessage);