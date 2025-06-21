import { pool } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export class Survey {
  static async findAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM surveys ORDER BY created_at DESC'
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM surveys WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findByIdWithQuestions(id) {
    const survey = await this.findById(id);
    if (!survey) return null;

    const [questions] = await pool.execute(`
      SELECT q.*, 
        JSON_ARRAYAGG(
          CASE WHEN qo.id IS NOT NULL 
          THEN JSON_OBJECT('id', qo.id, 'option_text', qo.option_text, 'order_index', qo.order_index)
          ELSE NULL END
        ) as question_options
      FROM questions q
      LEFT JOIN question_options qo ON q.id = qo.question_id
      WHERE q.survey_id = ?
      GROUP BY q.id
      ORDER BY q.order_index
    `, [id]);

    // Clean up the question_options array
    questions.forEach(question => {
      if (question.question_options) {
        question.question_options = question.question_options.filter(opt => opt !== null);
      } else {
        question.question_options = [];
      }
    });

    return { ...survey, questions };
  }

  static async create(data) {
    const id = uuidv4();
    const now = new Date();
    
    await pool.execute(
      'INSERT INTO surveys (id, title, description, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      [id, data.title, data.description || '', data.status || 'draft', now, now]
    );
    
    return this.findById(id);
  }

  static async update(id, data) {
    const now = new Date();
    await pool.execute(
      'UPDATE surveys SET title = ?, description = ?, status = ?, updated_at = ? WHERE id = ?',
      [data.title, data.description || '', data.status, now, id]
    );
    
    return this.findById(id);
  }

  static async updateStatus(id, status) {
    const now = new Date();
    await pool.execute(
      'UPDATE surveys SET status = ?, updated_at = ? WHERE id = ?',
      [status, now, id]
    );
    
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM surveys WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}