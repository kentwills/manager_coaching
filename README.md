# Open AI Realtime Coaching Console

## Building Communication Skills with Foundational Frameworks

Practice navigating difficult conversations through iterative, hands-on practice with feedback.

### What is this tool?

This tool, designed for managers and leaders with direct reports, uses OpenAI's real-time voice API to simulate conversations. You act as the "manager" while the AI plays the "engineer" at different difficulty levels, providing a realistic way to practice effective communication across various scenarios.

### How to use this tool?
This tool is designed for quick, iterative conversations. Aim for a 5-minute session, then switch to evaluation mode to review your approach. Practicing in small increments will help you refine your communication skills in a focused manner. Also read up on [the SBI model](https://www.ccl.org/articles/leading-effectively-articles/closing-the-gap-between-intent-vs-impact-sbii/) and [Radical Candor](https://www.radicalcandor.com/) as those are the two feedback evaluation mechanisms.
- [Test it out here.](https://kentwills.github.io/manager_coaching)

### Why Use This Tool?

- **Engage in Realistic Scenarios**: The scenario is adaptive and created from real-life scenarios allowing you to practice the same scenario with the same difficulty multiple times with varied communication.
- **Receive Immediate Feedback**: Leveraging the evaluation mode gets you feedback in the moment so that you can focus on practicing that specific skill.
- **Utilize Proven Frameworks**: The tool leverages established coaching methods, the SBI model and radical Candor, allowing users to practice principles-based approaches in a way that builds muscle memory.

### Who Can Benefit?

Anyone with direct reports or leaders who need to hold a high level of accountability through effective communication.

### Why AI?

Practicing with AI offers a flexible and accessible alternative to in-person role-playing sessions. This tool allows leaders to refine their skills efficiently and at a lower cost.

## Getting Started with the Tech for a Local Installation

### Starting the Console

This is a React project initiated with `create-react-app` and bundled using Webpack. To install, extract the package contents and use:

```shell
$ npm i
```

Start your server with:

```shell
$ npm start
```

Access it at `localhost:3000`.

### Using the Console

The console requires an OpenAI API key (**user key** or **project key**) with Realtime API access. You'll be prompted to enter it at startup. It is saved via `localStorage` and can be updated through the UI. I've found that, since the api is still in beta, that you may have varying success with the response from the server. I hope this improves as the api becomes more mature. Also, watch your costs on the openAI billing page.

To begin a session, you'll need to **connect**, which requires microphone access. If you don't have a microphone, the page will just error on you.

### Understanding the Prompts

The scenario consists of several prompts:

- **Scenario**: Read the background description before the session; this is not sent to OpenAI.
- **Scenario IC Prompt**: This is not shown in the UI, but is in the file below. It prompts openAI on the scenario from the ICs perspective.
- **Difficulty Mode**: Select from easy, medium, or hard modes to determine how the feedback recipient will react.
- **Difficulty Prompt**: Adjust the difficulty level via a dropdown or manually modify the prompt in the UI.
- **Evaluation Prompt**: The default setting uses the SBI and Radical Candor frameworks. Conclude a scenario by saying "End scenario. How did I do?" or "End Scenario. Evaluation mode" to receive feedback.

Modify default prompts in the ```utils/conversation_config.js``` file or directly in the UI before starting the session. System prompts can only be changed between sessions.
