import Graph from '../../service/graph';
import * as Router from 'koa-router';
const router = new Router();

router.get('/graph',Graph.getFileNodes);

export default router;