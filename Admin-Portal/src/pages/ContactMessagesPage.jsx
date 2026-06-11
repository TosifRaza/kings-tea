import { useState, useEffect } from 'react';
import { Mail, MailOpen, Eye, RefreshCw } from 'lucide-react';
import DataTable from '../components/DataTable';
import { getContactMessages, markContactRead } from '../services/api';

const ContactMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await getContactMessages();
      const data = res.data;
      setMessages(Array.isArray(data) ? data : data.messages || data.items || []);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markContactRead(id);
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, read: true } : m))
      );
      if (selectedMessage?._id === id) {
        setSelectedMessage((prev) => ({ ...prev, read: true }));
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    if (!message.read) {
      handleMarkRead(message._id);
    }
  };

  const columns = [
    {
      key: 'read',
      label: '',
      width: '40px',
      render: (value) => (
        <div className="flex items-center justify-center">
          {value ? (
            <MailOpen className="w-4 h-4 text-deep-walnut/30" />
          ) : (
            <div className="relative">
              <Mail className="w-4 h-4 text-royal-terracotta" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-royal-terracotta rounded-full" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'From',
      render: (value) => (
        <span
          className={`font-medium ${
            messages.find((m) => m.name === value && !m.read)
              ? 'text-deep-walnut'
              : 'text-deep-walnut/70'
          }`}
        >
          {value || '—'}
        </span>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => (
        <span className="text-deep-walnut/60 text-sm">{value || '—'}</span>
      ),
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (value, row) => (
        <span
          className={`text-sm ${
            row.read ? 'text-deep-walnut/60' : 'text-deep-walnut font-medium'
          }`}
        >
          {value || '—'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value) => (
        <span className="text-deep-walnut/50 text-sm">
          {value
            ? new Date(value).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : '—'}
        </span>
      ),
    },
  ];

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-deep-walnut font-playfair">
            Contact Messages
          </h1>
          <p className="text-sm text-deep-walnut/50 mt-1">
            View and manage contact form submissions
          </p>
        </div>
        <button
          onClick={loadMessages}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-deep-walnut/60 border border-imperial-gold/20 rounded-lg hover:bg-warm-ivory transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-imperial-gold/10 p-5">
          <p className="text-sm text-deep-walnut/50">Total Messages</p>
          <p className="text-2xl font-bold text-deep-walnut mt-1">
            {messages.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-imperial-gold/10 p-5">
          <p className="text-sm text-deep-walnut/50">Unread</p>
          <p className="text-2xl font-bold text-royal-terracotta mt-1">
            {unreadCount}
          </p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={messages}
        loading={loading}
        emptyMessage="No messages found"
        searchPlaceholder="Search messages..."
        actions={(row) => (
          <button
            onClick={() => handleViewMessage(row)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-tea-green bg-tea-green/10 rounded-lg hover:bg-tea-green/20 transition-colors"
          >
            <Eye className="w-3 h-3" />
            View
          </button>
        )}
      />

      {/* Message Detail Drawer */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-imperial-gold/10 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-deep-walnut font-playfair">
                Message Details
              </h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-deep-walnut/40 hover:text-deep-walnut text-2xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <p className="text-xs font-medium text-deep-walnut/40 uppercase tracking-wider">
                  From
                </p>
                <p className="font-medium text-deep-walnut mt-1">
                  {selectedMessage.name}
                </p>
                <p className="text-sm text-deep-walnut/60">
                  {selectedMessage.email}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-deep-walnut/40 uppercase tracking-wider">
                  Subject
                </p>
                <p className="font-medium text-deep-walnut mt-1">
                  {selectedMessage.subject || 'No subject'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-deep-walnut/40 uppercase tracking-wider">
                  Date
                </p>
                <p className="text-sm text-deep-walnut/70 mt-1">
                  {selectedMessage.createdAt
                    ? new Date(selectedMessage.createdAt).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-deep-walnut/40 uppercase tracking-wider">
                  Message
                </p>
                <div className="mt-2 p-4 bg-warm-ivory/60 rounded-lg">
                  <p className="text-sm text-deep-walnut whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.message || selectedMessage.content || 'No content'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessagesPage;
