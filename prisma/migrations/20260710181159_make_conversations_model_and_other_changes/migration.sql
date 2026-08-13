/*
  Warnings:

  - You are about to drop the column `tripId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `conversationId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Create the Conversation table first
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tripId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- Create unique index required by schema.prisma
CREATE UNIQUE INDEX "Conversation_tripId_key" ON "Conversation"("tripId");

-- Step 2: Add Conversation foreign keys
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Step 3: Add conversationId to Message as a NULLABLE column initially
ALTER TABLE "Message" ADD COLUMN "conversationId" TEXT;

-- Step 4: Seed a Conversation for every unique tripId that has existing messages
-- Pulls the correct userId from the Trip record to satisfy the foreign key
INSERT INTO "Conversation" ("id", "userId", "tripId", "createdAt", "updatedAt")
SELECT 
    md5(concat('conv-', m."tripId"))::text, 
    t."userId",
    m."tripId", 
    NOW(), 
    NOW()
FROM "Message" m
JOIN "Trip" t ON m."tripId" = t."id"
WHERE m."tripId" IS NOT NULL
ON CONFLICT ("tripId") DO NOTHING;

-- Step 5: Backfill conversationId into the Message table using the same deterministic IDs
UPDATE "Message"
SET "conversationId" = md5(concat('conv-', "tripId"))::text
WHERE "tripId" IS NOT NULL;

-- Step 6: Validate that no messages linked to trips were left unmapped
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "Message" WHERE "tripId" IS NOT NULL AND "conversationId" IS NULL) THEN
        RAISE EXCEPTION 'Validation failed: Messages exist with a tripId but could not be mapped to a conversationId.';
    END IF;
END $$;

-- Step 7: Enforce NOT NULL now that data is populated and verified
ALTER TABLE "Message" ALTER COLUMN "conversationId" SET NOT NULL;

-- Step 8: Add the new foreign key to Message
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 9: Drop the obsolete column and constraint from Message
ALTER TABLE "Message" DROP CONSTRAINT "Message_tripId_fkey";
ALTER TABLE "Message" DROP COLUMN "tripId";

-- Step 10: Run the remaining TripVersion relationship updates from the original file
ALTER TABLE "TripVersion" DROP CONSTRAINT "TripVersion_tripId_fkey";
ALTER TABLE "TripVersion" ADD CONSTRAINT "TripVersion_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
