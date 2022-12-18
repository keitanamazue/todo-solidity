const TaskContract = artifacts.require("TaskContract");

module.exports = function (deployer) {
  // deployment steps
  deployer.deploy(TaskContract);
};
