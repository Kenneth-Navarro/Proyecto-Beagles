from ..include.functions.recoge import recoge_post
import re #Se importa para la funcion de validar el correo
from DB.patrocinadores import insertarPatrocinador, obtenerPatrocinadores,actualizarPatrocinador,eliminaPatrocinador
from ..include.functions.validadores import tieneNumeros, validarCorreo

def validarDatosPatrocinador():  #Esta función es para limpiar y validar los datos antes de ingresarlos a la base

    #Se empieza limpiando los datos con el recoge_post
    nombrePatrocinador = recoge_post('nombrePatrocinador')
    nombreEncargado = recoge_post('nombreEncargado')
    correo = recoge_post('correo')
    telefono = recoge_post('telefono')
    descripcion = recoge_post('descripcion')
    accion = recoge_post('accion')

    #Se crea estas variables para despues usarlas para validar que los datos esten bien
    nombrePatrocinadorOK= True
    nombreEncargadoOK= True
    descripcionOK= True
    correoOK= True
    telefonoOK= True
   

    respuesta= ""

    if nombrePatrocinador == "":
        respuesta = "No ha ingresado ningún nombre del patrocinador. "+ respuesta
        nombrePatrocinadorOK = False
    elif  tieneNumeros(nombrePatrocinador):
        respuesta = "El nombre del patrocinador contiene números. "+ respuesta
        nombrePatrocinadorOK = False
    
    if nombreEncargado == "":
        respuesta = "No ha ingresado ningún nombre del encargado. "+ respuesta
        nombreEncargadoOK = False
    elif  tieneNumeros(nombreEncargado):
        respuesta = "El nombre del encargado contiene números. "+ respuesta
        nombreEncargadoOK = False
    if descripcion == "":
        respuesta = "No ha ingresado ningúna descipcion. "+ respuesta
        descripcionOK= False
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
    
  
    
    #Se valida que todas las validaciones hayan sido correctas
    if nombrePatrocinadorOK and  nombreEncargadoOK and telefonoOK and correoOK and descripcionOK :
        if accion == "Ingreso":
            respuesta = insertarPatrocinador(nombrePatrocinador,nombreEncargado,correo, telefono,descripcion)
            return respuesta
        else:
            id=recoge_post('_id')
            respuesta = actualizarPatrocinador(id,nombrePatrocinador,nombreEncargado,correo, telefono,descripcion)
    else:
        return respuesta


def obtienePatrocinadores():
    retorno = ""
    try:
        condicion = {}
        datos = {'_id': 1, 'NombrePatrocinador': 1, 'NombreEncargado': 1, 'Correo': 1, 'Telefono':1, 'Descripcion':1}
        retorno = obtenerPatrocinadores(condicion, datos)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno = "Error"
    
    return retorno

from bson import ObjectId
def obtienePatrocinador(id):
    retorno = ""
    try:
        # Convertir el id a ObjectId
        id_obj = ObjectId(id)

        # Definir el filtro de búsqueda
        condicion = {"_id": id_obj}

        # Definir los campos que deseas obtener en el resultado
        datos = {'_id': 1, 'NombrePatrocinador': 1, 'NombreEncargado': 1, 'Correo': 1, 'Telefono':1, 'Descripcion':1}

        retorno = obtenerPatrocinadores(condicion, datos)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno = "Error"
    
    return retorno

    
def eliminarPatrocinador():
    retorno = ""
    try:
        id = recoge_post('id')
        retorno = eliminaPatrocinador(id)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno="No se pudo eliminar el Proveedor"
    return retorno







