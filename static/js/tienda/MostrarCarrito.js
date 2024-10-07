document.addEventListener('DOMContentLoaded', function () {
    mostrarProductosDelCarrito(), gestionarSeleccionRadioButtons();
});
$(document).on('click', '#Pedido', function(e){
    e.preventDefault();
    let nombres = '';
    let cantidades = '';
    let precios = '';

    $(".nombreProducto").each(function() {
        nombres += $(this).text() + ',';
    });

    $(".cantidadProducto").each(function() {
        cantidades += $(this).text() + ',';
    });

    $(".precioProducto").each(function() {
        precios += $(this).text() + ',';
    });

    // Eliminar la última coma de cada cadena
    nombres = nombres.slice(0, -1);
    cantidades = cantidades.slice(0, -1);
    precios = precios.slice(0, -1);

    insertarDatos(
      nombres,
      cantidades,
      precios,
      $("#nombre").val(),
      $("#apellidos").val(),
      $("#correo").val(),
      $("#telefono").val(),
      $(".Pais").val(),
      $("#provincia").val(),
      $("#distrito").val(),
      $("#codigo_postal").val(),
      $("#dirreccion").val(),
      $(".total").text(),
      $(".subtotal").text()
    );
});
$(document).on('click', '#borrarProducto', function(e){
    e.preventDefault();
    borrarProducto()
});
$(document).on('click', '#vaciarCarrito', function(e){
    e.preventDefault();
    vaciarCarrito()
});

function mostrarProductosDelCarrito() {
    // Obtener el contenido del carrito del localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito'));
    var usuario = JSON.parse(sessionStorage['Usuario'])
    var nombre=""
    var PrimerApellido=""
    var SegundoApellido=""
    var Telefono=""
    var Correo=""

    if (carrito != null){
        var botonVacia = '<button class="vaciar-carrito-btn" id="vaciarCarrito"><i class="fas fa-trash-alt"></i>Vaciar carrito</button>';
        $("#carritoEliminar").append(botonVacia);
    }

    if (carrito != null && usuario != null){
        if(usuario.Rol == "Administrador"){

            nombre = usuario.Empleado[0].Nombre
            PrimerApellido = usuario.Empleado[0].PrimerApellido
            SegundoApellido = usuario.Empleado[0].SegundoApellido
            Telefono=usuario.Empleado[0].Telefono
            Correo=usuario.Empleado[0].Correo
        }else{

            nombre = usuario.Nombre
            PrimerApellido=usuario.PrimerApellido
            SegundoApellido=usuario.SegundoApellido
            Telefono=usuario.Telefono
            Correo=usuario.Correo
        }

        $("#Usuario").val(usuario.Usuario)

            // Seleccionar el cuerpo de la tabla HTML donde se mostrarán los productos del carrito
            let carritoTableBody = document.querySelector('.table tbody');

            // Limpiar el contenido previo del cuerpo de la tabla
            carritoTableBody.innerHTML = '';
        var Total=0
            // Iterar sobre cada producto en el carrito y agregarlo a la tabla
            
            carrito.forEach((producto, index) => { 
                // Crear una nueva fila para el producto
                let row = document.createElement('tr');

                // Insertar las celdas con los datos del producto
                row.innerHTML = `
                <td class="ps-0 py-4 border-light" scope="row">
                    <div class="d-flex align-items-center">
                        <img src="${producto.Imagen}" alt="${producto.nombre}" width="70" class="img-fluid rounded me-3">
                        <div>
                            <strong class="h6 nombreProducto">${producto.Nombre}</strong>
                        </div>
                    </div>
                </td>
                <td class="p-4 align-middle border-light" scope="row">
                    <p class="mb-0 small precioProducto">₡${producto.Precio}</p>
                </td>
                <td class="p-4 align-middle border-light" scope="row">
                    <p class="mb-0 small cantidadProducto">${producto.Cantidad}</p>
                </td>
                <td class="p-4 align-middle border-light" scope="row">
                    <p class="mb-0 small">₡${producto.Cantidad * producto.Precio}</p>
                </td>
            
                <td class="p-4 align-middle border-light" scope="row">
                <button class="btn btn-sm delete-btn" onclick="borrarProducto(${index})"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            
            
                carritoTableBody.appendChild(row);

                // Agregar la fila al cuerpo de la tabla

                Total+=(producto.Cantidad *producto.Precio)
                var Subtotal= Total*0.13

                var row2 = document.getElementById('Tu_Orden');
                row2.innerHTML = `
                <div class="card border-0 rounded-0 p-lg-4 bg-light">
                <div class="card-body">
                    <h5 class="text-uppercase mb-4">Tu Orden</h5>

                    <ul class="list-unstyled mb-0">
                    

                        <li class="border-bottom my-2 mb-5"></li>

                        <li class="d-flex align-items-center justify-content-between mb-2">
                            <strong class="text-uppercase small fw-bold">Impuesto</strong>
                            <span class="subtotal">₡${Subtotal}</span>
                        </li>
                        <li class="d-flex align-items-center justify-content-between mb-5">
                            <strong class="text-uppercase small fw-bold">Total</strong>
                            <span id="total" class="total">₡${Total}</span>
                        </li>
                    </ul>

                    <div class="form-check mb-3">
                    <input class="form-check-input" type="radio" name="metodo_pago" id="efectivo" value="efectivo">
                    <label class="form-check-label" for="efectivo">
                        Efectivo
                    </label>
                </div>
                <div class="form-check mb-5">
                    <input class="form-check-input" type="radio" name="metodo_pago" id="sinpe_movil" value="sinpe_movil">
                    <label class="form-check-label" for="sinpe_movil">
                        Sinpe Movil
                    </label>
                </div>
                    <div class="col-lg-12">
                        <button id="Pedido" class="btn rounded-4" style="background-color:#E97B7B ;"
                            type="submit">Realizar pedido</button>
                    </div>
                </div>
            </div>
            `;

            var row3 = document.getElementById('Detalle_pedido');
            row3.innerHTML = ` <h2 class="h3 mb-2">Detalle De Envio</h2>
            <form action="#">
                <div class="row gy-3">
                    <div class="col-lg-6">
                        <div class="coolinput">
                            <label class="text" for="nombre">Primer Nombre</label>
                            <input class="input" style="width: auto;" type="text" id="nombre" value="${nombre}">
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="coolinput">
                            <label class="text" for="apellidos">Apellidos </label>
                            <input class="input" style="width: auto;" type="text" id="apellidos" value="${PrimerApellido + " "+SegundoApellido }">
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="coolinput">
                            <label class="text" for="correo">Correo Electronico</label>
                            <input class="input" style="width: auto;"  type="email" id="correo"value="${Correo}">
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="coolinput">
                            <label class="text" for="telefono">Numero Telefono
                            </label>
                            <input class="input" style="width: auto;"  type="number" id="telefono"
                            value="${Telefono}">
                        </div>
                    </div>

                    <div class="col-lg-6 ">
                        <div class="coolinput">
                            <label class="text " for="region">País</label>
                            <input class="input Pais" type="text" style="width: auto;"   id="Pais"
                                value="Costa Rica" readonly>
                        </div>
                    </div>

                    <div class="col-lg-6 ">
                        <div class="coolinput">
                            <label class="text" for="provincia">Provincia</label>
                            <select class="select" type="text" style="width: auto;"  id="provincia">
                                <option>Seleccionar la Provincia</option>
                                <option value="San José">San José</option>
                                <option value="Alajuela">Alajuela</option>
                                <option value="Heredia">Heredia</option>
                                <option value="Cartago">Cartago</option>
                                <option value="Puntarenas">Puntarenas</option>
                                <option value="Guanacaste">Guanacaste</option>
                                <option value="Limón">Limón</option>
                            </select>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="coolinput">
                            <label class="text" for="distrito">Distrito</label>
                            <input class="input" type="text" style="width: auto;" placeholder='Escriba aquí...' id="distrito">
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="coolinput">
                            <label class="text" for="codigo_postal">Codigo Postal </label>
                            <input class="input" type="number" style="width: auto;" id="codigo_postal"
                                placeholder="Escriba aquí...">
                        </div>
                    </div>
                    <div class="col-lg-12">
                        <div class="coolinput">
                            <label class="text" for="dirreccion">Direccion </label>
                            <input class="input" type="text" style="width: auto;" id="dirreccion"
                                placeholder="Escriba aquí...">
                        </div>
                    </div>
                </div>
            </form>
            `;

            });
    }
}
function gestionarSeleccionRadioButtons() {
    const radioButtons = document.querySelectorAll('input[type="radio"][name="metodo_pago"]');

    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('click', function() {
            if (this.checked) {
                radioButtons.forEach(rb => {
                    if (rb !== this) {
                        rb.checked = false;
                    }
                });
            }
        });
    });
}

function insertarDatos(
    p_nombre, 
    p_cantidad, 
    p_precio, 
    nombre,
    apellidos,
    correo,
    telefono,
    Pais,
    provincia,
    distrito,
    codigo_postal,
    direccion,
    total,
    subtotal
) {
    // Obtener el método de pago seleccionado
    const metodoPago = document.querySelector('input[name="metodo_pago"]:checked');

    // Verificar si se ha seleccionado un método de pago
    if (metodoPago) {
        const metodoPagoValue = metodoPago.value;

        $.ajax({
            data: JSON.stringify({
                'p_nombre': p_nombre, 
                'p_cantidad': p_cantidad,
                'p_precio': p_precio, 
                'nombre': nombre,
                'apellidos': apellidos,
                'correo': correo,
                'telefono': telefono,
                'Pais': Pais,
                'provincia': provincia,
                'distrito': distrito,
                'codigo_postal': codigo_postal,
                'direccion': direccion,
                'metodo_pago': metodoPagoValue, // Pasar el método de pago seleccionado
                'total': total,
                'subtotal': subtotal,
                'accion': 'Ingreso'
            }),
            url: "/carrito/ingreso",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            success: function(response) {
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
                            localStorage.clear();
                            location.reload();
                        }
                    });
                }
            },
            error: function(xhr, status, error) {
                console.log("Error: ", error)
                console.log("Mensaje de error: ", xhr.responseJSON.error)
        
                // Manejar el error mostrando un mensaje al usuario
                Swal.fire({
                    icon: "error",
                    title: "Error al procesar la solicitud",
                    text: "Por favor, inténtalo de nuevo más tarde.",
                }).then((result) => {
                    if (result.isConfirmed) {
                        
                    }
                });
            },
         
        });
}else {
    // Mostrar un mensaje de error si no se ha seleccionado un método de pago
    Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, selecciona un método de pago.",
    }).then((result) => {
        if (result.isConfirmed) {
        }
    });
}
}

function borrarProducto(index) {
    // Obtener el contenido del carrito del localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito'));
    
    // Verificar si se proporcionó un índice válido
    if (index >= 0 && index < carrito.length) {
        // Eliminar el producto del carrito utilizando el índice
        carrito.splice(index, 1);

        // Actualizar el carrito en el localStorage con el nuevo contenido
        localStorage.setItem('carrito', JSON.stringify(carrito));

        // Recargar la página para reflejar los cambios en la interfaz
        location.reload();
    } else {
        // Mostrar un mensaje de error si se proporciona un índice inválido
        console.error("Índice de producto inválido");
    }
}
function vaciarCarrito() {
     localStorage.removeItem('carrito')
     $("#carritoEliminar").remove();
     location.reload();

}

