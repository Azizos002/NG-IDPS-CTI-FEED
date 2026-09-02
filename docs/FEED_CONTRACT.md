CTI Feed Contract (demo v1)

Endpoints

GET /api/v1/feed
- Returns JSON: { version: 'v1', count: N, items: [ { id, title, summary, type, severity, publishedAt, tags, iocs, references, language } ] }
- Query param: since=ISO8601 to return items published after the timestamp

GET /api/v1/actualities
- Returns list of actualities (all statuses). Query params: q, type, severity

GET /api/v1/actualities/:id
- Returns a single actuality object

POST /api/v1/actualities
- Create a new actuality (appends to seed.json). Returns 201 with created item.

Notes
- Demo-first: seed JSON stored at src/data/seed.json is the source-of-truth for demo and local editing.
- No authentication in initial scaffold.
- API is versioned under /api/v1 and intentionally minimal to allow NG-IDPS agent to poll the feed.
