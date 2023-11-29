
import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js'
import {getDatabase, ref, push, get, remove} from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js'

const chatbotConversation = document.getElementById('chatbot-conversation')
 
const  instructionObj= 
    {
        role: 'system',
        content: 'Be kind.Answer short.'
    }



    fetch('/.netlify/functions/firebaseConfig')
    .then(response => response.json())
    .then(config => {
        const app = initializeApp(config);
        // continue with Firebase initialization...
    });


const database = getDatabase(app)

const conversationInDb = ref(database)

 
document.addEventListener('submit', (e) => {
    e.preventDefault()
    const userInput = document.getElementById('user-input')   
    push(conversationInDb, { 
        role: 'user',
        content: userInput.value
    })
    fetchReply()
    const newSpeechBubble = document.createElement('div')
    newSpeechBubble.classList.add('speech', 'speech-human')
    chatbotConversation.appendChild(newSpeechBubble)
    newSpeechBubble.textContent = userInput.value
    userInput.value = ''
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight
})

 function fetchReply() {

    get(conversationInDb).then(async (snapshot)=>{
        if(snapshot.exists()){
            const conversationArr = Object.values(snapshot.val())
                        
            conversationArr.unshift(instructionObj)
            try {
                const response = await fetch('http://localhost:3000/getResponse', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: conversationArr // Send the entire conversation history
                    })
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
        
                const data = await response.json(); // Properly handle JSON response
                console.log(response)
                const botMessage = data.message; // Extract the message from the JSON object
                console.log(data)

                push(conversationInDb, { role: 'system', content: botMessage });
                
                renderTypewriterText(botMessage);

            } catch (error) {
                console.error('Fetch error:', error);
            }
        }
        else {
            console.log('No data available')
        }
    })    
    
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

document.getElementById('clear-btn').addEventListener('click', () => {
    remove(conversationInDb)
    chatbotConversation.innerHTML = '<div class="speech speech-ai">How can I help you?</div>'
})

function renderConversationFromDb(){
    get(conversationInDb).then(async (snapshot)=>{
        if(snapshot.exists()) {
            Object.values(snapshot.val()).forEach(dbObj => {
                const newSpeechBubble = document.createElement('div')
                newSpeechBubble.classList.add(
                    'speech',
                    `speech-${dbObj.role === 'user' ? 'human' : 'ai'}`
                    )
                chatbotConversation.appendChild(newSpeechBubble)
                newSpeechBubble.textContent = dbObj.content
            })
            chatbotConversation.scrollTop = chatbotConversation.scrollHeight
        }
    })
}

renderConversationFromDb()