class Alumno {
  constructor(nombre, apellidos, edad) {
      this.nombre = nombre;
      this.apellidos = apellidos;
      this.edad = edad;
      this.materias = [];
      this.calificaciones = {};
  }

  inscribirMateria(materia) {
      this.materias.push(materia);
  }

  asignarCalificacion(materia, calificacion) {
      this.calificaciones[materia] = calificacion;
  }
}

class Grupo {
  constructor(nombre) {
      this.nombre = nombre;
      this.alumnos = [];
  }

  agregarAlumno(alumno) {
      this.alumnos.push(alumno);
  }
}

let listaAlumnos = []; // Variable global para almacenar la lista de alumnos
let grupos = []; // Variable global para almacenar los grupos

function inscribirAlumno() {
  const nombre = document.getElementById('nombre').value;
  const apellidos = document.getElementById('apellidos').value;
  const edad = document.getElementById('edad').value;

  if (!nombre || !apellidos || !edad) {
      alert('Por favor, complete todos los campos.');
      return;
  }

  const alumno = new Alumno(nombre, apellidos, edad);

  const listaAlumnosElemento = document.getElementById('lista-alumnos');
  const li = document.createElement('li');
  li.textContent = `Nombre: ${alumno.nombre} ${alumno.apellidos}, Edad: ${alumno.edad}`;
  listaAlumnosElemento.appendChild(li);

  // Limpiar campos
  document.getElementById('nombre').value = '';
  document.getElementById('apellidos').value = '';
  document.getElementById('edad').value = '';

  listaAlumnos.push(alumno); // Agregar el alumno a la lista global
}

function buscarPorNombre() {
  const nombre = document.getElementById('input-nombre').value.toLowerCase();
  const filteredAlumnos = listaAlumnos.filter(alumno => alumno.nombre.toLowerCase().includes(nombre));
  mostrarListaAlumnos(filteredAlumnos);
}

function buscarPorApellido() {
  const apellido = document.getElementById('input-apellido').value.toLowerCase();
  const filteredAlumnos = listaAlumnos.filter(alumno => alumno.apellidos.toLowerCase().includes(apellido));
  mostrarListaAlumnos(filteredAlumnos);
}

function mostrarListaAlumnos(alumnos) {
  const listaAlumnosElemento = document.getElementById('lista-alumnos');
  listaAlumnosElemento.innerHTML = ''; // Limpiar lista antes de agregar los elementos

  alumnos.forEach(alumno => {
    const li = document.createElement('li');
    li.textContent = `Nombre: ${alumno.nombre} ${alumno.apellidos}, Edad: ${alumno.edad}`;
    listaAlumnosElemento.appendChild(li);
  });
}

function asignarCalificaciones() {
  const materia = prompt('Ingrese el nombre de la materia:');
  const alumnoIndex = prompt('Ingrese el índice del alumno a inscribir (empezando desde 0):');
  const calificaciones = prompt('Ingrese las calificaciones del alumno separadas por coma:');
  const calificacionesArray = calificaciones.split(',').map(Number);

  const alumno = listaAlumnos[alumnoIndex];
  alumno.inscribirMateria(materia);
  calificacionesArray.forEach((calificacion, index) => {
      alumno.asignarCalificacion(materia, calificacion);
  });
}

function crearGrupo() {
  const nombreGrupo = prompt('Ingrese el nombre del grupo:');
  const grupo = new Grupo(nombreGrupo);
  grupos.push(grupo);
}

function asignarAlumnoAGrupo() {
  const nombreGrupo = prompt('Ingrese el nombre del grupo al que desea agregar al alumno:');
  const grupo = grupos.find(grupo => grupo.nombre === nombreGrupo);

  if (!grupo) {
      alert('El grupo especificado no existe.');
      return;
  }

  const alumnoIndex = prompt('Ingrese el índice del alumno a agregar al grupo (empezando desde 0):');
  const alumno = listaAlumnos[alumnoIndex];
  grupo.agregarAlumno(alumno);
}

function obtenerPromedioAlumno(nombreAlumno) {
  const alumno = listaAlumnos.find(alumno => alumno.nombre.toLowerCase() === nombreAlumno.toLowerCase());
  if (!alumno) {
      return 'Alumno no encontrado';
  }
  const calificaciones = Object.values(alumno.calificaciones);
  const sumaCalificaciones = calificaciones.reduce((total, calificacion) => total + calificacion, 0);
  return sumaCalificaciones / calificaciones.length;
}

function obtenerPromedioGrupo(nombreGrupo) {
  const grupo = grupos.find(grupo => grupo.nombre.toLowerCase() === nombreGrupo.toLowerCase());
  if (!grupo) {
      return 'Grupo no encontrado';
  }
  let sumaTotal = 0;
  let cantidadTotal = 0;
  grupo.alumnos.forEach(alumno => {
      const calificaciones = Object.values(alumno.calificaciones);
      const sumaCalificaciones = calificaciones.reduce((total, calificacion) => total + calificacion, 0);
      sumaTotal += sumaCalificaciones;
      cantidadTotal += calificaciones.length;
  });
  return sumaTotal / cantidadTotal;
}

function obtenerAlumnosOrdenAscendente() {
  const alumnosOrdenados = listaAlumnos.slice().sort((a, b) => {
      const promedioA = obtenerPromedioAlumno(a.nombre);
      const promedioB = obtenerPromedioAlumno(b.nombre);
      return promedioA - promedioB;
  });
  return alumnosOrdenados;
}

function obtenerAlumnosOrdenDescendente() {
  const alumnosOrdenados = listaAlumnos.slice().sort((a, b) => {
      const promedioA = obtenerPromedioAlumno(a.nombre);
      const promedioB = obtenerPromedioAlumno(b.nombre);
      return promedioB - promedioA;
  });
  return alumnosOrdenados;
}

function obtenerAlumnosOrdenadosPorEdad() {
  const alumnosOrdenados = listaAlumnos.slice().sort((a, b) => a.edad - b.edad);
  return alumnosOrdenados;
}

function guardarDatos() {
  localStorage.setItem('listaAlumnos', JSON.stringify(listaAlumnos));
  localStorage.setItem('grupos', JSON.stringify(grupos));
}

function cargarDatos() {
  const alumnos = JSON.parse(localStorage.getItem('listaAlumnos'));
  const gruposGuardados = JSON.parse(localStorage.getItem('grupos'));

  if (alumnos) {
      listaAlumnos = alumnos;
  }

  if (gruposGuardados) {
      grupos = gruposGuardados;
  }
}

cargarDatos();
