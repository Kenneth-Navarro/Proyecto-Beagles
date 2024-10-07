from .Conexion import conexion, desconectar
from pymongo.errors import DuplicateKeyError
import os


def insertarProducto(Codigo, Nombre, Cantidad, Precio, Descripcion, Marca, Imagen, Proveedor):
    respuesta = ""
    try:
        #Recibe los valores de la conexión
        cliente, db = conexion()

        #Aca se accede a la coleccion que queremos ingresar
        producto= db['Productos']

        ruta = "static/imagenAlmacenamiento/"
        if not os.path.exists(ruta):
            os.makedirs(ruta)
        rutaImagen = os.path.join(ruta, Imagen.filename)

        Imagen.save(rutaImagen)

        #Se ponen los datos que se van a ingresar en tipo json, como se realiza en mongo
        nuevo_producto={ 'Codigo':Codigo, 'Nombre':Nombre, 'Cantidad':Cantidad,'Precio':Precio, 'Descripcion':Descripcion, 'Marca':Marca, 'Imagen':rutaImagen, 'Proveedor':Proveedor}

        #Se hace el insert en la coleccion pasandole los datos de la variable
        producto.insert_one(nuevo_producto)


        respuesta = "OK"

    except DuplicateKeyError as e:

        documento = e.details.get("keyValue")

        campo = list(documento.keys())[0]

        respuesta = "La información ingresada en '"+campo+"' ya existe en el sistema"
    except Exception as error:
        print(f"Se produjo un error: {error}")
        respuesta = "Ocurrio un error, por favor comuniquese con el desarrollador"
    finally:
        #Se desconecta pasandole la conexion que se almacena en la variable de cliente
        desconectar(cliente)
    
    return respuesta
        

        
def actualizarProducto(idCodigo,Codigo, Nombre, Cantidad, Precio, Descripcion, Marca,  imagen, imagenVieja, Proveedor):
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
        productos= db['Productos']

        #Se ponen los datos que se van a ingresar en tipo json, como se realiza en mongo
        actualizar_producto={ 'Codigo':Codigo, 'Nombre':Nombre, 'Cantidad':Cantidad,'Precio':Precio, 'Descripcion':Descripcion, 'Marca':Marca, 'Imagen':rutaImagen, 'Proveedor':Proveedor}

        #Se hace el insert en la coleccion pasandole los datos de la variable
        productos.update_one({'Codigo':idCodigo},{'$set':actualizar_producto})


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


def obtenerProductos(condicion, datos):
    retorno = ""
    try:
        cliente, db= conexion()
        
        producto = db['Productos']

        resultado = producto.find(condicion, datos)
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


def eliminaProducto(id):
    respuesta = ""
    try:
        cliente, db= conexion()
        
        producto = db['Productos']

        rutaImagen = producto.find_one({"Codigo":id}, {"_id":0,"Imagen":1})

        try:
            os.remove(rutaImagen['Imagen'])
        except FileNotFoundError as error:
            print(error)

        producto.delete_one({'Codigo':id})

        respuesta = "OK"
        
    except Exception as error:
        print(f"Se produjo un error: {error}")
        respuesta = "No se pudo eliminar el Producto"
    finally:
        #Se desconecta pasandole la conexion que se almacena en la variable de cliente
        desconectar(cliente)
    
    return respuesta

def actualizarCantidad(Codigo, Cantidad,stock):
    respuesta = ""
    try:

        cantidad_entero = int(Cantidad)
        stock_entero = int(stock)

        # Calcular la cantidad disponible
        disponible = stock_entero - cantidad_entero


        #Recibe los valores de la conexión
        cliente, db = conexion()
        

        #Aca se accede a la coleccion que queremos ingresar
        productos= db['Productos']

        #Se ponen los datos que se van a ingresar en tipo json, como se realiza en mongo
        actualizar_producto={  'Cantidad':disponible}

        #Se hace el insert en la coleccion pasandole los datos de la variable
        productos.update_one({'Codigo':Codigo},{'$set':actualizar_producto})


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