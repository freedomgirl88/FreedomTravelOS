# Release upload scripts

Two helper scripts to upload a release asset to a GitHub release by tag.

PowerShell (Windows):

```powershell
$env:GITHUB_TOKEN = "ghp_xxx"
.\scripts\upload_release_asset.ps1 -Repo "freedomgirl88/FreedomTravelOS" -Tag "v1.0.0" -File "release/FreedomTravelOS_v1.0.0_web.zip"
```

Bash (macOS / Linux / WSL):

```bash
export GITHUB_TOKEN=ghp_xxx
./scripts/upload_release_asset.sh freedomgirl88/FreedomTravelOS v1.0.0 release/FreedomTravelOS_v1.0.0_web.zip
```

Notes:
- The scripts require that the release (tag) already exists on GitHub.
- The token must have `repo` scope to upload assets to releases.
- The Bash script uses `curl` and `file` (for MIME type detection). Install `jq` if you prefer JSON parsing enhancements.
