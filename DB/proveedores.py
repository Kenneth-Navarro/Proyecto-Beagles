from .Conexion import conexion, desconectar
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
import os
def insertarProveedor(Nombre, Encargado, Correo, Telefono,Metodo,Direccion):
    respuesta = ""
    try:
        #Recibe los valores de la conexión
        cliente, db = conexion()

        #Aca se accede a la coleccion que queremos ingresar
        proveedor= db['Proveedor']

        #Se ponen los datos que se van a ingresar en tipo json, como se realiza en mongo
        nuevo_proveedor={ 'Nombre':Nombre, 'Encargado':Encargado, 'Correo':Correo,'Telefono':Telefono,'Metodo_Pago':Metodo,'Direccion':Direccion}

        #Se hace el insert en la coleccion pasandole los datos de la variable
        proveedor.insert_one(nuevo_proveedor)

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
        


def actualizarProveedor(_idModal,Nombre,Encargado,Correo, Telefono,Metodo,Direccion):
    respuesta = ""
    try:
        #Recibe los valores de la conexión
        cliente, db = conexion()

    
            

        #Aca se accede a la coleccion que queremos ingresar
        proveedor= db['Proveedor']

        #Se ponen los datos que se van a ingresar en tipo json, como se realiza en mongo
        actualizar_proveedor={'Nombre':Nombre, 'Encargado':Encargado, 'Correo':Correo,'Telefono':Telefono,'Metodo_Pago':Metodo,'Direccion':Direccion}
       
        #Se hace el insert en la coleccion pasandole los datos de la variable
        proveedor.update_one({'_id': ObjectId(_idModal)}, {'$set': actualizar_proveedor})

        respuesta = "OK"
   
    except Exception as error:
        print(f"Se produjo un error: {error}")
        respuesta = "Ocurrio un error, por favor comuniquese con el desarrollador"
    finally:
        #Se desconecta pasandole la conexion que se almacena en la variable de cliente
        desconectar(cliente)
    
    return respuesta


def obtenerProveedores(condicion, datos):
    retorno = ""
    try:
        cliente, db = conexion()

        proveedor = db['Proveedor']

        resultado = proveedor.find(condicion, datos)
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



def eliminaProveedor(id):
    respuesta = ""
    try:
        cliente, db= conexion()
        
        proveedor = db['Proveedor']

  

        proveedor.delete_one({'_id': ObjectId(id)})

        respuesta = "OK"
        
    except Exception as error:
        print(f"Se produjo un error: {error}")
        respuesta = "No se pudo eliminar el Proveedor"
    finally:
        #Se desconecta pasandole la conexion que se almacena en la variable de cliente
        desconectar(cliente)
    
    return respuesta
