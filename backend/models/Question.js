import { pool } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export class Question {
  static async findBySurveyId(surveyId) {
    const [rows] = await pool.execute(`
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
    `, [surveyId]);

    // Clean up the question_options array
    rows.forEach(question => {
      if (question.question_options) {
        question.question_options = question.question_options.filter(opt => opt !== null);
      } else {
        question.question_options = [];
      }
    });

    return rows;
  }

  static async create(data) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const questionId = uuidv4();
      const now = new Date();
      
      // Insert question
      await connection.execute(
        'INSERT INTO questions (id, survey_id, question_text, question_type, order_index, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [questionId, data.survey_id, data.question_text, data.question_type, data.order_index, now]
      );
      
      // Insert options if provided
      if (data.options && data.options.length > 0) {
        for (let i = 0; i < data.options.length; i++) {
          const optionId = uuidv4();
          await connection.execute(
            'INSERT INTO question_options (id, question_id, option_text, order_index) VALUES (?, ?, ?, ?)',
            [optionId, questionId, data.options[i], i + 1]
          );
        }
      }
      
      await connection.commit();
      
      // Return the created question with options
      const [rows] = await connection.execute(`
        SELECT q.*, 
          JSON_ARRAYAGG(
            CASE WHEN qo.id IS NOT NULL 
            THEN JSON_OBJECT('id', qo.id, 'option_text', qo.option_text, 'order_index', qo.order_index)
            ELSE NULL END
          ) as question_options
        FROM questions q
        LEFT JOIN question_options qo ON q.id = qo.question_id
        WHERE q.id = ?
        GROUP BY q.id
      `, [questionId]);
      
      const question = rows[0];
      if (question.question_options) {
        question.question_options = question.question_options.filter(opt => opt !== null);
      } else {
        question.question_options = [];
      }
      
      return question;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM questions WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}