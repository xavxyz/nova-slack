// slack app client id
var slackClientIdProperty = {
  fieldName: "slackAppClientId",
  fieldSchema: {
    type: String,
    optional: true,
    autoform: {
      group: "slackscope"
    }
  }
};
Settings.addField(slackClientIdProperty);

// slack app client secret
var slackClientSecretProperty = {
  fieldName: "slackAppClientSecret",
  fieldSchema: {
    type: String,
    optional: true,
    private: true,
    autoform: {
      group: "slackscope",
      class: "private-field"
    }
  }
};
Settings.addField(slackClientSecretProperty);
