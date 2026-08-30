# Monthly Top-100 refresh for dfwgamingvillage.
#
# Runs the same steps that were done by hand the first time:
#   1. Scrape BGG's all-time ranking (with retries; BGG rate-limits)
#   2. Upgrade box art via the worker's thing endpoint
#   3. If the snapshot changed, deploy the worker and commit/push
#
# Invoked monthly by the "DFWGV-Top100-Monthly" Scheduled Task. Safe to run by
# hand any time:  powershell -ExecutionPolicy Bypass -File scripts\update-top100.ps1
# All output is appended to scripts\top100-update.log.

$ErrorActionPreference = 'Continue'
$repo = 'C:\Users\joems\OneDrive\Documents\dfwgamingvillage'
$log  = Join-Path $repo 'scripts\top100-update.log'

function Log($msg) {
  $line = "{0}  {1}" -f (Get-Date -Format 's'), $msg
  Add-Content -Path $log -Value $line
  Write-Output $line
}

Set-Location $repo
Log '=== Top-100 monthly refresh start ==='

try {
  # Stay in sync with the remote so the push at the end is a fast-forward.
  $pull = git pull --ff-only 2>&1 | Out-String
  Log ("git pull: " + $pull.Trim())

  # Refresh the Top-1000 candidates pool for the admin dashboard first (same
  # residential-IP constraint as the Top-100 scrape). Its failure should not
  # block the Top-100 flow below, and vice versa.
  $cand = node scripts\refresh-candidates.mjs 2>&1 | Out-String
  Log ("refresh-candidates: " + $cand.Trim())
  if ($LASTEXITCODE -eq 0) {
    if (git status --porcelain 'candidates.json') {
      git add 'candidates.json'
      $commitC = git commit -m ("Monthly candidates refresh ({0})" -f (Get-Date -Format 'yyyy-MM-dd')) 2>&1 | Out-String
      Log ("git commit candidates: " + $commitC.Trim())
      $pushC = git push origin main 2>&1 | Out-String
      Log ("git push candidates: " + $pushC.Trim())
    } else { Log 'Candidates snapshot unchanged.' }
  } else {
    Log 'Candidates refresh failed - keeping last snapshot, will retry next month.'
  }

  # Refresh the snapshot. refresh-top100.mjs only writes the file on success
  # (100 games scraped); if BGG keeps blocking it exits non-zero and we skip.
  $refresh = node scripts\refresh-top100.mjs 2>&1 | Out-String
  Log ("refresh-top100: " + $refresh.Trim())
  if ($LASTEXITCODE -ne 0) {
    Log 'Refresh failed (likely BGG rate-limit) — keeping last snapshot, will retry next month.'
    Log '=== refresh complete (skipped) ==='
    return
  }

  # Did the snapshot actually change?
  $changed = git status --porcelain 'cloudflare/bgg-proxy/src/top100.json'
  if (-not $changed) {
    Log 'Snapshot unchanged — nothing to deploy.'
    Log '=== refresh complete (no change) ==='
    return
  }

  Log 'Snapshot changed — deploying worker.'
  Push-Location (Join-Path $repo 'cloudflare\bgg-proxy')
  $deploy = npx --yes wrangler deploy 2>&1 | Out-String
  Pop-Location
  Log ("wrangler deploy: " + $deploy.Trim())

  git add 'cloudflare/bgg-proxy/src/top100.json'
  $commit = git commit -m ("Monthly Top 100 refresh ({0})" -f (Get-Date -Format 'yyyy-MM-dd')) 2>&1 | Out-String
  Log ("git commit: " + $commit.Trim())
  $push = git push origin main 2>&1 | Out-String
  Log ("git push: " + $push.Trim())

  Log '=== refresh complete (deployed + pushed) ==='
}
catch {
  Log ("ERROR: " + $_.Exception.Message)
  Log '=== refresh complete (error) ==='
}
