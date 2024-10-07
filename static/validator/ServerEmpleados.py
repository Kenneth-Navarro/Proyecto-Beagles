from flask import request
from ..include.functions.recoge import recoge_post, recoge_form, recoge_file
from DB.empleados import insertarEmpleado, obtenerEmpleados, actualizarEmpleado, eliminaEmpleado
from ..include.functions.validadores import tieneNumeros, validarCorreo


def validarDatosEmpleado():  #Esta función es para limpiar y validar los datos antes de ingresarlos a la base

    #Se empieza limpiando los datos con el recoge_form ya que lo que se recibe es un form
    cedula = recoge_form('cedula')
    nombre = recoge_form('nombre')
    primerApellido = recoge_form('primerApellido')
    segundoApellido = recoge_form('segundoApellido')
    correo = recoge_form('correo')
    telefono = recoge_form('telefono')
    direccion = recoge_form('direccion')
    puesto = recoge_form('puesto')
    salario = recoge_form('salario')
    accion= recoge_form('accion')
    #Se usa el recoge_file para obtener la imagen
    imagen = recoge_file('Imagen')

    

    #Se crea estas variables para despues usarlas para validar que los datos esten bien
    cedulaOK= True
    nombreOK= True
    primerApellidoOK= True
    segundoApellidoOK= True
    correoOK= True
    telefonoOK= True
    puestoOK= True
    salarioOK= True
    direccionOK = True
    imagenOK= True

    respuesta= ""
    if cedula == "":
        respuesta = "No ha ingresado ningún número de cédula. "+ respuesta
        cedulaOK = False
    elif not cedula.isdigit():
        respuesta = "La cédula solo debe contener números. "+ respuesta
        cedulaOK = False
    elif len(cedula) != 9: 
        respuesta = "La cédula debe ser de 9 dígitos. "+ respuesta
        cedulaOK = False

    if nombre == "":
        respuesta = "No ha ingresado ningún nombre. "+ respuesta
        nombreOK = False
    elif tieneNumeros(nombre):
        respuesta = "El nombre contiene números. "+ respuesta
        nombreOK = False
    
    if primerApellido == "":
        respuesta = "No ha ingresado ningún primer apellido. "+ respuesta
        primerApellidoOK= False
    elif tieneNumeros(primerApellido):
        respuesta = "El primer apellido contiene números. "+ respuesta
        primerApellidoOK= False
    
    if segundoApellido == "":
        respuesta = "No ha ingresado ningún segundo apellido. "+ respuesta
        segundoApellidoOK= False
    elif tieneNumeros(segundoApellido):
        respuesta = "El segundo apellido contiene números. "+ respuesta
        segundoApellidoOK= False
    
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
    
    if puesto == "":
        respuesta = "No ha ingresado ningún puesto. "+ respuesta
        puestoOK= False
    elif tieneNumeros(puesto):
        respuesta = "El puesto contiene números. "+ respuesta
        puestoOK= False

    if salario == "":
        respuesta = "No ha ingresado ningún salario. "+ respuesta
        salarioOK = False
    elif not salario.isdigit():
        respuesta = "El salario solo debe contener números. "+ respuesta
        salarioOK = False
    
    if direccion == "":
        respuesta = "No ha ingresado ninguna dirección. "+ respuesta
        direccionOK= False
    
    if imagen == None and accion != "Actualizar":
        respuesta = "No ha ingresado ninguna imagen. "+ respuesta
        imagenOK = False
    
    
    #Se valida que todas las validaciones hayan sido correctas
    if nombreOK and cedulaOK and primerApellidoOK and segundoApellidoOK and telefonoOK and correoOK and salarioOK and puestoOK and direccionOK and imagenOK:
        if accion=="Ingreso":
            respuesta = insertarEmpleado(cedula, nombre, primerApellido, segundoApellido, correo, telefono, puesto, salario, direccion, imagen)
            return respuesta
        else:
            idCedula = recoge_form('idCedula')
            imagenVieja = recoge_form('imagenVieja')
            respuesta = actualizarEmpleado(idCedula,cedula, nombre, primerApellido, segundoApellido, correo, telefono, puesto, salario, direccion, imagen, imagenVieja)
            return respuesta
    else:
        return respuesta


def obtieneEmpleados():
    retorno = ""
    try:
        condicion = {}
        datos = {'_id':0,'Cedula':1,'Nombre':1, 'PrimerApellido':1, 'SegundoApellido':1}
        retorno = obtenerEmpleados(condicion, datos)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno="Error"
    
    return retorno

def obtieneEmpleado(id):
    retorno = ""
    try:
        condicion = {"Cedula":id}
        datos = {"_id":0}
        retorno = obtenerEmpleados(condicion, datos)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno="Error"
    
    return retorno

def obtieneEmpleadoUsuario(id):
    retorno = ""
    try:
        condicion = {"Cedula":id}
        datos = {"_id":0, 'Nombre':1, 'PrimerApellido':1, 'SegundoApellido':1}
        retorno = obtenerEmpleados(condicion, datos)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno="Error"
    
    return retorno

def eliminarEmpleado():
    retorno = ""
    try:
        id = recoge_post('idCedula')
        retorno = eliminaEmpleado(id)
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno="No se pudo eliminar el Empleado"
    return retorno





    
    
    





