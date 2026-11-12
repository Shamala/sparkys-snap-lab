# Sparky's Snap Lab

A friendly, follow-along app for kids aged 5 and up. Sparky the dog walks a child through 25 small snap-together electronics projects, one step at a time, like a short movie. It works on phones, tablets and desktops, and keeps working offline once it has loaded.

> Not affiliated with or endorsed by Elenco Electronics, Inc. Snap Circuits is a registered trademark of Elenco Electronics, Inc. Grown-up supervision required. Use at your own risk.

## What it does

- Shows 25 projects, from "Light On!" to "Secret Messages", on a simple home screen. Each has a tag (Starter, Explorer, Builder, Inventor) based on how many pieces it uses.
- Lists the pieces a project needs before it starts, with how many of each.
- Builds the circuit on a picture board, one piece at a time, while Sparky says what to do.
- Teaches each piece (what it is, why it is used, how it works) when the child taps it on the "Things you need" screen.
- Ends every project with a "Go!" step so the child can try the real circuit.
- Remembers which projects the child has finished on that device.

## How a child uses it

1. **Pick a project.** Tap a picture card on the home screen. Finished projects are marked.
2. **Check "Things you need".** A grown-up or the child gathers the listed pieces. If a battery holder is listed, it needs 2 AA batteries.
3. **Tap "Let's build!"** The board shows the first piece and Sparky explains it in a speech bubble.
4. **Follow along.** Use the three buttons at the bottom:
   - **Play** lets Sparky talk and move to the next step on their own. **Pause** stops the voice.
   - **Next** and **Back** move one step at a time, quietly.
   - On the last step, the button says **More!** and takes the child back to the projects.
5. **Tap a piece to learn about it.** On "Things you need", tap any piece and Sparky tells what it is, why it is used and how. Tap Sparky himself for a bark and a trick.
6. **Mute if you like.** The speaker button at the top turns the voice off. Sparky hides while muted, and the text stays on screen.
7. **Browse "Parts".** The home screen has a list of every piece with its explanation.

Sparky only talks while Play is on, and his mouth moves with the voice.

## For grown-ups

- Pieces are shown on screen only. The app does not connect to anything.
- A grown-up should supervise the real build and handle the batteries.
- Voice clips are recorded ahead of time, so no microphone, account or internet is needed to listen.

## Run it

```bash
npm install
npm run dev        # opens at the address Vite prints
npm test           # checks the project and parts data
npm run build      # production build in dist/
npm run bundle     # build plus the content, voice and Sparky folders
```

Install it like an app: open it in Chrome or Safari and choose "Add to Home Screen" or "Install".

## How it is put together

The app is split into four parts that can be deployed on their own:

| Part | Folder | What it holds |
| --- | --- | --- |
| App shell | `src/` | Screens, board drawing, voice playback |
| Content | `services/content/` | `projects.json` and `parts.json` |
| Voice | `services/voice/` | Spoken clips and mouth timing |
| Sparky | `services/sparky/` | The dog drawing |

Built with React, Vite and Tailwind, using the ShaMallya design-system components. Voices are made once with Kokoro-82M (`npm run voice`), so the app ships short audio clips instead of a speech model.

To add or change a project, see [BUILDING.md](BUILDING.md).
