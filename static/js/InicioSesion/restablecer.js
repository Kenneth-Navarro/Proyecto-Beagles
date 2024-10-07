$(document).ready(function() {
    $("#Restablecer").click(function (e){
        e.preventDefault();
        enviarDatos($("#Usuario").val(),$("#ContrasenaNueva").val(), $("#ConfirmContrasena").val() )
    })
})

function enviarDatos(Usuario, Contrasena, ConfirmContrasena){
    $('.loader-background').show();
    $('.loader').show();
    $.ajax({
        url: "/recuperarContrasena/restaurar/envio",
        data:JSON.stringify({
          Usuario: Usuario,
          Contrasena: Contrasena,
          ConfirmContrasena: ConfirmContrasena
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
                text: "Su contraseña se ha actualizado correctamente.",
              }).then((result) => {
                if (result.isConfirmed) {
                    window.close();
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