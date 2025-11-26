const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const admin = require('../../lib/firebaseAdmin');
const db = admin.firestore();

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const { name, email, password, mobile, address, role, shopName } = req.body || {};

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'name, email, password and role are required' });
    }

    // check duplicate
    const q = await db.collection('users').where('email', '==', email).get();
    if (!q.empty) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const docRef = await db.collection('users').add({
      name, email, password: hashed, mobile: mobile || '', address: address || '', role, shopName: role === 'seller' ? shopName || '' : '', createdAt: new Date()
    });

    const token = jwt.sign({ id: docRef.id, role }, process.env.JWT_SECRET);

    res.status(201).json({ user: { id: docRef.id, name, email, role }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};
