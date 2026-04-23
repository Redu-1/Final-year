// backend/routes/ratingRoutes.js
const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const User = require('../models/User');
const Herb = require('../models/Herb');
const { authenticateToken } = require('../middleware/auth');

// Get all ratings for a herb (public - no auth needed)
router.get('/herb/:herbId', async (req, res) => {
  try {
    const { herbId } = req.params;
    
    const ratings = await Rating.findAll({
      where: { herb_id: herbId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    // Calculate average rating
    const total = ratings.reduce((sum, r) => sum + r.rating_value, 0);
    const average = ratings.length > 0 ? total / ratings.length : 0;
    
    res.json({
      success: true,
      data: ratings,
      average: average,
      total: ratings.length
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch ratings' });
  }
});

// ✅ ADD THIS ENDPOINT - Get user's rating for a specific herb
router.get('/herb/:herbId/user', authenticateToken, async (req, res) => {
  try {
    const { herbId } = req.params;
    const userId = req.user.id;
    
    console.log(`🔍 Fetching rating for user ${userId} on herb ${herbId}`);
    
    const rating = await Rating.findOne({
      where: { herb_id: herbId, user_id: userId }
    });
    
    res.json({
      success: true,
      data: rating || null
    });
  } catch (error) {
    console.error('Error fetching user rating:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user rating' });
  }
});

// Create or update rating
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { herbId, ratingValue, comment } = req.body;
    const userId = req.user.id;
    
    console.log(`📝 Submitting rating - User: ${userId}, Herb: ${herbId}, Rating: ${ratingValue}`);
    
    if (!herbId || !ratingValue || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ success: false, message: 'Invalid rating data' });
    }
    
    // Check if herb exists
    const herb = await Herb.findByPk(herbId);
    if (!herb) {
      return res.status(404).json({ success: false, message: 'Herb not found' });
    }
    
    // Check if user already rated this herb
    let rating = await Rating.findOne({
      where: { herb_id: herbId, user_id: userId }
    });
    
    if (rating) {
      // Update existing rating
      rating.rating_value = ratingValue;
      rating.comment = comment || null;
      rating.updated_at = new Date();
      await rating.save();
      
      console.log(`✅ Rating updated for user ${userId} on herb ${herbId}`);
      
      res.json({
        success: true,
        message: 'Rating updated successfully',
        data: rating
      });
    } else {
      // Create new rating
      rating = await Rating.create({
        herb_id: herbId,
        user_id: userId,
        rating_value: ratingValue,
        comment: comment || null
      });
      
      console.log(`✅ New rating created for user ${userId} on herb ${herbId}`);
      
      res.json({
        success: true,
        message: 'Rating submitted successfully',
        data: rating
      });
    }
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ success: false, message: 'Failed to submit rating' });
  }
});

// Delete rating (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const ratingId = req.params.id;
    const userRole = req.user.role;
    
    if (userRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const rating = await Rating.findByPk(ratingId);
    if (!rating) {
      return res.status(404).json({ success: false, message: 'Rating not found' });
    }
    
    await rating.destroy();
    
    res.json({
      success: true,
      message: 'Rating deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).json({ success: false, message: 'Failed to delete rating' });
  }
});

module.exports = router;