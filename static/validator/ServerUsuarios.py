from flask import request
from ..include.functions.recoge import recoge_post
from DB.empleados import obtenerEmpleados
from DB.usuarios import insertarUsuarioEmpleado, obtenerUsuarios, eliminaUsuario
from ..include.functions.validadores import validarContrasena
from .ServerEmpleados import obtieneEmpleadoUsuario, obtieneEmpleado


def validarDatosUsuario():  #Esta función es para limpiar y validar los datos antes de ingresarlos a la base

    #Se empieza limpiando los datos con el recoge_post
    usuario = recoge_post('usuario')
    contrasena = recoge_post('contrasena')
    confirmContrasena = recoge_post('confirmContrasena')
    idEmpleado = recoge_post('idEmpleado')
    accion = recoge_post('accion')
    

    #Se crea estas variables para despues usarlas para validar que los datos esten bien
    usuarioOK= True
    contrasenaOK= True
    confirmContrasenaOK= True
    idEmpleadoOK= True

    respuesta= ""
    if usuario == "":
        respuesta = "No ha ingresado ningún nombre de usuario. "+ respuesta
        usuarioOK = False
    elif len(usuario) < 5: 
        respuesta = "El nombre de usuario debe de contener almenos 5 caracteres. "+ respuesta
        usuarioOK = False

    if contrasena == "":
        respuesta = "No ha ingresado ninguna contraseña. "+ respuesta
        contrasenaOK = False
    elif len(contrasena) < 8:
        respuesta = "La contraseña debe de contener al menos 8 dígitos. "+ respuesta
        contrasenaOK = False
    elif not validarContrasena(contrasena):
        respuesta = "La contraseña debe de contener al menos 4 dígitos y 4 letras. "+ respuesta
        contrasenaOK = False
    elif confirmContrasena == "":
        respuesta = "Debe confirmar la contraseña. "+ respuesta
        confirmContrasenaOK = False
    elif contrasena != confirmContrasena:
        respuesta = "Las contraseñas no coinciden. "+ respuesta
        confirmContrasenaOK = False
    
    if idEmpleado == "":
        respuesta = "Debe seleccionar el empleado. "+ respuesta
        idEmpleadoOK = False


    
    #Se valida que todas las validaciones hayan sido correctas
    if usuarioOK and contrasenaOK and confirmContrasenaOK and idEmpleadoOK:
        if accion=="Ingreso":
            respuesta = insertarUsuarioEmpleado(usuario, contrasena, idEmpleado)
            return respuesta
        
    else:
        return respuesta


def obtieneEmpleadosUsuarios():
    retorno = ""
    try:
        condicion = {"Puesto":"Administrador"}
        datos = {'_id':0,'Cedula':1,'Nombre':1, 'PrimerApellido':1}
        retorno = obtenerEmpleados(condicion, datos)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno="Error"
    
    return retorno

def obtenerUsuariosAdmin():
    retorno = ""
    try:
        condicion = {'Empleado':{'$exists':True}} #Se trae aquellos documentos que tienen referenciado un Empleado
        datos = {'_id':0}
        retorno = obtenerUsuarios(condicion, datos)

        for e in retorno:
            idEmpleado = e['Empleado']['Cedula'] #Se obtiene el id del empleado para realizar la busqueda
            #Traer los empleados con el id
            empleado = obtieneEmpleadoUsuario(idEmpleado) #Se obtiene la información del empleado
            e['Empleado']= empleado #Se añade a la información de retorno
            del e['Contrasena']
         
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno="Error"
    
    return retorno

def obtenerUsuariosClientes():
    retorno = ""
    try:
        condicion = {'Empleado':{'$exists':False}}
        datos = {'_id':0}
        retorno = obtenerUsuarios(condicion, datos)
        for e in retorno:
            del e['Contrasena']
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno="Error"
    
    return retorno

def obtieneUsuarios():
    retorno = ""
    try:
        condicion = {}
        datos = {'_id':0, 'Contrasena':0}
        retorno = obtenerUsuarios(condicion, datos)
        for e in retorno:
            del e['Contrasena']
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno="Error"
    return retorno


def obtieneUsuario(id):
    retorno = ""
    try:
        condicion = {"Usuario":id}
        datos = {'_id':0, 'Contrasena':0}
        retorno = obtenerUsuarios(condicion, datos)
        if 'Empleado' in retorno[0]:
            idEmpleado = retorno[0]['Empleado']['Cedula'] #Se obtiene el id del empleado para realizar la busqueda
            #Traer los empleados con el id
            empleado = obtieneEmpleado(idEmpleado) #Se obtiene la información del empleado
            retorno[0]['Empleado']= empleado #Se añade a la información de retorno
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno="Error"
    
    return retorno


def eliminarUsuario():
    retorno = ""
    try:
        id = recoge_post('idUsuario')
        retorno = eliminaUsuario(id)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno="No se pudo eliminar el Usuario"
    return retorno



def obtener_cantidad_usuarios():
    try:
        condicion = {'Empleado':{'$exists':False}} 
        datos = {'_id':0}
        
        usuarios = obtenerUsuarios(condicion, datos)
        
        CantidadUsuarios = len(usuarios)
        
        return CantidadUsuarios
        
    except Exception as error:
        print(f"Se produjo un error: {error}")
        return None








    
    
    





