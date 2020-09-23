<?php
/**
 * Created by PhpStorm.
 * User: ea.kichaev
 * Date: 21.09.2020
 * Time: 14:31
 */

define('HOST', '10.1.92.80');
define('USER', 'postgres');
define('PASS', 'postgres');
define('DB', 'birchik');



$db = pg_connect("host=".HOST." port=5432 dbname=".DB." user=".USER." password=".PASS);

$query = "select * from test.ref_last_name";// where id >= ?

$result = pg_fetch_all(pg_query($db, $query));

?>
<script src = "https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lvovich/dist/lvovich.min.js"></script>
<script src="name.js"></script>
<script>
    var table = <?=json_encode($result)?>;
</script>


<script src="index.js"></script>

