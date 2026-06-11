# git-sync.ps1
# Monitors the Web-Page folder and automatically commits & pushes changes to GitHub.

# Ensure we are in the correct repository directory
$RepoPath = Split-Path -Parent $MyInvocation.MyCommand.Path
if (!$RepoPath) { $RepoPath = Get-Location }
Set-Location -Path $RepoPath

Write-Host "==========================================" -ForegroundColor Green
Write-Host "  Git Auto-Sync Service Activated" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "Monitoring Path: $RepoPath" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to terminate the sync service." -ForegroundColor Yellow
Write-Host ""

while ($true) {
    # Check for any unstaged or untracked changes
    $status = git status --porcelain
    if ($status) {
        Write-Host "$(Get-Date -Format 'HH:mm:ss') - Changes detected in working directory:" -ForegroundColor Yellow
        Write-Host $status -ForegroundColor DarkGray
        
        # Debounce: wait 5 seconds to ensure active writes are completed
        Write-Host "Waiting 5 seconds to debounce..." -ForegroundColor DarkGray
        Start-Sleep -Seconds 5
        
        Write-Host "Staging changes..." -ForegroundColor Cyan
        git add -A
        
        # Verify if changes are staged
        $stagedStatus = git status --porcelain
        if ($stagedStatus) {
            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            Write-Host "Committing changes..." -ForegroundColor Cyan
            git commit -m "auto-sync: changes detected at $timestamp"
            
            Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
            git push origin main
            
            Write-Host "Successfully synced with GitHub!" -ForegroundColor Green
        } else {
            Write-Host "No changes staged to commit." -ForegroundColor DarkGray
        }
        Write-Host "------------------------------------------" -ForegroundColor Gray
    }
    
    # Poll every 10 seconds
    Start-Sleep -Seconds 10
}
