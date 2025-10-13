const Contact = require('../models/Contact');
const User = require('../models/User');
const { sendContactNotification, sendCustomerConfirmation } = require('../services/emailService');

// Submit contact form
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Create contact inquiry
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      status: 'new'
    });

    console.log('✅ Contact inquiry created:', contact._id);

    // Get admin and support staff emails
    const adminsAndSupport = await User.find({
      role: { $in: ['admin', 'support'] }
    }).select('email');

    const recipients = adminsAndSupport.map(user => user.email);

    // Send notifications
    if (recipients.length > 0) {
      await sendContactNotification({
        name,
        email,
        phone,
        subject,
        message
      }, recipients);
    }

    // Send confirmation to customer
    await sendCustomerConfirmation({ name, email, subject, message });

    res.status(201).json({
      status: 'success',
      message: 'Your message has been sent successfully. We will get back to you soon!',
      data: contact
    });
  } catch (error) {
    console.error('❌ Error submitting contact:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get all contacts (Admin/Support only)
exports.getAllContacts = async (req, res) => {
  try {
    const { status, priority } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // If support staff, show only assigned to them or unassigned
    if (req.user.role === 'support') {
      filter.$or = [
        { assignedTo: req.user._id },
        { assignedTo: null }
      ];
    }

    const contacts = await Contact.find(filter)
      .populate('assignedTo', 'name email')
      .populate('notes.addedBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('❌ Error fetching contacts:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get single contact
exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('notes.addedBy', 'name');

    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact not found'
      });
    }

    // Check permission
    if (req.user.role === 'support' && 
        contact.assignedTo && 
        contact.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized'
      });
    }

    res.status(200).json({
      status: 'success',
      data: contact
    });
  } catch (error) {
    console.error('❌ Error fetching contact:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update contact status
exports.updateContact = async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact not found'
      });
    }

    if (status) contact.status = status;
    if (priority) contact.priority = priority;
    if (assignedTo !== undefined) contact.assignedTo = assignedTo;

    if (status === 'resolved' && !contact.resolvedAt) {
      contact.resolvedAt = new Date();
    }

    await contact.save();

    console.log('✅ Contact updated:', contact._id);

    res.status(200).json({
      status: 'success',
      data: contact
    });
  } catch (error) {
    console.error('❌ Error updating contact:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Add note to contact
exports.addNote = async (req, res) => {
  try {
    const { text } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact not found'
      });
    }

    contact.notes.push({
      text,
      addedBy: req.user._id,
      addedAt: new Date()
    });

    await contact.save();

    const updatedContact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('notes.addedBy', 'name');

    res.status(200).json({
      status: 'success',
      data: updatedContact
    });
  } catch (error) {
    console.error('❌ Error adding note:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete contact (Admin only)
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact not found'
      });
    }

    console.log('🗑️ Contact deleted:', req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting contact:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
