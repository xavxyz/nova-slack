import rp from 'request-promise';
import moment from 'moment';
import { Avatar } from 'meteor/nova:core';
import slackFetchOptions from './utils';


// **********************
// Posts collection hooks
// **********************

const sendNewPostToSlack = function(post) {
  if (!Telescope.settings.get("slackAppClientId") && !Telescope.settings.get("slackAppClientSecret")) {
    console.log('slackscope is not connected, add your app id & secret or remove the package');
    return undefined;
  }

  const user = Users.getUser(post.userId);

  const attachments = JSON.stringify([
    {
      "fallback": `New post! ${post.title} - ${post.url}`,
      "author_name": post.author,
      "author_link": Users.getProfileUrl(user),
      "author_icon": Avatar.getUrl(user),
      "title": post.title,
      "title_link": `${Telescope.utils.getSiteUrl()}posts/${post._id}/${post.slug}`,
      "text": post.body,
      "image_url": post.thumbnailUrl,
      "color": "#1965CB",
      "footer": `This has been posted on ${Telescope.settings.get("title")} - ${Telescope.utils.getSiteUrl()}`,
      "footer_icon": Telescope.settings.get("logoUrl"),
      "ts": moment(post.postedAt).format('X') // timestamp
    },
  ]);

  Slack.find({}).forEach(async function(team) {
    try {
      console.log('posting to channel ', team.channel, team.teamName);
      const params = {
        token: team.accessToken,
        channel: team.channel,
        text: `New post! ${_.sample(["🎉", "💎", "😃", "😁", "🎈", "🐻", "🚀", "🔥"])}`,
        username: Telescope.settings.get("title"),
        as_user: false,
        unfurl_text: false,
        unfurl_media: false,
        icon_url: Telescope.settings.get("logoUrl"),
        attachments,
      };

      const options = slackFetchOptions('chat.postMessage', params);

      const message = await rp(options);
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