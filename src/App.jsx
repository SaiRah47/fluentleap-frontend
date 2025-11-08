import React, { useState, useEffect, useRef } from 'react';
import Hero from './components/Hero';

// Import the REAL API hook (and the new base URL)
import { useApi, API_BASE_URL } from './hooks/useApi'; // <-- UPDATED

// Import components
import Loader from './components/Common/Loader';
import WordButtonCard from './components/TodayChallenge/WordButtonCard';
import GrammarChallenge from './components/TodayChallenge/GrammarChallenge';
import StoryEditor from './components/TodayChallenge/StoryEditor';
import FeedbackDisplay from './components/TodayChallenge/FeedbackDisplay';
import FloatingLookupButton from './components/Common/FloatingLookupButton';

// --- IMPORTS FOR HISTORY & GAMES ---
import HistoryTimeline from './components/History/HistoryTimeline';
import GameButtons from './components/History/GameButtons';
import WordModal from './components/Modals/WordModal';
import WordLookupModal from './components/Modals/WordLookupModal';
import HistoryModal from './components/Modals/HistoryModal';
import GameModal from './components/Modals/GameModal';
import SentenceScrambleModal from './components/Modals/SentenceScrambleModal';
import FeedbackModal from './components/Modals/FeedbackModal'; // Import FeedbackModal


export default function App() {
  const challengeSectionRef = useRef(null);

  // Get ALL API functions from the REAL hook
  const {
    getTodaysChallenge,
    postStory,
    getWordDetails,
    playAudio,
    getHistory,
    getGrammarChallenge // New function
  } = useApi();

  // "Today" state
  const [challengeData, setChallengeData] = useState(null);
  const [grammarChallenge, setGrammarChallenge] = useState(null);
  const [story, setStory] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [usedWords, setUsedWords] = useState(new Set());
  const [isLoadingChallenge, setIsLoadingChallenge] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [readWords, setReadWords] = useState(new Set());

  // "History" state
  const [historyData, setHistoryData] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [allLearnedWords, setAllLearnedWords] = useState([]);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [isScrambleGameModalOpen, setIsScrambleGameModalOpen] = useState(false);
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState(null);

  // Modal state
  const [selectedWord, setSelectedWord] = useState(null);
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Check if all of today's words have been read
  const allWordsRead = challengeData && challengeData.word_data.length > 0 && readWords.size === challengeData.word_data.length;

  // Fetch all data on initial component mount
  useEffect(() => {
    // Fetch today's challenge
    getTodaysChallenge().then(data => {
      setChallengeData(data);
      if (data.story) setStory(data.story);
      if (data.feedback) setFeedback(data.feedback);
      if (data.word_data && data.story) {
        updateUsedWords(data.story, data.word_data);

        // --- THIS IS THE PERSISTENCE FIX ---
        // If a story exists, the user must have read the words.
        const allTodayWords = data.word_data.map(wd => wd.word);
        setReadWords(new Set(allTodayWords));
        // --- END OF FIX ---
      }
      setIsLoadingChallenge(false);
    });

    // Fetch grammar challenge
    getGrammarChallenge().then(data => {
      setGrammarChallenge(data);
    });

    // Fetch history
    getHistory().then(data => {
      setHistoryData(data);
      // Process all learned words for the games
      const allWords = data.flatMap(entry => entry.word_data);
      const uniqueWords = Array.from(new Map(allWords.map(word => [word.word, word])).values())
        .filter(word => word.sentences || word.sentence); // Ensure word has a sentence for the game
      setAllLearnedWords(uniqueWords);
      setIsLoadingHistory(false);
    });
  }, [getTodaysChallenge, getHistory, getGrammarChallenge]);

  // --- Handlers ---

  const scrollToChallenge = () => {
    challengeSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const updateUsedWords = (text, wordData) => {
    if (!wordData) return;
    const lowerText = text.toLowerCase();
    const foundWords = new Set();
    wordData.forEach(data => {
      const regex = new RegExp(`\\b${data.word.toLowerCase()}\\b`);
      if (regex.test(lowerText)) {
        foundWords.add(data.word);
      }
    });
    setUsedWords(foundWords);
  };

  const handleStoryChange = (e) => {
    const newText = e.target.value;
    setStory(newText);
    updateUsedWords(newText, challengeData?.word_data);
  };

  const handleSubmitStory = async () => {
    if (!story.trim()) return;
    setIsSubmitting(true);
    const feedbackText = await postStory(story);
    setFeedback(feedbackText);
    setIsSubmitting(false);

    // Refresh history after submission
    getHistory().then(data => {
      setHistoryData(data);
      // Also update the word list for games
      const allWords = data.flatMap(entry => entry.word_data);
      const uniqueWords = Array.from(new Map(allWords.map(word => [word.word, word])).values())
        .filter(word => word.sentences || word.sentence);
      setAllLearnedWords(uniqueWords);
    });
  };

  // --- Modal Handlers ---

  const handleWordClick = (wordData) => {
    if (challengeData?.words.includes(wordData.word)) {
      setReadWords(prevReadWords => new Set(prevReadWords).add(wordData.word));
    }
    setSelectedWord(wordData);
  };

  const closeWordModal = () => setSelectedWord(null);
  const openLookupModal = () => setIsLookupModalOpen(true);
  const closeLookupModal = () => setIsLookupModalOpen(false);
  const openHistoryModal = (entry) => setSelectedHistoryEntry(entry);
  const closeHistoryModal = () => setSelectedHistoryEntry(null);
  const openGameModal = () => setIsGameModalOpen(true);
  const closeGameModal = () => setIsGameModalOpen(false);
  const openScrambleGameModal = () => setIsScrambleGameModalOpen(true);
  const closeScrambleGameModal = () => setIsScrambleGameModalOpen(false);

  // --- FEEDBACK MODAL HANDLERS ---
  const openFeedbackModal = () => setIsFeedbackModalOpen(true);
  const closeFeedbackModal = () => setIsFeedbackModalOpen(false);


  return (
    <>
      <main className="app-container">
        {/* HERO SECTION */}
        <Hero onStartClick={scrollToChallenge} />

        {/* --- CHALLENGE SECTION --- */}
        <div ref={challengeSectionRef} id="challenge-section" className="challenge-section">
          {isLoadingChallenge ? (
            <Loader message="Loading Your Daily Challenge..." />
          ) : (
            <>
              <h2 className="section-title">
                Your Challenge for {challengeData.date}
              </h2>
              <div className="columns-container">

                {/* COLUMN 1: WORD CARDS & GRAMMAR */}
                <div className="word-cards-column">
                  {challengeData.word_data.map((wordData) => (
                    <WordButtonCard
                      key={wordData.word}
                      wordData={wordData}
                      onWordClick={handleWordClick}
                      isRead={readWords.has(wordData.word)}
                    />
                  ))}

                  {grammarChallenge && (
                    <GrammarChallenge
                      challenge={grammarChallenge}
                    />
                  )}
                </div>

                {/* COLUMN 2: STORY EDITOR */}
                <div className="story-editor-column">
                  <StoryEditor
                    story={story}
                    onStoryChange={handleStoryChange}
                    onSubmit={handleSubmitStory}
                    words={challengeData.word_data.map(w => w.word)}
                    usedWords={usedWords}
                    isSubmitting={isSubmitting}
                    isUnlocked={allWordsRead}
                    feedback={feedback} // <-- Pass feedback down
                    onOpenFeedback={openFeedbackModal} // <-- Pass handler down
                  />

                  {/* FeedbackDisplay component removed from here */}
                </div>
              </div>
            </>
          )}
        </div>

        {/* --- HISTORY TIMELINE SECTION --- */}
        <div className="history-timeline-section">
          <h2 className="section-title" style={{ color: 'white' }}>
            📸 Memory Timeline
          </h2>
          <GameButtons
            onGameClick={openGameModal}
            onScrambleClick={openScrambleGameModal}
          />
          {isLoadingHistory ? (
            <Loader message="Loading History..." isDark={true} />
          ) : (
            <HistoryTimeline
              historyData={historyData}
              onOpenModal={openHistoryModal}
              onWordClick={handleWordClick}
              apiBaseUrl={API_BASE_URL} // <-- PASS THE URL AS A PROP
            />
          )}
        </div>
      </main>

      {/* --- MODALS & BUTTONS --- */}

      <FloatingLookupButton onClick={openLookupModal} />

      {selectedWord && (
        <WordModal
          wordData={selectedWord}
          onClose={closeWordModal}
          playAudio={playAudio}
        />
      )}

      {isLookupModalOpen && (
        <WordLookupModal
          onClose={closeLookupModal}
          getWordDetails={getWordDetails}
          playAudio={playAudio}
        />
      )}

      {selectedHistoryEntry && (
        <HistoryModal
          entry={selectedHistoryEntry}
          onClose={closeHistoryModal}
          onWordClick={handleWordClick}
        />
      )}

      {isGameModalOpen && (
        <GameModal
          onClose={closeGameModal}
          allLearnedWords={allLearnedWords}
        />
      )}

      {isScrambleGameModalOpen && (
        <SentenceScrambleModal
          onClose={closeScrambleGameModal}
          allLearnedWords={allLearnedWords}
        />
      )}

      {/* --- NEW FEEDBACK MODAL RENDER --- */}
      {isFeedbackModalOpen && feedback && (
        <FeedbackModal feedback={feedback} onClose={closeFeedbackModal} />
      )}
    </>
  );
}