# Schedule Template

This folder is a self-contained template for a course schedule with a single source of truth for both the on-screen table and the PDF export.

## How to run

```bash
npm install
npm run dev
```

## How to update the schedule

1. Open `src/data/schedule.js`.
2. Update `courseMeta` (title, term, instructor, modules).
3. Update `scheduleRows` (each row is one session or a break).
4. Save and reload the app.

The Download PDF button uses the same data, so there is nothing extra to update.

## Data rules

- `kind: "session"` rows are regular classes.
- `kind: "break"` rows are holiday or no-class entries.
- Use ISO dates (`YYYY-MM-DD`). Day of week and display date are computed automatically.
- Use `lectures`, `recordings`, and `assignments` arrays for links or labels.

## PDF export

The PDF export is the same page in print mode:
- Click **Download PDF** to open the print dialog.
- Choose "Save as PDF".

Print styles are in `src/index.css` and do not require a second table.

## Suggested workflow for new courses

1. Copy this folder into a new repo or course folder.
2. Update `courseMeta` and `scheduleRows`.
3. Replace placeholder links.
4. Run and export your PDF.
