import React, { Component, PropTypes } from 'react';

class SlackButton extends Component {
  render() {
    const slackAppClientId = Telescope.settings.get('slackAppClientId');

    return slackAppClientId ? (
      <div>
        <a href={`https://slack.com/oauth/authorize?scope=incoming-webhook,chat:write:bot&client_id=${slackAppClientId}`}>
          <img 
            alt="Add to Slack" 
            style={{width: 139, height: 40}}
            src="https://platform.slack-edge.com/img/add_to_slack.png" 
            srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
          />
        </a>
      </div>
    ) : null;
  }
};

module.exports = SlackButton;
export default SlackButton;