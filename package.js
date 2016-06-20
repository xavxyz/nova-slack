Package.describe({
  name: 'xavcz:slackscope',
  version: '1.0.0',
  summary: 'Automatically send Telescope Nova posts as messages to connected Slack teams via the Add To Slack button',
  git: 'https://github.com/xavcz/telescope-slack.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:core@0.25.6-nova',
    'telescope:lib@0.25.6-nova',
    'telescope:settings@0.25.6-nova',
    'telescope:posts@0.25.6-nova',
    //'telescope:comments@0.25.6',
    //'telescope:scoring@0.25.6',
  ]);

  api.addFiles([
    'lib/modules.js',
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/modules.js',
  ], ['server']);
});
