import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("Hello from content script");


// function to send the selected text to the api
const apiRequest = async (text: string) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        console.error('API key is not defined');
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Rephrase the following text to make it easier for people with language difficulties to understand: ${text}`

        const result = await model.generateContent(prompt);
        console.log("Full Result Object:", result);

        const rephrasedText = result.response?.text();
        if (rephrasedText) {
            console.log("Rephrased text:", rephrasedText);
            replaceSelectedText(rephrasedText);
        } else {
            console.error("No rephrased text found in the response");
        }
    } catch (error) {
        console.error("Error during API request:", error);

    }

};


// function to replace the selected text with the translated text
const replaceSelectedText = (replacementText: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(replacementText));

    }
    selection!.removeAllRanges();
}


// monitor mouse events, and when text content is selected send it to api request function
addEventListener("mouseup", () => {
    const selection = window.getSelection();
    if (selection && selection.isCollapsed === false) {
        console.log("Selected text: ", selection.toString().trim());
        const selectedText = selection.toString().trim();
        // check if the selected content is a valid text
        if (selectedText && selectedText.length > 0) {
            // send the selected text to the api request function
            apiRequest(selectedText);
        }
    }
});