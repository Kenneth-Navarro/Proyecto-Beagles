from flask import request
from ..include.functions.recoge import recoge_post
from ..include.functions.validadores import validarContrasena, validarCorreo, tieneNumeros, comparar
from DB.usuarios import insertarUsuarioCliente, obtenerUsuarios, actualizarContrasena, actualizaUsuarioCliente, actualizaUsuarioAdmin
from DB.empleados import obtenerEmpleados
import resend


def validarDatosRegistro():  #Esta función es para limpiar y validar los datos antes de ingresarlos a la base

    #Se empieza limpiando los datos con el recoge_post
    nombre = recoge_post('nombre')
    pApellido = recoge_post('pApellido')
    sApellido = recoge_post('sApellido')
    correo = recoge_post('correo')
    telefono = recoge_post('telefono')
    usuario = recoge_post('usuario')
    contrasena = recoge_post('contrasena')
    confirmContrasena = recoge_post('confirmContrasena')
    

    #Se crea estas variables para despues usarlas para validar que los datos esten bien
    nombreOK= True
    pApellidoOK = True
    sApellidoOK=True
    correoOK = True
    telefonoOK = True
    usuarioOK= True
    contrasenaOK= True
    confirmContrasenaOK= True
   

    respuesta= ""

    if nombre == "":
        respuesta = "No ha ingresado ningún nombre. "+ respuesta
        nombreOK=False
    elif tieneNumeros(nombre):
        respuesta = "El nombre contiene números. "+ respuesta
        nombreOK=False
    
    if pApellido == "":
        respuesta = "No ha ingresado ningún primer apellido. "+ respuesta
        pApellidoOK=False
    elif tieneNumeros(pApellido):
        respuesta = "El primer apellido contiene números. "+ respuesta
        pApellidoOK=False

    if sApellido == "":
        respuesta = "No ha ingresado ningún segundo apellido. "+ respuesta
        sApellidoOK=False
    elif tieneNumeros(sApellido):
        respuesta = "El segundo apellido contiene números. "+ respuesta
        sApellidoOK=False
    
    if correo == "":
        respuesta = "No ha ingresado ningún correo. "+ respuesta
        correoOK=False
    elif not validarCorreo(correo):
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


    
    #Se valida que todas las validaciones hayan sido correctas
    if nombreOK and pApellidoOK and sApellidoOK and correoOK and telefonoOK and usuarioOK and contrasenaOK and confirmContrasenaOK:
        existe = validarCorreoEmpleado(correo)
        if existe:
            respuesta = "La información ingresada en 'Correo' ya existe en el sistema"
        else:
            respuesta = insertarUsuarioCliente(nombre, pApellido, sApellido, correo, telefono, usuario, contrasena)
        return respuesta
    else:
        return respuesta

def obtieneCorreo():
    retorno = ""
    correo = recoge_post('Correo')

    if correo != "":
        try:
            #Se trata de consultar primero el correo en la coleccion de clientes
            condicion = {"Correo":correo}
            datos = {'_id':0,'Usuario':1,'Correo':1}
            retorno = obtenerUsuarios(condicion, datos)
            if len(retorno) == 0:  #Si el retorno esta vacio se trata de buscar el correo en empleados
                condicion = {"Correo":correo}
                datos = {'_id':0, 'Cedula':1}
                retorno = obtenerEmpleados(condicion, datos)
                if len(retorno) == 0:
                    retorno = f"El correo '{correo}' no esta asociado a ningún usuario"
                else:
                    condicion1 ={'Cedula': retorno[0]['Cedula']}
                    condicion = {"Empleado":condicion1}
                    datos = {'_id':0,'Usuario':1}
                    retornoU = obtenerUsuarios(condicion, datos)
                    if len(retornoU) == 0:
                        retorno = f"El correo '{correo}' no esta asociado a ningún usuario"
                    else:
                        retorno[0]['Usuario'] = retornoU[0]['Usuario']
                        print(retorno[0]['Usuario'])
                        retorno = recuperarContrasena(retorno[0]['Usuario'])
            else:
                retorno = recuperarContrasena(retorno[0]['Usuario'])


            
        except Exception as error:
            print(f"Ha ocurrido un error: {error}")
            retorno="Error"
    else:
        retorno = "Debe ingresar un correo."
    
    
    return retorno




def inicioSesion():
    Usuario = recoge_post('Usuario')
    Contrasena = recoge_post('Contrasena')

    ingresoOk = True

    respuesta =""
    usuario = ""
    if Usuario == "" or Contrasena == "":
        respuesta = "Debe ingresar el nombre de usuario y la contraseña."
        ingresoOk = False
    try:
        if ingresoOk:
            condicion = {'Usuario':Usuario}
            datos = {'_id':0,'Contrasena':1}
            usuario = obtenerUsuarios(condicion, datos)

            if usuario != []:
                if comparar(usuario[0]['Contrasena'], Contrasena):
                    datos = {'_id':0}
                    usuario = obtenerUsuarios(condicion, datos)
                    if 'Empleado' in usuario[0]:
                        condicion = {'Cedula':usuario[0]['Empleado']['Cedula']}
                        empleado = obtenerEmpleados(condicion, datos)
                        usuario[0]['Empleado'] = empleado
                    del usuario[0]['Contrasena'] 
                    respuesta = "OK"
                else:
                    respuesta = "El nombre de Usuario o la Contraseña no son correctos."
                        
            else:
                respuesta = "El nombre de Usuario o la Contraseña no son correctos."
    except Exception as error:
        print(f"Error: {error}")
        respuesta = "Ha ocurrido un error"
                        
                    
    
    return respuesta, usuario

        
        


def recuperarContrasena(usuario):
    retorno = ""
    try:
        resend.api_key = "re_5Ue2grgg_54o1QRGUrpipHwfrAVpyWB7E"

        r = resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": "albertico2908ratica@gmail.com",    
            "subject": "Restaurar Contraseña",
            "html": "<h1 style='color:#0D0A00;'>Club de Beagles CR</h1>"+
            "<br>"+
            "<h2 style='color:#0D0A00;'>Restaurar Contraseña</h2>"+
            "<br>"+
            "<p style='color:#0D0A00;'>Para restaurar la contraseña de click en el siguiente boton"+
            "<br>"+
            "<form method='POST' action='http://127.0.0.1:5000/recuperarContrasena/restaurar'>"+
            "<input type='hidden' name='usuario' value='" + usuario + "'>" +
            "<button style='color: white; background-color: #845846; height: 30px; width:150px; border: none;' type='submit'>Restaurar Contraseña</button>" +
            "</form>" +
            "</div>"
        })

        retorno = "OK"
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        retorno="Error"
    
    return retorno

#Esta funcion es para validar que no exista ya el correo en la base de datos, especificamente el correo del empleado
def validarCorreoEmpleado(correo):
    retorno = False
    try:
        condicion = {"Correo":correo}
        datos = {'_id':0, 'Correo':1}
        retorno = obtenerEmpleados(condicion, datos)
        if len(retorno) != 0:
            retorno = True
        
    except Exception as error:
        print(f"Ha ocurrido un error: {error}")
        
    return retorno


def obtenerDatosCorreo():
    retorno = ""
    try:
        usuario = request.form['usuario']
        retorno = usuario
    except Exception as error:
        print(f"Error{error}")
        retorno = "No se ha podido cargar la información"
    
    return retorno

def actualizacionContrasena():
    Usuario = recoge_post('Usuario')
    contrasena = recoge_post('Contrasena')
    confirmContrasena = recoge_post('ConfirmContrasena')

    contrasenaOK= True
    confirmContrasenaOK= True
    
    respuesta = ""
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
    
    if contrasenaOK and confirmContrasenaOK:
        respuesta = actualizarContrasena(Usuario, contrasena)
    else:
        return respuesta


    

def actualizaUsuarioCuenta():
    Nombre = recoge_post('Nombre')
    PrimerApellido = recoge_post('PrimerApellido')
    SegundoApellido = recoge_post('SegundoApellido')
    Telefono = recoge_post('Telefono')
    Correo = recoge_post('Correo')
    Usuario = recoge_post('Usuario')
    UsuarioAnterior = recoge_post('UsuarioAnterior')

    NombreOK= True
    PrimerApellidoOK = True
    SegundoApellidoOK = True
    TelefonoOK = True
    CorreoOK = True
    UsuarioOK= True

    respuesta = ""
    usuario = ""
    if Nombre == "":
        respuesta = "No ha ingresado ningún nombre. "+ respuesta
        NombreOK = False
    elif tieneNumeros(Nombre):
        respuesta = "El nombre contiene números. "+ respuesta
        NombreOK = False
    
    if PrimerApellido == "":
        respuesta = "No ha ingresado ningún primer apellido. "+ respuesta
        PrimerApellidoOK= False
    elif tieneNumeros(PrimerApellido):
        respuesta = "El primer apellido contiene números. "+ respuesta
        PrimerApellidoOK= False
    
    if SegundoApellido == "":
        respuesta = "No ha ingresado ningún segundo apellido. "+ respuesta
        SegundoApellidoOK= False
    elif tieneNumeros(SegundoApellido):
        respuesta = "El segundo apellido contiene números. "+ respuesta
        SegundoApellidoOK= False
    
    if Correo == "":
        respuesta = "No ha ingresado ningún correo. "+ respuesta
        CorreoOK= False
    elif validarCorreo(Correo) is not True:
         respuesta = "El correo ingresado no es válido. "+ respuesta
         CorreoOK= False
    
    if Telefono == "":
        respuesta = "No ha ingresado ningún número de telefono. "+ respuesta
        TelefonoOK = False
    elif not Telefono.isdigit():
        respuesta = "El telefono solo debe contener números. "+ respuesta
        TelefonoOK = False
    elif len(Telefono) != 8:
        respuesta = "El telefono debe ser de 8 dígitos. "+ respuesta
        TelefonoOK = False
    
    if Usuario == "":
        respuesta = "No ha ingresado ningún nombre de usuario. "+ respuesta
        UsuarioOK = False
    elif len(Usuario) < 5: 
        respuesta = "El nombre de usuario debe de contener almenos 5 caracteres. "+ respuesta
        UsuarioOK = False

    if NombreOK and PrimerApellidoOK and SegundoApellidoOK and TelefonoOK and CorreoOK and UsuarioOK:
        respuesta, usuario = actualizaUsuarioCliente(Nombre, PrimerApellido, SegundoApellido, Telefono, Correo, Usuario, UsuarioAnterior)
        return respuesta, usuario
    else:
        return respuesta, usuario
    

def actualizaCuentaUsuario():
    Usuario = recoge_post('Usuario')
    UsuarioAnterior = recoge_post('UsuarioAnterior')

    UsuarioOK= True

    if Usuario == "":
        respuesta = "No ha ingresado ningún nombre de usuario. "+ respuesta
        UsuarioOK = False
    elif len(Usuario) < 5: 
        respuesta = "El nombre de usuario debe de contener almenos 5 caracteres. "+ respuesta
        UsuarioOK = False

    if UsuarioOK:
        respuesta, usuario = actualizaUsuarioAdmin(Usuario, UsuarioAnterior)
        return respuesta, usuario
    else:
        return respuesta, usuario




        









    
    
    





