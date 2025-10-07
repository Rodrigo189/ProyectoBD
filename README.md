Aviso importante!

los archivos a lo mas pedir, seguir la misma estructura de como esta hecho en general

mi_web: Ahi esta tanto dos archivos, el programa en python para levantar la pagina y vincularlo con la base de datos (OJO CREAR UNA BASE DE DATOS CON MYSQL COMO EN "Base de datos I"!!!)

Frontend: Ahi esta toda la Tecnologia "React" para utilizar, donde estara tanto CSS para que la pagina luzca igual a los Figmas, archivos para mantener a flote la estructura de React, como sus controladores y imagenes en "public"

Backend: Ahi esta la Tecnologia "Flask" para utilizar (en el mismo codigo python se ve como enlazar la base de datos local con MySQL)

MODO DE USO!

Primero estando dentro del archivo "mi_web" sigan los siguientes pasos
1) deben ejecutar el programa en python llamado 'app.py', si no se acuerdan es 'python3 app.py', luego el programa les soltara este mensaje 

<img width="1229" height="196" alt="Captura desde 2025-09-04 17-08-04" src="https://github.com/user-attachments/assets/1fe5b95c-e651-41eb-bbcb-7631304b6066" />

2) Luego en otro terminal (Muy importante), Deben ejecutar el comando "npm start", lo que hara es realizar el servicio y mostrar la pagina web

<img width="428" height="72" alt="Captura de pantalla 2025-09-16 211435" src="https://github.com/user-attachments/assets/a02eac31-33e6-4f88-9b7f-952272818fe8" />

Luego de tener algo asi:

<img width="980" height="100" alt="Captura de pantalla 2025-09-16 202533" src="https://github.com/user-attachments/assets/799e508b-f8d4-42de-9d9f-51b12c787677" />

Ya se estara realizando todo con normalidad


TECNOLOGIAS ELEGIDAS

Front-end: React

Back-end: Flask

BD: MySQL


CONFIGURACIÓN GRUPO 14:

La base de datos global y actualizada se encuentra en /setup_db.sql, no usar la base de datos vieja.

Configurar /G14-Liquidacion_reportes/backend/config.py para que esté de acuerdo con su configuración del sistema

"""Configuración de la conexión a la base de datos MySQL."""
import mysql.connector


def get_connection():
    """Establece y retorna una conexión a la base de datos MySQL."""
    return mysql.connector.connect(
        host="localhost", 
        user="root", # Por defecto, nuestro usuario es root en MySQL, pero si lo tienen diferente, verifiquenlo con "SELECT USER();" en la terminal de MySQL.
        password="JuacoXD112",  # Aqui pongan su contraseña al entrar a MySQL desde la terminal
        database="liq_rep"# Aqui pongan el nombre que le pusieron a la base de datos (me refiro al nombre que le pusieron al restaurarla desde el archivo .sql)
    )