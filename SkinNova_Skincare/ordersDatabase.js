// MyOrders Database Management System
// Handles customer orders and order history

class OrdersDatabase {
  constructor() {
    this.ordersKey = 'skincare_orders';
    this.orderIdKey = 'skincare_order_id_counter';
    this.init();
  }

  init() {
    // Initialize with sample data if database is empty
    if (!localStorage.getItem(this.ordersKey)) {
      this.initOrders();
    }
    // Initialize order ID counter
    if (!localStorage.getItem(this.orderIdKey)) {
      localStorage.setItem(this.orderIdKey, '1000');
    }
  }

  initOrders() {
    const sampleOrders = [
      {
        orderId: 'ORD-1001',
        customerId: 1,
        customerName: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        orderDate: '2025-12-15',
        deliveryDate: '2025-12-20',
        status: 'Delivered',
        items: [
          { productName: 'Vitamin C Serum', quantity: 1, price: 1200, total: 1200 },
          { productName: 'Night Cream', quantity: 1, price: 1800, total: 1800 }
        ],
        subtotal: 3000,
        tax: 540,
        shipping: 100,
        totalAmount: 3640,
        paymentMethod: 'Credit Card',
        shippingAddress: '123 Beauty Lane, Mumbai, India'
      },
      {
        orderId: 'ORD-1002',
        customerId: 2,
        customerName: 'Shaheen Banu',
        email: 'priya.sharma@example.com',
        orderDate: '2025-12-18',
        deliveryDate: null,
        status: 'In Transit',
        items: [
          { productName: 'Cleanser', quantity: 2, price: 800, total: 1600 },
          { productName: 'Moisturizer', quantity: 1, price: 1200, total: 1200 }
        ],
        subtotal: 2800,
        tax: 504,
        shipping: 100,
        totalAmount: 3404,
        paymentMethod: 'Debit Card',
        shippingAddress: '456 Skincare Avenue, Delhi, India'
      },
      {
        orderId: 'ORD-1003',
        customerId: 3,
        customerName: 'Maseera Khan',
        email: 'emily.chen@example.com',
        orderDate: '2025-12-10',
        deliveryDate: '2025-12-16',
        status: 'Delivered',
        items: [
          { productName: 'Magic Mask', quantity: 1, price: 950, total: 950 },
          { productName: 'Serum C', quantity: 1, price: 1500, total: 1500 }
        ],
        subtotal: 2450,
        tax: 441,
        shipping: 100,
        totalAmount: 2991,
        paymentMethod: 'UPI',
        shippingAddress: '789 Glow Street, Bangalore, India'
      }
    ];

    localStorage.setItem(this.ordersKey, JSON.stringify(sampleOrders));
  }

  // ============= CREATE ORDER =============
  createOrder(orderData) {
    const orders = this.getAllOrders();
    const orderId = 'ORD-' + this.getNextOrderId();
    
    const newOrder = {
      orderId: orderId,
      customerId: orderData.customerId,
      customerName: orderData.customerName,
      email: orderData.email,
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: null,
      status: 'Pending',
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      tax: orderData.tax || 0,
      shipping: orderData.shipping || 100,
      totalAmount: orderData.totalAmount || 0,
      paymentMethod: orderData.paymentMethod || 'Credit Card',
      shippingAddress: orderData.shippingAddress || ''
    };

    orders.push(newOrder);
    localStorage.setItem(this.ordersKey, JSON.stringify(orders));
    return newOrder;
  }

  // ============= GET ORDERS =============
  getAllOrders() {
    const orders = localStorage.getItem(this.ordersKey);
    return orders ? JSON.parse(orders) : [];
  }

  getOrderById(orderId) {
    const orders = this.getAllOrders();
    return orders.find(order => order.orderId === orderId);
  }

  getOrdersByCustomerId(customerId) {
    const orders = this.getAllOrders();
    return orders.filter(order => order.customerId === customerId);
  }

  getOrdersByStatus(status) {
    const orders = this.getAllOrders();
    return orders.filter(order => order.status === status);
  }

  // ============= UPDATE ORDER =============
  updateOrder(orderId, updatedData) {
    let orders = this.getAllOrders();
    const index = orders.findIndex(order => order.orderId === orderId);
    
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updatedData };
      localStorage.setItem(this.ordersKey, JSON.stringify(orders));
      return orders[index];
    }
    return null;
  }

  updateOrderStatus(orderId, status) {
    let orders = this.getAllOrders();
    const index = orders.findIndex(order => order.orderId === orderId);
    
    if (index !== -1) {
      orders[index].status = status;
      if (status === 'Delivered') {
        orders[index].deliveryDate = new Date().toISOString().split('T')[0];
      }
      localStorage.setItem(this.ordersKey, JSON.stringify(orders));
      return orders[index];
    }
    return null;
  }

  // ============= DELETE ORDER =============
  deleteOrder(orderId) {
    let orders = this.getAllOrders();
    const filteredOrders = orders.filter(order => order.orderId !== orderId);
    localStorage.setItem(this.ordersKey, JSON.stringify(filteredOrders));
    return filteredOrders.length < orders.length;
  }

  // ============= STATISTICS =============
  getTotalOrders() {
    return this.getAllOrders().length;
  }

  getTotalRevenue() {
    const orders = this.getAllOrders();
    return orders.reduce((sum, order) => sum + order.totalAmount, 0);
  }

  getOrderStats() {
    const orders = this.getAllOrders();
    return {
      total: orders.length,
      delivered: orders.filter(o => o.status === 'Delivered').length,
      inTransit: orders.filter(o => o.status === 'In Transit').length,
      pending: orders.filter(o => o.status === 'Pending').length,
      cancelled: orders.filter(o => o.status === 'Cancelled').length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0)
    };
  }

  // ============= HELPER FUNCTIONS =============
  getNextOrderId() {
    let counter = parseInt(localStorage.getItem(this.orderIdKey)) || 1000;
    counter++;
    localStorage.setItem(this.orderIdKey, counter.toString());
    return counter;
  }

  clearAllOrders() {
    localStorage.removeItem(this.ordersKey);
    this.init();
  }
}

// Initialize the database
const ordersDB = new OrdersDatabase();
