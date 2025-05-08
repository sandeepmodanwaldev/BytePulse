/*
  Warnings:

  - You are about to drop the column `codeSnippet` on the `problem` table. All the data in the column will be lost.
  - You are about to drop the column `testcase` on the `problem` table. All the data in the column will be lost.
  - Added the required column `codeSnippets` to the `problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testcases` to the `problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "problem" DROP COLUMN "codeSnippet",
DROP COLUMN "testcase",
ADD COLUMN     "codeSnippets" JSONB NOT NULL,
ADD COLUMN     "testcases" JSONB NOT NULL;
