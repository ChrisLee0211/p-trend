import * as static_ from 'koa-static';
import * as path from 'path';

export const StaticMeddleware = () => {
    return static_(
        path.join(__dirname, '../assets'),
        {
            setHeaders(res, path){
                const pathSplit = (path as string).split('.');
                if(pathSplit.includes('js')) {
                    res.setHeader('Content-Type', 'text/javascript');
                }
                if(pathSplit.includes('css')) {
                    res.setHeader('Content-Type', 'text/css');
                }
            }
        }
    );
};