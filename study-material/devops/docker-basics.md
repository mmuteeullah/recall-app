# Deck Name: DevOps/Docker/Basics

## Tags: docker, containers, devops
## Type: basic

---

Q: What's the difference between an image and a container?

---

A:

**Image**: Read-only template with instructions for creating a container
- Like a class in OOP
- Stored in registry (Docker Hub)
- Created from Dockerfile

**Container**: Running instance of an image
- Like an object/instance in OOP
- Isolated process with own filesystem
- Can be started, stopped, deleted

```bash
# Image = Recipe
docker build -t myapp .

# Container = Cake made from recipe
docker run myapp
```

#concepts #fundamentals

---

Q: What does `docker run -p 8080:80 nginx` do?

---

A: Runs nginx container with **port mapping**:

- `-p 8080:80` maps **host port 8080** → **container port 80**
- Access nginx at `localhost:8080`
- Traffic to host:8080 forwards to container:80

Format: `-p HOST_PORT:CONTAINER_PORT`

```bash
docker run -p 8080:80 nginx
# Access at: http://localhost:8080
```

#networking #ports

---

Q: How do you see logs from a running container?

---

A: Use `docker logs`:

```bash
# View logs
docker logs <container_id>

# Follow logs (like tail -f)
docker logs -f <container_id>

# Last 100 lines
docker logs --tail 100 <container_id>

# With timestamps
docker logs -t <container_id>
```

#logs #debugging

---

Q: What's the difference between CMD and ENTRYPOINT in Dockerfile?

---

A:

**CMD**: Default command, **can be overridden**
```dockerfile
CMD ["nginx", "-g", "daemon off;"]
# Override: docker run myimage /bin/bash
```

**ENTRYPOINT**: Main command, **always runs**
```dockerfile
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
# CMD becomes arguments to ENTRYPOINT
```

**Best Practice**: Use both together
- ENTRYPOINT = executable
- CMD = default arguments

#dockerfile #commands

---

Q: How do you execute a command in a running container?

---

A: Use `docker exec`:

```bash
# Interactive shell
docker exec -it <container_id> /bin/bash

# Run single command
docker exec <container_id> ls -la

# As specific user
docker exec -u root <container_id> whoami
```

**Flags**:
- `-i` = interactive (keep STDIN open)
- `-t` = allocate pseudo-TTY (terminal)

#exec #debugging

---

Q: What does `docker-compose up -d` do?

---

A: Starts services defined in `docker-compose.yml`:

- `up` = Create and start containers
- `-d` = **Detached mode** (run in background)

```bash
docker-compose up -d

# Opposite: Stop and remove
docker-compose down
```

**What happens**:
1. Creates network
2. Creates volumes
3. Builds images (if needed)
4. Starts containers

#docker-compose #orchestration

---

Q: How do you remove all stopped containers?

---

A: Use `docker container prune`:

```bash
# Remove all stopped containers
docker container prune

# Remove without confirmation
docker container prune -f

# Alternative (older method)
docker rm $(docker ps -aq -f status=exited)
```

**Also useful**:
```bash
docker image prune   # Remove unused images
docker volume prune  # Remove unused volumes
docker system prune  # Remove everything unused
```

#cleanup #maintenance

---

Q: What does a .dockerignore file do?

---

A: Excludes files from being sent to Docker build context (like .gitignore)

**.dockerignore example**:
```
node_modules
npm-debug.log
.git
.env
*.md
.DS_Store
```

**Benefits**:
- ⚡ Faster builds (smaller context)
- 🔒 Better security (exclude secrets)
- 📦 Smaller images

#dockerfile #best-practices

---
