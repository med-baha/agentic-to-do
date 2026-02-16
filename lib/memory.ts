


export class Memory {
    private prompt = "";
    private previousUserPrompts: string[] = [];
    constructor() {

    }

    setPrompt(prompt: string) {
        this.prompt = prompt;
    }

    getPrompt() {
        return this.prompt;
    }

    addPreviousUserPrompts(prompt: string) {
        this.previousUserPrompts.push(prompt);
    }

    getPreviousUserPrompts() {
        return this.previousUserPrompts;
    }
    clearPreviousUserPrompts() {
        this.previousUserPrompts = [];
    }

    getPreviousUserPromptCount() {
        return this.previousUserPrompts.length;
    }




}

