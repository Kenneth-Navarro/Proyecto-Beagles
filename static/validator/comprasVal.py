from ..include.functions.recoge import recoge_post
import re #Se importa para la funcion de validar el correo
from DB.comprasAdmin import obtenerCompras
from ..include.functions.validadores import tieneNumeros, validarCorreo

def obtieneCompras():
    retorno = ""
    try:
        condicion = {}
        datos = {'_id': 1, 'Nombre': 1, 'Correo': 1, 'Telefono': 1, 'Productos_Nombre':1}
        retorno = obtenerCompras(condicion, datos)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno = "Error"
    
    return retorno

from bson import ObjectId
def obtieneCompra(id):
    retorno = ""
    try:
        # Convertir el id a ObjectId
        id_obj = ObjectId(id)

        # Definir el filtro de búsqueda
        condicion = {"_id": id_obj}

        # Definir los campos que deseas obtener en el resultado
        datos = {'_id': 1, 'Nombre': 1, 'Apellidos': 1, 'Correo': 1, 'Telefono':1, 'Pais':1,'Provincia':1,'Distrito':1,'Codigo_Postal':1,'Direccion':1,'Metodo':1,'Total':1,'IVA':1,'Productos_Nombre':1,'Productos_Cantidad':1,'Productos_Precio_Unitario':1}

        retorno = obtenerCompras(condicion, datos)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno = "Error"
    
    return retorno

    




