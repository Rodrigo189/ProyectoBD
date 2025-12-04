**Aviso importante!**

los archivos a lo mas pedir, seguir la misma estructura de como esta hecho en general

mi_web: Ahi esta tanto dos archivos, el programa en python para levantar la pagina y vincularlo con la base de datos (OJO CREAR UNA BASE DE DATOS CON MYSQL COMO EN "Base de datos I"!!!)

Frontend: Ahi esta toda la Tecnologia "React" para utilizar, donde estara tanto CSS para que la pagina luzca igual a los Figmas, archivos para mantener a flote la estructura de React, como sus controladores y imagenes en "public"

Backend: Ahi esta la Tecnologia "Flask" para utilizar (en el mismo codigo python se ve como enlazar la base de datos local con MySQL)

**MODO DE USO!**

Primero estando dentro del archivo "mi_web" sigan los siguientes pasos
1) deben ejecutar el programa en python llamado 'app.py', si no se acuerdan es 'python3 app.py', luego el programa les soltara este mensaje 

<img width="1229" height="196" alt="Captura desde 2025-09-04 17-08-04" src="https://github.com/user-attachments/assets/1fe5b95c-e651-41eb-bbcb-7631304b6066" />

2) Luego en otro terminal (Muy importante), Deben ejecutar el comando "npm start", lo que hara es realizar el servicio y mostrar la pagina web

<img width="428" height="72" alt="Captura de pantalla 2025-09-16 211435" src="https://github.com/user-attachments/assets/a02eac31-33e6-4f88-9b7f-952272818fe8" />

Luego de tener algo asi:

<img width="980" height="100" alt="Captura de pantalla 2025-09-16 202533" src="https://github.com/user-attachments/assets/799e508b-f8d4-42de-9d9f-51b12c787677" />

Ya se estara realizando todo con normalidad


**TECNOLOGIAS ELEGIDAS**

Front-end: React

Back-end: Flask

BD: MongoDB (Docker)

Entrada Grupo 14:En el login hay diferentes usuarios, cada uno con su rol, RUN y contraseña, a continuacion se deja informacion de logeo de cada uno de esos usuarios:

Administradores

Sofía Rojas — RUN: 44444444-4 — Contraseña: admin123

Funcionarios

Juanito Pérez — RUN: 11111111-1 — Contraseña: fun123
María González — RUN: 22222222-2 — Contraseña: fun123
Pedro Soto — RUN: 33333333-3 — Contraseña: fun123

Teniendo claro esto aqui va el paso a paso de como ejecutar backend,frontend y BD:

**Primera ejecución**

**En Windows**

Abrir PowerShell en la raíz del proyecto:
```powershell
cd "c:\Users\repor\Downloads\ProyectoGrupo14\G14-Liquidacion_Reportes"
```
Levantar todo (Mongo + seed + backend + frontend):
```powershell
powershell -ExecutionPolicy Bypass -File start.ps1 -RecreateMongo
```
Arranque normal (sin recrear ni reimportar):
```powershell
powershell -ExecutionPolicy Bypass -File start.ps1
``` 
**En Linux**

Abrir su terminal de preferencia (Konsole, Gnome-terminal, xterm) en la raiz del proyecto:

```bash
cd "/ruta/de/su/directorio"
```

Levantar todo (Mongo + seed + backend + frontend):

```bash
./start.sh -r
```

Arranque normal (sin recrear ni reimportar):


```bash
./start.sh
```


URLs:

Frontend: http://localhost:3000
Backend:  http://localhost:5000
Mongo: mongodb://localhost:27017/eleam

Verificar datos importados:

docker exec eleam-mongo mongosh --quiet --eval "db.getSiblingDB('eleam').funcionarios.countDocuments()"
docker exec eleam-mongo mongosh --quiet --eval "db.getSiblingDB('eleam').sis.countDocuments()"
docker exec eleam-mongo mongosh --quiet --eval "db.getSiblingDB('eleam').probabilidades.countDocuments()"
docker exec eleam-mongo mongosh --quiet --eval "db.getSiblingDB('eleam').riesgos.countDocuments()"

Detener/Arrancar servicios

- Detener Mongo:
  docker stop eleam-mongo
- Ver estado:
  docker ps -a --filter "name=eleam-mongo"
- Arrancar nuevamente:
  docker start eleam-mongo
- Reiniciar:
  docker restart eleam-mongo
- Eliminar (recrear luego con start.ps1 -RecreateMongo):
  docker rm -f eleam-mongo

Para backend/frontend, cierra las ventanas abiertas por start.ps1 y vuelve a ejecutar:

- En Windows:
```powershell
powershell -ExecutionPolicy Bypass -File .\start.ps1
```

- En Linux:
```bash
./start.sh
```
