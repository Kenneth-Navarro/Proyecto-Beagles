from ..include.functions.recoge import  recoge_form, recoge_file, recoge_post
from DB.productos import insertarProducto, obtenerProductos, actualizarProducto, eliminaProducto
from flask import request, jsonify
from pymongo import MongoClient


def anadir_producto():
    try:
        # Obtener datos del formulario
        nombre = request.form['Nombre']
        precio = float(request.form['Precio'])

        # Obtener el carrito actual desde la base de datos
        carrito = coleccion_carrito.find_one({})  # Suponiendo que solo hay un carrito en la colección

        if not carrito:
            carrito = {'productos': []}

        # Nuevo producto
        nuevo_producto = {
            'Nombre': nombre,
            'Precio': precio
        }

        # Agregar el nuevo producto al carrito
        carrito['productos'].append(nuevo_producto)

        # Actualizar el carrito en la base de datos
        coleccion_carrito.update_one({}, {'$set': {'productos': carrito['productos']}}, upsert=True)

        return jsonify({"mensaje": "Se agregó correctamente"}), 200

    except Exception as e:
        return jsonify({"error": f"Error al añadir al carrito: {str(e)}"}), 500
