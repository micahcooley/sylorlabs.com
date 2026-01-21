## 2024-05-23 - [In-Memory User Store Optimization]
**Learning:** Switching from Array.find (O(N)) to Map.get (O(1)) for in-memory user storage reduced lookup time by ~500x (from 0.29ms to 0.0005ms per lookup with 10k users).
**Action:** Always use Maps for keyed lookups in in-memory stores, even for prototypes.
