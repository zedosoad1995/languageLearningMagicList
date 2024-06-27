/*
  Warnings:

  - You are about to drop the column `training_num_tries` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `training_try_num_seen` on the `Word` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "training_num_tries",
ADD COLUMN     "training_try_num" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Word" DROP COLUMN "training_try_num_seen",
ADD COLUMN     "last_training_try" INTEGER NOT NULL DEFAULT 0;
