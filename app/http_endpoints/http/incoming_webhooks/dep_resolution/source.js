exports = function () {
  const _ = require("lodash");
  const moment = require("moment");

  return {
    lodash_result: _.sum([4, 2, 8, 6]),
    moment_result: moment().format("MMMM Do YYYY, h:mm:ss a")
  };
};
