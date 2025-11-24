# Deck Name: Cloud/GCP/Storage-Databases

## Tags: gcp, google-cloud, storage, databases, data
## Type: basic

---

Q: What is the difference between Persistent Disk types?

---

A:

**Standard Persistent Disk (HDD)**:
- Magnetic, slower
- Max 400 IOPS/GB
- $0.04/GB/month
- Use for: Sequential reads, backups, cold storage

**Balanced Persistent Disk (SSD)**:
- SSD, good performance/cost
- Max 6 IOPS/GB
- $0.10/GB/month
- Use for: General-purpose workloads, boot disks

**SSD Persistent Disk**:
- High performance
- Max 30 IOPS/GB
- $0.17/GB/month
- Use for: Databases, high IOPS apps

**Extreme Persistent Disk**:
- Ultra-high performance
- Configurable IOPS (up to 120 IOPS/GB)
- Most expensive
- Use for: SAP HANA, high-end databases

**Zonal vs Regional**:
- **Zonal**: Single zone (cheaper)
- **Regional**: Replicated across 2 zones (99.99% availability)

```bash
# Create regional SSD disk
gcloud compute disks create my-disk \
  --size=100GB \
  --type=pd-ssd \
  --region=us-central1 \
  --replica-zones=us-central1-a,us-central1-b
```

#storage #persistent-disk #performance

---

Q: What is Cloud Storage Object Lifecycle Management?

---

A: Automatically **manage object storage class** and **deletion** based on rules.

**Use Cases**:
- Archive old files
- Delete temporary files
- Optimize storage costs

**Lifecycle Rules**:

**1. SetStorageClass** (Move to cheaper class):
```json
{
  "lifecycle": {
    "rule": [{
      "action": {"type": "SetStorageClass", "storageClass": "NEARLINE"},
      "condition": {
        "age": 30,  // 30 days old
        "matchesStorageClass": ["STANDARD"]
      }
    }]
  }
}
```

**2. Delete**:
```json
{
  "action": {"type": "Delete"},
  "condition": {
    "age": 365,  // 1 year old
    "isLive": true
  }
}
```

**3. Delete old versions** (if versioning enabled):
```json
{
  "action": {"type": "Delete"},
  "condition": {
    "numNewerVersions": 3,  // Keep only 3 newest versions
    "isLive": false
  }
}
```

**Condition Options**:
- `age`: Days since creation
- `createdBefore`: Specific date
- `matchesStorageClass`: Current class
- `numNewerVersions`: For versioned objects

**Example Strategy**:
- 0-30 days: STANDARD (frequent access)
- 30-90 days: NEARLINE (monthly access)
- 90-365 days: COLDLINE (quarterly access)
- 365+ days: ARCHIVE or Delete

#cloud-storage #lifecycle #cost-optimization

---

Q: What is Cloud Filestore and when to use it?

---

A: **Managed NFS** (Network File System) for shared file storage.

**Features**:
- NFSv3 protocol
- Shared across multiple VMs/GKE pods
- Zonal or Regional (HA)
- Up to 100 TB per instance

**Tiers**:

**Basic**:
- HDD or SSD
- 1-63.9 TB
- Use for: General file shares

**Enterprise**:
- Multi-zone replication
- Snapshots
- Use for: Production workloads

**High Scale**:
- 10-100 TB
- High throughput
- Use for: HPC, rendering farms

**Create**:
```bash
gcloud filestore instances create my-filestore \
  --zone=us-central1-a \
  --tier=BASIC_SSD \
  --file-share=name=share1,capacity=1TB \
  --network=name=my-vpc
```

**Mount on VM**:
```bash
sudo mount 10.0.0.2:/share1 /mnt/filestore
```

**vs Persistent Disk**:
- PD: Block storage, single VM (or ReadOnlyMany)
- Filestore: File storage, shared NFS

**Use Cases**:
- Content management (WordPress shared uploads)
- GKE shared volumes (ReadWriteMany)
- Legacy apps requiring NFS
- Media rendering farms

#filestore #storage #nfs

---

Q: What is Memorystore?

---

A: **Managed Redis and Memcached** for caching and in-memory databases.

**Memorystore for Redis**:
- In-memory data store
- Standard (Basic) or High Availability (replicated)
- Up to 300 GB
- Redis 6.x, 7.x

**Memorystore for Memcached**:
- Distributed caching
- Simpler than Redis (no persistence)
- Auto-scaling (add/remove nodes)

**Create Redis**:
```bash
gcloud redis instances create my-cache \
  --size=5 \
  --region=us-central1 \
  --tier=STANDARD_HA \
  --redis-version=redis_7_0
```

**Access from VM/Cloud Run**:
- Requires VPC connectivity
- Private IP address
- Use VPC connector for serverless

**Redis vs Memcached**:
```
Feature         | Redis          | Memcached
----------------|----------------|-------------
Data structures | Yes (lists, sets) | No (key-value only)
Persistence     | Optional       | No
HA              | Yes            | Auto-scaling
Max size        | 300 GB         | 5 TB (distributed)
```

**Use Cases**:
- Session storage (web apps)
- Leaderboards, real-time analytics
- Cache database queries
- Rate limiting (with Redis)

#memorystore #caching #redis

---

Q: What is Cloud Bigtable?

---

A: **NoSQL wide-column database** for massive scale (petabytes).

**Characteristics**:
- Low latency (< 10ms)
- High throughput (millions of ops/sec)
- Scales linearly (add nodes)
- Sparse data (many empty cells OK)
- HBase API compatible

**Architecture**:
```
Client → [Cloud Bigtable API]
              ↓
         [Storage Layer] (Colossus)
              ↓
    [Row Key] [Column Family:Qualifier] [Value]
```

**Data Model**:
```
Row Key: user123#2023-01-01
│
├─ cf1:name = "Alice"
├─ cf1:email = "alice@example.com"
└─ cf2:last_login = "2023-01-01T12:00:00Z"
```

**Schema Design** (Critical):
- **Row key**: Designed for query patterns
- Bad: Timestamp prefix (hot-spotting)
- Good: Hash prefix or reverse timestamp

**When to use Bigtable**:
- ✅ > 1 TB data
- ✅ High throughput (> 10k ops/sec)
- ✅ Time-series data
- ✅ IoT, financial data, analytics

**When NOT to use**:
- ✖ < 1 TB (use Cloud SQL or Firestore)
- ✖ Need transactions (use Firestore/Spanner)
- ✖ Complex queries (use BigQuery)

**Pricing**: Per node-hour + storage

#bigtable #nosql #databases

---

Q: What is Firestore (Native Mode)?

---

A: **Serverless NoSQL document database** with real-time sync.

**Features**:
- Document-based (like MongoDB)
- ACID transactions
- Real-time listeners
- Offline support
- Auto-scaling (no capacity planning)

**Data Model**:
```
Collection: users
  └─ Document: user123
      ├─ name: "Alice"
      ├─ email: "alice@example.com"
      └─ Subcollection: orders
          └─ Document: order456
              ├─ total: 99.99
              └─ items: [...]
```

**Queries**:
```javascript
// Simple query
db.collection('users')
  .where('age', '>', 18)
  .where('city', '==', 'NYC')
  .orderBy('name')
  .limit(10)
  .get()

// Real-time listener
db.collection('messages')
  .onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      console.log(change.doc.data());
    });
  });
```

**Indexes**:
- Single-field: Automatic
- Composite: Must create manually

**vs Datastore**:
- Firestore: Real-time, better queries, newer
- Datastore: Legacy mode (use Firestore instead)

**Use Cases**:
- Mobile/web apps (real-time chat, collaborative editing)
- User profiles and preferences
- Gaming (player state, leaderboards)
- Small to medium datasets (< 1 TB)

**Pricing**: Reads, writes, deletes + storage

#firestore #nosql #databases #realtime

---

Q: What is Cloud SQL read replicas and failover?

---

A:

**Read Replicas**:
- **Purpose**: Scale read workloads
- Read-only copies of primary
- Async replication (slight lag)
- Can be in different region (cross-region replica)

```bash
# Create read replica
gcloud sql instances create my-replica \
  --master-instance-name=my-primary \
  --region=us-east1  # Can be different region
```

**Use Cases**:
- Report generation (avoid impacting primary)
- Geo-distributed reads
- Read-heavy workloads

**High Availability (HA)**:
- Primary + standby in different zone
- **Sync** replication (no data loss)
- Automatic failover (1-2 minutes)

```bash
# Enable HA
gcloud sql instances patch my-instance \
  --availability-type=REGIONAL
```

**HA vs Read Replica**:
```
Feature          | HA Replica      | Read Replica
-----------------|-----------------|------------------
Purpose          | Failover        | Scale reads
Replication      | Synchronous     | Asynchronous
Data loss        | None (RPO=0)    | Possible (lag)
Failover         | Automatic       | Manual promotion
Cost             | Included in HA  | Additional instance
```

**Failover Process**:
1. Primary fails
2. Standby promoted (1-2 min)
3. Connection string stays same
4. Old primary becomes standby

#cloud-sql #high-availability #replication

---

Q: What is BigQuery partitioning and clustering?

---

A: Optimize query performance and cost.

**Partitioning**: Divide table into segments

**1. Time-unit partitioning** (Most common):
```sql
CREATE TABLE dataset.logs (
  timestamp TIMESTAMP,
  user_id STRING,
  action STRING
)
PARTITION BY DATE(timestamp);

-- Query only scans 1 day of data
SELECT * FROM dataset.logs
WHERE DATE(timestamp) = '2023-01-01';
```

**2. Integer-range partitioning**:
```sql
PARTITION BY RANGE_BUCKET(user_id, GENERATE_ARRAY(0, 1000000, 10000));
```

**3. Ingestion-time partitioning**:
- Automatic `_PARTITIONTIME` pseudo-column

**Clustering**: Sort data within partitions
```sql
CREATE TABLE dataset.logs (
  timestamp TIMESTAMP,
  user_id STRING,
  country STRING,
  action STRING
)
PARTITION BY DATE(timestamp)
CLUSTER BY user_id, country;  -- Up to 4 columns
```

**Query optimization**:
```sql
-- Good: Uses partition + cluster
SELECT * FROM dataset.logs
WHERE DATE(timestamp) = '2023-01-01'
  AND user_id = 'user123';

-- Bad: Full table scan
SELECT * FROM dataset.logs
WHERE action = 'login';
```

**Benefits**:
- ✅ Reduce query cost (scan less data)
- ✅ Improve performance
- ✅ Partition expiration (auto-delete old data)

**Best Practices**:
- Partition by date (most queries filter by time)
- Cluster by high-cardinality columns used in WHERE/GROUP BY

#bigquery #optimization #partitioning

---

Q: What are BigQuery slots?

---

A: **Compute capacity** for running queries.

**Slot**: Unit of computational capacity
- 1 slot = ability to run 1 query stage

**Pricing Models**:

**1. On-Demand** (Default):
- Pay per TB scanned ($5/TB)
- No slot management
- Auto-scales (2000 slots default)
- Use for: Unpredictable workloads

**2. Flat-Rate** (Reservations):
- Pre-purchase slots (monthly/yearly)
- 100/500/1000/2000+ slots
- Predictable cost
- Use for: Heavy, consistent usage

```bash
# Create reservation (500 slots)
bq mk --reservation \
  --project_id=my-project \
  --location=us-central1 \
  --slots=500 \
  my-reservation

# Assign to project
bq mk --reservation_assignment \
  --reservation=my-reservation \
  --job_type=QUERY \
  --assignee_type=PROJECT \
  --assignee_id=my-project
```

**Slot Usage**:
- Simple query: Uses few slots
- Complex query: Uses many slots (parallel stages)
- Concurrent queries: Share available slots

**When to use Flat-Rate**:
- Spend > $40k/year on BigQuery
- Predictable high-volume queries
- Need query prioritization

**Monitoring**:
```sql
-- Check slot usage
SELECT * FROM `region-us`.INFORMATION_SCHEMA.JOBS_BY_PROJECT
ORDER BY total_slot_ms DESC
LIMIT 10;
```

#bigquery #pricing #slots

---

Q: What is BigQuery BI Engine?

---

A: **In-memory analysis** service for fast BI dashboards.

**How it works**:
1. Data cached in BI Engine memory
2. Queries hit cache (sub-second)
3. No query cost for cached data

```bash
# Reserve 10 GB of BI Engine capacity
bq mk --reservation \
  --project_id=my-project \
  --location=us \
  --bi_engine_memory_gb=10 \
  my-bi-reservation
```

**Benefits**:
- ✅ Sub-second latency
- ✅ No query cost for cached queries
- ✅ Automatic cache management
- ✅ Works with Looker, Data Studio, Tableau

**Example**:
```sql
-- First query: Scans BigQuery (slow, costs $)
SELECT country, SUM(sales) FROM dataset.sales
GROUP BY country;

-- Subsequent queries: Hit BI Engine cache (fast, free)
SELECT country, SUM(sales) FROM dataset.sales
WHERE country = 'US'
GROUP BY country;
```

**Caching Strategy**:
- Automatic based on query patterns
- Prioritizes frequently accessed data
- LRU eviction

**Use Cases**:
- Interactive dashboards
- Looker/Data Studio reports
- Repeated analytical queries

**Pricing**: $0.36/GB/month (memory capacity)

#bigquery #caching #bi

---

Q: What is the difference between Cloud SQL and AlloyDB?

---

A:

**Cloud SQL**: Managed MySQL, PostgreSQL, SQL Server
- General-purpose RDBMS
- 64 TB max storage
- Up to 96 vCPUs
- Vertical scaling (bigger instance)
- 99.95% SLA (HA config)
- Use for: Traditional relational workloads

**AlloyDB**: PostgreSQL-compatible, Google-built
- **4x faster** than Cloud SQL PostgreSQL (analytics)
- **100x faster** than PostgreSQL (transactional)
- Columnar engine for analytics
- Scales to 100 TB+ storage
- Separate compute/storage (scale independently)
- Read pool (read replicas with millisecond lag)
- 99.99% SLA
- Use for: Demanding PostgreSQL workloads

**Architecture Difference**:
```
Cloud SQL:
[VM] + [Persistent Disk]

AlloyDB:
[Compute Layer] ←→ [Distributed Storage]
                    ↓
              [Columnar Engine]
```

**When to use AlloyDB**:
- Need high performance
- Analytics + transactions (HTAP)
- Migrating from Oracle
- Budget for premium service (2-3x cost)

**When to use Cloud SQL**:
- Standard workloads
- Cost-sensitive
- MySQL or SQL Server needed

#databases #cloud-sql #alloydb

---

Q: What is object versioning in Cloud Storage?

---

A: Keep **multiple versions** of objects (files).

**Enable Versioning**:
```bash
gsutil versioning set on gs://my-bucket
```

**How it works**:
- Upload `file.txt` → Version 1
- Overwrite `file.txt` → Version 2 (Version 1 archived)
- Delete `file.txt` → Version 2 archived, live version deleted

**List Versions**:
```bash
gsutil ls -a gs://my-bucket/file.txt

# Output:
gs://my-bucket/file.txt#1234567890  (live)
gs://my-bucket/file.txt#1234567880  (archived)
```

**Restore Old Version**:
```bash
gsutil cp gs://my-bucket/file.txt#1234567880 gs://my-bucket/file.txt
```

**Lifecycle Policy** (Auto-delete old versions):
```json
{
  "lifecycle": {
    "rule": [{
      "action": {"type": "Delete"},
      "condition": {
        "numNewerVersions": 5,
        "isLive": false
      }
    }]
  }
}
```

**Use Cases**:
- Accidental overwrites/deletes
- Compliance (audit trail)
- Rollback to previous version

**Cost**: Pay for storage of all versions

#cloud-storage #versioning #backup

---

Q: What is Cloud Spanner's TrueTime?

---

A: **Global clock synchronization** for consistent transactions across regions.

**The Problem**:
- Distributed database across multiple regions
- Clocks might be slightly different (clock skew)
- Hard to determine order of events

**TrueTime API**:
```
TT.now() returns: [earliest, latest]
Example: [12:00:00.100, 12:00:00.107]
```
- Guarantees actual time is within interval
- Uses GPS + atomic clocks

**How Spanner Uses It**:
1. Transaction commits at time T
2. Wait until T is in the past on ALL servers
3. Then transaction is visible globally
4. Ensures **external consistency** (stronger than serializability)

**Example**:
```
Client A: Write X=1 at 12:00:00.100 ✅
Client B: Read X at 12:00:00.108
Result: B sees X=1 (guaranteed)

Without TrueTime: B might see old value due to replication lag
```

**Benefits**:
- ✅ Strongly consistent reads (no stale data)
- ✅ Linearizability across regions
- ✅ Snapshot reads at exact timestamp

**Trade-off**: Commit latency (wait for clock uncertainty)
- Typical wait: ~7ms

**Why it matters**: Enables global ACID transactions at scale

#cloud-spanner #consistency #truetime

---

Q: What are Cloud Storage signed URLs?

---

A: **Time-limited URLs** for temporary access without authentication.

**Use Cases**:
- Allow users to upload/download without Google account
- Temporary access to private objects
- Pre-signed upload forms

**Generate Signed URL**:
```bash
# Download (GET)
gsutil signurl -d 10m \
  /path/to/service-account-key.json \
  gs://my-bucket/file.pdf

# Upload (PUT)
gsutil signurl -m PUT -d 1h \
  /path/to/service-account-key.json \
  gs://my-bucket/uploads/new-file.jpg
```

**Python Example**:
```python
from google.cloud import storage
from datetime import timedelta

client = storage.Client()
bucket = client.bucket('my-bucket')
blob = bucket.blob('file.pdf')

url = blob.generate_signed_url(
    version='v4',
    expiration=timedelta(minutes=15),
    method='GET'
)

print(url)
# https://storage.googleapis.com/my-bucket/file.pdf?X-Goog-Algorithm=...
```

**Security**:
- URL contains signature (HMAC)
- Requires service account key
- Expires after specified time
- Can't be extended (must regenerate)

**vs Public Access**:
- Public: Anyone can access anytime
- Signed URL: Time-limited, specific object, revocable (by key rotation)

#cloud-storage #security #signed-urls

---

Q: What is BigQuery streaming inserts?

---

A: Insert data in **real-time** to BigQuery (not batch).

**Use Cases**:
- Ingest logs in real-time
- IoT sensor data
- Application events

**API Example**:
```python
from google.cloud import bigquery

client = bigquery.Client()
table_id = "my-project.dataset.table"

rows_to_insert = [
    {"timestamp": "2023-01-01T12:00:00", "user_id": "user123", "event": "click"},
    {"timestamp": "2023-01-01T12:00:01", "user_id": "user456", "event": "view"},
]

errors = client.insert_rows_json(table_id, rows_to_insert)
if not errors:
    print("Data inserted successfully")
```

**Best Practices**:

**1. Use `insertId` for deduplication**:
```python
rows_to_insert = [
    {"insertId": "unique-id-123", "data": {...}},
]
```
Prevents duplicate inserts (best-effort, 1-minute window)

**2. Batch inserts** (up to 10,000 rows or 10MB):
- More efficient than single row inserts

**3. Handle errors**:
```python
errors = client.insert_rows_json(table_id, rows_to_insert)
for error in errors:
    print(f"Row {error['index']} failed: {error['errors']}")
```

**Pricing**:
- $0.05 per 200 MB (higher than batch load)
- Consider Storage Write API for high throughput

**Limitations**:
- Data available immediately for streaming buffer
- Fully available after ~90 seconds
- Can't query streamed data with COPY/EXPORT immediately

**Alternatives**:
- **Storage Write API**: Lower cost, higher throughput
- **Dataflow → BigQuery**: Complex transformations

#bigquery #streaming #real-time

---
