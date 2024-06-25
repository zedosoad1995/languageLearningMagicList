/*
  Warnings:

  - You are about to drop the column `last_picked` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Settings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `Settings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Settings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Settings" DROP CONSTRAINT "Settings_userId_fkey";

-- DropIndex
DROP INDEX "Settings_userId_key";

-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "last_picked",
DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD COLUMN     "words_picked_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_user_id_key" ON "Settings"("user_id");

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
