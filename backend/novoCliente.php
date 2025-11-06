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

    $recnum   = $dados['nome'];
    $telefone = $dados['telefone'];
    $dataPag  = $dados['dataPag'];
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
            error_log("Erro ao Conectar com o Banco de Dados | ID: " . $_SESSION['log_id']);
            return;
        }

        $query  = "SELECT cnpj_cpf
                    FROM fgpfj
                    WHERE recnum = $1";    
        $result = pg_query_params($conn, $query,array($recnum));

        if(!$result){
            http_response_code(500);
            error_log("Erro ao Executar SELECT na Tabela FGPFJ | ID: " . $_SESSION['log_id']);
            return;
        } 

        $query2 = "SELECT codigo
                    FROM fgcid
                    WHERE cod_ibge = $1";
        $result2 = pg_query_params($conn, $query2,array($cidade));

        if(!$result2){
            http_response_code(500);
            error_log("Erro ao Executar SELECT na Tabela FGCID | ID: " . $_SESSION['log_id']);
            return;
        }

        while ($row2 = pg_fetch_assoc($result2)){
            $cod_cid = $row2['codigo'];
        }

        if (pg_num_rows($result) > 0) {
            $query3 = "UPDATE fgpfj SET nome = $2, fant = $3, ie_rg = $4, suframa = $5, cod_gcl = $6, cod_can = $7, email = $8,
                            cod_cep = $9, cod_cid = $10, bairro = $11, ender = $12, numero = $13, complemento = $14, ponto_ref = $15, obs = $16,
                            fone = $17, celular = $18, cod_fco = $19, fat_pro_cpg = $20, contato = $21, cargo = $22, trab_end = $23,
                            fone_trab = $24
                        WHERE cod = $1";
            $result3 = pg_query_params($conn, $query3,array($codInterno, $razaoSocial, $nomeFant, $ie, $suframa,
                        $grupoEmp, $ramo, $email, $cep, $cod_cid, $bairro, $logradouro, $numero, $complemento, $pontoRef, $obs,
                        $telefone1, $telefone2, $formaPag, $condicoesPag, $nomeContato, $cargoContato, $emailContato, $telefoneContato));

            
            if(!$result3){
                http_response_code(500);
                error_log("Erro ao Executar UPDATE na Tabela FGPFJ | ID: " . $_SESSION['log_id']);
                return;
            }

            if(pg_affected_rows($result3) === 0) {
                http_response_code(404);
                error_log("Nenhuma Linha foi Modificada pelo UPDATE na Tabela FGPFJ | ID: " . $_SESSION['log_id']);
                return;
            }
        } else {
            $query4 = "UPDATE geactl
                        SET seq_pfj = seq_pfj + 1
                        WHERE cod='001' RETURNING seq_pfj";
            $result4 = pg_query_params($conn, $query4,array());

            if(!$result4){
                http_response_code(500);
                error_log("Erro ao Executar UPDATE no Banco de dados na Tabela GEACTL | ID: " . $_SESSION['log_id']);;
                return;
            }

            if(pg_affected_rows($result4) === 0) {
                http_response_code(404);
                error_log("Nenhuma Linha foi Modificada pelo UPDATE na Tabela GEACTL | ID: " . $_SESSION['log_id']);
                return;
            }

            if (pg_num_rows($result4) > 0) {
                while ($row4 = pg_fetch_assoc($result4)){
                    $codInterno =  $row4['seq_pfj'];
                }
                
                $query5 = "INSERT INTO fgpfj (cnpj_cpf, nome, fant, ie_rg, suframa, cod, cod_gcl,
                                cod_can, email, ender, numero, complemento, ponto_ref, obs, cod_cep, fone, celular, cod_cid, bairro, cod_fco, fat_pro_cpg,
                                contato, cargo, trab_end, fone_trab, fj)
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, 'J')
                            RETURNING recnum";
                $result5 = pg_query_params($conn, $query5,array($cnpj, $razaoSocial, $nomeFant, $ie, $suframa,
                            $codInterno, $grupoEmp, $ramo, $email, $logradouro, $numero, $complemento, $pontoRef, $obs, $cep, $telefone1, $telefone2,
                            $cod_cid, $bairro, $formaPag, $condicoesPag, $nomeContato, $cargoContato, $emailContato, $telefoneContato));
            
                if(!$result5){
                    http_response_code(500);
                    error_log("Erro ao Executar INSERT INTO na Tabela FGPFJ | ID: " . $_SESSION['log_id']);
                    return;
                }
                        
                if(pg_affected_rows($result5) === 0) {
                    http_response_code(404);
                    error_log("Nenhuma Linha foi Modificada pelo INSERT INTO na Tabela FGPFJ | ID: " . $_SESSION['log_id']);
                    return;
                }

                if (pg_num_rows($result5) > 0) {
                    while ($row5 = pg_fetch_assoc($result5)){
                        $recnum = $row5['recnum'];
                    }
                }
            }
        }

        $json = array(
            'status'  => 200,
            'id'      => $recnum
        );

        echo json_encode($json);
        
    } finally{
        if($conn){
            pg_close($conn);
        }
    }
?>