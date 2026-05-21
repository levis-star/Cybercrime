import { Router } from 'express';
import { answerChatbot, chatbotSchema } from '../controllers/chatbotController.js';
import { validate } from '../middleware/validationMiddleware.js';

const router = Router();

router.post('/query', validate(chatbotSchema), answerChatbot);

export default router;
