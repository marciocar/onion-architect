/**
 * @onion/cli - Main exports
 */

module.exports = {
  // Commands
  initCommand: require('./commands/init'),
  addCommand: require('./commands/add'),
  migrateCommand: require('./commands/migrate'),
  validateCommand: require('./commands/validate'),
  helpCommand: require('./commands/help'),
  
  // Wizard
  WizardSteps: require('./wizard/steps'),
  Detector: require('./wizard/detector'),
  
  // Generators
  StructureGenerator: require('./generator/structure'),
  ConfigGenerator: require('./generator/config'),
  LoadersGenerator: require('./generator/loaders'),
  TemplatesGenerator: require('./generator/templates'),
  
  // Utils
  logger: require('./utils/logger'),
  constants: require('./constants')
};

