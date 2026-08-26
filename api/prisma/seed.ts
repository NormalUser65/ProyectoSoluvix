import { prisma } from "../src/config/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Iniciando seed...");

  await prisma.servicioEspecialidad.deleteMany();
  await prisma.profesionalEspecialidad.deleteMany();
  await prisma.resena.deleteMany();
  await prisma.historialEstadoCita.deleteMany();
  await prisma.cita.deleteMany();
  await prisma.servicio.deleteMany();
  await prisma.perfilProfesional.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.especialidad.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.estadoCita.deleteMany();
  await prisma.modalidad.deleteMany();
  await prisma.rol.deleteMany();

  // Roles
  await prisma.rol.createMany({
    data: [
      { nombre: "ADMIN" },
      { nombre: "PROFESIONAL" },
      { nombre: "CLIENTE" }
    ]
  });

  const roles = await prisma.rol.findMany();
  const rolMap = Object.fromEntries(roles.map(r => [r.nombre, r.id]));

  // Modalidades
  await prisma.modalidad.createMany({
    data: [
      { nombre: "VIRTUAL" },
      { nombre: "PRESENCIAL" },
      { nombre: "MIXTA" }
    ]
  });

  const modalidades = await prisma.modalidad.findMany();
  const modalidadMap = Object.fromEntries(modalidades.map(m => [m.nombre, m.id]));

  // Estados de Cita
  await prisma.estadoCita.createMany({
    data: [
      { nombre: "PENDIENTE" },
      { nombre: "ACEPTADA" },
      { nombre: "RECHAZADA" },
      { nombre: "CANCELADA" },
      { nombre: "COMPLETADA" }
    ]
  });

  const estados = await prisma.estadoCita.findMany();
  const estadoMap = Object.fromEntries(estados.map(e => [e.nombre, e.id]));

  // Categorías (4)
  await prisma.categoria.createMany({
    data: [
      { nombre: "Fotografía de Bodas", descripcion: "Cobertura profesional de bodas", estado: true },
      { nombre: "Fotografía de Retrato", descripcion: "Sesiones personales y familiares", estado: true },
      { nombre: "Fotografía Comercial", descripcion: "Fotografía para empresas y marcas", estado: true },
      { nombre: "Fotografía de Eventos", descripcion: "Eventos sociales y corporativos", estado: false }
    ]
  });

  const categorias = await prisma.categoria.findMany();
  const catMap = Object.fromEntries(categorias.map(c => [c.nombre, c.id]));

  // Especialidades (3)
  await prisma.especialidad.createMany({
    data: [
      { nombre: "Retrato", descripcion: "Fotografía de personas", estado: true },
      { nombre: "Iluminación Profesional", descripcion: "Uso avanzado de iluminación", estado: true },
      { nombre: "Edición Lightroom", descripcion: "Revelado fotográfico", estado: false }
    ]
  });

  const especialidades = await prisma.especialidad.findMany();
  const espMap = Object.fromEntries(especialidades.map(e => [e.nombre, e.id]));

  // Usuarios (10)
  const hash = await bcrypt.hash("123456", 10);

  await prisma.usuario.createMany({
    data: [
      { nombre: "Administrador", apellidos: "Soluvix", correo: "admin@soluvix.com", contrasenna: hash, telefono: "8888-0000", estado: true, idRol: rolMap["ADMIN"] },
      { nombre: "Ana", apellidos: "Lopez", correo: "ana@email.com", contrasenna: hash, telefono: "8888-1001", estado: true, idRol: rolMap["CLIENTE"] },
      { nombre: "Mariana", apellidos: "Jimenez", correo: "mariana@email.com", contrasenna: hash, telefono: "8888-1002", estado: true, idRol: rolMap["CLIENTE"] },
      { nombre: "Luis", apellidos: "Fernandez", correo: "luis@email.com", contrasenna: hash, telefono: "8888-1003", estado: true, idRol: rolMap["CLIENTE"] },
      { nombre: "Elena", apellidos: "Garcia", correo: "elena@email.com", contrasenna: hash, telefono: "8888-1004", estado: false, idRol: rolMap["CLIENTE"] },
      { nombre: "Pablo", apellidos: "Rojas", correo: "pablo@email.com", contrasenna: hash, telefono: "8888-1005", estado: true, idRol: rolMap["CLIENTE"] },
      { nombre: "Carlos", apellidos: "Ramirez", correo: "carlos@email.com", contrasenna: hash, telefono: "8888-2001", estado: true, idRol: rolMap["PROFESIONAL"] },
      { nombre: "Laura", apellidos: "Soto", correo: "laura@email.com", contrasenna: hash, telefono: "8888-2002", estado: true, idRol: rolMap["PROFESIONAL"] },
      { nombre: "Daniel", apellidos: "Mora", correo: "daniel@email.com", contrasenna: hash, telefono: "8888-2003", estado: true, idRol: rolMap["PROFESIONAL"] },
      { nombre: "Andres", apellidos: "Vargas", correo: "andres@email.com", contrasenna: hash, telefono: "8888-2004", estado: false, idRol: rolMap["PROFESIONAL"] }
    ]
  });

  const usuarios = await prisma.usuario.findMany();
  const userMap = Object.fromEntries(usuarios.map(u => [u.correo, u.id]));

  // Perfiles Profesionales (5)
  await prisma.perfilProfesional.createMany({
    data: [
      { idUsuario: userMap["carlos@email.com"], tituloProfesional: "Fotógrafo de Bodas", descripcion: "Especialista en bodas y eventos", annosExperiencia: 5, idModalidad: modalidadMap["MIXTA"], provincia: "San Jose", canton: "Central", distrito: "Carmen", tarifaBase: 120, disponible: true, imagenPerfil: "carlos_profile.jpg" },
      { idUsuario: userMap["laura@email.com"], tituloProfesional: "Fotógrafa de Retrato", descripcion: "Sesiones personales y familiares", annosExperiencia: 4, idModalidad: modalidadMap["VIRTUAL"], provincia: "Alajuela", canton: "Central", distrito: "San Jose", tarifaBase: 90, disponible: true, imagenPerfil: "laura_profile.jpg" },
      { idUsuario: userMap["daniel@email.com"], tituloProfesional: "Fotógrafo Comercial", descripcion: "Especialista en fotografía para marcas y empresas", annosExperiencia: 6, idModalidad: modalidadMap["PRESENCIAL"], provincia: "Heredia", canton: "Heredia", distrito: "Mercedes", tarifaBase: 150, disponible: true, imagenPerfil: "daniel_profile.jpg" },
      { idUsuario: userMap["andres@email.com"], tituloProfesional: "Fotógrafo de Eventos", descripcion: "Cobertura de eventos sociales y corporativos", annosExperiencia: 7, idModalidad: modalidadMap["PRESENCIAL"], provincia: "San Jose", canton: "Escazu", distrito: "San Rafael", tarifaBase: 175, disponible: false, imagenPerfil: "andres_profile.jpg" },
      { idUsuario: userMap["ana@email.com"], tituloProfesional: "Fotógrafa de Producto", descripcion: "Fotografía profesional para catálogos y ecommerce", annosExperiencia: 3, idModalidad: modalidadMap["MIXTA"], provincia: "Cartago", canton: "Central", distrito: "Oriental", tarifaBase: 110, disponible: true, imagenPerfil: "ana_profile.jpg" }
    ]
  });

  const perfiles = await prisma.perfilProfesional.findMany();
  const perfilMap = Object.fromEntries(perfiles.map(p => [p.tituloProfesional, p.id]));

  // Profesional_Especialidad
  await prisma.profesionalEspecialidad.createMany({
    data: [
      { idPerfil: perfilMap["Fotógrafo de Bodas"], idEspecialidad: espMap["Retrato"] },
      { idPerfil: perfilMap["Fotógrafo de Bodas"], idEspecialidad: espMap["Iluminación Profesional"] },
      { idPerfil: perfilMap["Fotógrafa de Retrato"], idEspecialidad: espMap["Retrato"] },
      { idPerfil: perfilMap["Fotógrafa de Retrato"], idEspecialidad: espMap["Edición Lightroom"] },
      { idPerfil: perfilMap["Fotógrafo Comercial"], idEspecialidad: espMap["Iluminación Profesional"] },
      { idPerfil: perfilMap["Fotógrafo de Eventos"], idEspecialidad: espMap["Retrato"] },
      { idPerfil: perfilMap["Fotógrafa de Producto"], idEspecialidad: espMap["Edición Lightroom"] }
    ]
  });

  // Servicios (8)
  await prisma.servicio.createMany({
    data: [
      { idPerfil: perfilMap["Fotógrafo de Bodas"], idCategoria: catMap["Fotografía de Bodas"], idModalidad: modalidadMap["PRESENCIAL"], nombre: "Cobertura de Boda Básica", descripcion: "Cobertura de ceremonia", precio: 300, duracionEstimada: 5, estado: true },
      { idPerfil: perfilMap["Fotógrafo de Bodas"], idCategoria: catMap["Fotografía de Bodas"], idModalidad: modalidadMap["PRESENCIAL"], nombre: "Cobertura de Boda Completa", descripcion: "Cobertura de preparación, ceremonia y recepción", precio: 650, duracionEstimada: 10, estado: true },
      { idPerfil: perfilMap["Fotógrafa de Retrato"], idCategoria: catMap["Fotografía de Retrato"], idModalidad: modalidadMap["VIRTUAL"], nombre: "Sesión Familiar Virtual", descripcion: "Sesión familiar por videollamada", precio: 80, duracionEstimada: 1, estado: false },
      { idPerfil: perfilMap["Fotógrafa de Retrato"], idCategoria: catMap["Fotografía de Retrato"], idModalidad: modalidadMap["PRESENCIAL"], nombre: "Sesión de Retrato Individual", descripcion: "Sesión profesional de retrato en exteriores", precio: 85, duracionEstimada: 1, estado: true },
      { idPerfil: perfilMap["Fotógrafo Comercial"], idCategoria: catMap["Fotografía Comercial"], idModalidad: modalidadMap["MIXTA"], nombre: "Fotografía Corporativa", descripcion: "Fotografías para empresas y equipos de trabajo", precio: 250, duracionEstimada: 3, estado: true },
      { idPerfil: perfilMap["Fotógrafo Comercial"], idCategoria: catMap["Fotografía Comercial"], idModalidad: modalidadMap["PRESENCIAL"], nombre: "Campaña Publicitaria", descripcion: "Producción fotográfica para publicidad", precio: 450, duracionEstimada: 6, estado: true },
      { idPerfil: perfilMap["Fotógrafa de Producto"], idCategoria: catMap["Fotografía Comercial"], idModalidad: modalidadMap["PRESENCIAL"], nombre: "Catálogo de Productos", descripcion: "Fotografía de hasta 10 productos", precio: 180, duracionEstimada: 3, estado: true },
      { idPerfil: perfilMap["Fotógrafo de Eventos"], idCategoria: catMap["Fotografía de Eventos"], idModalidad: modalidadMap["PRESENCIAL"], nombre: "Cobertura de Evento", descripcion: "Cobertura profesional de eventos", precio: 350, duracionEstimada: 5, estado: false }
    ]
  });

  const servicios = await prisma.servicio.findMany();
  const servicioMap = Object.fromEntries(servicios.map(s => [s.nombre, s.id]));

  // Servicio_Especialidad
  await prisma.servicioEspecialidad.createMany({
    data: [
      { idServicio: servicioMap["Cobertura de Boda Básica"], idEspecialidad: espMap["Retrato"] },
      { idServicio: servicioMap["Sesión de Retrato Individual"], idEspecialidad: espMap["Retrato"] },
      { idServicio: servicioMap["Fotografía Corporativa"], idEspecialidad: espMap["Iluminación Profesional"] },
      { idServicio: servicioMap["Catálogo de Productos"], idEspecialidad: espMap["Edición Lightroom"] }
    ]
  });

  // Citas (8)
  await prisma.cita.createMany({
    data: [
      // Cita 1 - COMPLETADA CON RESEÑA
      {
        idCliente: userMap["ana@email.com"],
        idProfesional: perfilMap["Fotógrafo de Bodas"],
        idServicio: servicioMap["Cobertura de Boda Básica"],
        idModalidad: modalidadMap["PRESENCIAL"],
        idEstado: estadoMap["COMPLETADA"],
        fechaCita: new Date("2026-07-15T00:00:00"),
        horaInicio: new Date("2026-07-15T10:00:00"),
        horaFin: new Date("2026-07-15T15:00:00"),
        comentarioCliente: "Excelente trabajo, muy profesionales",
        montoEstimado: 300
      },
      // Cita 2 - COMPLETADA CON RESEÑA
      {
        idCliente: userMap["mariana@email.com"],
        idProfesional: perfilMap["Fotógrafa de Retrato"],
        idServicio: servicioMap["Sesión de Retrato Individual"],
        idModalidad: modalidadMap["PRESENCIAL"],
        idEstado: estadoMap["COMPLETADA"],
        fechaCita: new Date("2026-07-10T00:00:00"),
        horaInicio: new Date("2026-07-10T14:00:00"),
        horaFin: new Date("2026-07-10T15:00:00"),
        comentarioCliente: "Necesito las fotos para mi portafolio",
        montoEstimado: 85
      },
      // Cita 3 - COMPLETADA SIN RESEÑA
      {
        idCliente: userMap["luis@email.com"],
        idProfesional: perfilMap["Fotógrafo Comercial"],
        idServicio: servicioMap["Fotografía Corporativa"],
        idModalidad: modalidadMap["MIXTA"],
        idEstado: estadoMap["COMPLETADA"],
        fechaCita: new Date("2026-07-20T00:00:00"),
        horaInicio: new Date("2026-07-20T09:00:00"),
        horaFin: new Date("2026-07-20T12:00:00"),
        comentarioCliente: "Fotos para el sitio web de la empresa",
        montoEstimado: 250
      },
      // Cita 4 - COMPLETADA SIN RESEÑA
      {
        idCliente: userMap["pablo@email.com"],
        idProfesional: perfilMap["Fotógrafa de Producto"],
        idServicio: servicioMap["Catálogo de Productos"],
        idModalidad: modalidadMap["PRESENCIAL"],
        idEstado: estadoMap["COMPLETADA"],
        fechaCita: new Date("2026-08-01T00:00:00"),
        horaInicio: new Date("2026-08-01T13:00:00"),
        horaFin: new Date("2026-08-01T16:00:00"),
        comentarioCliente: "Fotografía de productos para tienda online",
        montoEstimado: 180
      },
      // Cita 5 - PENDIENTE
      {
        idCliente: userMap["ana@email.com"],
        idProfesional: perfilMap["Fotógrafo Comercial"],
        idServicio: servicioMap["Campaña Publicitaria"],
        idModalidad: modalidadMap["PRESENCIAL"],
        idEstado: estadoMap["PENDIENTE"],
        fechaCita: new Date("2026-08-25T00:00:00"),
        horaInicio: new Date("2026-08-25T10:00:00"),
        horaFin: new Date("2026-08-25T16:00:00"),
        comentarioCliente: "Lanzamiento de nueva marca",
        montoEstimado: 450
      },
      // Cita 6 - ACEPTADA
      {
        idCliente: userMap["mariana@email.com"],
        idProfesional: perfilMap["Fotógrafo de Bodas"],
        idServicio: servicioMap["Cobertura de Boda Completa"],
        idModalidad: modalidadMap["PRESENCIAL"],
        idEstado: estadoMap["ACEPTADA"],
        fechaCita: new Date("2026-09-05T00:00:00"),
        horaInicio: new Date("2026-09-05T08:00:00"),
        horaFin: new Date("2026-09-05T18:00:00"),
        comentarioCliente: "Boda en finca con 100 invitados",
        montoEstimado: 650
      },
      // Cita 7 - RECHAZADA
      {
        idCliente: userMap["luis@email.com"],
        idProfesional: perfilMap["Fotógrafa de Retrato"],
        idServicio: servicioMap["Sesión de Retrato Individual"],
        idModalidad: modalidadMap["PRESENCIAL"],
        idEstado: estadoMap["RECHAZADA"],
        fechaCita: new Date("2026-07-05T00:00:00"),
        horaInicio: new Date("2026-07-05T15:00:00"),
        horaFin: new Date("2026-07-05T16:00:00"),
        comentarioCliente: "Sesión para redes sociales",
        comentarioProfesional: "No tengo disponibilidad para esa fecha",
        montoEstimado: 85
      },
      // Cita 8 - CANCELADA
      {
        idCliente: userMap["pablo@email.com"],
        idProfesional: perfilMap["Fotógrafo de Eventos"],
        idServicio: servicioMap["Cobertura de Evento"],
        idModalidad: modalidadMap["PRESENCIAL"],
        idEstado: estadoMap["CANCELADA"],
        fechaCita: new Date("2026-07-28T00:00:00"),
        horaInicio: new Date("2026-07-28T09:00:00"),
        horaFin: new Date("2026-07-28T14:00:00"),
        comentarioCliente: "Cancelado por cambio de fecha del evento",
        comentarioProfesional: "El cliente canceló con anticipación",
        montoEstimado: 350
      }
    ]
  });

  const citas = await prisma.cita.findMany();

  // Historial de Estados
  const historialData = citas.map(cita => ({
    idCita: cita.id,
    idEstadoAnterior: null,
    idEstadoNuevo: cita.idEstado,
    comentario: "Cita creada"
  }));

  await prisma.historialEstadoCita.createMany({
    data: historialData
  });

  // Reseñas (3)
  await prisma.resena.createMany({
    data: [
      {
        idCita: citas[0].id,
        idCliente: userMap["ana@email.com"],
        idProfesional: perfilMap["Fotógrafo de Bodas"],
        puntuacion: 5,
        comentario: "Excelente trabajo, muy profesionales y puntuales. Las fotos quedaron increíbles."
      },
      {
        idCita: citas[5].id,
        idCliente: userMap["mariana@email.com"],
        idProfesional: perfilMap["Fotógrafo de Bodas"],
        puntuacion: 4,
        comentario: "Muy buen trabajo, aunque la entrega fue un poco tardía. La calidad es excelente."
      },
      {
        idCita: citas[1].id,
        idCliente: userMap["mariana@email.com"],
        idProfesional: perfilMap["Fotógrafa de Retrato"],
        puntuacion: 3,
        comentario: "Las fotos son buenas, pero la sesión fue muy corta para lo que necesitaba."
      }
    ]
  });

  console.log("Seed completado con éxito.");
  console.log("Resumen:");
  console.log(`  Usuarios: ${await prisma.usuario.count()}`);
  console.log(`  Perfiles: ${await prisma.perfilProfesional.count()}`);
  console.log(`  Servicios: ${await prisma.servicio.count()}`);
  console.log(`  Categorías: ${await prisma.categoria.count()}`);
  console.log(`  Especialidades: ${await prisma.especialidad.count()}`);
  console.log(`  Citas: ${await prisma.cita.count()}`);
  console.log(`  Reseñas: ${await prisma.resena.count()}`);
}

main()
  .catch(e => {
    console.error("Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });