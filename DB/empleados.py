from .Conexion import conexion, desconectar
from pymongo.errors import DuplicateKeyError
import os

def insertarEmpleado(Cedula, Nombre, pApellido, sApellido, Correo, Telefono, Puesto, Salario, Direccion, Imagen):
    respuesta = ""
    try:
        #Recibe los valores de la conexión
        cliente, db = conexion()

        #Aca se accede a la coleccion que queremos ingresar
        empleados= db['Empleados']

        ruta = "static/imagenAlmacenamiento/"
        if not os.path.exists(ruta):
            os.makedirs(ruta)
        rutaImagen = os.path.join(ruta, Imagen.filename)

        Imagen.save(rutaImagen)
        

        #Se ponen los datos que se van a ingresar en tipo json, como se realiza en mongo
        nuevo_empleado={'Cedula': Cedula, 'Nombre':Nombre, 'PrimerApellido':pApellido, 'SegundoApellido':sApellido, 'Correo':Correo,
        'Telefono':Telefono, 'Puesto':Puesto, 'Salario':Salario, 'Direccion':Direccion, 'Imagen': rutaImagen}

        #Se hace el insert en la coleccion pasandole los datos de la variable
        empleados.insert_one(nuevo_empleado)

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

def actualizarEmpleado(idCedula, Cedula, Nombre, pApellido, sApellido, Correo, Telefono, Puesto, Salario, Direccion, imagen, imagenVieja):
    respuesta = ""
    try:
        #Recibe los valores de la conexión
        cliente, db = conexion()
        ruta = "static/imagenAlmacenamiento/"
        
        if imagen == None:
            rutaImagen = imagenVieja
        else:
            rutaImagen = os.path.join(ruta, imagen.filename)

            if rutaImagen != imagenVieja:
                try:
                    os.remove(imagenVieja)
                except FileNotFoundError as error:
                    print(error)
                imagen.save(rutaImagen)
            else:
                rutaImagen = imagenVieja
        
            

        #Aca se accede a la coleccion que queremos ingresar
        empleados= db['Empleados']

        #Se ponen los datos que se van a ingresar en tipo json, como se realiza en mongo
        actualizar_empleado={'Cedula': Cedula, 'Nombre':Nombre, 'PrimerApellido':pApellido, 'SegundoApellido':sApellido, 'Correo':Correo,
        'Telefono':Telefono, 'Puesto':Puesto, 'Salario':Salario, 'Direccion':Direccion, 'Imagen':rutaImagen}

        #Se hace el insert en la coleccion pasandole los datos de la variable
        empleados.update_one({'Cedula':idCedula},{'$set':actualizar_empleado})


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

def obtenerEmpleados(condicion, datos):
    retorno = ""
    try:
        cliente, db= conexion()
        
        empleado = db['Empleados']

        resultado = empleado.find(condicion, datos)
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


def eliminaEmpleado(id):
    respuesta = ""
    try:
        cliente, db= conexion()
        
        empleado = db['Empleados']

        rutaImagen = empleado.find_one({"Cedula":id}, {"_id":0,"Imagen":1})

        try:
            os.remove(rutaImagen['Imagen'])
        except FileNotFoundError as error:
            print(error)

        empleado.delete_one({'Cedula':id})
        
        usuario = db['Usuarios']
        usuario.delete_one({'Empleado':{'Cedula':id}})
        
        respuesta = "OK"
        
    except Exception as error:
        print(f"Se produjo un error: {error}")
        respuesta = "No se pudo eliminar el Empleado"
    finally:
        #Se desconecta pasandole la conexion que se almacena en la variable de cliente
        desconectar(cliente)
    
    return respuesta



        
