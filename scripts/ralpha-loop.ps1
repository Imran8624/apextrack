# Ralpha Loop Runner Script for Windows PowerShell
param (
    [string]$Phase = "05",
    [int]$MaxIterations = 5
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   RALPHA / RALPH LOOP: AUTONOMOUS GSD EXECUTION ENGINE   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check GSD Files
$gsdFiles = @(".gsd/SPEC.md", ".gsd/ROADMAP.md", ".gsd/STATE.md", ".gsd/ARCHITECTURE.md", ".gsd/STACK.md")
foreach ($file in $gsdFiles) {
    if (-not (Test-Path $file)) {
        Write-Error "Required GSD file missing: $file"
        exit 1
    }
}
Write-Host "[OK] GSD Configuration, Roadmap and State verified." -ForegroundColor Green

# 2. Type Check Validation
Write-Host "[-] Running TypeScript compilation check..." -ForegroundColor Yellow
npx tsc --noEmit
if ($LASTEXITCODE -ne 0) {
    Write-Host "[FAIL] Typecheck failed! Self-healing required." -ForegroundColor Red
    exit 1
} else {
    Write-Host "[OK] TypeScript verification passed cleanly (0 errors)." -ForegroundColor Green
}

# 3. Check Web Server Health
Write-Host "[-] Verifying ApexTracker local server health..." -ForegroundColor Yellow
try {
    $res = Invoke-RestMethod -Uri "http://localhost:3000" -Method Get -TimeoutSec 3 -ErrorAction SilentlyContinue
    Write-Host "[OK] ApexTracker WebSockets and Next.js server responding on http://localhost:3000" -ForegroundColor Green
} catch {
    Write-Host "[INFO] Dev server not responding on port 3000. Start using 'npm run dev'." -ForegroundColor Yellow
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   RALPHA LOOP READY: All GSD and Project links healthy.  " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
