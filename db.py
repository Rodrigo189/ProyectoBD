import os
import pymysql
from dotenv import load_dotenv

# Cargar variables desde .env en local
load_dotenv()

def get_connection():
    return pymysql.connect(
        host=os.getenv("DB_HOST", "127.0.0.1"),
        port=int(os.getenv("DB_PORT", 3306)),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASS", ""),
        database=os.getenv("DB_NAME", "mydb"),
        cursorclass=pymysql.cursors.DictCursor
    )
