from flask import Flask, render_template, jsonify, request
from static.validator.ServerEmpleados import validarDatosEmpleado, obtieneEmpleados, obtieneEmpleado, eliminarEmpleado
from static.validator.proveedoresVal import validarDatosProveedor, obtieneProveedores, obtieneProveedor,eliminarProveedor
from static.validator.ServerUsuarios import  validarDatosUsuario, obtenerUsuariosAdmin, obtieneEmpleadosUsuarios, obtenerUsuariosClientes, obtieneUsuario, eliminarUsuario, obtener_cantidad_usuarios
from static.validator.eventosVal import validarDatosEvento, obtieneEventos, obtieneEvento, eliminarEvento, obtieneEventosP,validarDatosRegistroEvento, obtieneRegistros,validaRegistros,eliminarRegistro, obtener_cantidad_eventos
from static.validator.productosVal import validarDatosProducto, obtieneProductos, obtieneProducto, eliminarProducto, obtieneProductosTienda, UpdateCantidad, obtieneProveedorProducto, obtener_productos_con_cantidad_asc
from static.validator.patrocinadoresVal import validarDatosPatrocinador, obtienePatrocinadores, obtienePatrocinador,eliminarPatrocinador
from static.validator.serverInicioSesion import actualizaCuentaUsuario, actualizaUsuarioCuenta, validarDatosRegistro, inicioSesion, obtieneCorreo, obtenerDatosCorreo, actualizacionContrasena
from static.validator.pedidoVal import validarDatosPedido
from static.validator.comprasVal import obtieneCompras,obtieneCompra



app = Flask(__name__)


#Ruta para manejar error cuando no se encuentre una página
@app.errorhandler(404)
def paginaNoEncontrada(error):
    return render_template("404.html")


@app.route("/index")
def obtenerProductosTiendaIndex():
    respuesta = obtieneProductosTienda()
    if respuesta == "Error":
        return  jsonify({'error': respuesta})
    else:
        return jsonify(respuesta)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/iniciarSesion")
def iniciarSesion():
    return render_template('inicioSesion.html')

@app.route("/iniciarSesion/inicio", methods=['POST'])
def inicioSesionInicio():
    respuesta, usuario = inicioSesion()
    if respuesta == "OK":
        respuesta = usuario
        return jsonify(respuesta)
    else:
        return  jsonify({'error': respuesta})

@app.route("/registro")
def registro():
    return render_template('registro.html')

@app.route("/registro/envio", methods=['POST'])
def registroEnvio():
    respuesta = validarDatosRegistro()
    if respuesta == "OK":
        return jsonify(respuesta)
    else:
        return  jsonify({'error': respuesta})

@app.route("/recuperarContrasena")
def recuperarContrasena():
    return render_template('recuperarContrasena.html')

@app.route("/recuperarContrasena/envioCorreo", methods=['POST'])
def envioCorreo():
    respuesta = obtieneCorreo()
    if respuesta == "OK":
        return jsonify(respuesta)
    else:
        return  jsonify({'error': respuesta})

@app.route("/recuperarContrasena/restaurar", methods=['POST'])
def restaurar():
    respuesta = obtenerDatosCorreo()
    datos = {
        'Usuario': respuesta
    }

    return render_template('restaurarContrasena.html', datos=datos)

@app.route("/recuperarContrasena/restaurar/envio", methods=['POST'])
def restaurarNueva():
    respuesta = actualizacionContrasena()
    if respuesta == "OK":
        return jsonify(respuesta)
    else:
        return  jsonify({'error': respuesta})


@app.route("/admin", methods=['GET'])
def admin():
    datos = {'pagina': "Admin"}

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        productos = obtener_productos_con_cantidad_asc()
        eventos_por_fecha = obtener_cantidad_eventos()
        cantidad_usuarios = obtener_cantidad_usuarios()
        
        if productos is not None and eventos_por_fecha is not None:
            return jsonify(productos=productos, eventos=eventos_por_fecha, usuarios=cantidad_usuarios)
        else:
            return jsonify({'error': "No se pudieron obtener los datos."})

    return render_template('admin.html', datos=datos)


@app.route("/micuenta")
def cuenta():
    return render_template('micuenta.html')


@app.route("/micuenta/actualiza", methods=['POST'])
def cuentaActualiza():
    respuesta, usuario = actualizaUsuarioCuenta()
    if respuesta == "OK":
        return jsonify(usuario)
    else:
        return  jsonify({'error': respuesta})


@app.route("/micuenta/actualizaUsuario", methods=['POST'])
def cuentaActualizaUsuario():
    respuesta, usuario = actualizaCuentaUsuario()
    if respuesta == "OK":
        return jsonify(usuario)
    else:
        return  jsonify({'error': respuesta})










#Administración de empleados
@app.route("/admin/empleados", methods=["GET"])
def empleados():
    datos={
        'pagina': "Empleados",
    }
    return render_template('empleados.html', datos=datos)

#Ingreso de los datos nuevos de los empleados
@app.route("/admin/empleados/ingreso", methods=['POST'])
def ingresoEmpleados():
    respuesta = validarDatosEmpleado()
    if respuesta == "OK":
        return jsonify(respuesta)
    else:
        return  jsonify({'error': respuesta})

#Actualizacion de los datos de empleados
@app.route("/admin/empleados/actualizar", methods=['POST'])
def actualizarEmpleados():
    respuesta = validarDatosEmpleado()
    if respuesta == "OK":
        return jsonify(respuesta)
    else:
        return  jsonify({'error': respuesta})


#Eliminación de los datos de empleados
@app.route("/admin/empleados/eliminar", methods=['POST'])
def eliminarEmpleados():
    respuesta = eliminarEmpleado()
    if respuesta == "OK":
        return jsonify(respuesta)
    else:
        return  jsonify({'error': respuesta})


#Solicitud para obtener todos los empleados
@app.route("/admin/empleados/obtenerEmpleados", methods=["GET"])
def obtenerEmpleados():
    respuesta = obtieneEmpleados()
    if respuesta == "Error":
        return  jsonify({'error': respuesta})
    else:
        return jsonify(respuesta)

#Solicitud para obtener un solo empleado
@app.route("/admin/empleados/obtenerEmpleado", methods=["GET"])
def obtenerEmpleado():
    id = ""+ request.args.get('id') +"" #Sirve para obtener los datos enviados por la URL

    respuesta = obtieneEmpleado(id)
    if respuesta == "Error":
        return  jsonify({'error': respuesta})
    else:
        return jsonify(respuesta)








#Administración de Proveedores
@app.route("/admin/proveedores")
def proveedores():
    datos={
        'pagina': "Proveedores",
    }
    return render_template('proveedor.html', datos=datos)

#Ingreso de los datos nuevos de los Provedores
@app.route("/admin/proveedores/ingreso", methods=['POST'])
def enviarProveedor():
    respuesta = validarDatosProveedor()
    if respuesta == "OK":
        return jsonify(respuesta)
    else:
        return  jsonify({'error': respuesta})

#Solicitud para obtener todos los Proveedores
@app.route("/admin/proveedores/obtenerProveedores")
def obtenerProveedores():
    respuesta = obtieneProveedores()
    if respuesta == "Error":
        return  jsonify({'error': respuesta})
    else:
        return jsonify(respuesta)
    
#Solicitud para obtener un solo empleado
@app.route("/admin/proveedores/obtenerProveedor", methods=["GET"])
def obtenerProveedor():
    id = ""+ request.args.get('id') +"" #Sirve para obtener los datos enviados por la URL

    respuesta = obtieneProveedor(id)
    if respuesta == "Error":
        return  jsonify({'error': respuesta})
    else:
        return jsonify(respuesta)

#Actualizacion de los datos de proveedores
@app.route("/admin/proveedores/actualizar", methods=['POST'])
def actualizarProveedores():
    respuesta = validarDatosProveedor()
    if respuesta == "OK":
        return jsonify(respuesta)
    else:
        return  jsonify({'error': respuesta})

#Eliminación de los datos del proveedor
@app.route("/admin/proveedores/eliminar", methods=['POST'])
def eliminarProveedores():
    respuesta = eliminarProveedor()
    if respuesta == "OK":
        return jsonify(respuesta)
    else:
        return  jsonify({'error': respuesta})









#Administración de patrocinadores
@app.route("/admin/patrocinadores")
def patrocinadores():
    datos={
        'pagina': "Patrocinadores",
    }
    return render_template('patrocinador.html', datos=datos)

#Ingreso de los datos nuevos de los Patrocinadores
@app.route("/admin/patrocinadores/ingreso", methods=['POST'])
def enviarPatrocinador():
    respuesta = validarDatosPatrocinador()
    if respuesta == "OK":
        return jsonify(respuesta)
    else:
        return  jsonify({'error': respuesta})

#Solicitud para obtener todos los Patrocinadores
@app.route("/admin/patrocinadores/obtenerPatrocinadores")
def obtenerPatrocinadores():
    respuesta = obtienePatrocinadores()
    if respuesta == "Error":
        return  jsonify({'error': respuesta})
    else:
        return jsonify(respuesta)

#Solicitud para obtener un solo patrocinador
@app.route("/admin/patrocinadores/obtenerPatrocinador", methods=["GET"])
def obtenerPatrocinador():
    id = ""+ request.args.get('id') +"" #Sirve para obtener los datos enviados por la URL

    respuesta = obtienePatrocinador(id)
    if respuesta == "Error":
        return  jsonify({'error': respuesta})
    else:
        return jsonify(respuesta)


#Actualizacion de los datos de patrocinador
@app.route("/admin/patrocinadores/actualizar", methods=['POST'])
def actualizarPatrocinadores():
    respuesta = validarDatosPatrocinador()
    if respuesta == "OK":
        return jsonify(respuesta)
    else:
        return  jsonify({'error': respuesta})


#Eliminación de los datos del patrocinador
@app.route("/admin/patrocinadores/eliminar", methods=['POST'])
def eliminarPatrocinadores():
    respuesta = eliminarPatrocinador()
    if respuesta == "OK":
        return jsonify(respuesta)
    else:
        return  jsonify({'error':respuesta})


    








    
#Administración de Productos
@app.route("/admin/productos")
def productos():
    datos={
        'pagina': "Productos",
    }
    return render_template('producto.html', datos=datos)

@app.route("/admin/productos/ingreso", methods=['POST'])
def enviarProducto():
    respuesta = validarDatosProducto()
    if respuesta == "OK":
        return jsonify(respuesta)
    else:
        return  jsonify({'error': respuesta})

#Actualizacion de los datos de productos
@app.route("/admin/productos/actualizar", methods=['POST'])
def actualizarProductos():
    respuesta = validarDatosProducto()
    if respuesta == "OK":
        return jsonify(respuesta)
    else:
        return  jsonify({'error': respuesta})


#Eliminación de los datos de productos
@app.route("/admin/productos/eliminar", methods=['POST'])
def eliminarProductos():
    respuesta = eliminarProducto()
    if respuesta == "OK":
        return jsonify(respuesta)
    else:
        return  jsonify({'error': respuesta})


#Solicitud para obtener productos
@app.route("/admin/productos/obtenerProductos")
def obtenerProductos():
    respuesta = obtieneProductos()
    if respuesta == "Error":
        return  jsonify({'error': respuesta})
    else:
        return jsonify(respuesta)

#Solicitud para obtener un solo producto
@app.route("/admin/productos/obtenerProducto")
def obtenerProducto():
    id = request.args.get('id')
    respuesta = obtieneProducto(id)

    if respuesta is None:
        return jsonify({'error': 'Producto no encontrado'})
    else:
        return jsonify(respuesta)


@app.route("/tienda")
def tienda():
    datos={
        'pagina': "Tienda",
    }
    return render_template('tienda.html', datos=datos)


#Solicitud para obtener productos
@app.route("/tienda/obtenerProductos")
def obtenerProductosTienda():
    respuesta = obtieneProductosTienda()
    if respuesta == "Error":
        return  jsonify({'error': respuesta})
    else:
        return jsonify(respuesta)
    

@app.route("/tienda/obtenerProducto", methods=["GET"])
def obtenerProductoTienda():
    id = request.args.get('id')
    respuesta = obtieneProducto(id) 
    return render_template('detalle.html',respuesta=respuesta)

@app.route("/admin/productos/obtenerProveedor", methods=['GET'])
def obtenerProveedorProductos():
    respuesta = obtieneProveedorProducto()
    if respuesta == "Error":
        return  jsonify({'error': respuesta})
    else:
        return jsonify(respuesta)







#Administración de Usuario
@app.route("/admin/usuarios")
def usuarios():
    datos={
        'pagina': "Usuarios",
    }
    return render_template('usuarios.html', datos=datos)

@app.route("/admin/usuarios/obtenerEmpleados", methods=['GET'])
def obtenerEmpleadosUsuarios():
    respuesta = obtieneEmpleadosUsuarios()
    if respuesta == "Error":
        return  jsonify({'error': respuesta})
    else:
        return jsonify(respuesta)
    
@app.route("/admin/usuarios/ingreso", methods=['POST'])
def usuariosIngreso():
    respuesta = validarDatosUsuario()
    if respuesta == "OK":
        return jsonify(respuesta)
    else:
        return  jsonify({'error': respuesta})
    
@app.route("/admin/usuarios/obtenerUsuariosAdmin", methods=['GET'])
def obtenerUsuariosAdministrador():
    respuesta = obtenerUsuariosAdmin()
    if respuesta == "Error":
        return  jsonify({'error': respuesta})
    else:
        return jsonify(respuesta)

@app.route("/admin/usuarios/obtenerUsuariosClientes", methods=['GET'])
def obtenerUsuariosCliente():
    respuesta = obtenerUsuariosClientes()
    if respuesta == "Error":
        return  jsonify({'error': respuesta})
    else:
        return jsonify(respuesta)
    
@app.route("/admin/usuarios/obtenerUsuario", methods=["GET"])
def obtenerUsuario():
    id = ""+ request.args.get('id') +"" #Sirve para obtener los datos enviados por la URL

    respuesta = obtieneUsuario(id)
    if respuesta == "Error":
        return  jsonify({'error': respuesta})
    else:
        return jsonify(respuesta)
    

@app.route("/admin/usuarios/eliminar", methods=['POST'])
def eliminarUsuarios():
    respuesta = eliminarUsuario()
    if respuesta == "OK":
        return jsonify(respuesta)
    else:
        return  jsonify({'error': respuesta})


@app.route("/404")
def error404():
    return render_template("404.html")










#Administracion de eventos
@app.route("/admin/eventos")
def eventos():
    datos={
        'pagina': "Eventos",
    }
    return render_template('eventos.html', datos=datos)


#Insertar Evento
@app.route("/admin/eventos/ingreso", methods=['POST'])
def enviarEvento():
    
    respuesta = validarDatosEvento()
    if respuesta == "OK":
        return jsonify(respuesta)
    else:
        return  jsonify({'error': respuesta})


#Obtener de los datos de los eventos
@app.route("/admin/eventos/obtenerEventos")
def obtenerEventos():
    respuesta = obtieneEventos()
    if respuesta == "Error":
        return  jsonify({'error': respuesta})
    else:
        return jsonify(respuesta)



#Obtener de los datos del evento
@app.route("/admin/eventos/obtenerEvento", methods=["GET"])
def obtenerEvento():
    id = ""+ request.args.get('id') +"" #Sirve para obtener los datos enviados por la URL

    respuesta = obtieneEvento(id)
    if respuesta == "Error":
        return  jsonify({'error': respuesta})
    else:
        return jsonify(respuesta)
    

#Actualizacion de los datos del evento
@app.route("/admin/eventos/actualizar", methods=['POST'])
def actualizarEventos():
    respuesta = validarDatosEvento()
    if respuesta == "OK":
        return jsonify(respuesta)
    else:
        return  jsonify({'error': respuesta})

#Eliminar evento
@app.route("/admin/eventos/eliminar", methods=['POST'])
def eliminarEventos():
    respuesta = eliminarEvento()
    if respuesta == "OK":
        return jsonify(respuesta)
    else:
        return  jsonify({'error':respuesta})
    
#Eventos Pagina principal
@app.route("/eventosP")
def EventosP():
    datos={
        'pagina': "EventosPrincipal",
    }
    return render_template('eventosP.html', datos=datos)
    
#Obtener eventos
@app.route("/eventosP/obtenerEventosP")
def obtenerEventosP():
    respuesta = obtieneEventosP()
    if respuesta == "Error":
        return  jsonify({'error': respuesta})
    else:
        return jsonify(respuesta)

#Registrar eventos
@app.route("/admin/eventos/registro", methods=['POST'])
def enviarEventoP():
    
    respuesta = validarDatosRegistroEvento()
    if respuesta == "OK":
        return jsonify(respuesta)
    else:
        return  jsonify({'error': respuesta})

#Obtener Registros
@app.route("/admin/eventos/obtenerRegistros", methods=["GET"])
def obtenerRegistros():
    id = ""+ request.args.get('id') +"" 

    respuesta = obtieneRegistros(id)
    if respuesta == "Error":
        return  jsonify({'error': respuesta})
    else:
        return jsonify(respuesta)



#Validacion de registros existentes
@app.route("/admin/eventos/validarRegistros", methods=["GET"])
def validarRegistro():
    idEvento = request.args.get('id')
    usuario = request.args.get('usuario')  
    respuesta = validaRegistros(idEvento, usuario) 
    if respuesta == "Error":
        return jsonify({'error': respuesta})
    else:
        return jsonify(respuesta)

#Eliminar registros
@app.route("/admin/eventos/eliminarRegistro", methods=['POST'])
def eliminarRegistroEventos():
    respuesta = eliminarRegistro()
    if respuesta == "OK":
        return jsonify(respuesta)
    else:
        return  jsonify({'error':respuesta})







#Carrito de Compras
@app.route("/carrito")
def carrito():
    # Si es una solicitud GET, simplemente renderizar la plantilla y pasar los datos del carrito
    return render_template('carrito.html')
    

#Ingreso de los datos nuevos del Pedido
@app.route("/carrito/ingreso", methods=['POST'])
def enviarPedido():
    respuesta = validarDatosPedido()
    if respuesta == "OK":
        return jsonify(respuesta)
    else:
        return  jsonify({'error': respuesta})


# Ruta para agregar productos al carrito desde JavaScript
@app.route("/tienda/anadirProducto", methods=['POST'])
def anadir_producto():
    id_producto = request.form.get('id')
    cantidad = int(request.form.get('cantidad'))  # Convertir a entero
    cantidad_stock = int(request.form.get('cantidadStock'))  # Convertir a entero
    cantidad_Antes = request.form.get('cantidadAntes')
    respuesta = UpdateCantidad(id_producto, cantidad, cantidad_stock, cantidad_Antes)
    if "No puede ingresar dicha cantidad" in respuesta:
     return jsonify({'type': 'warning', 'message': respuesta}), 200
    else:
     return jsonify({'type': 'success', 'message': respuesta}), 200


#Administración de compras
@app.route("/admin/compras")
def compras():
    datos={
        'pagina': "Compras",
    }
    return render_template('compras.html', datos=datos)

#Solicitud para obtener todos las compras
@app.route("/admin/compras/obtenerCompras")
def obtenerCompras():
    respuesta = obtieneCompras()
    if respuesta == "Error":
        return  jsonify({'error': respuesta})
    else:
        return jsonify(respuesta)

#Solicitud para obtener una sola compra
@app.route("/admin/compras/obtenerCompra", methods=["GET"])
def obtenerCompra():
    id = ""+ request.args.get('id') +"" #Sirve para obtener los datos enviados por la URL

    respuesta = obtieneCompra(id)
    if respuesta == "Error":
        return  jsonify({'error': respuesta})
    else:
        return jsonify(respuesta)