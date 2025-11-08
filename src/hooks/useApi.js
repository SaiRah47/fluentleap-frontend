import axios from 'axios';
import { useCallback } from 'react';

// --- THIS IS THE FIX ---
// We read the API URL from the environment variables.
// This allows us to use a different URL for local testing vs. production.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
// --- END OF FIX ---


/**
 * This hook provides functions to interact with the REAL backend API.
 */
export const useApi = () => {

    // Wrap functions in useCallback to stabilize them
    const getTodaysChallenge = useCallback(async () => {
        console.log("API: Fetching today's challenge...");
        try {
            const response = await axios.get(`${API_BASE_URL}/api/today`);
            console.log("API: Received today's challenge.", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching today's challenge:", error);
            return {
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                words: ["Error"],
                word_data: [
                    { word: "Error", ipa: "...", meaning: "Could not connect to backend at " + API_BASE_URL, synonyms: "...", antonyms: "...", sentence: "Make sure your Python server is running!" }
                ],
                grammar_challenge: null,
                story: "",
                feedback: ""
            };
        }
    }, []); // Empty dependency array means this function is created only once

    const postStory = useCallback(async (story) => {
        console.log("API: Posting story...");
        try {
            const response = await axios.post(`${API_BASE_URL}/api/story`, { story });
            console.log("API: Received feedback.", response.data);
            return response.data.feedback;
        } catch (error) {
            console.error("Error posting story:", error);
            return "### Error\nCould not submit story. Please check your backend connection.";
        }
    }, []);

    const getWordDetails = useCallback(async (word) => {
        console.log(`API: Fetching details for "${word}"...`);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/lookup?word=${word}`);
            console.log("API: Found word.", response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching details for "${word}":`, error);
            return {
                word: word,
                ipa: "N/A",
                meaning: "Sorry, this word could not be found.",
                synonyms: "N/A",
                antonyms: "N/A",
                sentence: ""
            };
        }
    }, []);

    const playAudio = useCallback((word) => {
        try {
            console.log(`API: Playing audio for "${word}"`);
            const audio = new Audio(`${API_BASE_URL}/api/audio?word=${word}`);
            audio.play();
        } catch (error) {
            console.error("Error playing audio:", error);
        }
    }, []);

    const getHistory = useCallback(async () => {
        console.log("API: Fetching history...");
        try {
            const response = await axios.get(`${API_BASE_URL}/api/history`);
            console.log("API: Received history.", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching history:", error);
            return []; // Return empty array on error
        }
    }, []);

    const getGrammarChallenge = useCallback(async () => {
        console.log("API: Fetching grammar challenge...");
        try {
            const response = await axios.get(`${API_BASE_URL}/api/grammar`);
            console.log("API: Received grammar challenge.", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching grammar challenge:", error);
            return {
                title: "Grammar Fix-Up: Error",
                description: "Could not load grammar challenge from the AI.",
                problems: []
            };
        }
    }, []);

    return { getTodaysChallenge, getHistory, postStory, getWordDetails, playAudio, getGrammarChallenge };
};