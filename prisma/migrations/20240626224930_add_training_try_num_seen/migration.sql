/*
  Warnings:

  - You are about to drop the `Training` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Training" DROP CONSTRAINT "Training_word_id_fkey";

-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "training_try_num_seen" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Training";
