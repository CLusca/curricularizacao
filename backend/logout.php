<?php
    date_default_timezone_set('America/Sao_Paulo');
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    function cleanSession() {
        foreach ($_SESSION as $key => $value) {
            unset($_SESSION[$key]);
        }
    }

    if (isset($_COOKIE)) {
        foreach ($_COOKIE as $nomeCookie => $valorCookie) {
            if ($nomeCookie !== 'PHPSESSID') {
                setcookie($nomeCookie, '', time() - 3600, '/');
            }
        }
    }
  
    if(isset($_SESSION['session'])){
        $area = $_SESSION['session'];
        
        cleanSession();

        unset($_SESSION['session']);

        header('Location: ../index.html');
        exit;

    } else {
        header('Location: ../index.html');
    }
?>
