
$(document).ready(function () {
  cargaEventos();
    
  $("#Enviar").click(function (e) {
      e.preventDefault();

        enviarDatos(
        $("#nombre_evento").val(),
        $("#precio").val(),
        $("#Ubicacion").val(),
        $("#Descripcion").val(),
        $("#fecha_evento").val(), 
        $("#hora_evento").val(),
        $('#Imagen')[0].files[0]
      );
    });

    $(document).on('click', '#Ver', function() {
      obtenerEvento($(this).val(), false);
    });
  $(document).on('click', '#Actualizar', function(){
    obtenerEvento($(this).val(), true)
  });

  $(document).on('click', '#Eliminar', function(){
    eliminar($(this).val());
  })

  $(document).on('click', '#Registros', function(){
    obtenerRegistros($(this).val());
  })


  $(document).on('click', '#actualizarModal', function(e){
    e.preventDefault();
    actualizarDatos(
      $("#_id").val(),
      $("#nombreModal").val(),
      $("#precioModal").val(),
      $("#ubicacionModal").val(),
      $("#descripcionModal").val(),
      $("#fechaModal").val(),
      $("#horaModal").val(),
      $('#ImagenModal')[0].files[0],
      $("#ImagenVieja").val()
    );
  });
        
  $('#Imagen').click(function() {
      this.value = null; // Esto borra el valor del file
    }).change(function() {
      readURL(this); // Llama a la función para leer la URL de la imagen y mostrarla
    });
  
  $('#ImagenModal').change(function() {
      readURL2(this); // Llama a la función para leer la URL de la imagen y mostrarla
    });
  
  $("#cerrarImagen").click(function(){
      $("#blah").attr('src', '#');
    })
  
    $(document).on('click', '#cerrarModal', function(){
      $("#modalHijo").empty();
    })  
    

  });

  function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#blah')
                    .attr('src', e.target.result)
                    .show(); // Mostrar la imagen
        $("#modal2").modal('show');
        };
        reader.readAsDataURL(input.files[0]);
        
    }
  };

  function readURL2(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imgModal')
                    .attr('src', e.target.result)
                    .height(200);
        };
        reader.readAsDataURL(input.files[0]);
    }
  }
  

  function enviarDatos(nombre, precio, ubicacion, Descripcion,fechaEvento, horaEvento, imagen){
    var formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("precio", precio);
    formData.append("ubicacion", ubicacion);
    formData.append("descripcion", Descripcion);
    formData.append("fecha", fechaEvento); 
    formData.append("hora", horaEvento); 
    formData.append("Imagen", imagen);
    formData.append("accion", "Ingreso");

    $('.loader-background').show();
    $('.loader').show();
    $.ajax({
      url: "/admin/eventos/ingreso",
      type: "POST",
      data: formData,
      processData: false, // No procesar los datos
      contentType: false, // No establecer el tipo de contenido
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
            text: "Información Almacenada Correctamente.",
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



  function cargaEventos() {
    $('.loader-background').show();
    $('.loader').show();
    $.ajax({
      url: "/admin/eventos/obtenerEventos",
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
          llenaTabla(response)
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

function llenaTabla(ObjetoJson) {

  $("#tablaEventos tbody").empty();


  // Itera sobre el objeto JSON y agrega filas a la tabla
  for (let i = 0; i < ObjetoJson.length; i++) {
      $("#tablaEventos tbody").append("<tr>");
      $("#tablaEventos tbody tr:last-child").append("<th>" + ObjetoJson[i].Nombre  + "</th>");
      $("#tablaEventos tbody tr:last-child").append("<td>" + ObjetoJson[i].Precio+ "</td>");
      $("#tablaEventos tbody tr:last-child").append("<td>" + ObjetoJson[i].Fecha + "</td>");
      $("#tablaEventos tbody tr:last-child").append("<td>" + ObjetoJson[i].Hora + "</td>");
      $("#tablaEventos tbody tr:last-child").append("<td>" +
          "<button id='Ver' class='botones' value='" + String(ObjetoJson[i]._id)+ "' data-bs-toggle='modal' data-bs-target='#modal1'> <svg xmlns='http://www.w3.org/2000/sv' width='16' height='16' fill='currentColor' class='bi bi-eye-fill' viewBox='0 0 16 16'><path d='M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0'/><path d='M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7'/></svg></button></td>");
      $("#tablaEventos tbody tr:last-child").append("<td>" +
          "<button id='Actualizar' value='"+ String(ObjetoJson[i]._id)+ "' class=' botones btn ' data-bs-toggle='modal' data-bs-target='#modal1'>  <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-pencil-fill' viewBox='0 0 16 16'><path d='M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z'/></svg></button></td>");
      $("#tablaEventos tbody tr:last-child").append("<td>" +
          "<button id='Eliminar' value='" + String(ObjetoJson[i]._id)+ "' class=' botones btn'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z'/><path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z'/></svg></button></td>");
      $("#tablaEventos tbody tr:last-child").append("<td>" +
          "<button id='Registros' value='" + String(ObjetoJson[i]._id)+ "' class=' botones btn'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z'/></svg></button></td>");
  }

  
  new DataTable('#tablaEventos', {
    // Opciones adicionales
    "paging": true, // Habilitar paginación
    "ordering": true, // Habilitar ordenamiento por columnas
    "searching": true, // Habilitar búsqueda
    // Otros opciones según tus necesidades
  });



 /* $("#tablaEventos").append("<thead>");
  $("#tablaEventos thead").append("<tr>");
  $("#tablaEventos thead tr").append("<th scope='col'>Nombre </th>");
  $("#tablaEventos thead tr").append("<th scope='col'>Precio  </th>");
  $("#tablaEventos thead tr").append("<th scope='col'>Fecha</th>");
  $("#tablaEventos thead tr").append("<th scope='col'>Hora </th>");
  $("#tablaEventos thead tr").append("<th scope='col'></th>");
  $("#tablaEventos thead tr").append("<th scope='col'></th>");
  $("#tablaEventos thead tr").append("<th scope='col'></th>");

  // Agrega el cuerpo de la tabla
  $("#tablaEventos").append("<tbody class='table-group-divider'>");

  // Recorre sobre los elementos del objeto JSON y agrega las filas de datos
  for (let i = 0; i < ObjetoJson.length; i++) {
    $("#tablaEventos tbody").append("<tr>");
    $("#tablaEventos tbody tr:last-child").append(
      "<input type='hidden'id='_id' value='_id" + ObjetoJson[i]._id + "'>"
    );
    $("#tablaEventos tbody tr:last-child").append(
      "<th scope='row'>" + ObjetoJson[i].Nombre + " </th>"
    );
    $("#tablaEventos tbody tr:last-child").append(
      "<td scope='row'>" + ObjetoJson[i].Precio + " </td>"
    );
    $("#tablaEventos tbody tr:last-child").append(
      "<td scope='row'>" + ObjetoJson[i].Fecha + " </td>"
    );
    $("#tablaEventos tbody tr:last-child").append(
      "<td scope='row'>" + ObjetoJson[i].Hora + " </td>"
    );
    $("#tablaEventos tbody tr:last-child").append(
      "<td>" +
      "<button id='Ver' class='botones' value='"+ String(ObjetoJson[i]._id)+"' data-bs-toggle='modal' data-bs-target='#modal1'> <svg xmlns='http://www.w3.org/2000/sv' width='16' height='16' fill='currentColor' class='bi bi-eye-fill' viewBox='0 0 16 16'><path d='M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0'/><path d='M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7'/></svg></button></td>"
  );
  $("#tablaEventos tbody tr:last-child").append(
    "<td>" +
      "<button id='Actualizar' value='"+String(ObjetoJson[i]._id)+"' class=' botones btn ' data-bs-toggle='modal' data-bs-target='#modal1'>  <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-pencil-fill' viewBox='0 0 16 16'><path d='M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z'/></svg></button></td>"
  );
  $("#tablaEventos tbody tr:last-child").append(
    "<td>" +
      "<button id='Eliminar' value='"+String(ObjetoJson[i]._id)+"' class=' botones btn'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z'/><path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z'/></svg></button></td>"
  );
  }*/

}


function obtenerEvento(id, accion){
  $('.loader-background').show();
  $('.loader').show();
  $.ajax({
    url: "/admin/eventos/obtenerEvento?id="+id,
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
        llenarModal(response, accion)
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

function llenarModal(ObjetoJSON, accion) {
  $("#modalHijo").empty();

  var titulo, readonly, botonActualizar, botonVerRegistros;
  if (accion === true) { 
    titulo = "Actualizar Evento";
    readonly = ""; 

    imagen = "<div>" +
    "<label for='imagenModal'>Imagen</label> " +
    "<input class='form-control' type='file' id='ImagenModal' onchange='readURL2(this)' value='" + ObjetoJSON[0].Imagen + "'>" + //Se debe poner el onchange para que lo identifique cuando se cambie la imagen
    "<input value='" + ObjetoJSON[0].Imagen + "' type='hidden' id='ImagenVieja'>" +
    "<img id='imgModal' class='imagenVA mt-2' src='/" + ObjetoJSON[0].Imagen + "'>" +
    "</div>"

    botonActualizar = "<div style='text-align: center;' class='mt-3'>" +
      "<button class='boton mb-3' id='actualizarModal'>" +
      "Actualizar Evento" +
      "</button>" +
      "</div>";
  } else { 
    titulo = "Ver Evento";
    readonly = "readonly='true'"; 
    botonActualizar = ""; 

    imagen = 
      "<div>" +
        "<label for='imagenModal'>Imagen</label> <br>" +
        "<img id='imgModal' class='imagenVA mt-2' src='/" + ObjetoJSON[0].Imagen + "'>" +
      "</div>";

    // Agregar botón para ver registros
  }

  var HTML = "<div class='modal-header'>" +
    "<h1 class='modal-title tituloModal fs-4'>" + titulo + "</h1>" +
    "<button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>" +
    "</div>" +
    "<div class='modal-body'>" +
    "<input type='hidden' id='_id' value='" + ObjetoJSON[0]._id + "'>" +
    "<div class='row'>" +
    "<div class='col-6'>" +
    "<div>" +
    "<label for='nombreModal'>Nombre</label>" +
    "<input id='nombreModal' type='text' value='" + ObjetoJSON[0].Nombre + "' class='form-control' " + readonly + ">" +
    "</div>" +
    "<div>" +
    "<label for='precioModal'>Precio</label>" +
    "<input id='precioModal' type='text' value='" + ObjetoJSON[0].Precio + "' class='form-control' " + readonly + ">" +
    "</div>" +
    "<div>" +
    "<label for='ubicacionModal'>Ubicación</label>" +
    "<input id='ubicacionModal' type='text' value='" + ObjetoJSON[0].Ubicacion + "' class='form-control' " + readonly + ">" +
    "</div>" +
     imagen +
    "</div>" +
    "<div class='col-6'>" +
    "<div>" +
    "<label for='descripcionModal'>Descripcion</label>" +
    "<input id='descripcionModal' type='text' value='" + ObjetoJSON[0].Descripcion + "' class='form-control' " + readonly + ">" +
    "</div>" +
    "<div>" +
    "<label for='fechaModal'>Fecha</label>" +
    "<input id='fechaModal' type='date' value='" + ObjetoJSON[0].Fecha + "' class='form-control' " + readonly + ">" +
    "</div>" +
    "<div>" +
    "<label for='horaModal'>Hora</label>" +
    "<input id='horaModal' type='time' value='" + ObjetoJSON[0].Hora + "' class='form-control' " + readonly + ">" +
    "</div>" +
    
   
    "</div>" +
    "</div>" +
    botonActualizar + 
    "</div>";

  $("#modalHijo").append(HTML);
}


function actualizarDatos(_id,nombre, precio, ubicacion, Descripcion, fechaEvento, horaEvento,  imagen, imagenVieja) {
  var formData = new FormData();
  formData.append("_id", _id);
  formData.append("nombre", nombre);
  formData.append("precio", precio);
  formData.append("ubicacion", ubicacion);
  formData.append("descripcion", Descripcion);
  formData.append("fecha", fechaEvento); 
  formData.append("hora", horaEvento);
  formData.append("Imagen", imagen);
  formData.append("imagenVieja", imagenVieja);
  formData.append("accion", "Actualizar");

  $('.loader-background').show();
  $('.loader').show();
  $.ajax({
    url: "/admin/eventos/actualizar",
    type: "POST",
    data: formData,
    processData: false, // No procesar los datos
    contentType: false, // No establecer el tipo de contenido
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
          text: "Información Actualizada Correctamente.",
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

function eliminar(idE){
  Swal.fire({
    title: "¿Esta seguro?",
    text: "Se eliminará este Evento",
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
          id:idE,
        }),
        url: "/admin/eventos/eliminar",
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


function obtenerRegistros(id){
  $('.loader-background').show();
  $('.loader').show();
  $.ajax({
    url: "/admin/eventos/obtenerRegistros?id="+id,
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
        llenarModalRegistros(response)
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

function llenarModalRegistros(registros) {
  $("#modalre").empty();
  var contenidoModal = "";

  registros.forEach(function(registro, index) {
    var nombresPersonasHTML = "<ul>";
    registro.nombresPersonas.split(",").forEach(function(nombrePersona) {
      nombresPersonasHTML += "<li>" + nombrePersona.trim() + "</li>";
    });
    nombresPersonasHTML += "</ul>";

    var nombresMascotasHTML = "<ul>";
    registro.nombresMascotas.split(",").forEach(function(nombreMascota) {
      nombresMascotasHTML += "<li>" + nombreMascota.trim() + "</li>";
    });
    nombresMascotasHTML += "</ul>";

    contenidoModal += `
      <div class="card mb-3" style="border-radius: 0.5rem; box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);">
        <div class="card-body">
          <h5 class="card-title">${registro.NombreUsuario} ${registro.PApellido}</h5>
          <p class="card-text"><strong>Correo:</strong> ${registro.Correo}</p>
          <p class="card-text"><strong>Telefono:</strong> ${registro.telefono}</p>
          <br/>
          <!-- Acordeón de nombres de personas -->
          <div class="accordion" id="accordionPersonas${index}">
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class='accordion-button custom-accordion-button' type="button" data-bs-toggle="collapse" data-bs-target="#collapsePersonas${index}" aria-expanded="true" aria-controls="collapsePersonas${index}">
                  Nombres de personas adicionales
                </button>
              </h2>
              <div id="collapsePersonas${index}" class="accordion-collapse collapse" aria-labelledby="headingPersonas${index}" data-bs-parent="#accordionPersonas${index}">
                <div class="accordion-body">
                  ${nombresPersonasHTML}
                </div>
              </div>
            </div>
          </div>
          <br/>
          <!-- Acordeón de nombres de mascotas -->
          <div class="accordion" id="accordionMascotas${index}">
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class='accordion-button custom-accordion-button' type="button" data-bs-toggle="collapse" data-bs-target="#collapseMascotas${index}" aria-expanded="true" aria-controls="collapseMascotas${index}">
                  Nombres de mascotas
                </button>
              </h2>
              <div id="collapseMascotas${index}" class="accordion-collapse collapse" aria-labelledby="headingMascotas${index}" data-bs-parent="#accordionMascotas${index}">
                <div class="accordion-body">
                  ${nombresMascotasHTML}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  });

  $("#modalre").html(contenidoModal);
  $("#modalR").modal("show");
}
