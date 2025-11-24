# Deck Name: Programming/React/Hooks

## Tags: react, hooks, javascript, frontend
## Type: basic

---

Q: What does the useState hook return?

---

A: An array with two elements:
1. The current state value
2. A function to update that state

```javascript
const [count, setCount] = useState(0);
// count = current value (0)
// setCount = updater function
```

#useState #basics

---

Q: When does useEffect run by default?

---

A: After **every render** (both mount and updates), unless you provide a dependency array.

```javascript
useEffect(() => {
  console.log('Runs after every render');
});
```

#useEffect #lifecycle

---

Q: How do you create a cleanup function in useEffect?

---

A: Return a function from the useEffect callback:

```javascript
useEffect(() => {
  // Setup
  const timer = setInterval(() => {}, 1000);

  // Cleanup (runs before next effect or unmount)
  return () => {
    clearInterval(timer);
  };
}, []);
```

#useEffect #cleanup

---

Q: What's the difference between useMemo and useCallback?

---

A: Both memoize values, but:

**useMemo**: Memoizes the **result** of a computation
```javascript
const expensiveValue = useMemo(() => computeExpensive(a, b), [a, b]);
```

**useCallback**: Memoizes the **function itself**
```javascript
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
```

**Rule**: Use `useMemo` for values, `useCallback` for functions passed as props.

#useMemo #useCallback #performance

---

Q: How do you create a custom hook?

---

A: Create a function starting with "use" that can call other hooks:

```javascript
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Usage
const [name, setName] = useLocalStorage('name', 'Guest');
```

#custom-hooks #patterns

---

Q: What are the rules of hooks?

---

A:

**Rule 1**: Only call hooks at the **top level**
- ❌ Don't call in loops, conditions, or nested functions
- ✅ Call at the top of your component

**Rule 2**: Only call hooks from **React functions**
- ✅ React function components
- ✅ Custom hooks
- ❌ Regular JavaScript functions

**Why?** React relies on call order to track hook state.

#rules #best-practices

---

Q: How do you access the previous value of state or props?

---

A: Use useRef to store the previous value:

```javascript
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// Usage
const [count, setCount] = useState(0);
const prevCount = usePrevious(count);
```

#useRef #patterns

---

Q: What does useReducer return and when should you use it?

---

A: **Returns**: `[state, dispatch]`

**Use when**:
- Complex state logic with multiple sub-values
- Next state depends on previous state
- Want to optimize performance (dispatch doesn't change)

```javascript
const [state, dispatch] = useReducer(reducer, initialState);

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

dispatch({ type: 'increment' });
```

#useReducer #state-management

---
