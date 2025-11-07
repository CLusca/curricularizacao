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

    $id_empresa = $_SESSION['USUARIOS_id_empresa'];

    $conn = pg_connect("host=$host port=$port user=$user password=$password dbname=$dbname");

    try{
        if(!$conn){
            http_response_code(500);
            error_log("Erro ao Conectar com o Banco de Dados");
            return;
        }

        $query  = "SELECT
                        agendamentos.data,
                        clientes.nome,
                        clientes.telefone,
                        agendamentos.valor,
                        agendamentos.enviado
                    FROM agendamentos
                    INNER JOIN clientes ON clientes.id = agendamentos.id_cliente
                    WHERE agendamentos.id_empresa = $1
                    ORDER BY agendamentos.data";    
        $result = pg_query_params($conn, $query,array($id_empresa));

        if(!$result){
            http_response_code(500);
            error_log("Erro ao Executar SELECT na Tabela FGPFJ");
            return;
        } 

        if (pg_num_rows($result) > 0) {
            while ($row = pg_fetch_assoc($result)) {
                if($row['enviado'] == 'f'){
                    $status = 'Pendente';
                } else {
                    $status = 'Enviado';
                }
                
                $agendamento = array(
                    'data'     => $row['data'],
                    'cliente'  => $row['nome'],
                    'telefone' => $row['telefone'],
                    'valor'    => $row['valor'],
                    'status'   => $status
                );

                $agendamentos[] = $agendamento;   
            }
        }


        $json = array(
            'status'       => 200,
            'agendamentos' => $agendamentos 
        );

        echo json_encode($json);
        
    } finally{
        if($conn){
            pg_close($conn);
        }
    }
?>