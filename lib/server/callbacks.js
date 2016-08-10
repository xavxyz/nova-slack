import rp from 'request-promise';
import moment from 'moment';
import Telescope from 'meteor/nova:lib';
import { Avatar } from 'meteor/nova:core';
import Users from 'meteor/nova:users';
import slackFetchOptions from './utils';

import Slack from '../collection.js';

// **********************
// Posts collection hooks
// **********************

const sendNewPostToSlack = function(post) {
  if (!Telescope.settings.get("slackAppClientId") && !Telescope.settings.get("slackAppClientSecret")) {
    console.log('No app connected, add your app id & secret to the settings or remove the package');
    return post; // don't break possible next callbacks
  }

  // get data concerning the post author
  const user = Users.getUser(post.userId);

  // prepare the attachments for the slack message
  const attachments = JSON.stringify([
    {
      "fallback": `New post! ${post.title} - ${post.url}`,
      "author_name": post.author,
      "author_link": Users.getProfileUrl(user),
      "author_icon": Users.avatar.getUrl(user),
      "title": post.title,
      "title_link": `${Telescope.utils.getSiteUrl()}posts/${post._id}/${post.slug}`,
      "text": post.body,
      "image_url": !!post.thumbnailUrl ? Telescope.utils.addHttp(post.thumbnailUrl) : undefined,
      "color": "#1965CB",
      "footer": `This has been posted on ${Telescope.settings.get("title")} - ${Telescope.utils.getSiteUrl()}`,
      "footer_icon": Telescope.settings.get("logoUrl"),
      "ts": moment(post.postedAt).format('X') // timestamp
    },
  ]);

  // loop through connected teams
  Slack.find({}).forEach(async function(team) {
    try {
      console.log('posting to channel ', team.channel, team.teamName);

      // params for each team
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

      // send the message
      const message = await rp(slackFetchOptions('chat.postMessage', params));

      // handle {ok: false, ...} errors
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

    const message = await rp(slackFetchOptions('chat.postMessage', params));

    // handle {ok: false, ...} errors
  } catch(e) {
    console.log('// callback error: send welcome message', e);
  }
};

Telescope.callbacks.add("slack.welcome.async", sendWelcomeMessage);