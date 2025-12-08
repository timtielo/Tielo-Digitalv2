#!/bin/bash

# List of pages to update (excluding DashboardHome and LeadsPage which are already done)
PAGES=(
  "ProfilePage"
  "PortfolioPage"
  "ReviewsPage"
  "WerkspotPage"
  "AdminPage"
  "MissionControlPage"
  "ProjectsManagementPage"
  "ProjectTasksManagementPage"
)

for PAGE in "${PAGES[@]}"; do
  FILE="src/pages/Dashboard/${PAGE}.tsx"

  if [ -f "$FILE" ]; then
    echo "Updating $PAGE..."

    # 1. Replace AuroraBackground import with DashboardLayout and Card
    sed -i "s/import { AuroraBackground } from '..\/..\/components\/ui\/aurora-bento-grid';/import { DashboardLayout } from '..\/..\/components\/Dashboard\/DashboardLayout';\nimport { Card } from '..\/..\/components\/ui\/Card';/" "$FILE"

    # 2. Remove handleBackToDashboard function (remove lines containing it)
    sed -i '/const handleBackToDashboard = () => {/,/};/d' "$FILE"

    # 3. Remove back button JSX
    sed -i '/<button$/,/button>/{ /onClick={handleBackToDashboard}/,/button>/d }' "$FILE"
    sed -i '/← Terug naar Dashboard/d' "$FILE"

    echo "  - Updated imports and removed back button"
  else
    echo "File not found: $FILE"
  fi
done

echo "Done! Please manually update the JSX wrappers and color themes."
