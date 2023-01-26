const logger = require('winston');
const i18n = require('i18n');
const path = require('path');
const mongoosedb = require('@microrealestate/common/models/db');
const { restoreDB } = require('../scripts/dbbackup');

const config = require('./config');
const server = require('./server');
const db = require('./models/db');
const migratedb = require('../scripts/migration');

require('@microrealestate/common/utils/httpinterceptors')();

process.on('SIGINT', () => {
  //TODO disconnect db (mongojs)
  process.exit(0);
});

i18n.configure({
  locales: ['en', 'fr-FR', 'pt-BR', 'de-DE'],
  directory: path.join(__dirname, 'locales'),
  updateFiles: false,
});

async function startService() {
  try {
    if (config.restoreDatabase) {
      logger.debug('restoring database from backup');
      await restoreDB();
      logger.debug('database restored');
    }

    // migrate db to the new models
    await migratedb();

    await db.init();
    await mongoosedb.connect();

    server.listen(config.appHttpPort, () => {
      config.log();
      logger.info('Listening port ' + config.appHttpPort);
      if (config.productive) {
        logger.info('In production mode');
      } else {
        logger.info('In development mode');
      }
    });
  } catch (err) {
    logger.error(err);
    try {
      await mongoosedb.disconnect();
    } catch (error) {
      logger.error(error);
    }
    process.exit(1);
  }
}

startService();
