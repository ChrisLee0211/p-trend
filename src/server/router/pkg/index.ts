import Package from '../../service/pkg';
import * as Router from 'koa-router';
const router = new Router();

router.get('/pkg',Package.getPackageList);

export default router;