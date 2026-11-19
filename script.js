
const formulario = document.getElementById("formulario");
const cuenta = document.getElementById("cuenta");
const nombre = document.getElementById("nombre");
const carrera = document.getElementById("carrera");
const mensaje = document.getElementById("mensaje");
const lista = document.getElementById("lista");
const exportar = document.getElementById("exportar");


let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];


formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const estudiante = {
        cuenta: cuenta.value.trim(),
        nombre: nombre.value.trim(),
        carrera: carrera.value.trim()
    };

    if (!estudiante.cuenta || !estudiante.nombre || !estudiante.carrera) {
        mensaje.textContent = "Debe completar todos los campos";
        return;
    }

    estudiantes.push(estudiante);
localStorage.setItem("estudiantes", JSON.stringify(estudiantes));

    mensaje.textContent = "Estudiante registrado";
    formulario.reset();

    mostrarEstudiantes();
});


function mostrarEstudiantes() {
    lista.innerHTML = "";

    estudiantes.forEach((estudiante, indice) => {
        const fila = document.createElement("tr");

        const datos = [
            estudiante.cuenta,
            estudiante.nombre,
            estudiante.carrera
        ];

        datos.forEach(valor => {
            const celda = document.createElement("td");
            celda.textContent = valor;
            fila.appendChild(celda);
        });

        const celdaAccion = document.createElement("td");
        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";

        botonEliminar.addEventListener("click", () => {
            estudiantes.splice(indice, 1);
            localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
            mostrarEstudiantes();
            mensaje.textContent = "Estudiante eliminado";
        });

        celdaAccion.appendChild(botonEliminar);
        fila.appendChild(celdaAccion);
        lista.appendChild(fila);
    });
}


exportar.addEventListener("click", function() {
    if (estudiantes.length === 0) {
        mensaje.textContent = "No hay estudiantes para exportar";
        return;
    }

    let csv = "Cuenta,Nombre,Carrera\n";

    estudiantes.forEach(estudiante => {
        const datos = [
            estudiante.cuenta,
            estudiante.nombre,
            estudiante.carrera
        ];

        csv += datos.map(valor =>
            '"' + valor.replace(/"/g, '""') + '"'
        ).join(",") + "\n";
    });

    const archivo = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;"
    });

    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(archivo);
    enlace.download = "estudiantes.csv";
    enlace.click();

    URL.revokeObjectURL(enlace.href);
    mensaje.textContent = "Archivo CSV exportado";
});


mostrarEstudiantes();
