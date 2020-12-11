/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { ENABLE_DEBUGGER_MESSAGE } from '../constants.js';

const log = (...args) => ENABLE_DEBUGGER_MESSAGE && console.log(...args);
export default log;
