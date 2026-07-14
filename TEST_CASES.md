# Test Cases

## Launch
- npm install
- npm run dev
- Dashboard opens without error.
- npm run build completes successfully.
- npm run check completes successfully.

## Dashboard / Journey
- Trip Health Score appears under the hero.
- Trip Health Score percentage changes when packing, budget or explore data changes.
- Readiness checklist buttons navigate to the correct modules.

## Theme
- Switch to Light in More and Settings.
- Switch to Dark in More and Settings.
- Switch to System and verify it follows device/browser theme.
- Refresh keeps selected preference.

## Budget
- Add food/Food/FOOD; all group as Food.
- Add Expense popup works and shows toast.
- Delete expense asks confirmation and shows toast.
- Budget Settings popup works.
- Refresh keeps data.

## Explore
- Switch day, favourite, mark visited, refresh.
- Search and filters work.

## Packing
- Tick/untick item, refresh.
- Add packing item and confirm toast appears.

## Booking
- Flight S$463.60 visible.
- Shilla Stay Mapo S$272 / S$136 visible.
- Previous hotel price marked unknown.
- Add/delete booking records with feedback.

## UI
- Bottom nav docked and glass-styled.
- No overlapping text.
- Dark mode cards are navy, not bright white.

## RC3 Booking regression
- Booking Add Price Check appears as an inline button after verified metrics.
- No fixed purple add button covers Verified Rules or Booking Timeline cards.
- Add Price Check opens the bottom sheet in light and dark mode.
- Booking Timeline remains readable in dark mode.
