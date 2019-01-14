import { ENABLE_DEBUGGER_MESSAGE } from '../project.constants.js';
const log = (...args) => ENABLE_DEBUGGER_MESSAGE && console.log(...args);
export default log;
