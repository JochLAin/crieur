#!/usr/bin/env node

const logger = require('./lib');

logger.log('Hello world');

logger.debug('Debug message');
logger.info('Info message');
logger.success('Success message');
logger.warning('Warning message');
logger.error('Error message');
logger.error(new Error('Message\n  with comment'));

logger.debug('Debug block', { block: true });
logger.info('Info block', { block: true });
logger.success('Success block', { block: true });
logger.warning('Warning block', { block: true });
logger.error('Error block', { block: true });

logger.table([
    ['Nom', 'Valeur'],
    ['x', 1],
    ['loonnnnng first value', 2],
    ['c', 'loooooonnnnng second value'],
    [3, 'a'],
]);

logger.level = 1;
logger.debug('Debug message');
logger.info('Info message');
logger.success('Success message');
