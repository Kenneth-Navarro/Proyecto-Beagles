from ..include.functions.recoge import  recoge_form, recoge_file, recoge_post
from DB.proveedores import obtenerProveedores
from DB.productos import insertarProducto, obtenerProductos, actualizarProducto, eliminaProducto,actualizarCantidad


def validarDatosProducto():  #Esta función es para limpiar y validar los datos antes de ingresarlos a la base

    #Se empieza limpiando los datos con el recoge_post

    codigo = recoge_form('codigo')
    nombre = recoge_form('nombre')
    cantidad = recoge_form('cantidad')
    precio = recoge_form ('precio')
    descripcion = recoge_form('descripcion')
    marca = recoge_form('marca')
    accion= recoge_form('accion')
    imagen = recoge_file('Imagen')
    proveedor= recoge_form('proveedor')
  


    #Se crea estas variables para despues usarlas para validar que los datos esten bien
    codigoOK= True
    nombreOK= True
    cantidadOK= True
    precioOK= True
    descripcionOK= True
    marcaOK= True
    imagenOK= True
    proveedorOK=True
   

    respuesta= ""



    if codigo == "":
        respuesta = "No ha ingresado ningún número de Codigo. "+ respuesta
        codigoOK = False
    elif len(codigo) > 6:
        respuesta = "El código no puede tener más de 6 caracteres."
        codigoOK = False 

    if nombre == "":
        respuesta = "No ha ingresado ningún nombre. "+ respuesta
        nombreOK = False

    if cantidad == "":
        respuesta = "No ha ingresado la cantidad del Producto. "+ respuesta
        cantidadOK = False
    elif not cantidad.isdigit():
        respuesta = "La cantidad solo debe contener números. "+ respuesta
        cantidadOK = False
    
    if precio == "":
        respuesta = "No ha ingresado ningún precio para el producto. "+ respuesta
        precioOK= False
    elif not precio.isdigit():
        respuesta = "El precio solo debe contener números. "+ respuesta
        precioOK = False
    
    if descripcion =="":
        respuesta = "No ha ingresado ningúna descripción para el producto. "+ respuesta
        descripcionOK= False

    if marca =="":
        respuesta = "No ha ingresado ningúna marca para el producto. "+ respuesta
        marcaOK= False

    if proveedor =="":
        respuesta = "No ha ingresado ningúna proveedor para el producto. "+ respuesta
        proveedorOK= False

    if imagen == None and accion != "Actualizar":
        respuesta = "No ha ingresado ninguna imagen. "+ respuesta
        imagenOK = False


    
    #Se valida que todas las validaciones hayan sido correctas
    if nombreOK and  codigoOK and cantidadOK and precioOK and descripcionOK and marcaOK and imagenOK and proveedorOK:
        if accion=="Ingreso":
            respuesta = insertarProducto(codigo, nombre, cantidad, precio, descripcion, marca, imagen, proveedor)
            return respuesta
        else:
            idCodigo = recoge_form('idCodigo')
            imagenVieja = recoge_form('imagenVieja')
            respuesta = actualizarProducto(idCodigo, codigo,  nombre, cantidad, precio, descripcion, marca, imagen, imagenVieja, proveedor)
            return respuesta
    else:
        return respuesta


def obtieneProductos():
    retorno = ""
    try:
        condicion = {}
        datos = {'_id': 0, 'Codigo': 1, 'Nombre': 1, 'Descripcion': 1, 'Precio':1, 'Cantidad':1 }
        retorno = obtenerProductos(condicion, datos)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno = "Error"
    
    return retorno

def obtieneProducto(id):
    retorno = ""
    try:
        condicion = {"Codigo":id}
        datos = {'_id': 0, 'Codigo': 1, 'Nombre': 1, 'Descripcion': 1, 'Precio':1, 'Cantidad':1,'Marca':1, 'Imagen':1, 'Proveedor':1}
        retorno = obtenerProductos(condicion, datos)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno="Error"
    
    return retorno

def eliminarProducto():
    retorno = ""
    try:
        id = recoge_post('idCodigo')
        retorno = eliminaProducto(id)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno="No se pudo eliminar el Producto"
    return retorno

def obtieneProveedorProducto():
    retorno = ""
    try:
        condicion = {}
        datos = {'_id':0,'Nombre':1}
        retorno = obtenerProveedores(condicion, datos)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno="Error"
    
    return retorno

def obtieneProductosTienda():
    retorno = ""
    try:
        condicion = {}
        datos = {'_id': 0, 'Codigo': 1, 'Nombre': 1, 'Descripcion': 1, 'Precio':1, 'Cantidad':1,'Marca':1, 'Imagen':1,}
        retorno = obtenerProductos(condicion, datos)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno = "Error"
    
    return retorno

def UpdateCantidad(codigo, cantidad, stock, cantidad_Antes):
    respuesta = ""
    cantidad_Antes = int(cantidad_Antes)  # Convertir a entero
    if stock > 1:
        Disponible = stock - cantidad_Antes
    if cantidad > Disponible:
        respuesta = "No puede ingresar dicha cantidad, ha superado el máximo permitido. Vuelva a ingresar la cantidad, solo puede agregar un máximo de: " + str(Disponible)
        return respuesta
    else:
        respuesta = "Se ha ingresado exitosamente el producto al carrito de compras"
        return respuesta


def obtener_productos_con_cantidad_asc():
    retorno = ""
    try:
        condicion = {}
        datos = {'_id': 0, 'Nombre': 1, 'Cantidad': 1}
        retorno = obtenerProductos(condicion, datos)
    except Exception as error:
        print(f"Se produjo un error: {error}")
        retorno = None
    
    return retorno