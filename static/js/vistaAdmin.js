var menu = true
$(document).ready(function () {
    if (sessionStorage["Usuario"] == null) {
        cargaPerfil(false);
    } else {
        cargaPerfil(true)
    }

    $("#Cerrar").click(function () {
        sessionStorage.clear()
        localStorage.clear()
        Swal.fire({
            icon: "success",
            title: "¡Sesión Cerrada!",
            text: "Se ha cerrado la sesión correctamente.",
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "/"
            }
        });

    })

    $("#Cliente").click(function () {
        $('.loader-background').show();
        $('.loader').show();
        window.location.href = "/"
        $('.loader-background').hide();
        $('.loader').hide();
    })

    $("#Cuenta").click(function () {
        $('.loader-background').show();
        $('.loader').show();
        window.location.href = "/micuenta"
        $('.loader-background').hide();
        $('.loader').hide();
    })
})

function cargaPerfil(cargado) {
    $("#opcionesUsuarioAdmin").empty();
    if (cargado == true) {
        let usuario = JSON.parse(sessionStorage["Usuario"]);
        if (usuario.Rol == "Administrador") {
            $("#opcionesUsuarioAdmin").append(
                "<button id='Cuenta' class='value'>" +
                "<svg  xmlns='http://www.w3.org/2000/svg'  fill='currentColor' class='bi bi-person-fill' viewBox='0 0 16 16'>" +
                "<path d='M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6'/>" +
                "</svg>" +
                "Mi Cuenta" +
                "</button>" +
                "<button id='Cliente' class='value'>" +
                "<svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' class='bi bi-arrow-return-left' viewBox='0 0 16 16'>" +
                "<path fill-rule='evenodd' d='M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5'/>" +
                " </svg>" +
                "Vista Cliente" +
                "</button>" +
                "<button id='Cerrar' class='value'>" +
                "<svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' class='bi bi-box-arrow-in-left' viewBox='0 0 16 16'>" +
                "<path fill-rule='evenodd' d='M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0z'/>" +
                "<path fill-rule='evenodd' d='M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708z'/>" +
                "</svg>" +
                "Cerrar Sesión" +
                "</button>"
            );
        }
    }
}


function obtenerDatosParaGrafico() {
    $.ajax({
        url: "/admin",
        type: "GET",
        dataType: "json",
        success: function (response) {

            // Verifica si la respuesta es válida y contiene datos de productos y eventos
            if (response.productos && response.eventos) {
                // Gráfico de Productos
                var nombresProductos = response.productos.map(function (producto) {
                    return producto.Nombre;
                });
                var cantidadesProductos = response.productos.map(function (producto) {
                    return producto.Cantidad;
                });

                var ctxProductos = document.getElementById("myChart").getContext("2d");
                var miGraficoProductos = new Chart(ctxProductos, {
                    type: "bar",
                    data: {
                        labels: nombresProductos,
                        datasets: [{
                            label: "Cantidad de Productos",
                            data: cantidadesProductos,
                            backgroundColor: "#D5BFAA", // Color de las barras
                            borderColor: "#845846", // Color de los bordes
                            borderWidth: 2,
                        }],
                    },
                    options: {
                    },
                });
                var totalEventos = response.eventos; // Obtener directamente la cantidad de eventos
                $("#totalEventos").text(totalEventos);
                
                var porcentajeEventos = (totalEventos / 100) * 100;
                $(".fill").css("width", porcentajeEventos + "%");



                var totalUsuarios = response.usuarios; // Obtener directamente la cantidad de eventos
                $("#totalUsuarios").text(totalUsuarios);
                
                var porcentajeUsuarios= (totalUsuarios / 100) * 100;
                $(".flUsuarios").css("width", porcentajeUsuarios + "%");
                
            } else {
                console.log("La respuesta no contiene datos válidos para generar gráficos.");
            }
        },
        error: function (xhr, status, error) {
            console.log("Error en la solicitud:", error);
        },
    });
}

$(document).ready(function () {
    obtenerDatosParaGrafico();
});