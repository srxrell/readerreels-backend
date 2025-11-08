import pool from '../../db';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { follower_id, following_id } = req.body;

    try {
      const { rows } = await pool.query(
        'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) RETURNING * ',
        [follower_id, following_id]
      );
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else if (req.method === 'DELETE') {
    const { follower_id, following_id } = req.body;

    try {
      await pool.query(
        'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
        [follower_id, following_id]
      );
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
