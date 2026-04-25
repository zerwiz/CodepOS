# Task List - Aegis UI Components

## Task 1: Create Aegis Activity Log Component (Left Column)

**Description**: Full-width scrolling activity log aggregating events from multiple sources.

**File**: `ui-agents/apps/infinite-ui/src/components/aegis-activity-log.tsx`

**Requirements**:
- Auto-scrolling with pause-on-hover
- Source filter bar at top
- Color-coded badges (deploys=blue, staging=yellow, production=green, error=red)
- Timestamp, severity level, and message
- Mock/hardcoded data that feels alive

## Task 2: Create Aegis Agent Chat Component (Right Column)

**Description**: Real-time agent chat feed with interconnected agents.

**File**: `ui-agents/apps/infinite-ui/src/components/aegis-agent-chat.tsx`

**Requirements**:
- Distinct agent avatars and role colors
- Threaded message stream
- Agent presence bar at top (online/busy/idle)
- Alert cards with red accent
- @mentions and tagging
- Mock/hardcoded conversations

## Task 3: Create Aegis Stream Layout (Split-Column)

**File**: `ui-agents/apps/infinite-ui/src/components/aegis-stream-layout.tsx`

**Requirements**:
- Left: Activity log (Task 1)
- Right: Agent chat (Task 2)
- Sticky header with stream title and timestamp
- Responsive design
- Three distinct visual variants
