const CONFIG = {
    models: {
        local: {
            name: "Local LLM",
            endpoint: "http://localhost:5000/v1/chat/completions"
        },
        openai: {
            name: "OpenAI",
            endpoint: "https://api.openai.com/v1/chat/completions"
        },
        // Add more models as needed
    }
};