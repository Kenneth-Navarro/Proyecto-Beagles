from flask import request
from ..include.functions.recoge import recoge_post , recoge_form, recoge_file
from DB.eventos import insertarEvento, obtenerEventos, actualizarEvento, eliminaEvento,insertarRegistroEvento, obtenerRegistros,validarRegistros,eliminaRegistro
from ..include.functions.validadores import tieneNumeros
from bson import ObjectId

def validarDatosEvento():

    nombre = recoge_form('nombre')
    precio = recoge_form('precio')
    ubicacion =  recoge_form('ubicacion')
    descripcion = recoge_form('descripcion')
    fecha = recoge_form('fecha')
    hora = recoge_form('hora')
    imagen = recoge_file('Imagen')
    accion= recoge_form('accion')
    nombreOK= True
    precioOK= True
    ubicacionOK= True
    descripcionOK= True
    imagenOK= True
    

    respuesta = ""
    if nombre == "":
        respuesta = "No ha ingresado ningún nombre. "+ respuesta
        nombreOK=False
    elif tieneNumeros(nombre):
        respuesta = "El nombre contiene números. "+ respuesta
        nombreOK = False


    if ubicacion == "":
        respuesta = "No ha ingresado ningúna ubicacion. "+ respuesta
        ubicacionOK=False

    if descripcion == "":
        respuesta = "No ha ingresado ningúna descripcion. "+ respuesta
        descripcionOK=False
        
    if precio == "":
        respuesta = "No ha ingresado ningún precio para el producto. "+ respuesta
        precioOK= False
    
    if imagen == None and accion != "Actualizar":
        respuesta = "No ha ingresado ninguna imagen. "+ respuesta
        imagenOK = False

    if nombreOK and descripcionOK and ubicacionOK and precioOK and imagenOK:
        if accion=="Ingreso":
            respuesta = insertarEvento(nombre,precio, ubicacion, descripcion, fecha, hora, imagen)
            return respuesta
        else:
            _id = recoge_form('_id')
            imagenVieja = recoge_form('imagenVieja')
            respuesta = actualizarEvento(_id,nombre,precio, ubicacion, descripcion,  fecha, hora, imagen, imagenVieja)
            return respuesta
    else:
        return respuesta

    
        
def obtieneEventos():
    retorno = ""
    try:
        condicion = {}
        consulta = {'_id':1,'Nombre':1, 'Descripcion':1, 'Precio':1, 'Ubicacion':1, 'Fecha':1, 'Hora':1}
        retorno = obtenerEventos(condicion, consulta)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno = "Error"
    
    return retorno


def obtieneRegistros(id):
    retorno = ""
    try:
        condicion = {"idEvento":id}
        datos = {"_id":0}

        retorno = obtenerRegistros(condicion, datos)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno = "Error"
    
    return retorno
from bson import ObjectId

def obtieneEvento(id):
    retorno = ""
    try:
        id_obj = ObjectId(id)

        condicion = {"_id": id_obj}

        datos = {'_id':1,'Nombre':1, 'Descripcion':1, 'Precio':1, 'Ubicacion':1, 'Fecha':1, 'Hora':1,'Imagen':1}

        retorno = obtenerEventos(condicion, datos)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno = "Error"
    
    return retorno

def eliminarEvento():
    retorno = ""
    try:
        id = recoge_post('id')
        retorno = eliminaEvento(id)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno="No se pudo eliminar el Evento"
    return retorno


def obtieneEventosP():
    retorno = ""
    try:
        condicion = {}
        consulta = {'_id':1,'Nombre':1, 'Descripcion':1, 'Precio':1, 'Ubicacion':1, 'Fecha':1, 'Hora':1,'Imagen':1}
        retorno = obtenerEventos(condicion, consulta)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno = "Error"
    
    return retorno




def validarDatosRegistroEvento():
    idEvento = recoge_form('idEvento')
    nombreUsu = recoge_form('nombreUsu')
    nombre = recoge_form('nombre')
    pApellido = recoge_form('pApellido')
    sApellido = recoge_form('sApellido')
    correo = recoge_form('correo')
    telefono = recoge_form('telefono')
    nombresPersonas = recoge_form('nombresPersonas')
    nombresMascotas = recoge_form('nombresMascotas')
    accion = recoge_form('accion')

    nombresMascotasOK = True
    nombresPersonasOK = True
    respuesta = ""

    if any(char.isdigit() for char in nombresPersonas):
        respuesta = "Los nombres de personas no pueden contener números."
        nombresPersonasOK = False


    if any(char.isdigit() for char in nombresMascotas):
        respuesta += " Los nombres de mascotas no pueden contener números."
        nombresMascotasOK = False

    if nombresMascotas.strip() == '':
        respuesta += " El campo de nombres de mascotas no puede estar vacío."
        nombresMascotasOK = False



    if nombresMascotasOK and nombresPersonasOK:

        respuesta = insertarRegistroEvento(idEvento, nombreUsu, nombre, pApellido, sApellido, correo, telefono, nombresPersonas, nombresMascotas)
        return respuesta
        
    else:
        return respuesta



def validaRegistros(idEvento, usuario):
    retorno = ""
    try:
        condicion = {"idEvento": idEvento, "NombreUsuario": usuario} 
        datos = {"_id": 1,"idEvento":1, "NombreUsuario":1, "Nombre":1, "PApellido":1, "SApellido":1, "Correo":1, "telefono":1, "nombresPersonas":1, "nombresMascotas":1, "cantidadPersonas":1, "cantidadMascotas":1}  

        registros = validarRegistros(condicion, datos)

        if registros:
            retorno = registros
        else:
            retorno = ""

    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno = "Error"
    
    return retorno

def eliminarRegistro():
    retorno = ""
    try:
        id = recoge_post('id')
        retorno = eliminaRegistro(id)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno="No se pudo eliminar el Evento"
    return retorno

def obtener_cantidad_eventos():
    try:
        condicion = {}
        datos = {'_id': 0}  
        eventos = obtenerEventos(condicion, datos)
        
        CantidadEventos = len(eventos)
        
        return CantidadEventos
        
    except Exception as error:
        print(f"Se produjo un error: {error}")
    return None

