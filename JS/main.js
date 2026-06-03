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
                        <p>
                            <strong>${campo}:</strong>
                            ${elementos[i]
                            .getElementsByTagName(campo)[0]
                            .textContent}
                        </p>
                    `;
                });

                salida += "</div>";
            }

            document.getElementById("contenido").innerHTML = salida;
        })

        .catch(error => {
            document.getElementById("contenido").innerHTML =
                "<p>Error al cargar el XML.</p>";
            console.error(error);
        });
}

function cargarComidaPaises() {

    fetch("../XML/comidaPaises.xml")
        .then(response => response.text())
        .then(data => {

            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "text/xml");

            const paises = xml.getElementsByTagName("pais");

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

            let salida = "";

            for (let pais in grupos) {

                salida += `
                <section class="pais">
                    <h2>${pais}</h2>

                    <div class="contenedor-platillos">
            `;

                grupos[pais].forEach(platillo => {

                    salida += `
                    <div class="tarjeta" onclick="cambiarVista(this)">

                        <img
                            src="${platillo.imagen}"
                            alt="${platillo.platillo}"
                            class="imagen-platillo"
                        >

                        <div class="infoPlatillo">

                            <h3>${platillo.platillo}</h3>

                            <p>
                                <strong>Tipo:</strong>
                                ${platillo.tipo}
                            </p>

                            <p>
                                ${platillo.descripcion}
                            </p>

                            <p class="precio">
                                $${platillo.precio} MXN
                            </p>

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

        })
        .catch(error => {
            console.error(error);
        });
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

                const nombre =
                    tipos[i].getElementsByTagName("nombre")[0].textContent;

                const descripcion =
                    tipos[i].getElementsByTagName("descripcion")[0].textContent;
                const nodosPlatillos =
                    tipos[i].getElementsByTagName("platillo");

                let platillos = [];

                for (let j = 0; j < nodosPlatillos.length; j++) {

                    platillos.push(
                        nodosPlatillos[j].textContent
                    );

                }

                const imagen =
                    tipos[i].getElementsByTagName("imagen")[0].textContent;

                salida += `
                <div class="tarjeta-tipo"
                    onclick='mostrarModal(
                        "${nombre}",
                        "${descripcion}",
                        ${JSON.stringify(platillos)}
                    )'>
                    <img
                        src="${imagen}"
                        class="imagen-tipo"
                        alt="${nombre}"
                    >
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

    const imagen =
        tarjeta.querySelector("img");

    const info =
        tarjeta.querySelector("div");

    if (imagen.style.display === "none") {

        imagen.style.display = "block";
        info.style.display = "none";

    } else {

        imagen.style.display = "none";
        info.style.display = "block";
    }
}

function mostrarModal(nombre, descripcion, platillos){

    document.getElementById("tituloModal").innerText = nombre;
    document.getElementById("descripcionModal").innerText = descripcion;

    let lista = "";

    for(let i = 0; i < platillos.length; i++){

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
function cargarSucursales() {

    fetch("../XML/sucursales.xml")
        .then(response => response.text())
        .then(data => {

            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "text/xml");

            const sucursales =
                xml.getElementsByTagName("sucursal");

            let salida = "";

            for (let i = 0; i < sucursales.length; i++) {

                const nombre =
                    sucursales[i]
                        .getElementsByTagName("nombre")[0]
                        .textContent;

                const direccion =
                    sucursales[i]
                        .getElementsByTagName("direccion")[0]
                        .textContent;

                const telefono =
                    sucursales[i]
                        .getElementsByTagName("telefono")[0]
                        .textContent;

                const horario =
                    sucursales[i]
                        .getElementsByTagName("horario")[0]
                        .textContent;

                salida += `
                    <div class="tarjeta-sucursal">

                        <h2>${nombre}</h2>

                        <p><strong>Dirección:</strong> ${direccion}</p>

                        <p><strong>Teléfono:</strong> ${telefono}</p>

                        <p><strong>Horario:</strong> ${horario}</p>

                    </div>
                `;
        }

        document.getElementById("contenedor-sucursales").innerHTML = salida;

    });
}