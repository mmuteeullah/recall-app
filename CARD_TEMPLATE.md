# RE-CA-LL Card Import Template

This template shows how to format markdown files for bulk importing cards into RE-CA-LL.

---

## Basic Format

```markdown
# Deck Name: Your/Deck/Path

## Tags: tag1, tag2, tag3
## Type: basic

---

Q: Your question here?

---

A: Your answer here.

---
```

---

## Complete Example

Below is a complete example with multiple cards:

```markdown
# Deck Name: Knowledge/JavaScript/ES6

## Tags: javascript, es6, programming
## Type: basic

---

Q: What is the difference between `let` and `const` in JavaScript?

---

A: `let` allows reassignment of the variable, while `const` creates a read-only reference.

```js
let x = 1;
x = 2; // ✅ Works

const y = 1;
y = 2; // ❌ TypeError
```

Note: `const` does NOT make objects immutable - you can still modify object properties.

#variables #basics

---

Q: What does the spread operator (`...`) do?

---

A: The spread operator expands an iterable (array, string, object) into individual elements.

```js
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }
```

#operators #syntax

---

Q: How do you destructure an object in JavaScript?

---

A: Use curly braces to extract properties:

```js
const user = { name: 'Alice', age: 30, city: 'NYC' };

// Basic destructuring
const { name, age } = user;
console.log(name); // 'Alice'

// With renaming
const { name: userName } = user;
console.log(userName); // 'Alice'

// With defaults
const { country = 'USA' } = user;
console.log(country); // 'USA'
```

#destructuring #es6

---
```

---

## Format Rules

### 1. **Deck Name** (Required)
```markdown
# Deck Name: Parent/Child/Grandchild
```
- Must start with `# Deck Name:`
- Use forward slashes `/` for nested decks
- Example: `Knowledge/Python/Basics`

### 2. **Tags** (Optional)
```markdown
## Tags: tag1, tag2, tag3
```
- Comma-separated list
- Applied to ALL cards in the file
- Can add per-card tags inline (see below)

### 3. **Card Type** (Optional)
```markdown
## Type: basic
```
- `basic` - One-way card (default)
- `reverse` - Creates two cards (Q→A and A→Q)

### 4. **Card Separator**
```markdown
---
```
- Three dashes on a line
- Separates cards and sections

### 5. **Question**
```markdown
Q: Your question here?
```
- Starts with `Q:`
- Supports full markdown
- Can include code blocks, lists, images

### 6. **Answer**
```markdown
A: Your answer here.
```
- Starts with `A:`
- Supports full markdown
- Can include code blocks, lists, images

### 7. **Per-Card Tags** (Optional)
```markdown
#inline-tag #another-tag
```
- Add after the answer
- Use hashtags without spaces
- Supplements header tags

---

## Advanced Examples

### With Code Blocks

```markdown
# Deck Name: DevOps/Kubernetes/Commands

## Tags: kubernetes, cli, devops
## Type: basic

---

Q: How do you get all pods in all namespaces?

---

A: Use the `--all-namespaces` flag:

```bash
kubectl get pods --all-namespaces
# or short form
kubectl get pods -A
```

#kubectl #commands

---

Q: How do you describe a pod?

---

A: Use the `describe` command:

```bash
kubectl describe pod <pod-name> -n <namespace>
```

This shows detailed information including:
- Events
- Container status
- Resource limits
- Volume mounts

#kubectl #troubleshooting

---
```

### With Lists and Formatting

```markdown
# Deck Name: Interviews/System-Design/Concepts

## Tags: system-design, interviews, architecture
## Type: basic

---

Q: What are the CAP theorem properties?

---

A: The CAP theorem states a distributed system can only guarantee 2 of 3:

1. **Consistency** - All nodes see the same data
2. **Availability** - Every request gets a response
3. **Partition Tolerance** - System works despite network failures

**Trade-offs:**
- CP: Sacrifice availability (e.g., MongoDB, HBase)
- AP: Sacrifice consistency (e.g., Cassandra, DynamoDB)
- CA: Not realistic in distributed systems

#cap-theorem #distributed-systems

---

Q: What is the difference between horizontal and vertical scaling?

---

A:

**Vertical Scaling (Scale Up):**
- Add more power to existing machine
- ✅ Simple, no code changes
- ❌ Hardware limits, single point of failure
- Example: Upgrade from 8GB → 32GB RAM

**Horizontal Scaling (Scale Out):**
- Add more machines
- ✅ Nearly unlimited scaling
- ❌ Requires load balancing, complexity
- Example: Add 3 more web servers

#scaling #architecture

---
```

### With Tables

```markdown
# Deck Name: Knowledge/Databases/SQL

## Tags: sql, databases
## Type: basic

---

Q: What are the different SQL JOIN types?

---

A:

| JOIN Type | Description | Use Case |
|-----------|-------------|----------|
| INNER JOIN | Returns matching rows only | Default, most common |
| LEFT JOIN | All left + matching right | Keep all from first table |
| RIGHT JOIN | All right + matching left | Keep all from second table |
| FULL JOIN | All rows from both tables | Union of all data |
| CROSS JOIN | Cartesian product | All combinations |

```sql
-- Example
SELECT users.name, orders.total
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
```

#joins #sql

---
```

### Reverse Cards (Bidirectional)

```markdown
# Deck Name: Languages/Spanish/Vocabulary

## Tags: spanish, vocabulary, basics
## Type: reverse

---

Q: hello

---

A: hola

#greetings

---

Q: goodbye

---

A: adiós

#greetings

---

Q: thank you

---

A: gracias

#polite

---
```

This creates TWO cards per entry:
- "hello" → "hola"
- "hola" → "hello"

---

## Multi-Deck Template

You can include multiple decks in one file:

```markdown
# Deck Name: Knowledge/Go/Basics

## Tags: go, golang, basics
## Type: basic

---

Q: How do you declare a variable in Go?

---

A: Use `var` or short declaration:

```go
var x int = 10
y := 20 // Type inferred
```

---

# Deck Name: Knowledge/Go/Concurrency

## Tags: go, concurrency, goroutines
## Type: basic

---

Q: How do you create a goroutine?

---

A: Use the `go` keyword:

```go
go myFunction()
go func() {
    fmt.Println("Anonymous goroutine")
}()
```

---
```

---

## Tips for Creating Cards

### 1. **Keep Questions Focused**
❌ Bad: "Explain everything about React hooks, their history, and all use cases"
✅ Good: "What does the useState hook return?"

### 2. **Make Answers Concise**
- Get to the point quickly
- Use code examples
- Add context when needed

### 3. **Use Visual Hierarchy**
- **Bold** for emphasis
- `Code` for technical terms
- Lists for multiple points

### 4. **Include Examples**
- Code snippets help understanding
- Real-world scenarios stick better
- Show both correct and incorrect usage

### 5. **Tag Strategically**
- Use broad tags: `python`, `kubernetes`
- Use specific tags: `decorators`, `networking`
- Use difficulty tags: `easy`, `medium`, `hard`

### 6. **Nest Decks Logically**
```
Knowledge/
├── Programming/
│   ├── Python/
│   │   ├── Basics
│   │   ├── OOP
│   │   └── Async
│   └── JavaScript/
│       ├── ES6
│       └── React
└── DevOps/
    ├── Docker/
    └── Kubernetes/
```

---

## Common Patterns

### Command Reference Card
```markdown
Q: Docker command to list all containers (including stopped)?

---

A: `docker ps -a`

Flags:
- `-a` / `--all` - Show all (default shows running only)
- `-q` / `--quiet` - Only display IDs

#docker #commands
```

### Concept Definition Card
```markdown
Q: What is a closure in JavaScript?

---

A: A closure is a function that has access to variables from its outer (enclosing) function's scope, even after the outer function has returned.

```js
function outer() {
    const name = 'Alice';
    return function inner() {
        console.log(name); // Accesses outer variable
    };
}
const fn = outer();
fn(); // 'Alice'
```

#closures #scope #functions
```

### Comparison Card
```markdown
Q: Difference between `==` and `===` in JavaScript?

---

A:

| Operator | Name | Behavior |
|----------|------|----------|
| `==` | Loose equality | Type coercion |
| `===` | Strict equality | No type coercion |

```js
5 == '5'   // true (coerces string to number)
5 === '5'  // false (different types)
```

**Best Practice:** Always use `===` unless you specifically need coercion.

#operators #comparison
```

### Troubleshooting Card
```markdown
Q: How do you debug a "Pod in CrashLoopBackOff" state?

---

A: Follow these steps:

1. **Check logs:**
   ```bash
   kubectl logs <pod-name> --previous
   ```

2. **Describe pod for events:**
   ```bash
   kubectl describe pod <pod-name>
   ```

3. **Check resource limits:**
   - OOMKilled → Increase memory
   - CPU throttling → Adjust limits

4. **Verify configuration:**
   - ConfigMaps mounted correctly?
   - Secrets available?
   - Environment variables set?

#kubernetes #troubleshooting #debugging
```

---

## Sample Files Included

Check the `sample-cards/` directory for ready-to-use examples:
- **`kubernetes-basics.md`** - Basic Kubernetes concepts and commands (5 cards)
- **`go-concurrency.md`** - Go concurrency patterns and best practices (4 cards)

You can use these as templates for your own card collections!

---

## Import Process

1. **Create your .md file** using this template
2. **Go to RE-CA-LL app** → Import page
3. **Drag and drop** your .md file
4. **Review preview** - Check deck structure and card count
5. **Click "Import"** - Cards are added to your decks
6. **Start studying!** 🚀

---

## Validation Checklist

Before importing, verify:
- ✅ Deck name starts with `# Deck Name:`
- ✅ Each card has `Q:` and `A:` sections
- ✅ Cards are separated by `---`
- ✅ Code blocks use triple backticks
- ✅ No syntax errors in markdown
- ✅ Tags are comma-separated (no spaces in individual tags)

---

## Advanced: Programmatic Generation

You can generate cards programmatically:

```javascript
// Example: Generate flashcards from API data
const cards = apiData.map(item => `
Q: ${item.question}

---

A: ${item.answer}

#${item.category}

---
`).join('\n');

const markdown = `# Deck Name: Generated/API-Cards

## Tags: generated, api
## Type: basic

---

${cards}
`;

// Write to file or copy to clipboard
```

---

**Happy Learning! 🎓**

For more information, visit the [RE-CA-LL GitHub repository](https://github.com/yourusername/anki-alternate)
