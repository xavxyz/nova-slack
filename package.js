Package.describe({
  name: 'xavcz:nova-slack',
  version: '1.0.0',
  summary: 'Automatically send Telescope Nova posts as messages to connected Slack teams via the Add To Slack button',
  git: 'https://github.com/xavcz/nova-slack.git',
  documentation: 'README.md'
});

Npm.depends({'request-promise': "3.0.0"});

Package.onUse(function(api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:core@0.26.3-nova',
    'nova:lib@0.26.3-nova',
    'nova:settings@0.26.3-nova',
    'nova:posts@0.26.3-nova',
  ]);

  api.addFiles([
    'lib/modules.js',
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/modules.js',
  ], ['server']);
});
