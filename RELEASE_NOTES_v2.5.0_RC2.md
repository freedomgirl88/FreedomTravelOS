# Freedom Travel OS Personal v2.5 RC2
## Performance + Polish

- Split secondary screens into on-demand chunks to reduce initial startup work.
- Added a calm loading state while a screen module loads.
- Debounced local-storage writes and flushes pending changes when the app is backgrounded or closed.
- Avoided unnecessary saves when a value has not changed.
- Hardened return-flight reminder checks against incomplete or invalid date data.
- Improved offline caching with network-first navigation and stale-while-revalidate assets.
- Added reduced-motion support, clearer keyboard focus, safer long-text wrapping and larger touch targets.
- Preserved all existing Korea trip data keys, RC1 splash visuals and app behaviour.
