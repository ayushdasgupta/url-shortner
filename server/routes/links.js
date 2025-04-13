import express from 'express'
const router = express.Router();
import {createLink,getLinks,deleteLink} from '../controllers/linkController.js'
import {getLinkAnalytics} from '../controllers/analyticsController.js'
import {protect} from '../middleware/auth.js'

router.use(protect);


router.post('/', createLink);


router.get('/', getLinks);

router.delete('/:id', deleteLink);

router.get('/:id/analytics', getLinkAnalytics);

export default router;