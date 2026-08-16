# Frame It as Cases

## Voice Card
Building real AI products that actually work.

---

## Case 1 — AI Resume Analyzer

### The Problem
Job seekers often submit resumes into automated Applicant Tracking Systems (ATS) without knowing how well their experience matches the target job description. Existing resume checkers were either hidden behind expensive paywalls or gave generic advice like "add more keywords" without explaining why or how to fix specific bullet points. I wanted to build a simple, accessible tool that parses a resume against a job description, highlights real skill gaps, and offers concrete structural feedback.

### What I Did
I built a web application using React and TypeScript for the frontend, backed by Node.js and OpenAI API for parsing and feedback generation. Instead of asking the model to rewrite the whole resume at once—which often generated hallucinated experience—I broke down the pipeline into distinct stages:
1. Extracting raw text from uploaded PDF/Word documents.
2. Structuring experience into canonical JSON (skills, titles, bullet points).
3. Comparing structured candidate skills against required job keywords using semantic matching.
4. Generating targeted feedback strictly tied to missing requirements.

I also added client-side validation to ensure invalid files or incomplete job descriptions were caught before sending payloads to the API, keeping latency and API token usage predictable.

### What Came Of It
The analyzer gave users a clear breakdown of missing skills, ATS readability risks, and specific bullet-point improvement suggestions. It ran reliably without breaking on messy PDF formatting or unexpected section headers. While I didn't turn it into a commercial product or track long-term hiring rates, it provided immediate, practical feedback for classmates and friends refining their resumes for tech roles.

### What I'd Do Differently
I would implement local file parsing directly in the browser to reduce server processing overhead and lower API latency for document extraction.

---

## Case 2 — Dark Pattern Sentinel

### The Problem
E-commerce websites frequently use subtle UI tricks—like countdown timers that reset on refresh, hidden opt-out checkboxes, pre-checked add-ons, or fake scarcity badges—to pressure users into making unintended purchases. Most consumers don't recognize these deceptive patterns while browsing. I wanted to create a lightweight browser extension that automatically scans active webpage DOM elements in real time and alerts users to manipulative UI patterns before they check out.

### What I Did
I developed a Chrome extension using TypeScript and Vanilla CSS with a lightweight background content script. Rather than making heavy remote API calls for every page load, I built a client-side heuristic engine that inspects DOM tree nodes for common dark pattern signals:
- Sticky banner elements with fake dynamic countdowns (`Date.now()` loops).
- Hidden checkbox inputs hidden behind visual CSS overlays.
- Pre-selected recurring subscription radio buttons.

When suspicious DOM elements are detected, the extension highlights the element with a clear visual warning badge and explains the specific tactic being used. I kept the bundle size under 150KB to ensure no measurable impact on page render times or scroll performance.

### What Came Of It
The extension reliably flagged deceptive timers and pre-checked opt-in boxes across major retail sites without degrading tab performance or triggering false positives on standard ecommerce UI components like stock counts. It served as a functional proof-of-concept for user-centric browser security and ethical web design advocacy.

### What I'd Do Differently
I would add a user-reporting feature to allow community members to submit new deceptive UI snippets to a shared open-source pattern registry.

---

## Case 3 — StadiumMind AI

### The Problem
Technical interview platforms are often dry, rigid, and stress-inducing for candidates. Traditional automated interview tools rely on text boxes or static video prompts that feel distant and unnatural, failing to simulate the interactive nature of a real engineering conversation. The goal was to build a full-stack technical interview application that presents an engaging, voice-driven AI interviewer with real-time visual feedback and context-aware questioning.

### What I Did
I designed and implemented the frontend visual and interactive interview system using React, TypeScript, Fastify, and HTML5 Canvas:
- Built a voice-reactive 3D/2D visual orb centerpiece rendered on an HTML5 Canvas that animates dynamically based on incoming audio frequencies.
- Integrated Web Speech / Web Audio APIs for real-time speech synthesis and audio frequency processing, ensuring interview questions were spoken clearly while remaining visually displayed on screen.
- Maintained candidate state across interview turns using structured JSON schemas, keeping track of question history and technical topic progression.
- Ensured keyboard accessibility and responsive layout design so candidates on mobile or desktop could comfortably complete interviews.

### What Came Of It
The platform turned standard code-and-answer prompts into an interactive, voice-reactive interview session. Candidate response state persisted cleanly across questions, and the responsive HTML5 canvas centerpiece provided a distinct, premium visual identity without drop-offs in frame rate. The implementation satisfied all FlyRank AI Capstone requirements for production-ready architecture, strict validation, and automated testing.

### What I'd Do Differently
I would implement low-latency WebRTC audio streaming to replace HTTP chunking, making voice interactions feel even more conversational.

---

## Bio

### Option 1 (Recommended)
I am a full-stack developer who builds web applications, browser tools, and AI-driven user interfaces. I focus on writing clean TypeScript, designing responsive frontends, and creating practical software that solves real problems.

### Option 2
I build full-stack web products with React, Node.js, and TypeScript, combining modern frontend UI with AI integrations. My work focuses on building reliable user experiences, clean code architecture, and accessible web software.

### Option 3
I am a frontend and AI engineer focused on practical web applications, state management, and real-time user interfaces. I enjoy turning complex specifications into clear, performant software built with TypeScript and modern web standards.

---

## Contact

### Option 1 (Recommended)
Have a project in mind or want to build something together? Let's talk.

### Option 2
Interested in collaborating or reviewing my work? Get in touch.

### Option 3
Want to build a modern web or AI app together? Reach out directly.

---

## Before / After

### Generic AI Version
> "I leveraged cutting-edge AI technologies and modern full-stack frameworks to architect an innovative, highly intuitive user interface that seamlessly empowers candidates during technical interviews."

### My Edited Version
> "I built a voice-reactive HTML5 Canvas centerpiece and Fastify backend in TypeScript that speaks interview questions aloud, tracks candidate state across turns, and keeps frame rates smooth on desktop and mobile."
