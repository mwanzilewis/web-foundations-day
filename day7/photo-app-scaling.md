# SnapShare Scaling Plan - Day 7

## Assumptions
- 10,000,000 registered users
- 10% active each day => Daily Active Users (DAU) = 1,000,000
- Each active user uploads 1 photo per day
- Each active user views 50 feed pages per day
- Average photo size = 2 MB
- Thumbnail size = 50 KB per photo
- Day = 86,400 seconds
- Peak factor = 5x average for feed views
- Photos kept for 1 year for storage estimate, no deletion
- Feed view = 1 API request returning a page of feed (e.g., 20 photos)

## Daily Active Users
10,000,000 * 0.10 = 1,000,000 DAU

## Estimates

### Uploads per second
Daily uploads = 1,000,000 photos/day
Uploads/sec (avg) = 1,000,000 / 86,400 = ~11.6 -> ~12 uploads/sec
Peak uploads ~ 12 * 5 = ~60 uploads/sec

### Feed views per second
Daily feed views = 1,000,000 users * 50 pages = 50,000,000 feed views/day
Average = 50,000,000 / 86,400 = ~579 feed views/sec
Peak (5x) = 579 * 5 = ~2,894 -> ~2,900 feed views/sec

### Storage per year
Photos per year = 1,000,000 * 365 = 365,000,000 photos/year
Originals: 365,000,000 * 2 MB = 730,000,000 MB = ~730 TB/year
Thumbnails: 365,000,000 * 50 KB = ~18.25 TB/year
Total ~ 748 TB/year (~750 TB/year with overhead)

> ~2 TB per day of new originals + ~50 GB thumbnails per day.

## Read-heavy or Write-heavy?
This system is **read-heavy**.

50M feed views/day vs 1M uploads/day = 50 reads per write.

What this means: Optimize for fast, cached reads and horizontal scaling of read capacity. Use CDN + cache + read replicas to serve feed and photos. Writes can go through a slower async path (queue + worker) because users tolerate slight delay for processing but not for feed loading.

## Why not store photos in the database?
Photos are large binary objects (2 MB). Storing them in the database would bloat it to ~750 TB/year, making backups, replication, and queries extremely slow and expensive, and waste expensive DB I/O and memory on bulk data instead of metadata.

Instead, store photo files in **object storage** (e.g., S3, GCS, Azure Blob) and store only **metadata** in the database: photo_id, user_id, original URL, thumbnail URL, timestamp, caption, etc.

## Architecture Diagram (Text)
