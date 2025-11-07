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

    $cliente  = $dados['cliente'];
    $data     = $dados['data'];
    $meses    = $dados['meses'];
    $valor    = $dados['valor'];

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

        $query  = "INSERT INTO agendamentos (id_cliente, data, valor)
                    VALUES ($1, $2, $3)";    
        $result = pg_query_params($conn, $query,array($cliente, $data, $valor));

        if(!$result){
            http_response_code(500);
            error_log("Erro ao Executar UPDATE na Tabela AGENDAMENTOS");
            return;
        }

        if(pg_affected_rows($result) === 0) {
            http_response_code(404);
            error_log("Nenhuma Linha foi Modificada pelo UPDATE na Tabela AGENDAMENTOS");
            return;
        }

        $json = array('status' => 200);

        echo json_encode($json);
        
    } finally{
        if($conn){
            pg_close($conn);
        }
    }
?>