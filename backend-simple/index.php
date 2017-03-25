<?php

function singlecURL($url, $data = array(), $curlopt_private = '', $method = 'POST', $http_build_query = FALSE, $verbose = FALSE)
{
    if ($data === NULL) {
        $data = array();
    }
    if ($curlopt_private === NULL) {

    }
    if ($method === NULL) {
        $method = 'POST';
    }
    if ($http_build_query === NULL) {
        $http_build_query = FALSE;
    }
    if ($exec === NULL) {
        $exec = FALSE;
    }
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_PRIVATE, $curlopt_private);
    if ($verbose) {
        curl_setopt($ch, CURLOPT_VERBOSE, TRUE);
        curl_setopt($ch, CURLOPT_HEADER, TRUE);
    }
    switch ($method) {
        case 'POST':
        default: {
            if ($http_build_query) {
                curl_setopt($ch, CURLOPT_POST, TRUE);
                $data = http_build_query($data);
            } else {
                curl_setopt($ch, CURLOPT_POST, count($data));
            }
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
            break;
        }
        case 'GET': {
            $data = http_build_query($data);
            curl_setopt($ch, CURLOPT_URL, $url . '?' . $data);
            break;
        }
        case 'DELETE': {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
            break;
        }
    }
    return $ch;
}

$client_id = 'a41f5b2a-8e87-4b8b-b6fe-74cc763720d7';
$client_secret = 'bxbb2gFqCP1aM3kNPeptAWQMGz9gosbe9JCO1sqlp0BhY9G4UufpkXgsSFQYE545';
$api_key = 'eyJjbGllbnRJZCI6ImE0MWY1YjJhLThlODctNGI4Yi1iNmZlLTc0Y2M3NjM3MjBkNyJ9.ogVV_a9RUOMa1OWFZOTmgTkdk-U37vTliDCBUQ1YySU=';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $ch_token = singlecURL("https://ssl.allegro.pl/auth/oauth/token", array("grant_type" => "client_credentials"));
    curl_setopt($ch_token, CURLOPT_USERPWD, $client_id . ':' . $client_secret);
    $result_token = json_decode(curl_exec($ch_token), TRUE);

    $mobius_token = $result_token['access_token'];

    $ch_login = singlecURL("https://api.natelefon.pl/v1/allegro/login", array(
        "access_token" => $mobius_token,
        "userLogin" => $_POST['login'],
        "hashPass" => base64_encode(hash("sha256", $_POST['password'], true))
    ));

    $result_login = json_decode(curl_exec($ch_login), TRUE);

    $result = array(
        'token' => $result_token,
        'login' => $result_login
    );
} else {
    if(!empty($_GET['token'])){
        $mobius_token = $_GET['token'];
    } else {

    }

    $action = trim($_GET['action']);
    switch($action){
        case 'watched':
            $url = '';
            break;
        case 'bidded':
            $url ='';
            break;
        case 'bought':
            $url = '';
            break;
    }

    $ch_active = singlecURL($url, array(
        "access_token" => $mobius_token,
    ), '', 'GET');
    $result_active = json_decode(curl_exec($ch_active), TRUE);

    if ($result_active['code'] == '7103') {
        $result = array(
            'expired' => true
        );
    }
    else
    {
        $result = array(

        );
    }
}