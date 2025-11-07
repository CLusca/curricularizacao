<?php
    header('Content-Type: application/json');
    date_default_timezone_set('America/Sao_Paulo');

    if($_SERVER["REQUEST_METHOD"] != "POST") {
        http_response_code(405);
        return;
    }

    if(session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    $_SESSION['banco_host']     = 'localhost';
    $_SESSION['banco_porta']    = '5432' ;
    $_SESSION['banco_usuario']  = 'gabriel';
    $_SESSION['banco_senha']    = 'f0ne2607';
    $_SESSION['banco_database'] = 'projeto';
 
    $host          = $_SESSION['banco_host'];
    $port          = $_SESSION['banco_porta'];
    $user          = $_SESSION['banco_usuario'];
    $password      = $_SESSION['banco_senha'];
    $dbname        = $_SESSION['banco_database'];

    $cod_usuario    = '';
    $primeiroAcesso = false;

    $dados  = json_decode(file_get_contents('php://input'), true);
    $partes = explode("-", $dados);
    
    $usuario = trim($partes[0]);
    $senha   = trim($partes[1]);

    $conn  = pg_connect("host=$host port=$port user=$user password=$password dbname = $dbname");

    try{
        if (!$conn){
            http_response_code(500);
            error_log("Erro ao Conectar com o Banco de Dados");
            return;
        }    
        
        $query  = "SELECT
                        id,
                        nome,
                        id_empresa
                    FROM usuarios
                    WHERE username = $1
                    AND senha = $2
                    AND level > 0";
        $result = pg_query_params($conn, $query, array($usuario, $senha));
                
        if (!$result) {
            http_response_code(500);
            error_log("Erro ao Executar SELECT na Tabela USUARIOS");
            return;
        } else {
            if (pg_num_rows($result) > 0) {
                while ($row = pg_fetch_assoc($result)) {                 
                    $nomeSeparado                 = explode(".", $usuario);                   
                    $_SESSION['primeiroNome']     = $nomeSeparado[0];
                    $_SESSION['USUARIOS_id']      = $row['id'];
                    $_SESSION['USUARIOS_id_empresa'] = $row['id_empresa'];
                }

    //-----------------------------------Sistema Operacional----------------------------
                $userAgent = $_SERVER['HTTP_USER_AGENT'];
                if(stripos($userAgent, 'Android') !== false){
                $os = 'Android';
                }
                elseif(stripos($userAgent, 'Linux') !== false){
                    $os = 'Linux';
                }
                elseif(stripos($userAgent, 'Windows') !== false){
                    $os = 'Windows';
                }
                elseif(stripos($userAgent, 'Iphone') !== false || stripos($userAgent, 'iPad') !== false){
                    $os = 'IOS';
                } else{
                    $os = 'Desconhecido';
                }
    //----------------------------------------Navegador----------------------------------
                if (stripos($userAgent, 'Instagram') !== false) {
                    $browser = 'Instagram WebView';
                } elseif (stripos($userAgent, 'FBAN') !== false || stripos($userAgent, 'FBAV') !== false) {
                    $browser = 'Facebook WebView';
                } elseif (stripos($userAgent, 'WhatsApp') !== false) {
                    $browser = 'WhatsApp WebView';
                } elseif (stripos($userAgent, 'Safari') !== false && stripos($userAgent, 'Chrome') === false) {
                    $browser = 'Safari';
                } elseif(stripos($userAgent, 'Chrome') !== false && stripos($userAgent, 'Edg') === false) {
                    $browser = 'Google Chrome';
                } elseif (stripos($userAgent, 'Edg') !== false) {
                    $browser = 'Microsoft Edge';
                } elseif (stripos($userAgent, 'Firefox') !== false) {
                    $browser = 'Mozilla Firefox';
                } elseif (stripos($userAgent, 'Opera') !== false || stripos($userAgent, 'OPR') !== false) {
                    $browser = 'Opera';
                } elseif (stripos($userAgent, 'MSIE') !== false || stripos($userAgent, 'Trident') !== false) {
                    $browser = 'Internet Explorer';
                } else {
                    $browser = 'Desconhecido';
                }
                
                $data  = date('Y/m/d');
                $hora  = date('H:i:s');
                $token = bin2hex(random_bytes(32));

                $query2  = "INSERT INTO acessos (id, username, empresa, data, hora, os, navegador)
                            VALUES ($1, $2, $3, $4, $5, $6, $7)";
                $result2 = pg_query_params($conn, $query2, array($token, $usuario, $_SESSION['USUARIOS_empresa'], $data, $hora, $os, $browser));

                if(!$result2){
                    http_response_code(500);
                    error_log("Erro ao Executar INSERT INTO na Tabela ACESSOS");
                    return;
                }
                
                if(pg_affected_rows($result2) === 0){
                    http_response_code(404);
                    error_log("Nenhuma Linha foi Modificada pelo INSERT INTO na Tabela ACESSOS");
                    return;
                }

                $_SESSION['token_hash']  = hash('sha256', $token);
                
                setcookie('token', $token, [
                    'expires'  => time() + 7200,
                    'path'     => '/',
                    'secure'   => true,
                    'httponly' => true,
                    'samesite' => 'Strict'
                ]);

                setcookie("ultimoAcesso", "", time() - 3600, "/");

                unset($_SESSION['menu']);
                
                $json = array('status' => 200 );
            } else {
                $json = array('status' => 404 );
            }
            echo json_encode($json);
        }
    } finally{
        if($conn){
            pg_close($conn);
        }
    }
?>