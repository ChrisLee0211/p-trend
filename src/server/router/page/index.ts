import Render from '../../service/render';
import * as Router from 'koa-router';
const router = new Router();

router.get('/unusee',Render.renderHtml);

export default router;