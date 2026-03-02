import React, { useState, useEffect } from 'react';
import API from '../api';
import type { Message, NewMessage } from '../types/message';
import { getErrorMessage } from '../types/errors';

interface MessagePortalProps {
  compact?: boolean;
}

const MessagePortal: React.FC<MessagePortalProps> = ({ compact = false }) => {
  const [view, setView] = useState<'inbox' | 'compose'>('inbox');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState<NewMessage>({
    recipientId: '',
    subject: '',
    content: ''
  });
  const [recipients, setRecipients] = useState<Array<{ _id: string; name: string; role: string }>>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
    fetchRecipients();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await API.get('/messages');
      setMessages(response.data);
      setError('');
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipients = async () => {
    try {
      const response = await API.get('/users');
      setRecipients(response.data);
    } catch (err: unknown) {
      console.error('Failed to fetch recipients');
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await API.put(`/messages/${messageId}/read`);
      setMessages(messages.map(msg =>
        msg._id === messageId ? { ...msg, read: true } : msg
      ));
    } catch (err: unknown) {
      console.error('Failed to mark message as read');
    }
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (!message.read) {
      markAsRead(message._id);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');

    try {
      const response = await API.post('/messages', newMessage);
      setMessages([response.data, ...messages]);
      setNewMessage({ recipientId: '', subject: '', content: '' });
      setView('inbox');
      setError('');
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  const unreadCount = messages.filter(msg => !msg.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A6741]"></div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow ${compact ? 'p-4' : 'p-6'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          📨 Messages
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
              {unreadCount}
            </span>
          )}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setView('inbox')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              view === 'inbox'
                ? 'bg-[#4A6741] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            📥 Inbox
          </button>
          <button
            onClick={() => setView('compose')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              view === 'compose'
                ? 'bg-[#4A6741] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ✏️ Compose
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Inbox View */}
      {view === 'inbox' && (
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>📭 No messages yet</p>
            </div>
          ) : selectedMessage ? (
            <div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="mb-4 text-[#4A6741] hover:text-[#3A5531] font-medium text-sm flex items-center gap-1"
              >
                ← Back to Inbox
              </button>
              <div className="border rounded-lg p-4">
                <div className="border-b pb-3 mb-3">
                  <h4 className="font-bold text-lg text-gray-800">{selectedMessage.subject}</h4>
                  <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">From:</span> {selectedMessage.sender.name}
                      <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                        {selectedMessage.sender.role}
                      </span>
                    </div>
                    <span className="text-xs">
                      {new Date(selectedMessage.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="text-gray-700 whitespace-pre-wrap">{selectedMessage.content}</div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((message) => (
                <div
                  key={message._id}
                  onClick={() => handleMessageClick(message)}
                  className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
                    !message.read ? 'bg-blue-50 border-blue-200' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {!message.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                        <h4 className={`font-semibold text-gray-800 ${!message.read ? 'font-bold' : ''}`}>
                          {message.subject}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        From: {message.sender.name}
                        <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded">
                          {message.sender.role}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{message.content}</p>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Compose View */}
      {view === 'compose' && (
        <form onSubmit={handleSendMessage} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient
            </label>
            <select
              value={newMessage.recipientId}
              onChange={(e) => setNewMessage({ ...newMessage, recipientId: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
            >
              <option value="">Select a recipient...</option>
              {recipients.map((recipient) => (
                <option key={recipient._id} value={recipient._id}>
                  {recipient.name} ({recipient.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={newMessage.subject}
              onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
              required
              placeholder="Message subject..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={newMessage.content}
              onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
              required
              rows={6}
              placeholder="Type your message here..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={sending}
              className="flex-1 bg-[#4A6741] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#3A5531] transition-colors disabled:bg-gray-400"
            >
              {sending ? 'Sending...' : '📤 Send Message'}
            </button>
            <button
              type="button"
              onClick={() => {
                setView('inbox');
                setNewMessage({ recipientId: '', subject: '', content: '' });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MessagePortal;
