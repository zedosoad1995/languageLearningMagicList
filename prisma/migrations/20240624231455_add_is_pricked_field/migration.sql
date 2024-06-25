/*
  Warnings:

  - Added the required column `is_picked` to the `Word` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "is_picked" BOOLEAN NOT NULL;
