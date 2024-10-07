$(document).ready(function(){
  
   cargaDatos();

   $(document).on("click", "#Edita", function(){
    cambiaInputs();
  })

  $(document).on("click", "#Cancela", function(){
    cargaDatos();
  })

  $(document).on("click", "#Actualizar", function(){
    var usuario = JSON.parse(sessionStorage['Usuario'])
    if(usuario.Rol == "Administrador"){
      enviaDatosUsuario($("#Usuario").val(), $("#UsuarioAnterior").val());
    }else{
      enviaDatos($("#Nombre").val(), $("#PrimerApellido").val(), $("#SegundoApellido").val(), 
      $("#Telefono").val(), $("#Correo").val(), $("#Usuario").val(), $("#UsuarioAnterior").val() );
    }
    
  })




})


function enviaDatosUsuario(Usuario, UsuarioAnterior){
  $('.loader-background').show();
  $('.loader').show();
  $.ajax({
    url: "/micuenta/actualizaUsuario",
    data:JSON.stringify({
      Usuario: Usuario,
      UsuarioAnterior: UsuarioAnterior
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
            text: "Información Actualizada Correctamente.",
          }).then((result) => {
            if (result.isConfirmed) {
              sessionStorage.clear();
              sessionStorage.setItem('Usuario', JSON.stringify(response[0]))
              location.reload();
            }
          });
      }
    },
    error: function(xhr, status, error){
      $('.loader-background').hide();
      $('.loader').hide();
      console.log("Error: ", error);
      console.log("Mensaje de error: ", xhr.responseJSON.error);
    }
  });
}

function enviaDatos(Nombre, PrimerApellido, SegundoApellido, Telefono, Correo, Usuario, UsuarioAnterior){
  $('.loader-background').show();
  $('.loader').show();
  $.ajax({
    url: "/micuenta/actualiza",
    data:JSON.stringify({
      Nombre: Nombre,
      PrimerApellido: PrimerApellido,
      SegundoApellido: SegundoApellido,
      Telefono:Telefono,
      Correo:Correo,
      Usuario: Usuario,
      UsuarioAnterior: UsuarioAnterior
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
            text: "Información Actualizada Correctamente.",
          }).then((result) => {
            if (result.isConfirmed) {
              sessionStorage.clear();
              sessionStorage.setItem('Usuario', JSON.stringify(response[0]))
              location.reload();
            }
          });
      }
    },
    error: function(xhr, status, error){
      $('.loader-background').hide();
      $('.loader').hide();
      console.log("Error: ", error);
      console.log("Mensaje de error: ", xhr.responseJSON.error);
    }
  });
}

function cargaDatos(){
  var usuario = JSON.parse(sessionStorage['Usuario'])
  if(usuario.Rol == "Administrador"){
    $("#Nombre").val(usuario.Empleado[0].Nombre)
    $("#PrimerApellido").val(usuario.Empleado[0].PrimerApellido)
    $("#SegundoApellido").val(usuario.Empleado[0].SegundoApellido)
    $("#Telefono").val(usuario.Empleado[0].Telefono)
    $("#Correo").val(usuario.Empleado[0].Correo)

    var boton = '<button id="Edita">'+
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16" style="color: #6E5240">'+
      '<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>'+
      '<path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>'+
    '</svg>'+
    '</button>'

    $("#Cancela").remove()

    $("#botonUsuario").append(boton);
    $("#Usuario").prop("readonly", true);
    $("#botonCuenta").empty();
  }else{
    $("#botonUsuario").removeClass("mt-5")
    $("#botonUsuario").removeAttr("style")

    $("#Nombre").val(usuario.Nombre)
    $("#PrimerApellido").val(usuario.PrimerApellido)
    $("#SegundoApellido").val(usuario.SegundoApellido)
    $("#Telefono").val(usuario.Telefono)
    $("#Correo").val(usuario.Correo)

    $("#Nombre").prop("readonly", true);
    $("#PrimerApellido").prop("readonly", true);
    $("#SegundoApellido").prop("readonly", true);
    $("#Telefono").prop("readonly", true);
    $("#Correo").prop("readonly", true);
    $("#Usuario").prop("readonly", true);

  var boton = '<button id="Edita"> '+
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16" style="color: #6E5240">'+
      '<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>'+
      '<path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>'+
  '</svg>'+
'</button>'

  $("#Cancela").remove()

  $("#botonEdita").append(boton);
  $("#botonCuenta").empty();
  }

  $("#Usuario").val(usuario.Usuario)
  $("#UsuarioAnterior").val(usuario.Usuario)

  
  
}


function cambiaInputs(){
  var usuario = JSON.parse(sessionStorage['Usuario'])
  if(usuario.Rol == "Administrador"){
    var boton1 = '<button id="Cancela">'+ 
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16" style="color: #6E5240">'+
  '<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>'+
  '<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>'+
  '</svg>'+
  '</button>'

    $("#Edita").remove()
    $("#botonUsuario").append(boton1);

    document.getElementById("Usuario").removeAttribute("readonly");

  }else{

  var boton1 = '<button id="Cancela">'+ 
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16" style="color: #6E5240">'+
  '<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>'+
  '<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>'+
  '</svg>'+
  '</button>'

  $("#Edita").remove()
  $("#botonEdita").append(boton1);

  document.getElementById("Nombre").removeAttribute("readonly");
  document.getElementById("PrimerApellido").removeAttribute("readonly");
  document.getElementById("SegundoApellido").removeAttribute("readonly");
  document.getElementById("Telefono").removeAttribute("readonly");
  document.getElementById("Correo").removeAttribute("readonly");
  document.getElementById("Usuario").removeAttribute("readonly");
  }

  var boton = '<button class="boton" id="Actualizar" name="Actualizar"  class="btn" > <span id="">Actualizar</span>  </button>';
    
  $("#botonCuenta").empty();

  $("#botonCuenta").append(boton);
}

