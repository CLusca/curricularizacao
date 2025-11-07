<?php
    header('Content-Type: application/json');
    date_default_timezone_set('America/Sao_Paulo');

    if($_SERVER['REQUEST_METHOD'] != 'POST'){
        http_response_code(405);
        return;
    }

    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    if(!isset($_COOKIE['token']) || !isset($_SESSION['token_hash'])){
        http_response_code(401);
        return;
    }
    
    $token = $_COOKIE['token'] ?? '';
    if(hash('sha256', $token) !== $_SESSION['token_hash']){
        http_response_code(401);
        return;
    }

    $dados = json_decode(file_get_contents('php://input'), true);

    $nome     = $dados['nome'];
    $telefone = $dados['telefone'];
    $cnpj_cpf = $dados['cnpj_cpf'];

    $host     = $_SESSION['banco_host'];
    $port     = $_SESSION['banco_porta'];
    $user     = $_SESSION['banco_usuario'];
    $password = $_SESSION['banco_senha'];
    $dbname   = $_SESSION['banco_database'];  

    $id_empresa = $_SESSION['USUARIOS_id_empresa'];

    $conn = pg_connect("host=$host port=$port user=$user password=$password dbname=$dbname");

    try{
        if(!$conn){
            http_response_code(500);
            error_log("Erro ao Conectar com o Banco de Dados");
            return;
        }

        $query  = "SELECT cnpj_cpf
                    FROM clientes
                    WHERE cnpj_cpf = $1
                    AND id_empresa = $2";    
        $result = pg_query_params($conn, $query,array($cnpj_cpf, $id_empresa));

        if(!$result){
            http_response_code(500);
            error_log("Erro ao Executar SELECT na Tabela FGPFJ");
            return;
        } 

        if (pg_num_rows($result) > 0) {
            $query2 = "UPDATE clientes SET nome = $1, telefone = $2 WHERE cnpj_cpf = $3 AND id_empresa = $4";
            $result2 = pg_query_params($conn, $query2,array($nome, $telefone, $cnpj_cpf, $id_empresa));

            
            if(!$result2){
                http_response_code(500);
                error_log("Erro ao Executar UPDATE na Tabela FGPFJ");
                return;
            }

            if(pg_affected_rows($result2) === 0) {
                http_response_code(404);
                error_log("Nenhuma Linha foi Modificada pelo UPDATE na Tabela FGPFJ");
                return;
            }
        } else {
             $query2 = "INSERT INTO clientes (nome, telefone, cnpj_cpf, id_empresa)
                        VALUES ($1, $2, $3, $4)";
            $result2 = pg_query_params($conn, $query2, array($nome, $telefone, $cnpj_cpf, $id_empresa));
        
            if(!$result2){
                http_response_code(500);
                error_log("Erro ao Executar INSERT INTO na Tabela FGPFJ");
                return;
            }
                    
            if(pg_affected_rows($result2) === 0) {
                http_response_code(404);
                error_log("Nenhuma Linha foi Modificada pelo INSERT INTO na Tabela FGPFJ");
                return;
            }
        }

        $json = array(
            'status'  => 200
        );

        echo json_encode($json);
        
    } finally{
        if($conn){
            pg_close($conn);
        }
    }
?>