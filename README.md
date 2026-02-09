# Collaboration Chat Web App

Slack-like collaboration messaging web app with invitation-only signup, local DB persistence, authenticated chat, message search, and shared-links view.

## Features

- SQLite local database via Prisma
- Responsive web UI for desktop/tablet/mobile
- Login required for all collaboration routes
- Invitation-only signup (email + invitation code must match)
- Admin-only invitation creation
- Thread-based direct messaging for logged in users
- Group thread messaging for logged in users
- Persisted messages
- Realtime message updates with SSE (Server-Sent Events)
- Search messages inside a thread
- Extract and store message links, exposed in a `Shared Links` tab per thread
- Thread-scoped audio/video calling (WebRTC, MVP for 1:1 direct threads)
- Background live call transcription via local `faster-whisper`
- Call recording with local MP4 save to `~/Documents/CollaborationApp/Calls`
- Automatic post-meeting report generation from transcript (summary + action items)

## Tech Stack

- Next.js (App Router, TypeScript)
- Prisma ORM
- SQLite (`prisma/dev.db`)
- Cookie-based sessions

## Runtime Requirements

- Node.js LTS (recommended: `22.x`)
- `.nvmrc` is included (`22`)

If you were using Node `25.x`, switch to LTS to avoid unstable dev chunk/runtime behavior with Next.js.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env
```

Set TURN credentials in `.env` for reliable call connectivity across NAT/firewalls:

```bash
WEBRTC_TURN_URLS="turn:your-turn-host:3478,turns:your-turn-host:5349?transport=tcp"
WEBRTC_TURN_USERNAME="your-turn-username"
WEBRTC_TURN_CREDENTIAL="your-turn-password"
```

3. Run DB migration + generate Prisma client:

```bash
npx prisma migrate dev --name init
```

4. Seed default admin user:

```bash
npm run prisma:seed
```

5. Start app:

```bash
npm run dev
```

### Local Transcription Backend

Default backend:

```bash
TRANSCRIPTION_PROVIDER=faster-whisper
```

Install local dependencies (macOS):

```bash
brew install ffmpeg
python3 -m pip install --upgrade faster-whisper
```

For existing databases, run a new migration after pulling call feature changes:

```bash
npx prisma migrate dev --name add_calls
```

For group owner/admin capabilities and archive support, run:

```bash
npx prisma migrate dev --name group_roles_archive
```

## Default Admin

- Email: `admin@local.dev`
- Password: `Admin123!`

Change this immediately for real deployments.

## Usage

1. Login as admin.
2. Go to `Manage Invitations` and create an invite for a specific email.
3. Share the generated `/signup?code=...&email=...` URL.
4. Invited user signs up with matching email + code.
5. Logged-in users can create direct or group chats, send/search messages, and open shared links tab.
6. In a direct thread, start/join a call from the thread header.
7. Group owner can rename/archive a group and promote members to co-admin.

## Tests

Run full test suite:

```bash
npm test
```

Run unit tests only:

```bash
npm run test:unit
```

Run integration tests only:

```bash
npm run test:integration
```

Audio fixtures used by integration/live transcription tests:

- `tests/fixtures/audio/silence-1s.wav`
- `tests/fixtures/audio/tone-440hz-1s.wav`

## Notes on Calls

- Signaling is handled by your authenticated thread SSE channel.
- Media uses browser WebRTC with STUN + TURN from `/api/webrtc/config` (auth required).
- If TURN env vars are unset, the app falls back to STUN-only mode.
- This MVP currently supports direct 1:1 thread calls.
- Call window includes `Start Recording` / `Stop Recording`.
- Recordings are saved to `~/Documents/CollaborationApp/Calls/Call-<timestamp>.mp4` (directory is auto-created).
- MP4 conversion requires `ffmpeg` on host (`brew install ffmpeg` on macOS).
- Live transcript is shown at bottom of call window during active call.
- Live transcript chunks are buffered to `~/Documents/CollaborationApp/Calls/Transcription-<timestamp>-<collaboration>.txt`.
- Live transcript includes speaker labels (participant names), segment timestamps, and confidence proxy values.
- Meeting report generation runs automatically in background from live transcript updates.
- Meeting reports are saved next to transcript files in `~/Documents/CollaborationApp/Calls` as `MeetingReport-<timestamp>-<collaboration>.md`.
- Meeting report provider defaults to local heuristic summarization; optional Ollama LLM provider is supported.

## Local Ollama (Optional for Meeting Reports)

1. Start Ollama + model bootstrap:

```bash
docker compose -f docker-compose.ollama.yml up -d
```

2. Configure `.env` to use Ollama for report generation:

```bash
MEETING_REPORT_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_REPORT_MODEL=qwen2.5:3b
```

3. Verify model:

```bash
docker exec -it collaboration-ollama ollama list
```

4. Stop services:

```bash
docker compose -f docker-compose.ollama.yml down
```

## Local TURN Server

This repo includes a local Coturn setup for development:

1. Start TURN server:

```bash
docker compose -f docker-compose.turn.yml up -d
```

2. Stop TURN server:

```bash
docker compose -f docker-compose.turn.yml down
```

3. Credentials used by default local config:

- Username: `localturn`
- Password: `localturnpass`
