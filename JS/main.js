function cargarXML(ruta, etiqueta, campos) {
    fetch(ruta)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "text/xml");
            const elementos = xml.getElementsByTagName(etiqueta);
            let salida = "";
            for (let i = 0; i < elementos.length; i++) {
                salida += "<div class='tarjeta'>";
                campos.forEach(campo => {
                    salida += `
                        <p> <strong>${campo}:</strong> ${elementos[i].getElementsByTagName(campo)[0].textContent}</p>
                    `;
                });
                salida += "</div>";
            }
            document.getElementById("contenido").innerHTML = salida;
        })
        .catch(error => {
            document.getElementById("contenido").innerHTML = "<p>Error al cargar el XML.</p>";
            console.error(error);
        });
}
function iniciarSesion() {
    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const existeUsuario = usuarios.find(u => u.usuario === usuario);
    if (!existeUsuario) {
        mostrarAlertaInicio(" Usuario no encontrado ❌. Intenta registrarte.");
        return;
    }
    const valido = usuarios.find(u => u.usuario === usuario && u.password === password);
    if (!valido) {
        mostrarAlertaInicio(" Contraseña incorrecta ❌. Intenta de nuevo.");
        return;
    }
    localStorage.setItem("usuarioActivo", usuario);
    mostrarUsuarioActivo();
    mostrarAlertaInicio("¡Bienvenido, " + usuario + "! 👤");
}
function registrarUsuario() {
    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();
    if (usuario === "" || password === "") {
        mostrarAlertaInicio("⚠️ Completa todos los campos.");
        return;
    }
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const existe = usuarios.some(u => u.usuario === usuario);
    if (existe) {
        mostrarAlertaInicio("❌ Ese usuario ya existe.");
        return;
    }
    usuarios.push({ usuario: usuario, password: password });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioActivo", usuario);
    mostrarUsuarioActivo();
    document.getElementById("usuario").value = "";
    document.getElementById("password").value = "";
    mostrarAlertaInicio("¡Usuario registrado correctamente! Bienvenido, " + usuario + " 🎉", true);
}

function mostrarUsuarioActivo() {

    const usuario =
        localStorage.getItem("usuarioActivo");

    const usuarioNav =
        document.getElementById("usuarioNav");

    const btnCerrar =
        document.getElementById("btnCerrarSesion");

    const loginContainer =
        document.getElementById("loginContainer");

    const mensaje =
        document.getElementById("mensajeBienvenida");

    if (usuario) {

        usuarioNav.textContent =
            "👤 " + usuario;

        btnCerrar.style.display =
            "block";

        if (loginContainer)
            loginContainer.style.display = "none";

        if (mensaje)
            mensaje.textContent = "Bienvenido " + usuario;

    } else {

        usuarioNav.textContent =
            "👤 Invitado";

        btnCerrar.style.display =
            "none";

        if (loginContainer)
            loginContainer.style.display = "flex";

        if (mensaje)
            mensaje.textContent = "";
    }
}
function cerrarSesion() {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "../index.html";
}
function mostrarAlertaInicio(mensaje, redirigir = false) {
    document.getElementById("mensajeAlerta").textContent = mensaje;
    document.getElementById("modalAlerta").style.display = "block";
    document.getElementById("modalAlerta").dataset.redirigir = redirigir ? "si" : "no";
}
function cerrarAlertaInicio() {
    const modal = document.getElementById("modalAlerta");
    modal.style.display = "none";
    if (modal.dataset.redirigir === "si") {
        window.location.href = "HTML/tipoComida.html";
    }
}

let paisesXML = [];
function cargarComidaPaises() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        const xmlDoc = xhttp.responseXML;
        const paises = xmlDoc.getElementsByTagName("pais");
        paisesXML = paises;
        llenarCombo(paises);
        let grupos = {};
        for (let i = 0; i < paises.length; i++) {
            const nombrePais =
                paises[i].getElementsByTagName("nombrePais")[0].textContent;
            const nombrePlatillo =
                paises[i].getElementsByTagName("nombrePlatillo")[0].textContent;
            const descripcion =
                paises[i].getElementsByTagName("descripcion")[0].textContent;
            const precio =
                paises[i].getElementsByTagName("precio")[0].textContent;
            const tipoComida =
                paises[i].getElementsByTagName("tipoComida")[0].textContent;
            const imagen =
                paises[i].getElementsByTagName("imgComida")[0].textContent;
            if (!grupos[nombrePais]) {
                grupos[nombrePais] = [];
            }
            grupos[nombrePais].push({
                platillo: nombrePlatillo,
                descripcion: descripcion,
                precio: precio,
                tipo: tipoComida,
                imagen: imagen
            });
        }

        mostrarPaises(grupos);
    };

    xhttp.open("GET", "../XML/comidaPaises.xml");

    xhttp.send();
}

function llenarCombo(paises) {
    const lista =
        document.getElementById("listaPaises");
    lista.innerHTML = "";
    const agregados = [];
    for (let i = 0; i < paises.length; i++) {
        const nombre =
            paises[i]
                .getElementsByTagName("nombrePais")[0]
                .textContent;
        if (!agregados.includes(nombre)) {
            agregados.push(nombre);
            lista.innerHTML += `
                <option value="${nombre}">
            `;
        }
    }
}
function mostrarPaises(grupos) {
    let salida = "";
    for (let pais in grupos) {
        salida += `
        <section class="pais">
            <h2>${pais}</h2>
            <div class="contenedor-platillos">
        `;
        grupos[pais].forEach(platillo => {
            salida += `
            <div class="tarjeta"
                 onclick="cambiarVista(this)">
                <img src="${platillo.imagen}" alt="${platillo.platillo}" class="imagen-platillo">
                <div class="infoPlatillo">
                    <h3>${platillo.platillo}</h3>
                    <p> <strong>Tipo:</strong> ${platillo.tipo} </p>
                    <p> ${platillo.descripcion} </p>
                    <p class="precio"> $${platillo.precio} MXN </p>
                </div>
            </div>
            `;
        });
        salida += `
            </div>
        </section>
        `;
    }
    document.getElementById("contenido").innerHTML = salida;
}
function filtrarPaises() {
    const texto = document.getElementById("buscarPais").value.toLowerCase();
    let grupos = {};
    for (let i = 0; i < paisesXML.length; i++) {
        const nombrePais = paisesXML[i].getElementsByTagName("nombrePais")[0].textContent;
        if (nombrePais.toLowerCase().includes(texto)) {
            const nombrePlatillo = paisesXML[i].getElementsByTagName("nombrePlatillo")[0].textContent;
            const descripcion = paisesXML[i].getElementsByTagName("descripcion")[0].textContent;
            const precio = paisesXML[i].getElementsByTagName("precio")[0].textContent;
            const tipo = paisesXML[i].getElementsByTagName("tipoComida")[0].textContent;
            const imagen = paisesXML[i].getElementsByTagName("imgComida")[0].textContent;
            if (!grupos[nombrePais]) {
                grupos[nombrePais] = [];
            }
            grupos[nombrePais].push({
                platillo: nombrePlatillo,
                descripcion: descripcion,
                precio: precio,
                tipo: tipo,
                imagen: imagen
            });
        }
    }
    mostrarPaises(grupos);
    document.getElementById("resultadoBusqueda").textContent = Object.keys(grupos).length + " país(es) encontrado(s)";
}

function limpiarFiltro() {
    document.getElementById("buscarPais").value = "";
    document.getElementById("listaPaises").value = "";
    cargarComidaPaises();
}

function cambiarVista(tarjeta) {
    const imagen = tarjeta.querySelector(".imagen-platillo");
    const info = tarjeta.querySelector(".infoPlatillo");
    if (imagen.style.display === "none") {
        imagen.style.display = "block";
        info.style.display = "none";
    } else {
        imagen.style.display = "none";
        info.style.display = "block";
    }
}

function cargarTiposComida() {
    fetch("../XML/tipoComida.xml")
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "text/xml");
            const tipos = xml.getElementsByTagName("tipo");
            let salida = "";
            for (let i = 0; i < tipos.length; i++) {
                const nombre = tipos[i].getElementsByTagName("nombre")[0].textContent;
                const descripcion = tipos[i].getElementsByTagName("descripcion")[0].textContent;
                const nodosPlatillos = tipos[i].getElementsByTagName("platillo");
                let platillos = [];
                for (let j = 0; j < nodosPlatillos.length; j++) {
                    platillos.push(nodosPlatillos[j].textContent);
                }
                const imagen = tipos[i].getElementsByTagName("imagen")[0].textContent;
                salida += `
                <div class="tarjeta-tipo" onclick='mostrarModal("${nombre}", "${descripcion}",${JSON.stringify(platillos)})'>
                    <img src="${imagen}" class="imagen-tipo" alt="${nombre}">
                    <div class="nombre-tipo">
                        <h3>${nombre}</h3>
                    </div>
                    <div class="info-tipo">
                    <h3>${nombre}</h3>
                        <p>${descripcion}</p>
                    </div>
                </div>
            `;
            }
            document.getElementById("contenido").innerHTML = salida;
        });
}
function cambiarVista(tarjeta) {
    const imagen = tarjeta.querySelector("img");
    const info = tarjeta.querySelector("div");
    if (imagen.style.display === "none") {
        imagen.style.display = "block";
        info.style.display = "none";
    } else {
        imagen.style.display = "none";
        info.style.display = "block";
    }
}

function mostrarModal(nombre, descripcion, platillos) {
    document.getElementById("tituloModal").innerText = nombre;
    document.getElementById("descripcionModal").innerText = descripcion;
    let lista = "";
    for (let i = 0; i < platillos.length; i++) {
        const datos = platillos[i].split("|");
        const nombrePlatillo = datos[0];
        const precio = datos[1];
        lista += `
            <li>
                <span>${nombrePlatillo}</span>
                <span class="precio">$${precio}</span>
            </li>
        `;
    }
    document.getElementById("listaPlatillos").innerHTML = lista;
    document.getElementById("modal").style.display = "block";
}
function cerrarModal() {
    document.getElementById("modal").style.display = "none";
}
let sucursalActual = "";
let direccionActual = "";
function cargarSucursales() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        const xmlDoc = xhttp.responseXML;
        const sucursales = xmlDoc.getElementsByTagName("sucursal");
        mostrarTablaSucursales(sucursales);
    }
    xhttp.open("GET", "../XML/sucursales.xml");
    xhttp.send();
}

function mostrarTablaSucursales(sucursales) {
    let tabla = `
    <thead>
        <tr>
            <th>Sucursal 🧭</th>
            <th>Dirección 📍</th>
            <th>Teléfono 📞</th>
            <th>Horario 🕒</th>
            <th>Reserva</th>
        </tr>
    </thead>
    <tbody>
    `;
    for (let i = 0; i < sucursales.length; i++) {
        const nombre = sucursales[i].getElementsByTagName("nombre")[0].textContent;
        const direccion = sucursales[i].getElementsByTagName("direccion")[0].textContent;
        const telefono = sucursales[i].getElementsByTagName("telefono")[0].textContent;
        const horario = sucursales[i].getElementsByTagName("horario")[0].textContent;
        tabla += `
        <tr>
            <td>${nombre}</td>
            <td>${direccion}</td>
            <td>${telefono}</td>
            <td>${horario}</td>
            <td>
            <button class="btnReserva" onclick="abrirReserva('${nombre}','${direccion}')"> Reservar </button>
            </td>
        </tr>
        `;
    }
    tabla += `
    </tbody>
    `;
    document.getElementById("tabla").innerHTML = tabla;
}
function abrirReserva(nombre, direccion) {
    const usuario = localStorage.getItem("usuarioActivo");
    if (!usuario) {
        mostrarAlerta("⚠️ Debes iniciar sesión para hacer una reserva.");
        setTimeout(() => { window.location.href = "../index.html"; }, 2000);
        return;
    }
    sucursalActual = nombre;
    direccionActual = direccion;
    document.getElementById("nombreSucursal").textContent = nombre;
    document.getElementById("direccionSucursal").textContent = direccion;
    document.getElementById("modalReserva").style.display = "block";
    actualizarHorariosDisponibles();
}

function cerrarReserva() {
    document.getElementById("modalReserva").style.display = "none";
}

function confirmarReserva() {
    const horario = document.getElementById("horarioReserva").value;
    let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    const existe = reservas.some(r => r.sucursal === sucursalActual && r.horario === horario);
    if (existe) {
        mostrarAlerta("❌ Ese horario ya está reservado para esta sucursal.");
        return;
    }
    reservas.push({ sucursal: sucursalActual, direccion: direccionActual, horario: horario });
    localStorage.setItem("reservas", JSON.stringify(reservas));
    cerrarReserva();
    cargarReservas();
    mostrarAlerta("✅ ¡Reserva guardada correctamente!");
}
function cargarReservas() {
    const reservas =
        JSON.parse(
            localStorage.getItem("reservas")
        ) || [];
    let tabla = `
    <thead>
        <tr>
            <th>Sucursal</th>
            <th>Dirección</th>
            <th>Hora</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
    `;
    reservas.forEach((reserva, indice) => {
        tabla += `
    <tr>
        <td>${reserva.sucursal}</td>
        <td>${reserva.direccion}</td>
        <td>${reserva.horario}</td>
        <td>
            <button class="btnCancelar" onclick="cancelarReserva(${indice})">❌ Cancelar </button>
        </td>
    </tr>
    `;
    });
    tabla += `
    </tbody>
    `;
    document.getElementById("tablaReservas").innerHTML = tabla;
}
let indiceReservaActual = null;

function cancelarReserva(indice) {
    indiceReservaActual = indice;
    document.getElementById("modalCancelar").style.display = "block";
}

function confirmarCancelacion() {
    let reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    reservas.splice(indiceReservaActual, 1);
    localStorage.setItem("reservas", JSON.stringify(reservas));
    document.getElementById("modalCancelar").style.display = "none";
    cargarReservas();
}
function actualizarHorariosDisponibles() {
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    const select = document.getElementById("horarioReserva");
    const opciones = select.getElementsByTagName("option");
    for (let i = 0; i < opciones.length; i++) {
        opciones[i].disabled = false;
        const ocupado = reservas.some(r => r.sucursal === sucursalActual && r.horario === opciones[i].value);
        if (ocupado) {
            opciones[i].disabled = true;
        }
    }
}
function mostrarAlerta(mensaje) {
    document.getElementById("mensajeAlerta").textContent = mensaje;
    document.getElementById("modalAlerta").style.display = "block";
}

function cerrarAlerta() {
    document.getElementById("modalAlerta").style.display = "none";
}

function cargarEspecialidades() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        const xmlDoc = xhttp.responseXML;
        const dias = xmlDoc.getElementsByTagName("comidaDia");
        mostrarTablaEspecialidades(dias);
    }
    xhttp.open("GET", "../XML/especialidades.xml");
    xhttp.send();
}

function mostrarTablaEspecialidades(dias) {
    let tabla = `
    <thead>
        <tr>
            <th>Día ☀️</th>
            <th>Entrada 🥗</th>
            <th>Plato Fuerte 🍽️</th>
            <th>Bebida 🥤</th>
            <th>Postre 🍰</th>
            <th>Precio 💰</th>
        </tr>
    </thead>
    <tbody>
    `;

    for (let i = 0; i < dias.length; i++) {

        tabla += `
        <tr>
            <td>${dias[i].getElementsByTagName("nombreDia")[0].textContent}</td>
            <td>${dias[i].getElementsByTagName("entrada")[0].textContent}</td>
            <td>${dias[i].getElementsByTagName("platoFuerte")[0].textContent}</td>
            <td>${dias[i].getElementsByTagName("bebida")[0].textContent}</td>
            <td>${dias[i].getElementsByTagName("postre")[0].textContent}</td>
            <td>$${dias[i].getElementsByTagName("precio")[0].textContent}</td>
        </tr>
        `;
    }

    tabla += "</tbody>";
    document.getElementById("tabla").innerHTML = tabla;
}

function cargarResenias() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        const xmlDoc = xhttp.responseXML;
        const comentarios = xmlDoc.getElementsByTagName("resenia");
        mostrarTablaResenias(comentarios);
    }
    xhttp.open("GET", "../XML/comentariosResenia.xml");
    xhttp.send();
}
function mostrarTablaResenias(comentarios) {
    let tabla = `
    <thead>
        <tr>
            <th>Nombre</th>
            <th>Comentario</th>
            <th>Calificación 
            <p>4.0 ⭐⭐⭐⭐</p></th>
        </tr>
    </thead>
    <tbody>
    `;

    for (let i = 0; i < comentarios.length; i++) {

        tabla += `
        <tr>
            <td>${comentarios[i].getElementsByTagName("nombre")[0].textContent}</td>
            <td>${comentarios[i].getElementsByTagName("comentario")[0].textContent}</td>
            <td>${comentarios[i].getElementsByTagName("calificacion")[0].textContent}</td>
        </tr>
        `;
    }

    tabla += "</tbody>";
    document.getElementById("tabla").innerHTML = tabla;
}
function cargarChefs() {
    const xhttpChefs = new XMLHttpRequest();
    xhttpChefs.onload = function () {
        const xmlChefs = xhttpChefs.responseXML;
        const chefs = xmlChefs.getElementsByTagName("chef");
        const xhttpSucursales = new XMLHttpRequest();
        xhttpSucursales.onload = function () {
            const xmlSucursales = xhttpSucursales.responseXML;
            const sucursales = xmlSucursales.getElementsByTagName("sucursal");
            mostrarTablaChefs(chefs, sucursales);
        };
        xhttpSucursales.open("GET", "../XML/sucursales.xml");
        xhttpSucursales.send();
    };
    xhttpChefs.open("GET", "../XML/chefSucursales.xml");
    xhttpChefs.send();
}
function mostrarTablaChefs(chefs, sucursales) {
    let tabla = `
    <thead>
        <tr>
            <th>Chef 👨‍🍳</th>
            <th>Sucursal 🏢</th>
            <th>Origen 🌎</th>
        </tr>
    </thead>
    <tbody>
    `;
    for (let i = 0; i < chefs.length; i++) {
        const nombreChef = chefs[i].getElementsByTagName("nombreCompleto")[0].textContent;
        const origen = chefs[i].getElementsByTagName("nombrePais")[0].textContent;
        const nombreSucursal = sucursales[i % sucursales.length].getElementsByTagName("nombre")[0].textContent;
        tabla += `
        <tr>
            <td>${nombreChef}</td>
            <td>${nombreSucursal}</td>
            <td>${origen}</td>
        </tr>
        `;
    }
    tabla += `
    </tbody>
    `;
    document.getElementById("tablaChefs").innerHTML = tabla;
}
document.addEventListener("DOMContentLoaded", mostrarUsuarioActivo);

