const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Настройка nodemailer для отправки писем
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

// API endpoint для получения ответа на опрос
app.post('/api/send-answer', async (req, res) => {
  try {
    const { vote, comment } = req.body;

    if (!vote) {
      return res.status(400).json({ error: 'Vote is required' });
    }

    const voteText = vote === 'yes' ? 'Да ✓' : 'Нет ✗';
    const htmlContent = `
      <h2>Новый ответ на опрос! 💌</h2>
      <p><strong>Вопрос:</strong> я тебе нравлюсь?</p>
      <p><strong>Ответ:</strong> ${voteText}</p>
      ${comment ? `<p><strong>Комментарий:</strong><br>${comment}</p>` : '<p><em>Комментария нет</em></p>'}
      <hr>
      <p style="color: #999; font-size: 12px;">Отправлено с 💖</p>
    `;

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: 'yernazaraltynbekov@icloud.com',
      subject: `Ответ на опрос: ${voteText}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log('✓ Письмо отправлено на yernazaraltynbekov@icloud.com');
    res.json({ success: true, message: 'Спасибо! Ответ отправлен.' });
  } catch (error) {
    console.error('✗ Ошибка отправки письма:', error);
    res.status(500).json({ error: 'Ошибка при отправке. Проверьте настройки сервера.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log('Готовность к отправке писем...');
});
