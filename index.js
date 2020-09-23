function ChunkArray(myArray, chunk_size){
    var results = [];
    while (myArray.length) {
        results.push(myArray.splice(0, chunk_size));
    }
    return results;
}


var $lvIncline = lvovich.inclineLastname;                      // inclineFirstname inclineLastname inclineMiddlename
var $nIncline = function(name, dec){
    let rn = new RussianName(name, '', '');
    return rn.lastName(dec)                                    //firstName lastName middleName
};


let decMap = {
    Nom:{
        $lv:'nominative',
        $n:RussianName.prototype.gcaseNom
    },
    Gen:{
        $lv:'genitive',
        $n:RussianName.prototype.gcaseGen
    },
    Dat:{
        $lv:'dative',
        $n:RussianName.prototype.gcaseDat
    },
    Acc:{
        $lv:'accusative',
        $n:RussianName.prototype.gcaseAcc
    },
    Ins:{
        $lv:'instrumental',
        $n:RussianName.prototype.gcaseIns
    },
    Pos:{
        $lv:'prepositional',
        $n:RussianName.prototype.gcasePos
    }
};


var DeclinationMatcher = async function(name){
    let result = {};
    for(let dec in decMap){
        let lvovichRes = $lvIncline(name, decMap[dec].$lv);
        let nameRes = $nIncline(name, decMap[dec].$n);
        if(lvovichRes === nameRes)
            result[dec] = lvovichRes;
        else {
            //console.info(`Conflict in name ${name} for ${dec} declination: ${lvovichRes} or ${nameRes}`);
            await $.ajax({
                url:'declinationControl.php',
                type:'get',
                dataType:'json',
                data:{
                    name,
                    dec
                }
            })
                .then(function (res) {
                    if(res.decName === lvovichRes){
                        result[dec] = lvovichRes;
                        //console.info(`Conflict solved with ${res.decName}`);
                    }
                    else if (res.decName === nameRes){
                        result[dec] = nameRes;
                        //console.info(`Conflict solved with ${res.decName}`);
                    }
                    else{
                        result[dec] = '';
                        //console.error(`Fatal conflict in name ${name} for ${dec} declination with ${res.decName}`);
                    }
                })
                .catch(function (error) {
                    result[dec] = 'conflict';
                    //console.error(`Error in control ajax: ${error}`);
                    throw (`Error in control ajax: ${error}`)
                });
        }
    }
    return result;
};



var DeclinationConstructor = async function(){
    let decTable = [];
    for(let i in table) {
		

		console.log(i);
		
        let row = await DeclinationMatcher(table[i].value);
        row.id = table[i].id;
        decTable.push(row)
    }
    return decTable;
};


var DBSave = function(table){
    let promises = [];
    for(let chunk of table)
        promises.push(
            $.ajax({
                url:'dbSaver.php',
                type:'post',
                dataType:'json',
                data:{
                    table: chunk
                }
            })
        );

    Promise.all(promises)
        .then(function (res) {
            console.info(`Saving complete. ${Math.floor((Date.now() - start)/1000)} sec`);
        })
        .catch(function (error) {
            console.error(`Saving error: ${error}`);
        });
};


var start = Date.now();
console.info(`Starting in ${Date(start)}`);
DeclinationConstructor()
    .then(function (res) {
        console.info(`Building done. ${Math.floor((Date.now() - start)/1000)} sec`);
        DBSave(ChunkArray(res, 100));
    })
    .catch(function (error) {
        console.error(error);
    });


