
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { ENV } from "./config/env.js";

const uploadFile = async () => {
    try {
        const formData = new FormData();
        // Create a dummy PDF file
        fs.writeFileSync("test_resume.pdf", "Dummy PDF Content");

        // Append file to form data
        formData.append("resume", fs.createReadStream("test_resume.pdf"));

        // We need a userId to associate with. Let's create a test user first or use an existing one if possible.
        // Or just hit the upload endpoint if we can bypass auth for testing, but it requires auth.
        // So let's try to login or just create a token.
        // Assuming we can't easily get a token without login flow.

        // Alternative: Inspect the multer middleware in `uploadMiddleware.js` and add logging there.
        // But modifying running code requires restart.

        console.log("To fully test valuable upload effectively without auth token is hard. switching strategy.");
    } catch (error) {
        console.error("Error:", error);
    }
};
