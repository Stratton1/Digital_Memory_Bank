# Phase 2 Completion Plan: Sharing, Search, and Connections

This plan addresses the remaining features required to complete the "Sharing & Polish" phase defined in CLAUDE.md.

## 1. Search & Discovery (`/dashboard/search`)
**Goal:** Allow users to find memories by text content or tags.
- [ ] **Server Action**: `searchMemories(query: string)`
  - Search `title` and `content` using `ilike` (fuzzy match).
  - Search associated tags.
- [ ] **UI**: Search Input with debounce.
- [ ] **UI**: Filter by "My Memories" vs "Shared with Me".
- [ ] **Page**: Update `src/app/dashboard/search/page.tsx` to display results using the existing Memory Card component.

## 2. Family Connections (`/dashboard/family`)
**Goal:** Build the social graph allowing users to connect with family members.
- [ ] **Database Helpers**: 
  - `getFamilyConnections()`: List active and pending connections.
  - `sendConnectionRequest(email)`: Look up user by email and create request.
  - `updateConnectionStatus(id, status)`: Accept or decline.
- [ ] **UI**: "Add Family Member" Dialog (Input email).
- [ ] **UI**: Connection List (Active connections).
- [ ] **UI**: Pending Requests (Incoming invitations).
- [ ] **Page**: Update `src/app/dashboard/family/page.tsx`.

## 3. Shared Vault (`/dashboard/vault`)
**Goal:** A dedicated space for memories shared *with* the user.
- [ ] **Database Helpers**:
  - `getSharedMemories()`: Fetch memories from `shared_memories` table + `memories` table join.
- [ ] **Page**: `src/app/dashboard/vault/page.tsx` displaying shared content.
- [ ] **Access Control**: Verify `src/app/dashboard/memories/[id]/page.tsx` correctly handles non-owner viewing (hides "Edit", shows "Shared by X").

## 4. Navigation & Polish
- [ ] Update Sidebar/Nav to highlight active section.
- [ ] Ensure empty states are helpful (e.g., "No shared memories yet").
