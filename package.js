Package.describe({
  name: 'xavizalote:telescope-slack',
  version: '0.0.8',
  summary: 'Automatically send Telescope posts as messages to connected Slack teams via the Add To Slack button',
  git: 'https://github.com/xavizalote/telescope-slack.git',

  documentation: 'README.md'
});

Package.onUse(function(api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'telescope:lib@0.25.6',
    'telescope:i18n@0.25.6',
    'telescope:settings@0.25.6',
    'telescope:posts@0.25.6',
    'telescope:comments@0.25.6',
    'telescope:scoring@0.25.6',
    'http'
  ]);

  api.addFiles([
    'package-tap.i18n',
    'lib/callbacks.js',
    'lib/custom_fields.js',
    'lib/routes.js',
    'lib/slack.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/stylesheets/custom.scss',
    'lib/client/templates/add_to_slack.html',
    'lib/client/templates/add_to_slack.js',
    'lib/client/templates/slack_connected.html',
    'lib/client/templates/slack_connected.js',  
    'lib/template_modules.js'
  ], ['client']);

  api.addFiles([
    'lib/server/api.js',
    'lib/server/methods.js'
  ], ['server']);

  var languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  var languagesPaths = languages.map(function (language) {
    return "i18n/"+language+".i18n.json";
  });
  api.addFiles(languagesPaths, ["client", "server"]);

});
