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
