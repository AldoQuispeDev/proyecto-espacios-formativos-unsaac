/*
  Warnings:

  - Added the required column `apellidoMaterno` to the `Matricula` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apellidoPaterno` to the `Matricula` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dni` to the `Matricula` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `Matricula` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefono` to the `Matricula` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `matricula` DROP FOREIGN KEY `Matricula_estudianteId_fkey`;

-- DropIndex
DROP INDEX `Matricula_estudianteId_fkey` ON `matricula`;

-- AlterTable
ALTER TABLE `matricula` ADD COLUMN `apellidoMaterno` VARCHAR(191) NOT NULL,
    ADD COLUMN `apellidoPaterno` VARCHAR(191) NOT NULL,
    ADD COLUMN `dni` VARCHAR(191) NOT NULL,
    ADD COLUMN `nombre` VARCHAR(191) NOT NULL,
    ADD COLUMN `nombreApoderado` VARCHAR(191) NULL,
    ADD COLUMN `telefono` VARCHAR(191) NOT NULL,
    ADD COLUMN `telefonoApoderado` VARCHAR(191) NULL,
    MODIFY `estudianteId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Matricula` ADD CONSTRAINT `Matricula_estudianteId_fkey` FOREIGN KEY (`estudianteId`) REFERENCES `Estudiante`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
