#!/usr/bin/env node
import { PraserCtr } from './core/praser';
import { ScanerCtr } from './core/scaner';
declare const _default: {
    Scaner: typeof ScanerCtr;
    Parser: typeof PraserCtr;
};
export default _default;
