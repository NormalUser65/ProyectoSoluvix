import { prisma } from "../src/config/prisma";

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

  // 2. DATOS BASE
await prisma.rol.createMany({
    data: [
    { nombre: "ADMIN" },
    { nombre: "PROFESIONAL" },
    { nombre: "CLIENTE" }
    ]
});

const roles = await prisma.rol.findMany();

const rolMap = Object.fromEntries(
    roles.map(r => [r.nombre, r.id])
);

await prisma.modalidad.createMany({
    data: [
    { nombre: "VIRTUAL" },
    { nombre: "PRESENCIAL" },
    { nombre: "MIXTA" }
    ]
});

//Recupera y mapea todas las modalidades para usarlas ahora más abajo
const modalidades = await prisma.modalidad.findMany();

const modalidadMap = Object.fromEntries(
    modalidades.map((m) => [m.nombre, m.id])
);

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

const estadoMap = Object.fromEntries(
    estados.map(e => [e.nombre, e.id])
);

await prisma.categoria.createMany({
    data: [
    { nombre: "Fotografía de Bodas", descripcion: "Cobertura profesional de bodas", estado: true },
    { nombre: "Fotografía de Retrato", descripcion: "Sesiones personales y familiares", estado: true },
    { nombre: "Fotografía Comercial", descripcion: "Fotografía para empresas y marcas", estado: true },
    { nombre: "Fotografía de Eventos", descripcion: "Eventos sociales y corporativos", estado: false },
    { nombre: "Fotografía de Producto", descripcion: "Fotografía para catálogos y ecommerce", estado: true }
    ]
});

await prisma.especialidad.createMany({
    data: [
    { nombre: "Retrato", descripcion: "Fotografía de personas", estado: true },
    { nombre: "Iluminación Profesional", descripcion: "Uso avanzado de iluminación", estado: true },
    { nombre: "Edición Lightroom", descripcion: "Revelado fotográfico", estado: true },
    { nombre: "Edición Photoshop", descripcion: "Retoque avanzado", estado: true },
    { nombre: "Fotografía Aérea", descripcion: "Uso de drones", estado: true },
    { nombre: "Fotografía de Producto", descripcion: "Fotografía comercial", estado: true },
    { nombre: "Fotografía Nocturna", descripcion: "Sesiones nocturnas", estado: false },
    { nombre: "Fotografía Deportiva", descripcion: "Cobertura deportiva", estado: true }
    ]
});

  // 3. USUARIOS
await prisma.usuario.createMany({
    data: [
        {
            nombre: "Ana",
            apellidos: "Lopez",
            correo: "ana@email.com",
            contrasenna: "123456",
            telefono: "8888-1001",
            idRol: rolMap["CLIENTE"]
        },
        {
            nombre: "Carlos",
            apellidos: "Ramirez",
            correo: "carlos@email.com",
            contrasenna: "123456",
            telefono: "8888-1002",
            idRol: rolMap["PROFESIONAL"]
        },
        {
            nombre: "Laura",
            apellidos: "Soto",
            correo: "laura@email.com",
            contrasenna: "123456",
            telefono: "8888-1003",
            idRol: rolMap["PROFESIONAL"]
        },
        {
            nombre: "Daniel",
            apellidos: "Mora",
            correo: "daniel@email.com",
            contrasenna: "123456",
            telefono: "8888-1004",
            idRol: rolMap["PROFESIONAL"]
        },
        {
            nombre: "Sofia",
            apellidos: "Castro",
            correo: "sofia@email.com",
            contrasenna: "123456",
            telefono: "8888-1005",
            idRol: rolMap["PROFESIONAL"]
        },
        {
            nombre: "Andres",
            apellidos: "Vargas",
            correo: "andres@email.com",
            contrasenna: "123456",
            telefono: "8888-1006",
            idRol: rolMap["PROFESIONAL"]
        },
        {
            nombre: "Mariana",
            apellidos: "Jimenez",
            correo: "mariana@email.com",
            contrasenna: "123456",
            telefono: "8888-1007",
            idRol: rolMap["CLIENTE"]
        },
        {
            nombre: "Administrador",
            apellidos: "Soluvix",
            correo: "admin@soluvix.com",
            contrasenna: "123456",
            telefono: "8888-1008",
            idRol: rolMap["ADMIN"]
        }
    ]
});

  // 4. MAPS
const [categorias, especialidades, usuarios] = await Promise.all([
    prisma.categoria.findMany(),
    prisma.especialidad.findMany(),
    prisma.usuario.findMany()
]);

const catMap = Object.fromEntries(categorias.map(c => [c.nombre, c.id]));
const espMap = Object.fromEntries(especialidades.map(e => [e.nombre, e.id]));
const userMap = Object.fromEntries(usuarios.map(u => [u.correo, u.id]));

  // 5. PERFILES PROFESIONALES
await prisma.perfilProfesional.createMany({
    data: [
    {
        idUsuario: userMap["carlos@email.com"],
        tituloProfesional: "Fotógrafo de Bodas",
        descripcion: "Especialista en bodas y eventos",
        annosExperiencia: 5,
        idModalidad: modalidadMap["MIXTA"],
        provincia: "San Jose",
        canton: "Central",
        distrito: "Carmen",
        tarifaBase: 120,
        disponible: true
    },
    {
        idUsuario: userMap["laura@email.com"],
        tituloProfesional: "Fotógrafa de Retrato",
        descripcion: "Sesiones personales y familiares",
        annosExperiencia: 4,
        idModalidad: modalidadMap["VIRTUAL"],
        provincia: "Alajuela",
        canton: "Central",
        distrito: "San Jose",
        tarifaBase: 90,
        disponible: true
    },
    {
    idUsuario: userMap["daniel@email.com"],
    tituloProfesional: "Fotógrafo Comercial",
    descripcion: "Especialista en fotografía para marcas, empresas y publicidad",
    annosExperiencia: 6,
    idModalidad: modalidadMap["MIXTA"],
    provincia: "Heredia",
    canton: "Heredia",
    distrito: "Mercedes",
    tarifaBase: 150,
    disponible: true
},
{
    idUsuario: userMap["sofia@email.com"],
    tituloProfesional: "Fotógrafa de Producto",
    descripcion: "Fotografía profesional para catálogos, tiendas y redes sociales",
    annosExperiencia: 3,
    idModalidad: modalidadMap["PRESENCIAL"],
    provincia: "Cartago",
    canton: "Central",
    distrito: "Oriental",
    tarifaBase: 110,
    disponible: true
},
{
    idUsuario: userMap["andres@email.com"],
    tituloProfesional: "Fotógrafo de Eventos",
    descripcion: "Cobertura de eventos sociales, empresariales y deportivos",
    annosExperiencia: 7,
    idModalidad: modalidadMap["PRESENCIAL"],
    provincia: "San Jose",
    canton: "Escazu",
    distrito: "San Rafael",
    tarifaBase: 175,
    disponible: true
}
    ]
});

const perfiles = await prisma.perfilProfesional.findMany();
const perfilMap = Object.fromEntries(perfiles.map(p => [p.tituloProfesional, p.id]));

  // 6. SERVICIOS
await prisma.servicio.createMany({
    data: [
    {
        idPerfil: perfilMap["Fotógrafo de Bodas"],
        idCategoria: catMap["Fotografía de Bodas"],
        idModalidad: modalidadMap["PRESENCIAL"],
        nombre: "Cobertura de Boda Básica",
        descripcion: "Cobertura de ceremonia",
        precio: 300,
        duracionEstimada: 5,
        estado: true
    },
    {
        idPerfil: perfilMap["Fotógrafa de Retrato"],
        idCategoria: catMap["Fotografía de Retrato"],
        idModalidad: modalidadMap["VIRTUAL"],
        nombre: "Sesión Familiar",
        descripcion: "Fotografía familiar",
        precio: 120,
        duracionEstimada: 2,
        estado: true
    },
    {
    idPerfil: perfilMap["Fotógrafo de Bodas"],
    idCategoria: catMap["Fotografía de Bodas"],
    idModalidad: modalidadMap["PRESENCIAL"],
    nombre: "Cobertura de Boda Completa",
    descripcion: "Cobertura de preparación, ceremonia y recepción",
    precio: 650,
    duracionEstimada: 10,
    estado: true
},
{
    idPerfil: perfilMap["Fotógrafa de Retrato"],
    idCategoria: catMap["Fotografía de Retrato"],
    idModalidad: modalidadMap["PRESENCIAL"],
    nombre: "Sesión de Retrato Individual",
    descripcion: "Sesión profesional de retrato en exteriores",
    precio: 85,
    duracionEstimada: 1,
    estado: true
},
{
    idPerfil: perfilMap["Fotógrafo Comercial"],
    idCategoria: catMap["Fotografía Comercial"],
    idModalidad: modalidadMap["MIXTA"],
    nombre: "Fotografía Corporativa",
    descripcion: "Fotografías profesionales para empresas y equipos de trabajo",
    precio: 250,
    duracionEstimada: 3,
    estado: true
},
{
    idPerfil: perfilMap["Fotógrafo Comercial"],
    idCategoria: catMap["Fotografía Comercial"],
    idModalidad: modalidadMap["PRESENCIAL"],
    nombre: "Campaña Publicitaria",
    descripcion: "Producción fotográfica para publicidad y redes sociales",
    precio: 450,
    duracionEstimada: 6,
    estado: true
},
{
    idPerfil: perfilMap["Fotógrafa de Producto"],
    idCategoria: catMap["Fotografía de Producto"],
    idModalidad: modalidadMap["PRESENCIAL"],
    nombre: "Catálogo de Productos Básico",
    descripcion: "Fotografía de hasta diez productos con fondo neutro",
    precio: 180,
    duracionEstimada: 3,
    estado: true
},
{
    idPerfil: perfilMap["Fotógrafa de Producto"],
    idCategoria: catMap["Fotografía de Producto"],
    idModalidad: modalidadMap["MIXTA"],
    nombre: "Fotografía Gastronómica",
    descripcion: "Sesión de alimentos para restaurantes y emprendimientos",
    precio: 220,
    duracionEstimada: 4,
    estado: true
},
{
    idPerfil: perfilMap["Fotógrafo de Eventos"],
    idCategoria: catMap["Fotografía de Eventos"],
    idModalidad: modalidadMap["PRESENCIAL"],
    nombre: "Cobertura de Evento Corporativo",
    descripcion: "Cobertura profesional de conferencias y actividades empresariales",
    precio: 350,
    duracionEstimada: 5,
    estado: true
},
{
    idPerfil: perfilMap["Fotógrafo de Eventos"],
    idCategoria: catMap["Fotografía de Eventos"],
    idModalidad: modalidadMap["PRESENCIAL"],
    nombre: "Cobertura Deportiva",
    descripcion: "Fotografía de competencias y actividades deportivas",
    precio: 280,
    duracionEstimada: 4,
    estado: true
}
    ]
});

const servicios = await prisma.servicio.findMany();

const servicioMap = Object.fromEntries(
    servicios.map(s => [s.nombre, s.id])
);

  // 7. MUCHOS A MUCHOS
await prisma.profesionalEspecialidad.createMany({
    data: [
    { idPerfil: perfilMap["Fotógrafo de Bodas"], idEspecialidad: espMap["Retrato"] },
    { idPerfil: perfilMap["Fotógrafo de Bodas"], idEspecialidad: espMap["Iluminación Profesional"] },
    { idPerfil: perfilMap["Fotógrafa de Retrato"], idEspecialidad: espMap["Retrato"] },
    { idPerfil: perfilMap["Fotógrafa de Retrato"], idEspecialidad: espMap["Edición Lightroom"] }
    ]
});

await prisma.servicioEspecialidad.createMany({
    data: [
    { idServicio: servicioMap["Cobertura de Boda Básica"], idEspecialidad: espMap["Retrato"] },
    { idServicio: servicioMap["Sesión Familiar"], idEspecialidad: espMap["Edición Lightroom"] }
    ]
});

  // 8. CITAS
await prisma.cita.createMany({
    data: [
    {
            idCliente: userMap["ana@email.com"],
            idProfesional: perfilMap["Fotógrafo de Bodas"],
            idServicio: servicioMap["Cobertura de Boda Básica"],
            idModalidad: modalidadMap["PRESENCIAL"],
            idEstado: estadoMap["COMPLETADA"],
            fechaCita: new Date("2026-07-15T00:00:00"),
            horaInicio: new Date("2026-07-15T10:00:00"),
            horaFin: new Date("2026-07-15T15:00:00"),
            comentarioCliente: "Quiero fotografías naturales de la ceremonia",
            montoEstimado: 300
        },
        {
            idCliente: userMap["mariana@email.com"],
            idProfesional: perfilMap["Fotógrafa de Retrato"],
            idServicio: servicioMap["Sesión Familiar"],
            idModalidad: modalidadMap["VIRTUAL"],
            idEstado: estadoMap["PENDIENTE"],
            fechaCita: new Date("2026-07-17T00:00:00"),
            horaInicio: new Date("2026-07-17T09:00:00"),
            horaFin: new Date("2026-07-17T11:00:00"),
            comentarioCliente: "Necesito asesoría previa para la sesión",
            comentarioProfesional: "La asesoría se realizará por videollamada",
            montoEstimado: 120
        },
        {
            idCliente: userMap["ana@email.com"],
            idProfesional: perfilMap["Fotógrafo de Bodas"],
            idServicio: servicioMap["Cobertura de Boda Completa"],
            idModalidad: modalidadMap["PRESENCIAL"],
            idEstado: estadoMap["PENDIENTE"],
            fechaCita: new Date("2026-07-20T00:00:00"),
            horaInicio: new Date("2026-07-20T10:00:00"),
            horaFin: new Date("2026-07-20T20:00:00"),
            comentarioCliente: "La boda tendrá ceremonia y recepción",
            montoEstimado: 650
        },
        {
            idCliente: userMap["mariana@email.com"],
            idProfesional: perfilMap["Fotógrafa de Retrato"],
            idServicio: servicioMap["Sesión de Retrato Individual"],
            idModalidad: modalidadMap["PRESENCIAL"],
            idEstado: estadoMap["CANCELADA"],
            fechaCita: new Date("2026-06-20T00:00:00"),
            horaInicio: new Date("2026-06-20T14:00:00"),
            horaFin: new Date("2026-06-20T15:00:00"),
            comentarioCliente: "Quiero fotografías para mis redes sociales",
            comentarioProfesional: "Sesión realizada satisfactoriamente",
            montoEstimado: 85
        },
        {
            idCliente: userMap["ana@email.com"],
            idProfesional: perfilMap["Fotógrafo Comercial"],
            idServicio: servicioMap["Fotografía Corporativa"],
            idModalidad: modalidadMap["MIXTA"],
            idEstado: estadoMap["PENDIENTE"],
            fechaCita: new Date("2026-07-22T00:00:00"),
            horaInicio: new Date("2026-07-22T08:00:00"),
            horaFin: new Date("2026-07-22T11:00:00"),
            comentarioCliente: "Necesitamos fotografías para el sitio web",
            montoEstimado: 250
        },
        {
            idCliente: userMap["mariana@email.com"],
            idProfesional: perfilMap["Fotógrafo Comercial"],
            idServicio: servicioMap["Campaña Publicitaria"],
            idModalidad: modalidadMap["PRESENCIAL"],
            idEstado: estadoMap["PENDIENTE"],
            fechaCita: new Date("2026-07-24T00:00:00"),
            horaInicio: new Date("2026-07-24T09:00:00"),
            horaFin: new Date("2026-07-24T15:00:00"),
            comentarioCliente: "Campaña para el lanzamiento de una marca",
            comentarioProfesional: "No tengo disponibilidad para esa fecha",
            montoEstimado: 450
        },
        {
            idCliente: userMap["ana@email.com"],
            idProfesional: perfilMap["Fotógrafa de Producto"],
            idServicio: servicioMap["Catálogo de Productos Básico"],
            idModalidad: modalidadMap["PRESENCIAL"],
            idEstado: estadoMap["PENDIENTE"],
            fechaCita: new Date("2026-07-26T00:00:00"),
            horaInicio: new Date("2026-07-26T10:00:00"),
            horaFin: new Date("2026-07-26T13:00:00"),
            comentarioCliente: "Son diez productos de una tienda de accesorios",
            montoEstimado: 180
        },
        {
            idCliente: userMap["mariana@email.com"],
            idProfesional: perfilMap["Fotógrafa de Producto"],
            idServicio: servicioMap["Fotografía Gastronómica"],
            idModalidad: modalidadMap["MIXTA"],
            idEstado: estadoMap["PENDIENTE"],
            fechaCita: new Date("2026-07-28T00:00:00"),
            horaInicio: new Date("2026-07-28T13:00:00"),
            horaFin: new Date("2026-07-28T17:00:00"),
            comentarioCliente: "Necesito fotografías del nuevo menú",
            montoEstimado: 220
        },
        {
            idCliente: userMap["ana@email.com"],
            idProfesional: perfilMap["Fotógrafo de Eventos"],
            idServicio: servicioMap["Cobertura de Evento Corporativo"],
            idModalidad: modalidadMap["PRESENCIAL"],
            idEstado: estadoMap["COMPLETADA"],
            fechaCita: new Date("2026-07-30T00:00:00"),
            horaInicio: new Date("2026-07-30T08:00:00"),
            horaFin: new Date("2026-07-30T13:00:00"),
            comentarioCliente: "Conferencia empresarial",
            comentarioProfesional: "La actividad fue cancelada por el cliente",
            montoEstimado: 350
        },
        {
            idCliente: userMap["mariana@email.com"],
            idProfesional: perfilMap["Fotógrafo de Eventos"],
            idServicio: servicioMap["Cobertura Deportiva"],
            idModalidad: modalidadMap["PRESENCIAL"],
            idEstado: estadoMap["CANCELADA"],
            fechaCita: new Date("2026-08-02T00:00:00"),
            horaInicio: new Date("2026-08-02T07:00:00"),
            horaFin: new Date("2026-08-02T11:00:00"),
            comentarioCliente: "Es una competencia de atletismo",
            montoEstimado: 280
        },
        {
            idCliente: userMap["ana@email.com"],
            idProfesional: perfilMap["Fotógrafa de Retrato"],
            idServicio: servicioMap["Sesión Familiar"],
            idModalidad: modalidadMap["PRESENCIAL"],
            idEstado: estadoMap["PENDIENTE"],
            fechaCita: new Date("2026-06-25T00:00:00"),
            horaInicio: new Date("2026-06-25T15:00:00"),
            horaFin: new Date("2026-06-25T17:00:00"),
            comentarioCliente: "Sesión familiar para cinco personas",
            comentarioProfesional: "Sesión finalizada",
            montoEstimado: 120
        },
        {
            idCliente: userMap["mariana@email.com"],
            idProfesional: perfilMap["Fotógrafo de Bodas"],
            idServicio: servicioMap["Cobertura de Boda Básica"],
            idModalidad: modalidadMap["PRESENCIAL"],
            idEstado: estadoMap["COMPLETADA"],
            fechaCita: new Date("2026-08-08T00:00:00"),
            horaInicio: new Date("2026-08-08T14:00:00"),
            horaFin: new Date("2026-08-08T19:00:00"),
            comentarioCliente: "La ceremonia será en una finca",
            montoEstimado: 300
        }
    ]
});

const citas = await prisma.cita.findMany();

  // =========================
  // 9. HISTORIAL
  // =========================
await prisma.historialEstadoCita.createMany({
    data: [
    {
        idCita: citas[0].id,
        idEstadoAnterior: null,
        idEstadoNuevo: estadoMap["PENDIENTE"],
        comentario: "Cita creada"
    }
    ]
});

  // 10. RESEÑAS

await prisma.resena.createMany({
    data: [
    {
        idCita: citas[0].id,
        idCliente: userMap["ana@email.com"],
        idProfesional: perfilMap["Fotógrafo de Bodas"],
        puntuacion: 5,
        comentario: "Excelente trabajo"
    }
    ]
});

console.log("Seed completado con éxito.");
}

main()
.catch(e => {
    console.error("Error en seed:", e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
});