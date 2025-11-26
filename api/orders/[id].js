const admin = require('../../lib/firebaseAdmin');
const db = admin.firestore();
const { authenticate } = require('../../lib/authMiddleware');

module.exports = async (req, res) => {
  const { id } = req.query;

  if (req.method !== 'GET') return res.status(405).send('Method Not Allowed');
  const authErr = await authenticate(req, res); if (authErr) return;
  try {
    const snap = await db.collection('orders').doc(id).get();
    if (!snap.exists) return res.status(404).json({ message: 'Order not found' });
    const data = snap.data();
    // check ownership or seller or admin
    const user = req.user;
    if (user.role !== 'admin' && user.id !== data.userId && user.id !== data.sellerId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json({ id: snap.id, ...data });
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'Get order failed', error: err.message });
  }
};
