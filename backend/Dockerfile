# Χρήση του Node.js (έκδοση 18 alpine για μικρότερο μέγεθος)
FROM node:22-alpine

# Ορίζουμε τον φάκελο εργασίας στο container
WORKDIR /app

# Αντιγράφουμε πρώτα το package.json (αν υπάρχει package-lock.json θα το πάρει κι αυτό)
COPY package*.json ./

# Εγκατάσταση των dependencies
RUN npm install

# Αντιγράφουμε όλο τον υπόλοιπο κώδικα
COPY . .

# Κάνουμε expose την πόρτα 5000 που χρησιμοποιεί το backend
EXPOSE 5000

# Εκκίνηση της εφαρμογής
CMD ["npm", "start"]
