"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class RenderService {
    renderHtml(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const port = ctx.state.port;
            const mainfest = ctx.state.mainfest;
            const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Vite App</title>
                <script>
                    window.preloadState = {port:${port}}
                </script>
                <script type="module" crossorigin src="assets/${mainfest.index}"></script>
                <link rel="modulepreload" href="assets/${mainfest.vendor}">
                <link rel="stylesheet" href="assets/${mainfest.css}">
            </head>
            <body>
                <div id="app"></div>
                
            </body>
            </html>
        `;
            ctx.type = 'html';
            ctx.body = htmlContent;
            yield next();
        });
    }
}
exports.default = new RenderService();
