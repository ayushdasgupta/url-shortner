import UAParser from 'ua-parser-js'
import geoip from 'geoip-lite'
import ClickEvent from '../models/ClickEvent.js'
import Link from '../models/Link.js'

/**
 * Middleware to log analytics data when a shortened URL is accessed
 */
export const logClickEvent = async (linkId, req) => {
  try {
    // Get IP address
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Parse user agent
    const parser = new UAParser(req.headers['user-agent']);
    const userAgent = req.headers['user-agent'];
    const browserInfo = parser.getBrowser();
    const osInfo = parser.getOS();
    const deviceInfo = parser.getDevice();
    
    // Get geo location from IP
    const geo = geoip.lookup(ipAddress);
    
    // Create click event
    const clickEvent = new ClickEvent({
      linkId,
      ipAddress,
      userAgent,
      device: deviceInfo.type || 'unknown',
      browser: browserInfo.name || 'unknown',
      os: osInfo.name || 'unknown',
      location: geo ? {
        country: geo.country,
        city: geo.city
      } : {
        country: 'unknown',
        city: 'unknown'
      }
    });
    
    // Increment link click counter
    await Link.findByIdAndUpdate(linkId, { $inc: { clicks: 1 } });
    
    // Save click event
    await clickEvent.save();
  } catch (error) {
    console.error('Error logging click event:', error);
    // Don't throw an error to avoid disrupting user experience
  }
};
