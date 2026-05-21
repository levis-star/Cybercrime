import { Router } from 'express';
import { createAlert, createAlertSchema, listAlerts } from '../controllers/alertController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = Router();

router.get('/live', listAlerts);
router.post('/create', authenticate, authorizeRoles('admin', 'analyst'), validate(createAlertSchema), asyncHandler(createAlert));

export default router;
