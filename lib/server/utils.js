const slackFetchOptions = (endpoint, params) => {
  let options = {};

  // are you looking at my switch? Don't hesitate to discuss its usage.
  switch(endpoint) {
    case 'chat.postMessage': // should handle DM, groups & private channels
      options = {
        form: params,
        method: 'POST',
      }
      break;
    case 'oauth.access':
    default: // default to get method for now
      options = {
        qs: params,
        method: 'GET',
      }
      break;
  }

  return {
    uri: `https://slack.com/api/${endpoint}`,
    json: true,
    ...options,
  }
};

export default slackFetchOptions;