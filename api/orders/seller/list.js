const admin = require('../../../lib/firebaseAdmin');
const db = admin.firestore();
const { authenticate } = require('../../../lib/authMiddleware');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).send('Method Not Allowed');
  const authErr = await authenticate(req, res); if (authErr) return;
  try {
    if (req.user.role !== 'seller') return res.status(403).json({ message: 'Forbidden' });
    const snap = await db.collection('orders').where('sellerId', '==', req.user.id).orderBy('createdAt','desc').get();
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json(list);
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'Get seller orders failed', error: err.message });
  }
};
