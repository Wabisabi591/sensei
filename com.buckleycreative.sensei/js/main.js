document.addEventListener('DOMContentLoaded', function() {
    var csInterface = new CSInterface();
    var currentModel = 'local'; // Default to local Mistral
    var apiKey = '';

    // Configuration
    const CONFIG = {
        models: {
            local: {
                name: "Mistral (Local)",
                endpoint: "http://localhost:11434/v1/chat/completions"
            },
            openai: {
                name: "OpenAI",
                endpoint: "https://api.openai.com/v1/chat/completions"
            }
        }
    };

    // DOM Elements
    var modelDropdown = document.getElementById('modelDropdown');
    var userInput = document.getElementById('userInput');
    var sendButton = document.getElementById('sendButton');
    var settingsButton = document.getElementById('settingsButton');
    var mainViewButton = document.getElementById('mainViewButton');
    var apiKeyInput = document.getElementById('apiKeyInput');
    var saveSettingsButton = document.getElementById('saveSettings');
    var mainView = document.getElementById('mainView');
    var settingsView = document.getElementById('settingsView');
    var chatHistory = document.getElementById('chatHistory');

    // Populate model dropdown
    for (var key in CONFIG.models) {
        var option = document.createElement('option');
        option.value = key;
        option.textContent = CONFIG.models[key].name;
        modelDropdown.appendChild(option);
    }

    // Event Listeners
    modelDropdown.addEventListener('change', function(e) {
        currentModel = e.target.value;
    });

    sendButton.addEventListener('click', sendMessage);
    settingsButton.addEventListener('click', showSettingsView);
    mainViewButton.addEventListener('click', showMainView);
    saveSettingsButton.addEventListener('click', saveSettings);

    function showSettingsView() {
        mainView.classList.add('hidden');
        settingsView.classList.remove('hidden');
        settingsButton.classList.add('hidden');
        mainViewButton.classList.remove('hidden');
    }

    function showMainView() {
        settingsView.classList.add('hidden');
        mainView.classList.remove('hidden');
        mainViewButton.classList.add('hidden');
        settingsButton.classList.remove('hidden');
    }

    function saveSettings() {
        apiKey = apiKeyInput.value;
        // Here you might want to save the API key securely
        alert('Settings saved successfully!');
        showMainView();
    }

    function sendMessage() {
        var message = userInput.value;
        if (!message.trim()) return;

        addMessageToChat('user', message);
        sendToLLM(message);
        userInput.value = '';
    }

    function addMessageToChat(sender, message) {
        var messageDiv = document.createElement('div');
        messageDiv.className = sender + '-message';
        messageDiv.textContent = message;
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    async function sendToLLM(userMessage) {
        const modelConfig = CONFIG.models[currentModel];
        const endpoint = modelConfig.endpoint;

        let headers = {
            'Content-Type': 'application/json'
        };

        let body = {
            model: "mistral", // Use the Mistral model for local
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: userMessage }
            ]
        };

        if (currentModel === 'openai') {
            headers['Authorization'] = `Bearer ${apiKey}`;
            body.model = "gpt-3.5-turbo"; // or your preferred OpenAI model
        }

        try {
            console.log('Sending request to:', endpoint);
            console.log('Request body:', JSON.stringify(body));

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorBody = await response.text();
                console.error('Response not OK:', response.status, errorBody);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response data:', data);

            let assistantResponse = data.choices[0].message.content;
            addMessageToChat('assistant', assistantResponse);

        } catch (error) {
            console.error('Detailed error:', error);
            addMessageToChat('assistant', 'Sorry, there was an error processing your request.');
        }
    }

    // Initialize
    showMainView();
});