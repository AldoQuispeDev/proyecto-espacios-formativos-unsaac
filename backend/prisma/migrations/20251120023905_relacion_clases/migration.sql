-- CreateTable
CREATE TABLE `Aula` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `capacidad` INTEGER NULL,

    UNIQUE INDEX `Aula_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Clase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `docenteId` INTEGER NOT NULL,
    `asignaturaId` INTEGER NOT NULL,
    `grupoId` INTEGER NOT NULL,
    `aulaId` INTEGER NOT NULL,
    `dia` VARCHAR(191) NOT NULL,
    `horaInicio` DATETIME(3) NOT NULL,
    `horaFin` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Clase_aulaId_dia_horaInicio_key`(`aulaId`, `dia`, `horaInicio`),
    UNIQUE INDEX `Clase_docenteId_dia_horaInicio_key`(`docenteId`, `dia`, `horaInicio`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Clase` ADD CONSTRAINT `Clase_docenteId_fkey` FOREIGN KEY (`docenteId`) REFERENCES `Docente`(`usuarioId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clase` ADD CONSTRAINT `Clase_asignaturaId_fkey` FOREIGN KEY (`asignaturaId`) REFERENCES `Asignatura`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clase` ADD CONSTRAINT `Clase_grupoId_fkey` FOREIGN KEY (`grupoId`) REFERENCES `Grupo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clase` ADD CONSTRAINT `Clase_aulaId_fkey` FOREIGN KEY (`aulaId`) REFERENCES `Aula`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
