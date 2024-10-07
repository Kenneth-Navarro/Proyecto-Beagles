

var productoSeleccionado = {};

$(document).ready(function () {
    var quantityInput = $('#quantity');
    var carritoButton = $('#Carrito');

    $('.btn[data-type="minus"], .btn[data-type="plus"]').click(function () {
        var operation = $(this).data('type');
        var currentValue = parseInt(quantityInput.val());

        if (operation === 'plus') {
            if (currentValue < parseInt(quantityInput.attr('max'))) {
                quantityInput.val(currentValue + 1);
            }
        } else if (operation === 'minus') {
            if (currentValue > parseInt(quantityInput.attr('min'))) {
                quantityInput.val(currentValue - 1);
            }
        }

        actualizarAtributoCantidad();
    });

    quantityInput.on('input', function () {
        actualizarAtributoCantidad();
    });

    function actualizarAtributoCantidad() {
        var nuevaCantidad = quantityInput.val();
        var cantidadDisponible = quantityInput.attr('max');
    
        // Crear el objeto producto con las propiedades necesarias
        var producto = {
            Codigo: carritoButton.data('codigo'),
            Imagen: carritoButton.data('imagen'),
            Nombre: carritoButton.data('nombre'),
            Precio: carritoButton.data('precio'),
            CantidadSeleccionada: carritoButton.data('cantidadSeleccionada'),
            CantidadStock: carritoButton.data('cantidadStock'),
            Cantidad: nuevaCantidad,
            CantidadDisponible: cantidadDisponible
        };
    
        // Actualizar el atributo data-producto
        carritoButton.data('producto', producto);
    }
    
    carritoButton.click(function () {
        var producto = carritoButton.data('producto');
        if (producto && producto.Cantidad) {
            console.log("Añadiendo al carrito con cantidad: ", producto.Cantidad);
            // Llamar a la función con la cantidad
            agregarProductoAlCarrito(producto.Codigo, producto.Nombre, producto.Precio, producto.Imagen, producto.Cantidad, producto.CantidadDisponible);
        } else {
            console.error("Error: No se pudo obtener la cantidad del producto.");
        }
    });
});



let arregloCarrito = []; // Declarar el arregloCarrito globalmente

function sincronizarCarrito() {
    // Obtener el contenido del carrito del localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Si el carrito está vacío, inicializarlo con un valor predeterminado
    if (carrito.length === 0) {
        carrito = []; // Puedes definir un valor predeterminado aquí o dejarlo vacío según tus necesidades
    }

    // Limpiar el arregloCarrito
    arregloCarrito = [];

    // Iterar sobre cada producto en el carrito y agregarlo al arregloCarrito si no existe
    carrito.forEach(producto => {
        let productoExistenteIndex = arregloCarrito.findIndex(p => p.Codigo === producto.Codigo);
        if (productoExistenteIndex === -1) {
            arregloCarrito.push(producto);
        }
    });

    // Actualizar el contenido del carrito en el localStorage
    localStorage.setItem('carrito', JSON.stringify(arregloCarrito));
}

var usuario = JSON.parse(sessionStorage.getItem('Usuario'));


function agregarProductoAlCarrito(id, nombre, precio, imagen, cantidad, cantidadDisponible) {
     //localStorage.removeItem('carrito')
    // Obtener el carrito actual almacenado en localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Verificar si el producto ya está en el carrito
    let productoExistenteIndex = carrito.findIndex(producto => producto.Codigo === id);

    // Definir la cantidad anterior como 0 por defecto
    let cantidadAntes = 0;

    if (productoExistenteIndex !== -1) {
        // Obtener la cantidad anterior antes de la actualización
        cantidadAntes = carrito[productoExistenteIndex].Cantidad;

        // Calcular la nueva cantidad sin exceder el límite de stock disponible
        let nuevaCantidad = parseInt(carrito[productoExistenteIndex].Cantidad) + parseInt(cantidad);

        // Verificar si la nueva cantidad es menor que cero
        let cantidadMaxima = Math.max(nuevaCantidad, 0);

        // Verificar si la nueva cantidad excede el límite de stock disponible
        if (cantidadMaxima > parseInt(cantidadDisponible)) {
            // Mostrar mensaje de error utilizando SweetAlert
         
        } else {
            // Actualizar la cantidad en el carrito
            carrito[productoExistenteIndex].Cantidad = cantidadMaxima;
        }
    } else {
        // Si el producto no está en el carrito, lo añadimos
        let cantidadMaxima = Math.max(0, Math.min(parseInt(cantidad), parseInt(cantidadDisponible)));
        carrito.push({
            Codigo: id,
            Nombre: nombre,
            Precio: precio,
            Imagen: imagen,
            Cantidad: cantidadMaxima // Asegurarse de que la cantidad mínima sea 0
        });
    }

    // Actualizar el carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    arregloCarrito = carrito;

    // Imprimir el contenido del carrito en la consola
    console.log('Contenido del carrito:', carrito);


    if (!usuario || Object.keys(usuario).length === 0) {
        // Si el usuario es null o está vacío, mostrar el mensaje con SweetAlert y la pelotita de carga
        $('.loader-background').show();
        $('.loader').show();
        Swal.fire({
            icon: "warning",
            title: "No ha iniciado sesión",
            text: "Debes iniciar sesión para agregar un producto al carrito de compras.",
            showCancelButton: true,
            confirmButtonText: "Iniciar sesión",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            // Ocultar la pelotita de carga después de que el usuario haya tomado una decisión
            $('.loader-background').hide();
            $('.loader').hide();
    
            // Realizar acciones dependiendo de la decisión del usuario
            if (result.isConfirmed) {
                // Redirigir al usuario a la página de iniciar sesión si decide iniciar sesión
                window.location.href = "/iniciarSesion";
            } else {
                // Mostrar un mensaje de confirmación de cancelación si decide cancelar
                Swal.fire({
                    icon: "info",
                    title: "Operación cancelada",
                    text: "No se ha agregado ningún producto al carrito de compras."
                });
            }
        });
    
    
    } else {
       
    // Realizar la solicitud AJAX para agregar el producto al carrito en el servidor
    $.ajax({
        url: '/tienda/anadirProducto',
        type: 'POST',
        data: {
            id: id,
            cantidad: cantidad,
            cantidadAntes: cantidadAntes, // Pasar la cantidad anterior en la solicitud AJAX
            cantidadStock: cantidadDisponible
        },
        success: function (response) {
            // Mostrar mensaje de éxito utilizando SweetAlert si la operación se completó correctamente
            if (response.type === "success") {
                // Mostrar mensaje de éxito utilizando SweetAlert
                Swal.fire({
                    icon: "success",
                    title: "¡Producto añadido al carrito!",
                    text: response.message,
                });
            } else if (response.type === "warning") {
                // Mostrar mensaje de advertencia utilizando SweetAlert
                Swal.fire({
                    icon: "warning",
                    title: "¡Advertencia!",
                    text: response.message,
                });
            }
        },
        error: function (xhr, status, error) {
            // Mostrar mensaje de error utilizando SweetAlert si hay un error en la solicitud AJAX
            Swal.fire({
                icon: "error",
                title: "¡Uy ha Ocurrido un Error!",
                text: "No se ha podido cargar la información. Por favor comuniquese con el desarrollador.",
            });
            console.log("Error: ", error);
            console.log("Mensaje de error: ", xhr.responseJSON.error);
        },
    });
     // Llamar a la función para sincronizar el carrito al final
     sincronizarCarrito();
    }


}


