var proveedores = null;

$(document).ready(function () {
  cargaProductos(),
  cargaProveedores();

  $("#Enviar").click(function (e) {
    e.preventDefault();

    enviarDatos(
      $("#Codigo").val(),
      $("#Nombre").val(),
      $("#Cantidad").val(),
      $("#Precio").val(),
      $("#Descripcion").val(),
      $("#Marca").val(),
      $('#Imagen')[0].files[0],
      $("#Proveedor").val()
    );
  });


$(document).on('click', '#Ver', function () {
  obtenerProducto($(this).val(), true);
});

$(document).on('click', '#Actualizar', function () {
  obtenerProducto($(this).val(), false);
});

$(document).on('click', '#actualizarModal', function(e){
  e.preventDefault();
  actualizarDatos(
    $("#idCodigo").val(),
    $("#codModal").val(),
    $("#nombreModal").val(),
    $("#cantidadModal").val(),
    $("#precioModal").val(),
    $("#descripModal").val(),
    $("#marcaModal").val(),
    $('#ImagenModal')[0].files[0],
    $("#ImagenVieja").val(),
    $("#Proveedor").val()
  );
});

$(document).on('click', '#Eliminar', function(){
  eliminar($(this).val());
})

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
//Funcion para mostrar la imagen del Modal2
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
//Funcion para mostrar la imagen del  (Ver y Actualizar)
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


function cargaProveedores(){
  $.ajax({
    url: "/admin/productos/obtenerProveedor",
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
        proveedores = response;
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
  $("#Proveedor").empty;

  opciones = "<option selected value=''>Seleccionar Proveedor</option>";

  ObjetoJson.forEach(element => {
    opciones=opciones + "<option value='"+ element['Nombre'] +"'> "+ element['Nombre']+ "</option>"
  });
  
  $("#Proveedor").append(opciones);
  
}

function enviarDatos(
  codigo,
  nombre,
  cantidad,
  precio,
  descripcion,
  marca,
  imagen,
  proveedor
) {
  var formData = new FormData();
  formData.append("codigo", codigo);
  formData.append("nombre", nombre);
  formData.append("cantidad", cantidad);
  formData.append("precio", precio);
  formData.append("descripcion", descripcion);
  formData.append("marca", marca);
  formData.append("Imagen", imagen);
  formData.append("accion", "Ingreso");
  formData.append("proveedor", proveedor);

  $('.loader-background').show();
  $('.loader').show();
  $.ajax({
    url: "/admin/productos/ingreso",
    type: "POST",
    data: formData,
    processData: false, // No procesar los datos
    contentType: false, // No establecer el tipo de contenido
    success: function (response) {
      if (response.error) {
        $('.loader-background').hide();
        $('.loader').hide();
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


function actualizarDatos(
  idCodigo,
  codigo,
  nombre,
  cantidad,
  precio,
  descripcion,
  marca,
  imagen,
  imagenVieja,
  proveedor
) {
  var formData = new FormData();
  formData.append("idCodigo", idCodigo);
  formData.append("codigo", codigo);
  formData.append("nombre", nombre);
  formData.append("cantidad", cantidad);
  formData.append("precio", precio);
  formData.append("descripcion", descripcion);
  formData.append("marca", marca);
  formData.append("Imagen", imagen);
  formData.append("imagenVieja", imagenVieja);
  formData.append("proveedor", proveedor);
  formData.append("accion", "Actualizar");
  $('.loader-background').show();
  $('.loader').show();
  $.ajax({
    url: "/admin/productos/actualizar",
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



function eliminar(idCodigo) {
  Swal.fire({
    title: "¿Esta seguro?",
    text: "Se eliminará este Producto",
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
          idCodigo: idCodigo,
        }),
        url: "/admin/productos/eliminar",
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


function cargaProductos() {

  $.ajax({
    url: "/admin/productos/obtenerProductos",
    type: "GET",
    dataType: "json",
    contentType: "application/json",
    success: function (response) {
      if (response.error) {
        Swal.fire({
          icon: "error",
          title: "¡Uy ha Ocurrido un Error!",
          text: "No se ha podido cargar la información. Por favor comuniquese con el desarrollador.",
        }).then((result) => {
          if (result.isConfirmed) {
          }
        });
      } else {
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
  $("#productosTabla tbody").empty();


  // Itera sobre el objeto JSON y agrega filas a la tabla
  for (let i = 0; i < ObjetoJson.length; i++) {
      $("#productosTabla tbody").append("<tr>");
      $("#productosTabla tbody tr:last-child").append("<th>" + ObjetoJson[i].Codigo + "</th>");
      $("#productosTabla tbody tr:last-child").append("<td>" + ObjetoJson[i].Nombre + "</td>");
      $("#productosTabla tbody tr:last-child").append("<td>" + ObjetoJson[i].Descripcion + "</td>");
      $("#productosTabla tbody tr:last-child").append("<td>" + ObjetoJson[i].Precio + "</td>");
      $("#productosTabla tbody tr:last-child").append("<td>" + ObjetoJson[i].Cantidad + "</td>");
      $("#productosTabla tbody tr:last-child").append("<td>" +
          "<button id='Ver' class='botones' value='" + ObjetoJson[i].Codigo + "' data-bs-toggle='modal' data-bs-target='#modal1'> <svg xmlns='http://www.w3.org/2000/sv' width='16' height='16' fill='currentColor' class='bi bi-eye-fill' viewBox='0 0 16 16'><path d='M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0'/><path d='M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7'/></svg></button></td>");
      $("#productosTabla tbody tr:last-child").append("<td>" +
          "<button id='Actualizar' value='" + ObjetoJson[i].Codigo + "' class=' botones btn ' data-bs-toggle='modal' data-bs-target='#modal1'>  <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-pencil-fill' viewBox='0 0 16 16'><path d='M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z'/></svg></button></td>");
      $("#productosTabla tbody tr:last-child").append("<td>" +
          "<button id='Eliminar' value='" + ObjetoJson[i].Codigo + "' class=' botones btn'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'><path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z'/><path d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z'/></svg></button></td>");
  }

  
  new DataTable('#productosTabla', {
    // Opciones adicionales
    "paging": true, // Habilitar paginación
    "ordering": true, // Habilitar ordenamiento por columnas
    "searching": true, // Habilitar búsqueda
    // Otros opciones según tus necesidades
  });

}



function obtenerProducto(id, accion) {
  $.ajax({
    url: "/admin/productos/obtenerProducto?id=" + id,
    type: "GET",
    dataType: "json",
    contentType: "application/json",
    success: function (response) {
      if (response.error) {
        Swal.fire({
          icon: "error",
          title: "¡Uy ha Ocurrido un Error!",
          text: "No se ha podido cargar la información. Por favor comuniquese con el desarrollador.",
        }).then((result) => {
          if (result.isConfirmed) {
          }
        });
      } else {
        llenarModal(response, accion);
      }
    },
    error: function (xhr, status, error) {
      console.log("Error: ", error);
      console.log("Mensaje de error: ", xhr.responseJSON.error);
    },
  });
}




function llenarModal(ObjetoJSON, accion) {
  $("#modalHijo").empty();
  //Se valida si la accion es para la vista o para actualizar, si es vista viene como true y si es actualizar viene como false.
  if (accion === true) {
    //Algunos datos que se usan para ponerlos en el modal que se va a crear
    //El titulo que va a llevar el modal
    titulo = "Ver Producto"

    readonly = "readonly='true'"

    tipo = "form-select"
    seleccion = "";

    proveedor = ObjetoJSON[0].Proveedor;

    //Cree la estructura del campo de proveedor
    proveedorModal = "<label for='proveedorModal'>Proveedor</label>" +
    "<input id='proveedorModal' value='"+ObjetoJSON[0].Proveedor+"' class='form-control' " + readonly + ">"


    boton = ""

    //Se crea la estructura de la imagen
    imagen = 
      "<div>" +
        "<label for='imagenModal'>Imagen</label> <br>" +
        "<img id='imgModal' class='imagenVA mt-2' src='/" + ObjetoJSON[0].Imagen + "'>" +
      "</div>"

    fod = "" //Variable vacia por que no es un formulario
    finFod = "" //Fin de la variable
  } else {
    titulo = "Actualizar Producto"

    tipo = "form-select"

    readonly = ""

    seleccion = "";

    proveedor = ObjetoJSON[0].Proveedor;

    proveedores.forEach(element => {
      if (element.Nombre===proveedor) {
        seleccion = seleccion + "<option value='"+element.Nombre+"' selected>"+element.Nombre+"</option>";
      }else{
        seleccion = seleccion + "<option value='"+element.Nombre+"'>"+element.Nombre+"</option>";
      }
    });

    proveedorModal = 
    "<label for='Proveedor'>Proveedor</label>" +
    "<select id='Proveedor' name='Proveedor' value='"+ObjetoJSON[0].Proveedor+"' class='form-select'> "+seleccion

    //Se crea la estructura del boton que se va a utilizar para actualizar
    boton = 
      "<div style='text-align: center;' class='mt-3'>" +
        "<button class='boton btn mb-3' id='actualizarModal' >" +
          "<span>Actualizar Producto</span>" +
        "</button>" +
      "</div>";

    //La misma estructura, solo que ahora se va a poder cambiar la imagen
    imagen = "<div>" +
      "<label for='imagenModal'>Imagen</label> " +
      "<input class='form-control' type='file' id='ImagenModal' onchange='readURL2(this)' value='" + ObjetoJSON[0].Imagen + "'>" + //Se debe poner el onchange para que lo identifique cuando se cambie la imagen
      "<input value='" + ObjetoJSON[0].Imagen + "' type='hidden' id='ImagenVieja'>" +
      "<img id='imgModal' class='imagenVA mt-2' src='/" + ObjetoJSON[0].Imagen + "'>" +
      "</div>"

    //Este fod si va a ser un  formulario para actualizar
    fod = "<form action='' id='formularioModal' method='post' novalidate='novalidate' enctype='multipart/form-data'>"
    finFod = "</form>"
  }

  var HTML = 
    "<div class='modal-header'>" +
      "<input id='idCodigo' type='hidden' value='" + ObjetoJSON[0].Codigo + "'>" +
      "<h1 class='modal-title tituloModal fs-4'>" + titulo + "</h1>" +
      " <button id='cerrarModal' type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>" +
    "</div>" +
    "<div class='modal-body'>" +
      fod +
      "<div class='row'>" +
        "<div class='col-6'>" +
          "<div>" +
            "<label for='codModal'>Codigo Producto</label>" +
            "<input id='codModal' type='text' value='" + ObjetoJSON[0].Codigo + "' class='form-control' " + readonly + ">" +
          "</div>" +
          "<div>" +
            "<label for='descripModal'>Descripcion</label>" +
            "<input id='descripModal' type='text' value='" + ObjetoJSON[0].Descripcion + "' class='form-control' " + readonly + ">" +
          "</div>" +
          "<div>" +
            "<label for='cantidadModal'>Cantidad</label>" +
            "<input id='cantidadModal' type='number' value='" + ObjetoJSON[0].Cantidad + "' class='form-control' " + readonly + ">" +
          "</div>" +
          "<div id='proveedorPoner'>"+
          "</div>"+
        "</div>" +
       
        "<div class='col-6'>" +
          "<div>" +
            "<label for='nombreModal'>Nombre Producto</label>" +
            "<input id='nombreModal' type='text' value='" + ObjetoJSON[0].Nombre + "' class='form-control' " + readonly + ">" +
          "</div>" +
          "<div>" +
            "<label for='precioModal'>Precio</label>" +
            "<input id='precioModal' type='number' value='" + ObjetoJSON[0].Precio + "' class='form-control' " + readonly + ">" +
          "</div>" +
          "<div>" +
            "<label for='marcaModal'>Marca</label>" +
            "<input id='marcaModal' type='text' value='" + ObjetoJSON[0].Marca + "' class='form-control' " + readonly + ">" +
          "</div>" +
            imagen +
           
        "</div>" +
      "</div>" +
        boton +
        finFod +
    "</div>";

  $("#modalHijo").append(HTML)
  $("#proveedorPoner").append(proveedorModal) 

}
