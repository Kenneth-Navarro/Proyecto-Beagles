
$(document).ready(function () {
    cargaProductosIndex();
  });
  
  function cargaProductosIndex() {
  
    $.ajax({
      url: "/index",
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
          mostrarProductosIndex(response)
        }
      },
      error: function (xhr, status, error) {
        console.log("Error: ", error);
        console.log("Mensaje de error: ", xhr.responseJSON.error);
      },
    });
  
  }
  
  
  function mostrarProductosIndex(productArray) {
    var productContainer = document.getElementById('productContainer');
    
    tamano = null;

    if (productArray.length > 4){
      tamano = 4
    }else{
      tamano = productArray.length
    }

    for (var i = 0; i < tamano; i++) {
        var productHTML =
        '<div class="col-lg-4 col-sm-6 tarjeta m-5">' +
        '   <div class="product text-center">' +
        '       <div class="mb-3 position-relative">' +
        '           <div class="badge text-white bg-"></div>' +
        '         <a class="d-block" id="Ver" href="/tienda/obtenerProducto?id=' + productArray[i].Codigo + '">' +
        '               <img style="height: 100px" class=" mb-2"  src="/' + productArray[i].Imagen + '" alt="">' +
        '           </a>' +
        '           <div class="product-overlay">' +
        '       <h6>' +
        '           <p class=" mt-2 mb-2" >' + productArray[i].Nombre + '</p>' +
        '       </h6>' +
        '       <p class="small text-muted mb-3">' + '₡ ' +productArray[i].Precio + '</p>' +
        '               <ul class="mb-0 list-inline">' +
        '                   <li class="list-inline-item m-0 p-0 ">' +
        '                       <a class="botonAnadir" name="verproducto"  href="/tienda/obtenerProducto?id=' + productArray[i].Codigo + '">' +
        '                           Ver Producto' +
        '                       </a>' +
        '                   </li>' +
        '               </ul>' +
        '           </div>' +
        '       </div>' +
       
        '   </div>' +
        '</div>';
        productHTML = productHTML.replace('codigo', productArray[i].Codigo);
        productContainer.innerHTML += productHTML;
    }
  }
  
  