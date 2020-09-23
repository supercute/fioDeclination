<?php
/**
 * Created by PhpStorm.
 * User: ea.kichaev
 * Date: 21.09.2020
 * Time: 14:35
 */

require_once ('NameCaseLib/NCLNameCaseRu.php');

$decMap = [
    'Nom' => NCL::$IMENITLN,
    'Gen' => NCL::$RODITLN,
    'Dat' => NCL::$DATELN,
    'Acc' => NCL::$VINITELN,
    'Ins' => NCL::$TVORITELN,
    'Pos' => NCL::$PREDLOGN
];


$name = $_GET['name'];
$dec = $_GET['dec'];


$nc = new NCLNameCaseRu();

$result = $nc->qSecondName($name, $decMap[$dec]);// qFirstName qSecondName qFatherName

echo json_encode(['decName' => $result], JSON_UNESCAPED_UNICODE);
