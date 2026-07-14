# Known Bugs / Platform Limits

## No blocking application bugs found during production build.

## Notification platform limitation
A fully closed PWA cannot guarantee exact future notification delivery without a remote Web Push service. v1.1 checks and issues scheduled reminders while the installed PWA/service worker is active and provides an `.ics` calendar backup for flight-critical timing. Users should keep phone calendar/alarm backups enabled.

## Migration note
Existing local-storage data from older versions may continue to show old values. Use Settings → Reset data once after installing v1.1 if confirmed defaults do not appear.
