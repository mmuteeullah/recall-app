# Deck Name: Cloud/GCP/Networking

## Tags: gcp, google-cloud, networking, vpc, connectivity
## Type: basic

---

Q: What are the different Cloud Interconnect options?

---

A:

**Dedicated Interconnect**:
- **Physical** connection to Google
- 10 or 100 Gbps per link
- Directly into Google's network (not internet)
- 99.9% or 99.99% SLA
- Use for: High bandwidth, low latency, predictable performance

**Partner Interconnect**:
- Through **service provider**
- 50 Mbps to 50 Gbps
- Easier setup than Dedicated
- Good for locations without Google PoP
- Use for: Moderate bandwidth needs

**Comparison**:
```
Feature           | Dedicated    | Partner
------------------|--------------|-------------
Bandwidth         | 10/100 Gbps  | 50 Mbps - 50 Gbps
Physical setup    | Direct       | Via provider
Google PoP nearby | Required     | Not required
Setup time        | Weeks        | Days
Cost              | Higher       | Lower
```

**Requirements**:
- VLAN attachments (VLANs on top of interconnect)
- BGP sessions for route exchange
- Cloud Router

#cloud-interconnect #networking #hybrid

---

Q: What is Cloud NAT?

---

A: **Managed NAT** service for outbound internet access without public IPs.

**Why needed**: Private VMs need to:
- Download packages (apt, yum)
- Access external APIs
- But don't need inbound public access

```bash
# Create Cloud NAT
gcloud compute routers nats create my-nat \
  --router=my-router \
  --region=us-central1 \
  --nat-all-subnet-ip-ranges \
  --auto-allocate-nat-external-ips
```

**Benefits**:
- ✅ VMs stay private (no public IPs)
- ✅ Reduced security risk
- ✅ Managed by Google (HA built-in)
- ✅ Regional (survives zone failures)

**NAT IP Allocation**:
- **Automatic**: Google assigns IPs
- **Manual**: You specify IPs (for IP whitelisting)

**Use Cases**:
- Private GKE nodes accessing container registries
- Backend VMs downloading updates
- Egress traffic from private subnets

**Pricing**: Per NAT gateway hour + data processed

#cloud-nat #networking #security

---

Q: What is Private Google Access?

---

A: Allows VMs **without public IPs** to access Google services (GCS, BigQuery, etc.).

**Without Private Google Access**:
```
Private VM → ✖ Cannot reach storage.googleapis.com
```

**With Private Google Access**:
```
Private VM → Google API (199.36.153.8/30) → Cloud Storage ✅
```

**Enable per subnet**:
```bash
gcloud compute networks subnets update my-subnet \
  --region=us-central1 \
  --enable-private-ip-google-access
```

**What it enables**:
- Access to Google APIs (storage, BigQuery, Pub/Sub)
- Access to Cloud SQL, Filestore (via Private Services Access)
- No internet access (use Cloud NAT for that)

**Private Service Connect** (Newer):
- More control (specific services)
- Custom DNS names
- Works across VPC peering

**Use Cases**:
- Data pipelines (VMs → BigQuery)
- Private GKE clusters
- Secure architectures (no public IPs)

#private-google-access #networking #security

---

Q: What is Cloud DNS and what are the zone types?

---

A: **Managed DNS** service with global anycast.

**Zone Types**:

**1. Public Zone**:
- Internet-accessible
- Resolves public domain names
```bash
gcloud dns managed-zones create my-zone \
  --dns-name="example.com." \
  --description="Public zone"
```

**2. Private Zone**:
- Only accessible from VPCs
- Internal DNS names
```bash
gcloud dns managed-zones create my-private-zone \
  --dns-name="internal.example.com." \
  --visibility=private \
  --networks=my-vpc
```

**3. Forwarding Zone**:
- Forwards queries to another DNS server
- Use for: Hybrid (on-prem DNS)
```bash
gcloud dns managed-zones create hybrid-zone \
  --dns-name="onprem.example.com." \
  --visibility=private \
  --networks=my-vpc \
  --forwarding-targets=10.0.0.5  # On-prem DNS
```

**4. Peering Zone**:
- Access another VPC's DNS
- Cross-VPC name resolution

**Features**:
- 100% SLA
- DNSSEC support
- Automatic split-horizon (public/private same name)

#cloud-dns #networking #dns

---

Q: What are the different Load Balancer types and when to use each?

---

A:

**Global Load Balancers** (Anycast IP):

**1. HTTP(S) Load Balancer** ⭐ Most common
- Layer 7 (application)
- URL/host-based routing
- SSL termination, CDN integration
- Use for: Web apps, REST APIs

**2. SSL Proxy**:
- Layer 4, SSL traffic
- Non-HTTP SSL
- Use for: Encrypted TCP

**3. TCP Proxy**:
- Layer 4, TCP
- Use for: Non-SSL TCP

**Regional Load Balancers**:

**4. Network Load Balancer**:
- Layer 4, pass-through
- Preserves client IP
- Ultra-low latency
- Use for: Gaming, IoT, UDP

**5. Internal Load Balancer**:
- Private load balancing (RFC 1918)
- Between VMs in VPC
- Use for: Multi-tier (frontend → backend)

**6. Internal HTTP(S) Load Balancer**:
- Private Layer 7
- Use for: Internal microservices

**Decision Tree**:
```
Global or Regional?
  └─ Global → HTTP/HTTPS traffic? → Yes → HTTP(S) LB
           └─ No → TCP → SSL? → Yes → SSL Proxy
                              └─ No → TCP Proxy

  └─ Regional → Internal? → Yes → HTTP? → Yes → Internal HTTP(S)
                                        └─ No → Internal LB
             └─ External → Network LB
```

#load-balancing #networking #scalability

---

Q: What is Cloud CDN?

---

A: **Content Delivery Network** integrated with Cloud Load Balancing.

**How it works**:
1. User requests content
2. CDN edge location serves cached content
3. If miss → origin (backend)
4. Cache at edge for future requests

```bash
# Enable CDN for backend bucket
gcloud compute backend-buckets create my-backend-bucket \
  --gcs-bucket-name=my-static-bucket \
  --enable-cdn

# Enable CDN for backend service
gcloud compute backend-services update my-backend \
  --enable-cdn \
  --cache-mode=CACHE_ALL_STATIC
```

**Cache Modes**:
- **CACHE_ALL_STATIC**: Cache based on file extension
- **USE_ORIGIN_HEADERS**: Respect Cache-Control headers
- **FORCE_CACHE_ALL**: Cache everything (use with care)

**Cache Key**:
```
https://example.com/image.jpg?v=123
         ↓
[Host] + [Path] + [Query String] = Cache Key
```

**Invalidation**:
```bash
# Invalidate specific path
gcloud compute url-maps invalidate-cdn-cache my-map \
  --path="/images/*"
```

**Use Cases**:
- Static websites
- Images, videos, downloads
- API responses (with Cache-Control)

**Pricing**: Cache egress (cheaper than origin egress) + cache fill

#cdn #caching #performance

---

Q: What is VPC Flow Logs?

---

A: **Network traffic logs** for VPC subnets.

**Captures**:
- Source/destination IPs and ports
- Protocol
- Bytes/packets sent
- Action (allowed/denied)

**Enable per subnet**:
```bash
gcloud compute networks subnets update my-subnet \
  --region=us-central1 \
  --enable-flow-logs \
  --logging-aggregation-interval=interval-5-sec \
  --logging-flow-sampling=0.5  # 50% sampling
```

**Sample Log**:
```json
{
  "src_ip": "10.0.1.5",
  "dest_ip": "8.8.8.8",
  "src_port": 54321,
  "dest_port": 53,
  "protocol": "UDP",
  "bytes_sent": 512,
  "packets_sent": 4,
  "start_time": "2023-01-01T12:00:00Z",
  "end_time": "2023-01-01T12:00:05Z"
}
```

**Use Cases**:
- **Network troubleshooting**: Why can't service A reach service B?
- **Security analysis**: Detect port scanning, DDoS
- **Compliance**: Audit network access
- **Cost optimization**: Identify high-traffic sources

**Integration**:
- Stored in Cloud Logging
- Export to BigQuery for analysis
- Visualize in Cloud Monitoring

**Cost**: $0.50 per GB of logs (sampling reduces cost)

#vpc-flow-logs #networking #monitoring

---

Q: What are Firewall Rules in GCP?

---

A: **Stateful** firewall applied to VPC (not individual VMs).

**Rule Components**:
- **Direction**: Ingress (inbound) or Egress (outbound)
- **Action**: Allow or Deny
- **Target**: All instances, tags, or service accounts
- **Source/Destination**: IP ranges, tags, service accounts
- **Protocol/Port**: TCP:80, UDP:53, ICMP, etc.

```bash
# Allow HTTP from anywhere
gcloud compute firewall-rules create allow-http \
  --network=my-vpc \
  --action=allow \
  --direction=ingress \
  --source-ranges=0.0.0.0/0 \
  --rules=tcp:80 \
  --target-tags=web-server

# Deny SSH from specific IP
gcloud compute firewall-rules create deny-ssh-from-ip \
  --network=my-vpc \
  --action=deny \
  --priority=100 \
  --direction=ingress \
  --source-ranges=203.0.113.0/24 \
  --rules=tcp:22
```

**Priority**:
- Lower number = higher priority
- Default: 1000
- Deny rules should have higher priority (lower number)

**Implied Rules**:
- **Egress**: Allow all (65535 priority)
- **Ingress**: Deny all (65535 priority)

**Best Practices**:
- Use service accounts (not tags) for production
- Deny rules with lower priority number
- Document rules with descriptions

#firewall #networking #security

---

Q: What is Packet Mirroring?

---

A: **Clone network traffic** for analysis without affecting production.

**Use Cases**:
- Security analysis (IDS/IPS)
- Network troubleshooting
- Compliance monitoring
- Forensics

```bash
# Create packet mirroring policy
gcloud compute packet-mirrorings create my-mirror \
  --region=us-central1 \
  --network=my-vpc \
  --mirrored-subnets=my-subnet \
  --collector-ilb=my-ilb \
  --filter-protocols=tcp
```

**Architecture**:
```
[Source VMs] → [Mirror] → [Internal LB] → [Collector VMs]
                                              ↓
                                        [IDS/Analysis]
```

**Configuration**:
- **Source**: Subnets, instances, or tags
- **Collector**: Internal Load Balancer
- **Filter**: Protocol, CIDR ranges

**Collector Tools**:
- Wireshark
- Suricata (IDS)
- Zeek (network analysis)

**Cost**: Mirror traffic counts as egress + collector VM costs

**Note**: Does NOT impact source VM performance

#packet-mirroring #security #monitoring

---

Q: What is Private Service Connect?

---

A: **Private connectivity** to Google services and third-party services using internal IPs.

**Types**:

**1. Private Service Connect for Google APIs**:
- Access Google services via private endpoint
- Replaces Private Google Access
```bash
gcloud compute addresses create psc-endpoint \
  --global \
  --purpose=PRIVATE_SERVICE_CONNECT \
  --addresses=10.1.0.5 \
  --network=my-vpc

gcloud compute forwarding-rules create psc-rule \
  --global \
  --network=my-vpc \
  --address=psc-endpoint \
  --target-google-apis-bundle=all-apis
```

**2. Private Service Connect for Published Services**:
- Consume third-party services (Confluent, MongoDB Atlas)
- Or publish your own service

**Benefits**:
- ✅ No internet gateway needed
- ✅ No VPC peering (simplified connectivity)
- ✅ Custom IP addresses
- ✅ Works across projects/organizations

**vs Private Google Access**:
- PSC: More control, specific endpoints, newer
- PGA: Simpler, legacy approach

**Use Cases**:
- Private GKE → Google APIs
- SaaS integration (private connectivity)
- Service mesh across organizations

#private-service-connect #networking #security

---

Q: What is Network Intelligence Center?

---

A: **Network monitoring and troubleshooting** suite.

**Modules**:

**1. Connectivity Tests**:
- Test reachability between endpoints
- Shows packet path and potential issues
```bash
gcloud network-management connectivity-tests create my-test \
  --source-instance=vm1 \
  --destination-ip-address=10.0.2.5 \
  --protocol=tcp \
  --destination-port=80
```
Returns: Reachable / Unreachable + reason

**2. Performance Dashboard**:
- Packet loss, latency, throughput
- By zone, region, network

**3. Topology Visualization**:
- Visual map of VPC, subnets, VMs
- See interconnections

**4. Firewall Insights**:
- **Shadowed rules**: Rules that never match (covered by earlier rule)
- **Overly permissive**: Rules allowing too much
- **Unused rules**: No hits in 6 weeks
```
Priority 100: Allow 0.0.0.0/0 → port 22
Priority 200: Allow 10.0.0.0/8 → port 22  ← SHADOWED
```

**Use Cases**:
- Why can't service A reach B?
- Optimize firewall rules
- Plan network changes

#network-intelligence #troubleshooting #optimization

---

Q: What is Cloud Armor Adaptive Protection?

---

A: **ML-based DDoS protection** that learns your traffic patterns.

**How it works**:
1. **Learning phase**: Baseline normal traffic (1 week)
2. **Detection**: ML model detects anomalies
3. **Alert**: Notifies you of potential attack
4. **Mitigation**: Suggests rate-limiting rules

```bash
# Enable Adaptive Protection
gcloud compute security-policies update my-policy \
  --enable-layer7-ddos-defense \
  --layer7-ddos-defense-rule-visibility=STANDARD
```

**Detects**:
- Volumetric attacks (traffic spike)
- Slow HTTP attacks (Slowloris)
- Application-layer attacks

**Response Options**:
- **Alert-only**: Logs potential attacks
- **Auto-deploy rules**: Automatically rate-limit
- **Preview mode**: Test rules before enforcement

**Example Alert**:
```
Detected: 10x traffic spike from AS12345
Source IPs: 203.0.113.0/24
Suggested rule: Rate limit to 100 req/min
```

**vs Standard Cloud Armor**:
- Standard: Static rules (block specific IPs)
- Adaptive: ML-based, learns normal patterns

**Use Cases**:
- E-commerce sites (DDoS protection)
- Public APIs
- Gaming platforms

#cloud-armor #ddos #security

---

Q: What is Cloud Router and BGP?

---

A: **Dynamic routing** for VPC using BGP protocol.

**Cloud Router**:
- Manages BGP sessions
- Exchanges routes with on-premises/other networks
- Regional resource

**BGP (Border Gateway Protocol)**:
- Dynamic route exchange
- Alternative to static routes

```bash
# Create Cloud Router
gcloud compute routers create my-router \
  --region=us-central1 \
  --network=my-vpc \
  --asn=65001  # Your AS number

# Add BGP peer (for Cloud VPN)
gcloud compute routers add-bgp-peer my-router \
  --peer-name=on-prem-peer \
  --peer-asn=65002 \
  --interface=vpn-interface \
  --peer-ip-address=169.254.1.1 \
  --region=us-central1
```

**Use Cases**:
- **Cloud VPN**: Automatic route updates
- **Cloud Interconnect**: Exchange routes with on-prem
- **Multi-region VPC**: Route between regions

**Route Advertisement**:
- **Default**: Advertise all subnet routes
- **Custom**: Advertise specific ranges

**Benefits**:
- ✅ No manual route updates
- ✅ Automatic failover
- ✅ Supports multiple paths (ECMP)

**vs Static Routes**:
- Static: Manual, doesn't adapt to changes
- BGP: Dynamic, auto-updates on topology changes

#cloud-router #bgp #networking

---

Q: What are Serverless VPC Access and VPC Connectors?

---

A: Allows **serverless services** (Cloud Run, Cloud Functions) to access VPC resources.

**Why needed**: Serverless runs outside VPC by default

**Without VPC Connector**:
```
Cloud Run → ✖ Cannot reach VM at 10.0.1.5
```

**With VPC Connector**:
```
Cloud Run → [VPC Connector] → VPC → VM ✅
```

**Create Connector**:
```bash
gcloud compute networks vpc-access connectors create my-connector \
  --region=us-central1 \
  --network=my-vpc \
  --range=10.8.0.0/28  # Small /28 range for connector
  --min-instances=2 \
  --max-instances=10
```

**Use in Cloud Run**:
```bash
gcloud run deploy my-service \
  --image=gcr.io/project/image \
  --vpc-connector=my-connector \
  --vpc-egress=private-ranges-only  # or all-traffic
```

**Egress Settings**:
- **private-ranges-only**: Only RFC 1918 via connector (internet direct)
- **all-traffic**: All traffic via connector (can use Cloud NAT)

**Use Cases**:
- Cloud Run → Cloud SQL (private IP)
- Cloud Functions → Memorystore (Redis)
- Serverless → Internal APIs

**Cost**: Connector instances (e2-micro equivalent) + data processed

#serverless #vpc-connector #networking

---

Q: What is SSL/TLS Termination at Load Balancer?

---

A: **Decrypt HTTPS** at load balancer, forward HTTP to backends.

**Architecture**:
```
Client → HTTPS → [Load Balancer] → HTTP → Backend VMs
                     ↓
               [SSL Certificate]
```

**Benefits**:
- ✅ Offload SSL from backend VMs
- ✅ Centralized cert management
- ✅ Faster backend processing (no decryption)

**Setup**:
```bash
# Upload certificate
gcloud compute ssl-certificates create my-cert \
  --certificate=cert.pem \
  --private-key=key.pem

# Or use Google-managed cert
gcloud compute ssl-certificates create my-cert \
  --domains=example.com,www.example.com \
  --global

# Attach to HTTPS proxy
gcloud compute target-https-proxies create my-proxy \
  --ssl-certificates=my-cert \
  --url-map=my-url-map
```

**Certificate Types**:
- **Self-managed**: You upload cert
- **Google-managed**: Free, auto-renewed (Let's Encrypt)

**End-to-End SSL** (Alternative):
```
Client → HTTPS → [LB] → HTTPS → Backend
```
More secure, but higher compute cost

**Use Cases**:
- Public websites (HTTPS)
- API gateways
- Comply with HTTPS requirement

#ssl #load-balancing #security

---
