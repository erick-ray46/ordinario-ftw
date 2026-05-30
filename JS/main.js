function cargarXML(ruta, etiqueta, campos) {

    fetch(ruta)
        .then(response => response.text())
        .then(data => {

            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "text/xml");

            const elementos = xml.getElementsByTagName(etiqueta);

            let salida = "";

            for(let i = 0; i < elementos.length; i++){

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

        for(let i = 0; i < paises.length; i++){

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

            if(!grupos[nombrePais]){
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

        for(let pais in grupos){

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


function cambiarVista(tarjeta){

    const imagen = tarjeta.querySelector(".imagen-platillo");
    const info = tarjeta.querySelector(".infoPlatillo");

    if(imagen.style.display === "none"){

        imagen.style.display = "block";
        info.style.display = "none";

    }else{

        imagen.style.display = "none";
        info.style.display = "block";
    }
}