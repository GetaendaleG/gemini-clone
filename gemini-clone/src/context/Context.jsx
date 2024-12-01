/* eslint-disable no-unused-vars */
import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [conversation, setConversation] = useState([]);
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    // Delay function to display response word by word
    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData((prev) => prev + nextWord);
        }, 75 * index);
    };

    // Start a new chat and reset state
    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    };

    // Function to send prompt and get response
    const onSent = async (prompt) => {
        setResultData(""); // Clear previous response
        setLoading(true); // Set loading to true while awaiting response
        setShowResult(true); // Show result area

        let currentPrompt = prompt || input; // Use input if prompt is undefined
        setRecentPrompt(currentPrompt);

        try {
            // Call the `run` function to get the response
            const response = await run(currentPrompt);

            // Format the response text
            let responseArray = response.split("**");
            let formattedResponse = "";
            for (let i = 0; i < responseArray.length; i++) {
                if (i === 0 || i % 2 !== 1) {
                    formattedResponse += responseArray[i];
                } else {
                    formattedResponse += "<b>" + responseArray[i] + "</b>";
                }
            }
            let finalResponse = formattedResponse.split("*").join("</br>");

            // Append to conversation history
            setPrevPrompts((prev) => [...prev, currentPrompt]);
            setConversation((prev) => [
                ...prev,
                { prompt: currentPrompt, response: finalResponse },
            ]);

            // Display the response word by word
            let responseWords = finalResponse.split(" ");
            for (let i = 0; i < responseWords.length; i++) {
                const nextWord = responseWords[i];
                delayPara(i, nextWord + " ");
            }
        } catch (error) {
            console.error("Error sending prompt:", error);
        } finally {
            setLoading(false); // Reset loading state
            setInput(""); // Clear input after sending prompt
        }
    };

    // Context value to pass into the provider
    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        conversation, // Adding conversation history to the context value
        setConversation // Function to set conversation in case it's needed elsewhere
    };

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
