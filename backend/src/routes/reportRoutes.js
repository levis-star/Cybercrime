import { Router } from 'express';
import {
  createReport,
  createReportSchema,
  getReport,
  listCategories,
  trackingSchema,
  updateReport,
  updateReportSchema,
  uploadEvidenceFile
} from '../controllers/reportController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticate, optionalAuth } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { uploadEvidence } from '../middleware/uploadMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = Router();

router.get('/categories', listCategories);
router.post('/create', optionalAuth, validate(createReportSchema), asyncHandler(createReport));
router.get('/:trackingCode', validate(trackingSchema), getReport);
router.put('/update', authenticate, authorizeRoles('admin', 'analyst'), validate(updateReportSchema), asyncHandler(updateReport));
router.post('/:trackingCode/upload-evidence', uploadEvidence.single('evidence'), asyncHandler(uploadEvidenceFile));

export default router;
