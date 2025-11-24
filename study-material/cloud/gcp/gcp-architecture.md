# Deck Name: Cloud/GCP/Architecture

## Tags: gcp, google-cloud, architecture, best-practices
## Type: basic

---

Q: What are the three types of Cloud Regions in GCP?

---

A:

**1. Single Region**: One geographic location
- Lower latency within region
- Lower cost
- Example: us-central1 (Iowa)

**2. Dual Region**: Two specific regions
- Synchronous replication between regions
- Higher availability (99.95%)
- Example: nam4 (Iowa + South Carolina)

**3. Multi-Region**: Large geographic area with 3+ regions
- Geo-redundant storage
- Highest availability (99.95%+)
- Example: US (multiple US regions), EU, ASIA

**Choosing**:
- Critical + global → Multi-region
- Critical + regional → Dual region
- Non-critical → Single region

#regions #availability #architecture

---

Q: What is the shared responsibility model in GCP?

---

A:

**Google Manages**:
- Physical security (data centers)
- Hardware infrastructure
- Network infrastructure
- Hypervisor layer
- Storage encryption at rest

**Customer Manages**:
- Access control (IAM)
- Data classification
- Application security
- Identity management
- Network configuration

**Shared**:
- Encryption (Google provides, customer configures)
- Patch management (OS on Compute Engine)
- Network controls (Google provides firewall, customer configures)

**Key Principle**: As you move up the stack (IaaS → PaaS → SaaS), Google takes more responsibility.

#security #shared-responsibility #compliance

---

Q: What are the five pillars of the Google Cloud Architecture Framework?

---

A:

**1. Operational Excellence**:
- Monitoring, logging, alerting
- Incident response
- Change management

**2. Security, Privacy, and Compliance**:
- Identity and access management
- Data protection
- Compliance standards

**3. Reliability**:
- High availability
- Disaster recovery
- Fault tolerance

**4. Cost Optimization**:
- Right-sizing resources
- Committed use discounts
- Budget alerts

**5. Performance Efficiency**:
- Resource selection
- Scaling strategies
- Network optimization

Similar to AWS Well-Architected Framework and Azure Well-Architected Framework.

#architecture-framework #best-practices

---

Q: What is the difference between Zonal, Regional, and Global resources?

---

A:

**Zonal Resources** (Lowest availability):
- Exist in single zone
- Examples: VM instances, zonal persistent disks
- Failure: Zone outage = resource unavailable
- Use for: Non-critical workloads

**Regional Resources** (Higher availability):
- Replicated across zones in region
- Examples: Regional persistent disks, Cloud SQL
- Failure: Survives zone outage
- Use for: Production workloads

**Global Resources** (Highest availability):
- Span all regions
- Examples: VPC, Load Balancers, Cloud Storage
- Failure: Survives regional outages
- Use for: Critical, geo-distributed services

**Architecture tip**: Use regional/global resources for production to avoid single zone failures.

#availability #regions #zones

---

Q: How do you design a highly available architecture in GCP?

---

A:

**1. Eliminate Single Points of Failure**:
- Use regional/multi-regional resources
- Deploy across multiple zones
- Use managed services (auto HA)

**2. Load Balancing**:
- Global HTTP(S) Load Balancer for multi-region
- Health checks to detect failures
- Auto-draining for maintenance

**3. Data Replication**:
- Regional persistent disks (2 zones)
- Cloud SQL HA configuration
- Cloud Spanner multi-region

**4. Auto-scaling**:
- Instance groups with auto-scaling
- GKE Autopilot
- Cloud Run (scales to zero)

**5. Disaster Recovery**:
- Regular backups
- Test failover procedures
- RPO/RTO defined

**Target**: 99.95%+ uptime (4.4 hours/year downtime)

#high-availability #architecture #reliability

---

Q: What is a Landing Zone in GCP?

---

A: **Pre-configured, secure foundation** for deploying workloads.

**Components**:

**1. Organization Structure**:
```
Organization
└── Folders (Prod, Dev, Shared)
    └── Projects (per team/app)
```

**2. Identity & Access**:
- Google Workspace or Cloud Identity
- IAM hierarchy and groups
- Service accounts

**3. Networking**:
- Shared VPC (hub-and-spoke)
- Hybrid connectivity (Cloud Interconnect/VPN)
- Firewall rules

**4. Security**:
- Organization policies
- VPC Service Controls
- Audit logging

**5. Monitoring**:
- Cloud Monitoring workspaces
- Log aggregation
- Alerting

**Tools**: Terraform, Deployment Manager, or Google's Cloud Foundation Toolkit

#landing-zone #enterprise #architecture

---

Q: What are the different GCP connectivity options for on-premises?

---

A:

**1. Cloud VPN** (IPsec):
- Encrypted tunnel over public internet
- Up to 3 Gbps per tunnel
- $0.05/hour + egress
- Use for: Development, low bandwidth, cost-sensitive

**2. Cloud Interconnect - Dedicated**:
- Physical connection (10 or 100 Gbps)
- Private, not over internet
- Lower latency, higher bandwidth
- Use for: Production, high bandwidth, low latency

**3. Cloud Interconnect - Partner**:
- Through service provider
- 50 Mbps to 10 Gbps
- Easier setup than Dedicated
- Use for: Mid-range bandwidth needs

**4. Direct Peering** (Deprecated for new customers):
- Direct connection to Google network
- For heavy Google Workspace/YouTube users

**Comparison**:
- Bandwidth: VPN < Partner < Dedicated
- Cost: VPN < Partner < Dedicated
- Security: All secure (VPN uses encryption)

#networking #hybrid-cloud #connectivity

---

Q: What is the Hub-and-Spoke network topology in GCP?

---

A:

**Architecture**:
```
         [Shared VPC - Hub]
         (Firewall, DNS, etc.)
        /        |        \
    [Spoke]  [Spoke]  [Spoke]
    (Prod)   (Dev)    (Test)
```

**Implementation**:
- **Hub**: Shared VPC in host project
  - Common services (DNS, NAT, proxies)
  - Hybrid connectivity (VPN/Interconnect)
  - Centralized firewall

- **Spokes**: Service projects
  - Attach to Shared VPC subnets
  - Isolated workloads
  - Limited inter-spoke communication

**Benefits**:
- Centralized network management
- Cost optimization (single NAT gateway)
- Better security (centralized controls)
- Simplified hybrid connectivity

**Alternative**: VPC peering (more distributed, no transitive routing)

#networking #shared-vpc #topology

---

Q: How do you implement disaster recovery in GCP?

---

A:

**Key Metrics**:
- **RPO** (Recovery Point Objective): Max data loss time
- **RTO** (Recovery Time Objective): Max downtime

**Strategies** (cost/complexity increasing):

**1. Backup & Restore** (RPO: hours, RTO: hours):
- Snapshots of persistent disks
- Cloud Storage backups
- Lowest cost, highest RTO

**2. Pilot Light** (RPO: minutes, RTO: 10+ min):
- Core services always running in DR region
- Scale up during disaster
- Moderate cost

**3. Warm Standby** (RPO: seconds, RTO: minutes):
- Scaled-down version running
- Data replication active
- Quickly scale to full capacity

**4. Hot Standby / Multi-Region Active-Active** (RPO: real-time, RTO: seconds):
- Full capacity in multiple regions
- Global load balancing
- Highest cost, lowest RTO

**GCP Tools**:
- Cloud Spanner (multi-region)
- Cloud SQL (cross-region replicas)
- Cloud Storage (multi-region buckets)

#disaster-recovery #availability #resilience

---

Q: What are Organization Policies in GCP?

---

A: **Centralized constraints** applied across organization/folders/projects.

**Common Policies**:

**1. Resource Location Restriction**:
```yaml
constraints/gcp.resourceLocations
# Enforce: Only use europe-west1, europe-west2
```

**2. Disable Service Account Key Creation**:
```yaml
constraints/iam.disableServiceAccountKeyCreation
# Prevent manual key downloads
```

**3. VM External IP**:
```yaml
constraints/compute.vmExternalIpAccess
# Deny: No public IPs on VMs
```

**4. Allowed Services**:
```yaml
constraints/serviceuser.services
# Only allow: compute, storage, bigquery APIs
```

**Hierarchy** (Inheritance):
```
Organization (most restrictive)
└── Folder (can inherit or add)
    └── Project (inherits all above)
```

**Use Cases**:
- Compliance (data residency)
- Security (no public IPs)
- Cost control (restrict expensive services)

#organization-policies #governance #compliance

---

Q: What is VPC Service Controls?

---

A: **Security perimeter** to prevent data exfiltration from GCP services.

**How it works**:
1. Create **service perimeter** around projects
2. Define **allowed services** (BigQuery, Storage, etc.)
3. Define **access levels** (IP ranges, identity)
4. **Block** data movement outside perimeter

```
┌─────────────────────────────┐
│   Service Perimeter         │
│  ┌──────┐  ┌──────┐        │
│  │BigQuery│ │Storage│       │ ✅ Can communicate
│  └──────┘  └──────┘        │
│  ┌──────┐                   │
│  │Compute│                  │
│  └──────┘                   │
└─────────────────────────────┘
         │
         ✖ Blocked
         ↓
   [External Bucket]
```

**Protected Services**:
- BigQuery, Cloud Storage
- Cloud SQL, Bigtable
- Cloud KMS

**Use Cases**:
- Prevent accidental data copying to personal projects
- Compliance (HIPAA, PCI-DSS)
- Data sovereignty

**Requires**: Access Context Manager

#security #data-protection #vpc-service-controls

---

Q: What are the different pricing models in GCP?

---

A:

**1. On-Demand**:
- Pay per second (no minimum)
- Most expensive
- Use for: Unpredictable workloads

**2. Committed Use Discounts (CUDs)**:
- 1 or 3 year commitment
- 25-70% discount
- For: Compute Engine, GKE nodes
- Flexible (can change machine types)

**3. Sustained Use Discounts**:
- Automatic discount for long-running VMs
- Up to 30% off
- No commitment needed

**4. Preemptible VMs**:
- Up to 80% discount
- Can be terminated anytime (24h max)
- Use for: Batch jobs, fault-tolerant workloads

**5. Spot VMs** (New):
- Like Preemptible, but no 24h limit
- Dynamic pricing
- Use for: Same as Preemptible

**Cost Optimization**:
- Right-size VMs (use recommender)
- Use committed use for steady-state
- Use preemptible/spot for batch

#pricing #cost-optimization #discounts

---

Q: What is Identity-Aware Proxy (IAP)?

---

A: **Application-level access control** without VPN.

**How it works**:
```
User → [IAP] → (Verify identity) → App
              ↓
         [IAM Check]
```

**Benefits**:
1. **No VPN needed**: Access apps via public internet
2. **Centralized access**: IAM policies control who can access
3. **Context-aware**: Can add device policies
4. **Zero Trust**: Verify every request

**Example**:
```bash
# Grant access to app
gcloud iap web add-iam-policy-binding \
  --member='user:alice@example.com' \
  --role='roles/iap.httpsResourceAccessor'
```

**Protected Resources**:
- App Engine apps
- Compute Engine backends
- GKE services
- Cloud Run services

**Use Cases**:
- Internal admin dashboards
- Dev/staging environments
- Remote employee access

**Security**: Works with BeyondCorp Zero Trust model

#security #identity #zero-trust #iap

---

Q: What are the different data migration strategies to GCP?

---

A:

**1. Online Transfer** (Active data, < 1TB):
- **gsutil**: Command-line tool
- **Storage Transfer Service**: Scheduled transfers from AWS S3, HTTP/HTTPS
- Use for: Small datasets, ongoing sync

**2. Offline Transfer** (Large data, > 20TB):
- **Transfer Appliance**: Physical device shipped to you
- 100TB or 480TB capacity
- Ship back to Google for upload
- Use for: Massive datasets, slow network

**3. Database Migration**:
- **Database Migration Service**: Online migration with minimal downtime
- Supports: MySQL, PostgreSQL, SQL Server → Cloud SQL
- Continuous replication, then cutover

**4. VM Migration**:
- **Migrate for Compute Engine**: Lift-and-shift VMs
- From: AWS, Azure, on-prem (VMware)
- Minimal downtime

**5. BigQuery Transfer**:
- **BigQuery Data Transfer Service**
- From: AWS S3, Teradata, Amazon Redshift
- Scheduled or one-time

**Choosing**:
- < 1TB, good network → Online
- > 20TB, slow network → Transfer Appliance
- Database → Database Migration Service

#migration #data-transfer #hybrid-cloud

---

Q: What is Binary Authorization?

---

A: **Deploy-time security** that ensures only **trusted container images** run on GKE.

**How it works**:
1. **Build**: Container image built
2. **Sign**: Image signed by trusted authority (CI/CD)
3. **Deploy**: GKE checks signature
4. **Enforce**: Only signed images allowed

```
[CI/CD Pipeline]
      ↓
   [Sign Image]
      ↓
  [Push to GCR]
      ↓
[Deploy to GKE] → [Binary Authorization] → ✅/✖
                         ↓
                  [Check signature]
```

**Policy Example**:
```yaml
admissionWhitelistPatterns:
- namePattern: gcr.io/my-project/*
requireAttestations:
- attestationAuthorityName: projects/my-project/attestors/prod-attestor
```

**Benefits**:
- Prevent untested images
- Enforce CI/CD pipeline
- Compliance (SLSA framework)

**Use Cases**:
- Production GKE clusters
- Regulated industries
- Supply chain security

#security #containers #gke #binary-authorization

---
