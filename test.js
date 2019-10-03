#!/usr/bin/env node

const logger = require('./lib');

logger.log('Hello world');

logger.debug('Debug message');
logger.info('Info message');
logger.warning('Warning message');
logger.error('Error message');
logger.success('Success message');

logger.debug('Debug message', { block: true });
logger.info('Info message', { block: true });
logger.warning('Warning message', { block: true });
logger.error('Error message', { block: true });
logger.success('Success message', { block: true });
