function isFibo(valueToCheck, previousValue, currentValue) {
    let v = parseInt(valueToCheck);
    // console.log(currentValue);
    return v === currentValue ? true : (v>previousValue)? isFibo(v, currentValue, currentValue+previousValue):false;
}

function printOutput(funcs, start, end){
    var output = "";

    for (var j = start; j <= end; j++) {
        // let f = funcs[j];
        output += funcs[j]() + "\n";
    }

    return output;
}


function doWork(start, end) {
    var funcs = [];

    for (var i = start; i <= end; i++) {
        let v = i ;

        funcs[i] = function() {
            if (v!==end)
            return "Value: " + v ;
            return "";
        };
    }

    return funcs;
}

function manipulateRemoteData(getRemoteDataFn, getErrorDataFn) {
    // Complete this function

    return new Promise((pass, reject) => {
        //fail(getErrorDataFn);;
        let fun =
            function (d,d2) {
                if (d!==null&&Array.isArray(d))
                    pass(d.sort((a,b)=>a-b));
                else {
                    // console.log("r");
                    reject(d2.sort((a,b)=>a-b));

                }
            };
        getRemoteDataFn(fun);


    });
}


let __input_stdin = "3,1,2";
var split = __input_stdin.split(',');


(function d() {
//console.log(   isFibo(6,0,1));
    manipulateRemoteData(function _getRemoteData(callback) {
        setTimeout(function () {
            var split = __input_stdin.split(',');
            if (split[0] === 'ERR') {
                callback(split[1]);
            }

            var input = split.map(function (str) {
                return parseInt(str, 10);
            });
            callback(null, input);
        }, 4);
    }, function _getErrorData(callback) {
        setTimeout(function () {
            var split = __input_stdin.split(',');
            if (split[2] === 'ERR') {
                callback(split[3]);
            }

            var input = split.slice(2)
                .map(function (str) {
                    return parseInt(str, 10);
                });
            callback(null, input);
        }, 4);
    })
        .then(function successFn(resultList) {
            let str = ('SUCCESS');
            resultList.forEach(function (result) {
                str+=(',' + result);
            });
            str+=end();
        }, function failedFn(reasonList) {
            let str = "";
            str+=('FAILED');
            // console.log(reasonList);
            reasonList.forEach(function (reason) {
                str+=(',' + reason);
            });
            console.log(str)
        });


})();