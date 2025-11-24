# Deck Name: DevOps/Kubernetes/Advanced

## Tags: kubernetes, k8s, advanced, production
## Type: basic

---

Q: What is a HorizontalPodAutoscaler (HPA)?

---

A: Automatically **scales pods** based on CPU/memory or custom metrics.

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

**How it works**:
1. Metrics server collects resource usage
2. HPA checks metrics every 15s (default)
3. Scales deployment if threshold crossed
4. Cooldown prevents thrashing

**Requires**: Metrics Server installed in cluster

#autoscaling #hpa #scaling

---

Q: What are Taints and Tolerations?

---

A: Mechanism to **control pod scheduling** on nodes.

**Taint**: Applied to **nodes** to repel pods
**Toleration**: Applied to **pods** to allow scheduling on tainted nodes

```bash
# Add taint to node
kubectl taint nodes node1 key=value:NoSchedule

# Effects:
# NoSchedule - don't schedule new pods
# PreferNoSchedule - try to avoid
# NoExecute - evict existing pods
```

```yaml
# Pod with toleration
spec:
  tolerations:
  - key: "key"
    operator: "Equal"
    value: "value"
    effect: "NoSchedule"
```

**Use Cases**:
- Dedicated nodes (GPU, high-memory)
- Node isolation
- Draining nodes

#taints #tolerations #scheduling

---

Q: What is a NetworkPolicy?

---

A: Firewall rules for **pod-to-pod communication**.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-network-policy
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: database
    ports:
    - protocol: TCP
      port: 5432
```

**Default**: All traffic allowed
**With NetworkPolicy**: Only specified traffic allowed (whitelist)

**Requires**: CNI plugin with NetworkPolicy support (Calico, Cilium)

#networking #security #network-policy

---

Q: What is an InitContainer and when would you use it?

---

A: Container that **runs before app containers** and must complete successfully.

**Use Cases**:
- Wait for dependencies (database ready)
- Pre-populate data
- Set up configuration
- Security utilities

```yaml
spec:
  initContainers:
  - name: wait-for-db
    image: busybox
    command: ['sh', '-c', 'until nslookup mydb; do sleep 2; done']

  - name: setup
    image: alpine
    command: ['sh', '-c', 'cp /config/* /app/']
    volumeMounts:
    - name: config
      mountPath: /config
    - name: app
      mountPath: /app

  containers:
  - name: app
    image: myapp:latest
```

**Behavior**:
- Run sequentially (one after another)
- Must complete successfully
- App containers start only after all init containers succeed

#init-containers #patterns

---

Q: What is a ServiceAccount?

---

A: Identity for **processes running in pods** to access Kubernetes API.

```yaml
# Create ServiceAccount
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-service-account

---
# Use in Pod
spec:
  serviceAccountName: my-service-account
  containers:
  - name: app
    image: myapp
```

**Bound with RBAC**:
```yaml
# Role
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list"]

---
# RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
subjects:
- kind: ServiceAccount
  name: my-service-account
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

**Default**: Each namespace has a `default` ServiceAccount

#rbac #security #service-accounts

---

Q: What are the different Service types and their use cases?

---

A:

**1. ClusterIP (default)**:
- Internal cluster IP only
- Pods can access, external cannot
- Use for: Internal microservices

**2. NodePort**:
- Exposes on each node's IP at static port (30000-32767)
- Accessible via `<NodeIP>:<NodePort>`
- Use for: Development, testing

**3. LoadBalancer**:
- Creates external load balancer (cloud provider)
- Gets external IP
- Use for: Production external services

**4. ExternalName**:
- Maps to DNS name (CNAME)
- No proxy, just DNS
- Use for: External services

```yaml
# LoadBalancer example
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  type: LoadBalancer
  selector:
    app: web
  ports:
  - port: 80
    targetPort: 8080
```

#services #networking #types

---

Q: How do you perform a blue-green deployment in Kubernetes?

---

A:

**Strategy**: Run two identical environments, switch traffic instantly.

```yaml
# Blue deployment (current)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: blue
  template:
    metadata:
      labels:
        app: myapp
        version: blue
    spec:
      containers:
      - name: app
        image: myapp:v1

---
# Green deployment (new)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-green
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: green
  template:
    metadata:
      labels:
        app: myapp
        version: green
    spec:
      containers:
      - name: app
        image: myapp:v2

---
# Service (switch by changing selector)
apiVersion: v1
kind: Service
metadata:
  name: app-service
spec:
  selector:
    app: myapp
    version: blue  # Change to 'green' to switch
  ports:
  - port: 80
```

**Process**:
1. Deploy green alongside blue
2. Test green
3. Switch service selector to green
4. Delete blue after validation

#deployment-strategies #blue-green

---

Q: What is a Job and CronJob in Kubernetes?

---

A:

**Job**: Runs pod to completion (one-time task)
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: data-migration
spec:
  template:
    spec:
      containers:
      - name: migration
        image: migrate:latest
      restartPolicy: OnFailure
  backoffLimit: 4  # Retry limit
```

**CronJob**: Scheduled recurring jobs
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: backup
spec:
  schedule: "0 2 * * *"  # 2 AM daily
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: backup:latest
          restartPolicy: OnFailure
```

**Cron Format**: minute hour day month weekday
- `0 2 * * *` = Daily at 2 AM
- `*/15 * * * *` = Every 15 minutes
- `0 0 * * 0` = Weekly (Sunday midnight)

#jobs #cronjobs #batch

---

Q: What are Kubernetes Quality of Service (QoS) classes?

---

A: Kubernetes assigns QoS class based on resource **requests and limits**:

**1. Guaranteed** (Highest priority):
- Every container has CPU & memory request = limit
- Gets evicted last
```yaml
resources:
  requests:
    memory: "200Mi"
    cpu: "500m"
  limits:
    memory: "200Mi"
    cpu: "500m"
```

**2. Burstable** (Medium priority):
- At least one container has request < limit
- Or request set without limit
```yaml
resources:
  requests:
    memory: "100Mi"
  limits:
    memory: "200Mi"
```

**3. BestEffort** (Lowest priority):
- No requests or limits set
- Gets evicted first during resource pressure

**Eviction order**: BestEffort → Burstable → Guaranteed

#qos #resources #eviction

---

Q: What is a ResourceQuota?

---

A: Limits **total resource consumption** per namespace.

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
  namespace: dev
spec:
  hard:
    # Compute
    requests.cpu: "10"
    requests.memory: "20Gi"
    limits.cpu: "20"
    limits.memory: "40Gi"

    # Objects
    pods: "50"
    services: "10"
    persistentvolumeclaims: "20"

    # Storage
    requests.storage: "100Gi"
```

**Enforced at namespace level**:
- Prevents resource hogging
- Ensures fair resource distribution
- Blocks creation if quota exceeded

**View quotas**:
```bash
kubectl get resourcequota -n dev
kubectl describe resourcequota compute-quota -n dev
```

#resource-quota #limits #namespace

---

Q: How does Kubernetes DNS work?

---

A: **CoreDNS** provides DNS for service discovery.

**Service DNS Format**:
```
<service-name>.<namespace>.svc.cluster.local
```

**Examples**:
```bash
# Within same namespace
curl http://api-service

# Different namespace
curl http://api-service.production.svc.cluster.local

# Pod DNS (if hostname set)
<pod-ip-dashes>.<namespace>.pod.cluster.local
```

**Headless Service** (for StatefulSets):
```yaml
apiVersion: v1
kind: Service
metadata:
  name: mysql
spec:
  clusterIP: None  # Headless
  selector:
    app: mysql
```
DNS returns pod IPs directly:
```
mysql-0.mysql.default.svc.cluster.local
mysql-1.mysql.default.svc.cluster.local
```

#dns #service-discovery #networking

---

Q: What is the difference between kubectl apply and kubectl create?

---

A:

**kubectl create**:
- **Imperative** - tells Kubernetes what to do
- Creates new resource
- Fails if resource already exists
- No change tracking

**kubectl apply**:
- **Declarative** - describes desired state
- Creates or updates resource
- Idempotent (can run multiple times)
- Tracks changes via annotations
- Supports three-way merge (last-applied, current, new)

```bash
# Create (fails if exists)
kubectl create -f deployment.yaml

# Apply (creates or updates)
kubectl apply -f deployment.yaml

# Apply preserves manual changes better
kubectl apply -f deployment.yaml --server-side
```

**Best Practice**: Use `kubectl apply` for GitOps workflows

#kubectl #declarative #imperative

---

Q: What is an Admission Controller?

---

A: Plugin that **intercepts API requests** before persistence, can **validate or mutate**.

**Built-in Controllers**:
- **LimitRanger**: Enforces resource limits
- **ResourceQuota**: Enforces quotas
- **PodSecurityPolicy**: Security policies
- **NamespaceLifecycle**: Prevents creation in terminating namespaces
- **ServiceAccount**: Auto-adds default SA

**Webhook Types**:

**Validating**: Accept or reject (doesn't modify)
```yaml
# Rejects pods without specific labels
```

**Mutating**: Can modify objects
```yaml
# Auto-injects sidecar containers
# Auto-adds labels/annotations
```

**Enable controller**:
```bash
kube-apiserver --enable-admission-plugins=PodSecurityPolicy,ResourceQuota
```

**Use Cases**:
- Policy enforcement (OPA Gatekeeper)
- Auto-injection (Istio sidecar)
- Image scanning
- Compliance validation

#admission-controllers #security #validation

---

Q: How do you troubleshoot a pod in CrashLoopBackOff?

---

A: **Systematic debugging approach**:

**1. Check pod events**:
```bash
kubectl describe pod <pod-name>
# Look at Events section
```

**2. Check logs**:
```bash
# Current container
kubectl logs <pod-name>

# Previous crashed container
kubectl logs <pod-name> --previous

# Specific container in pod
kubectl logs <pod-name> -c <container-name>
```

**3. Common causes**:
- **Application error**: Check logs for stack traces
- **Missing dependencies**: ConfigMap, Secret not found
- **Liveness probe failing**: Too aggressive probe
- **Resource limits**: OOMKilled (out of memory)
- **Image pull error**: Wrong image or auth
- **Command error**: Wrong entrypoint/command

**4. Get shell access** (if possible):
```bash
kubectl exec -it <pod-name> -- /bin/sh
```

**5. Check resource usage**:
```bash
kubectl top pod <pod-name>
```

**6. Review configuration**:
- Probe settings (initialDelaySeconds, timeoutSeconds)
- Resource requests/limits
- Environment variables
- Volume mounts

#troubleshooting #debugging #crashloop

---

Q: What is Helm and why use it?

---

A: **Package manager for Kubernetes** (like apt/yum for Linux).

**Benefits**:
- **Templating**: Reusable YAML with variables
- **Versioning**: Track releases and rollback
- **Packaging**: Bundle related resources
- **Dependency management**: Charts can depend on other charts

**Basic commands**:
```bash
# Add repository
helm repo add stable https://charts.helm.sh/stable

# Search charts
helm search repo nginx

# Install chart
helm install my-release bitnami/nginx

# List releases
helm list

# Upgrade
helm upgrade my-release bitnami/nginx --set replicaCount=3

# Rollback
helm rollback my-release 1

# Uninstall
helm uninstall my-release
```

**Chart structure**:
```
mychart/
├── Chart.yaml       # Chart metadata
├── values.yaml      # Default values
├── templates/       # K8s manifests
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
└── charts/          # Dependency charts
```

#helm #package-manager #templating

---
