#! /usr/bin/env node

const { program } = require('commander');
const packageJSON = require("./package.json");
require('dotenv').config();
const { duplicateRepoAndCreatePR } = require('lib.js');

program
  .name(packageJSON.name)
  .description(packageJSON.description)
  .version(packageJSON.version)
  .argument('<username>', 'GitHub login of person you want to invite for PR review')
  .option('-u, --username <string>', 'user from name of which we operate GitHub', 'silentimp' | process.env.GITHUB_TOKEN)
  .requiredOption('-p, --password <string>', 'user personal token, which we use for GitHub auth')
  .option('-o, --owner <string>', 'owner (user or organisation) name', 'prjctr-react')
  .option('-r, --repo <string>', 'source repo name', 'curator')
  .option('-f, --from <string>', 'name of branch we are making PR from', 'feature')
  .option('-t, --to <string>', 'name of branch we are making PR to', 'main')
  .action(async (curator, options) => {
    const {
      from,
      to,
      owner,
      username,
      repo: source,
      password: token,
    } = options;
    try {
      await duplicateRepoAndCreatePR({
        username,
        token,
        curator,
        owner,
        source,
        target: `${source}-${curator}`,
        from,
        to,
        localPathToRepo: __dirname,
      });
    } catch (error) {
      program.error(error.message);
    }
  });


  program.parse();
