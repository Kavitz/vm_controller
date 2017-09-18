var express = require('express');
var app = express();
//var myPythonScriptPath = 'script.py';

// Use python shell
var PythonShell = require('python-shell');
//var pyshell = new PythonShell(myPythonScriptPath);
var shell = require('shelljs');

app.use(express.static(__dirname + '/'));
app.get('/runPythonScript',function(req,res){	
	PythonShell.run('script.py', function (err, results) {
  if (err) throw err;
  console.log('result: %j', results);
  res.json(results);
	});

	// end the input stream and allow the process to exit
	// pyshell.end(function (err) {
	//     if (err){
	//         throw err;
	//     };
	//     console.log('finished');
	// });			   		
});

app.get('/runShellScript',function(req,res){	
	if (!shell.which('git')) {
	  shell.echo('Sorry, this script requires git');
	  shell.exit(1);
	}
	const exec = require('child_process').exec;
	var yourscript = exec('sh test.sh',
		(error, stdout, stderr) => {
			var result = `${stdout}`;
	    console.log(`${stdout}`);
	    res.json(result);
	    console.log(`${stderr}`);
	    if (error !== null) {
	        console.log(`exec error: ${error}`);
	    }
	});   		
});

app.listen(3000);
console.log("server running on 3000");
