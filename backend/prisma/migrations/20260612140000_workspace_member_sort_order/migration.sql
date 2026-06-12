ALTER TABLE "WorkspaceMember" ADD COLUMN "sort_order" INTEGER NOT NULL DEFAULT 0;

WITH ranked AS (
  SELECT
    wm.id,
    ROW_NUMBER() OVER (
      PARTITION BY wm.user_id
      ORDER BY w.updated_at DESC, w.id DESC
    ) - 1 AS rn
  FROM "WorkspaceMember" wm
  INNER JOIN "Workspace" w ON w.id = wm.workspace_id
)
UPDATE "WorkspaceMember" wm
SET sort_order = ranked.rn
FROM ranked
WHERE wm.id = ranked.id;
