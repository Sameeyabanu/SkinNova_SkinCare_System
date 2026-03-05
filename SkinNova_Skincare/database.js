// Customer and Client Database Management System
// Handles customer data with ratings and client testimonials

class Database {
  constructor() {
    this.customersKey = 'skincare_customers';
    this.clientsKey = 'skincare_clients';
    this.init();
  }

  init() {
    // Initialize with sample data if databases are empty
    if (!localStorage.getItem(this.customersKey)) {
      this.initCustomers();
    }
    if (!localStorage.getItem(this.clientsKey)) {
      this.initClients();
    }
  }

  // ============= CUSTOMERS =============
  
  initCustomers() {
    const sampleCustomers = [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '+91 9876543210',
        purchaseHistory: ['Vitamin C Serum', 'Night Cream'],
        totalSpent: 3500,
        rating: 5,
        joinDate: '2025-11-15'
      },
      {
        id: 2,
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        phone: '+91 8765432109',
        purchaseHistory: ['Cleanser', 'Moisturizer'],
        totalSpent: 2800,
        rating: 4,
        joinDate: '2025-12-20'
      },
      {
        id: 3,
        name: 'Emily Chen',
        email: 'emily.chen@example.com',
        phone: '+91 7654321098',
        purchaseHistory: ['Magic Mask', 'Serum C'],
        totalSpent: 4200,
        rating: 5,
        joinDate: '2026-01-05'
      }
    ];
    localStorage.setItem(this.customersKey, JSON.stringify(sampleCustomers));
  }

  getCustomers() {
    return JSON.parse(localStorage.getItem(this.customersKey)) || [];
  }

  addCustomer(customer) {
    const customers = this.getCustomers();
    customer.id = Date.now();
    customer.joinDate = new Date().toISOString().split('T')[0];
    customers.push(customer);
    localStorage.setItem(this.customersKey, JSON.stringify(customers));
    return customer;
  }

  updateCustomer(id, updates) {
    const customers = this.getCustomers();
    const index = customers.findIndex(c => c.id === id);
    if (index !== -1) {
      customers[index] = { ...customers[index], ...updates };
      localStorage.setItem(this.customersKey, JSON.stringify(customers));
      return customers[index];
    }
    return null;
  }

  deleteCustomer(id) {
    const customers = this.getCustomers();
    const filtered = customers.filter(c => c.id !== id);
    localStorage.setItem(this.customersKey, JSON.stringify(filtered));
  }

  getCustomersByRating(minRating) {
    return this.getCustomers().filter(c => c.rating >= minRating);
  }

  // ============= CLIENTS (Testimonials) =============
  
  initClients() {
    const sampleClients = [
      {
        id: 1,
        name: 'Dr. Anjali Mehta',
        position: 'Dermatologist',
        company: 'SkinCare Clinic Mumbai',
        testimonial: 'SkinNova products have transformed my patients\' skin. The natural ingredients combined with scientific formulation deliver exceptional results.',
        rating: 5,
        date: '2026-01-10',
        avatar: '👩‍⚕️'
      },
      {
        id: 2,
        name: 'Rajesh Kumar',
        position: 'Beauty Salon Owner',
        company: 'Glamour Studio Delhi',
        testimonial: 'We exclusively use SkinNova products in our salon. Clients love the results and keep coming back. Highly professional and effective!',
        rating: 5,
        date: '2026-01-08',
        avatar: '👨‍💼'
      },
      {
        id: 3,
        name: 'Maya Patel',
        position: 'Spa Director',
        company: 'Serenity Spa Bangalore',
        testimonial: 'The quality and consistency of SkinNova products are outstanding. Our clients notice visible improvements within weeks.',
        rating: 4,
        date: '2025-12-28',
        avatar: '👩‍💼'
      }
    ];
    localStorage.setItem(this.clientsKey, JSON.stringify(sampleClients));
  }

  getClients() {
    return JSON.parse(localStorage.getItem(this.clientsKey)) || [];
  }

  addClient(client) {
    const clients = this.getClients();
    client.id = Date.now();
    client.date = new Date().toISOString().split('T')[0];
    clients.push(client);
    localStorage.setItem(this.clientsKey, JSON.stringify(clients));
    return client;
  }

  updateClient(id, updates) {
    const clients = this.getClients();
    const index = clients.findIndex(c => c.id === id);
    if (index !== -1) {
      clients[index] = { ...clients[index], ...updates };
      localStorage.setItem(this.clientsKey, JSON.stringify(clients));
      return clients[index];
    }
    return null;
  }

  deleteClient(id) {
    const clients = this.getClients();
    const filtered = clients.filter(c => c.id !== id);
    localStorage.setItem(this.clientsKey, JSON.stringify(filtered));
  }

  // ============= RATINGS =============
  
  generateStars(rating) {
    const fullStars = '⭐'.repeat(Math.floor(rating));
    const hasHalf = rating % 1 !== 0;
    const halfStar = hasHalf ? '✨' : '';
    const emptyStars = '☆'.repeat(5 - Math.ceil(rating));
    return fullStars + halfStar + emptyStars;
  }

  getAverageCustomerRating() {
    const customers = this.getCustomers();
    if (customers.length === 0) return 0;
    const sum = customers.reduce((acc, c) => acc + c.rating, 0);
    return (sum / customers.length).toFixed(1);
  }

  getAverageClientRating() {
    const clients = this.getClients();
    if (clients.length === 0) return 0;
    const sum = clients.reduce((acc, c) => acc + c.rating, 0);
    return (sum / clients.length).toFixed(1);
  }
}

// Initialize database
const db = new Database();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Database;
}
