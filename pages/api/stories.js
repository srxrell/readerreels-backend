import pool from '../../db';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { title, content, author_id } = req.body;
    try {
      const { rows } = await pool.query(
        'INSERT INTO stories (title, content, author_id) VALUES ($1, $2, $3) RETURNING * ',
        [title, content, author_id]
      );
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else if (req.method === 'GET') {
    try {
      const { rows } = await pool.query('SELECT s.*, u.username, u.avatar_url FROM stories s JOIN users u ON s.author_id = u.id ORDER BY s.created_at DESC');
      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } 
  else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
