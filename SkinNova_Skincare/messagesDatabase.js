// Messages Database Management System
// Handles customer messages and contact inquiries

class MessagesDatabase {
  constructor() {
    this.messagesKey = 'skincare_messages';
    this.messageIdKey = 'skincare_message_id_counter';
    this.init();
  }

  init() {
    // Initialize with sample data if database is empty
    if (!localStorage.getItem(this.messagesKey)) {
      this.initMessages();
    }
    // Initialize message ID counter
    if (!localStorage.getItem(this.messageIdKey)) {
      localStorage.setItem(this.messageIdKey, '100');
    }
  }

  initMessages() {
    const sampleMessages = [
      {
        messageId: 'MSG-101',
        senderName: 'Sarah Johnson',
        senderEmail: 'sarah.j@example.com',
        senderPhone: '+91 9876543210',
        subject: 'Product Inquiry',
        message: 'I would like to know more about the Vitamin C Serum product.',
        messageType: 'inquiry',
        status: 'read',
        createdDate: '2025-12-15',
        createdTime: '10:30 AM'
      },
      {
        messageId: 'MSG-102',
        senderName: 'Priya Sharma',
        senderEmail: 'priya.sharma@example.com',
        senderPhone: '+91 8765432109',
        subject: 'Feedback on Product',
        message: 'The moisturizer has been amazing! Great quality and delivery was fast.',
        messageType: 'feedback',
        status: 'read',
        createdDate: '2025-12-18',
        createdTime: '2:15 PM'
      }
    ];

    localStorage.setItem(this.messagesKey, JSON.stringify(sampleMessages));
  }

  // ============= CREATE MESSAGE =============
  createMessage(messageData) {
    const messages = this.getAllMessages();
    const messageId = 'MSG-' + this.getNextMessageId();
    const now = new Date();
    
    const newMessage = {
      messageId: messageId,
      senderName: messageData.senderName || '',
      senderEmail: messageData.senderEmail || '',
      senderPhone: messageData.senderPhone || '',
      subject: messageData.subject || '',
      message: messageData.message || '',
      messageType: messageData.messageType || 'general', // inquiry, feedback, complaint, support, general
      status: 'unread',
      createdDate: now.toISOString().split('T')[0],
      createdTime: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      adminReply: null,
      adminReplyDate: null
    };

    messages.push(newMessage);
    localStorage.setItem(this.messagesKey, JSON.stringify(messages));
    return newMessage;
  }

  // ============= GET MESSAGES =============
  getAllMessages() {
    const messages = localStorage.getItem(this.messagesKey);
    return messages ? JSON.parse(messages) : [];
  }

  getMessageById(messageId) {
    const messages = this.getAllMessages();
    return messages.find(msg => msg.messageId === messageId);
  }

  getMessagesByStatus(status) {
    const messages = this.getAllMessages();
    return messages.filter(msg => msg.status === status);
  }

  getMessagesByType(messageType) {
    const messages = this.getAllMessages();
    return messages.filter(msg => msg.messageType === messageType);
  }

  getUnreadMessages() {
    return this.getMessagesByStatus('unread');
  }

  getReadMessages() {
    return this.getMessagesByStatus('read');
  }

  // ============= UPDATE MESSAGE =============
  updateMessageStatus(messageId, status) {
    let messages = this.getAllMessages();
    const index = messages.findIndex(msg => msg.messageId === messageId);
    
    if (index !== -1) {
      messages[index].status = status;
      localStorage.setItem(this.messagesKey, JSON.stringify(messages));
      return messages[index];
    }
    return null;
  }

  addAdminReply(messageId, replyText) {
    let messages = this.getAllMessages();
    const index = messages.findIndex(msg => msg.messageId === messageId);
    
    if (index !== -1) {
      const now = new Date();
      messages[index].adminReply = replyText;
      messages[index].adminReplyDate = now.toISOString().split('T')[0];
      messages[index].status = 'replied';
      localStorage.setItem(this.messagesKey, JSON.stringify(messages));
      return messages[index];
    }
    return null;
  }

  // ============= DELETE MESSAGE =============
  deleteMessage(messageId) {
    let messages = this.getAllMessages();
    const filteredMessages = messages.filter(msg => msg.messageId !== messageId);
    localStorage.setItem(this.messagesKey, JSON.stringify(filteredMessages));
    return filteredMessages.length < messages.length;
  }

  // ============= STATISTICS =============
  getTotalMessages() {
    return this.getAllMessages().length;
  }

  getMessageStats() {
    const messages = this.getAllMessages();
    return {
      total: messages.length,
      unread: messages.filter(m => m.status === 'unread').length,
      read: messages.filter(m => m.status === 'read').length,
      replied: messages.filter(m => m.status === 'replied').length,
      inquiry: messages.filter(m => m.messageType === 'inquiry').length,
      feedback: messages.filter(m => m.messageType === 'feedback').length,
      complaint: messages.filter(m => m.messageType === 'complaint').length,
      support: messages.filter(m => m.messageType === 'support').length
    };
  }

  // ============= SEARCH MESSAGES =============
  searchMessages(keyword) {
    const messages = this.getAllMessages();
    return messages.filter(msg => 
      msg.senderName.toLowerCase().includes(keyword.toLowerCase()) ||
      msg.senderEmail.toLowerCase().includes(keyword.toLowerCase()) ||
      msg.subject.toLowerCase().includes(keyword.toLowerCase()) ||
      msg.message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // ============= HELPER FUNCTIONS =============
  getNextMessageId() {
    let counter = parseInt(localStorage.getItem(this.messageIdKey)) || 100;
    counter++;
    localStorage.setItem(this.messageIdKey, counter.toString());
    return counter;
  }

  clearAllMessages() {
    localStorage.removeItem(this.messagesKey);
    this.init();
  }

  exportMessages() {
    const messages = this.getAllMessages();
    return JSON.stringify(messages, null, 2);
  }
}

// Initialize the messages database
const messagesDB = new MessagesDatabase();
