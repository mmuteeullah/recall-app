# Deck Name: DevOps/Linux/Commands

## Tags: linux, cli, commands, sysadmin
## Type: basic

---

Q: How do you find files modified in the last 7 days?

---

A: Use `find` with `-mtime`:

```bash
# Files modified in last 7 days
find /path -mtime -7

# Exactly 7 days ago
find /path -mtime 7

# More than 7 days ago
find /path -mtime +7
```

**Breakdown**:
- `-mtime -7` = within last 7 days
- `-mtime +7` = older than 7 days

#find #files

---

Q: What does `chmod 755` mean?

---

A: Sets file permissions to **rwxr-xr-x**

**Breakdown**:
```
7 = 4+2+1 = rwx (owner)
5 = 4+0+1 = r-x (group)
5 = 4+0+1 = r-x (others)
```

**Numbers**:
- 4 = read (r)
- 2 = write (w)
- 1 = execute (x)

```bash
chmod 755 script.sh
# Owner: read+write+execute
# Group: read+execute
# Others: read+execute
```

#permissions #chmod

---

Q: How do you check disk usage of a directory?

---

A: Use `du` (disk usage):

```bash
# Size of directory
du -sh /path

# Top 10 largest directories
du -h /path | sort -rh | head -10

# All subdirectories with sizes
du -h --max-depth=1 /path
```

**Flags**:
- `-s` = summary (total only)
- `-h` = human-readable (GB, MB)
- `--max-depth=1` = one level deep

#disk #du

---

Q: How do you find which process is using a port?

---

A: Use `lsof` or `netstat`:

```bash
# Using lsof (list open files)
sudo lsof -i :8080

# Using netstat
sudo netstat -tulpn | grep :8080

# Using ss (modern alternative)
sudo ss -tulpn | grep :8080
```

**Output shows**:
- Process ID (PID)
- Process name
- User running it

#networking #ports #processes

---

Q: What's the difference between > and >> in bash?

---

A:

**>** (redirect): **Overwrites** file
```bash
echo "new" > file.txt
# file.txt now contains only "new"
```

**>>** (append): **Adds** to end of file
```bash
echo "more" >> file.txt
# Appends "more" to file.txt
```

**Bonus**:
```bash
command 2> error.log    # Redirect stderr
command &> all.log      # Redirect both stdout and stderr
```

#bash #redirection

---

Q: How do you compress and extract tar.gz files?

---

A:

**Compress (create)**:
```bash
tar -czvf archive.tar.gz /path/to/directory

# c = create
# z = gzip compression
# v = verbose
# f = file name
```

**Extract**:
```bash
tar -xzvf archive.tar.gz

# x = extract
# -C /path = extract to specific directory
tar -xzvf archive.tar.gz -C /destination
```

#compression #tar

---

Q: How do you monitor real-time log files?

---

A: Use `tail -f`:

```bash
# Follow log file (updates in real-time)
tail -f /var/log/nginx/error.log

# Last 100 lines + follow
tail -n 100 -f /var/log/app.log

# Follow multiple files
tail -f file1.log file2.log

# With grep filter
tail -f app.log | grep ERROR
```

**Alternative**: `less +F logfile` (can scroll with F to toggle follow)

#logs #tail #monitoring

---

Q: What does `ps aux` show?

---

A: Lists **all running processes** with details:

```bash
ps aux

# a = all users
# u = user-oriented format
# x = include processes without terminal
```

**Output columns**:
- USER: Process owner
- PID: Process ID
- %CPU: CPU usage
- %MEM: Memory usage
- COMMAND: Command that started process

**Common usage**:
```bash
ps aux | grep nginx     # Find nginx processes
ps aux --sort=-%mem     # Sort by memory usage
```

#processes #ps

---
