import { pool } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export class Response {
  static async create(data) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const responseId = uuidv4();
      const now = new Date();
      
      // Insert response
      await connection.execute(
        'INSERT INTO responses (id, survey_id, submitted_at, session_id) VALUES (?, ?, ?, ?)',
        [responseId, data.survey_id, now, data.session_id]
      );
      
      // Insert answers
      if (data.answers && data.answers.length > 0) {
        for (const answer of data.answers) {
          const answerId = uuidv4();
          await connection.execute(
            'INSERT INTO answers (id, response_id, question_id, answer_text, selected_options) VALUES (?, ?, ?, ?, ?)',
            [
              answerId,
              responseId,
              answer.question_id,
              answer.answer_text || null,
              JSON.stringify(answer.selected_options || [])
            ]
          );
        }
      }
      
      await connection.commit();
      return { id: responseId, ...data };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findBySurveyId(surveyId) {
    const [rows] = await pool.execute(`
      SELECT r.*, 
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', a.id,
            'question_id', a.question_id,
            'answer_text', a.answer_text,
            'selected_options', a.selected_options
          )
        ) as answers
      FROM responses r
      LEFT JOIN answers a ON r.id = a.response_id
      WHERE r.survey_id = ?
      GROUP BY r.id
      ORDER BY r.submitted_at DESC
    `, [surveyId]);

    return rows;
  }
}