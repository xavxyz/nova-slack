Package.describe({
  name: 'xavcz:nova-slack',
  version: '0.27.2',
  summary: 'Automatically send Nova posts as messages to connected Slack teams via the Add To Slack button',
  git: 'https://github.com/xavcz/nova-slack.git',
  documentation: 'README.md'
});

Npm.depends({'request-promise': "3.0.0"});

Package.onUse(function(api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:core@0.27.2-nova',
    'nova:lib@0.27.2-nova',
    'nova:settings@0.27.2-nova',
    'nova:users@0.27.2-nova',
    'nova:posts@0.27.2-nova',
  ]);

  api.mainModule("lib/server.js", "server");
  api.mainModule("lib/client.js", "client");
  
});
