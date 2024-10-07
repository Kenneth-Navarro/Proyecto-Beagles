$(document).ready(function (){
  cargaPatrocinadores();
    $("#Enviar").click(function(e) {
        e.preventDefault();
   
        enviarDatos( 
        $("#NombrePatrocinador").val(), 
        $("#NombreEncargado").val(), 
        $("#Correo").val(), 
        $("#Telefono").val(),
        $("#Descripcion").val()
        
        )
    })
    $(document).on('click', '#Ver', function() {
      obtenerPatrocinador($(this).val(), true);
    });
  
})
$(document).on('click', '#Actualizar', function(){
  obtenerPatrocinador($(this).val(), false)
});

$(document).on('click', '#actualizarModal', function(e){
  e.preventDefault();
  actualizarDatos(
    $("#_idModal").val(),
    $("#nombrePModal").val(),
    $("#nombreEModal").val(),
    $("#correoModal").val(),
    $("#telefonoModal").val(),
    $("#descripcionModal").val()
  );
});

$(document).on('click', '#Eliminar', function(){
  eliminar($(this).val());
})


function enviarDatos(
  nombrePatrocinador, 
  nombreEncargado, 
  correo, 
  telefono,
  descripcion
  ){
    $.ajax({
        data: JSON.stringify({
        'nombrePatrocinador': nombrePatrocinador,
        'nombreEncargado': nombreEncargado,  
        'correo':correo, 
        'telefono':telefono,
        'descripcion':descripcion,
        'accion':'Ingreso'
      }),
        url: "/admin/patrocinadores/ingreso",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        success: function(response){
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
                    }
                    location.reload()
                  });
            }
        },
        error: function(xhr, status, error) {
            console.log("Error: ", error)
            console.log("Mensaje de error: ", xhr.responseJSON.error)
        }
    })
}

function actualizarDatos(
  _id,
  nombrePatrocinador, 
  nombreEncargado,
  correo, 
  telefono,
  descripcion
  ){
    $.ajax({
        data: JSON.stringify({
          '_id':_id,
        'nombrePatrocinador': nombrePatrocinador, 
        'nombreEncargado': nombreEncargado, 
        'correo':correo, 
        'telefono':telefono,
        'descripcion':descripcion,
      }),
        url: "/admin/patrocinadores/actualizar",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        success: function(response){
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
                    }
                    location.reload()
                  });
            }
        },
        error: function(xhr, status, error) {
            console.log("Error: ", error)
            console.log("Mensaje de error: ", xhr.responseJSON.error)
        }
    })
}
function cargaPatrocinadores() {
  
    $.ajax({
      url: "/admin/patrocinadores/obtenerPatrocinadores",
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
          llenaTabla(response)
        }
      },
      error: function (xhr, status, error) {
        console.log("Error: ", error);
        console.log("Mensaje de error: ", xhr.responseJSON.error);
      },
    });
  
}


function llenaTabla(ObjetoJson) {
   // Limpia el contenido anterior de la tabla
   $("#tablaPatrocinadores tbody").empty();
    // Recorre sobre los elementos del objeto JSON y agrega las filas de datos
    for (let i = 0; i < ObjetoJson.length; i++) {
      $("#tablaPatrocinadores tbody").append("<tr>");
      $("#tablaPatrocinadores tbody tr:last-child").append("<th>" + ObjetoJson[i].NombrePatrocinador + " </th>");
      $("#tablaPatrocinadores tbody tr:last-child").append("<td>" + ObjetoJson[i].Correo + " </td>");
      $("#tablaPatrocinadores tbody tr:last-child").append("<td>" + ObjetoJson[i].Telefono + " </td>");
      $("#tablaPatrocinadores tbody tr:last-child").append("<td>" +
        "<button id='Ver' class='botones' value='"+ String(ObjetoJson[i]._id)+"' data-bs-toggle='modal' data-bs-target='#modal1'> <svg xmlns='http://www.w3.org/2000/sv' width='16' height='16' fill='currentColor' class='bi bi-eye-fill' viewBox='0 0 16 16'><path d='M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0'/><path d='M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7'/></svg></button></td>");
      $("#tablaPatrocinadores tbody tr:last-child").append("<td>" +
        "<button id='Actualizar' value='"+String(ObjetoJson[i]._id)+"' class=' botones btn ' data-bs-toggle='modal' data-bs-target='#modal1'>  <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-pencil-fill' viewBox='0 0 16 16'><path d='M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z'/></svg></button></td>");
      $("#tablaPatrocinadores tbody tr:last-child").append("<td>" +
        "<button id='Eliminar' value='"+String(ObjetoJson[i]._id)+"' class=' botones btn'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z'/><path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z'/></svg></button></td>");
    }
    
    let table = new DataTable('#tablaPatrocinadores', {
      // Opciones adicionales
      "paging": true, // Habilitar paginación
      "ordering": true, // Habilitar ordenamiento por columnas
      "searching": true, // Habilitar búsqueda
      // Otros opciones según tus necesidades
    });
  
  }
  function obtenerPatrocinador(id, accion){
    $.ajax({
      url: "/admin/patrocinadores/obtenerPatrocinadores?id="+id,
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
          llenarModal(response, accion)
        }
      },
      error: function (xhr, status, error) {
        console.log("Error: ", error);
        console.log("Mensaje de error: ", xhr.responseJSON.error);
      },
    });
  }
  
  function llenarModal(ObjetoJSON, accion){
    $("#modalHijo").empty();
  
    //Se valida si la accion es para la vista o para actualizar, si es vista viene como true y si es actualizar viene como false.
    if(accion === true){
      //Algunos datos que se usan para ponerlos en el modal que se va a crear
      //El titulo que va a llevar el modal
      titulo = "Ver patrocinador"
      
      readonly = "readonly='true'"

      boton=""

      fod = "" //Variable vacia por que no es un formulario
      finFod = "" //Fin de la variable
    }else{
      titulo = "Actualizar Patrocinador"
    

      readonly = ""

        //Se crea la estructura del boton que se va a utilizar para actualizar
    boton = "<div style='text-align: center;' class='mt-3'>"+
    "<button class='boton mb-3' id='actualizarModal' >"+
      "<span>Actualizar Patrocinador</span>"+
    "</button>"+
  "</div>";


  fod = "<form action='' id='formularioModal' method='post' novalidate='novalidate' enctype='multipart/form-data'>"
  finFod = "</form>"
    }
  
  
  
    var HTML = "<div class='modal-header'>" +
      "<h1 class='modal-title tituloModal fs-4'>" + titulo + "</h1>" +
      " <button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>" +
    "</div>" +
    "<div class='modal-body'>" +
      "<div class='row'>" +
        "<div class='col-6'>" +

        "<div style='display: none;'>" +
    "<label for='_idModal'>ID</label>" +
    "<input id='_idModal' type='text' value='" + ObjetoJSON[0]._id + "' class='form-control' " + readonly + ">" +
"</div>"+



          "<div>" +
              "<label for='nombrePModal'>Nombre</label>" +
              "<input id='nombrePModal' type='text' value='"+ObjetoJSON[0].NombrePatrocinador+"' class='form-control'" + readonly + ">" +
          "</div>" +

          "<div>" +
          "<label for='nombreEModal'>Nombre</label>" +
          "<input id='nombreEModal' type='text' value='"+ObjetoJSON[0].NombreEncargado+"' class='form-control'" + readonly + ">" +
      "</div>" +


          "<div>" +
              "<label for='descripcionModal'>Encargado</label>" +
              "<input id='descripcionModal' type='text' value='"+ObjetoJSON[0].Descripcion+"' class='form-control' " + readonly + ">" +
          "</div>" +
        "</div>" +
        "<div class='col-6'>" +
        "<div>" +
            "<label for='correoModal'>Correo</label>" +
            "<input id='correoModal' type='mail' value='"+ObjetoJSON[0].Correo+"' class='form-control'" + readonly + ">" +
        "</div>" +
        "<div>" +
            "<label for='telefonoModal'>Télefono</label>" +
            "<input id='telefonoModal' type='number' value='"+ObjetoJSON[0].Telefono+"' class='form-control' " + readonly + ">" +
        "</div>" +
      "</div>" +
      "</div>" +
      boton+
      finFod+
    "</div>";
    $("#modalHijo").append(HTML)
  }

  function eliminar(id){
    Swal.fire({
      title: "¿Esta seguro?",
      text: "Se eliminará este patrocinador",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          data: JSON.stringify({
            id:id,
          }),
          url: "/admin/patrocinadores/eliminar",
          type: "POST",
          dataType: "json",
          contentType: "application/json",
          success: function (response) {
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
            console.log("Error: ", error);
            console.log("Mensaje de error: ", xhr.responseJSON.error);
          },
        });
      }
    });
  }
  
  