import db from '../config/database'


function format(args, argv) {
	let pos = 0;
	while((pos = args.indexOf('?')) !== -1)  {
		console.log("sbsbsb", pos)
		let arg = argv.shift()
		let newArgs = args.slice(0, pos);
		newArgs += arg;
		console.log(newArgs);
		newArgs += args.slice(pos + 1, args.length);
		console.log(newArgs);
		args = newArgs;
	}
	return args;
}

var getBate = function (state = false, sql) {  //下级找上级找到总代理为止
	return (cate,  a = 0, count) => {
		let sql
		if(state == false){
		    sql = "select * from t_agent where accounts=${a}"
		} else {
			let value = []
			value.push(a);
			sql = format(sql, $value);
		}

		try {
	   		console.log(sql)
	    	let bateInfo = await db.query(sql)
	    	if (bateInfo.length > 0) {
	    		if (bateInfo[0]['agencylv'] !== 100) {
	    			count ++
	    			cate = bateInfo
	    			callee(cate, bateInfo[0]['referrer'], count)
	    		}
	    	}
	  	} catch (err) {
	    	console.log(`search t_agent ${err}`)
	 	}
	}
}

export default {
  format,
  getBate
}

