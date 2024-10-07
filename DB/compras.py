from .Conexion import conexion, desconectar
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
import os

def obtener_cantidad_producto(nombre_producto, db):
    # Busca el producto por su nombre en la colección 'Productos'
    producto = db['Productos'].find_one({'Nombre': nombre_producto})
    if producto:
        return int(producto['Cantidad'])  # Convertir la cantidad a entero
    else:
        return None
def actualizar_cantidad_producto(nombre_producto, total, db):
    # Convertir la cantidad comprada a una cadena antes de realizar la actualización
    nuevaCantidad = str(total)

    # Actualiza la cantidad del producto restando la cantidad comprada
    db['Productos'].update_one({'Nombre': nombre_producto}, {'$set': {'Cantidad': nuevaCantidad}})


def insertarCompra(productos_nombre, productos_cantidad, productos_precio_unitario, nombre, apellidos, correo, telefono, pais, provincia, distrito, codigo_postal, direccion, metodo, total, subtotal):
    respuesta = ""
    try:
        # Recibe los valores de la conexión
        cliente, db = conexion()

        # Accede a la colección de Compras
        compra = db['Compras']
        GuardarProductos=productos_nombre
        GuardarCantidades =productos_cantidad
        GuardarPrecio =productos_precio_unitario
        GuardarTotal= total
        # Convertir las cadenas de productos a listas
        nombres = productos_nombre.split(",")
        cantidades = [int(cantidad) for cantidad in productos_cantidad.split(",")]
        precios_unitarios = [float(precio.lstrip('₡')) for precio in productos_precio_unitario.split(",")]

        for i in range(len(nombres)):
            nombre_producto = nombres[i]
            cantidad_producto = cantidades[i]
            precio_unitario = precios_unitarios[i]

            # Consulta la cantidad actual del producto
            cantidad_disponible = obtener_cantidad_producto(nombre_producto, db)
            
            if cantidad_disponible is None:
                respuesta = f"No se encontró el producto '{nombre_producto}' en la base de datos."
                break
            elif cantidad_disponible < cantidad_producto:
                respuesta = f"No hay suficientes unidades disponibles del producto '{nombre_producto}'."
                break
            else:
                # Inserta la nueva compra en la colección de Compras
               
                total=0
                total=cantidad_disponible - cantidad_producto
                # Actualiza la cantidad del producto después de la compra
                actualizar_cantidad_producto(nombre_producto, total, db)
        nueva_compra = {'Productos_Nombre': GuardarProductos, 'Productos_Cantidad': GuardarCantidades, 'Productos_Precio_Unitario': GuardarPrecio, 'Nombre': nombre, 'Apellidos': apellidos, 'Correo': correo, 'Telefono': telefono, 'Pais': pais, 'Provincia': provincia, 'Distrito': distrito, 'Codigo_Postal': codigo_postal, 'Direccion': direccion, 'Metodo': metodo, 'IVA': subtotal, 'Total': GuardarTotal}
        compra.insert_one(nueva_compra)
        if not respuesta:
            respuesta = "OK"
    
    except DuplicateKeyError as e:
        documento = e.details.get("keyValue")
        campo = list(documento.keys())[0]
        respuesta = f"La información ingresada en '{campo}' ya existe en el sistema"
    except Exception as error:
        print(f"Se produjo un error: {error}")
        respuesta = "Ocurrió un error, por favor comuníquese con el desarrollador"
    finally:
        desconectar(cliente)
    
    return respuesta
