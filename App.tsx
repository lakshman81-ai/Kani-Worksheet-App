import React, { useState, useEffect } from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext';
import { TOPICS, fetchQuestionsFromSheet, fetchTopicConfig, fetchLeaderboard, TopicConfig, LeaderboardEntry, Topic } from './services/googleSheetsService';

// Screen components
import LoginScreen from './components/screens/LoginScreen';
import LandingScreen from './components/screens/LandingScreen';
import QuestionScreen from './components/screens/QuestionScreen';
import ResultsScreen from './components/screens/ResultsScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import WorksheetGeneratorScreen from './components/screens/WorksheetGeneratorScreen';
import SpellCheckScreen from './components/SpellCheckScreen';
import PasswordModal from './components/modals/PasswordModal';

// Shared styles
import './styles/shared.module.css';

// Main App content (uses QuizContext)
function AppContent() {
  const { state, dispatch, currentMascot } = useQuiz();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [topicConfigs, setTopicConfigs] = useState<TopicConfig[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Load topic config and leaderboard on mount
  useEffect(() => {
    fetchTopicConfig().then(setTopicConfigs);
    fetchLeaderboard().then(setLeaderboard);
  }, []);

  // Handle topic selection
  const handleTopicClick = async (topic: Topic) => {
    dispatch({ type: 'SET_TOPIC', topic });

    // Special handling for Spell Check module
    if (topic.id === 'spell') {
      dispatch({ type: 'SET_SCREEN', screen: 'spellCheck' });
      return;
    }

    dispatch({ type: 'SET_LOADING', isLoading: true });

    try {
      // Find matching config from Google Sheet
      const config = topicConfigs.find(c => c.topic.toLowerCase() === topic.name.toLowerCase());

      // Create updated topic with Google Sheet URL if available
      const topicWithConfig: Topic = config && config.link !== 'TBA' ? {
        ...topic,
        sheetUrl: config.link,
        worksheetNumber: parseInt(config.worksheetNo, 10) || topic.worksheetNumber,
      } : topic;

      let fetchedQuestions = await fetchQuestionsFromSheet(topicWithConfig);

      // Shuffle questions if randomize is ON
      if (state.randomize && fetchedQuestions.length > 1) {
        fetchedQuestions = [...fetchedQuestions].sort(() => Math.random() - 0.5);
      }

      dispatch({ type: 'SET_QUESTIONS', questions: fetchedQuestions });
      dispatch({ type: 'SET_SCREEN', screen: 'question' });
    } catch (error) {
      console.error('Error loading questions:', error);
      alert('Failed to load questions. Please try again.');
    } finally {
      dispatch({ type: 'SET_LOADING', isLoading: false });
    }
  };

  // Handle retry from results screen
  const handleRetry = () => {
    if (state.selectedTopic) {
      handleTopicClick(state.selectedTopic);
    }
  };

  // Handle settings password submit
  const handleSettingsUnlock = () => {
    setShowPasswordModal(false);
    dispatch({ type: 'SET_SCREEN', screen: 'settings' });
  };

  // Render current screen
  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'login':
        return (
          <LoginScreen
            leaderboard={leaderboard}
            onShowSettings={() => setShowPasswordModal(true)}
          />
        );

      case 'landing':
        return (
          <LandingScreen
            topics={TOPICS}
            topicConfigs={topicConfigs}
            onTopicClick={handleTopicClick}
            onShowSettings={() => setShowPasswordModal(true)}
          />
        );

      case 'question':
        return <QuestionScreen />;

      case 'results':
        return <ResultsScreen onRetry={handleRetry} />;

      case 'settings':
        return (
          <SettingsScreen
            topicConfigs={topicConfigs}
            onGenerateWorksheet={() => dispatch({ type: 'SET_SCREEN', screen: 'worksheetGenerator' })}
          />
        );

      case 'worksheetGenerator':
        return <WorksheetGeneratorScreen />;

      case 'spellCheck':
        return (
          <SpellCheckScreen
            onBack={() => dispatch({ type: 'SET_SCREEN', screen: 'landing' })}
            playerName={state.playerName}
            mascotEmoji={currentMascot?.emoji || '🦄'}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: "'Nunito', 'Quicksand', sans-serif", minHeight: '100vh', overflow: 'hidden' }}>
      {/* Import Google Fonts */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Quicksand:wght@500;600;700&display=swap');`}
      </style>

      {renderScreen()}

      {showPasswordModal && (
        <PasswordModal
          onSubmit={handleSettingsUnlock}
          onCancel={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  );
}

// Main App component wrapped with QuizProvider
export default function App() {
  return (
    <QuizProvider>
      <AppContent />
    </QuizProvider>
  );
}
