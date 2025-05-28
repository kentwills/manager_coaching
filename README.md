# Realtime Feedback Tool

*If you are using this app on your phone use headphones in a quiet area as the voice turn detection is quite sensitive.*

## Practice Leadership Conversations with AI

### Overview

The OpenAI Realtime Coaching Console is a tool designed to help new managers and leaders practice navigating difficult conversations. By simulating interactions with an AI agent, users gain hands-on experience and real-time feedback in a risk-free environment. Check out the hosted application [here](https://kentwills.github.io/manager_coaching/).

### Why Use This Tool?

- **Realistic Scenarios**: Engage in simulations modeled on real-world challenges to build and refine your communication skills.
- **Immediate Feedback**: Receive constructive feedback after each session to recognize areas for improvement.
- **Proven Frameworks**: Practice using established coaching methods like SBI (Situation-Behavior-Impact) and Radical Candor to develop effective communication habits.

### Who Can Benefit?

- New managers and leaders
- Individuals aiming to strengthen their communication skills in challenging situations

### Why AI?

Practicing with AI offers a flexible and accessible alternative to in-person role-playing sessions, allowing leaders to refine their skills efficiently and cost-effectively.

## Getting Started

### Installation

This is a React project initiated with `create-react-app` and bundled using Webpack and is built on top of the [openai-realtime-console](https://github.com/openai/openai-realtime-console).
The application now defaults to OpenAI's `gpt-4o` realtime model and uses the `tts-1-hd` speech model for the highest quality audio responses.

1. **Install Dependencies**:

   ```shell
   npm install
   ```

2. **Start the Development Server**:

   ```shell
   npm start
   ```

3. **Access the App**:

   Open your browser and navigate to `http://localhost:3000`.

### Usage

- **API Key**: You'll need an OpenAI API key (**user key** or **project key**) with Realtime API access. You'll be prompted to enter it at startup. It's saved via `localStorage` and can be updated through the UI.

- **Prompts**:
  - **Scenario**: Read the background description before the session (not sent to OpenAI).
  - **Difficulty Mode**: Choose from easy, medium, or hard to determine the AI agent's responsiveness.
  - **Evaluation Prompt**: Conclude a scenario by saying "End scenario. How did I do?" to receive feedback based on SBI and Radical Candor frameworks.

- **Customization**: Modify default prompts in `utils/conversation_config.js` or directly in the UI before starting a session. Note that system prompts can only be changed between sessions.

## Final Notes

This tool is an additional resource to complement professional coaching and training programs and not intended as a replacement.

### Best Practices

- **Optimal Experience**: Use headphones in a quiet room if using your phone to prevent the AI from interrupting itself.
- **Monitor Usage**: Keep an eye on your OpenAI API usage and costs.

### Privacy and Tracking

The app includes tracking to monitor community usage. If you prefer to remove tracking:

- Run the app locally.
- Remove the call to Amplitude in the code.