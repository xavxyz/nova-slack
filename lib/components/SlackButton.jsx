import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router'

class SlackButton extends Component {

  
  componentDidMount() {
    const { query } = this.props.location;
    
    // a code is present in the query params
    if (!_.isEmpty(query) && query.code) {
      // show the user that we are doing something
      this.context.messages.flash('Connecting to Slack...', 'warning');
      
      // call the request token method
      this.context.actions.call('slack.requestToken', query.code , (err, res) => {
        // clear the loading message
        this.context.messages.markAsSeen();
        this.context.messages.clearSeen();

        if(err) { // woops, something bad happened
          this.context.messages.flash('WOOOPS!', 'danger');
        } else { // woot we are all done!
          this.context.messages.flash('DONE!', 'success');
        }
      });
    }
  }

  render() {
    const slackAppClientId = Telescope.settings.get('slackAppClientId');

    return slackAppClientId ? (
      <div>
        <a href={`https://slack.com/oauth/authorize?scope=incoming-webhook,chat:write:bot&client_id=${slackAppClientId}`}>
          <img 
            alt="Add to Slack" 
            style={{width: 139, height: 40}}
            src="https://platform.slack-edge.com/img/add_to_slack.png" 
            srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
          />
        </a>
      </div>
    ) : null;
  }
};

SlackButton.propTypes = {
  location: React.PropTypes.object,
};

SlackButton.contextTypes = {
  messages: React.PropTypes.object,
  actions: React.PropTypes.object,
};

export default withRouter(SlackButton);
