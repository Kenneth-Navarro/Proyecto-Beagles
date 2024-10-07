$(document).ready(function() {
  cargaEmpleados();

  $("#Enviar").click(function(e) {
    e.preventDefault();
    enviarDatos($("#Usuario").val(), $("#Contrasena").val(), $("#confirmContrasena").val(), $("#Empleado").val())

  });

  $("#Administradores").click(function(){
    cargaUsuariosAdmin();
  })

  $("#Clientes").click(function(){
    cargaUsuariosClientes();
  })

  $(document).on('click', "#Ver", function(){
    obtenerUsuario($(this).val(), true)
  })

  $(document).on('click', "#Eliminar", function(){
    eliminarUsuario($(this).val())
  })


})

function eliminarUsuario(id){
  Swal.fire({
    title: "¿Esta seguro?",
    text: "Se eliminará este Usuario",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      $('.loader-background').show();
      $('.loader').show();
      $.ajax({
        data: JSON.stringify({
          idUsuario:id,
        }),
        url: "/admin/usuarios/eliminar",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        success: function (response) {
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
          } else {
            Swal.fire({
              icon: "success",
              title: "¡Exito!",
              text: "Información Eliminada Correctamente.",
            }).then((result) => {
              if (result.isConfirmed) {
              }
              location.reload()
            });
          }
        },
        error: function (xhr, status, error) {
          $('.loader-background').hide();
          $('.loader').hide();
          console.log("Error: ", error);
          console.log("Mensaje de error: ", xhr.responseJSON.error);
        },
      });
    }
  });
}


function obtenerUsuario(id, accion){
  $('.loader-background').show();
  $('.loader').show();
  $.ajax({
    url: "/admin/usuarios/obtenerUsuario?id="+id,
    type: "GET",
    dataType: "json",
    contentType: "application/json",
    success: function (response) {
      $('.loader-background').hide();
      $('.loader').hide();
      if(response.error){
        Swal.fire({
          icon: "error",
          title: "¡Uy ha Ocurrido un Error!",
          text: "No se ha podido cargar la información. Por favor comuniquese con el desarrollador.",
        }).then((result) => {
          if (result.isConfirmed) {
          }
        });
      }else{
        if(accion == true){
          llenarModalVer(response)
        }else{
          llenarModalActualizar(response)
        }
      }
    },
    error: function (xhr, status, error) {
      $('.loader-background').hide();
      $('.loader').hide();
      console.log("Error: ", error);
      console.log("Mensaje de error: ", xhr.responseJSON.error);
    },
  });
}

function cargaEmpleados(){
  $.ajax({
    url: "/admin/usuarios/obtenerEmpleados",
    type: "GET",
    dataType: "json",
    contentType: "application/json",
    success: function (response) {
      if(response.error){
        Swal.fire({
          icon: "error",
          title: "¡Uy ha Ocurrido un Error!",
          text: "No se ha podido cargar la información. Por favor comuniquese con el desarrollador.",
        }).then((result) => {
          if (result.isConfirmed) {
          }
        });
      }else{
        llenaSelect(response)
      }
    },
    error: function (xhr, status, error) {
      console.log("Error: ", error);
      console.log("Mensaje de error: ", xhr.responseJSON.error);
    },
  });
}


function llenaSelect (ObjetoJson){
  $("#Empleado").empty;

  opciones = "<option selected value=''>Seleccionar Empleado</option>";

  ObjetoJson.forEach(element => {
    opciones=opciones + "<option value='"+ element['Cedula'] +"'> "+ element['Nombre']+ " " + element['PrimerApellido'] +"</option>"
  });
  
  $("#Empleado").append(opciones);
  
}


function enviarDatos(usuario, contrasena, confirmContrasena, idEmpleado){
  $('.loader-background').show();
  $('.loader').show();
  $.ajax({
    url: "/admin/usuarios/ingreso",
    data:JSON.stringify({
      usuario:usuario,
      contrasena:contrasena,
      confirmContrasena:confirmContrasena,
      idEmpleado:idEmpleado,
      accion:"Ingreso"
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
            text: "Información Almacenada Correctamente.",
          }).then((result) => {
            if (result.isConfirmed) {
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

function cargaUsuariosAdmin(){
  $.ajax({
    url: "/admin/usuarios/obtenerUsuariosAdmin",
    type: "GET",
    dataType: "json",
    contentType: "application/json",
    success: function (response) {
      if(response.error){
        Swal.fire({
          icon: "error",
          title: "¡Uy ha Ocurrido un Error!",
          text: "No se ha podido cargar la información. Por favor comuniquese con el desarrollador.",
        }).then((result) => {
          if (result.isConfirmed) {
          }
        });
      }else{
        llenaTabla(response, true)
      }
    },
    error: function (xhr, status, error) {
      console.log("Error: ", error);
      console.log("Mensaje de error: ", xhr.responseJSON.error);
    },
  });
}

function cargaUsuariosClientes(){
  $.ajax({
    url: "/admin/usuarios/obtenerUsuariosClientes",
    type: "GET",
    dataType: "json",
    contentType: "application/json",
    success: function (response) {
      if(response.error){
        Swal.fire({
          icon: "error",
          title: "¡Uy ha Ocurrido un Error!",
          text: "No se ha podido cargar la información. Por favor comuniquese con el desarrollador.",
        }).then((result) => {
          if (result.isConfirmed) {
          }
        });
      }else{
        llenaTabla(response, false)
      }
    },
    error: function (xhr, status, error) {
      console.log("Error: ", error);
      console.log("Mensaje de error: ", xhr.responseJSON.error);
    },
  });
}

function llenaTabla(ObjetoJson, Rol){
  if ($.fn.DataTable.isDataTable('#tablaUsuarios')) {
    $("#tablaUsuarios").DataTable().destroy();
  }

  $("#tablaUsuarios tbody").empty();
  if(Rol == true){
     // Se agrega el cuerpo de la tabla

  // Recorre sobre los elementos del objeto JSON y agrega las filas de datos
  for (let i = 0; i < ObjetoJson.length; i++) {
    $("#tablaUsuarios tbody").append("<tr>");
    $("#tablaUsuarios tbody tr:last-child").append(
      "<th scope='row'>" + ObjetoJson[i].Usuario + " </th>"
    );
    $("#tablaUsuarios tbody tr:last-child").append(
      "<td scope='row'>" + ObjetoJson[i]['Empleado'][0].Nombre +" " + ObjetoJson[i]['Empleado'][0].PrimerApellido + " </td>"
    );
    $("#tablaUsuarios tbody tr:last-child").append(
      "<td scope='row'>" + ObjetoJson[i].Rol + " </td>"
    );
    
    $("#tablaUsuarios tbody tr:last-child").append(
      "<td>" +
      "<button id='Ver' class='botones' value='"+ObjetoJson[i].Usuario+"' data-bs-toggle='modal' data-bs-target='#modal1'> <svg xmlns='http://www.w3.org/2000/sv' width='16' height='16' fill='currentColor' class='bi bi-eye-fill' viewBox='0 0 16 16'><path d='M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0'/><path d='M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7'/></svg></button></td>"
  );
    $("#tablaUsuarios tbody tr:last-child").append(
      "<td>" +
        "<button id='Eliminar' value='"+ObjetoJson[i].Usuario+"' class=' botones btn'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z'/><path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z'/></svg></button></td>"
    );
    $("#tablaUsuarios tbody tr:last-child").append(
      "<td>" 
    );
    }
  }else{
    // Recorre sobre los elementos del objeto JSON y agrega las filas de datos
  for (let i = 0; i < ObjetoJson.length; i++) {
    $("#tablaUsuarios tbody").append("<tr>");
    $("#tablaUsuarios tbody tr:last-child").append(
      "<th scope='row'>" + ObjetoJson[i].Usuario + " </th>"
    );
    $("#tablaUsuarios tbody tr:last-child").append(
      "<td scope='row'>" + ObjetoJson[i].Nombre +" " + ObjetoJson[i].PrimerApellido + " </td>"
    );
    $("#tablaUsuarios tbody tr:last-child").append(
      "<td scope='row'>" + ObjetoJson[i].Rol + " </td>"
    );
    
    $("#tablaUsuarios tbody tr:last-child").append(
      "<td>" +
      "<button id='Ver' class='botones' value='"+ObjetoJson[i].Usuario+"' data-bs-toggle='modal' data-bs-target='#modal1'> <svg xmlns='http://www.w3.org/2000/sv' width='16' height='16' fill='currentColor' class='bi bi-eye-fill' viewBox='0 0 16 16'><path d='M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0'/><path d='M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7'/></svg></button></td>"
  );
    $("#tablaUsuarios tbody tr:last-child").append(
      "<td>" +
        "<button id='Eliminar' value='"+ObjetoJson[i].Usuario+"' class=' botones btn'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z'/><path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z'/></svg></button></td>"
    );
    $("#tablaUsuarios tbody tr:last-child").append(
      "<td>" 
    );
    }
  }


  tablaUsuarios.style.display = "";
 

  new DataTable("#tablaUsuarios",{
    // Opciones adicionales
    "paging": true, // Habilitar paginación
    "ordering": true, // Habilitar ordenamiento por columnas
    "searching": true, // Habilitar búsqueda
    // Otros opciones según tus necesidades
  });
}


function llenarModalVer(ObjetoJSON){
  $("#modalHijo").empty();


  //Se valida si trae un empleadp
  if(ObjetoJSON[0].hasOwnProperty('Empleado')){
    var HTML = "<div class='modal-header'>" +
    "<h1 class='modal-title tituloModal fs-4'>Ver Usuario</h1>" +
    " <button id='cerrarModal' type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>" +
  "</div>" +
  "<div class='modal-body'>" +
    "<div class='row'>" +
      "<div class='col-6'>" +
        "<div>" +
            "<label for='usuarioModal'>Usuario</label>" +
            "<input id='usuarioModal' type='text' value='"+ObjetoJSON[0].Usuario+"' class='form-control' readonly='true'>" +
        "</div>" +
        "<div>" +
            "<label for='rolModal'>Rol</label>" +
            "<input id='rolModal' type='text' value='"+ObjetoJSON[0].Rol+"' class='form-control' readonly='true'>" +
        "</div>" +
        "<div>" +
            "<label for='nombreModal'>Nombre</label>" +
            "<input id='nombreModal' type='text' value='"+ObjetoJSON[0].Empleado[0].Nombre+"' class='form-control' readonly='true'>" +
        "</div>" +
        "<div>" +
            "<label for='papellidoModal'>Primer Apellido</label>" +
            "<input id='papellidoModal' type='text' value='"+ObjetoJSON[0].Empleado[0].PrimerApellido+"' class='form-control' readonly='true'>" +
        "</div>" +
      "</div>" +
      "<div class='col-6'>" +
      "<div>" +
            "<label for='sapellidoModal'>Segundo Apellido</label>" +
            "<input id='sapellidoModal' type='text' value='"+ObjetoJSON[0].Empleado[0].SegundoApellido+"' class='form-control' readonly='true'>" +
        "</div>" +
      "<div>" +
          "<label for='correoModal'>Correo</label>" +
          "<input id='correoModal' type='mail' value='"+ObjetoJSON[0].Empleado[0].Correo+"' class='form-control' readonly='true'>" +
      "</div>" +
      "<div>" +
          "<label for='telefonoModal'>Télefono</label>" +
          "<input id='telefonoModal' type='number' value='"+ObjetoJSON[0].Empleado[0].Telefono+"' class='form-control' readonly='true'>" +
      "</div>" +
    "</div>" +
    "</div>"+
  "</div>";
  }else{
    var HTML = "<div class='modal-header'>" +
    "<h1 class='modal-title tituloModal fs-4'>Ver Usuario</h1>" +
    " <button id='cerrarModal' type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>" +
  "</div>" +
  "<div class='modal-body'>" +
    "<div class='row'>" +
      "<div class='col-6'>" +
        "<div>" +
            "<label for='usuarioModal'>Usuario</label>" +
            "<input id='usuarioModal' type='text' value='"+ObjetoJSON[0].Usuario+"' class='form-control' readonly='true'>" +
        "</div>" +
        "<div>" +
            "<label for='rolModal'>Rol</label>" +
            "<input id='rolModal' type='text' value='"+ObjetoJSON[0].Rol+"' class='form-control' readonly='true'>" +
        "</div>" +
        "<div>" +
            "<label for='nombreModal'>Nombre</label>" +
            "<input id='nombreModal' type='text' value='"+ObjetoJSON[0].Nombre+"' class='form-control' readonly='true'>" +
        "</div>" +
        "<div>" +
            "<label for='papellidoModal'>Primer Apellido</label>" +
            "<input id='papellidoModal' type='text' value='"+ObjetoJSON[0].PrimerApellido+"' class='form-control' readonly='true'>" +
        "</div>" +
      "</div>" +
      "<div class='col-6'>" +
      "<div>" +
            "<label for='sapellidoModal'>Segundo Apellido</label>" +
            "<input id='sapellidoModal' type='text' value='"+ObjetoJSON[0].SegundoApellido+"' class='form-control' readonly='true'>" +
        "</div>" +
      "<div>" +
          "<label for='correoModal'>Correo</label>" +
          "<input id='correoModal' type='mail' value='"+ObjetoJSON[0].Correo+"' class='form-control' readonly='true'>" +
      "</div>" +
      "<div>" +
          "<label for='telefonoModal'>Télefono</label>" +
          "<input id='telefonoModal' type='number' value='"+ObjetoJSON[0].Telefono+"' class='form-control' readonly='true'>" +
      "</div>" +
    "</div>" +
    "</div>"+
  "</div>";
  }

  

  $("#modalHijo").append(HTML)


}


function llenarModalActualizar(ObjetoJSON){
  $("#modalHijo").empty();
  
    var HTML = "<div class='modal-header'>" +
    "<h1 class='modal-title tituloModal fs-4'>Actualizar Usuario</h1>" +
    " <button id='cerrarModal' type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>" +
  "</div>" +
  "<div class='modal-body d-flex justify-content-center'>" +
    "<div class='col-6'>" +
      "<div class='row'>"+
      "<div>" +
        "<label for='usuarioModal'>Usuario</label>" +
        "<input id='usuarioModal' type='text' value='"+ObjetoJSON[0].Usuario+"' class='form-control'>" +
    "</div>" +
    "<div>" +
        "<label for='recuperarModal'>Contraseña</label>" +
        
    "</div>" +
      "</div>"+
    "</div>"+
  "</div>";

  $("#modalHijo").append(HTML)


}




/*boton = "<div style='text-align: center;' class='mt-3'>"+
      "<button class='boton mb-3' id='actualizarModal' >"+
        "<span>Actualizar Empleado</span>"+
      "</button>"+
    "</div>";*/