import re #Se importa para la funcion de validar el correo y la contraseña
import bcrypt #Se importa para encriptar contraseñas, antes debe instalarse en el entorno virtual

#Función para validar que un string no tenga números
def tieneNumeros(texto):
    return any(caracter.isdigit() for caracter in texto)

#Función para validar que un correo sea válido
def validarCorreo(correo):
    # Patrón de expresión regular para validar un correo electrónico
    patron = r'^[\w\.-]+@[\w\.-]+\.(com)$'
    
    # Utilizar re.match() para verificar si el correo coincide con el patrón
    if re.match(patron, correo):
        return True
    else:
        return False
    
def validarContrasena(contrasena):
    # Expresión regular que busca al menos 4 letras o caracteres especiales y al menos 4 números
    patron = r'^(?=(?:.*[A-Za-z@#$%^&+=!]){4})(?=(?:.*\d){4})[A-Za-z\d@#$%^&+=!]+$'
    
    # Busca si la contraseña cumple con el patrón
    if re.match(patron, contrasena):
        return True
    else:
        return False

#Función para encriptar contraseñas
def encriptar(contrasena):
    # Generamos un salt aleatorio
    salt = bcrypt.gensalt()
    # Encriptamos la contraseña con el salt
    hashed_contrasena = bcrypt.hashpw(contrasena.encode('utf-8'), salt)
    return hashed_contrasena

# Función para comparar contraseñas
def comparar(contrasenaGuardada, contrasenaIngresada):
    # Verificar si la contraseña ingresada coincide con la contraseña encriptada
    return bcrypt.checkpw(contrasenaIngresada.encode('utf-8'), contrasenaGuardada)