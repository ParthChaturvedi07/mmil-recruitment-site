import { ENV } from "../config/env.js";

class KeyManager {
    constructor() {
        this.keys = ENV.GEMINI_API_KEYS || [];
        this.currentIndex = 0;
        if (this.keys.length === 0) {
            console.warn("⚠️ No Gemini API keys found in configuration!");
        } else {
            console.log(`✅ Loaded ${this.keys.length} Gemini API keys.`);
        }
    }

    getApiKey() {
        if (this.keys.length === 0) return null;
        return this.keys[this.currentIndex];
    }

    rotateKey() {
        if (this.keys.length <= 1) return false;
        this.currentIndex = (this.currentIndex + 1) % this.keys.length;
        console.log(`🔄 Rotating API Key to index ${this.currentIndex}`);
        return true;
    }

    async executeWithRetry(apiCallFn) {
        let attempts = 0;
        const maxAttempts = this.keys.length;

        while (attempts < maxAttempts) {
            try {
                return await apiCallFn(this.getApiKey());
            } catch (error) {
                attempts++;
                const isQuotaError = error.message?.includes("429") || error.status === 429 || error.message?.toLowerCase().includes("quota");

                if (isQuotaError && attempts < maxAttempts) {
                    console.warn(`⚠️ API Key quota exceeded or rate limited. Rotating key... (Attempt ${attempts}/${maxAttempts})`);
                    this.rotateKey();
                    continue;
                }

                // If it's not a quota error, or we've run out of keys, throw properly
                throw error;
            }
        }
    }
}

export const keyManager = new KeyManager();
