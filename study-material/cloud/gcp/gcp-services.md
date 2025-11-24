# Deck Name: Cloud/GCP/Services

## Tags: gcp, google-cloud, cloud, services
## Type: basic

---

Q: What is the difference between Compute Engine, App Engine, and Cloud Run?

---

A:

**Compute Engine**: IaaS - Virtual Machines
- Full control over VM (OS, software)
- Manual scaling
- Pay for running VMs
- Use for: Custom environments, legacy apps

**App Engine**: PaaS - Fully managed app platform
- Deploy code, Google manages infrastructure
- Auto-scaling built-in
- Standard (sandboxed) or Flexible (containers)
- Use for: Web apps, mobile backends

**Cloud Run**: Serverless Containers
- Deploy containers, fully managed
- Auto-scales to zero
- Pay per request
- Use for: Stateless containers, APIs, microservices

**Summary**: VM control → App platform → Serverless containers

#compute #comparison #serverless

---

Q: What are the main GCP storage options?

---

A:

**1. Cloud Storage (Object Storage)**:
- Files, images, videos, backups
- Classes: Standard, Nearline, Coldline, Archive
- Global, highly available
- Use for: Static websites, backups, data lakes

**2. Persistent Disk**:
- Block storage for Compute Engine VMs
- SSD or HDD
- Zonal or Regional
- Use for: VM boot disks, databases

**3. Filestore**:
- Managed NFS file storage
- Shared across VMs
- Use for: File shares, CMS, media rendering

**4. Cloud SQL / Cloud Spanner / Firestore**:
- Managed databases (not raw storage)

**Choice Guide**:
- Objects/files → Cloud Storage
- VM disks → Persistent Disk
- Shared files → Filestore
- Databases → Cloud SQL/Spanner/Firestore

#storage #comparison

---

Q: What is Cloud Functions and when should you use it?

---

A: **Serverless** compute that runs code in response to events.

**Characteristics**:
- No server management
- Auto-scales (0 to infinity)
- Pay per invocation
- Max execution: 9 minutes (1st gen) or 60 minutes (2nd gen)

**Triggers**:
- **HTTP**: Direct HTTP requests
- **Pub/Sub**: Message queue
- **Cloud Storage**: File upload/delete
- **Firestore**: Document changes
- **Firebase**: Auth, Analytics events

```javascript
// Example HTTP function
exports.helloWorld = (req, res) => {
  res.send('Hello from Cloud Functions!');
};
```

**Use Cases**:
- Webhooks and APIs
- Data processing pipelines
- IoT backends
- Scheduled tasks (with Cloud Scheduler)

**Not for**: Long-running tasks, stateful apps

#serverless #cloud-functions #faas

---

Q: What are the different Cloud Storage classes?

---

A:

| Class | Use Case | Min Duration | Retrieval |
|-------|----------|--------------|-----------|
| **Standard** | Frequently accessed | None | Instant |
| **Nearline** | Monthly access | 30 days | Instant |
| **Coldline** | Quarterly access | 90 days | Instant |
| **Archive** | Yearly access | 365 days | Instant |

**Pricing**: Storage cost decreases, retrieval cost increases

**Autoclass**: Automatically moves objects to optimal class

```bash
# Create bucket with Standard class
gsutil mb -c STANDARD gs://my-bucket

# Change object class
gsutil rewrite -s NEARLINE gs://my-bucket/file.txt

# Set lifecycle policy
gsutil lifecycle set lifecycle.json gs://my-bucket
```

**Lifecycle example** (auto-delete after 30 days):
```json
{
  "lifecycle": {
    "rule": [{
      "action": {"type": "Delete"},
      "condition": {"age": 30}
    }]
  }
}
```

#storage #cloud-storage #classes

---

Q: What is the difference between Cloud SQL and Cloud Spanner?

---

A:

**Cloud SQL**: Managed **regional** relational DB
- MySQL, PostgreSQL, SQL Server
- Up to 64 TB storage
- Vertical scaling (bigger machines)
- Regional availability (HA with failover)
- Use for: Traditional RDBMS workloads

**Cloud Spanner**: Managed **global** distributed DB
- Proprietary SQL
- Petabyte scale
- Horizontal scaling (add nodes)
- Multi-regional, strong consistency
- 99.999% availability (5 nines)
- Use for: Global applications, massive scale

**Cost**: Spanner significantly more expensive

**When to choose**:
- Regional, < 10TB, standard SQL → Cloud SQL
- Global, > 10TB, need consistency → Cloud Spanner
- Multi-model, document store → Firestore

#databases #cloud-sql #cloud-spanner

---

Q: What is Google Kubernetes Engine (GKE)?

---

A: **Managed Kubernetes** service on GCP.

**Features**:
- **Control plane managed** by Google (free)
- Auto-repair, auto-upgrade
- Integrated with GCP services
- Workload Identity (secure pod access)
- Binary Authorization (deploy signed images only)

**Modes**:

**Standard**: You manage nodes
- More control over configuration
- Node pools with different machine types

**Autopilot**: Google manages nodes
- Fully hands-off
- Optimized resource allocation
- Pay per pod, not node

```bash
# Create standard cluster
gcloud container clusters create my-cluster \
  --num-nodes=3 \
  --zone=us-central1-a

# Create autopilot cluster
gcloud container clusters create-auto my-autopilot \
  --region=us-central1

# Get credentials
gcloud container clusters get-credentials my-cluster
```

**Cost**: Standard = VMs + control plane (free)
        Autopilot = Pod resources + management fee

#gke #kubernetes #containers

---

Q: What is VPC and what are subnets in GCP?

---

A:

**VPC (Virtual Private Cloud)**: Global software-defined network

**Key Concepts**:

**Subnets**: Regional IP ranges within VPC
- Each subnet is **regional** (not zonal)
- Resources in subnet get IP from range
- Can span multiple zones in region

**Example**:
```
VPC: my-vpc (global)
├── Subnet: us-central1 (10.0.1.0/24)
├── Subnet: us-east1 (10.0.2.0/24)
└── Subnet: europe-west1 (10.0.3.0/24)
```

**Modes**:
- **Auto mode**: Google creates subnets in all regions
- **Custom mode**: You create subnets manually (recommended for production)

```bash
# Create custom VPC
gcloud compute networks create my-vpc \
  --subnet-mode=custom

# Create subnet
gcloud compute networks subnets create my-subnet \
  --network=my-vpc \
  --range=10.0.1.0/24 \
  --region=us-central1
```

**Firewall**: Applied at VPC level, uses tags/service accounts

#networking #vpc #subnets

---

Q: What is Cloud Load Balancing and what types are available?

---

A: Fully managed load balancing service.

**Global Load Balancers** (anycast IP):

**1. HTTP(S) Load Balancer**:
- Layer 7 (application)
- URL-based routing
- SSL termination
- CDN integration
- Use for: Web applications, APIs

**2. SSL Proxy / TCP Proxy**:
- Layer 4 (transport)
- Non-HTTP traffic
- Use for: SSL traffic, long-lived TCP

**Regional Load Balancers**:

**3. Network Load Balancer**:
- Layer 4, pass-through
- Preserves client IP
- Use for: TCP/UDP traffic

**4. Internal Load Balancer**:
- Private load balancing
- Between VMs in VPC
- Use for: Multi-tier architectures

**Key Features**:
- Auto-scaling backend
- Health checks
- Session affinity
- Connection draining

#load-balancing #networking #scalability

---

Q: What is Cloud Pub/Sub?

---

A: Managed **message queue** service for asynchronous communication.

**Architecture**:
```
Publisher → Topic → Subscription → Subscriber
```

**Key Features**:
- At-least-once delivery
- Global by default
- Auto-scaling
- Message ordering (optional)
- Dead-letter topics

```python
# Publish
from google.cloud import pubsub_v1

publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path('project-id', 'topic-name')

future = publisher.publish(topic_path, b'Message data')
print(f'Published message ID: {future.result()}')

# Subscribe
subscriber = pubsub_v1.SubscriberClient()
subscription_path = subscriber.subscription_path('project-id', 'sub-name')

def callback(message):
    print(f'Received: {message.data}')
    message.ack()

subscriber.subscribe(subscription_path, callback=callback)
```

**Push vs Pull**:
- **Push**: Pub/Sub sends to webhook
- **Pull**: Subscriber polls for messages

#messaging #pubsub #async

---

Q: What is Cloud IAM and what are the key concepts?

---

A: **Identity and Access Management** - Who can do what on which resource.

**Key Concepts**:

**1. Member** (Who):
- Google Account (user@gmail.com)
- Service Account (app@project.iam.gserviceaccount.com)
- Google Group
- Domain (example.com)

**2. Role** (What):
- **Primitive**: Owner, Editor, Viewer (too broad, avoid)
- **Predefined**: compute.admin, storage.objectViewer
- **Custom**: Your own combination of permissions

**3. Resource** (Where):
- Project, Bucket, VM, etc.
- Hierarchy: Organization > Folder > Project > Resource

**Binding**: Member + Role + Resource
```json
{
  "bindings": [{
    "role": "roles/storage.objectViewer",
    "members": [
      "user:alice@example.com",
      "serviceAccount:my-app@project.iam.gserviceaccount.com"
    ]
  }]
}
```

**Best Practices**:
- Use predefined roles
- Principle of least privilege
- Service accounts for applications
- Avoid primitive roles

#iam #security #access-control

---

Q: What is BigQuery and what makes it special?

---

A: Serverless, **highly scalable** data warehouse and analytics platform.

**Key Features**:
- **Serverless**: No infrastructure to manage
- **Petabyte scale**: Analyze TB/PB of data
- **Columnar storage**: Fast analytical queries
- **SQL interface**: Standard SQL
- **Streaming inserts**: Real-time analytics
- **ML built-in**: BigQuery ML

**Pricing**:
- Storage: $0.02/GB/month
- Queries: $5/TB scanned (on-demand) or flat-rate

**Optimization**:
```sql
-- Partition tables by date
CREATE TABLE dataset.table
PARTITION BY DATE(timestamp)
AS SELECT * FROM source;

-- Cluster for better performance
CREATE TABLE dataset.table
PARTITION BY DATE(timestamp)
CLUSTER BY user_id, region
AS SELECT * FROM source;
```

**Use Cases**:
- Data warehousing
- Log analytics
- Real-time dashboards
- Machine learning on large datasets

#bigquery #analytics #data-warehouse

---

Q: What are Service Accounts and how are they used?

---

A: **Identity for applications** (not users) to authenticate with GCP.

**Types**:

**1. User-managed**:
- You create and manage
- Custom name
- Used by your applications

**2. Google-managed**:
- Created by GCP services
- Name like `PROJECT_ID@appspot.gserviceaccount.com`

**Create and use**:
```bash
# Create service account
gcloud iam service-accounts create my-app \
  --display-name="My Application"

# Grant role
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:my-app@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.objectViewer"

# Create key (JSON)
gcloud iam service-accounts keys create key.json \
  --iam-account=my-app@PROJECT_ID.iam.gserviceaccount.com

# Use in code
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json"
```

**Best Practices**:
- One service account per application
- Rotate keys regularly
- Use Workload Identity for GKE (no key files)
- Least privilege (minimal roles)

#service-accounts #authentication #security

---

Q: What is Cloud Armor and what does it protect against?

---

A: **DDoS protection** and **Web Application Firewall (WAF)** for GCP.

**Protection**:
- DDoS attacks (volumetric, protocol, application layer)
- SQL injection
- Cross-site scripting (XSS)
- Geo-based blocking
- Rate limiting

**Works with**:
- HTTP(S) Load Balancer (Layer 7)
- Google Cloud CDN

```bash
# Create security policy
gcloud compute security-policies create my-policy

# Add rule (block specific IP)
gcloud compute security-policies rules create 1000 \
  --security-policy=my-policy \
  --src-ip-ranges="1.2.3.4/32" \
  --action=deny-403

# Preconfigured rules (OWASP Top 10)
gcloud compute security-policies rules create 2000 \
  --security-policy=my-policy \
  --expression="evaluatePreconfiguredExpr('xss-stable')" \
  --action=deny-403

# Attach to backend service
gcloud compute backend-services update my-backend \
  --security-policy=my-policy
```

**Features**:
- Preview mode (log only)
- Adaptive protection (ML-based)
- Custom rules (CEL expressions)

#security #waf #ddos #cloud-armor

---

Q: What is the difference between Regional and Multi-Regional resources?

---

A:

**Regional Resources**: Exist in **single region**
- Lower latency within region
- Lower cost
- Examples: Compute Engine VMs, Regional Persistent Disks, Cloud SQL

**Multi-Regional Resources**: Replicated across **multiple regions**
- Higher availability (99.95% vs 99.9%)
- Lower latency globally (geo-distributed)
- Higher cost
- Examples: Cloud Storage (multi-regional buckets), BigQuery (multi-region datasets)

**Zonal Resources**: Exist in **single zone** (lowest availability)
- Examples: Zonal Persistent Disks, VM instances

```
Organization
└── Regions (us-central1, europe-west1)
    └── Zones (us-central1-a, us-central1-b)
```

**Choosing**:
- Critical, global users → Multi-regional
- Regional users, HA needed → Regional
- Development, testing → Zonal

#architecture #availability #regions

---

Q: What is VPC Peering vs Shared VPC?

---

A:

**VPC Peering**: Connect **two VPCs** (same or different projects)
- Private RFC 1918 connectivity
- No overlapping IP ranges
- Transitive peering **not supported** (A-B, B-C ≠ A-C)
- Use for: Inter-organization connectivity

```bash
gcloud compute networks peerings create peer-ab \
  --network=vpc-a \
  --peer-project=project-b \
  --peer-network=vpc-b
```

**Shared VPC**: **Central VPC** shared across projects
- Host project owns VPC
- Service projects use subnets
- Centralized network administration
- Use for: Organization-wide connectivity

```bash
# Enable host project
gcloud compute shared-vpc enable HOST_PROJECT

# Attach service project
gcloud compute shared-vpc associated-projects add SERVICE_PROJECT \
  --host-project=HOST_PROJECT
```

**Comparison**:
- Peering = Connect separate VPCs
- Shared VPC = Share one VPC across projects

#networking #vpc #connectivity

---
