import Table from '../../service/table';
import * as Router from 'koa-router';
const router = new Router();

router.get('/table',Table.getTableData);
router.post('/table/delete',Table.removeFile);

export default router;