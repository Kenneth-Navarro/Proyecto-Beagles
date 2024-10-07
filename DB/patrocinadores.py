from .Conexion import conexion, desconectar
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
import os
def insertarPatrocinador(NombrePatrocinador, NombreEncargado, Correo, Telefono, Descripcion):
    respuesta = ""
    try:
        #Recibe los valores de la conexión
        cliente, db = conexion()

        #Aca se accede a la coleccion que queremos ingresar
        patrocinadores= db['Patrocinadores']

        #Se ponen los datos que se van a ingresar en tipo json, como se realiza en mongo
        nuevo_patrocinador={ 'NombrePatrocinador':NombrePatrocinador, 'NombreEncargado':NombreEncargado, 'Correo':Correo,'Telefono':Telefono, 'Descripcion':Descripcion}

        #Se hace el insert en la coleccion pasandole los datos de la variable
        patrocinadores.insert_one(nuevo_patrocinador)

        #Se desconecta pasandole la conexion que se almacena en la variable de cliente
        desconectar(cliente)

        respuesta = "OK"
        
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
        


def actualizarPatrocinador(_idModal,NombrePatrocinador,NombreEncargado,Correo, Telefono, Descripcion):
    respuesta = ""
    try:
        #Recibe los valores de la conexión
        cliente, db = conexion()
        #Aca se accede a la coleccion que queremos ingresar
        patrocinador= db['Patrocinadores']

        #Se ponen los datos que se van a ingresar en tipo json, como se realiza en mongo
        actualizar_patrocinador={'NombrePatrocinador':NombrePatrocinador, 'NombreEncargado':NombreEncargado,'Correo':Correo,'Telefono':Telefono, 'Descripcion':Descripcion}
       
        #Se hace el insert en la coleccion pasandole los datos de la variable
        patrocinador.update_one({'_id': ObjectId(_idModal)}, {'$set': actualizar_patrocinador})

        respuesta = "OK"
   
    except Exception as error:
        print(f"Se produjo un error: {error}")
        respuesta = "Ocurrio un error, por favor comuniquese con el desarrollador"
    finally:
        #Se desconecta pasandole la conexion que se almacena en la variable de cliente
        desconectar(cliente)
    
    return respuesta


def obtenerPatrocinadores(condicion, datos):
    retorno = ""
    try:
        cliente, db = conexion()

        patrocinadores = db['Patrocinadores']

        resultado = patrocinadores.find(condicion, datos)
        retorno = []

        for documento in resultado:
            # Verificar si '_id' está presente en el documento antes de convertir
            if '_id' in documento:
                documento['_id'] = str(documento['_id'])
            retorno.append(documento)

    except Exception as error:
        print(f"Se produjo un error: {error}")
        retorno = "Ocurrió un error, por favor comuníquese con el desarrollador"

        # Agregar esta línea para imprimir la excepción
        print(error)

    finally:
        desconectar(cliente)

    return retorno


def eliminaPatrocinador(id):
    respuesta = ""
    try:
        cliente, db= conexion()
        
        proveedor = db['Patrocinadores']

  

        proveedor.delete_one({'_id': ObjectId(id)})

        respuesta = "OK"
        
    except Exception as error:
        print(f"Se produjo un error: {error}")
        respuesta = "No se pudo eliminar el Patrocinador"
    finally:
        #Se desconecta pasandole la conexion que se almacena en la variable de cliente
        desconectar(cliente)
    
    return respuesta
