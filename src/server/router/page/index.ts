import Render from '../../service/render';
import * as Router from 'koa-router';
const router = new Router();

router.get('/p-trend',Render.renderHtml);

export default router;