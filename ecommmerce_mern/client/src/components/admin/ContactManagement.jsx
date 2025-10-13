import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);
  const [noteText, setNoteText] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const { data } = await axios.get(`${API_URL}/contacts${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(data.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [filter]);

  const handleStatusChange = async (contactId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/contacts/${contactId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchContacts();
      alert('Status updated');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAddNote = async (contactId) => {
    if (!noteText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/contacts/${contactId}/notes`,
        { text: noteText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNoteText('');
      fetchContacts();
      alert('Note added');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contact Inquiries</h2>
        <div className="flex gap-2">
          {['all', 'new', 'in-progress', 'resolved'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg capitalize ${
                filter === f ? 'bg-orange-600 text-white' : 'bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : contacts.length === 0 ? (
        <p className="text-gray-600">No inquiries found</p>
      ) : (
        <div className="grid gap-4">
          {contacts.map((contact) => (
            <div key={contact._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{contact.name}</h3>
                  <p className="text-gray-600">{contact.email}</p>
                  {contact.phone && <p className="text-gray-600">{contact.phone}</p>}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(contact.status)}`}>
                  {contact.status}
                </span>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-900">Subject:</h4>
                <p>{contact.subject}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-900">Message:</h4>
                <p className="text-gray-700">{contact.message}</p>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => handleStatusChange(contact._id, 'in-progress')}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleStatusChange(contact._id, 'resolved')}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Resolve
                </button>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Add a note..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full px-4 py-2 border rounded mb-2"
                />
                <button
                  onClick={() => handleAddNote(contact._id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Note
                </button>
              </div>

              {contact.notes && contact.notes.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-semibold mb-2">Notes:</h4>
                  {contact.notes.map((note, idx) => (
                    <div key={idx} className="bg-gray-50 p-2 rounded mb-2">
                      <p className="text-sm">{note.text}</p>
                      <p className="text-xs text-gray-500">
                        {note.addedBy?.name} - {new Date(note.addedAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactManagement;
