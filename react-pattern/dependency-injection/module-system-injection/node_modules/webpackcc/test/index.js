import * as dom from './dom';
import * as time from './time';
import pulse from './pulse';
require('./styles.less');
// const markdown = require('./code.md');
// console.log(markdown);
// If you add --config ./webpack.config.js in wcf command, you can open this comment!
// require('./styles.module.css');
const UPDATE_INTERVAL = 1000; // milliseconds
const intervalId = window.setInterval(() => {
    dom.writeTextToElement('upTime', time.getElapsedSeconds() + ' seconds');
    dom.writeTextToElement('lastPulse', pulse());
}, UPDATE_INTERVAL);
// Activate Webpack HMR
// if (module.hot) {
//     module.hot.accept();
//     // dispose handler
//     module.hot.dispose(() => {
//         window.clearInterval(intervalId);
//     });
// }
