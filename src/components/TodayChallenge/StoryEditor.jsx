import React from 'react';
import UsageTracker from './UsageTracker';

const StoryEditor = ({
    story,
    onStoryChange,
    onSubmit,
    wordData,
    dailyIdioms,
    usedWords,
    storyText,
    isSubmitting,
    isUnlocked,
    feedback, // <-- New prop
    onOpenFeedback // <-- New prop
}) => {

    return (
        <div className={`notebook-section ${!isUnlocked ? 'is-disabled' : ''}`}>
            <h3>✍️ Your Story Journal</h3>
            <UsageTracker
                wordData={wordData}
                dailyIdioms={dailyIdioms}
                usedWords={usedWords} // You can remove this if UsageTracker calculates its own
                storyText={storyText} // Pass this down
            />
            <div className="notebook-lines">
                <textarea
                    value={story}
                    onChange={onStoryChange}
                    placeholder={isUnlocked ? "Start writing your story using today's words..." : "Please read all of today's words to unlock the journal."}
                    disabled={isSubmitting || !isUnlocked}
                ></textarea>
            </div>
            <div className="notebook-footer">
                {/* --- NEW FEEDBACK BUTTON --- */}
                {feedback && (
                    <button className="feedback-modal-btn" onClick={onOpenFeedback}>
                        View AI Feedback
                    </button>
                )}

                <button
                    className="btn-save"
                    onClick={onSubmit}
                    disabled={isSubmitting || !isUnlocked}
                >
                    {isSubmitting ? 'Getting Feedback...' : 'Save & Get Feedback'}
                </button>
            </div>
        </div>
    );
};

export default StoryEditor;