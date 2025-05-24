const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        //Get input
        const tag = process.env.TAG || process.env.INPUT_TAG || '';
        const repoInput = core.getInput('repo') || process.env.GITHUB_REPOSITORY;

        console.log(`Searching for a release with tag: ${tag} in ${repoInput}`);

        if (!repoInput.includes('/')) {
            throw new Error(`${repoInput} is not a valid repo`);  
        }
            
        // Get owner and repo from context of payload that triggered the action
        const [ owner, ...repository ] = repoInput.split('/');
        const repo = repository.join('/');
        
        const octokit = github.getOctokit(process.env.GITHUB_TOKEN || core.getInput('github_token'));
        var exists = 'false';
        var prerelease = 'false';
        var draft = 'false';

        try {
            const response = await octokit.rest.repos.getReleaseByTag({
                owner,
                repo,
                tag
            });

            if (response.status === 200) {
                console.log("Release found");
                exists = 'true';
                
                //console.log(JSON.stringify(response.data));

                prerelease = response.data.prerelease ? "true" : "false";
                console.log(`Pre-release: ${prerelease}`);

                draft = response.data.draft ? "true" : "false";
                console.log(`Draft: ${draft}`);

                const url = response.data.html_url;
                core.setOutput('url', url);
                console.log(`Url: ${url}`);

                const name = response.data.name;
                core.setOutput('name', name);
                console.log(`Name: ${name}`);
            } else {
                core.setFailed("Unknown status was returned: " + response.status);
            }

        } catch(error) {
            if (error.status === 404) {
              console.log("No release found");
            } else {
              core.setFailed("Unknown status was returned: " + error.status);
              console.error(error);
            }
        }
        core.setOutput('exists', exists);
        core.setOutput('prerelease', prerelease);
        core.setOutput('draft', draft);
    } catch (error) {
        core.setFailed(error.message);
        console.error(error);
    }
}

run();
