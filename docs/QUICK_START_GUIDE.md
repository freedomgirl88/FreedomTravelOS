# Quick Start Guide — Freedom Travel OS v1.0

## Recommended extraction path
Use a short Windows path:

```text
C:\FTOS\v1
```

This avoids Windows path-too-long errors.

## Start development preview

```powershell
npm install
npm run dev
```

If PowerShell gives command separator issues, use the included scripts instead:

```text
RUN_DEV_WINDOWS.bat
RUN_DEV_POWERSHELL.ps1
BUILD_WINDOWS.bat
```

## Build production version

```powershell
npm run build
```

## What to test first
1. Open Journey.
2. Switch Light / Dark / System theme.
3. Add an expense.
4. Mark an Explore place as visited.
5. Edit Flight and Hotel details.
6. Check Packing progress.
7. Add a Booking price check.
