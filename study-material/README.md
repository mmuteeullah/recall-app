# 📚 Study Material for RE-CA-LL

This folder contains pre-made flashcard collections ready to import into RE-CA-LL.

---

## 📁 **Folder Structure**

```
study-material/
├── programming/          # Software development topics
│   └── react-hooks.md   (8 cards)
├── devops/              # DevOps and system administration
│   ├── docker-basics.md (8 cards)
│   ├── linux-commands.md (8 cards)
│   ├── kubernetes-fundamentals.md (15 cards)
│   ├── kubernetes-advanced.md (14 cards)
│   └── kubernetes-production.md (15 cards)
├── cloud/               # Cloud platforms
│   ├── gcp/
│   │   ├── gcp-services.md (15 cards)
│   │   ├── gcp-architecture.md (14 cards)
│   │   ├── gcp-networking.md (14 cards)
│   │   └── gcp-storage-databases.md (14 cards)
│   └── aws/
│       └── aws-fundamentals.md (14 cards)
├── languages/           # Language learning
│   └── spanish-basics.md (20 reverse cards = 40 total)
└── general-knowledge/   # General trivia and facts
    └── world-capitals.md (10 cards)
```

---

## 🚀 **How to Import**

### Method 1: Drag & Drop
1. Open RE-CA-LL in your browser
2. Navigate to **Import** page (`/import`)
3. **Drag and drop** any `.md` file from this folder
4. Review the preview
5. Click **"Import"** button
6. Cards are now in your collection! 🎉

### Method 2: File Upload
1. Go to **Import** page
2. Click the upload area
3. Select file from `study-material/`
4. Import

---

## 📖 **Available Collections**

### 🖥️ Programming

#### react-hooks.md
**Deck**: Programming/React/Hooks
**Cards**: 8
**Topics**:
- useState, useEffect basics
- useEffect cleanup
- useMemo vs useCallback
- Custom hooks
- Hook rules
- usePrevious pattern
- useReducer

**Perfect for**: React developers learning or reviewing hooks

---

### 🐳 DevOps

#### docker-basics.md
**Deck**: DevOps/Docker/Basics
**Cards**: 8
**Topics**:
- Images vs Containers
- Port mapping
- Docker logs
- CMD vs ENTRYPOINT
- docker exec
- docker-compose
- Container cleanup
- .dockerignore

**Perfect for**: DevOps engineers, full-stack developers

---

#### linux-commands.md
**Deck**: DevOps/Linux/Commands
**Cards**: 8
**Topics**:
- find files by modification time
- chmod permissions (755, etc.)
- du (disk usage)
- Finding processes on ports
- Bash redirection (>, >>)
- tar compression/extraction
- tail -f for log monitoring
- ps aux process listing

**Perfect for**: Sysadmins, backend developers, DevOps

---

#### kubernetes-fundamentals.md
**Deck**: DevOps/Kubernetes/Fundamentals
**Cards**: 15
**Topics**:
- Pods, Deployments, StatefulSets
- Services, Namespaces, ConfigMaps, Secrets
- Ingress, Labels, Selectors, DaemonSets
- Liveness/Readiness probes
- Resource requests/limits
- PersistentVolumes and PersistentVolumeClaims

**Perfect for**: Kubernetes beginners, platform engineers

---

#### kubernetes-advanced.md
**Deck**: DevOps/Kubernetes/Advanced
**Cards**: 14
**Topics**:
- HorizontalPodAutoscaler (HPA)
- Taints and Tolerations
- NetworkPolicy, InitContainers
- ServiceAccounts and RBAC
- Jobs and CronJobs
- QoS classes, ResourceQuota
- Kubernetes DNS, kubectl apply vs create
- Admission Controllers, Helm

**Perfect for**: Production Kubernetes, advanced platform engineers

---

#### kubernetes-production.md
**Deck**: DevOps/Kubernetes/Production
**Cards**: 15
**Topics**:
- PodDisruptionBudgets, Pod Priority
- Topology Spread Constraints
- Vertical Pod Autoscaler (VPA)
- Kubernetes Operators and CRDs
- Multi-cluster federation
- Cluster Autoscaler
- Security Contexts, Pod Security Standards
- Kyverno policies, Finalizers
- kubectl debug, Kustomize, GitOps/Argo CD
- Service Mesh (Istio)

**Perfect for**: Production Kubernetes, SRE, platform architects

---

### 🌍 Languages

#### spanish-basics.md
**Deck**: Languages/Spanish/Basics
**Cards**: 20 (40 with reverse)
**Type**: Reverse cards (bidirectional)
**Topics**:
- Greetings (hola, adiós)
- Polite phrases (gracias, por favor)
- Basic conversation starters
- Numbers 1-3
- Common foods

**Perfect for**: Spanish language learners, travelers

**Note**: Uses **reverse card type**, so you'll see:
- English → Spanish
- Spanish → English

---

### 🌎 General Knowledge

#### world-capitals.md
**Deck**: General-Knowledge/Geography/Capitals
**Cards**: 10
**Topics**:
- Major world capitals
- Tricky ones marked (Canberra, Brasília, Ankara, Ottawa)

**Perfect for**: Trivia, general knowledge, geography enthusiasts

---

### ☁️ Cloud Platforms

#### GCP (Google Cloud Platform)

**gcp-services.md**
**Deck**: Cloud/GCP/Services
**Cards**: 15
**Topics**:
- Compute options (Compute Engine, App Engine, Cloud Run)
- Storage classes and options
- Cloud Functions, Databases (Cloud SQL, Spanner)
- GKE, VPC, Load Balancing, Pub/Sub
- IAM, BigQuery, Service Accounts, Cloud Armor

**Perfect for**: GCP certification, cloud engineers

**gcp-architecture.md**
**Deck**: Cloud/GCP/Architecture
**Cards**: 14
**Topics**:
- Cloud Regions (Single/Dual/Multi)
- Shared Responsibility Model
- Google Cloud Architecture Framework
- High Availability patterns, Landing Zones
- Disaster Recovery strategies
- Organization Policies, VPC Service Controls
- Pricing models, IAP, Binary Authorization

**Perfect for**: Solutions architects, cloud architects

**gcp-networking.md**
**Deck**: Cloud/GCP/Networking
**Cards**: 14
**Topics**:
- Cloud Interconnect, Cloud NAT
- Private Google Access, Cloud DNS
- Load Balancer types, Cloud CDN
- VPC Flow Logs, Firewall Rules
- Packet Mirroring, Private Service Connect
- Network Intelligence Center, Cloud Armor
- Cloud Router, BGP, Serverless VPC Access

**Perfect for**: Network engineers, cloud networking specialists

**gcp-storage-databases.md**
**Deck**: Cloud/GCP/Storage-Databases
**Cards**: 14
**Topics**:
- Persistent Disk types
- Cloud Storage lifecycle management
- Filestore, Memorystore (Redis/Memcached)
- Cloud Bigtable, Firestore
- Cloud SQL HA and read replicas
- BigQuery partitioning, slots, BI Engine
- AlloyDB, object versioning, TrueTime
- Signed URLs, streaming inserts

**Perfect for**: Database engineers, data engineers

---

#### AWS (Amazon Web Services)

**aws-fundamentals.md**
**Deck**: Cloud/AWS/Fundamentals
**Cards**: 14
**Topics**:
- Compute services (EC2, Lambda, ECS, EKS)
- EC2 instance types
- S3 storage classes
- Regions and Availability Zones
- Security Groups vs NACLs
- IAM (Users, Groups, Roles, Policies)
- VPC networking, EBS volume types
- Elastic Load Balancers, Auto Scaling
- RDS, Aurora, DynamoDB, CloudFront

**Perfect for**: AWS certification, cloud beginners

---

## ✏️ **Creating Your Own**

### Quick Template

```markdown
# Deck Name: Category/Subcategory/Topic

## Tags: tag1, tag2, tag3
## Type: basic

---

Q: Your question here?

---

A: Your answer here.

#inline-tag

---
```

### Tips
1. **Use clear categories**: `Programming/JavaScript/ES6`
2. **Tag strategically**: Mix broad (`javascript`) and specific (`closures`)
3. **Keep answers concise**: 2-3 sentences max
4. **Use code blocks**: Triple backticks for code
5. **Add context**: Why something is important
6. **Use reverse type**: For vocabulary, definitions

---

## 📋 **Full Format Reference**

See **CARD_TEMPLATE.md** in project root for comprehensive examples of:
- Basic cards
- Reverse cards (bidirectional)
- Code blocks
- Tables
- Lists
- Multiple decks in one file
- Best practices

---

## 🎯 **Recommended Study Workflow**

1. **Import a deck** (start small - 10-20 cards)
2. **Study daily** (15-20 minutes)
3. **Let the algorithm work** (it will show cards when optimal)
4. **Add custom cards** as you learn
5. **Tag generously** for easy filtering later

---

## 💡 **Ideas for New Collections**

Feel free to add more `.md` files! Ideas:

### Programming
- `javascript-fundamentals.md`
- `typescript-types.md`
- `python-basics.md`
- `sql-queries.md`
- `git-commands.md`
- `algorithms-data-structures.md`

### DevOps
- `kubernetes-basics.md`
- `nginx-configuration.md`
- `bash-scripting.md`
- `ci-cd-concepts.md`

### Languages
- `french-basics.md`
- `german-basics.md`
- `japanese-hiragana.md`

### General Knowledge
- `us-presidents.md`
- `periodic-table.md`
- `world-history.md`
- `astronomy-basics.md`

### Professional
- `system-design-concepts.md`
- `behavioral-interview-questions.md`
- `networking-basics.md`
- `security-concepts.md`

---

## 📊 **Collection Stats**

| Category | Collection | Cards | Est. Study Time |
|----------|------------|-------|-----------------|
| **Programming** | react-hooks.md | 8 | 5-10 min |
| **DevOps** | docker-basics.md | 8 | 5-10 min |
| | linux-commands.md | 8 | 5-10 min |
| | kubernetes-fundamentals.md | 15 | 10-15 min |
| | kubernetes-advanced.md | 14 | 10-15 min |
| | kubernetes-production.md | 15 | 10-15 min |
| **Cloud/GCP** | gcp-services.md | 15 | 10-15 min |
| | gcp-architecture.md | 14 | 10-15 min |
| | gcp-networking.md | 14 | 10-15 min |
| | gcp-storage-databases.md | 14 | 10-15 min |
| **Cloud/AWS** | aws-fundamentals.md | 14 | 10-15 min |
| **Languages** | spanish-basics.md | 20 (40) | 10-15 min |
| **General** | world-capitals.md | 10 | 5 min |
| | | | |
| **TOTAL** | **13 files** | **169 (189)** | **2-3 hours** |

**Note**: Kubernetes + Cloud materials add 125+ new cards for DevOps/Cloud professionals!

---

## 🎓 **Study Tips**

1. **Don't cram**: Import 1-2 decks at a time
2. **Daily consistency** > Long sessions
3. **Use the ratings honestly**:
   - **Again (1)**: Didn't know it at all
   - **Hard (2)**: Struggled to remember
   - **Good (3)**: Got it right with some thought
   - **Easy (4)**: Immediately knew it
4. **Suspend difficult cards** temporarily if overwhelmed
5. **Add your own context** by editing cards
6. **Create custom decks** for specific goals

---

## 🔄 **Updates**

**Latest (Current Session)**:
- ✅ Kubernetes comprehensive coverage (Fundamentals, Advanced, Production)
- ✅ GCP complete study materials (Services, Architecture, Networking, Storage/Databases)
- ✅ AWS Fundamentals

**Coming Soon**:
- [ ] More AWS topics (Serverless, Security, Advanced Networking)
- [ ] Azure fundamentals and services
- [ ] System design patterns
- [ ] Interview preparation decks
- [ ] More programming languages (Python, Go, TypeScript)
- [ ] Professional certification materials (CKA, AWS SAA, GCP ACE)

---

**Happy Learning!** 🚀

For markdown format help, see: `../CARD_TEMPLATE.md`
