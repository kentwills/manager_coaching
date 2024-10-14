// src/components/SystemPromptForm.tsx

import React, { useEffect, useState } from 'react';
import { evaluationPrompt, scenarioPrompts, difficultyPrompts } from '../utils/conversation_config.js';
import { Button } from '../components/button/Button';
import { X, Zap, Plus } from 'react-feather';
import './SystemPromptForm.scss';

interface SystemPromptFormProps {
  isConnected: boolean;
  connectConversation: (systemPrompt: string) => void;
  disconnectConversation: () => void;
}

type Difficulty = 'Easy' | 'Medium' | 'Hard';
type Scenario = keyof typeof scenarioPrompts;

const difficultyModes: Difficulty[] = ['Easy', 'Medium', 'Hard'];
const scenarioModes: Scenario[] = Object.keys(scenarioPrompts) as Scenario[];

const SystemPromptForm: React.FC<SystemPromptFormProps> = ({
  isConnected,
  connectConversation,
  disconnectConversation,
}) => {
  const [difficulty, setDifficulty] = useState<Difficulty>(difficultyModes[0]);
  const [evaluation, setEvaluation] = useState<string>(`${evaluationPrompt}`);
  const [scenario, setScenario] = useState<Scenario>(scenarioModes[0]);
  const [scenarioManagerPrompt, setScenarioManagerPrompt] = useState<string>(
    scenarioPrompts[scenario].managerPrompt
  );
  const [scenarioIcPrompt, setScenarioIcPrompt] = useState<string>(
    scenarioPrompts[scenario].icPrompt
  );
  const [difficultyPrompt, setDifficultyPrompt] = useState<string>(
    difficultyPrompts[difficulty]
  );

  // State variable for advanced mode
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setScenarioManagerPrompt(scenarioPrompts[scenario].managerPrompt);
    setScenarioIcPrompt(scenarioPrompts[scenario].icPrompt);
    setDifficultyPrompt(difficultyPrompts[difficulty]);
  }, [scenario, difficulty]);

  const handleConnectClick = () => {
    if (isConnected) {
      disconnectConversation();
    } else {
      const systemPrompt =
        scenarioIcPrompt + '\n\n' + difficultyPrompt + '\n\n' + evaluation;
      connectConversation(systemPrompt);
    }
  };

  return (
    <div className="system-prompt-form">
      <Button
        className="connect-button"
        iconPosition={isConnected ? 'end' : 'start'}
        icon={isConnected ? X : Zap}
        buttonStyle={isConnected ? 'regular' : 'action'}
        onClick={handleConnectClick}
      >
        {isConnected ? 'Disconnect' : 'Connect'}
      </Button>


      <div className="form-group">
        <div>{scenarioManagerPrompt}</div>
      </div>

      {/* Scenario Dropdown */}
      <div className="form-group">
        <label>
          Scenario Selection:
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
      {/* Difficulty Dropdown */}
      <div className="form-group">
        <label>
          Difficulty Selection:
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

      {/* Advanced Mode Toggle Button */}
      <Button
        className="advanced-button form-group prompt"
        iconPosition={showAdvanced ? 'end' : 'start'}
        icon={showAdvanced ? X : Plus}
        buttonStyle={showAdvanced ? 'regular' : 'action'}
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
      </Button>

      {/* Advanced Prompts */}
      {showAdvanced && (
        <>

          <div className="form-group prompt">
            <label>
              Scenario IC Prompt:
              <textarea
                value={scenarioIcPrompt}
                onChange={(e) => setScenarioIcPrompt(e.target.value)}
                rows={5}
                className="textarea"
              />
            </label>
          </div>
        </>
      )}


      {/* Advanced Prompts */}
      {showAdvanced && (
        <>
          <div className="form-group prompt">
            <label>
              Difficulty OpenAI Prompt:
              <textarea
                value={difficultyPrompt}
                onChange={(e) => setDifficultyPrompt(e.target.value)}
                rows={15}
                className="textarea"
              />
            </label>
          </div>

          <div className="form-group prompt">
            <label>
              Evaluation OpenAI Prompt:
              <textarea
                value={evaluation}
                onChange={(e) => setEvaluation(e.target.value)}
                rows={40}
                className="textarea"
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default SystemPromptForm;
