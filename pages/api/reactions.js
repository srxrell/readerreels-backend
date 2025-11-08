import pool from '../../db';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { user_id, story_id, reaction } = req.body;

    try {
      // Проверить, существует ли уже реакция от этого пользователя на эту историю
      const existingReaction = await pool.query(
        'SELECT * FROM reactions WHERE user_id = $1 AND story_id = $2',
        [user_id, story_id]
      );

      if (existingReaction.rows.length > 0) {
        // Если реакция существует, обновить ее
        const { rows } = await pool.query(
          'UPDATE reactions SET reaction = $1 WHERE user_id = $2 AND story_id = $3 RETURNING * ',
          [reaction, user_id, story_id]
        );
        res.status(200).json(rows[0]);
      } else {
        // Если реакции нет, создать новую
        const { rows } = await pool.query(
          'INSERT INTO reactions (user_id, story_id, reaction) VALUES ($1, $2, $3) RETURNING * ',
          [user_id, story_id, reaction]
        );
        res.status(201).json(rows[0]);
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
