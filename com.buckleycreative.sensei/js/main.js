document.addEventListener('DOMContentLoaded', function() {
    var csInterface = new CSInterface();
    var currentModel = '';
    var apiKey = '';

    // DOM Elements
    var modelDropdown = document.getElementById('modelDropdown');
    var userInput = document.getElementById('userInput');
    var sendButton = document.getElementById('sendButton');
    var settingsButton = document.getElementById('settingsButton');
    var backToChatButton = document.getElementById('backToChatButton');
    var apiKeyInput = document.getElementById('apiKeyInput');
    var saveSettingsButton = document.getElementById('saveSettings');
    var mainView = document.getElementById('mainView');
    var settingsView = document.getElementById('settingsView');

    // Populate model dropdown
    for (var key in CONFIG.models) {
        var option = document.createElement('option');
        option.value = key;
        option.textContent = CONFIG.models[key].name;
        modelDropdown.appendChild(option);
    }

    // Set initial model
    if (modelDropdown.options.length > 0) {
        currentModel = modelDropdown.options[0].value;
    }

    // Event Listeners
    modelDropdown.addEventListener('change', function(e) {
        currentModel = e.target.value;
    });

    sendButton.addEventListener('click', sendMessage);
    settingsButton.addEventListener('click', showSettingsView);
    backToChatButton.addEventListener('click', showMainView);
    saveSettingsButton.addEventListener('click', saveSettings);

    function showSettingsView() {
        mainView.classList.add('hidden');
        settingsView.classList.remove('hidden');
    }

    function showMainView() {
        settingsView.classList.add('hidden');
        mainView.classList.remove('hidden');
    }

    function saveSettings() {
        apiKey = apiKeyInput.value;
        // Here you might want to save the API key securely
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
        var chatHistory = document.createElement('div');
        chatHistory.className = sender + '-message';
        chatHistory.textContent = message;
        mainView.insertBefore(chatHistory, userInput);
    }

    async function sendToLLM(userMessage) {
        const modelConfig = CONFIG.models[currentModel];
        const endpoint = modelConfig.endpoint;

        let headers = {
            'Content-Type': 'application/json'
        };

        let body = {
            messages: [{ role: 'user', content: userMessage }]
        };

        if (currentModel === 'openai') {
            headers['Authorization'] = `Bearer ${apiKey}`;
            body.model = 'gpt-3.5-turbo'; // or your preferred model
        } else if (currentModel === 'local') {
            // Adjust as needed for your local model's API
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            let assistantResponse;
            if (currentModel === 'openai') {
                assistantResponse = data.choices[0].message.content;
            } else if (currentModel === 'local') {
                // Parse the response based on your local model's output format
                assistantResponse = data.response; // Adjust this based on your local model's response structure
            }

            addMessageToChat('assistant', assistantResponse);

        } catch (error) {
            console.error('Error:', error);
            addMessageToChat('assistant', 'Sorry, there was an error processing your request.');
        }
    }

    // Initialize
    showMainView();
});