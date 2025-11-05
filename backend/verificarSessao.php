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

    if(isset($_COOKIE['token'])){
        $token = $_COOKIE['token'] ?? '';
        if(hash('sha256', $token) === $_SESSION['token_hash']){

            $infos = array(
                'nome'  => $_SESSION['primeiroNome'],
                'login' => true,
            );
        } else {
            $infos = array(
                'login' => false
            );
        }
    } else {
        $infos = array(
            'login' => false
        );
    }
    
    echo json_encode($infos);
?>