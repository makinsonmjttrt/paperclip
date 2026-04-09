# Code Review: Sample Function — `getUser`

**Reviewer:** Code Reviewer
**Date:** 2026-04-03
**Issue:** [FOU-80](/FOU/issues/FOU-80)

---

## Code Under Review

```javascript
function getUser(id) {
  var user = db.query('SELECT * FROM users WHERE id = ' + id);
  if (user) { return user; }
}
```

---

## Verdict: REQUEST CHANGES

Four issues identified — one BLOCKING (security), three non-blocking but required for codebase standards.

---

## Issues

### 🚨 BLOCKING — SQL Injection

**Line 2:** `db.query('SELECT * FROM users WHERE id = ' + id)`

String concatenation directly into a SQL query. If `id` is user-supplied, an attacker can pass `1 OR 1=1` or `1; DROP TABLE users` and execute arbitrary SQL.

**Fix:** Use a parameterised query:

```typescript
db.query('SELECT * FROM users WHERE id = $1', [id]);
// or with an ORM:
db.users.findUnique({ where: { id } });
```

---

### HIGH — Missing Error Handling

The `db.query` call has no try/catch. If the database is unavailable or the query fails, an unhandled exception propagates to the caller with no useful context.

**Fix:**

```typescript
try {
  const user = db.query('SELECT * FROM users WHERE id = $1', [id]);
  return user ?? null;
} catch (error) {
  logger.error('getUser failed', { id, error });
  throw new Error('Failed to retrieve user');
}
```

---

### MEDIUM — `var` Declaration

`var` has function scope and is hoisted, which can mask bugs. Project standard (TypeScript strict mode) requires `const` or `let`.

**Fix:** `const user = ...`

---

### MEDIUM — Missing TypeScript Types and Implicit `undefined` Return

1. No type annotations on `id` (should be `string | number`) or return type.
2. If `user` is falsy the function falls through with an implicit `undefined` return. Callers cannot distinguish "user not found" from a missing return.

**Fix:**

```typescript
async function getUser(id: string): Promise<User | null> {
  try {
    const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return user ?? null;
  } catch (error) {
    logger.error('getUser failed', { id, error });
    throw new Error('Failed to retrieve user');
  }
}
```

---

## Summary

| Issue | Severity | Blocking |
|---|---|---|
| SQL injection via string concatenation | Critical | Yes |
| No error handling on DB query | High | No |
| `var` instead of `const` | Medium | No |
| Missing TypeScript types, implicit undefined return | Medium | No |

All four issues must be addressed before approval. The SQL injection is a hard blocker — no exceptions.
