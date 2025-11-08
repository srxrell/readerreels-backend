import pool from '../../../db';

export default async (req, res) => {
  const { query: { id } } = req;

  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query(
        'SELECT reaction, COUNT(*) FROM reactions WHERE story_id = $1 GROUP BY reaction',
        [id]
      );
      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
