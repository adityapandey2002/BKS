const express = require('express');
const {
  submitContact,
  getAllContacts,
  getContact,
  updateContact,
  addNote,
  deleteContact
} = require('../controllers/contactController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

// Public route - submit contact form
router.post('/submit', submitContact);

// Protected routes - Admin and Support only
router.use(protect);
router.use(restrictTo('admin', 'support'));

router.get('/', getAllContacts);
router.get('/:id', getContact);
router.patch('/:id', updateContact);
router.post('/:id/notes', addNote);
router.delete('/:id', restrictTo('admin'), deleteContact);

console.log('✅ Contact routes loaded');

module.exports = router;
