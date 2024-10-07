from .Conexion import conexion, desconectar
from pymongo.errors import DuplicateKeyError
from static.include.functions.validadores import encriptar
from DB.empleados import obtenerEmpleados

def insertarUsuarioEmpleado(usuario, contrasena, idEmpleado):
    respuesta = ""
    try:
        #Recibe los valores de la conexión
        cliente, db = conexion()

        #Aca se accede a la coleccion que queremos ingresar
        usuarios= db['Usuarios']

        contrasena = encriptar(contrasena)
        #Se ponen los datos que se van a ingresar en tipo json, como se realiza en mongo
        nuevo_usuario={'Usuario': usuario, 'Contrasena': contrasena, 'Empleado':{'Cedula':idEmpleado}, "Rol":'Administrador'}

        #Se hace el insert en la coleccion pasandole los datos de la variable
        usuarios.insert_one(nuevo_usuario)

        respuesta = "OK"
    #Excepcion cuando un valor ya existe en el sistema (cuando brinca el index unique en la base de datos)
    except DuplicateKeyError as e:
        #Variable para almacenar el documento que da el error
        documento = e.details.get("keyValue")
        #Variable que almacena especificamente el nombre del campo que esta dando el error
        campo = list(documento.keys())[0]
        respuesta = "La información ingresada en '"+campo+"' ya existe en el sistema"
    except Exception as error:
        print(f"Se produjo un error: {error}")
        respuesta = "Ocurrio un error, por favor comuniquese con el desarrollador"
    finally:
        #Se desconecta pasandole la conexion que se almacena en la variable de cliente
        desconectar(cliente)

    return respuesta

def insertarUsuarioCliente(nombre, pApellido, sApellido, correo, telefono, usuario, contrasena):
    respuesta = ""
    try:
        #Recibe los valores de la conexión
        cliente, db = conexion()

        #Aca se accede a la coleccion que queremos ingresar
        usuarios= db['Usuarios']
        contrasena = encriptar(contrasena)
        #Se ponen los datos que se van a ingresar en tipo json, como se realiza en mongo
        nuevo_usuario={'Nombre':nombre, 'PrimerApellido':pApellido, 'SegundoApellido': sApellido,
                       'Correo':correo, 'Telefono': telefono, 'Usuario':usuario, 'Contrasena':contrasena, 'Rol':"Cliente"}

        #Se hace el insert en la coleccion pasandole los datos de la variable
        usuarios.insert_one(nuevo_usuario)

        respuesta = "OK"
    #Excepcion cuando un valor ya existe en el sistema (cuando brinca el index unique en la base de datos)
    except DuplicateKeyError as e:
        #Variable para almacenar el documento que da el error
        documento = e.details.get("keyValue")
        #Variable que almacena especificamente el nombre del campo que esta dando el error
        campo = list(documento.keys())[0]
        respuesta = "La información ingresada en '"+campo+"' ya existe en el sistema"
    except Exception as error:
        print(f"Se produjo un error: {error}")
        respuesta = "Ocurrio un error, por favor comuniquese con el desarrollador"
    finally:
        #Se desconecta pasandole la conexion que se almacena en la variable de cliente
        desconectar(cliente)

    return respuesta

def actualizarContrasena(Usuario, Contrasena):
    retorno = ""
    try:
        cliente, db= conexion()
        
        usuarios = db['Usuarios']

        Contrasena = encriptar(Contrasena)

        usuarios.update_one({'Usuario':Usuario},{'$set':{'Contrasena': Contrasena}})

        retorno = "Ok"
    except Exception as error:
        print(f'Error{error}')
        retorno = "Error"
    finally:
        desconectar(cliente)
    
    return retorno


def obtenerUsuarios(condicion, datos):
    #Traer el empleado con los datos
    retorno = ""
    try:
        cliente, db= conexion()
        
        usuarios = db['Usuarios']

        resultado = usuarios.find(condicion, datos)
        retorno =[]
        for documento in resultado:
            retorno.append(documento)
        
        
    except Exception as error:
        print(f"Se produjo un error: {error}")
        retorno = "Error"
    finally:
        #Se desconecta pasandole la conexion que se almacena en la variable de cliente
        desconectar(cliente)
    
    return retorno

def eliminaUsuario(id):
    respuesta = ""
    try:
        cliente, db= conexion()
        
        usuario = db['Usuarios']

        usuario.delete_one({'Usuario':id})

        respuesta = "OK"
        
    except Exception as error:
        print(f"Se produjo un error: {error}")
        respuesta = "No se pudo eliminar el Empleado"
    finally:
        #Se desconecta pasandole la conexion que se almacena en la variable de cliente
        desconectar(cliente)
    
    return respuesta


def actualizaUsuarioCliente(Nombre, PrimerApellido, SegundoApellido, Telefono, Correo, Usuario, UsuarioAnterior):
    respuesta = ""
    usuario = ""
    try:
        cliente, db= conexion()
        
        usuarios = db['Usuarios']

        usuarios.update_one({'Usuario':UsuarioAnterior},{'$set':{'Nombre': Nombre, 'PrimerApellido': PrimerApellido, 'SegundoApellido': SegundoApellido, 'Telefono': Telefono, 'Correo': Correo, 'Usuario': Usuario}})

        condicion = {'Usuario':Usuario}
        datos = {'_id':0,'Contrasena':0}
        usuario = obtenerUsuarios(condicion, datos)
        respuesta = "OK"

     #Excepcion cuando un valor ya existe en el sistema (cuando brinca el index unique en la base de datos)
    except DuplicateKeyError as e:
        #Variable para almacenar el documento que da el error
        documento = e.details.get("keyValue")
        #Variable que almacena especificamente el nombre del campo que esta dando el error
        campo = list(documento.keys())[0]
        respuesta = "La información ingresada en '"+campo+"' ya existe en el sistema"
    except Exception as error:
        print(f'Error{error}')
        respuesta = "Error"
    finally:
        desconectar(cliente)
    
    return respuesta, usuario

def actualizaUsuarioAdmin(Usuario, UsuarioAnterior):
    respuesta = ""
    usuario = ""
    try:
        cliente, db= conexion()
        
        usuarios = db['Usuarios']

        usuarios.update_one({'Usuario':UsuarioAnterior},{'$set':{'Usuario': Usuario}})

        condicion = {'Usuario':Usuario}
        datos = {'_id':0,'Contrasena':0}
        usuario = obtenerUsuarios(condicion, datos)
        condicion = {'Cedula': usuario[0]["Empleado"]["Cedula"]}
        empleado = obtenerEmpleados(condicion, datos)
        usuario[0]["Empleado"] = empleado
        respuesta = "OK"

     #Excepcion cuando un valor ya existe en el sistema (cuando brinca el index unique en la base de datos)
    except DuplicateKeyError as e:
        #Variable para almacenar el documento que da el error
        documento = e.details.get("keyValue")
        #Variable que almacena especificamente el nombre del campo que esta dando el error
        campo = list(documento.keys())[0]
        respuesta = "La información ingresada en '"+campo+"' ya existe en el sistema"
    except Exception as error:
        print(f'Error{error}')
        respuesta = "Error"
    finally:
        desconectar(cliente)
    
    return respuesta, usuario



        
