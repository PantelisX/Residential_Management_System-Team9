---
name: js-routing
description: Χρησιμοποίησε αυτό το skill όταν ο χρήστης ζητάει τη δημιουργία ή τροποποίηση Express Routes, HTTP μεθόδων (GET, POST, PUT, DELETE) και Controllers στο backend.
---

# Οδηγίες Express Architecture (Routes & Controllers)

## 1. Διαχωρισμός Ευθυνών (Separation of Concerns)
- **Αρχεία Routes (`/backend/routes`):** Περιέχουν *αποκλειστικά* τους ορισμούς των endpoints και τη σύνδεσή τους με τις αντίστοιχες συναρτήσεις των controllers. Δεν γράφουμε ποτέ business logic ή database queries εδώ.
- **Αρχεία Controllers (`/backend/controllers`):** Περιέχουν όλη τη λογική της εφαρμογής, την επικοινωνία με τα models/database και την επιστροφή των HTTP responses (`res.status().json()`).

## 2. Πρότυπο Δομής Κώδικα

### Παράδειγμα για Route (`/backend/routes/exampleRoutes.js`)
```javascript
const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/exampleController');

// Ορισμός routes με σαφήνεια
router.post('/tasks', exampleController.createTask);
router.get('/tasks/:id', exampleController.getTaskById);

module.exports = router;