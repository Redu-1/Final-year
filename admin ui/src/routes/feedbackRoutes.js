// backend/routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { authenticateToken } = require('../middleware/auth');

// ==================== PUBLIC ROUTES (No Auth Required) ====================

// Submit feedback (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }
    if (message.length < 10) {
      return res.status(400).json({ success: false, message: 'Message must be at least 10 characters' });
    }
    
    const feedback = await Feedback.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      status: 'new'
    });
    
    console.log(`📝 New feedback submitted from ${name} (${email})`);
    
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        id: feedback.id,
        name: feedback.name,
        email: feedback.email,
        message: feedback.message,
        created_at: feedback.created_at
      }
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ success: false, message: 'Failed to submit feedback' });
  }
});

// ==================== ADMIN ROUTES (Auth Required) ====================

// Get all feedback (admin only)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const feedbacks = await Feedback.findAll({
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      data: feedbacks,
      total: feedbacks.length
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch feedback' });
  }
});

// Get feedback by ID (admin only)
router.get('/admin/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const feedback = await Feedback.findByPk(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }
    
    res.json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch feedback' });
  }
});

// Update feedback status (admin only)
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const { status } = req.body;
    const validStatuses = ['new', 'read', 'replied', 'archived'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    const feedback = await Feedback.findByPk(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }
    
    feedback.status = status;
    feedback.updated_at = new Date();
    
    if (status === 'replied') {
      feedback.responded_at = new Date();
    }
    
    await feedback.save();
    
    console.log(`📝 Feedback ${feedback.id} status updated to ${status}`);
    
    res.json({
      success: true,
      message: 'Status updated successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Error updating feedback status:', error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

// Add admin response to feedback (admin only)
router.post('/:id/respond', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const { admin_response } = req.body;
    if (!admin_response || !admin_response.trim()) {
      return res.status(400).json({ success: false, message: 'Response message is required' });
    }
    
    const feedback = await Feedback.findByPk(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }
    
    feedback.admin_response = admin_response.trim();
    feedback.status = 'replied';
    feedback.responded_at = new Date();
    feedback.updated_at = new Date();
    await feedback.save();
    
    console.log(`📝 Admin responded to feedback ${feedback.id}`);
    
    res.json({
      success: true,
      message: 'Response added successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Error adding response:', error);
    res.status(500).json({ success: false, message: 'Failed to add response' });
  }
});

// Delete feedback (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const feedback = await Feedback.findByPk(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }
    
    await feedback.destroy();
    
    console.log(`🗑️ Feedback ${req.params.id} deleted by admin`);
    
    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ success: false, message: 'Failed to delete feedback' });
  }
});

// Get statistics (admin only)
router.get('/admin/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    
    const total = await Feedback.count();
    const new_count = await Feedback.count({ where: { status: 'new' } });
    const read_count = await Feedback.count({ where: { status: 'read' } });
    const replied_count = await Feedback.count({ where: { status: 'replied' } });
    const archived_count = await Feedback.count({ where: { status: 'archived' } });
    
    res.json({
      success: true,
      data: {
        total,
        new: new_count,
        read: read_count,
        replied: replied_count,
        archived: archived_count
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
});

module.exports = router;