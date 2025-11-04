const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../config/dbConfig");

// post questions / ask questions
async function postQuestion(req, res) {
  const { userid, title, description } = req.body;

  if (!userid || !title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required." });
  }

  // Create current timestamp in UTC+3 format
  const currentTimestamp = new Date(Date.now() + 3 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  try {
    await dbConnection.query(
      "INSERT INTO questions (userid, title, description, createdAt) VALUES (?, ?, ?, ?)",
      [userid, title, description, currentTimestamp]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Question posted successfully." });
  } catch (err) {
    console.error("postQuestion error:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong, please try again later." });
  }
}

// get all questions (with optional pagination)
async function getAllQuestions(req, res) {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 6; // default 6
  const offset = (page - 1) * limit;

  try {
    // total count
    const [countRows] = await dbConnection.query(
      "SELECT COUNT(*) AS total FROM questions"
    );
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit);

    const [questions] = await dbConnection.query(
      `SELECT q.questionid, q.title, q.description, q.createdAt, u.username
       FROM questions q
       JOIN users u ON q.userid = u.userid
       ORDER BY q.createdAt DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return res.status(StatusCodes.OK).json({
      data: questions,
      page,
      totalPages,
      total,
    });
  } catch (err) {
    console.error("getAllQuestions error:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong, please try again later." });
  }
}

// get single question + its answers
async function getQuestionAndAnswer(req, res) {
  const questionid = req.params.questionId;

  try {
    const [rows] = await dbConnection.query(
      `SELECT 
         q.questionid, 
         q.title, 
         q.description, 
         q.createdAt AS question_createdAt,
         u2.username AS question_username,
         a.answerid, 
         a.userid AS answer_userid, 
         a.answer,
         a.createdAt AS answer_createdAt,
         u.username AS answer_username
       FROM questions q
       LEFT JOIN answers a ON q.questionid = a.questionid
       LEFT JOIN users u ON u.userid = a.userid
       LEFT JOIN users u2 ON u2.userid = q.userid
       WHERE q.questionid = ?
       ORDER BY a.createdAt DESC`,
      [questionid]
    );

    if (rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Question not found." });
    }

    const first = rows[0];
    const questionDetails = {
      questionid: first.questionid,
      title: first.title,
      description: first.description,
      qtn_createdAt: first.question_createdAt,
      qtn_username: first.question_username,
      answers: rows
        .filter((r) => r.answerid !== null)
        .map((r) => ({
          answerid: r.answerid,
          userid: r.answer_userid,
          username: r.answer_username,
          answer: r.answer,
          createdAt: r.answer_createdAt,
        })),
    };

    return res.status(StatusCodes.OK).json(questionDetails);
  } catch (error) {
    console.error("getQuestionAndAnswer error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching question details." });
  }
}

module.exports = { postQuestion, getAllQuestions, getQuestionAndAnswer };
