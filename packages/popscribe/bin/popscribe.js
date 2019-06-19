#!/usr/bin/env node
"use strict";

const _ = require("lodash");
const resolveCwd = require("resolve-cwd");
const { yellow } = require("chalk");

const program = require("popscribe-utils").commander;
const packageJSON = require("../package.json");

const checkIfPopscribeApp = name => {
  let logErrorAndExit = () => {
    console.log(
      `You need to run ${yellow(
        `popscribe ${name}`
      )} in a popscribe project. Make sure you are in the right directory`
    );
    process.exit(1);
  };

  try {
    const pkgJSON = require(process.cwd() + "/package.json");
    if (!_.has(pkgJSON, "dependencies.popscribe")) {
      logErrorAndExit(name);
    }
  } catch (err) {
    logErrorAndExit(name);
  }
};

const getScriptCmd = name => (...args) => {
  checkIfPopscribeApp(name);

  const cmdPath = resolveCwd.silent(`popscribe/lib/commands/${name}`);
  if (!cmdPath) {
    console.log(
      `Error loading the local ${yellow(
        name
      )} command. Popscribe might not be installed in your "node_modules". You may need to run "yarn install"`
    );
    process.exit(1);
  }

  return require(cmdPath)(...args);
};

/**
 * Check version of popscribe
 *
 * `$ popscribe -v`
 * `$ popscribe -V`
 * `$ popscribe --version`
 * `$ popscribe version`
 */

program.allowUnknownOption(true);

// Expose version.
program.version(packageJSON.version, "-v, --version");

// Make `-v` option case-insensitive.
process.argv = _.map(process.argv, arg => {
  return arg === "-V" ? "-v" : arg;
});

// `$ popscribe version` (--version synonym)
program
  .command("version")
  .description("output your version of Popscribe")
  .action(() => {
    console.log(packageJSON.version);
  });

/**
 * COMMANDS
 */

// `$ popscribe serve`
program
  .command("serve")
  .description("Start your Popscribe application")
  .action(getScriptCmd("serve"));

// Fallback incase of unknown command executed
// `$ popscribe <unrecognized_cmd>`
// Mask the '*' in `help`.
program.command("*").action(program.usageMinusWildcard);

/**
 * `$ popscribe`
 */

program.parse(process.argv);
const NO_COMMAND_SPECIFIED = program.args.length === 0;
if (NO_COMMAND_SPECIFIED) {
  program.usageMinusWildcard();
}
