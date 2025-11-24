# Deck Name: Cloud/AWS/Fundamentals

## Tags: aws, amazon-web-services, cloud, fundamentals
## Type: basic

---

Q: What are the main AWS compute services?

---

A:

**EC2 (Elastic Compute Cloud)**:
- Virtual servers (IaaS)
- Full control over OS and config
- Pay per hour/second
- Use for: Custom apps, legacy software

**Lambda**:
- Serverless functions (FaaS)
- Event-driven, auto-scaling
- Pay per invocation
- Max 15 minutes execution
- Use for: APIs, event processing, automation

**ECS (Elastic Container Service)**:
- Docker container orchestration
- Fargate (serverless) or EC2 launch types
- Use for: Microservices, containerized apps

**EKS (Elastic Kubernetes Service)**:
- Managed Kubernetes
- Compatible with standard K8s tools
- Use for: Complex container orchestration

**Elastic Beanstalk**:
- PaaS - deploy code, AWS manages infrastructure
- Supports Node.js, Python, Java, etc.
- Use for: Quick deployments, web apps

**Summary**: VM → Containers → Serverless Functions → PaaS

#compute #ec2 #lambda #fundamentals

---

Q: What are the different EC2 instance types?

---

A:

**General Purpose** (T, M series):
- Balanced CPU/memory
- T3: Burstable (credits for spikes)
- M5: Steady-state workloads
- Use for: Web servers, dev/test

**Compute Optimized** (C series):
- High CPU-to-memory ratio
- C6i, C7g
- Use for: Batch processing, gaming, HPC

**Memory Optimized** (R, X series):
- High memory-to-CPU ratio
- R6i: 8:1 memory:CPU
- X2: Up to 4 TB RAM
- Use for: Databases, caching, in-memory analytics

**Storage Optimized** (I, D series):
- High IOPS, local NVMe storage
- I3: Up to 60 TB NVMe
- Use for: NoSQL databases, data warehousing

**Accelerated Computing** (P, G, Inf series):
- GPU/FPGA instances
- P4: ML training
- G5: Graphics, ML inference
- Use for: AI/ML, video rendering

**Naming**: `m5.xlarge`
- `m` = family
- `5` = generation
- `xlarge` = size

#ec2 #instance-types #compute

---

Q: What is the difference between S3 storage classes?

---

A:

**S3 Standard**:
- Frequently accessed
- 99.99% availability
- $0.023/GB/month
- Use for: Active data, websites

**S3 Intelligent-Tiering**:
- Auto-moves objects between tiers
- Monitoring fee: $0.0025/1000 objects
- Use for: Unknown access patterns

**S3 Standard-IA** (Infrequent Access):
- 99.9% availability
- $0.0125/GB/month + retrieval fee
- 30-day minimum storage
- Use for: Backups, disaster recovery

**S3 One Zone-IA**:
- Single AZ (less resilient)
- $0.01/GB/month
- Use for: Reproducible data, thumbnails

**S3 Glacier Instant Retrieval**:
- Archive, millisecond retrieval
- $0.004/GB/month
- 90-day minimum
- Use for: Medical images, news archives

**S3 Glacier Flexible Retrieval**:
- Minutes to hours retrieval
- $0.0036/GB/month
- Use for: Long-term backups

**S3 Glacier Deep Archive**:
- 12+ hour retrieval
- $0.00099/GB/month
- 180-day minimum
- Use for: Compliance archives

**Lifecycle Transition**:
Standard → IA (30 days) → Glacier (90 days) → Deep Archive (365 days)

#s3 #storage #storage-classes

---

Q: What is an AWS Region vs Availability Zone?

---

A:

**Region**: Geographic area with multiple data centers
- Example: `us-east-1` (N. Virginia)
- 31+ regions globally
- Each region is **isolated**
- Some services are regional (S3, DynamoDB)

**Availability Zone (AZ)**: One or more data centers
- Example: `us-east-1a`, `us-east-1b`
- Each region has 2-6 AZs
- AZs in same region are **low-latency connected** (<2ms)
- **Fault isolation**: AZ failure doesn't affect others

```
Region: us-east-1
├── AZ: us-east-1a (Data Center 1, 2)
├── AZ: us-east-1b (Data Center 3, 4)
└── AZ: us-east-1c (Data Center 5, 6)
```

**Best Practices**:
- Deploy in **multiple AZs** for high availability
- Use **multiple regions** for disaster recovery
- Keep in mind data transfer costs between AZs

**Edge Locations**: CDN caches (CloudFront)
- 400+ edge locations
- Closer to users than regions

#regions #availability-zones #architecture

---

Q: What is the difference between Security Groups and NACLs?

---

A:

**Security Groups** (SG):
- **Instance level** (attached to ENI)
- **Stateful**: Return traffic automatically allowed
- Only **Allow** rules (no deny)
- Evaluated as a whole (all rules apply)

```
Inbound: Allow TCP 80 from 0.0.0.0/0
Outbound: All traffic allowed (default)
```

**Network ACLs** (NACL):
- **Subnet level** (affects all instances)
- **Stateless**: Must explicitly allow return traffic
- **Allow and Deny** rules
- Rules processed in **order** (lowest number first)

```
Rule 100: Allow TCP 80 from 0.0.0.0/0
Rule 200: Deny TCP 22 from 10.0.0.0/8
Rule *: Deny all (default)
```

**Comparison**:
```
Feature        | Security Group | NACL
---------------|----------------|-------
Level          | Instance       | Subnet
State          | Stateful       | Stateless
Rules          | Allow only     | Allow + Deny
Order          | All evaluated  | Lowest # first
Default        | Deny all       | Allow all (default)
```

**Best Practice**:
- Use **Security Groups** as primary firewall
- Use **NACLs** for additional subnet-level control

#security-groups #nacl #networking #security

---

Q: What is AWS IAM and its key components?

---

A: **Identity and Access Management** - Control who can do what.

**Components**:

**1. Users**:
- Individual people or services
- Long-term credentials (password, access keys)
```json
{
  "UserName": "alice",
  "AccessKeys": ["AKIAIOSFODNN7EXAMPLE"]
}
```

**2. Groups**:
- Collection of users
- Apply policies to group
```
Group: Developers
├── Alice
├── Bob
└── Charlie
```

**3. Roles**:
- **Assumed** by users/services (not permanent)
- EC2, Lambda can assume roles
- Cross-account access
```
Role: EC2-S3-ReadOnly
└── Trust: EC2 service
└── Permissions: S3 read
```

**4. Policies**:
- JSON documents defining permissions
```json
{
  "Effect": "Allow",
  "Action": "s3:GetObject",
  "Resource": "arn:aws:s3:::my-bucket/*"
}
```

**Policy Types**:
- **Managed**: AWS or customer managed (reusable)
- **Inline**: Directly attached to user/role (1:1)

**Best Practices**:
- Use **roles** for applications (not access keys)
- **Least privilege**: Grant minimum needed
- Enable **MFA** for privileged users
- Use **managed policies** (easier to maintain)

#iam #security #access-control

---

Q: What is AWS VPC?

---

A: **Virtual Private Cloud** - Isolated network in AWS.

**Components**:

**1. VPC**:
- CIDR block: `10.0.0.0/16`
- Regional (spans all AZs)

**2. Subnets**:
- Segment of VPC CIDR
- **Public**: Has route to Internet Gateway
- **Private**: No direct internet access
```
VPC: 10.0.0.0/16
├── Public Subnet: 10.0.1.0/24 (us-east-1a)
├── Private Subnet: 10.0.2.0/24 (us-east-1a)
└── Private Subnet: 10.0.3.0/24 (us-east-1b)
```

**3. Internet Gateway (IGW)**:
- Allows VPC to access internet
- Attached to VPC

**4. NAT Gateway**:
- Allows **private** subnets to access internet (outbound only)
- Placed in **public** subnet

**5. Route Tables**:
- Control traffic routing
```
Public Route Table:
10.0.0.0/16 → local
0.0.0.0/0 → Internet Gateway

Private Route Table:
10.0.0.0/16 → local
0.0.0.0/0 → NAT Gateway
```

**Architecture**:
```
Internet
    ↓
[Internet Gateway]
    ↓
[Public Subnet] (Web servers)
    ↓
[NAT Gateway]
    ↓
[Private Subnet] (App servers)
    ↓
[Private Subnet] (Databases)
```

#vpc #networking #architecture

---

Q: What is EBS and what are the volume types?

---

A: **Elastic Block Store** - Block storage for EC2 (like a hard drive).

**Volume Types**:

**General Purpose SSD (gp3, gp2)**:
- Balanced price/performance
- gp3: 3000 IOPS baseline, configurable
- gp2: 3 IOPS/GB (bursts to 3000)
- Use for: Boot volumes, dev/test

**Provisioned IOPS SSD (io2, io1)**:
- High performance, low latency
- Up to 64,000 IOPS
- io2: 99.999% durability
- Use for: Databases, critical apps

**Throughput Optimized HDD (st1)**:
- Low-cost HDD
- Max 500 IOPS, high throughput
- Use for: Big data, log processing

**Cold HDD (sc1)**:
- Lowest cost
- Max 250 IOPS
- Use for: Infrequently accessed data

**Characteristics**:
- **Zonal**: Tied to specific AZ
- **Snapshots**: Backup to S3 (incremental)
- **Encryption**: At rest and in transit

**Multi-Attach** (io2 only):
- Attach to multiple EC2 instances
- Use for: Clustered applications

```bash
# Create volume
aws ec2 create-volume \
  --volume-type gp3 \
  --size 100 \
  --availability-zone us-east-1a

# Attach to instance
aws ec2 attach-volume \
  --volume-id vol-123abc \
  --instance-id i-456def \
  --device /dev/sdf
```

#ebs #storage #ec2

---

Q: What is an Elastic Load Balancer and what types exist?

---

A: Distributes traffic across multiple targets.

**Types**:

**1. Application Load Balancer (ALB)** ⭐ Most common:
- **Layer 7** (HTTP/HTTPS)
- Host/path-based routing
- WebSocket, HTTP/2 support
- Target: EC2, IP, Lambda
- Use for: Microservices, containers

**2. Network Load Balancer (NLB)**:
- **Layer 4** (TCP/UDP)
- Ultra-high performance (millions req/sec)
- Static IP, Elastic IP support
- Preserves client IP
- Use for: Gaming, IoT, extreme performance

**3. Gateway Load Balancer (GWLB)**:
- **Layer 3** (IP packets)
- For third-party appliances (firewalls, IDS)
- Use for: Network security appliances

**4. Classic Load Balancer** (Legacy):
- Both Layer 4 and 7
- Use ALB/NLB instead

**ALB Features**:
```
example.com/api → Target Group 1 (API servers)
example.com/web → Target Group 2 (Web servers)

user-type: premium → Target Group 3 (Premium servers)
```

**Health Checks**:
- ALB/NLB sends requests to targets
- Unhealthy targets removed from rotation
- Automatic recovery when healthy

**Cross-Zone Load Balancing**:
- Distribute evenly across all AZs
- ALB: Always enabled
- NLB: Optional

#load-balancing #alb #nlb #networking

---

Q: What is Auto Scaling?

---

A: Automatically **add or remove EC2 instances** based on demand.

**Components**:

**1. Launch Template/Configuration**:
- AMI, instance type, security groups
- What to launch

**2. Auto Scaling Group (ASG)**:
- Min, Max, Desired capacity
- VPC subnets (AZs)
- Load balancer integration

**3. Scaling Policies**:
- **Target Tracking**: Maintain metric (e.g., CPU 50%)
- **Step Scaling**: Scale based on CloudWatch alarms
- **Scheduled**: Scale at specific times

```json
{
  "AutoScalingGroupName": "my-asg",
  "MinSize": 2,
  "MaxSize": 10,
  "DesiredCapacity": 4,
  "HealthCheckType": "ELB",
  "TargetGroupARNs": ["arn:aws:..."],
  "ScalingPolicies": [{
    "PolicyType": "TargetTrackingScaling",
    "TargetValue": 50.0,
    "PredefinedMetric": "ASGAverageCPUUtilization"
  }]
}
```

**How it works**:
1. CPU > 70% → CloudWatch Alarm
2. Alarm triggers scaling policy
3. ASG launches new instances
4. Instances added to load balancer
5. CPU normalizes
6. Scale-in after cooldown period

**Lifecycle Hooks**:
- Perform actions during launch/terminate
- Example: Drain connections before terminating

**Use Cases**:
- Handle traffic spikes
- Cost optimization (scale down at night)
- High availability

#auto-scaling #ec2 #scalability

---

Q: What is Amazon RDS and what engines are supported?

---

A: **Relational Database Service** - Managed relational databases.

**Supported Engines**:
- **MySQL** (5.7, 8.0)
- **PostgreSQL** (11, 12, 13, 14, 15)
- **MariaDB**
- **Oracle** (Standard, Enterprise)
- **SQL Server** (Express, Web, Standard, Enterprise)
- **Amazon Aurora** (MySQL/PostgreSQL compatible)

**Features**:
- Automated backups (point-in-time recovery)
- Automated patching
- Multi-AZ for HA
- Read replicas
- Encryption at rest and in transit

**Multi-AZ Deployment**:
```
Primary DB (us-east-1a)
    ↓ Sync replication
Standby DB (us-east-1b)
```
- Automatic failover (1-2 minutes)
- No data loss

**Read Replicas**:
- Async replication
- Scale read workloads
- Can be in different region
- Up to 5 read replicas (15 for Aurora)

**Backup**:
- Automated backups (1-35 days retention)
- Manual snapshots (retained until deleted)
- Restored to new RDS instance

**vs EC2 Database**:
- RDS: Managed, less control, easier
- EC2: Full control, more management

#rds #databases #managed-services

---

Q: What is Amazon Aurora?

---

A: **MySQL/PostgreSQL-compatible** relational database built by AWS.

**Key Features**:

**Performance**:
- **5x faster** than MySQL
- **3x faster** than PostgreSQL
- Auto-scaling storage (10GB to 128TB)

**Availability**:
- 6 copies across 3 AZs
- Self-healing (bad blocks auto-replaced)
- 99.99% availability

**Aurora Replicas**:
- Up to **15 read replicas**
- < 10ms replication lag
- Auto-failover (30 seconds)

**Architecture**:
```
[Writer Instance]
    ↓
[Shared Storage Layer] (6 copies, 3 AZs)
    ↑
[Reader Instances] (up to 15)
```

**Serverless**:
- Auto-scales compute
- Pay per second
- Use for: Intermittent workloads

**Global Database**:
- Replicate across regions
- < 1 second replication lag
- Recovery from region outage

**Aurora vs RDS MySQL**:
```
Feature         | Aurora      | RDS MySQL
----------------|-------------|----------
Performance     | 5x faster   | Standard
Replicas        | 15          | 5
Storage         | Auto-scale  | Manual
Failover        | 30 seconds  | 1-2 minutes
Cost            | Higher      | Lower
```

**Use Cases**:
- Enterprise applications
- SaaS applications
- High-traffic websites

#aurora #databases #high-availability

---

Q: What is AWS Lambda?

---

A: **Serverless compute** - Run code without managing servers.

**Characteristics**:
- Event-driven
- Auto-scales (0 to 1000+ concurrent)
- Pay per invocation ($0.20/1M requests)
- Max **15 minutes** execution
- Supports: Python, Node.js, Java, Go, .NET, Ruby

**Event Sources**:
- **API Gateway**: HTTP requests
- **S3**: File upload/delete
- **DynamoDB**: Table changes
- **SQS**: Queue messages
- **EventBridge**: Scheduled or custom events

**Example**:
```python
def lambda_handler(event, context):
    # Process S3 event
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']

    print(f"File {key} uploaded to {bucket}")

    return {
        'statusCode': 200,
        'body': 'Processed successfully'
    }
```

**Configuration**:
- Memory: 128 MB to 10 GB (CPU scales with memory)
- Timeout: 1 sec to 15 minutes
- Environment variables
- VPC access (optional)

**Cold Start**:
- First invocation takes longer (load code, init)
- Subsequent invocations faster (warm)
- Provisioned Concurrency: Keep functions warm

**Use Cases**:
- REST APIs
- File processing (resize images)
- Real-time stream processing
- Automation (stop EC2 at night)

#lambda #serverless #event-driven

---

Q: What is Amazon DynamoDB?

---

A: **Serverless NoSQL database** - Key-value and document store.

**Characteristics**:
- Fully managed
- Single-digit millisecond latency
- Auto-scaling
- Global tables (multi-region replication)

**Data Model**:
```
Table: Users
├── Partition Key: user_id (required)
├── Sort Key: timestamp (optional)
└── Attributes: name, email, age, etc.
```

**Capacity Modes**:

**On-Demand**:
- Pay per request
- Auto-scales
- Use for: Unpredictable workloads

**Provisioned**:
- Specify RCU (Read) and WCU (Write)
- Cheaper for predictable workloads
- Auto-scaling available

**Indexes**:

**Global Secondary Index (GSI)**:
- Different partition key
- Query on different attributes
```
Primary: user_id
GSI: email (query by email)
```

**Local Secondary Index (LSI)**:
- Same partition key, different sort key
- Must create at table creation

**Features**:
- **Streams**: Capture changes (like database triggers)
- **TTL**: Auto-delete expired items
- **Point-in-time Recovery**: Restore to any time (35 days)
- **Global Tables**: Multi-region, active-active

**Use Cases**:
- Mobile/web session data
- Gaming leaderboards
- IoT data
- Real-time bidding

#dynamodb #nosql #serverless

---

Q: What is Amazon CloudFront?

---

A: **Content Delivery Network (CDN)** - Distribute content globally.

**How it works**:
1. User requests `www.example.com/image.jpg`
2. DNS routes to nearest edge location
3. Edge checks cache
4. If miss → fetch from origin (S3, ALB, EC2)
5. Cache at edge
6. Future requests served from cache

**Origins**:
- **S3 bucket**: Static website, files
- **Custom origin**: ALB, EC2, HTTP server
- **MediaStore/MediaPackage**: Video streaming

**Cache Behavior**:
- **TTL**: Time to live (default 24 hours)
- **Cache-Control**: Headers from origin
- **Invalidation**: Manually remove cached objects

```json
{
  "PathPattern": "/images/*",
  "TargetOriginId": "S3-my-bucket",
  "CachePolicyId": "Managed-CachingOptimized",
  "ViewerProtocolPolicy": "redirect-to-https"
}
```

**Features**:
- **Geo-restriction**: Block specific countries
- **SSL/TLS**: HTTPS support, custom certificates
- **Lambda@Edge**: Run code at edge locations
- **Origin Failover**: Backup origin if primary fails

**Use Cases**:
- Accelerate static websites
- Stream video (live or on-demand)
- API acceleration
- Software downloads

**Pricing**: Data transfer out + requests

#cloudfront #cdn #content-delivery

---
