/* eslint-disable import/no-duplicates,import/order */
import { logger } from 'ew-internals';
import lodash from './lib/lodash';

declare const _ = lodash;
declare const logger = logger;
declare const __DEV__;
declare const __TEST__;
