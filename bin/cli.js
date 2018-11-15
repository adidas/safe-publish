#!/usr/bin/env node

const { join } = require('path');
const yargs = require('yargs');
const { red, bold } = require('chalk');
const publish = require('../publish.js');
const logger = require('../lib/logger');

const { argv: { registry, force, dryRun, silent } } = yargs
  .string('registry').alias('r', 'registry').describe('registry', 'Override default registry')
  .boolean('force').alias('f', 'force').default('force', false).describe('force', 'Force publication')
  .boolean('dry-run').alias('d', 'dry-run').default('dry-run', false).describe('dry-run', 'Test publication process')
  .boolean('silent').alias('s', 'silent').default('silent', false).describe('silent', 'Disable log output')
  .help('help');

const cwd = process.cwd();
const { name, version } = require(join(cwd, 'package.json'));

publish({
  cwd,
  name,
  version,
  registry,
  force,
  dryRun,
  silent
})
.catch((error) => {
  const log = logger.create({ silent });

  log.error(`Error publishing ${ bold(red(name)) } to v${ bold(red(version)) }`);
  log.error(error);

  process.exit(-1);
});
