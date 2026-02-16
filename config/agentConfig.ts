export type agentConfig = {

    model: string,
    stream: boolean,
    system: string,
    think?: boolean,
    format?: string,
    temperature?: number,

};
export const generateUrl = "http://localhost:11434/api/generate";
export const embeddingUrl = "http://localhost:11434/api/embeddings";
export const chatUrl = "http://localhost:11434/api/chat";