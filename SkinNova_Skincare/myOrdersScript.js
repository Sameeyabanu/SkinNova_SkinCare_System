// My Orders - Display and manage order history

class MyOrdersManager {
  constructor() {
    this.ordersDB = ordersDB; // From ordersDatabase.js
    this.currentFilter = 'all';
    this.init();
  }

  init() {
    this.displayStats();
    this.displayOrders();
    this.setupEventListeners();
  }

  // ============= DISPLAY STATISTICS =============
  displayStats() {
    const stats = this.ordersDB.getOrderStats();
    const statsGrid = document.getElementById('stats-grid');

    const statsHTML = `
      <div class="stat-card">
        <div class="stat-number">${stats.total}</div>
        <div class="stat-label">Total Orders</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">₹${stats.totalRevenue.toLocaleString()}</div>
        <div class="stat-label">Total Spent</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${stats.delivered}</div>
        <div class="stat-label">Delivered</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${stats.inTransit}</div>
        <div class="stat-label">In Transit</div>
      </div>
    `;

    statsGrid.innerHTML = statsHTML;
  }

  // ============= DISPLAY ORDERS =============
  displayOrders() {
    let orders = this.ordersDB.getAllOrders();

    // Filter orders based on current filter
    if (this.currentFilter !== 'all') {
      orders = orders.filter(order => order.status === this.currentFilter);
    }

    const ordersList = document.getElementById('orders-list');

    if (orders.length === 0) {
      ordersList.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📦</div>
          <h3>No Orders Found</h3>
          <p>You haven't placed any orders yet. Start shopping now!</p>
          <a href="products.html" class="cta-button" style="display: inline-block;">Shop Now</a>
        </div>
      `;
      return;
    }

    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    const ordersHTML = orders.map(order => this.createOrderCard(order)).join('');
    ordersList.innerHTML = ordersHTML;
  }

  // ============= CREATE ORDER CARD =============
  createOrderCard(order) {
    const statusClass = `status-${order.status.toLowerCase().replace(' ', '-')}`;
    const itemsHTML = order.items.map(item => `
      <li>
        <div>
          <span class="item-name">${item.productName}</span>
          <span class="item-qty">Qty: ${item.quantity}</span>
        </div>
        <span class="item-price">₹${item.total.toLocaleString()}</span>
      </li>
    `).join('');

    return `
      <div class="order-card">
        <div class="order-header">
          <div>
            <div class="order-id">${order.orderId}</div>
            <div class="info-label" style="margin-top: 5px;">Order Date: ${this.formatDate(order.orderDate)}</div>
          </div>
          <span class="order-status ${statusClass}">${order.status}</span>
        </div>

        <div class="order-info">
          <div class="info-item">
            <span class="info-label">Customer Name</span>
            <span class="info-value">${order.customerName}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Email</span>
            <span class="info-value">${order.email}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Shipping Address</span>
            <span class="info-value">${order.shippingAddress}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Payment Method</span>
            <span class="info-value">${order.paymentMethod}</span>
          </div>
        </div>

        <div class="order-items">
          <div class="items-title">📦 Order Items</div>
          <ul class="item-list">
            ${itemsHTML}
          </ul>
        </div>

        <div class="order-totals">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>₹${order.subtotal.toLocaleString()}</span>
          </div>
          <div class="total-row">
            <span>Tax (18%):</span>
            <span>₹${order.tax.toLocaleString()}</span>
          </div>
          <div class="total-row">
            <span>Shipping:</span>
            <span>₹${order.shipping}</span>
          </div>
          <div class="total-row final">
            <span>Total Amount:</span>
            <span>₹${order.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div class="order-actions">
          ${order.status === 'Delivered' ? `
            <button class="btn-secondary" onclick="myOrdersManager.reorderItems('${order.orderId}')">Reorder</button>
          ` : ''}
          <button class="btn-secondary" onclick="myOrdersManager.downloadInvoice('${order.orderId}')">Download Invoice</button>
        </div>
      </div>
    `;
  }

  // ============= EVENT LISTENERS =============
  setupEventListeners() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        e.target.classList.add('active');
        // Update filter and display
        this.currentFilter = e.target.getAttribute('data-filter').toLowerCase();
        this.displayOrders();
      });
    });
  }

  // ============= REORDER FUNCTIONALITY =============
  reorderItems(orderId) {
    const order = this.ordersDB.getOrderById(orderId);
    if (order) {
      // Create new order with same items
      const newOrderData = {
        customerId: order.customerId,
        customerName: order.customerName,
        email: order.email,
        items: order.items,
        subtotal: order.subtotal,
        tax: order.tax,
        shipping: order.shipping,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        shippingAddress: order.shippingAddress
      };

      const newOrder = this.ordersDB.createOrder(newOrderData);
      alert(`✅ Reorder successful! New Order ID: ${newOrder.orderId}`);
      this.displayOrders();
    }
  }

  // ============= DOWNLOAD INVOICE =============
  downloadInvoice(orderId) {
    const order = this.ordersDB.getOrderById(orderId);
    if (!order) return;

    const invoiceContent = `
ORDER INVOICE
================================
Order ID: ${order.orderId}
Order Date: ${this.formatDate(order.orderDate)}
Status: ${order.status}

CUSTOMER INFORMATION
================================
Name: ${order.customerName}
Email: ${order.email}
Shipping Address: ${order.shippingAddress}

ORDER ITEMS
================================
${order.items.map(item => `${item.productName} x${item.quantity} - ₹${item.total.toLocaleString()}`).join('\n')}

ORDER SUMMARY
================================
Subtotal: ₹${order.subtotal.toLocaleString()}
Tax (18%): ₹${order.tax.toLocaleString()}
Shipping: ₹${order.shipping}
-----------------------------------
TOTAL: ₹${order.totalAmount.toLocaleString()}

Payment Method: ${order.paymentMethod}
${order.deliveryDate ? `Delivered on: ${this.formatDate(order.deliveryDate)}` : ''}

Thank you for your purchase!
SkinNova System
    `;

    // Create blob and download
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${order.orderId}-invoice.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // ============= HELPER FUNCTIONS =============
  formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  }
}

// Initialize My Orders Manager
let myOrdersManager;
document.addEventListener('DOMContentLoaded', () => {
  myOrdersManager = new MyOrdersManager();

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
