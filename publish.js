const { promisify } = require('util');
const childProcess = require('child_process');
const { red, green, blue, bold } = require('chalk');
const logger = require('./lib/logger');

const exec = promisify(childProcess.exec);
const resultCode = {
  ERROR: -1,
  SAME_VERSION: 0,
  NEW_VERSION: 1,
  NEW_PACKAGE: 2
};

/**
 * Searches if the package is already published with the same version.
 * @param {string} name - Package name.
 * @param {string} version - Package version.
 * @returns {Promise<number>} Status code of the package (existing/new).
 */
function find({ cwd, name, version, registry }) {
  const args = [];

  registry && args.push(`--registry ${ registry }`);

  return exec(`npm view ${ name }@${ version } version ${ args.join(' ') }`, { cwd })
    .then(({ stdout }) => {
      const sameVersion = stdout.trim() === version;

      return resultCode[sameVersion ? 'SAME_VERSION' : 'NEW_VERSION'];
    })
    .catch((error) => {
      const commandError = !~error.message.indexOf('E404');

      if (commandError) {
        throw error;
      }

      return resultCode.NEW_PACKAGE;
    });
}

/**
 * Publishes the package in NPM registry.
 * @param {number} code - Status code of the package (existing/new).
 * @returns {Promise<number>} Status code of the package (existing/new).
 */
function publish({ cwd, registry, tag, dryRun, code }) {
  const args = [];

  tag && args.push(`--tag ${ tag }`);
  registry && args.push(`--registry ${ registry }`);
  dryRun && args.push('--dry-run');

  return exec(`npm publish ${ args.join(' ') }`, { cwd }).then(() => code);
}

module.exports = function({ cwd, name, version, registry, tag, force, dryRun, silent }) {
  const log = logger.create({ silent });

  return find({ cwd, name, version, registry })
    .then((code) => {
      if (!force && code === resultCode.SAME_VERSION) {
        log.info(`Package ${ bold(name) } is up-to-date, no more action required`);
        process.exit(resultCode.SAME_VERSION);
      }

      return code;
    })
    .then((code) =>
      publish({
        code,
        cwd,
        registry,
        tag,
        dryRun
      }))
    .then((code) => {
      if (code === resultCode.NEW_VERSION) {
        log.info(
          `Package ${ bold(blue(name)) } has been updated to v${ bold(blue(version)) } ${
            tag ? `with tag${ bold(green(tag)) }` : ''
          }`
        );
      } else {
        log.info(
          `Package ${ bold(green(name)) } has been created with v${ bold(green(version)) } ${
            tag ? `with tag${ bold(green(tag)) }` : ''
          }`
        );
      }
    })
    .catch((error) => {
      log.error(
        `Error publishing ${ bold(red(name)) } to v${ bold(red(version)) } ${ tag ? `with tag${ bold(red(tag)) }` : '' } `
      );
      log.error(error);

      process.exit(resultCode.ERROR);
    });
};
