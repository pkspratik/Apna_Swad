const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const admin = require('../../lib/firebaseAdmin');
const db = admin.firestore();

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'email & password required' });

    const snap = await db.collection('users').where('email', '==', email).get();
    if (snap.empty) return res.status(400).json({ message: 'User not found' });

    const doc = snap.docs[0];
    const user = doc.data();
    const match = await bcrypt.compare(password, user.password || '');
    if (!match) return res.status(400).json({ message: 'Wrong password' });

    const token = jwt.sign({ id: doc.id, role: user.role }, process.env.JWT_SECRET);
    res.json({ user: { id: doc.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
