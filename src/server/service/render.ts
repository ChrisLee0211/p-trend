import * as Koa from 'koa';
class RenderService {
    async renderHtml(ctx:Koa.Context,next:Koa.Next):Promise<void> {
        const port = ctx.state.port as number;
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
                <script type="module" crossorigin src="/index.0420c969.js"></script>
                <link rel="modulepreload" href="/vendor.e66d1d89.js">
                <link rel="stylesheet" href="/index.8276116f.css">
            </head>
            <body>
                <div id="app"></div>
                
            </body>
            </html>
        `;
        ctx.type = 'html';
        ctx.body = htmlContent;
        await next();
    }
}

export default new RenderService();