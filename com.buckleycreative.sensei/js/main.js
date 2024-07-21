document.addEventListener('DOMContentLoaded', function() {
    var csInterface = new CSInterface();
    var currentModel = '';
    var apiKey = '';

    // Populate model dropdown
    var modelDropdown = document.getElementById('modelDropdown');
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

    modelDropdown.addEventListener('change', function(e) {
        currentModel = e.target.value;
        updateApiKeyPlaceholder();
    });

    // Navigation
    document.getElementById('settingsButton').addEventListener('click', showSettingsView);
    document.getElementById('mainViewButton').addEventListener('click', showMainView);

    document.getElementById('saveSettings').addEventListener('click', function() {
        apiKey = document.getElementById('apiKeyInput').value;
        showMainView();
        // Here you might want to save the API key securely
    });

    document.getElementById('sendButton').addEventListener('click', sendMessage);
    document.getElementById('runCodeButton').addEventListener('click', runGeneratedCode);

    function showSettingsView() {
        document.getElementById('mainView').classList.add('hidden');
        document.getElementById('settingsView').classList.remove('hidden');
        document.getElementById('settingsButton').classList.add('hidden');
        document.getElementById('mainViewButton').classList.remove('hidden');
    }

    function showMainView() {
        document.getElementById('settingsView').classList.add('hidden');
        document.getElementById('mainView').classList.remove('hidden');
        document.getElementById('mainViewButton').classList.add('hidden');
        document.getElementById('settingsButton').classList.remove('hidden');
    }

    function updateApiKeyPlaceholder() {
        var placeholder = currentModel === 'local' ? 'Enter localhost URL' : 'Enter API Key';
        document.getElementById('apiKeyInput').placeholder = placeholder;
    }

    function sendMessage() {
        var userInput = document.getElementById('userInput').value;
        if (!userInput.trim()) return;

        addMessageToChat('user', userInput);
        sendToLLM(userInput);
        document.getElementById('userInput').value = '';
    }

    function addMessageToChat(sender, message) {
        var chatHistory = document.getElementById('chatHistory');
        var messageElement = document.createElement('div');
        messageElement.className = sender + '-message';
        messageElement.innerText = message;
        chatHistory.appendChild(messageElement);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    async function sendToLLM(userInput) {
        const modelConfig = CONFIG.models[currentModel];
        const endpoint = modelConfig.endpoint;

        let headers = {
            'Content-Type': 'application/json'
        };

        let body = {
            messages: [{ role: 'user', content: userInput }]
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

            // Check if the response includes code and display it
            if (assistantResponse.includes('```')) {
                const code = assistantResponse.split('```')[1];
                displayGeneratedCode(code);
            }
        } catch (error) {
            console.error('Error:', error);
            addMessageToChat('assistant', 'Sorry, there was an error processing your request.');
        }
    }

    function displayGeneratedCode(code) {
        const codeElement = document.getElementById('generatedCode');
        codeElement.textContent = code;
        document.getElementById('codeOutput').style.display = 'block';
    }

    function runGeneratedCode() {
        const code = document.getElementById('generatedCode').textContent;
        csInterface.evalScript(`(function() { ${code} })()`, function(result) {
            console.log('After Effects script result:', result);
            addMessageToChat('system', `Code executed. Result: ${result}`);
        });
    }

    // Initialize
    updateApiKeyPlaceholder();
});