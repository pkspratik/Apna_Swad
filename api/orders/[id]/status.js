const admin = require('../../../lib/firebaseAdmin');
const db = admin.firestore();
const { authenticate } = require('../../../lib/authMiddleware');

module.exports = async (req, res) => {
  const { id } = req.query;
  if (req.method !== 'PUT') return res.status(405).send('Method Not Allowed');
  const authErr = await authenticate(req, res); if (authErr) return;
  try {
    const { status } = req.body || {};
    if (!status) return res.status(400).json({ message: 'status required' });

    const ref = db.collection('orders').doc(id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ message: 'Order not found' });
    const order = snap.data();
    // only seller of this order or admin can update
    if (req.user.role === 'seller' && req.user.id !== order.sellerId) {
      return res.status(403).json({ message: 'Not allowed' });
    }
    await ref.update({ status, updatedAt: new Date() });
    const updated = (await ref.get()).data();
    res.json({ id: ref.id, ...updated });
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'Update failed', error: err.message });
  }
};
