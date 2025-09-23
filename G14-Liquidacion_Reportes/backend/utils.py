def load_queries(filepath="bd/consultas.sql"):
    queries = {}
    current_name = None
    current_query = []
    
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line.startswith("-- nombre:"):
                # guardar consulta anterior
                if current_name and current_query:
                    queries[current_name] = " ".join(current_query)
                current_name = line.split(":")[1].strip()
                current_query = []
            elif line and not line.startswith("--"):
                current_query.append(line)
        
        # guardar última consulta
        if current_name and current_query:
            queries[current_name] = " ".join(current_query)
    
    return queries
