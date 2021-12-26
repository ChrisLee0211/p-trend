declare type infoColor = "success" | "warning" | "danger";
export declare const log: (txt: string, infoType: infoColor) => void;
export declare const progressBar: (desc: string, num: number, total?: number) => void;
export declare const clearLog: () => void;
export {};
