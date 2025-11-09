import React, { useState, useEffect, useRef } from 'react';
import Hero from './components/Hero';
import { useApi } from './hooks/useApi';

// Import components
import Loader from './components/Common/Loader';
import WordButtonCard from './components/TodayChallenge/WordButtonCard';
import StoryEditor from './components/TodayChallenge/StoryEditor';
import FloatingLookupButton from './components/Common/FloatingLookupButton';

// --- IMPORTS FOR HISTORY & GAMES ---
import HistoryTimeline from './components/History/HistoryTimeline';
import GameButtons from './components/History/GameButtons';
import WordModal from './components/Modals/WordModal';
import WordLookupModal from './components/Modals/WordLookupModal';
import HistoryModal from './components/Modals/HistoryModal';
import GameModal from './components/Modals/GameModal';
import SentenceScrambleModal from './components/Modals/SentenceScrambleModal';
import FeedbackModal from './components/Modals/FeedbackModal';
import GrammarChallenge from './components/TodayChallenge/GrammarChallenge'; // We need this for the modal


export default function App() {
  const challengeSectionRef = useRef(null);

  const {
    getTodaysChallenge,
    postStory,
    getWordDetails,
    playAudio,
    getHistory,
    getGrammarChallenge // We still need this!
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
  const [readIdioms, setReadIdioms] = useState(new Set()); // <-- New state

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
  const [isGrammarModalOpen, setIsGrammarModalOpen] = useState(false); // <-- New state

  // --- Unlock Logic (Request 1) ---
  const allWordsRead = challengeData && challengeData.word_data.length > 0 && readWords.size === challengeData.word_data.length;
  const allIdiomsRead = challengeData && challengeData.dailyIdioms && challengeData.dailyIdioms.length > 0 && readIdioms.size === challengeData.dailyIdioms.length;
  const isStoryUnlocked = allWordsRead && allIdiomsRead;

  // Fetch all data on initial component mount
  useEffect(() => {
    // Fetch today's challenge (words + idioms)
    getTodaysChallenge().then(data => {
      setChallengeData(data);
      if (data.story) setStory(data.story);
      if (data.feedback) setFeedback(data.feedback);

      // Persistence logic
      if (data.word_data && data.story) {
        updateUsedWords(data.story, data.word_data, data.dailyIdioms);

        const allTodayWords = data.word_data.map(wd => wd.word);
        setReadWords(new Set(allTodayWords));

        if (data.dailyIdioms) {
          const allTodayIdioms = data.dailyIdioms.map(idm => idm.word);
          setReadIdioms(new Set(allTodayIdioms));
        }
      }
      setIsLoadingChallenge(false);
    });

    // Fetch grammar challenge (still needed for the modal)
    getGrammarChallenge().then(data => {
      setGrammarChallenge(data);
    });

    // Fetch history
    getHistory().then(data => {
      setHistoryData(data);
      const allWords = data.flatMap(entry => entry.word_data.concat(entry.dailyIdioms || []));
      const uniqueWords = Array.from(new Map(allWords.map(word => [word.word, word])).values())
        .filter(word => word && (word.sentences || word.sentence));
      setAllLearnedWords(uniqueWords);
      setIsLoadingHistory(false);
    });
  }, [getTodaysChallenge, getHistory, getGrammarChallenge]);

  // --- Handlers ---

  const scrollToChallenge = () => {
    challengeSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const updateUsedWords = (text, wordData, idiomData) => {
    if (!text) return;
    const lowerText = text.toLowerCase();
    const foundWords = new Set();

    if (wordData) {
      wordData.forEach(data => {
        // Get the list of forms. Fallback to just the word itself.
        const formsToSearch = data.forms ? data.forms.split(',').map(f => f.trim().toLowerCase()) : [data.word.toLowerCase()];

        // Add the base word to the list just in case
        formsToSearch.push(data.word.toLowerCase());

        for (const form of formsToSearch) {
          if (form) {
            // Use regex to check for the word as a whole word
            // We escape special regex characters from the form
            const escapedForm = form.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            const regex = new RegExp(`\\b${escapedForm}\\b`);
            if (regex.test(lowerText)) {
              foundWords.add(data.word); // Add the *base word*
              break; // Stop checking once we find one match
            }
          }
        }
      });
    }

    if (idiomData) {
      idiomData.forEach(data => {
        // Idioms are simpler: just check if the string is included
        if (lowerText.includes(data.word.toLowerCase())) {
          foundWords.add(data.word);
        }
      });
    }
    setUsedWords(foundWords);
  };

  const handleStoryChange = (e) => {
    const newText = e.target.value;
    setStory(newText);
    updateUsedWords(newText, challengeData?.word_data, challengeData?.dailyIdioms);
  };

  const handleSubmitStory = async () => {
    if (!story.trim()) return;
    setIsSubmitting(true);
    const feedbackText = await postStory(story);
    setFeedback(feedbackText);
    setIsSubmitting(false);

    // Refresh history
    getHistory().then(data => {
      setHistoryData(data);
    });
  };

  // --- Modal Handlers ---

  const handleWordClick = (wordData) => {
    setReadWords(prevReadWords => new Set(prevReadWords).add(wordData.word));
    setSelectedWord(wordData);
  };

  const handleIdiomClick = (idiomData) => {
    setReadIdioms(prevReadIdioms => new Set(prevReadIdioms).add(idiomData.word));
    setSelectedWord(idiomData); // Reuse WordModal
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
  const openFeedbackModal = () => setIsFeedbackModalOpen(true);
  const closeFeedbackModal = () => setIsFeedbackModalOpen(false);
  const openGrammarModal = () => setIsGrammarModalOpen(true); // <-- New handler
  const closeGrammarModal = () => setIsGrammarModalOpen(false); // <-- New handler


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

                {/* COLUMN 1: WORD CARDS & IDIOMS (Request 1) */}
                <div className="word-cards-column">

                  {/* --- 1. Words of the Day --- */}
                  <h3 className="column-heading">Words of the Day</h3>
                  <div className="card-list"> {/* (Request 3) */}
                    {challengeData.word_data.map((wordData) => (
                      <WordButtonCard
                        key={wordData.word}
                        wordData={wordData}
                        onWordClick={handleWordClick}
                        isRead={readWords.has(wordData.word)}
                      />
                    ))}
                  </div>

                  {/* --- 2. Idioms of the Day --- */}
                  {challengeData.dailyIdioms && (
                    <>
                      <h3 className="column-heading">Idioms of the Day</h3>
                      <div className="card-list"> {/* (Request 3) */}
                        {challengeData.dailyIdioms.map((idiomData) => (
                          <WordButtonCard
                            key={idiomData.word}
                            wordData={idiomData}
                            onWordClick={handleIdiomClick}
                            isRead={readIdioms.has(idiomData.word)}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Grammar card is removed from here (Request 2) */}

                </div>

                {/* COLUMN 2: STORY EDITOR */}
                <div className="story-editor-column">
                  <StoryEditor
                    story={story}
                    onStoryChange={handleStoryChange}
                    onSubmit={handleSubmitStory}
                    wordData={challengeData.word_data}
                    dailyIdioms={challengeData.dailyIdioms}
                    usedWords={usedWords}
                    storyText={story}
                    isSubmitting={isSubmitting}
                    isUnlocked={isStoryUnlocked} // <-- (Request 1b)
                    feedback={feedback}
                    onOpenFeedback={openFeedbackModal}
                  />
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
            onGrammarClick={openGrammarModal} // <-- (Request 2)
          />
          {isLoadingHistory ? (
            <Loader message="Loading History..." isDark={true} />
          ) : (
            <HistoryTimeline
              historyData={historyData}
              onOpenModal={openHistoryModal}
              onWordClick={handleWordClick}
              apiBaseUrl={import.meta.env.VITE_API_URL || 'http://localhost:8000'}
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

      {isFeedbackModalOpen && feedback && (
        <FeedbackModal feedback={feedback} onClose={closeFeedbackModal} />
      )}

      {/* --- NEW GRAMMAR MODAL (Request 2) --- */}
      {isGrammarModalOpen && (
        // We can reuse the History Modal CSS
        <div className="history-modal-overlay" onClick={closeGrammarModal}>
          <div className="history-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="history-modal-close" onClick={closeGrammarModal}>×</button>
            {grammarChallenge ? (
              <GrammarChallenge challenge={grammarChallenge} />
            ) : (
              <Loader message="Loading Grammar..." />
            )}
          </div>
        </div>
      )}
    </>
  );
}