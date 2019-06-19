#!/usr/bin/env node

const _ = require("lodash");
const resolveCwd = require("resolve-cwd");
const { yellow } = require("chalk");

const program = require("popscribe-utils").commander;

console.log(chalk.yellow("This is a yellow console log"));
