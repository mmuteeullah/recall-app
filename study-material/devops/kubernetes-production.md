# Deck Name: DevOps/Kubernetes/Production

## Tags: kubernetes, k8s, production, operations, best-practices
## Type: basic

---

Q: What is a PodDisruptionBudget (PDB) and why use it?

---

A: Limits **voluntary disruptions** during maintenance/updates.

**Purpose**: Ensure minimum availability during:
- Node drains
- Cluster upgrades
- Autoscaler scale-downs

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: app-pdb
spec:
  minAvailable: 2  # At least 2 pods must be available
  # OR
  maxUnavailable: 1  # At most 1 pod can be down
  selector:
    matchLabels:
      app: api
```

**Example Scenario**:
- Deployment with 3 replicas
- PDB: minAvailable=2
- Node drain: Only 1 pod evicted at a time
- Ensures 2 pods always running

**Best Practice**: Always set PDB for production deployments

#pdb #availability #production

---

Q: What are Pod Priority and Preemption?

---

A: Mechanism to **prioritize critical pods** during resource shortages.

**How it works**:
1. Assign priority to pods
2. When resources scarce, evict lower-priority pods
3. Schedule higher-priority pods

```yaml
# Create PriorityClass
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 1000000  # Higher = more important
globalDefault: false
description: "Critical production workloads"

---
# Use in Pod
spec:
  priorityClassName: high-priority
  containers:
  - name: app
    image: myapp
```

**Priority Values**:
- System pods: 2,000,000,000+
- Critical apps: 1,000,000
- Standard: 0 (default)
- Best effort: -1000

**Use Cases**:
- Ensure critical services stay running
- Batch jobs (low priority, can be preempted)

#priority #scheduling #resource-management

---

Q: What is Pod Topology Spread Constraints?

---

A: Controls how pods are **distributed across topology** (zones, nodes, regions).

**Why**: Avoid single point of failure, balance load

```yaml
spec:
  topologySpreadConstraints:
  - maxSkew: 1  # Max difference between zones
    topologyKey: topology.kubernetes.io/zone
    whenUnsatisfiable: DoNotSchedule  # or ScheduleAnyway
    labelSelector:
      matchLabels:
        app: web

  # Also spread across nodes
  - maxSkew: 1
    topologyKey: kubernetes.io/hostname
    whenUnsatisfiable: ScheduleAnyway
    labelSelector:
      matchLabels:
        app: web
```

**Example**:
- 3 zones: us-east-1a, us-east-1b, us-east-1c
- 6 replicas
- maxSkew: 1
- Result: 2 pods per zone (even distribution)

**vs Node Affinity**: Topology spread is for distribution, affinity is for placement preferences

#scheduling #topology #high-availability

---

Q: What are Vertical Pod Autoscaler (VPA) and when to use it?

---

A: Automatically **adjusts CPU/memory requests and limits** based on usage.

**How it works**:
1. Monitors pod resource usage
2. Recommends new requests/limits
3. Can auto-update (requires pod restart)

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: app-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app
  updatePolicy:
    updateMode: Auto  # Auto, Initial, Recreate, Off
  resourcePolicy:
    containerPolicies:
    - containerName: app
      minAllowed:
        cpu: 100m
        memory: 50Mi
      maxAllowed:
        cpu: 2
        memory: 2Gi
```

**Update Modes**:
- **Auto**: Updates running pods (restarts)
- **Recreate**: Only updates on pod restart
- **Initial**: Only sets on pod creation
- **Off**: Only recommendations

**HPA vs VPA**:
- HPA: Scales pod **count** (horizontal)
- VPA: Scales pod **size** (vertical)
- Can use both together (carefully)

#vpa #autoscaling #resource-management

---

Q: What is a Kubernetes Operator?

---

A: **Custom controller** that extends Kubernetes to manage complex applications.

**Pattern**:
1. Custom Resource Definition (CRD) - Define new resource type
2. Controller - Watch CRDs and reconcile desired state

```yaml
# CRD Example - Define "Database" resource
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: databases.example.com
spec:
  group: example.com
  names:
    kind: Database
    plural: databases
  scope: Namespaced
  versions:
  - name: v1
    served: true
    storage: true

---
# Use the CRD
apiVersion: example.com/v1
kind: Database
metadata:
  name: my-postgres
spec:
  size: 10Gi
  version: "13"
  backupSchedule: "0 2 * * *"
```

**Operator Controller**:
- Watches `Database` resources
- Creates StatefulSet, PVCs, Services
- Handles backups, upgrades, failover

**Popular Operators**:
- Prometheus Operator
- PostgreSQL Operator
- MySQL Operator
- Elasticsearch Operator

**Use Cases**: Complex stateful apps that need custom logic

#operators #crd #advanced

---

Q: What are Kubernetes Federation and Multi-Cluster?

---

A: Managing **multiple Kubernetes clusters** as one.

**Why Multi-Cluster**:
- **High availability**: Survive cluster failure
- **Compliance**: Data residency (EU cluster, US cluster)
- **Scalability**: Distribute load across clusters
- **Isolation**: Prod vs Dev clusters

**Approaches**:

**1. KubeFed (Kubernetes Federation v2)**:
- Sync resources across clusters
- Single control plane
- Federated types: Deployments, Services

**2. Multi-Cluster Service Mesh** (Istio, Linkerd):
- Service discovery across clusters
- Unified traffic management

**3. GitOps** (Fleet, Argo CD):
- Deploy same manifests to multiple clusters
- Git as source of truth

**4. Multi-Cluster Ingress**:
- Global load balancer across clusters
- Example: GKE Multi-Cluster Ingress

**Challenges**:
- Increased complexity
- Cross-cluster networking
- Data replication

#multi-cluster #federation #high-availability

---

Q: What is Cluster Autoscaler?

---

A: Automatically **scales cluster nodes** based on pending pods.

**How it works**:
1. Pods pending due to insufficient resources
2. Cluster Autoscaler adds nodes
3. Pods scheduled on new nodes
4. Unused nodes removed after 10 min (default)

```yaml
# GKE Example
gcloud container clusters update my-cluster \
  --enable-autoscaling \
  --min-nodes=3 \
  --max-nodes=10 \
  --zone=us-central1-a

# AWS EKS (similar)
eksctl scale nodegroup --cluster=my-cluster \
  --name=my-nodegroup \
  --nodes-min=3 \
  --nodes-max=10
```

**Scale-up triggers**:
- Pods in Pending state due to resources
- Respects PodDisruptionBudgets

**Scale-down triggers**:
- Node utilization < 50% for 10 minutes
- All pods can be moved elsewhere

**vs HPA**:
- Cluster Autoscaler: Scales **nodes**
- HPA: Scales **pods**
- Work together

#autoscaling #cluster-autoscaler #scalability

---

Q: What are Kubernetes Security Contexts?

---

A: Security settings for **Pods and Containers**.

**Pod-level SecurityContext**:
```yaml
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
    seccompProfile:
      type: RuntimeDefault
```

**Container-level SecurityContext**:
```yaml
spec:
  containers:
  - name: app
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      runAsNonRoot: true
      capabilities:
        drop:
        - ALL
        add:
        - NET_BIND_SERVICE
```

**Key Settings**:
- **runAsNonRoot**: Prevent running as root
- **readOnlyRootFilesystem**: Immutable filesystem
- **allowPrivilegeEscalation**: Prevent sudo/setuid
- **capabilities**: Linux capabilities (NET_ADMIN, etc.)

**Best Practices**:
- Always set runAsNonRoot: true
- Drop all capabilities, add only needed
- Use readonly filesystem when possible

#security #security-context #best-practices

---

Q: What is Pod Security Standards (PSS)?

---

A: Built-in **security profiles** for pods (replaces PodSecurityPolicy).

**Three Levels**:

**1. Privileged**: Unrestricted (no restrictions)
- For system-level components

**2. Baseline**: Minimally restrictive
- Prevents known privilege escalations
- Allows default pod config

**3. Restricted**: Heavily restricted (best practice)
- Follows pod hardening best practices
- May require app changes

**Enforcement Modes**:
- **enforce**: Reject violating pods
- **audit**: Allow but log violations
- **warn**: Allow but warn user

```yaml
# Namespace labels
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

**Restricted Profile Requirements**:
- runAsNonRoot: true
- No privileged containers
- No host namespaces (hostNetwork, hostPID, hostIPC)
- Limited volume types
- Capabilities dropped

#security #pod-security #standards

---

Q: What is Kyverno?

---

A: **Policy engine** for Kubernetes - validate, mutate, generate resources.

**Use Cases**:

**1. Validation** (Enforce rules):
```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-labels
spec:
  validationFailureAction: enforce
  rules:
  - name: check-team-label
    match:
      resources:
        kinds:
        - Pod
    validate:
      message: "Label 'team' is required"
      pattern:
        metadata:
          labels:
            team: "?*"
```

**2. Mutation** (Auto-fix resources):
```yaml
# Auto-add imagePullPolicy: Always
rules:
- name: add-imagepullpolicy
  mutate:
    patchStrategicMerge:
      spec:
        containers:
        - (name): "*"
          imagePullPolicy: Always
```

**3. Generation** (Create related resources):
```yaml
# Auto-create NetworkPolicy for each namespace
```

**vs OPA Gatekeeper**:
- Kyverno: Kubernetes-native, YAML policies
- OPA: General-purpose, Rego language

#policy #kyverno #governance

---

Q: What are Kubernetes Finalizers?

---

A: **Hooks** that prevent resource deletion until tasks complete.

**How it works**:
1. kubectl delete resource
2. Resource marked for deletion (deletionTimestamp set)
3. Finalizers run (cleanup tasks)
4. Finalizers removed
5. Resource deleted

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-config
  finalizers:
  - kubernetes.io/pvc-protection  # Built-in
  - custom.io/cleanup-hook        # Custom
```

**Example Use Cases**:
- **PVC protection**: Prevent deletion while pod using it
- **Custom operator**: Cleanup external resources (S3 bucket)
- **Database**: Export backup before deletion

**Built-in Finalizers**:
- `kubernetes.io/pvc-protection`
- `kubernetes.io/pv-protection`

**Custom Finalizer Flow**:
```go
// Controller watches resource
// On deletionTimestamp set:
1. Perform cleanup (delete S3 bucket)
2. Remove finalizer from metadata
3. Kubernetes deletes resource
```

**Warning**: Stuck finalizers block deletion (need manual removal)

#finalizers #operators #lifecycle

---

Q: What is kubectl debug and ephemeral containers?

---

A: **Debug running pods** without modifying original deployment.

**Ephemeral Container**: Temporary container added to running pod

```bash
# Debug pod with busybox
kubectl debug my-pod -it --image=busybox

# Debug with custom image
kubectl debug my-pod -it --image=nicolaka/netshoot

# Debug node (creates pod on node)
kubectl debug node/my-node -it --image=ubuntu

# Copy pod and debug (doesn't affect original)
kubectl debug my-pod -it --copy-to=my-pod-debug --image=busybox
```

**Use Cases**:
- Distroless images (no shell in prod image)
- Network debugging (netshoot has tcpdump, curl, etc.)
- Node debugging (check node filesystem)

**Example**:
```bash
# Your app image has no curl/ping
# Add ephemeral debug container
kubectl debug my-app-pod -it --image=nicolaka/netshoot

# Now you have networking tools
$ ping google.com
$ curl http://database:5432
```

**vs kubectl exec**:
- exec: Uses existing container
- debug: Adds temporary container with tools

#debugging #troubleshooting #ephemeral-containers

---

Q: What is Kustomize?

---

A: **Template-free** way to customize Kubernetes manifests.

**Problem it solves**: Same app, different environments (dev/staging/prod)

**Approach**: Patch base manifests without templating

```
kustomize/
├── base/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── kustomization.yaml
├── overlays/
    ├── dev/
    │   └── kustomization.yaml
    ├── staging/
    │   └── kustomization.yaml
    └── prod/
        └── kustomization.yaml
```

**base/kustomization.yaml**:
```yaml
resources:
- deployment.yaml
- service.yaml
```

**overlays/prod/kustomization.yaml**:
```yaml
bases:
- ../../base

replicas:
- name: app
  count: 10  # Override replicas

images:
- name: app
  newTag: v1.2.3  # Override image tag

configMapGenerator:
- name: app-config
  literals:
  - ENV=production
```

**Apply**:
```bash
kubectl apply -k overlays/prod/
```

**vs Helm**:
- Kustomize: Patch-based, no templating
- Helm: Template-based, package manager

#kustomize #configuration #gitops

---

Q: What is GitOps and Argo CD?

---

A: **Git as single source of truth** for infrastructure and apps.

**GitOps Principles**:
1. **Declarative**: Everything in Git (YAML)
2. **Versioned**: Git history = audit trail
3. **Automated**: CI/CD syncs Git → Cluster
4. **Reconciled**: Cluster state matches Git

**Argo CD**: GitOps controller for Kubernetes

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
spec:
  project: default
  source:
    repoURL: https://github.com/org/repo
    targetRevision: HEAD
    path: k8s/overlays/prod
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true      # Delete resources not in Git
      selfHeal: true   # Revert manual changes
```

**Workflow**:
1. Developer pushes to Git
2. Argo CD detects change
3. Applies manifests to cluster
4. Monitors for drift (manual kubectl changes)
5. Auto-heals if syncPolicy.automated

**Benefits**:
- Disaster recovery (git clone + apply)
- Audit trail (git log)
- Rollback (git revert)
- Multi-cluster (one Git repo → many clusters)

**Alternatives**: Flux, Jenkins X

#gitops #argocd #cicd

---

Q: What are Kubernetes Resource Quotas vs Limit Ranges?

---

A:

**ResourceQuota**: **Total** resources per namespace
```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: namespace-quota
spec:
  hard:
    requests.cpu: "100"      # Total for namespace
    requests.memory: "200Gi"
    limits.cpu: "200"
    limits.memory: "400Gi"
    pods: "50"               # Max 50 pods
```

**LimitRange**: **Default** and **min/max** per pod/container
```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: mem-cpu-limits
spec:
  limits:
  - max:
      memory: 2Gi
      cpu: "2"
    min:
      memory: 100Mi
      cpu: 100m
    default:        # Default limit
      memory: 512Mi
      cpu: 500m
    defaultRequest: # Default request
      memory: 256Mi
      cpu: 250m
    type: Container
```

**Together**:
1. LimitRange sets defaults for pods
2. ResourceQuota enforces namespace totals
3. Prevents resource hogging

**Example**:
- Namespace quota: 10 CPUs total
- LimitRange: max 2 CPUs per container
- Result: Max 5 pods (if each uses 2 CPUs)

#resource-management #quotas #limit-ranges

---

Q: What is a Service Mesh and Istio?

---

A: **Infrastructure layer** for service-to-service communication.

**What Service Mesh Provides**:
- **Traffic management**: Retries, timeouts, circuit breaking
- **Security**: mTLS between services
- **Observability**: Tracing, metrics
- **Policy**: Rate limiting, access control

**Istio Architecture**:
```
┌─────────────────────────────┐
│   Control Plane (istiod)    │
│   - Pilot (config)          │
│   - Citadel (certs)         │
│   - Galley (validation)     │
└─────────────────────────────┘
         ↓ config
┌──────────────┐  ┌──────────────┐
│  Pod         │  │  Pod         │
│ ┌────┐ ┌───┐│  │ ┌────┐ ┌───┐│
│ │App │ │Env││  │ │App │ │Env││ Envoy = Sidecar proxy
│ └────┘ └───┘│  │ └────┘ └───┘│
└──────────────┘  └──────────────┘
```

**Example - Traffic Splitting**:
```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
  - reviews
  http:
  - match:
    - headers:
        user:
          exact: jason
    route:
    - destination:
        host: reviews
        subset: v2  # Beta users get v2
  - route:
    - destination:
        host: reviews
        subset: v1
      weight: 90
    - destination:
        host: reviews
        subset: v2
      weight: 10  # Canary: 10% traffic to v2
```

**Use Cases**:
- Canary deployments
- A/B testing
- Zero-trust security (mTLS)
- Distributed tracing

**Alternatives**: Linkerd, Consul

#service-mesh #istio #microservices

---
