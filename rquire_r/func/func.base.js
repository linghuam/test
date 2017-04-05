
define("func/base",[
	"leaflet",
    "core/namespace"
],function(L){

	/*功能类
	*使用方法
	1、添加一个功能
	L.ICT.Func.add("功能名称",{
		Class:L.Class.extend({
		   start:function(){} //重写start方法
		   stop:function(){} //重写stop方法
	       ...其它自定义方法
		})
	});
	2、运行功能
	L.ICT.Func["功能名称"].run();
	3、关闭功能
	L.ICT.Func["功能名称"].close();
	*/
	L.ICT.Func.add = function(name,obj){
       if(typeof obj === "undefined") obj = name;
       try{
       	   var func = L.Util.extend(new function(){},L.Mixin.Events,{

	       	   run:function(){
	              this._getInstance(arguments).start();
	              return this._instance;
	           },

	           close:function(){
                  this._getInstance().stop();
                  return this._instance;
	           },
               
               getInstance:function(){
               	  return  this._getInstance(arguments);
               },

	           _getInstance:function(args){
	              if(!this._instance)
	              	this._instance = this._createInstance(args || []);
	              return this._instance;
	           },

	           _createInstance:function(args){	           	
	           	  if(args.length > 0){  
	           	  	  var params = args;
	           	  	  switch (params.length){
                         case 1: return new this.Class(params[0]); break;
                         case 2: return new this.Class(params[0],params[1]); break;
                         case 3: return new this.Class(params[0],params[1],params[2]); break;
                         //由于不知道每个具体类构造函数参数个数，为了在每个类的构造函数内部不再单独解析arguments对象，默认传递10个参数，若参数不存在，传递的值为undefined。
                         default: return new this.Class(params[0],params[1],params[2],params[3],params[4],params[5],params[6],params[7],params[8],params[9]);
	           	  	  }
	           	  }else{
	           	  	return new this.Class();
	           	  }	              
	           }

           },obj);

       }catch(e){
       	  console.log("创建功能出错："+e.message);
       }   

       if(typeof name === "string") L.ICT.Func[name] = func;       
       return func;
	};

   return null;

});

