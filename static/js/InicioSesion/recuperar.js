$(document).ready(function(){
    $("#Recuperar").click(function(e){
        e.preventDefault();
        enviarCorreo($("#Correo").val());

    })
})


function enviarCorreo(correo){
    $('.loader-background').show();
    $('.loader').show();
    $.ajax({
        url: "/recuperarContrasena/envioCorreo",
        data:JSON.stringify({
          Correo: correo
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
                text: "¡Se ha enviado un correo para restablecer contraseña!",
              }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "/iniciarSesion";
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