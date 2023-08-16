#! /usr/bin/env node

const { program } = require('commander');
const packageJSON = require("./package.json");
const { readFileSync } = require('node:fs');
require('dotenv').config();
const { duplicateRepoAndCreatePR } = require('./lib');
const description = readFileSync('./description.md', 'utf8');

program
  .name(packageJSON.name)
  .description(packageJSON.description)
  .version(packageJSON.version)
  .argument('<username>', 'GitHub login of person you want to invite for PR review')
  .option('-u, --username <string>', 'user from name of which we operate GitHub', 'silentimp' | process.env.GITHUB_TOKEN)
  .requiredOption('-p, --password <string>', 'user personal token, which we use for GitHub auth')
  .option('-o, --owner <string>', 'owner (user or organisation) name', 'prjctr-react')
  .option('-r, --repo <string>', 'source repo name', 'curator')
  .option('-f, --from <string>', 'name of branch we are making PR from', '3-state')
  .option('-t, --to <string>', 'name of branch we are making PR to', 'main')
  .option('--title <string>', 'PR title', 'Заняття 3. Стан')
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

      let PRDesc;
      if (desc !== undefined) {
        PRDesc = desc;
      }
      if (descFile !== undefined) {
        const path = path.join(__dirname, descFile),
        PRDesc = readFileSync(path, 'utf8');
      }
      if (PRDesc === undefined) {
        const path = path.join(__dirname, './description.md'),
        PRDesc = readFileSync(path, 'utf8');
      }

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
        PRTitle,
        PRDesc,
      });

    } catch (error) {
      program.error(error.message);
    }
  });


  program.parse();
