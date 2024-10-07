$(document).ready(function () {
    // Función para mostrar los productos almacenados en localStorage en la tabla del carrito
    function mostrarProductosEnCarrito() {
        // Obtener el carrito actual almacenado en localStorage
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

        // Obtener la tabla del carrito
        let tablaCarrito = $('#carrito-table tbody');

        // Limpiar la tabla del carrito antes de mostrar los productos
        tablaCarrito.empty();

        // Iterar sobre los productos en el carrito y agregarlos a la tabla
        carrito.forEach(function (producto) {
            let fila = `
                <tr>
                    <td>${producto.Nombre}</td>
                    <td>${producto.Precio}</td>
                    <td>${producto.Cantidad}</td>
                    <td>${producto.Precio * producto.Cantidad}</td>
                </tr>
            `;
            tablaCarrito.append(fila);
        });
    }

    // Función para limpiar el carrito
    function limpiarCarrito() {
        // Limpiar el localStorage
        localStorage.removeItem('carrito');
    }

    // Mostrar los productos del carrito al cargar la página
    mostrarProductosEnCarrito();

    // Resto de tu código...

    // Cuando se hace clic en el botón para agregar al carrito, limpiar el carrito y agregar el producto
    $('#Carrito').click(function () {
        limpiarCarrito();
        %(productoSeleccionado.Codigo, productoSeleccionado.Nombre, productoSeleccionado.Precio, productoSeleccionado.Imagen, productoSeleccionado.Cantidad, productoSeleccionado.CantidadDisponible);
    });

    // Resto de tu código...
});
