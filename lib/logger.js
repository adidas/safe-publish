/* eslint-disable */

const noop = function() {};
const loggerMethods = [ 'log', 'info', 'error' ];

module.exports = {
  create({ silent }) {
    return loggerMethods.reduce((logger, method) => {
      return {
        ...logger,
        [method]: silent ? noop : console[method].bind(console)
      };
    }, {});
  }
};
