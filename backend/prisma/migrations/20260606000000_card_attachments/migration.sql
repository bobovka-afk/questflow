CREATE TYPE "CardAttachmentKind" AS ENUM ('FILE', 'LINK');

CREATE TABLE "CardAttachment" (
    "id" SERIAL NOT NULL,
    "card_id" INTEGER NOT NULL,
    "uploader_id" INTEGER NOT NULL,
    "kind" "CardAttachmentKind" NOT NULL,
    "file_name" TEXT NOT NULL,
    "mime_type" TEXT,
    "size_bytes" INTEGER,
    "storage_path" TEXT,
    "preview_path" TEXT,
    "external_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CardAttachment_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Card" ADD COLUMN "cover_attachment_id" INTEGER;

CREATE UNIQUE INDEX "Card_cover_attachment_id_key" ON "Card"("cover_attachment_id");
CREATE INDEX "CardAttachment_card_id_idx" ON "CardAttachment"("card_id");

ALTER TABLE "CardAttachment" ADD CONSTRAINT "CardAttachment_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CardAttachment" ADD CONSTRAINT "CardAttachment_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Card" ADD CONSTRAINT "Card_cover_attachment_id_fkey" FOREIGN KEY ("cover_attachment_id") REFERENCES "CardAttachment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
