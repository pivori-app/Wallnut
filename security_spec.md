# Security Specification - Wallnut V4.1

## 1. Data Invariants
- A Dossier must be owned by a Client.
- A Document must belong to a Dossier. Access is derived from the Dossier's ownership.
- A Payment must follow a pre-defined type and status.
- Only Institutions or Gestionnaires can see global financial metrics.
- Users cannot change their own roles (Identity Integrity).

## 2. The Dirty Dozen Payloads (Rejection Targets)
1. **Unauthorized Dossier Access**: Attempting to read a dossier ID that doesn't belong to the auth user.
2. **Ghost Field Injection**: Adding `isVerified: true` to a user profile during self-update.
3. **ID Poisoning**: Creating a document with a 1.5KB junk string as the ID.
4. **Relational Skip**: Creating a Document without a valid Dossier ID.
5. **Role Escalation**: Setting `role: 'institution'` during registration.
6. **Path Variable Injection**: Using `/dossiers/../users/admin` as a path.
7. **Cross-Tenant Leak**: Attempting to list items with a different `tenantId`.
8. **PII Blanket Read**: Trying to `get` the private PII subcollection of another user.
9. **Terminal State Bypass**: Updating a dossier that is already in 'closed' status.
10. **Immutable Field Change**: Changing `createdAt` on a dossier update.
11. **Cost Attack**: Repeatedly calling `list` on a collection without any indexable filters.
12. **Future Timestamp Spoofing**: Providing a `createdAt` in 2030.

## 3. Implementation Patterns
- `isValidUser`, `isValidDossier`, `isValidDocument`, `isValidPayment` helpers.
- Use of `affectedKeys().hasOnly()` for all updates.
- Root level `match /{document=**} { allow read, write: if false; }`.
- `exists()` checks for relational integrity.
