
const chatbotConversation = document.getElementById('chatbot-conversation')
 
const  instructionObj= 
    {
        role: 'system',
        content: 'Be kind.Answer short.'
    }

 
document.addEventListener('submit', (e) => {
    e.preventDefault()
    const userInput = document.getElementById('user-input')   
    const userInputAI = userInput.value
    console.log(userInputAI)
    fetchReply(userInputAI)
    const newSpeechBubble = document.createElement('div')
    newSpeechBubble.classList.add('speech', 'speech-human')
    chatbotConversation.appendChild(newSpeechBubble)
    newSpeechBubble.textContent = userInput.value
    userInput.value = ''
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight
})

 async function fetchReply(userInputAI) {
        const conversationHistory = [{ role: 'user', content: userInputAI }]; 
            try {
                const response = await fetch('http://localhost:3000/getResponse', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: conversationHistory  // Send the entire conversation history
                    })
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
        
                const data = await response.json(); // Properly handle JSON response
                console.log(response)
                const botMessage = data.message; // Extract the message from the JSON object
                console.log(data)

                // push(conversationInDb, { role: 'system', content: botMessage });
                
                renderTypewriterText(botMessage);

            } catch (error) {
                console.error('Fetch error:', error);
            }
        }
        


function renderTypewriterText(text) {
    const newSpeechBubble = document.createElement('div')
    newSpeechBubble.classList.add('speech', 'speech-ai', 'blinking-cursor')
    chatbotConversation.appendChild(newSpeechBubble)
    let i = 0
    const interval = setInterval(() => {
        newSpeechBubble.textContent += text.slice(i-1, i)
        if (text.length === i) {
            clearInterval(interval)
            newSpeechBubble.classList.remove('blinking-cursor')
        }
        i++
        chatbotConversation.scrollTop = chatbotConversation.scrollHeight
    }, 50)
}



