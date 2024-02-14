#! /usr/bin/env node

const { program } = require('commander');
const packageJSON = require("./package.json");
const { readFileSync } = require('node:fs');
const path = require('path');
require('dotenv').config();
const { duplicateRepoAndCreatePR, duplicateRepo } = require('./lib');

program
  .name(packageJSON.name)
  .description(packageJSON.description)
  .version(packageJSON.version)
  .argument('<username>', 'GitHub login of person you want to invite for PR review')
  .option('-u, --username <string>', 'user from name of which we operate GitHub', 'silentimp' | process.env.GITHUB_TOKEN)
  .requiredOption('-p, --password <string>', 'user personal token, which we use for GitHub auth')
  .option('-o, --owner <string>', 'owner (user or organisation) name')
  .option('-r, --repo <string>', 'source repo name')
  .option('-f, --from <string>', 'name of branch we are making PR from')
  .option('-t, --to <string>', 'name of branch we are making PR to')
  .option('--title <string>', 'PR title')
  .option('--desc <string>', 'PR description')
  .option('--descFile <string>', 'path to .md file with PR description')
  .action(async (curator, options) => {
    const {
      from,
      to,
      owner,
      username,
      repo: source,
      password: token,
      title: PRTitle,
      desc,
      descFile,
    } = options;
    try {
      const hasPR = from !== undefined && to !== undefined;

      let PRDesc = '';
      if (desc !== undefined) {
        PRDesc = desc;
      }
      if (descFile !== undefined && hasPR) {
        const filePath = path.join(__dirname, descFile);
        PRDesc = readFileSync(filePath, 'utf8');
      }

      let result;
      if (hasPR) {
        result = await duplicateRepoAndCreatePR({
          username,
          token,
          curator,
          owner,
          source,
          target: `${source}-${curator}`,
          from,
          to,
          localPathToRepo: __dirname,
          PRTitle,
          PRDesc,
        });
      } else {
        result = await duplicateRepo({
          token,
          curator,
          owner,
          source,
          target: `${source}-${curator}`,
        });
      }

      console.info(result);

    } catch (error) {
      program.error(error.stderr ? error.stderr.toString() : error.message);
    }
  });


  program.parse();
