const CONFIG = {
    models: {
        local: {
            name: "Local LLM",
            endpoint: "http://localhost:11434/api/chat"
        },
        openai: {
            name: "OpenAI",
            endpoint: "https://api.openai.com/v1/chat/completions"
        }
    }
};