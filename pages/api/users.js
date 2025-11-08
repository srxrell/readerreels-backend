import pool from '../../db';

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query('SELECT id, username, display_name, bio, avatar_url FROM users');
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
