$(document).ready(function (){
  cargaCompras();
})

$(document).on('click', '#Ver', function() {
  obtenerCompra($(this).val(), true);
})

function cargaCompras() {
  
    $.ajax({
      url: "/admin/compras/obtenerCompras",
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
   $("#tablaCompras tbody").empty();
    // Recorre sobre los elementos del objeto JSON y agrega las filas de datos
    for (let i = 0; i < ObjetoJson.length; i++) {
      $("#tablaCompras tbody").append("<tr>");
      $("#tablaCompras tbody tr:last-child").append("<th>" + ObjetoJson[i].Nombre + " </th>");
      $("#tablaCompras tbody tr:last-child").append("<td>" + ObjetoJson[i].Correo + " </td>");
      $("#tablaCompras tbody tr:last-child").append("<td>" + ObjetoJson[i].Telefono + " </td>");
      $("#tablaCompras tbody tr:last-child").append("<td>" + ObjetoJson[i].Productos_Nombre + " </td>");

      $("#tablaCompras tbody tr:last-child").append("<td>" +
        "<button id='Ver' class='botones' value='"+ String(ObjetoJson[i]._id)+"' data-bs-toggle='modal' data-bs-target='#modal1'> <svg xmlns='http://www.w3.org/2000/sv' width='16' height='16' fill='currentColor' class='bi bi-eye-fill' viewBox='0 0 16 16'><path d='M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0'/><path d='M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7'/></svg></button></td>");
    }
    
    let table = new DataTable('#tablaCompras', {
      // Opciones adicionales
      "paging": true, // Habilitar paginación
      "ordering": true, // Habilitar ordenamiento por columnas
      "searching": true, // Habilitar búsqueda
      // Otros opciones según tus necesidades
    });
  
  }
  function obtenerCompra(id, accion){
    $.ajax({
      url: "/admin/compras/obtenerCompra?id="+id,
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
      titulo = "Ver Compra"
      
      readonly = "readonly='true'"

      boton=""

      fod = "" //Variable vacia por que no es un formulario
      finFod = "" //Fin de la variable
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
              "<label for='Prodcutos_NombreModal'>Productos</label>" +
              "<input id='nombrePModal' type='text' value='"+ObjetoJSON[0].Productos_Nombre+"' class='form-control'" + readonly + ">" +
          "</div>" +

          "<div>" +
              "<label for='nombrePModal'>Nombre</label>" +
              "<input id='nombrePModal' type='text' value='"+ObjetoJSON[0].Nombre+"' class='form-control'" + readonly + ">" +
          "</div>" +

          "<div>" +
          "<label for='nombreEModal'>Apellidos</label>" +
          "<input id='nombreEModal' type='text' value='"+ObjetoJSON[0].Apellidos+"' class='form-control'" + readonly + ">" +
         "</div>" +


         "<div>" +
         "<label for='TelefonoModal'>Telefono</label>" +
         "<input id='TelefonoModal' type='number' value='"+ObjetoJSON[0].Telefono+"' class='form-control'" + readonly + ">" +
     "</div>" +


        "<div>" +
              "<label for='descripcionModal'>Correo</label>" +
              "<input id='descripcionModal' type='text' value='"+ObjetoJSON[0].Correo+"' class='form-control' " + readonly + ">" +
        "</div>" +

          
        "<div>" +
              "<label for='Codigo_PostalModal'>Codigo Postal</label>" +
              "<input id='Codigo_PostalModal' type='number' value='"+ObjetoJSON[0].Codigo_Postal+"' class='form-control' " + readonly + ">" +
        "</div>" +

        "<div>" +
        "<label for='metodoModal'>Método de pago </label>" +
        "<input id='metodoModal' type='text' value='"+ObjetoJSON[0].Metodo+"' class='form-control' " + readonly + ">" +
        "</div>" +






        "</div>" +





        "<div class='col-6'>" +

   

        "<div>" +
        "<label for='CantidadModal'>Cantidad</label>" +
        "<input id='CantidadModal' type='text' value='"+ObjetoJSON[0].Productos_Cantidad+"' class='form-control' " + readonly + ">" +
        "</div>" +

        "<div>" +
        "<label for='PrecioUModal'>Precio Unitario</label>" +
        "<input id='PrecioUModal' type='text' value='"+ObjetoJSON[0].Productos_Precio_Unitario+"' class='form-control' " + readonly + ">" +
        "</div>" +



        "<div>" +
            "<label for='PaisModal'>Pais</label>" +
            "<input id='PaisModal' type='text' value='"+ObjetoJSON[0].Pais+"' class='form-control' " + readonly + ">" +
        "</div>" +

        "<div>" +
        "<label for='PaisModal'>Provincia</label>" +
        "<input id='PaisModal' type='text' value='"+ObjetoJSON[0].Provincia+"' class='form-control' " + readonly + ">" +
        "</div>" +


        "<div>" +
        "<label for='DistritoModal'>Distrito</label>" +
        "<input id='DistritoModal' type='text' value='"+ObjetoJSON[0].Distrito+"' class='form-control' " + readonly + ">" +
        "</div>" +
    
        "<div>" +
        "<label for='DireccionModal'>Direccion</label>" +
        "<input id='DireccionModal' type='text' value='"+ObjetoJSON[0].Direccion+"' class='form-control' " + readonly + ">" +
        "</div>" +

        "<div>" +
        "<label for='TotalModal'>Total</label>" +
        "<input id='TotalModal' type='text' value='"+ObjetoJSON[0].Total+"' class='form-control' " + readonly + ">" +
        "</div>" +


        "<div>" +
        "<label for='IVAModal'>IVA 13%</label>" +
        "<input id='IVAModal' type='text' value='"+ObjetoJSON[0].IVA+"' class='form-control' " + readonly + ">" +
        "</div>" +



      "</div>" +
      "</div>" +
      boton+
      finFod+
    "</div>";
    $("#modalHijo").append(HTML)
  }

  
  