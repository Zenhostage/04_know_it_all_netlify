const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

console.log('before handler');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const conversationHistory = body.message;

    console.log('conv is ' + JSON.stringify(conversationHistory));

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: conversationHistory,
      max_tokens: 50,
      presence_penalty: 0,
      frequency_penalty: 0.3
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: response.choices[0].message.content
      }),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
