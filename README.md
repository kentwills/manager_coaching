# Open AI Realtime Coaching Console

## Building Communication Skills with Foundational Frameworks

This tool serves as a platform for new managers and leaders to practice navigating difficult conversations by engaging in iterative, hands-on practice with feedback.

### What is the Coaching Tool?

In my experience, most of the coaching I do is more focused on the people challenges rather than the technical ones. I think this is more common as early in careers there is more emphasis on technical ability and those with technical ability are launched into leadership roles without much preparation. Managers often use real scenarios to gain experience in how to communicate in tricky situations and hopefully they don't make career ending mistakes. I spend a lot of time working on a principle based approach to navigating these tough situations and recommend books to spin up, but this is only the start. It usually takes time for someone to actually be able to use some of these tactics effortlessly in communication. In some of my coaching where I have been invited to support coaching managers in other companies we are able to go through many rounds of practice getting these principles right. This tool offers a way for managers to quickly encounter and learn from varied scenarios by simulating them using AI.

Through simulated interactions, users practice giving feedback and getting feedback real-time with an AI agent. You can even modify the prompts to suit your needs more specifically.

### Why Use This Tool?

- **Engage in Realistic Scenarios**: Interact with an AI agent in scenarios modeled on real-world challenges, allowing users to build and refine their skills.
- **Receive Immediate Feedback**: Constructive feedback is provided after each session to help users recognize and address areas for improvement.
- **Utilize Proven Frameworks**: The tool leverages established coaching methods, allowing users to practice principles-based approaches in a way that builds muscle memory.

### Who Can Benefit?

New managers, leaders, and anyone aiming to strengthen their communication skills in tough situations will find this tool valuable.

### Why AI?

Practicing with AI offers a flexible and accessible alternative to in-person role-playing sessions. This tool allows new leaders to refine their skills efficiently and at a lower cost.

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