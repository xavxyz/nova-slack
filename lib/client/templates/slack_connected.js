Template.slack_connected.helpers({
  appTitle() {
    return Settings.get("title", "Telescope");
  }
});