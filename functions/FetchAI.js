import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const handler = async (event) => {
  const conversationHistory = event.body.message
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: conversationHistory,
       max_tokens: 50,
       presence_penalty:0,
       frequency_penalty:0.3
  }) 


    return {
      statusCode: 200,
      body: JSON.stringify({
        message: response.choices[0].message.content 
      })  
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
