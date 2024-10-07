import pymongo

def conexion():
    MONGO_HOST = "localhost"
    MONGO_PUERTO = "27017"
    MONGO_TIEMPO_FUERA = 1000
    MONGO_BASE = "Beagles"

    MONGO_URL = "mongodb://" + MONGO_HOST + ":" + MONGO_PUERTO + "/"

    try: 
        cliente = pymongo.MongoClient(MONGO_URL, serverSelectionTimeoutMS=MONGO_TIEMPO_FUERA)
        db = cliente[MONGO_BASE]

        return cliente, db
        

    except pymongo.errors.ServerSelectionTimeoutError as error_tiempo:
        return "Tiempo exedido"+str(error_tiempo)

    except pymongo.errors.ConnectionFailure as error:
        return "Fallo de conexión: " + str(error)
    except Exception as error:
        return "Fallo en la conexion " + str(error)

def desconectar(cliente):
    try:
        cliente.close()
        print('Se desconecto correctamente')
    except Exception as error:
        print('Fallo para para desconectar' + error)
        
    
    


