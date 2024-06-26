-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "training_num_tries" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Training" (
    "id" TEXT NOT NULL,
    "seen_at_try_num" INTEGER NOT NULL DEFAULT 0,
    "word_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Training_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Training_word_id_key" ON "Training"("word_id");

-- AddForeignKey
ALTER TABLE "Training" ADD CONSTRAINT "Training_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
