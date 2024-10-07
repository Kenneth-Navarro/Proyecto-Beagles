from flask import request
from ..include.functions.recoge import recoge_post
import re #Se importa para la funcion de validar el correo
from DB.compras import insertarCompra
from ..include.functions.validadores import tieneNumeros, validarCorreo

def validarDatosPedido():  #Esta función es para limpiar y validar los datos antes de ingresarlos a la base

    #Se empieza limpiando los datos con el recoge_post
    p_nombre = recoge_post('p_nombre')
    p_cantidad=recoge_post('p_cantidad')
    p_precio = recoge_post('p_precio')
    nombre = recoge_post('nombre')
    apellidos = recoge_post('apellidos')
    correo = recoge_post('correo')
    telefono = recoge_post('telefono')
    pais = recoge_post('Pais')
    provincia = recoge_post('provincia')
    distrito = recoge_post('distrito')
    codigo_postal = recoge_post('codigo_postal')
    direccion = recoge_post('direccion')
    metodo = recoge_post('metodo_pago')
    total = recoge_post('total')
    subtotal = recoge_post('subtotal')
    accion = recoge_post('accion')

    #Se crea estas variables para despues usarlas para validar que los datos esten bien
    p_nombreOK= True
    p_cantidadOK= True
    p_precioOK= True
    nombreOK= True
    apellidosOK= True
    correoOK= True
    telefonoOK= True
    paisOK= True
    provinciaOK= True
    distritoOK= True
    codigo_postalOK= True
    direccionOK= True
    metodoOK= True
    totalOK= True
    subtotalOK=True
    respuesta= ""

    if p_nombre == "":
        respuesta = "No ha ingresado ningún producto. "+ respuesta
        p_nombreOK = False
    
    if p_cantidad == "":
        respuesta = "No ha ingresado la cantidad. "+ respuesta
        p_cantidadOK= False

    if p_precio == "":
        respuesta = "Error en el producto. "+ respuesta
        p_precioOK= False

    if nombre == "":
        respuesta = "No ha ingresado ningún nombre. "+ respuesta
        nombreOK= False
    elif  tieneNumeros(nombre):
        respuesta = "El nombre contiene números. "+ respuesta
        nombreOK = False

    if apellidos == "":
        respuesta = "No ha ingresado ningún apellido. "+ respuesta
        apellidosOK= False
    elif  tieneNumeros(apellidos):
        respuesta = "Los apellidos contienen números. "+ respuesta
        apellidosOK = False

    if correo == "":
        respuesta = "No ha ingresado ningún correo. "+ respuesta
        correoOK= False
    elif validarCorreo(correo) is not True:
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

    if pais == "":
        respuesta = "No ha ingresado ningún país. "+ respuesta
        paisOK= False
    elif  tieneNumeros(pais):
        respuesta = "El país contienen números. "+ respuesta
        paisOK = False
   
    if provincia == "":
        respuesta = "No ha ingresado ninguna provincia. "+ respuesta
        provinciaOK= False
    elif  tieneNumeros(provincia):
        respuesta = "La provincia contiene números. "+ respuesta
        provinciaOK = False

    if distrito == "":
        respuesta = "No ha ingresado ningún. "+ respuesta
        distritoOK= False
    elif  tieneNumeros(distrito):
        respuesta = "El distrito contiene números. "+ respuesta
        distritoOK = False

    if codigo_postal == "":
        respuesta = "No ha ingresado ningún Código postal. "+ respuesta
        codigo_postalOK = False
    elif not codigo_postal.isdigit():
        respuesta = "El código postal solo debe contener números. "+ respuesta
        codigo_postalOK = False
    elif len(codigo_postal) != 5:
        respuesta = "El código postal debe ser de 5 dígitos. "+ respuesta
        codigo_postalOK = False


    if direccion == "":
        respuesta = "No ha ingresado ninguna dirección. "+ respuesta
        direccionOK = False

    if total == "":
        respuesta = "Error en el producto. "+ respuesta
        totalOK= False

    if subtotal == "":
        respuesta = "Error en el producto. "+ respuesta
        subtotalOK= False

    if metodo == "":
        respuesta = "No ha ingresado ningún metodo de pago. "+ respuesta
        metodoOK = False

    
    #Se valida que todas las validaciones hayan sido correctas
    if p_nombreOK and  p_cantidadOK and p_precioOK and nombreOK and apellidosOK and correoOK and telefonoOK and paisOK and provinciaOK and distritoOK and codigo_postalOK and direccionOK and metodoOK and totalOK and subtotalOK:
        if accion == "Ingreso":
            respuesta = insertarCompra(p_nombre, p_cantidad, p_precio, nombre,apellidos,correo,telefono,pais,provincia,distrito,codigo_postal,direccion,metodo,total,subtotal)
            return respuesta
    else:
        return respuesta

