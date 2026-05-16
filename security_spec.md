# Security Specification: APIVerse

## Data Invariants
1. A **User** profile must match the authenticated `uid`.
2. A **Discussion** must have a valid `authorId` matching the creator.
3. A **Comment** must belong to a valid **Discussion** and have a valid `authorId`.
4. Users cannot modify their own `role` or `points`.
5. Only `admin` can create or update **API** entries.

## The Dirty Dozen Payloads
1. **Identity Spoofing**: Attempt to create a user profile with a different `uid` than the auth token.
2. **Privilege Escalation**: User attempting to set `role: 'admin'` on their own profile.
3. **Ghost Fields**: Attempt to add `verified: true` to a discussion payload.
4. **Orphaned Write**: Attempt to comment on a non-existent discussion.
5. **State Shortcut**: Attempt to update `points` directly from the client.
6. **Resource Poisoning**: Create a discussion with a 2MB `content` string.
7. **Cross-User Edit**: User A attempting to edit User B's discussion.
8. **PII Leak**: Authenticated user attempting to read another user's email.
9. **Denial of Wallet**: Infinite loop of recursive lookups (guarded by rule order).
10. **ID Poisoning**: Using a 5KB string as a `discussionId`.
11. **Client Delegation**: Listing all users without specifying the owner (guarded by list rule).
12. **Null Injection**: Attempt to set `authorId: null`.

## Test Runner (Logic Overview)
The `firestore.rules.test.ts` will verify these constraints using the Firebase Emulator (simulated per instructions).
In this environment, we will implement the rules directly and verify via the "Red Team Audit" process.
