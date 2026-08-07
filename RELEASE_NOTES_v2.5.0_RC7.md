# Freedom Travel OS Personal v2.5 RC7

## Reminder & Alert QA
- Added DEV-only **Send test notification** action on Alerts.
- Notification permission status is reflected on the Alerts screen.
- Personal reminders with a date/time are checked every 15 seconds while the PWA is running and notify once when due.
- Reminder notification taps route to Reminders when the service worker opens a new window.
- Fixed the Create Reminder Notes field alignment and premium textarea styling.
- Bumped the service-worker cache to RC7.

## Important platform note
This RC verifies local PWA notifications while the app/browser process remains available. Reliable notification delivery after the PWA is fully terminated requires Web Push/server scheduling or the calendar backup.
