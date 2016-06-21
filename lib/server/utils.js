// TO REFACTO
const slackFetchOptions = (endpoint, params, method = 'GET') => {
  let qs = {};
  let form = {};

  if (method === 'POST') {
    qs = undefined;
    form = params;
  } else {
    qs = params;
    body = undefined;
  }

  return {
    uri: `https://slack.com/api/${endpoint}`,
    qs,
    form,
    method,
    json: true,
  }
};

export default slackFetchOptions;