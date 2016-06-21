const slackFetchOptions = (endpoint, qs, method = 'GET') => {
  return {
    uri: `https://slack.com/api/${endpoint}`,
    qs,
    method,
    json: true,
  }
};

export default slackFetchOptions;