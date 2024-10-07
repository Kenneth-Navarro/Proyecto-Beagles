$(document).ready(function(){
    $("#Registro").click(function(){
        enviarDatos($("#Nombre").val(), $("#PrimerApellido").val(), $("#SegundoApellido").val(), $("#Correo").val(),
        $("#Telefono").val(), $("#Usuario").val(), $("#Contrasena").val(),$("#ConfirmContrasena").val())
    })
})


function enviarDatos(Nombre, pApellido, sApellido, Correo, Telefono, Usuario, Contrasena, ConfirmContrasena){
    $('.loader-background').show();
    $('.loader').show();
    $.ajax({
        url: "/registro/envio",
        data:JSON.stringify({
          nombre: Nombre,
          pApellido: pApellido,
          sApellido: sApellido,
          correo: Correo,
          telefono: Telefono,  
          usuario:Usuario,
          contrasena:Contrasena,
          confirmContrasena:ConfirmContrasena,
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
                text: "Registro Correcto.",
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