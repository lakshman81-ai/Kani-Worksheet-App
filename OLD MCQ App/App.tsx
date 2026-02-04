
import React, { useState } from 'react';
import type { StoryResult } from './types';
import { generateStoryAndImage } from './services/geminiService';
import Spinner from './components/Spinner';

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [storyResult, setStoryResult] = useState<StoryResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const promptSuggestions = [
    "a friendly bear who finds a magic hat",
    "a little robot who wants to be a baker",
    "a curious bunny exploring a sparkling cave",
    "a mermaid who makes friends with a starfish"
  ];

  const handlePromptSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please tell me what the story should be about!');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStoryResult(null);

    try {
      const result = await generateStoryAndImage(prompt);
      setStoryResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-purple-600 drop-shadow-lg">
            <StarIcon /> Magic Story Maker <StarIcon />
          </h1>
          <p className="text-lg text-pink-500 mt-2">Let's create a wonderful story together!</p>
        </header>

        <main>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
            <form onSubmit={handleSubmit}>
              <label htmlFor="prompt" className="block text-xl font-semibold text-gray-700 mb-2">
                What is our story about?
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., a shy dragon who learns to dance"
                className="w-full p-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition duration-200"
                rows={3}
                disabled={isLoading}
              />
              <div className="mt-3 text-sm text-gray-500">
                Or try a suggestion:
                <div className="flex flex-wrap gap-2 mt-2">
                  {promptSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handlePromptSuggestionClick(suggestion)}
                      className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs sm:text-sm hover:bg-yellow-300 transition"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-pink-500 text-white font-bold py-3 px-6 rounded-xl text-xl hover:bg-pink-600 disabled:bg-pink-300 disabled:cursor-not-allowed transform hover:scale-105 transition-transform duration-200"
              >
                {isLoading ? 'Creating Magic...' : 'Make a Story!'}
              </button>
            </form>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 min-h-[300px] flex items-center justify-center">
            {isLoading && <Spinner />}
            {error && <div className="text-center text-red-500 font-semibold"><p>Oh no! {error}</p></div>}
            {!isLoading && !error && storyResult && (
              <div className="grid md:grid-cols-2 gap-6 items-center animate-fade-in">
                <div className="w-full">
                  <img 
                    src={storyResult.imageUrl} 
                    alt="Story illustration" 
                    className="rounded-xl shadow-lg w-full h-auto object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-purple-700 mb-3">Your Magical Story!</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{storyResult.story}</p>
                </div>
              </div>
            )}
            {!isLoading && !error && !storyResult && (
              <div className="text-center text-gray-500">
                <p className="text-2xl mb-2">✨</p>
                <p className="text-xl">Your story will appear here once it's created.</p>
              </div>
            )}
          </div>
        </main>

        <footer className="text-center mt-8 text-sm text-purple-400">
          <p>Powered by Gemini & a sprinkle of imagination.</p>
        </footer>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
