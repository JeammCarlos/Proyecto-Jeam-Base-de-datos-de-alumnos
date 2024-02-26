class Alumno {
  constructor(nombre, apellidos, edad) {
      this.nombre = nombre;
      this.apellidos = apellidos;
      this.edad = edad;
      this.materias = []; // Pila para representar las materias
      this.calificaciones = new Map();
  }

  inscribirMateria(materia) {
      this.materias.push(materia); // Agregar materia a la pila
  }

  asignarCalificacion(materia, calificacion) {
      this.calificaciones.set(materia, calificacion);
  }
}

class Grupo {
  constructor(nombre) {
      this.nombre = nombre;
      this.alumnos = []; // Cola para representar los grupos
  }

  agregarAlumno(alumno) {
      this.alumnos.push(alumno); // Agregar alumno a la cola
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

function obtenerPromedioGrupo() {
  const nombreGrupo = document.getElementById('select-grupo').value;

  if (!nombreGrupo) {
    alert('Por favor, seleccione un grupo.');
    return;
  }

  const promedio = calcularPromedioGrupo(nombreGrupo);
  alert(`El promedio del grupo ${nombreGrupo} es: ${promedio}`);
}

function calcularPromedioGrupo(nombreGrupo) {
  const grupo = grupos.find(grupo => grupo.nombre === nombreGrupo);
  if (!grupo) {
    alert('Grupo no encontrado.');
    return 0;
  }

  let sumaTotal = 0;
  grupo.alumnos.forEach(alumno => {
    const calificaciones = Object.values(alumno.calificaciones);
    const sumaCalificaciones = calificaciones.reduce((total, calificacion) => total + calificacion, 0);
    sumaTotal += sumaCalificaciones;
  });
  const cantidadTotal = grupo.alumnos.length;
  return sumaTotal / cantidadTotal;
}

function ordenarAlumnos(criteria) {
  let alumnosOrdenados;

  switch (criteria) {
    case 'calificacion_ascendente':
      alumnosOrdenados = obtenerAlumnosOrdenAscendente();
      break;
    case 'calificacion_descendente':
      alumnosOrdenados = obtenerAlumnosOrdenDescendente();
      break;
    case 'edad_ascendente':
      alumnosOrdenados = obtenerAlumnosOrdenadosPorEdad();
      break;
    case 'edad_descendente':
      alumnosOrdenados = obtenerAlumnosOrdenadosPorEdad().reverse();
      break;
    default:
      alert('Criterio de orden no válido.');
      return;
  }

  // Actualizar la lista de alumnos en la interfaz
  const listaAlumnosElemento = document.getElementById('lista-alumnos');
  listaAlumnosElemento.innerHTML = '';
  alumnosOrdenados.forEach(alumno => {
    const li = document.createElement('li');
    li.textContent = `Nombre: ${alumno.nombre} ${alumno.apellidos}, Edad: ${alumno.edad}`;
    listaAlumnosElemento.appendChild(li);
  });
}


function guardarDatos() {
  localStorage.setItem('listaAlumnos', JSON.stringify(Array.from(listaAlumnos)));
  localStorage.setItem('grupos', JSON.stringify(Array.from(grupos)));
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