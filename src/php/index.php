<?php
/**
 * Created by PhpStorm.
 * User: shaunjanssens
 * Date: 23/11/15
 * Time: 18:37
 */
header('Content-type: application/json');

if(isset($_POST["data"])) {
    $data = $_POST["data"];

    var_dump($data);
} else {
    header("HTTP/1.1 500 Internal Server Error");
    die();
}

