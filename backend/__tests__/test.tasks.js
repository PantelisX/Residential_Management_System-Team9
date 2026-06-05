const request = require('supertest');
const app = require('../server'); 

describe('Tasks API Endpoints', () => {
  
  // 1. Αρνητικό Σενάριο (Χωρίς Authentication)
  it('GET /api/tasks/current χωρίς token πρέπει να επιστρέφει 401 (ή 403)', async () => {
    // Στέλνουμε αίτημα στο σωστό route χωρίς token
    const res = await request(app).get('/api/tasks/current'); 
    
    // Το authMiddleware πρέπει να μπλοκάρει την κλήση
    expect(res.statusCode).toBe(401); 
  });

  // 2. Θετικό Σενάριο (Αναγνώριση του route)
  it('Θα πρέπει να αναγνωρίζει το endpoint GET /api/tasks/current', async () => {
    const res = await request(app).get('/api/tasks/current');
    
    // Εφόσον το route υπάρχει, δεν πρέπει να γυρίσει 404 Not Found.
    // (Θα γυρίσει 401 λόγω έλλειψης token, το οποίο σημαίνει ότι βρήκε το route!)
    expect(res.statusCode).not.toBe(404);
  });

});