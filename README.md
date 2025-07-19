# RacerType - Real-Time Multiplayer Typing Race

RacerType is a real-time multiplayer typing race game built with Node.js, Express, TypeScript, and Socket.IO. Players join or create rooms, compete to type a given text as fast as possible, and see live progress of all participants. The app demonstrates HTTP, REST, and WebSocket communication patterns.

## 🚦 How it works

- Users sign in with a unique username.
- Players can create new rooms or join existing ones (up to 3 users per room).
- When all users in a room are ready, a random text is shown and the race begins.
- Progress is tracked and displayed live for all users.
- Results are shown at the end, ranking users by typing speed and accuracy.

## 🏃‍♂️ Simple start

1. **`npm install`** at the root
2. **`npm run esbuild`** at the root
3. **`npm run dev`** at the root
4. Open **`http://localhost:3001/`**
5. Deploy link: **`https://typing-race-bj19.onrender.com`**

May take a while for the server to respond due to free tier.

If needed, change the server variable in the TypeScript service file.

## 🧹 Code style

Run **`npm run format:check`** at the root to check code style.

Run **`npm run format:fix`** at the root to fix code style.

