from .Conexion import conexion, desconectar
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
import os

def obtenerCompras(condicion, datos):
    retorno = ""
    try:
        cliente, db = conexion()

        compras = db['Compras']

        resultado = compras.find(condicion, datos)
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


