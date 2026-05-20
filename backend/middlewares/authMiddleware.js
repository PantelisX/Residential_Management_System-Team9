/* Ενδεικτικό
const jwt = require("jsonwebtoken"); //Βιβλιοθήκη για τα tokens

module.exports = (req, res, next) => {
  //Παίρνουμε το header από το αίτημα του χρήστη
  const header = req.headers.authorization;

  //Περίπτωση που δεν είναι χρήστης 
  if (!header)
    return res.status(401).json({ message: "No token provided" });

  const token = header.split(" ")[1]; //Παίρνουμε μόνο το token από το header

  try {
    //Έλεγχος αν το token είναι έγκυρο
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); //προχωράμε στην επόμενη λειτουργία του προγράμματος
  } catch (err) { //περίπτωση λάθος token
    return res.status(403).json({ message: "Invalid token" });
  }
};
*/