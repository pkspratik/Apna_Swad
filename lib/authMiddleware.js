const jwt = require('jsonwebtoken');
const admin = require('./firebaseAdmin');
const db = admin.firestore();

async function authenticate(req, res) {
  try {
    const header = req.headers.authorization || '';
    const token = header.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userDoc = await db.collection('users').doc(decoded.id).get();
    if (!userDoc.exists) return res.status(401).json({ message: 'User not found' });

    req.user = { id: decoded.id, role: decoded.role, ...(userDoc.data() || {}) };
    return null;
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token', error: err.message });
  }
}

// authorize helper: allowedRoles array or strings
function authorize(req, allowed = []) {
  const role = (req.user && (req.user.role === 'customer' ? 'buyer' : req.user.role)) || '';
  if (allowed.length === 0) return true;
  return allowed.includes(role);
}

module.exports = { authenticate, authorize };
