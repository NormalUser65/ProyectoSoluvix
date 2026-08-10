-- CreateTable
CREATE TABLE `roles` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `roles_nombre_key`(`nombre`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `modalidades` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `modalidades_nombre_key`(`nombre`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estados_cita` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `estados_cita_nombre_key`(`nombre`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `apellidos` VARCHAR(100) NOT NULL,
    `correo` VARCHAR(150) NOT NULL,
    `contrasenna` VARCHAR(255) NOT NULL,
    `telefono` VARCHAR(20) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `fecha_registro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `IDRol` INTEGER NOT NULL,

    UNIQUE INDEX `usuarios_correo_key`(`correo`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfiles_profesionales` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `IDUsuario` INTEGER NOT NULL,
    `IDModalidad` INTEGER NULL,
    `titulo_profesional` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `annos_experiencia` INTEGER NULL,
    `provincia` VARCHAR(191) NULL,
    `canton` VARCHAR(191) NULL,
    `distrito` VARCHAR(191) NULL,
    `tarifa_base` DECIMAL(65, 30) NULL,
    `disponible` BOOLEAN NOT NULL DEFAULT true,
    `imagen_perfil` VARCHAR(191) NULL,

    UNIQUE INDEX `perfiles_profesionales_IDUsuario_key`(`IDUsuario`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categorias` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `especialidades` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profesional_especialidad` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `IDPerfil` INTEGER NOT NULL,
    `IDEspecialidad` INTEGER NOT NULL,

    UNIQUE INDEX `profesional_especialidad_IDPerfil_IDEspecialidad_key`(`IDPerfil`, `IDEspecialidad`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicios` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `IDPerfil` INTEGER NOT NULL,
    `IDCategoria` INTEGER NOT NULL,
    `IDModalidad` INTEGER NOT NULL,
    `nombre` VARCHAR(150) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `precio` DECIMAL(10, 2) NOT NULL,
    `duracion_estimada` INTEGER NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicio_especialidad` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `IDServicio` INTEGER NOT NULL,
    `IDEspecialidad` INTEGER NOT NULL,

    UNIQUE INDEX `servicio_especialidad_IDServicio_IDEspecialidad_key`(`IDServicio`, `IDEspecialidad`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `citas` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `IDCliente` INTEGER NOT NULL,
    `IDProfesional` INTEGER NOT NULL,
    `IDServicio` INTEGER NOT NULL,
    `IDModalidad` INTEGER NOT NULL,
    `IDEstado` INTEGER NOT NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_cita` DATETIME(3) NOT NULL,
    `hora_inicio` DATETIME(3) NOT NULL,
    `hora_fin` DATETIME(3) NOT NULL,
    `comentario_cliente` VARCHAR(191) NULL,
    `comentario_profesional` VARCHAR(191) NULL,
    `monto_estimado` DECIMAL(10, 2) NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historial_estados_cita` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `IDCita` INTEGER NOT NULL,
    `IDEstadoAnterior` INTEGER NULL,
    `IDEstadoNuevo` INTEGER NOT NULL,
    `fecha_cambio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `comentario` VARCHAR(191) NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resenas` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `IDCita` INTEGER NOT NULL,
    `IDCliente` INTEGER NOT NULL,
    `IDProfesional` INTEGER NOT NULL,
    `puntuacion` INTEGER NOT NULL,
    `comentario` VARCHAR(191) NULL,
    `fecha_resenna` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `resenas_IDCita_key`(`IDCita`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_IDRol_fkey` FOREIGN KEY (`IDRol`) REFERENCES `roles`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perfiles_profesionales` ADD CONSTRAINT `perfiles_profesionales_IDUsuario_fkey` FOREIGN KEY (`IDUsuario`) REFERENCES `usuarios`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perfiles_profesionales` ADD CONSTRAINT `perfiles_profesionales_IDModalidad_fkey` FOREIGN KEY (`IDModalidad`) REFERENCES `modalidades`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profesional_especialidad` ADD CONSTRAINT `profesional_especialidad_IDPerfil_fkey` FOREIGN KEY (`IDPerfil`) REFERENCES `perfiles_profesionales`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profesional_especialidad` ADD CONSTRAINT `profesional_especialidad_IDEspecialidad_fkey` FOREIGN KEY (`IDEspecialidad`) REFERENCES `especialidades`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicios` ADD CONSTRAINT `servicios_IDPerfil_fkey` FOREIGN KEY (`IDPerfil`) REFERENCES `perfiles_profesionales`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicios` ADD CONSTRAINT `servicios_IDCategoria_fkey` FOREIGN KEY (`IDCategoria`) REFERENCES `categorias`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicios` ADD CONSTRAINT `servicios_IDModalidad_fkey` FOREIGN KEY (`IDModalidad`) REFERENCES `modalidades`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicio_especialidad` ADD CONSTRAINT `servicio_especialidad_IDServicio_fkey` FOREIGN KEY (`IDServicio`) REFERENCES `servicios`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicio_especialidad` ADD CONSTRAINT `servicio_especialidad_IDEspecialidad_fkey` FOREIGN KEY (`IDEspecialidad`) REFERENCES `especialidades`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `citas` ADD CONSTRAINT `citas_IDCliente_fkey` FOREIGN KEY (`IDCliente`) REFERENCES `usuarios`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `citas` ADD CONSTRAINT `citas_IDProfesional_fkey` FOREIGN KEY (`IDProfesional`) REFERENCES `perfiles_profesionales`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `citas` ADD CONSTRAINT `citas_IDServicio_fkey` FOREIGN KEY (`IDServicio`) REFERENCES `servicios`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `citas` ADD CONSTRAINT `citas_IDModalidad_fkey` FOREIGN KEY (`IDModalidad`) REFERENCES `modalidades`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `citas` ADD CONSTRAINT `citas_IDEstado_fkey` FOREIGN KEY (`IDEstado`) REFERENCES `estados_cita`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_estados_cita` ADD CONSTRAINT `historial_estados_cita_IDCita_fkey` FOREIGN KEY (`IDCita`) REFERENCES `citas`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_estados_cita` ADD CONSTRAINT `historial_estados_cita_IDEstadoAnterior_fkey` FOREIGN KEY (`IDEstadoAnterior`) REFERENCES `estados_cita`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_estados_cita` ADD CONSTRAINT `historial_estados_cita_IDEstadoNuevo_fkey` FOREIGN KEY (`IDEstadoNuevo`) REFERENCES `estados_cita`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resenas` ADD CONSTRAINT `resenas_IDCita_fkey` FOREIGN KEY (`IDCita`) REFERENCES `citas`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resenas` ADD CONSTRAINT `resenas_IDCliente_fkey` FOREIGN KEY (`IDCliente`) REFERENCES `usuarios`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resenas` ADD CONSTRAINT `resenas_IDProfesional_fkey` FOREIGN KEY (`IDProfesional`) REFERENCES `perfiles_profesionales`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
