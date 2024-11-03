// src/components/SystemPromptForm.tsx

import React, { useEffect, useState } from 'react';
import { evaluationPrompt, scenarioPrompts, difficultyPrompts } from '../utils/conversation_config.js';
import { Button } from '../components/button/Button';
import { X, Zap } from 'react-feather';

interface SystemPromptFormProps {
  isConnected: boolean;
  connectConversation: (systemPrompt: string) => void;
  disconnectConversation: () => void;
}

type Difficulty = 'Easy' | 'Medium' | 'Hard';
type Scenario = keyof typeof scenarioPrompts;

// Define difficulty modes
const difficultyModes: Difficulty[] = ['Easy', 'Medium', 'Hard'];
const scenarioModes: Scenario[] = Object.keys(scenarioPrompts) as Scenario[];

const SystemPromptForm: React.FC<SystemPromptFormProps> = ({
  isConnected,
  connectConversation,
  disconnectConversation,
}) => {
  // New state variables
  const [difficulty, setDifficulty] = useState<Difficulty>(difficultyModes[0]);
  const [evaluation, setEvaluation] = useState<string>(`${evaluationPrompt}`);
  const [scenario, setScenario] = useState<Scenario>(scenarioModes[0]);

  // State variables for the system prompt
  const [scenarioManagerPrompt, setScenarioManagerPrompt] = useState<string>(scenarioPrompts[scenario].managerPrompt);
  const [scenarioIcPrompt, setScenarioIcPrompt] = useState<string>(scenarioPrompts[scenario].icPrompt);
  const [difficultyPrompt, setDifficultyPrompt] = useState<string>(difficultyPrompts[difficulty]);

  useEffect(() => {
    setScenarioManagerPrompt(scenarioPrompts[scenario].managerPrompt);
    setScenarioIcPrompt(scenarioPrompts[scenario].icPrompt);
    setDifficultyPrompt(difficultyPrompts[difficulty]);
  }, [scenario, difficulty]);

  // Function to handle the connect/disconnect button click
  const handleConnectClick = () => {
    if (isConnected) {
      disconnectConversation();
    } else {
      const systemPrompt = scenarioIcPrompt + '\n\n' + difficultyPrompt + '\n\n' + evaluation;

      // Call connectConversation with systemPrompt
      connectConversation(systemPrompt);
    }
  };

  return (
    <div>
      <Button
        iconPosition={isConnected ? 'end' : 'start'}
        icon={isConnected ? X : Zap}
        buttonStyle={isConnected ? 'regular' : 'action'}
        onClick={handleConnectClick}
      >
        {isConnected ? 'Disconnect' : 'Connect'}
      </Button>

      {/* Scenario Dropdown */}
      <div className="form-group">
        <label>
          Scenario:
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value as Scenario)}
          >
            {scenarioModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Display Scenario Prompt */}
      <div className="form-group">
        <label>
          Scenario (Not sent to OpenAI):
          <textarea
            value={scenarioManagerPrompt}
            readOnly
            rows={8}
            style={{ width: '99%' }}
          />
        </label>
      </div>

      {/* Difficulty Dropdown */}
      <div className="form-group">
        <label>
          Difficulty:
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          >
            {difficultyModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Display Difficulty Prompt */}
      <label>
        Difficulty OpenAI Prompt:
        <textarea
          value={difficultyPrompt}
          rows={23}
          style={{ width: '99%' }}
        />
      </label>

      {/* Evaluation Text Input */}
      <label>
        Evaluation OpenAI Prompt:
        <textarea
          value={evaluation}
          onChange={(e) => setEvaluation(e.target.value)}
          rows={40}
          style={{ width: '99%' }}
        />
      </label>
    </div>
  );
};

export default SystemPromptForm;
