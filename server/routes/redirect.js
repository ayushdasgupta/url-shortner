import express from 'express'
import Link from '../models/Link.js'
import {logClickEvent} from '../middleware/analytics.js'
const router = express.Router();

// @route   GET /:shortCode
// @desc    Redirect to original URL
// @access  Public
router.get('/:shortCode', async (req, res) => {
  try {
    const link = await Link.findOne({ shortCode: req.params.shortCode });
    
    if (!link) {
      return res.status(404).json({ message: 'URL not found' });
    }
    
    // Check if link is expired
    if (link.expiresAt && link.isExpired()) {
      return res.status(410).json({ message: 'Link has expired' });
    }
    
    // Log analytics asynchronously to not delay the redirect
    logClickEvent(link._id, req).catch(err => {
      console.error('Error logging click event:', err);
    });
    
    // Redirect to original URL
    return res.status(200).json({
      url:link.originalUrl
    });
  } catch (error) {
    console.error('Redirect error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;