import Package from '../../service/pkg';
import * as Router from 'koa-router';
const router = new Router();

router.get('/pkg',Package.getPackageList);
router.post('/pkg/readContent',Package.readReferenceFile);

export default router;
