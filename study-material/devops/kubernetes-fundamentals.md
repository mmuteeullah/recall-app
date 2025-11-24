# Deck Name: DevOps/Kubernetes/Fundamentals

## Tags: kubernetes, k8s, containers, orchestration
## Type: basic

---

Q: What is a Pod in Kubernetes?

---

A: The **smallest deployable unit** in Kubernetes.

**Key Points**:
- Contains one or more containers
- Shares network namespace (same IP)
- Shares storage volumes
- Co-located and co-scheduled on same node

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
    - containerPort: 80
```

#pods #basics

---

Q: What's the difference between a Deployment and a StatefulSet?

---

A:

**Deployment**: For **stateless** applications
- Pods are interchangeable
- Random pod names (nginx-67d5f-xyz)
- No guaranteed order for scaling
- Volumes not persistent per pod

**StatefulSet**: For **stateful** applications
- Pods have stable identities
- Predictable names (mysql-0, mysql-1)
- Ordered scaling and updates
- Persistent storage per pod

**Use StatefulSet for**: Databases, Kafka, ZooKeeper
**Use Deployment for**: Web servers, APIs, workers

#deployments #statefulsets #workloads

---

Q: What are the main components of the Kubernetes control plane?

---

A:

**Control Plane Components** (run on master nodes):

1. **API Server** (`kube-apiserver`)
   - Frontend for Kubernetes control plane
   - Exposes REST API

2. **etcd**
   - Distributed key-value store
   - Stores all cluster data

3. **Scheduler** (`kube-scheduler`)
   - Assigns pods to nodes
   - Considers resource requirements

4. **Controller Manager** (`kube-controller-manager`)
   - Runs controller processes
   - Node, Replication, Endpoints controllers

5. **Cloud Controller Manager**
   - Interacts with cloud provider APIs

#architecture #control-plane

---

Q: What does a Service do in Kubernetes?

---

A: A **Service** provides a **stable endpoint** to access a set of Pods.

**Why needed?** Pods are ephemeral (IPs change), Services provide:
- Stable IP address
- DNS name
- Load balancing across pods

**Types**:
```yaml
# ClusterIP (default) - internal only
# NodePort - exposes on each node's IP
# LoadBalancer - cloud load balancer
# ExternalName - DNS CNAME record

apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
```

#services #networking

---

Q: What is a Namespace in Kubernetes?

---

A: **Virtual clusters** within a physical cluster for **resource isolation**.

**Use Cases**:
- Multi-tenancy (dev, staging, prod)
- Team separation
- Resource quotas per namespace

```bash
# List namespaces
kubectl get namespaces

# Create namespace
kubectl create namespace dev

# Use namespace
kubectl get pods -n dev
kubectl apply -f app.yaml -n dev
```

**Default namespaces**:
- `default` - default for resources
- `kube-system` - Kubernetes system components
- `kube-public` - publicly readable
- `kube-node-lease` - node heartbeats

#namespaces #isolation

---

Q: How do you expose environment variables to a Pod?

---

A: **Three methods**:

**1. Direct definition**:
```yaml
env:
- name: ENV_VAR
  value: "direct-value"
```

**2. From ConfigMap**:
```yaml
env:
- name: CONFIG_KEY
  valueFrom:
    configMapKeyRef:
      name: my-config
      key: database-url
```

**3. From Secret**:
```yaml
env:
- name: PASSWORD
  valueFrom:
    secretKeyRef:
      name: my-secret
      key: db-password
```

#configuration #environment

---

Q: What's the difference between ConfigMap and Secret?

---

A:

**ConfigMap**: For **non-sensitive** configuration data
- Stored as plain text
- Can view with `kubectl get configmap -o yaml`
- Use for: config files, environment variables

**Secret**: For **sensitive** data
- Base64 encoded (not encrypted by default!)
- Mounted as volumes or env vars
- Use for: passwords, tokens, keys

```bash
# Create ConfigMap
kubectl create configmap app-config --from-literal=api-url=http://api

# Create Secret
kubectl create secret generic db-secret --from-literal=password=secret123
```

⚠️ **Important**: Secrets are only base64 encoded, use encryption at rest for security!

#configmap #secrets #security

---

Q: What is a ReplicaSet and how does it differ from a Deployment?

---

A:

**ReplicaSet**: Ensures a specified number of pod replicas are running
- Low-level resource
- Directly manages pods
- No rolling updates

**Deployment**: Higher-level abstraction that manages ReplicaSets
- **Declarative updates** for pods
- **Rolling updates** and rollbacks
- Manages multiple ReplicaSets (current + old versions)

```yaml
# You typically create Deployments, not ReplicaSets directly
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.19
```

**Best Practice**: Always use Deployments, not ReplicaSets directly

#replicasets #deployments #workloads

---

Q: How do you perform a rolling update in Kubernetes?

---

A: Update the Deployment spec, Kubernetes automatically rolls out changes:

```bash
# Method 1: Update image
kubectl set image deployment/nginx nginx=nginx:1.20

# Method 2: Edit deployment
kubectl edit deployment nginx

# Method 3: Apply updated YAML
kubectl apply -f deployment.yaml
```

**Rolling Update Process**:
1. Create new ReplicaSet with updated pods
2. Scale up new ReplicaSet incrementally
3. Scale down old ReplicaSet
4. Gradually replace old pods with new ones

**Monitor rollout**:
```bash
kubectl rollout status deployment/nginx
kubectl rollout history deployment/nginx

# Rollback if needed
kubectl rollout undo deployment/nginx
```

#deployments #rolling-updates #updates

---

Q: What is an Ingress and how does it differ from a Service?

---

A:

**Service**: Layer 4 (TCP/UDP) load balancing
- Routes traffic to pods
- Works at transport layer
- One Service = One load balancer (for LoadBalancer type)

**Ingress**: Layer 7 (HTTP/HTTPS) routing
- **Single entry point** for multiple services
- Host-based and path-based routing
- TLS/SSL termination
- Cost-effective (one load balancer for many services)

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
spec:
  rules:
  - host: app.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
      - path: /web
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80
```

**Requires**: Ingress Controller (nginx, traefik, etc.)

#ingress #networking #routing

---

Q: What are Labels and Selectors in Kubernetes?

---

A:

**Labels**: Key-value pairs attached to objects for identification
```yaml
metadata:
  labels:
    app: nginx
    env: production
    version: v1.2
```

**Selectors**: Query mechanism to filter objects by labels

**Equality-based**:
```bash
kubectl get pods -l app=nginx
kubectl get pods -l env!=dev
```

**Set-based**:
```bash
kubectl get pods -l 'env in (prod, staging)'
kubectl get pods -l 'version notin (v1.0, v1.1)'
```

**Used by**:
- Services (to select backend pods)
- Deployments (to manage pods)
- Network Policies (to define rules)

#labels #selectors #organization

---

Q: What is a DaemonSet and when would you use it?

---

A: A **DaemonSet** ensures **one pod per node** (or subset of nodes).

**Use Cases**:
- **Log collectors** (Fluentd, Filebeat)
- **Monitoring agents** (Prometheus Node Exporter)
- **Storage daemons** (Ceph, GlusterFS)
- **Network plugins** (Calico, Weave)

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: node-exporter
spec:
  selector:
    matchLabels:
      app: node-exporter
  template:
    metadata:
      labels:
        app: node-exporter
    spec:
      containers:
      - name: node-exporter
        image: prom/node-exporter
```

**Behavior**:
- New pod created when node added
- Pod deleted when node removed
- Runs on all nodes (unless nodeSelector used)

#daemonsets #workloads

---

Q: How do Liveness and Readiness probes differ?

---

A:

**Liveness Probe**: Is the container **alive**?
- If fails → **kubelet restarts container**
- Detects deadlocks, hung processes
- Use for: Application health

**Readiness Probe**: Is the container **ready to serve traffic**?
- If fails → **removes pod from Service endpoints**
- Container keeps running
- Use for: Startup time, dependencies ready

```yaml
spec:
  containers:
  - name: app
    livenessProbe:
      httpGet:
        path: /healthz
        port: 8080
      initialDelaySeconds: 30
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /ready
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 5
```

**Types**: HTTP GET, TCP Socket, Exec command

#probes #health-checks

---

Q: What are Resource Requests and Limits?

---

A:

**Requests**: **Guaranteed** resources for container
- Scheduler uses this to find suitable node
- Minimum resources container will get

**Limits**: **Maximum** resources container can use
- Container throttled (CPU) or killed (memory) if exceeded

```yaml
resources:
  requests:
    memory: "64Mi"
    cpu: "250m"       # 0.25 CPU
  limits:
    memory: "128Mi"
    cpu: "500m"       # 0.5 CPU
```

**Units**:
- CPU: 1 = 1 vCPU/Core, 100m = 0.1 CPU
- Memory: Ki, Mi, Gi (1024-based) or K, M, G (1000-based)

**Best Practice**:
- Always set requests
- Set limits to prevent resource hogging
- Request = Limit for guaranteed QoS

#resources #limits #scheduling

---

Q: What is a PersistentVolume (PV) and PersistentVolumeClaim (PVC)?

---

A:

**PersistentVolume (PV)**: Cluster-level storage resource
- Created by admin or dynamically provisioned
- Independent of pod lifecycle
- Has capacity, access modes, storage class

**PersistentVolumeClaim (PVC)**: User's request for storage
- Requests specific size and access mode
- Binds to available PV
- Pods reference PVC, not PV directly

```yaml
# PVC (user creates)
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: fast

# Pod uses PVC
volumes:
- name: data
  persistentVolumeClaim:
    claimName: my-pvc
```

**Access Modes**:
- `ReadWriteOnce` (RWO) - single node
- `ReadOnlyMany` (ROX) - multiple nodes read
- `ReadWriteMany` (RWX) - multiple nodes read/write

#storage #volumes #persistence

---
