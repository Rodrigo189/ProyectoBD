#!/bin/bash

# Parámetros

RecreateMongo=false
Seed=true

while getopts 'rs' opt; do
    case "$opt" in
                r) RecreateMongo=true;;
                s) Seed=false;;
    esac
done

# Conseguir el directorio de trabajo actual 

root=$PWD
seedPath="$root/mongo_data"

# Inicialización docker

echo -e "\e[36m===> Iniciando Mongo (Docker)...\e[0m" 
exists=$(docker ps -a --format "{{.Names}}")
echo "test"
match='eleam-mongo'
if [[ ${exists[@]} =~ $match ]]; then
    exist=true
    echo "exists"
fi

if [[ ! ${exists[@]} =~ $match ]]; then
    docker run -d --name "eleam-mongo" -p 27017:27017 -v "$seedPath:/data/seed" mongo:7 > /dev/null
    echo "doesn't exist"
fi

if $RecreateMongo; then
    if $exists; then
        echo "recreate mongo"
        docker rm -f "eleam-mongo" > /dev/null
        exists=false
    fi
fi
if $exists; then
    docker start "eleam-mongo" > /dev/null
fi

# Esperar a que Mongo esté listo
for i in {1..30}; do
    docker exec "eleam-mongo" mongosh --quiet --eval "db.runCommand({ ping: 1}).ok" 2>/dev/null 1>/dev/null
    if [ $? -eq 0 ]; then
        break
    fi
    sleep 1
done
echo -e "\e[32mMongo OK.\e[0m"

funcionarios=("funcionarios" "funcionarios.json")
probabilidades=("probabilidades" "probabilidades.json")
riesgos=("riesgos" "riesgos.json")
sis=("sis" "sis.json")
coleccion=($funcionarios $probabilidades $riesgos $sis)

if $Seed; then
    echo -e "\e[36m===> Importando JSON...\e[0m"
    for arrayName in "${coleccion[@]}"; do
        declare -n imports="$arrayName"
    done
    for it in $imports; do
        file="/data/seed/${it[1]}"
        echo "  - ${it[0]} <- ${it[1]}"
        docker exec eleam-mongo mongoimport --db eleam --collection ${it[0]} --drop --jsonArray --file $file > /dev/null
    done
    echo -e "\e[32mImportación completa.\e[0m"
fi


# Comandos backend

backendScript=$(mktemp)

cat << 'EOF' > "$backendScript"
#!/bin/bash
root=$PWD
backendPath="$root/backend"
cd "$backendPath"

if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi

source .venv/bin/activate
pip install -r requirements.txt
export FLASK_ENV="development"
python app.py
EOF
chmod +x "$backendScript"

# Comandos frontend
frontendScript=$(mktemp)
cat << 'EOF' > "$frontendScript"
#!/bin/bash
root=$PWD
frontendPath="$root/frontend"
cd "$frontendPath"

if [ ! -d "node_modules" ]; then
    npm install
fi

npm start
EOF
chmod +x "$frontendScript"

# Identificar emulador de terminal

terminals="konsole xterm gnome-terminal code codium"
terminal=unknown
cur=$$

while cur=$(ps -o ppid:1= -p "$cur") && ((cur)); do
    comm=$(<"/proc/$cur/comm")
    if [[ " $terminals " = *" $comm "* ]]; then
        terminal=$comm
        break
    fi
done

echo "Terminal detectado: $terminal"

# Lanzar backend y frontend según terminal

case "$terminal" in

# Iniciar servicios en konsole

    konsole)
        konsole -e bash -c "$backendCmd; exec bash" &
        konsole -e bash -c "$frontendCmd; exec bash" &
        ;;

# Iniciar servicios en gnome-terminal

    gnome-terminal)
        gnome-terminal -- bash -c "$backendCmd; exec bash" &
        gnome-terminal -- bash -c "$frontendCmd; exec bash" &
        ;;

# Iniciar servicios en xterm

    xterm)
        xterm -hold -e "$backendCmd" &
        xterm -hold -e "$frontendCmd" &
        ;;

        *)
            echo "No se detectó terminal conocida. Por defecto, se utilizarán scripts temporales en konsole."
            konsole -e bash -c "$backendCmd; exec bash" &
            konsole -e bash -c "$frontendCmd; exec bash" &
            ;;
esac



echo -e "\e[32m Listo\e[0m"
echo "  Backend: http://localhost:5000"
echo "  Frontend: http://localhost:3000"
echo "  Mongo: mongodb://localhost:27017/eleam"
echo "  Usa -r para borrar y recrear el contenedor, -s para no reimportar"