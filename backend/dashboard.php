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

    $host     = $_SESSION['banco_host'];
    $port     = $_SESSION['banco_porta'];
    $user     = $_SESSION['banco_usuario'];
    $password = $_SESSION['banco_senha'];
    $dbname   = $_SESSION['banco_database'];  

    $conn = pg_connect("host=$host port=$port user=$user password=$password dbname=$dbname");

    try{
        if(!$conn){
            http_response_code(500);
            error_log("Erro ao Conectar com o Banco de Dados");
            return;
        }

        $query  = "SELECT nome,
                        telefone,
                        cnpj_cpf
                    FROM clientes
                    ORDER BY nome";    
        $result = pg_query_params($conn, $query,array());

        if(!$result){
            http_response_code(500);
            error_log("Erro ao Executar SELECT na Tabela FGPFJ");
            return;
        } 

        if (pg_num_rows($result) > 0) {
            $clientes = pg_num_rows($result);
        } else {
            $clientes = 0;
        }


        $json = array(
            'status'   => 200,
            'clientes' => $clientes 
        );

        echo json_encode($json);
        
    } finally{
        if($conn){
            pg_close($conn);
        }
    }
?>