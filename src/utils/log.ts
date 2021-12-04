import * as chalk from "chalk";
import * as sLog from "single-line-log2";

type infoColor = "success" | "warning" | "danger"

export const log = (txt:string, infoType:infoColor) => {
    switch(infoType){
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

export const progressBar = (desc:string, num:number, total=100) => {
    const len = 25;
    const percent = (num/total);
    const cellLength = Math.floor(percent * len);
    let cellItem = "█";
    let emptyItem = "░";
    for(let i = 0; i < len;i++){
        if(i<=cellLength){
            cellItem += "█";
        }else{
            emptyItem += "░";
        }
    }

    sLog.stdout(chalk.green.bold(`${desc}: ${cellItem}${emptyItem} ${(percent * 100).toFixed(2)}%`));
};

export const clearLog = () => {
    sLog.stdout.clear();
};