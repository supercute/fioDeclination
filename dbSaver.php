<?php
/**
 * Created by PhpStorm.
 * User: ea.kichaev
 * Date: 21.09.2020
 * Time: 15:47
 */

define('HOST', '10.1.92.80');
define('USER', 'postgres');
define('PASS', 'postgres');
define('DB', 'birchik');



$db = pg_connect("host=".HOST." port=5432 dbname=".DB." user=".USER." password=".PASS);

$query = "INSERT INTO test.ref_last_name_exp values ";

foreach ($_POST['table'] as $row)
    $query .= "({$row['id']}, '{$row['Nom']}', '{$row['Gen']}', '{$row['Dat']}', '{$row['Acc']}', '{$row['Ins']}', '{$row['Pos']}'), ";
$query = substr($query, 0, -2);

$res = pg_query($db, $query);
echo json_encode($res ? true : false);