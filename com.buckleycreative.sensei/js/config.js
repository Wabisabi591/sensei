const CONFIG = {
    models: {
        local: {
            name: "Mistral (Ollama)",
            endpoint: "http://localhost:11434/v1/chat/completions"
        },
        openai: {
            name: "OpenAI",
            endpoint: "https://api.openai.com/v1/chat/completions"
        }
    }
};