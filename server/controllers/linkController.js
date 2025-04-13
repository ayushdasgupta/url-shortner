import asyncHandler from 'express-async-handler'
import Link from '../models/Link.js'
import generateShortCode from '../utils/generateShortCode.js'

export const createLink = asyncHandler(async (req, res) => {
  const { originalUrl, customAlias, expiresAt } = req.body;

  try {
    new URL(originalUrl);
  } catch (err) {
    res.status(400);
    throw new Error('Invalid URL format');
  }

  if (customAlias) {
    const existingAlias = await Link.findOne({ shortCode: customAlias });
    if (existingAlias) {
      res.status(400);
      throw new Error('Custom alias already in use');
    }
  }

  const shortCode = customAlias || await generateShortCode();

  const link = await Link.create({
    originalUrl,
    shortCode,
    customAlias: customAlias ? customAlias : null,
    userId: req.user._id,
    expiresAt: expiresAt ? new Date(expiresAt) : null
  });

  res.status(201).json(link);
});


export const getLinks = asyncHandler(async (req, res) => {
  const links = await Link.find({ userId: req.user._id })
    .sort({ createdAt: -1 });

  res.json(links);
});


export const deleteLink = asyncHandler(async (req, res) => {
  const link = await Link.findById(req.params.id);

  if (!link) {
    res.status(404);
    throw new Error('Link not found');
  }

  if (link.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this link');
  }

  await link.deleteOne();
  res.json({ message: 'Link removed' });
});
