"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearLog = exports.progressBar = exports.log = void 0;
const chalk = require("chalk");
const sLog = require("single-line-log2");
exports.log = (txt, infoType) => {
    switch (infoType) {
        case "success":
            console.log(chalk.green.bold(txt));
            break;
        case "warning":
            console.log(chalk.yellow.bold(txt));
            break;
        case "danger":
            console.log(chalk.red.bold(txt));
            break;
        default:
            console.log(chalk.green.bold(txt));
    }
};
exports.progressBar = (desc, num, total = 100) => {
    const len = 25;
    const percent = (num / total);
    const cellLength = Math.floor(percent * len);
    let cellItem = "█";
    let emptyItem = "░";
    for (let i = 0; i < len; i++) {
        if (i <= cellLength) {
            cellItem += "█";
        }
        else {
            emptyItem += "░";
        }
    }
    sLog.stdout(chalk.green.bold(`${desc}: ${cellItem}${emptyItem} ${(percent * 100).toFixed(2)}%`));
};
exports.clearLog = () => {
    sLog.stdout.clear();
};
