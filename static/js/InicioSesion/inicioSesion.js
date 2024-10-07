$(document).ready(function(){
    $("#Enviar").click(function(e){
        e.preventDefault();
        enviarDatos($("#Usuario").val(), $("#Contrasena").val())
    })
})

function enviarDatos(Usuario, Contrasena){
    $('.loader-background').show();
    $('.loader').show();
  
    $.ajax({
        url: "/iniciarSesion/inicio",
        data:JSON.stringify({
          Usuario:Usuario,
          Contrasena: Contrasena
        }),
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        success: function(response){ 
          $('.loader-background').hide();
          $('.loader').hide();
          if (response.error) {
            Swal.fire({
                icon: "error",
                title: "¡Uy ha Ocurrido un Error!",
                text: response.error,
              }).then((result) => {
                if (result.isConfirmed) {
                }
              });
          }else{
            Swal.fire({
                icon: "success",
                title: "¡Exito!",
                text: "Sesión Iniciada",
              }).then((result) => {
                if (result.isConfirmed) {
                    sessionStorage.setItem('Usuario', JSON.stringify(response[0]))
                    window.location.href= "/"
                }
              });
          }
        },
        error: function(xhr, status, error){
          $('.loader-background').hide();
          $('.loader').hide();
            console.log(xhr)
            console.log(error)
        }
      });
}

