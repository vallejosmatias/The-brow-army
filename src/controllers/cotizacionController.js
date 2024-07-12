import ExchangeRate from '../models/cotizacion.model.js';

export const getExchangeRate = async (req, res) => {
  try {
    const rate = await ExchangeRate.findOne();
    res.json(rate);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la cotización' });
  }
};

export const updateExchangeRate = async (req, res) => {
  try {
    const { rate } = req.body;
    const updatedRate = await ExchangeRate.findOneAndUpdate({}, { rate, updatedAt: Date.now() }, { new: true, upsert: true });
    res.redirect('/admin/courses');
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la cotización' });
  }
};