import UAParser from 'ua-parser-js'
import geoip from 'geoip-lite'
import ClickEvent from '../models/ClickEvent.js'
import Link from '../models/Link.js'


export const logClickEvent = async (linkId, req,ipAddress) => {
  try {
    const parser = new UAParser(req.headers['user-agent']);
    const userAgent = req.headers['user-agent'];
    const browserInfo = parser.getBrowser();
    const osInfo = parser.getOS();
    const deviceInfo = parser.getDevice();

    const geo = geoip.lookup(ipAddress);

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
    
    await Link.findByIdAndUpdate(linkId, { $inc: { clicks: 1 } });
    
    await clickEvent.save();
  } catch (error) {
    console.error('Error logging click event:', error);
   
  }
};
