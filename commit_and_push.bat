@echo off
echo ========================================================
echo   ReviewPilot Phase 1 - Git Commit & Push
echo ========================================================
cd /d "E:\ReviewPilot"

echo [1/3] Checking git status...
git status

echo.
echo [2/3] Adding files to staging...
git add .

echo.
echo [3/3] Committing changes...
git commit -m "feat(phase-1): repository audit, SaaS architecture, premium UI, and automated QA foundation"

echo.
echo Pushing to GitHub (origin main)...
git push origin main

echo.
echo ========================================================
echo   Completed successfully!
echo ========================================================
pause

