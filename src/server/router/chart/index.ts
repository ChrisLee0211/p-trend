import Chart from '../../service/chart';
import * as Router from 'koa-router';
const router = new Router();

router.get('/chart/size',Chart.getFileNodeSizeChart);
router.get('/chart/deps',Chart.getDependenceChart);
router.get('/chart/reference',Chart.getReferenceChart);
router.get('/chart/types',Chart.getTypeChart);

export default router;