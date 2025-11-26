const admin = require('../../lib/firebaseAdmin');
const db = admin.firestore();
const { authenticate, authorize } = require('../../lib/authMiddleware');

module.exports = async (req, res) => {
  // POST - create order (buyer)
  if (req.method === 'POST') {
    const authErr = await authenticate(req, res); if (authErr) return;
    if (!authorize(req, ['buyer'])) return res.status(403).json({ message: 'Forbidden' });

    try {
      const { items, total, address, sellerId } = req.body || {};
      if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Items required' });
      if (!sellerId) return res.status(400).json({ message: 'sellerId required' });

      const order = {
        userId: req.user.id,
        sellerId,
        items,
        total: total || items.reduce((s,i)=> s + (i.price||0) * (i.qty||1), 0),
        address: address || '',
        status: 'placed',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const ref = await db.collection('orders').add(order);
      const data = (await ref.get()).data();
      res.status(201).json({ id: ref.id, ...data });
    } catch (err) {
      console.error(err); res.status(500).json({ message: 'Create order failed', error: err.message });
    }
    return;
  }

  // GET - admin all orders
  if (req.method === 'GET') {
    const authErr = await authenticate(req, res); if (authErr) return;
    if (!authorize(req, ['admin'])) return res.status(403).json({ message: 'Forbidden' });

    try {
      const snap = await db.collection('orders').orderBy('createdAt', 'desc').get();
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      res.json(list);
    } catch (err) {
      console.error(err); res.status(500).json({ message: 'List orders failed', error: err.message });
    }
    return;
  }

  res.status(405).send('Method Not Allowed');
};
