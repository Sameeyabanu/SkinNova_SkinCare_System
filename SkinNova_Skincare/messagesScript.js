// Messages Management Script

class MessagesManager {
  constructor() {
    this.messagesDB = messagesDB;
    this.init();
  }

  init() {
    this.setupFormListener();
    this.displayStats();
    this.displayMessages();
  }

  // ============= FORM SUBMISSION =============
  setupFormListener() {
    const form = document.getElementById('messageForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitMessage();
    });
  }

  submitMessage() {
    const form = document.getElementById('messageForm');
    const formData = new FormData(form);

    const messageData = {
      senderName: formData.get('senderName'),
      senderEmail: formData.get('senderEmail'),
      senderPhone: formData.get('senderPhone'),
      subject: formData.get('subject'),
      message: formData.get('message'),
      messageType: formData.get('messageType')
    };

    // Validate required fields
    if (!messageData.senderName || !messageData.senderEmail || !messageData.subject || !messageData.message || !messageData.messageType) {
      alert('❌ Please fill all required fields!');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(messageData.senderEmail)) {
      alert('❌ Please enter a valid email address!');
      return;
    }

    // Create message in database
    const newMessage = this.messagesDB.createMessage(messageData);

    // Gmail Redirection Logic
    const btn = form.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'Redirecting to Gmail... ✉️';
    btn.disabled = true;

    const emailBody = `From: ${messageData.senderName} (${messageData.senderEmail})\n` +
      `Phone: ${messageData.senderPhone || 'N/A'}\n` +
      `Type: ${messageData.messageType}\n\n` +
      `Message:\n${messageData.message}`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=sameeyabanu986@gmail.com&su=${encodeURIComponent(messageData.subject)}&body=${encodeURIComponent(emailBody)}`;

    window.open(gmailUrl, '_blank');

    // Show success message
    const successAlert = document.getElementById('success-alert');
    if (successAlert) {
      successAlert.style.display = 'block';
    }

    // Reset form
    form.reset();

    // Hide success message after 5 seconds
    setTimeout(() => {
      if (successAlert) successAlert.style.display = 'none';
      btn.textContent = originalText;
      btn.disabled = false;
    }, 5000);

    // Refresh messages display
    setTimeout(() => {
      this.displayStats();
      this.displayMessages();
    }, 500);
  }

  // ============= DISPLAY STATISTICS =============
  displayStats() {
    const stats = this.messagesDB.getMessageStats();

    document.getElementById('totalMessages').textContent = stats.total;
    document.getElementById('unreadMessages').textContent = stats.unread;
    document.getElementById('repliedMessages').textContent = stats.replied;
  }

  // ============= DISPLAY MESSAGES =============
  displayMessages() {
    const messages = this.messagesDB.getAllMessages();
    const messagesList = document.getElementById('messagesList');

    if (messages.length === 0) {
      messagesList.innerHTML = `
        <div class="empty-state">
          <p>No messages yet. Send your first message to us!</p>
        </div>
      `;
      return;
    }

    // Sort messages by date (newest first)
    messages.sort((a, b) => {
      const dateA = new Date(a.createdDate);
      const dateB = new Date(b.createdDate);
      return dateB - dateA;
    });

    const messagesHTML = messages.map(msg => this.createMessageItem(msg)).join('');
    messagesList.innerHTML = messagesHTML;

    // Add click listeners to message items
    const messageItems = document.querySelectorAll('.message-item');
    messageItems.forEach(item => {
      item.addEventListener('click', () => {
        const messageId = item.getAttribute('data-message-id');
        this.openMessageModal(messageId);
        // Mark as read
        this.messagesDB.updateMessageStatus(messageId, 'read');
        this.displayMessages();
        this.displayStats();
      });
    });
  }

  // ============= CREATE MESSAGE ITEM =============
  createMessageItem(message) {
    const typeClass = `message-type ${message.messageType}`;
    const statusClass = `message-status ${message.status}`;
    const unreadClass = message.status === 'unread' ? 'unread' : '';

    const preview = message.message.substring(0, 100) + (message.message.length > 100 ? '...' : '');
    const typeLabel = this.getMessageTypeLabel(message.messageType);
    const statusLabel = this.getStatusLabel(message.status);

    return `
      <div class="message-item ${unreadClass}" data-message-id="${message.messageId}">
        <div class="message-header">
          <div>
            <div class="message-from">${message.senderName}</div>
            <div class="message-date">${this.formatDate(message.createdDate)}</div>
          </div>
        </div>
        <div class="message-subject">${message.subject}</div>
        <div class="message-preview">${preview}</div>
        <div>
          <span class="${typeClass}">${typeLabel}</span>
          <span class="${statusClass}">${statusLabel}</span>
        </div>
      </div>
    `;
  }

  // ============= OPEN MESSAGE MODAL =============
  openMessageModal(messageId) {
    const message = this.messagesDB.getMessageById(messageId);
    if (!message) return;

    const typeLabel = this.getMessageTypeLabel(message.messageType);
    const replySection = message.adminReply ? `
      <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin-top: 20px;">
        <h4 style="color: #c2185b; margin-bottom: 10px;">📩 Admin Reply</h4>
        <p style="color: #333; line-height: 1.6;">${message.adminReply}</p>
        <small style="color: #999;">Replied on: ${this.formatDate(message.adminReplyDate)}</small>
      </div>
    ` : '<p style="color: #999; font-size: 14px; margin-top: 20px;">⏳ Awaiting admin response...</p>';

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
      <div style="display: grid; gap: 15px;">
        <div style="border-bottom: 2px solid #e0e0e0; padding-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div>
              <p style="color: #999; font-size: 12px; margin-bottom: 5px;">MESSAGE ID</p>
              <p style="color: #333; font-weight: 700; font-size: 16px;">${message.messageId}</p>
            </div>
            <span style="background: #e3f2fd; color: #1565c0; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">${typeLabel}</span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <p style="color: #999; font-size: 12px; margin-bottom: 5px; text-transform: uppercase;">From</p>
            <p style="color: #333; font-weight: 600;">${message.senderName}</p>
          </div>
          <div>
            <p style="color: #999; font-size: 12px; margin-bottom: 5px; text-transform: uppercase;">Email</p>
            <p style="color: #333;"><a href="mailto:${message.senderEmail}" style="color: #c2185b; text-decoration: none;">${message.senderEmail}</a></p>
          </div>
        </div>

        ${message.senderPhone ? `
          <div>
            <p style="color: #999; font-size: 12px; margin-bottom: 5px; text-transform: uppercase;">Phone</p>
            <p style="color: #333;"><a href="tel:${message.senderPhone}" style="color: #c2185b; text-decoration: none;">${message.senderPhone}</a></p>
          </div>
        ` : ''}

        <div>
          <p style="color: #999; font-size: 12px; margin-bottom: 5px; text-transform: uppercase;">Date</p>
          <p style="color: #333;">${this.formatDate(message.createdDate)} at ${message.createdTime}</p>
        </div>

        <div style="border-top: 2px solid #e0e0e0; padding-top: 15px;">
          <p style="color: #999; font-size: 12px; margin-bottom: 10px; text-transform: uppercase;">Subject</p>
          <p style="color: #333; font-size: 16px; font-weight: 600;">${message.subject}</p>
        </div>

        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
          <p style="color: #333; line-height: 1.7; white-space: pre-wrap;">${this.escapeHtml(message.message)}</p>
        </div>

        ${replySection}

        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button onclick="messagesManager.deleteMessage('${message.messageId}')" style="flex: 1; padding: 12px; background: #ffebee; color: #c62828; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s;">
            🗑️ Delete
          </button>
          <button onclick="closeMessageModal()" style="flex: 1; padding: 12px; background: #e0e0e0; color: #333; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s;">
            Close
          </button>
        </div>
      </div>
    `;

    document.getElementById('messageModal').classList.add('active');
  }

  // ============= DELETE MESSAGE =============
  deleteMessage(messageId) {
    if (confirm('Are you sure you want to delete this message?')) {
      this.messagesDB.deleteMessage(messageId);
      closeMessageModal();
      this.displayMessages();
      this.displayStats();
    }
  }

  // ============= HELPER FUNCTIONS =============
  getMessageTypeLabel(type) {
    const labels = {
      'inquiry': '❓ Product Inquiry',
      'feedback': '⭐ Feedback',
      'complaint': '⚠️ Complaint',
      'support': '🆘 Support',
      'general': '💬 General'
    };
    return labels[type] || type;
  }

  getStatusLabel(status) {
    const labels = {
      'unread': '🔴 Unread',
      'read': '👁️ Read',
      'replied': '✅ Replied'
    };
    return labels[status] || status;
  }

  formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

// Global function to close modal
function closeMessageModal() {
  document.getElementById('messageModal').classList.remove('active');
}

// Initialize Messages Manager
let messagesManager;
document.addEventListener('DOMContentLoaded', () => {
  messagesManager = new MessagesManager();

  // Mobile Menu Toggle
  const hamburger = document.getElementById('hamburger-menu');
  const nav = document.getElementById('main-nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('nav-open');
    });

    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('nav-open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !nav.contains(e.target) && nav.classList.contains('nav-open')) {
        hamburger.classList.remove('active');
        nav.classList.remove('nav-open');
      }
    });
  }
});
