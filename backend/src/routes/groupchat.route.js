import express from 'express';
import { sendMessages,getMessages,deleteMessage,getUnreadMessagesCount ,editMessage} from '../controllers/groupchat.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
const router = express.Router();

router.post('/send/:id', protectRoute, sendMessages);
router.get('/get/:id', protectRoute, getMessages);
router.put('/edit/:id', protectRoute, editMessage);

router.delete('/delete/:id', protectRoute, deleteMessage);
router.get('/unread/:id', protectRoute, getUnreadMessagesCount);

export default router;