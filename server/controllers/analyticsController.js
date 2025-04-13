import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'
import Link from '../models/Link.js'
import ClickEvent from '../models/ClickEvent.js'

export const getLinkAnalytics = asyncHandler(async (req, res) => {
  const link = await Link.findById(req.params.id);

  if (!link) {
    res.status(404);
    throw new Error('Link not found');
  }

  // Check if user owns the link
  if (link.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view analytics for this link');
  }

  const clickEvents = await ClickEvent.find({ linkId: link._id }).sort({ timestamp: 1 });

  const clicksByDay = await ClickEvent.aggregate([
    { $match: { linkId:new mongoose.Types.ObjectId(link._id) } },
    {
      $group: {
        _id: {
          year: { $year: "$timestamp" },
          month: { $month: "$timestamp" },
          day: { $dayOfMonth: "$timestamp" }
        },
        count: { $sum: 1 },
        date: { $first: "$timestamp" }
      }
    },
    { $sort: { date: 1 } },
    { 
      $project: {
        _id: 0,
        date: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" }
        },
        count: 1
      }
    }
  ]);

  const deviceStats = await ClickEvent.aggregate([
    { $match: { linkId:new  mongoose.Types.ObjectId(link._id) } },
    {
      $group: {
        _id: "$device",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        device: "$_id",
        count: 1
      }
    }
  ]);

  const browserStats = await ClickEvent.aggregate([
    { $match: { linkId:new mongoose.Types.ObjectId(link._id) } },
    {
      $group: {
        _id: "$browser",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        browser: "$_id",
        count: 1
      }
    }
  ]);

  const osStats = await ClickEvent.aggregate([
    { $match: { linkId:new mongoose.Types.ObjectId(link._id) } },
    {
      $group: {
        _id: "$os",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        os: "$_id",
        count: 1
      }
    }
  ]);

  const locationStats = await ClickEvent.aggregate([
    { $match: { linkId: new mongoose.Types.ObjectId(link._id) } },
    {
      $group: {
        _id: "$location.country",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        country: "$_id",
        count: 1
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
  
  res.json({
    link,
    totalClicks: link.clicks,
    clicksByDay,
    deviceStats,
    browserStats,
    osStats,
    locationStats,
    recentClicks: clickEvents.slice(-10).reverse()
  });
});

export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const links = await Link.find({ userId: req.user._id });
  const linkIds = links.map(link => link._id);

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const clicksByDay = await ClickEvent.aggregate([
    { 
      $match: { 
        linkId: { $in: linkIds.map(id =>new mongoose.Types.ObjectId(id)) },
        timestamp: { $gte: thirtyDaysAgo }
      } 
    },
    {
      $group: {
        _id: {
          year: { $year: "$timestamp" },
          month: { $month: "$timestamp" },
          day: { $dayOfMonth: "$timestamp" }
        },
        count: { $sum: 1 },
        date: { $first: "$timestamp" }
      }
    },
    { $sort: { date: 1 } },
    { 
      $project: {
        _id: 0,
        date: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" }
        },
        count: 1
      }
    }
  ]);
  const deviceStats = await ClickEvent.aggregate([
    { $match: { linkId: { $in: linkIds.map(id => mongoose.Types.ObjectId(id)) } } },
    {
      $group: {
        _id: "$device",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        device: "$_id",
        count: 1
      }
    }
  ]);

  const topLinks = await Link.find({ userId: req.user._id })
    .sort({ clicks: -1 })
    .limit(5);

  res.json({
    totalLinks: links.length,
    totalClicks,
    clicksByDay,
    deviceStats,
    topLinks
  });
});

