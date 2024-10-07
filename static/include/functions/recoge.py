from flask import request


def recoge_post(var, m=""):
    if var not in request.json:#Valida que la variable que se le esta pasando este dentro del json que se se esta recibiendo
        tmp = [] if isinstance(m, list) else "" # Si la variable 'm' es una lista, inicializa 'tmp' como una lista vacía,
                                                # si no, inicializa 'tmp' como una cadena vacía.
        
    elif not isinstance(request.json[var], list): #Valida si la variable no es una lista
        tmp = request.json[var].strip() #Si no es una lista, le quita los espacios vacios iniciales y finales (si es que tiene)
    else:
        tmp = request.json[var] #Si es una lista
        for index, value in enumerate(tmp): #Recorre todos los elementos de la lista
            tmp[index] = value.strip() #Elimina los espacios iniciales y finales (si los tiene)
    return tmp

def recoge_form(var, m=""):
    if var not in request.form:  # Verifica si la variable está presente en el formulario
        if isinstance(m, list):  # Si m es una lista, inicializa tmp como una lista vacía
            tmp = []
        else:
            tmp = ""  # Si m no es una lista, inicializa tmp como una cadena vacía
    else:
        if isinstance(request.form[var], list):  # Verifica si el valor es una lista
            tmp = [value.strip() for value in request.form.getlist(var)]  # Elimina espacios en blanco de cada elemento de la lista
        else:
            tmp = request.form[var].strip()  # Elimina espacios en blanco del valor
    return tmp

def recoge_file(var, m=""):
    if var not in request.files:  # Verifica si la variable está presente en los archivos recibidos
        if isinstance(m, list):  # Si m es una lista, inicializa tmp como una lista vacía
            tmp = []
        else:
            tmp = None  # Si m no es una lista, inicializa tmp como None
    else:
        archivo = request.files[var]
        if archivo.filename != '':  # Verifica si se ha enviado un archivo
            tmp = archivo  # Retorna el objeto del archivo
        else:
            tmp = None  # Si no se ha enviado un archivo, inicializa tmp como None
    return tmp