from flask import request
from ..include.functions.recoge import recoge_post
import re #Se importa para la funcion de validar el correo
from DB.proveedores import insertarProveedor, obtenerProveedores, actualizarProveedor,eliminaProveedor
from ..include.functions.validadores import tieneNumeros, validarCorreo

def validarDatosProveedor():  #Esta función es para limpiar y validar los datos antes de ingresarlos a la base

    #Se empieza limpiando los datos con el recoge_post
    nombre = recoge_post('nombre')
    encargado = recoge_post('encargado')
    correo = recoge_post('correo')
    telefono = recoge_post('telefono')
    metodo = recoge_post('metodo')
    direccion = recoge_post("direccion")
    accion = recoge_post('accion')

    #Se crea estas variables para despues usarlas para validar que los datos esten bien
    nombreOK= True
    encargadoOK= True
    correoOK= True
    telefonoOK= True
    metodoOK= True
    direccionOK= True
    respuesta= ""

    if nombre == "":
        respuesta = "No ha ingresado ningún nombre. "+ respuesta
        nombreOK = False
    elif  tieneNumeros(nombre):
        respuesta = "El nombre contiene números. "+ respuesta
        nombreOK = False
    
    if encargado == "":
        respuesta = "No ha ingresado ningún encargado. "+ respuesta
        encargadoOK= False
    elif  tieneNumeros(encargado):
        respuesta = "El encargado contiene números. "+ respuesta
        encargadoOK= False
    if correo == "":
        respuesta = "No ha ingresado ningún correo. "+ respuesta
        correoOK= False
    elif validarCorreo(correo) is not True:
         respuesta = "El correo ingresado no es válido. "+ respuesta
         correoOK= False
    
    if telefono == "":
        respuesta = "No ha ingresado ningún número de telefono. "+ respuesta
        telefonoOK = False
    elif not telefono.isdigit():
        respuesta = "El telefono solo debe contener números. "+ respuesta
        telefonoOK = False
    elif len(telefono) != 8:
        respuesta = "El telefono debe ser de 8 dígitos. "+ respuesta
        telefonoOK = False

    if metodo == "":
        respuesta = "No ha ingresado ningún metodo de pago. "+ respuesta
        metodoOK= False
   
    if direccion == "":
        respuesta = "No ha ingresado ningúna dirección. "+ respuesta
        direccionOK = False
   
  
    
    #Se valida que todas las validaciones hayan sido correctas
    if nombreOK and  encargadoOK and telefonoOK and correoOK and metodoOK and direccionOK:
        if accion == "Ingreso":
            respuesta = insertarProveedor( nombre,encargado,correo, telefono,metodo,direccion)
            return respuesta
        else:
            id=recoge_post('_id')
            respuesta = actualizarProveedor(id,nombre,encargado,correo, telefono,metodo,direccion)
    else:
        return respuesta


def obtieneProveedores():
    retorno = ""
    try:
        condicion = {}
        datos = {'_id': 1, 'Nombre': 1, 'Encargado': 1, 'Telefono': 1}
        retorno = obtenerProveedores(condicion, datos)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno = "Error"
    
    return retorno

from bson import ObjectId
def obtieneProveedor(id):
    retorno = ""
    try:
        # Convertir el id a ObjectId
        id_obj = ObjectId(id)

        # Definir el filtro de búsqueda
        condicion = {"_id": id_obj}

        # Definir los campos que deseas obtener en el resultado
        datos = {"_id": 1,"Nombre":1,"Encargado":1, 'Telefono': 1, 'Correo': 1,'Metodo_Pago':1,'Direccion':1}

        retorno = obtenerProveedores(condicion, datos)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno = "Error"
    
    return retorno

    


def eliminarProveedor():
    retorno = ""
    try:
        id = recoge_post('id')
        retorno = eliminaProveedor(id)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno="No se pudo eliminar el Proveedor"
    return retorno




