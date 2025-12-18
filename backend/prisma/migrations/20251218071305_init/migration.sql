/*
  Warnings:

  - You are about to drop the column `procedenciaColegio` on the `matricula` table. All the data in the column will be lost.
  - You are about to drop the column `turno` on the `matricula` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dni]` on the table `Matricula` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dni` to the `Matricula` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `matricula` DROP FOREIGN KEY `Matricula_estudianteId_fkey`;

-- DropIndex
DROP INDEX `Matricula_estudianteId_fkey` ON `matricula`;

-- AlterTable
ALTER TABLE `matricula` DROP COLUMN `procedenciaColegio`,
    DROP COLUMN `turno`,
    ADD COLUMN `apellidoMaterno` VARCHAR(191) NULL,
    ADD COLUMN `apellidoPaterno` VARCHAR(191) NULL,
    ADD COLUMN `colegioProcedencia` VARCHAR(191) NULL,
    ADD COLUMN `dni` VARCHAR(191) NOT NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `nombre` VARCHAR(191) NULL,
    ADD COLUMN `telefono` VARCHAR(191) NULL,
    MODIFY `estudianteId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Matricula_dni_key` ON `Matricula`(`dni`);

-- AddForeignKey
ALTER TABLE `Matricula` ADD CONSTRAINT `Matricula_estudianteId_fkey` FOREIGN KEY (`estudianteId`) REFERENCES `Estudiante`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
