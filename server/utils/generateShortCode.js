import {nanoid} from 'nanoid'
import Link from '../models/Link.js'

const generateShortCode = async (length = 6) => {
  let shortCode = nanoid(length);
  let codeExists = await Link.findOne({ shortCode });
  
  while (codeExists) {
    shortCode = nanoid(length);
    codeExists = await Link.findOne({ shortCode });
  }
  
  return shortCode;
};

export default generateShortCode;