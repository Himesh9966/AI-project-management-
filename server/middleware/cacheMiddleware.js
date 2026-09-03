const { getRedisClient } = require('../config/redis');

const cacheMiddleware = (keyPrefix) => {
  return async (req, res, next) => {
    const client = getRedisClient();
    if (!client || !client.isOpen) {
      return next(); // Skip caching if redis is not connected
    }

    // e.g. keyPrefix = "projects", req.user.id + req.originalUrl could be the key
    const key = `${keyPrefix}:${req.user.id}:${req.originalUrl}`;
    
    try {
      const cachedData = await client.get(key);
      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
      }
      
      // Override res.json to cache the response before sending
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        // Cache for 60 seconds
        client.setEx(key, 60, JSON.stringify(body)).catch(err => console.error('Redis cache error:', err));
        return originalJson(body);
      };
      
      next();
    } catch (error) {
      console.error('Redis error in middleware:', error);
      next();
    }
  };
};

const clearCache = (keyPrefix) => {
  return async (req, res, next) => {
    const client = getRedisClient();
    if (client && client.isOpen) {
      try {
        const pattern = `${keyPrefix}:${req.user.id}:*`;
        const keys = await client.keys(pattern);
        if (keys.length > 0) {
          await client.del(keys);
        }
      } catch (err) {
        console.error('Failed to clear cache', err);
      }
    }
    next();
  };
};

module.exports = { cacheMiddleware, clearCache };
