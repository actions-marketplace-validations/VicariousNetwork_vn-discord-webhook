const core = require('@actions/core');
const github = require('@actions/github');

const analysis = require('../src/analysis.js');
const webhook = require('../src/discord.js');

async function run() {
	const repository = github.context.repo;
	const payload = github.context.payload;
  	const commits = payload.commits;
    	const size = payload.size;
    	const diff = `https://github.com/${repository}/compare/${payload.before}...${payload.after}`;
	const branch = payload.ref.split('/')[payload.ref.split('/').length - 1];

	console.log(`Received ${commits.length}/${size} commits...`);

    	const id = core.getInput("id");
    	const token = core.getInput("token");

	analysis.start().then((report) => {
        webhook.send(id, token, repository, branch, diff, commits, size, report).catch(err => core.setFailed(err.message));
    }, err => core.setFailed(err));
}

try {
	run();
} catch (error) {
    core.setFailed(error.message);
}
