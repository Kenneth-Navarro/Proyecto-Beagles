$(document).ready(function(){
    if (sessionStorage["Usuario"] == null){
        cargaPerfil(false);
    }else{
        cargaPerfil(true)
    }

    $("#Cerrar").click(function(){
        sessionStorage.clear()
        localStorage.clear()
        Swal.fire({
            icon: "success",
            title: "¡Sesión Cerrada!",
            text: "Se ha cerrado la sesión correctamente.",
          }).then((result) => {
            if (result.isConfirmed) {
                window.location.href= "/"
            }
        });
        
    })

    $("#Administrar").click(function(){
        $('.loader-background').show();
        $('.loader').show();
        window.location.href = "/admin"
        $('.loader-background').hide();
        $('.loader').hide();
    })

    $("#Cuenta").click(function(){
        $('.loader-background').show();
        $('.loader').show();
        window.location.href = "/micuenta"
        $('.loader-background').hide();
        $('.loader').hide();
    })
})

function cargaPerfil(cargado){
    $("#opcionesUsuario").empty();
    if(cargado == false){
        $('.loader-background').show();
        $('.loader').show();
        $("#opcionesUsuario").append(
            "<a href='/iniciarSesion' class='value'>" +
        "<svg xmlns='http://www.w3.org/2000/svg'  fill='currentColor' class='bi bi-box-arrow-in-right' viewBox='0 0 16 16'>"+
        "<path fill-rule='evenodd' d='M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z'/>"+
        "<path fill-rule='evenodd' d='M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z'/>"+
      "</svg>" +
        "Iniciar Sesión" +
        "</a>" 
        )
        $('.loader-background').hide();
        $('.loader').hide();
    }else{
        let usuario = JSON.parse(sessionStorage["Usuario"]);
        if(usuario.Rol == "Administrador"){
            $("#opcionesUsuario").append(
                "<button id='Cuenta' class='value'>" +
        "<svg  xmlns='http://www.w3.org/2000/svg'  fill='currentColor' class='bi bi-person-fill' viewBox='0 0 16 16'>"+
        "<path d='M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6'/>"+
        "</svg>" +
        "Mi Cuenta" +
        "</button>"+
        "<button id='Administrar' class='value'>" +
        "<svg xmlns='http://www.w3.org/2000/svg'  fill='currentColor' class='bi bi-gear-fill' viewBox='0 0 16 16'>"+
        "<path d='M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z'/>"+
        "</svg>"+
        "Administrar" +
        "</button>"+
        "<button id='Cerrar' class='value'>" +
        "<svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' class='bi bi-box-arrow-in-left' viewBox='0 0 16 16'>"+
        "<path fill-rule='evenodd' d='M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0z'/>"+
        "<path fill-rule='evenodd' d='M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708z'/>"+
        "</svg>"+
        "Cerrar Sesión" +
        "</button>" 
            );
        }else{
            $("#opcionesUsuario").append(
                "<button id='Cuenta' class='value'>" +
        "<svg  xmlns='http://www.w3.org/2000/svg'  fill='currentColor' class='bi bi-person-fill' viewBox='0 0 16 16'>"+
        "<path d='M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6'/>"+
        "</svg>" +
        "Mi Cuenta" +
        "</button>"+
                "<button id='Cerrar' class='value'>" +
                "<svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' class='bi bi-box-arrow-in-left' viewBox='0 0 16 16'>"+
                "<path fill-rule='evenodd' d='M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0z'/>"+
                "<path fill-rule='evenodd' d='M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708z'/>"+
                "</svg>"+
                "Cerrar Sesión" +
                "</button>" 
            );
        }
    }
}




