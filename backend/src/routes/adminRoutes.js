import { Router } from 'express';
import {
  analytics, assignCase, assignCaseSchema,
  auditLogs, dashboard, databaseStatus
} from '../controllers/adminController.js';
import { updateReport, updateReportSchema } from '../controllers/reportController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = Router();

router.use(authenticate, authorizeRoles('admin', 'analyst'));
router.get('/dashboard', dashboard);
router.get('/analytics', analytics);
router.get('/audit-logs', auditLogs);
router.get('/database-status', databaseStatus);
router.put('/report-review', validate(updateReportSchema), asyncHandler(updateReport));
router.put('/assign-case', validate(assignCaseSchema), asyncHandler(assignCase));

export default router;
