# Freedom Travel OS Personal v2.5.0 RC1 — Trip Ready

This release freezes new features and focuses on reliability before the Korea trip.

## Reliability
- Added a screen-level error boundary so one rendering problem cannot blank the whole app.
- Added a safe recovery screen that directs the user to reload without deleting local trip data.
- Added persistent offline status feedback.
- Added a controlled PWA update prompt with one-tap update instead of silently replacing the app while it is in use.
- Service-worker cleanup is limited to Personal Edition caches.

## Final trip-ready polish
- Dashboard version label updated to v2.5 RC.
- Existing Korea flights, hotels, budget, packing, itinerary, airport journey, reminders, documents, journal and settings remain compatible.
- No personal trip information was removed or reset.
