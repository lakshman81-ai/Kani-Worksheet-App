import React, { useState, useEffect } from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { TOPICS, fetchQuestionsFromSheet, fetchTopicConfig, fetchLeaderboard, fetchWorksheets, TopicConfig, LeaderboardEntry, WorksheetConfig } from './services/googleSheetsService';
import type { Topic } from './types';

// Screen components
import LoginScreen from './components/screens/LoginScreen';
import LandingScreen from './components/screens/LandingScreen';
import QuestionScreen from './components/screens/QuestionScreen';
import ResultsScreen from './components/screens/ResultsScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import WorksheetGeneratorScreen from './components/screens/WorksheetGeneratorScreen';
import SpellCheckScreen from './components/SpellCheckScreen';
import PasswordModal from './components/modals/PasswordModal';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorLogModal from './components/modals/ErrorLogModal';
import { logger } from './services/loggingService';

// Shared styles
import './styles/shared.module.css';

// Main App content (uses QuizContext)
function AppContent() {
  const { state, dispatch, currentMascot } = useQuiz();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showErrorLogs, setShowErrorLogs] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [topicConfigs, setTopicConfigs] = useState<TopicConfig[]>([]);
  const [worksheetConfigs, setWorksheetConfigs] = useState<WorksheetConfig[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Subscribe to logger to show bug icon
  useEffect(() => {
    const checkErrors = () => {
      const logs = logger.getLogs();
      setHasErrors(logs.some(l => l.level === 'ERROR'));
    };
    checkErrors();
    const unsubscribe = logger.subscribe((log) => {
      if (log.level === 'ERROR') setHasErrors(true);
    });
    return unsubscribe;
  }, []);

  // Load topic config and leaderboard on mount
  useEffect(() => {
    fetchTopicConfig().then(setTopicConfigs);
    fetchLeaderboard().then(setLeaderboard);
    fetchWorksheets().then(setWorksheetConfigs);
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

      // Determine local base path if a worksheet is selected
      // Determine local base path if a worksheet is selected for this topic
      let localBasePath = undefined;
      let worksheetName = 'Remote';

      // Default to the topic's worksheet number if no specific setting is found
      let topicWorksheetId = state.worksheetSettings[topic.id];
      if (!topicWorksheetId && topic.worksheetNumber) {
        topicWorksheetId = `ws${topic.worksheetNumber}`;
      }

      if (topicWorksheetId) {
        const wsConfig = worksheetConfigs.find(w => w.id === topicWorksheetId);
        if (wsConfig) {
          localBasePath = wsConfig.path; // e.g., "Worksheet 1"
          worksheetName = wsConfig.name;
        }
      }

      dispatch({ type: 'SET_CURRENT_WORKSHEET_NAME', name: worksheetName });

      let fetchedQuestions = await fetchQuestionsFromSheet(topicWithConfig, localBasePath);

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
            worksheetConfigs={worksheetConfigs}
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

      {showErrorLogs && <ErrorLogModal onClose={() => setShowErrorLogs(false)} />}
      {hasErrors && !showErrorLogs && (
        <button
          onClick={() => setShowErrorLogs(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: '#ff5252',
            border: 'none',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            zIndex: 1000,
            fontSize: '24px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            animation: 'bounce 2s infinite'
          }}
          title="View Error Logs"
        >
          🐞
        </button>
      )}
    </div>
  );
}

// Main App component wrapped with providers
export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ErrorBoundary>
          <QuizProvider>
            <AppContent />
          </QuizProvider>
        </ErrorBoundary>
      </ToastProvider>
    </ThemeProvider>
  );
}
