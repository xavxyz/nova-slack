import React from 'react';

const SlackButton = (props, context) => {

  const slackAppClientId = Telescope.settings.get('slackAppClientId');

  return slackAppClientId ? 
    (<div>
      <a href={`https://slack.com/oauth/authorize?scope=incoming-webhook,chat:write:bot&client_id=${}`}>
        <img 
          alt="Add to Slack" 
          style=
          src="https://platform.slack-edge.com/img/add_to_slack.png" 
          srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
        />
      </a>
    </div>) : null;
  );
};

modules.export = SlackButton;
export default SlackButton;