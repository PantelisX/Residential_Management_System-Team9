const request = require('supertest');
const app = require('../server'); 

describe('Tasks API Endpoints', () => {
  
  // 1. Negative Scenario (Without Authentication)
  it('GET /api/tasks/current without token should return 401 (or 403)', async () => {
    // Send a request to the correct route without a token
    const res = await request(app).get('/api/tasks/current'); 
    
    // The authMiddleware should block the call
    expect(res.statusCode).toBe(401); 
  });

  // 2. Positive Scenario (Route recognition)
  it('Should recognize the GET /api/tasks/current endpoint', async () => {
    const res = await request(app).get('/api/tasks/current');
    
    // Since the route exists, it shouldn't return 404 Not Found.
    // (It will return 401 due to missing token, which means it found the route!)
    expect(res.statusCode).not.toBe(404);
  });

});