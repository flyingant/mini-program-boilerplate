/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { ENABLE_DEBUGGER_MESSAGE } from '../project.constants.js';
const log = (...args) => ENABLE_DEBUGGER_MESSAGE && console.log(...args);
export default log;
