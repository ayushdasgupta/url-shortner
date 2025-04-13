import express from 'express'
import Link from '../models/Link.js'
import {logClickEvent} from '../middleware/analytics.js'
const router = express.Router();

router.get('/:shortCode', async (req, res) => {
  try {
    const link = await Link.findOne({ shortCode: req.params.shortCode });
    
    if (!link) {
      return res.status(404).json({ message: 'URL not found' });
    }
    const {ip}=req.query
    if (link.expiresAt && link.isExpired()) {
      return res.status(410).json({ message: 'Link has expired' });
    }
    
    logClickEvent(link._id, req,ip).catch(err => {
      console.error('Error logging click event:', err);
    });
    
    return res.status(200).json({
      url:link.originalUrl
    });
  } catch (error) {
    console.error('Redirect error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;