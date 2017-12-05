/*
 * Comments: //页面绑定的事件操作
 * Author: guilin.li
 * Time: 2015-04-28 10:49:39
 */
var Hooks = {
	"append": function(data){
		this.addItems(data, this.length);
	},
    "prepend": function(data){
        this.addItems(data, 0);
    },
    "remove": function(data, guid){
        this.removeItem(guid)
    },
    "clone": function(data, guid){
        this.clone(guid);
    },
    "edit": function(data, guid){
        this.edit(guid);
    },
    "save": function(data, guid){
        this.save(guid);
    },
    "reset": function(data, guid){
        this.resetItem(guid);
    },
    "removeAll": function(){
        this.removeAll();
    },
    "resetAll": function(){
        this.resetAll();
    }
};

module.exports.push = function(name, fun){
	if(typeof fun === "function"){
		Hooks[name] = fun;
	}
};

module.exports.get = function(name){
	return Hooks[name] || $.noop;
};