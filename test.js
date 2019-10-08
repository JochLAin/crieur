#!/usr/bin/env node

const logger = require('./lib');

logger.log('Hello world');

logger.debug('Debug message');
logger.info('Info message');
logger.warning('Warning message');
logger.error('Error message');
logger.success('Success message');

console.log('');
logger.debug('Debug message', { block: true });
console.log('');
logger.info('Info message', { block: true });
console.log('');
logger.warning('Warning message', { block: true });
console.log('');
logger.error('Error message', { block: true });
console.log('');
logger.success('Success message', { block: true });
