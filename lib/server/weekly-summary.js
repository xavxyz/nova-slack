weeklyDigestFormattedForSlack = () => {
	const sevenDaysAgo = moment().subtract(7, "days").toDate();

	const postsThisWeek = Posts.find({postedAt: {$gte: moment().subtract(7, "days").toDate()}}, {sort: {upvotes: -1}, limit: 5});

	let attachments = [];

	postsThisWeek.forEach(
		post => attachments.push({
			author_name: `@${post.author}`,
			author_link: `${Telescope.utils.getSiteUrl()}users/${post.author}`,
			title: post.title,
			title_link: post.url,
			text: `:+1: ${post.upvotes} upvotes`,
			thumb_url: post.thumbnailUrl,
			color: Settings.get('accentColor', "#7CD197")
		})
	);

	// call to action
	attachments.push({
		pretext: `:thinking_face: Got an awesome resource to distribute to the community?\n:rocket: Post it on ${Settings.get('title', 'Telescope')}: ${Telescope.utils.getSiteUrl()}`
	});

	return attachments;
};

SyncedCron.options = {
	log: false,
	collectionName: 'cronHistory',
	utc: false,
	collectionTTL: 172800
};

const addJob = () => {
	SyncedCron.add({
		name: 'Send weekly digest to Slack',
		schedule(parser) {
			return parser.text('at 9:00 am every monday');
		},
		job() {
			Meteor.call(
				'sendToSlack',
				`*Here is a weekly digest of what happened out there on ${Settings.get('title', 'Telescope')}: *`,
				weeklyDigestFormattedForSlack(),
				'weekly'
			);
		}
	});
};

Meteor.startup(() => {
	addJob();
});