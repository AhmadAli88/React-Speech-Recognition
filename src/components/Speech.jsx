/* eslint-disable no-unused-vars */
import 'regenerator-runtime';
import { useState, useEffect } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

const VoiceRecognitionDemo = () => {
  const [savedTranscripts, setSavedTranscripts] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-US');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    finalTranscript,
    interimTranscript,
  } = useSpeechRecognition({
    commands: [
      {
        command: 'clear',
        callback: () => resetTranscript(),
      },
      {
        command: 'reset',
        callback: () => resetTranscript(),
      },
      {
        command: 'save',
        callback: () => handleSaveTranscript(),
      },
      {
        command: 'stop listening',
        callback: () => handleStopListening(),
      },
    ],
  });

  useEffect(() => {
    if (finalTranscript !== '') {
      console.log('Got final result:', finalTranscript);
    }
  }, [finalTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return <div>Your browser does not support speech recognition.</div>;
  }

  if (!isMicrophoneAvailable) {
    return <div>Please allow microphone access to use this feature.</div>;
  }

  const handleStartListening = () => {
    setIsListening(true);
    SpeechRecognition.startListening({
      continuous: true,
      language: language,
    });
  };

  const handleStopListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
  };

  const handleSaveTranscript = () => {
    if (transcript) {
      setSavedTranscripts([...savedTranscripts, transcript]);
      resetTranscript();
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    if (listening) {
      handleStopListening();
    }
  };

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Voice Recognition Demo</h1>

      {/* Language Selection */}
      <div className='mb-4'>
        <select
          value={language}
          onChange={handleLanguageChange}
          className='border p-2 rounded'
        >
          <option value='en-US'>English (US)</option>
          <option value='es-ES'>Spanish</option>
          <option value='fr-FR'>French</option>
          <option value='de-DE'>German</option>
        </select>
      </div>

      {/* Controls */}
      <div className='space-x-2 mb-4'>
        <button
          onClick={handleStartListening}
          disabled={listening}
          className='bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50'
        >
          Start Listening
        </button>
        <button
          onClick={handleStopListening}
          disabled={!listening}
          className='bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50'
        >
          Stop Listening
        </button>
        <button
          onClick={resetTranscript}
          className='bg-gray-500 text-white px-4 py-2 rounded'
        >
          Reset
        </button>
        <button
          onClick={handleSaveTranscript}
          disabled={!transcript}
          className='bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50'
        >
          Save Transcript
        </button>
      </div>

      {/* Status and Transcripts */}
      <div className='mb-4'>
        <p>Microphone: {listening ? 'on' : 'off'}</p>
        <div className='mt-2'>
          <h2 className='font-bold'>Current Transcript:</h2>
          <p className='bg-gray-100 p-2 rounded'>{transcript}</p>
        </div>
        {interimTranscript && (
          <div className='mt-2'>
            <h2 className='font-bold'>Interim Transcript:</h2>
            <p className='bg-gray-100 p-2 rounded italic'>
              {interimTranscript}
            </p>
          </div>
        )}
      </div>

      {/* Saved Transcripts */}
      {savedTranscripts.length > 0 && (
        <div>
          <h2 className='font-bold mb-2'>Saved Transcripts:</h2>
          <ul className='space-y-2'>
            {savedTranscripts.map((text, index) => (
              <li key={index} className='bg-gray-100 p-2 rounded'>
                {text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VoiceRecognitionDemo;
