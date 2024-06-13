<?php
    $dbhost="localhost";
	$dbuser="root";
	$dbpass="1234";

    $c1 = new mysqli($dbhost,$dbuser,$dbpass) or die ('Error de conexion a mysql: ' . $c1->error.'<br>');

    $c1->query("Create database AttackOfTheDeadMen");
    $c1->select_db("AttackOfTheDeadMen");
    //Creacion de las tabla en la Base de Datos DataBase1
    mysqli_query($c1,"CREATE TABLE IF NOT EXISTS Adventures (ID VARCHAR(20) PRIMARY KEY,CASILLAS VARCHAR(1000) NOT NULL,REGLAS VARCHAR(255) NOT NULL, OBJETIVO VARCHAR(255) NOT NULL,TABLEROS VARCHAR(255) NOT NULL)");
    echo mysqli_error($c1);

    $stmt="INSERT IGNORE INTO Adventures (ID,CASILLAS,REGLAS,OBJETIVO,TABLEROS)values(?,?,?,?,?)";
    $stmtFinal=mysqli_prepare($c1, $stmt);
    echo mysqli_error($c1);
    $ID = ['0'];
    $casillas = [[
        [['C'],['A'],['W'],['A'],['C'],[' '],['C'],[' '],['C'],['M'],['H']],
        [['A'],['A'],[' '],['M'],['M'],['M'],['M'],['M'],[' '],['M'],[' ']],
        [['C'],['B'],['W'],['M'],['H'],[' '],['H'],['M'],['C'],['P'],['H']],
        [['A'],['A'],[' '],['M'],['M'],['M'],['M'],['M'],[' '],['M'],[' ']],
        [['C'],['A'],['W'],['A'],['C'],[' '],['C'],[' '],['C'],['M'],['H']],
        [['P'],['M'],[' '],['M'],['P'],['M'],['P'],['M'],[' '],['M'],[' ']],
        [['H'],['M'],['W'],['M'],['H'],[' '],['H'],['M'],['C'],['M'],['H']],
        [['P'],['M'],[' '],['M'],['M'],['M'],['M'],['M'],['B'],['M'],['M']],
        [['C'],[' '],['W'],[' '],['W'],[' '],['W'],[' '],['W'],['B'],['C']],
        [['P'],['M'],[' '],['M'],['M'],['M'],['M'],['M'],[' '],['M'],['M']],
        [['H'],['P'],['C'],['P'],['H'],[' '],['H'],['M'],['W'],['M'],['H']],
    ]
    ];
    $reglas=['Los objetivos son los siguientes: 1 Prevenir la invasión zombie(Destruyendo todas las zonas de aparición), 2 La aventura espera (Llegar a la salida y escapar con todos los supervivientes). Las reglas especiales son que las zonas verde y azul se rompen al coger esos objetivos (El verde esta entre los rojos bocaabajo) y los rojos hay que romperlos con el trebuche'];
    
    $objetivos = [[
        [[],['Zona Azul'],[],[],['Aparicion'],[]],
        [[],[],[],[],[],['Objetivo Azul']],
        [['Trebuche'],[],[],[],[],[]],
        [['Objetivo'],[],[],[],[],[]],
        [[],[],[],[],[],['Zona Verde']],
        [['Objetivo'],['Zona Roja'],['EXIT'],[],[],[]],
    ]
    ];
    $tableros = [[['20V','16R'],['18R','17R']]];
    for ($i=0; $i < count($ID); $i++) {
        //Definimos parametros de la consulta
        //La funcion solo admite variables 
        $types = str_repeat("s",5);
        $values = [$ID[$i],json_encode($casillas[$i]),$reglas[$i],json_encode($objetivos[$i]),json_encode($tableros[$i])];
        mysqli_stmt_bind_param($stmtFinal,$types, ...$values);
        mysqli_stmt_execute($stmtFinal);
    }
    mysqli_stmt_close($stmtFinal);

    mysqli_query($c1,"CREATE TABLE IF NOT EXISTS ZOMBIS (TIPO VARCHAR(200) PRIMARY KEY, VIDA VARCHAR(20) NOT NULL, ACTIONS VARCHAR(20) NOT NULL, EXPERIENCE VARCHAR(20) NOT NULL)");
    echo mysqli_error($c1);

    $stmt2="INSERT IGNORE INTO ZOMBIS (TIPO,VIDA,ACTIONS,EXPERIENCE)values(?,?,?,?)";
    $stmtFinal=mysqli_prepare($c1, $stmt2);
    echo mysqli_error($c1);
    $zombis = ['Caminante Orco','Gordo Orco','Abominacion','Corredor Orco', 'Nigromante Orco'];
    $vida = ['1','2','3','1','1'];
    $actions = ['1','1','1','2','1'];
    $experience = ['1','1','5','1','1'];
    for ($i=0; $i < count($zombis); $i++) {
        //Definimos parametros de la consulta
        //La funcion solo admite variables 
        $types = str_repeat("s",4);
        $values = [$zombis[$i],$vida[$i],$actions[$i],$experience[$i]];
        mysqli_stmt_bind_param($stmtFinal,$types, ...$values);
        mysqli_stmt_execute($stmtFinal);
    }
    mysqli_stmt_close($stmtFinal);

    mysqli_query($c1,"CREATE TABLE IF NOT EXISTS CHARACTERS (NAME VARCHAR(200) PRIMARY KEY, PASIVE VARCHAR(200) NOT NULL, SKILL1 VARCHAR(200) NOT NULL, SKILL2 VARCHAR(200) NOT NULL, SKILL3 VARCHAR(200) NOT NULL, SPECIFIC_EQUIPMENT VARCHAR(200) NOT NULL,INITIALWEAPON VARCHAR(200) NOT NULL)");
    echo mysqli_error($c1);
    $stmt2="INSERT IGNORE INTO CHARACTERS (NAME,PASIVE,SKILL1,SKILL2,SKILL3,SPECIFIC_EQUIPMENT,INITIALWEAPON)values(?,?,?,?,?,?,?)";
    $stmtFinal=mysqli_prepare($c1, $stmt2);
    echo mysqli_error($c1);
    $names = ['Berin','Asim','Seli','Rolf','Johannes','Megan'];
    $pasives = ['Empujon','Provocacion','Salto','Sed de sangre: Cuerpo a cuerpo','Transmutacion','Conjuro duplicado'];
    $skill1 = ['+1 Accion','+1 Accion','+1 Accion','+1 Accion','+1 Accion','+1 Accion'];
    $skill2 = [
        ['+1 dado: Cuerpo a cuerpo','+1 accion de combate cuerpo a cuerpo gratuita'],
        ['+1  accion cuerpo a cuerpo gratuita','+1 accion de movimiento gratuita'],
        ['+1 accion de combate cuerpo a cuerpo gratuita','Ataque y retirada'],
        ['+1 accion de combate cuerpo a cuerpo gratuita','Salto'],
        ['+1 accion dde combate a distancia gratuita','+1 a las tiradas: A distancia'],
        ['+1 accion de combate cuerpo a cuerpo gratuita','Grimorio']
    ];
    $skill3 = [
        ['+1 al daño Cuerpo a cuerpo','+1 accion de combate gratuita','Sed de sangre: Cuerpo a cuerpo'],
        ['+1 a las tiradas: Cuerpo a cuerpo','Sed de sangre: Cuerpo a cuerpo','Segador: Combate'],
        ['+1 accion de movimiento gratuita','6 en el dado: +1 dado de combate','Vinculo zombi'],
        ['+1 accion de combate gratuita','Furia de combate','Empujon'],
        ['+1 accion de combate a distancia gratuita','+1 al Alcance maximo','Segador: A distancia'],
        ['+1 accion de combate gratuita','+1 a las tiradas: Magia','+1 a las tiradas: Cuerpo a cuerpo']
    ];
    $specialEquipment = ['Hacha enana','Daga Curva','Daga Curva','Hacha de doble filo','Ballesta','Rapidez'];
    $initialWeapon = [1,1,1,4,3,2];
    for ($i=0; $i < count($names); $i++) {
        //Definimos parametros de la consulta
        //La funcion solo admite variables 
        $types = str_repeat("s",7);
        $values = [$names[$i],$pasives[$i],$skill1[$i],json_encode($skill2[$i]),json_encode($skill3[$i]),$specialEquipment[$i],$initialWeapon[$i]];
        mysqli_stmt_bind_param($stmtFinal,$types, ...$values);
        mysqli_stmt_execute($stmtFinal);
    }
    mysqli_stmt_close($stmtFinal);

    mysqli_query($c1,"CREATE TABLE IF NOT EXISTS EQUIPMENT (ID INT PRIMARY KEY, NAME VARCHAR(200) NOT NULL, 
    INVENTORY VARCHAR(20) NOT NULL, DUALWEAPON TINYINT(1), DOORS TINYINT(1),NOISE TINYINT(1), EFECT VARCHAR(255),
    `RANGE` VARCHAR(200), DICES INT, MINIMUM_ROLL INT, DAMAGE INT)");
    echo mysqli_error($c1);
    //Equipo inicial
    $stmt2="INSERT IGNORE INTO EQUIPMENT (ID,NAME,INVENTORY,DUALWEAPON,DOORS,NOISE,EFECT,`RANGE`,DICES,MINIMUM_ROLL,DAMAGE)values(?,?,?,?,?,?,?,?,?,?,?)";
    $stmtFinal=mysqli_prepare($c1, $stmt2);
    echo mysqli_error($c1);
    $id = [1,2,3,4];
    $name = ['Espada corta','Golpe telequinetico','Arco con pinchos','Espada nordica'];
    $inventory = ['Hand','Hand','Hand','Hand'];
    $dual = [true,true,false,false];
    $doors = [true,true,false,false];
    $noise = [false,true,false,false];
    $efect = ['','HECHIZO DE COMBATE.Gasta una accion para abrir una puerta a tu alcanze y linea de vision','FLECHAS','+2 dados si tienes equipado un Escudo nordico'];
    $range = ['0','0-1','0-1','0'];
    $dices = [1,1,1,1];
    $minimun = [4,4,4,4];
    $damage = [1,1,1,2];
    for ($i=0; $i < count($name); $i++) {
        //Definimos parametros de la consulta
        //La funcion solo admite variables 
        $types = str_repeat("s",11);
        $values = [$id[$i],$name[$i],$inventory[$i],$dual[$i],$doors[$i],$noise[$i],$efect[$i],$range[$i],$dices[$i],$minimun[$i],$damage[$i]];
        mysqli_stmt_bind_param($stmtFinal,$types, ...$values);
        mysqli_stmt_execute($stmtFinal);
    }
    mysqli_stmt_close($stmtFinal);

    $exp = 'Descarta esta carta para ganar 1 punto de Experiencia';
    $antorcha = 'Roba dos cartas cuando busques, Gasta una accion y descarta la Antorcha y selecciona una ficha de Bilis de dragon situada a Alcance 0-1 y en tu linea de vision para crear Fuego de dragon';
    $bilis = 'Gasta una accion y descarta la Bilis de dragon para colocar una ficha de Bilis de dragon a Alcance 0-1 y en tu linea de vision';
    $orco = '¡EMBOSCADA ORCA! Coloca un Caminante orco en la Zona en la que acabas de buscar';
    $montones = 'Puedes repetir una vez todas los ataques a distancia que contengan la palabra ';
    $escudo = 'Elige entre: ARMADURA +4|Repite una vez las tiradas de salvacion de otra armadura que tengas equipada';
    //Equipo total
    $stmt2="INSERT IGNORE INTO EQUIPMENT (ID,NAME,INVENTORY,DUALWEAPON,DOORS,NOISE,EFECT,`RANGE`,DICES,MINIMUM_ROLL,DAMAGE)values(?,?,?,?,?,?,?,?,?,?,?)";
    $stmtFinal=mysqli_prepare($c1, $stmt2);
    echo mysqli_error($c1);
    $id = [5,6,7,8,9,10,
        11,12,13,14,15,16,
        17,18,19,20,21,
        22,23,24,25,26,27,
        28,29,30,31,32,33,
        34,35,36,37,38,39,
        40,41,42,43,44,45,
        46,47,48,49,50,51,
        52,53,54,55,56,57,
        58,59,60];
    $name = ['Bilis de dragon','Antorcha','Carne en salazon','Carne en salazon','Bracamante','Martillo enano',
        'Hacha','Manzanas','Antorcha','Bilis de dragon','¡Aaahh, un Caminante Orco!','Ballesta de mano',
        'Daga curva','Hacha','Montones de virotes','Agua','Vista fantasma',
        'Bola de rayos','Daga curva','Curacion','Agua','¡Aaahh, un Caminante Orco!','Rapidez',
        '¡Aaahh, un Caminante Orco!','Antorcha','Arco con pinchos','¡Aaahh, un Caminante Orco!','Escudo nordico','Daga curva',
        'Bola de rayos','Manzanas','Bilis de dragon','Espada nordica','Viento mortal','Bilis de dragon',
        'Ballesta','Escudo nordico','Montones de virotes','Cimitarra','Cota de malla','Escudo',
        'Montones de flechas','Bracamante','Montones de virotes','Armadura de placas','Ballesta de mano','Ballesta de repeticion',
        'Montones de flechas','Hacha de doble filo','Arco largo','Cota de malla','Ballesta de repeticion','Antorcha',
        'Golpe telequinetico','Repeler','Temblor de tierra'];
    $inventory = ['Hand','Hand','Backpack','Backpack','Hand','Hand',
        'Hand','Backpack','Hand','Hand','Zombi','Hand',
        'Hand','Hand','Backpack','Backpack','Hand',
        'Hand','Hand','Hand','Backpack','Zombi','Hand',
        'Zombi','Hand','Hand','Zombi','Hand','Hand',
        'Hand','Backpack','Hand','Hand','Hand','Hand',
        'Hand','Hand','Backpack','Hand','Body','Hand',
        'Backpack','Hand','Backpack','Body','Hand','Hand',
        'Backpack','Hand','Hand','Body','Hand','Hand',
        'Hand','Hand','Hand'];
    $dual = ['','','','',0,0,
        1,'','','','',1,
        1,1,'','',0,
        1,1,0,'','',0,
        '','',0,'',0,1,
        1,'','',0,1,'',
        0,'','',0,'','',
        '',0,'','',1,1,
        '',0,0,'',1,'',
        1,0,0];
    $doors = ['','','','',1,1,
        1,'','','','',0,
        0,1,'','',0,
        0,0,0,'','',0,
        '','',0,'',0,0,
        0,'','',1,0,'',
        0,'','',1,'','',
        '',1,'','',0,0,
        '',1,0,'',0,'',
        1,0,0];
    $noise = ['','','','',0,0,
        0,'','','','',0,
        0,0,'','',1,
        1,0,0,'','',0,
        '','',0,'',0,0,
        1,'','',0,1,'',
        0,'','',0,'','',
        '',0,'','',0,0,
        '',0,0,'',0,'',
        1,1,1];
    $efect = [$bilis,$antorcha,$exp,$exp,'','',
    '',$exp,$antorcha,$bilis,$orco,'VIROTES. 1 accion para recargar(se recarga gratis al final del turno)',
        '+1 dado a otra arma de combate cuerpo a cuerpo','',$montones.'VIROTES',$exp,'ENCANTAMIENTO',
        'HECHIZO DE COMBATE','+1 dado a otra arma de combate cuerpo a cuerpo','ENCANTAMIENTO',$exp,$orco,'ENCANTAMIENTO',
        $orco,$antorcha,'FLECHAS',$orco,'ARMADURA +4. +1 dado a otra arma de combate cuerpo a cuerpo','+1 dado a otra arma de combate cuerpo a cuerpo',
        'HECHIZO DE COMBATE',$exp,$bilis,'+2 dados si tienes equipado un Escudo nordico','HECHIZO DE COMBATE',$bilis,
        'VIROTES','ARMADURA +4. +1 dado a otra arma de combate cuerpo a cuerpo',$montones.'VIROTES','+ dado si tienes equipado una Daga curva','ARMADURA +4',$escudo,
        $montones.'FLECHAS','',$montones.'VIROTES','ARMADURA +3','VIROTES. 1 accion para recargar(se recarga gratis al final del turno)','VIROTES',
        $montones.'FLECHAS','','FLECHAS','ARMADURA +4','VIROTES',$antorcha,
        'HECHIZO DE COMBATE.Gasta una accion para abrir una puerta a tu alcanze y linea de vision','ENCANTAMIENTO','ENCANTAMIENTO'];
    $range = ['','','','','0','0',
        '0','','','','','0-1',
        '0','0','','','',
        '0-2','0','','','','',
        '','','0-1','','','0',
        '0-2','','','0','0-1','',
        '1-2','','','0','','',
        '','0','','','0-1','0-1',
        '','0','1-3','','0-1','',
        '0-1','',''];
    $dices = ['','','','',3,2,
        1,'','','','',2,
        1,1,'','','',
        2,1,'','','','',
        '','',1,'','',1,
        2,'','',1,2,'',
        2,'','',2,'','',
        '',3,'','',2,3,
        '',4,1,'',3,'',
        1,'',''];
    $minimun = ['','','','',4,4,
        4,'','','','',3,
        4,4,'','','',
        4,4,'','','','',
        '','',4,'','',4,
        4,'','',4,5,'',
        4,'','',4,'','',
        '',4,'','',3,5,
        '',5,3,'',5,'',
        4,'',''];
    $damage = ['','','','',1,2,
        1,'','','','',1,
        1,1,'','','',
        1,1,'','','','',
        '','',1,'','',1,
        1,'','',2,2,'',
        2,'','',1,'','',
        '',1,'','',1,1,
        '',2,1,'',1,'',
        1,'',''];
    for ($i=0; $i < count($name); $i++) {
        //Definimos parametros de la consulta
        //La funcion solo admite variables 
        $types = str_repeat("s",11);
        $values = [$id[$i],$name[$i],$inventory[$i],$dual[$i],$doors[$i],$noise[$i],$efect[$i],$range[$i],$dices[$i],$minimun[$i],$damage[$i]];
        mysqli_stmt_bind_param($stmtFinal,$types, ...$values);
        mysqli_stmt_execute($stmtFinal);
    }
    mysqli_stmt_close($stmtFinal);

    mysqli_query($c1,"CREATE TABLE IF NOT EXISTS ZombiesCards (ID INT PRIMARY KEY, NAME VARCHAR(200) NOT NULL, BLUE VARCHAR(200), YELLOW VARCHAR(200), ORANGE VARCHAR(200), RED VARCHAR(200))");
    echo mysqli_error($c1);
    $stmt3="INSERT IGNORE INTO ZombiesCards (ID, NAME, BLUE, YELLOW, ORANGE, RED)values(?,?,?,?,?,?)";
    $stmtFinal=mysqli_prepare($c1, $stmt3);
    echo mysqli_error($c1);
    $id = [1,2,3,4,5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15];
    $names = ['La horda se congrega', 'La horda se congrega', 'La horda se congrega','Ha llegado la horda','Nigromante',
    'La horda se congrega', 'La horda se congrega', 'La horda se congrega',
    'La horda se congrega', 'La horda se congrega', 'La horda se congrega',
    'La horda se congrega', 'La horda se congrega', 'La horda se congrega',
    'La horda se congrega'];
    $blue = ['Todo despejado','1 Caminante','1 Corredor', '','','1 Caminante',
    '1 Caminante',
    '1 Corredor',
    '1 Caminante',
    '2 Caminante',
    '1 Corredor',
    '1 Caminante',
    '1 Corredor',
    '1 Caminante',
    '1 Caminante'];
    $yellow = ['2 Caminante','1 Gordo','2 Caminane', '', '','2 Caminante',
    '2 Caminante',
    '2 Corredore',
    '3 Caminante',
    '2 Gordo',
    '1 Gordo',
    '2 Caminante',
    '1 Caminante',
    '2 Gordo',
    '2 Caminante'];
    $orange = ['2 Gordo','3 Caminante','2 Corredor', '', '','3 Caminante',
    '2 Gordo',
    '3 Caminante',
    '2 Gordo',
    '3 Caminante',
    '2 Caminante',
    '2 Gordo',
    '2 Caminante',
    '3 Caminante',
    '2 Corredore'];
    $red = ['4 Caminante','3 Gordo','1 Abobinacion', '', '','4 Caminante',
    '1 Abominación',
    '4 Caminante',
    '3 Caminante',
    '4 Caminante',
    '2 Corredore',
    '3 Caminante',
    '1 Abominación',
    '4 Caminante',
    '1 Abominación'];
    for ($i=0; $i < count($names); $i++) {
        //Definimos parametros de la consulta
        //La funcion solo admite variables 
        $types = str_repeat("s",6);
        $values = [$id[$i],$names[$i],$blue[$i],$yellow[$i],$orange[$i],$red[$i]];
        mysqli_stmt_bind_param($stmtFinal,$types, ...$values);
        mysqli_stmt_execute($stmtFinal);
    }
    mysqli_stmt_close($stmtFinal);