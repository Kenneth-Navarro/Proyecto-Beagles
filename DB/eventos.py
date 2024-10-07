from .Conexion import conexion, desconectar
from bson.objectid import ObjectId
from pymongo.errors import DuplicateKeyError
import os

def insertarEvento(nombre,precio, ubicacion, descripcion, fecha, hora, Imagen):
    respuesta = ""
    try:

        cliente, db = conexion()

        Eventos= db['Eventos']

        ruta = "static/imagenAlmacenamiento/"
        if not os.path.exists(ruta):
            os.makedirs(ruta)
        rutaImagen = os.path.join(ruta, Imagen.filename)

        Imagen.save(rutaImagen)

        nuevo_evento={'Nombre':nombre, 'Precio':precio, 'Ubicacion':ubicacion, 'Descripcion':descripcion, 'Fecha':fecha, 'Hora':hora, 'Imagen': rutaImagen}


        Eventos.insert_one(nuevo_evento)


        respuesta = "OK"
        
    except DuplicateKeyError as e:

        documento = e.details.get("keyValue")

        campo = list(documento.keys())[0]
        respuesta = "La información ingresada en '"+campo+"' ya existe en el sistema"
    except Exception as error:
        print(f"Se produjo un error: {error}")
        respuesta = "Ocurrio un error, por favor comuniquese con el desarrollador"
    finally:

        desconectar(cliente)
    
    return respuesta



def obtenerEventos(condicion, datos):
    retorno = ""
    try:
        cliente, db = conexion()

        evento = db['Eventos']

        resultado = evento.find(condicion, datos)
        retorno = []

        for documento in resultado:

            if '_id' in documento:
                documento['_id'] = str(documento['_id'])
            retorno.append(documento)

    except Exception as error:
        print(f"Se produjo un error: {error}")
        retorno = "Ocurrió un error, por favor comuníquese con el desarrollador"


        print(error)

    finally:
        desconectar(cliente)

    return retorno



def obtenerRegistros(condicion, datos):
    retorno = ""
    try:
        cliente, db= conexion()
        
        Registros = db['Registro_Eventos']

        resultado = Registros.find(condicion, datos)
        retorno =[]
        for documento in resultado:
            retorno.append(documento)


        
    except Exception as error:
        print(f"Se produjo un error: {error}")
        retorno = "Error"
    finally:

        desconectar(cliente)
    
    return retorno




def actualizarEvento(_id,nombre,precio, ubicacion, descripcion, fecha, hora, imagen, imagenVieja):
    respuesta = ""
    try:
   
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


        Eventos= db['Eventos']

        
        actualizar_evento={'Nombre':nombre, 'Precio':precio, 'Ubicacion':ubicacion, 'Descripcion':descripcion, 'Fecha':fecha, 'Hora':hora, 'Imagen':rutaImagen}

        
        Eventos.update_one({'_id': ObjectId(_id)}, {'$set': actualizar_evento})

        respuesta = "OK"
   
    except DuplicateKeyError as e:
        
        documento = e.details.get("keyValue")
        
        campo = list(documento.keys())[0]
        respuesta = "La información ingresada en '"+campo+"' ya existe en el sistema"
    except Exception as error:
        print(f"Se produjo un error: {error}")
        respuesta = "Ocurrio un error, por favor comuniquese con el desarrollador"
    finally:
        
        desconectar(cliente)
    
    return respuesta



def eliminaEvento(id):
    respuesta = ""
    try:
        cliente, db= conexion()
        
        evento = db['Eventos']

        rutaImagen = evento.find_one({"_id":ObjectId(id)}, {"_id":0,"Imagen":1})

        try:
            os.remove(rutaImagen['Imagen'])
        except FileNotFoundError as error:
            print(error)
    
        evento.delete_one({'_id': ObjectId(id)})


        respuesta = "OK"
        
    except Exception as error:
        print(f"Se produjo un error: {error}")
        respuesta = "No se pudo eliminar el Evento"
    finally:

        desconectar(cliente)
    
    return respuesta



def insertarRegistroEvento(idEvento, nombreUsu, nombre, pApellido, sApellido, correo, telefono, nombresPersonas, nombresMascotas):
    respuesta = ""
    try:
     
        cliente, db = conexion()

        RegistroEventos = db['Registro_Eventos']
      
        nuevo_Registro = {
            'idEvento': idEvento,
            'NombreUsuario': nombreUsu,
            'Nombre': nombre,
            'PApellido': pApellido,
            'SApellido': sApellido,
            'Correo': correo,
            'telefono': telefono,
            'nombresPersonas': nombresPersonas,
            'nombresMascotas': nombresMascotas
        }

        RegistroEventos.insert_one(nuevo_Registro)

        respuesta = "OK"
        
    except DuplicateKeyError as e:
        documento = e.details.get("keyValue")
        campo = list(documento.keys())[0]
        respuesta = "La información ingresada en '"+campo+"' ya existe en el sistema"
    except Exception as error:
        print(f"Se produjo un error: {error}")
        respuesta = "Ocurrió un error, por favor comuníquese con el desarrollador"
    finally:
        desconectar(cliente)
    
    return respuesta


def validarRegistros(condicion, datos):
    retorno = ""
    try:
        cliente, db = conexion()
        
        Registros = db['Registro_Eventos']

        resultado = Registros.find(condicion, datos)
        retorno = []
        for documento in resultado:
            if '_id' in documento:
                documento['_id'] = str(documento['_id'])
            retorno.append(documento)

    except Exception as error:
        print(f"Se produjo un error: {error}")
        retorno = "Error"
    finally:
        desconectar(cliente)
    
    return retorno




def eliminaRegistro(id):
    respuesta = ""
    try:
        cliente, db= conexion()
        
        Registro = db['Registro_Eventos']

  

        Registro.delete_one({'_id': ObjectId(id)})

        respuesta = "OK"
        
    except Exception as error:
        print(f"Se produjo un error: {error}")
        respuesta = "No se pudo eliminar el Proveedor"
    finally:

        desconectar(cliente)
    
    return respuesta
