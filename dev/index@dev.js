
;(function(__context){
    var module = {
        id : "67e950007cef71239228cdcac801f73c" ,
        filename : "JClass.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    exports.create = function(parent) {

    var JClass = function() {
        if (this.initialize) {
            this.initialize.apply(this, arguments);
        }
    };

    if (parent) {
        var subclass = function() {};

        subclass.prototype = parent.prototype;
        JClass.prototype = new subclass;
        JClass.prototype._supper = parent.prototype;
    }

    JClass.fn = JClass.prototype;
    JClass.fn.constructor = JClass;

    return JClass;
};

    })( module.exports , module , __context );
    __context.____MODULES[ "67e950007cef71239228cdcac801f73c" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "b8596fb4ebe826290f7e21db74077e40" ,
        filename : "data.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /*
 * Comments: //数据model对象工厂
 * Author: guilin.li
 * Time: 2015-04-28 10:50:26
 */
var DataModelFactory = function(modelFormat ){

    if(!$.isArray(modelFormat)) return;

    var modelTemp = {};

    var model = function(guid, json, index){
        var _data = {"guid": guid, "index": index};

        this.getter = function(name){
            return _data[name];
        };
        this.setter = function(name, value){
            _data[name] = value;
        };
        this.toJson = function(){
            var temp = {};
            for(var p in _data){
                temp[p] = _data[p];
            }
            return temp;
        };
        for(var p in modelTemp){
            if(p != 'guid' && p != 'index'){
                this.setter(p, json[p]);
            }
        }
    };

    model.prototype.guid = function(){
        return this.getter.call(this, 'guid');
    };

    model.prototype.index = function(){
        return this.getter.call(this, 'index');
    };

    for(var i = 0, l = modelFormat.length; i < l ; i++){
        var p = modelFormat[i];

        modelTemp[p] = undefined;

        model.prototype[p] = (function(t){
            return function(n){
                if(n){
                    return this.setter.call(this, t, n[0]);
                }
                return this.getter.call(this, t);
            };
        }(p));
    }

    return model;
};

module.exports = DataModelFactory;

    })( module.exports , module , __context );
    __context.____MODULES[ "b8596fb4ebe826290f7e21db74077e40" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "5d31359d662aed3f23916e3e9168061e" ,
        filename : "data.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /*
 * Comments: //
 * Author: guilin.li
 * Time: 2015-04-28 10:49:39
 */
var JClass =__context.____MODULES['67e950007cef71239228cdcac801f73c'];
var DataModelFactory =__context.____MODULES['b8596fb4ebe826290f7e21db74077e40']//model工厂

var Data = JClass.create();
var CreateModel;

Data.fn.initialize = function(modelFormat, viewTpl){

    if(!$.isPlainObject(modelFormat)){
        modelFormat = getModelFormat(viewTpl);
    }

    CreateModel = DataModelFactory(modelFormat);
};

//添加数据
Data.fn.add = function(guid, json, index){
    var model = new CreateModel(guid, json, index);

    this.splice(index, 0, model);

    this.updateIndex(index);

    return model;
};

Data.fn.updateIndex = function(index){
    this.each(function(i, obj){
        obj.index([i]);
    }, index);
};

//删除数据
Data.fn.remove = function(index, len){
    var model = this.splice(index, len || 1);

    this.updateIndex(index);

    return model;
};

//更新数据
Data.fn.update = function(index, newData){
    var obj = this[index];

    if(obj){
        for(var p in newData){
            var fn = obj[p];
            fn && fn.call(obj, [ newData[p] ]);
        }
    }
    return obj;
};
//根据index获取Data
Data.fn.getByIndex = function(index){
    if(index > -1 && index < this.length){
        return this[index];
    }
};
//清空某个数据对象
Data.fn.reset = function(index){
    var obj = this[index];

    if(obj){
        for(var p in obj){
            if(p != 'index' && p !="guid"){
                var fn = obj[p];
                fn && fn.call(obj, [ undefined ]);
            }
        }
    }
    return obj;
};

//获取所有Data
Data.fn.getAll = function(){
    var list = [];

    this.each(function(idx, obj){
        list.push($.extend({}, obj.toJson()));
    });

    return list;
};

//循环
Data.fn.each = function(cb, start, end){
    for(var i = start || 0, l = end || this.length; i < l; i++){
        cb && cb(i, this[i]);
    }
};

//转为类数组
Data.fn.length = 0;
Data.fn.splice = Array.prototype.splice;
Data.fn.slice = Array.prototype.slice;

function getModelFormat(viewTpl){
    var arr, tpl = "";
    if(viewTpl.render){
        tpl = viewTpl.render({});
    }else if(typeof viewTpl == "string"){
        tpl = viewTpl;
    }

    arr = $.unique(tpl.match(/data-dbind=\"(.*?)\"/gm));

    return $.map(arr, function(str){
        return str.match(/data-dbind=\"(.*?)\"/)[1];
    });
}

module.exports = Data;


    })( module.exports , module , __context );
    __context.____MODULES[ "5d31359d662aed3f23916e3e9168061e" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "8224184e051dc90918d68c56fd511a96" ,
        filename : "view.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /*
 * Comments: //
 * Author: guilin.li
 * Time: 2015-04-28 14:59:10
 */

var JClass =__context.____MODULES['67e950007cef71239228cdcac801f73c'];

var View = JClass.create();

View.fn.initialize = function(tpl, id){
    this.template = tpl;
    //最外层绑定DOM元素
    this.container = $("#" + id);
    //获取添加item的dom容器id
    this.itembox = this.container.data('cbind');
    //获取添加item的dom容器
    if(this.itembox){
        this.itembox = $("#" + this.itembox);
    }
};

//添加View
View.fn.add = function(guid, data, index){
    var that = this,
        html = that.template,
        $view = $(html).attr('data-ubind', guid);

    if(index == 0){
        that.itembox.prepend($view);
    }else if(index >= that.length){
        that.itembox.append($view);
    }else if(index > 0 && index < that.length){
        var temp = that.getByIndex(index-1);
        temp.length && $view.insertAfter(temp);
    }

    for(var key in data){
        that.update($view, key, data[key]);
    }

    that.splice(index, 0, $view);
    
    that.updateIndex(index);

    return $view;
};

//更新索引显示
View.fn.updateIndex = function(index){
    var that = this;

    that.each(function(i, obj){
        that.update(obj, 'index', i);
    }, index);
};

//根据index获取View
View.fn.getByIndex = function(index){
    if(index > -1 && index < this.length){
        return this[index];
    }
};

//更新View显示
View.fn.update = function(view, name, val){
    var dom = view.find('[data-dbind="'+ name +'"]');

    if(name == "index") val += 1;

    dom.each(function(){
        if(/(select|input|textarea)/gi.test(this.tagName)){
            if(this.type != 'checkbox'){
                val = [ val ];
            }
            dom.val(val || []);
        }else{
            dom.text( val );
        }
    });
};
//更新整条数据
View.fn.updateAll = function(view, data){
    for(var key in data){
        this.update(view, key, data[key]);
    }
};

//删除View
View.fn.remove = function(index, len){
    var view = this.splice(index, len || 1);
    this.updateIndex(index);
    return $.each(view,function(i, item){
        item.remove();
    });
};

//重置View
View.fn.reset = function(index, newData){
    var view = this.getByIndex(index);
    for(var key in newData){
        this.update(view, key, newData[key]);
    }
};


//循环
View.fn.each = function(cb, start, end){
    for(var i = start || 0, l = end || this.length; i < l; i++){
        cb && cb(i, this[i]);
    }
};

//转为类数组
View.fn.length = 0;
View.fn.splice = Array.prototype.splice;
View.fn.slice = Array.prototype.slice;

module.exports = View;

    })( module.exports , module , __context );
    __context.____MODULES[ "8224184e051dc90918d68c56fd511a96" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "75c2ca6772bbf06cd6053622305dbeb2" ,
        filename : "events.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

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
    	var item = this.getViewByGuid(guid);

		if(this.beforeRemove){
			this.beforeRemove.call(item) && this.removeItem(guid) && this.afterRemove && this.afterRemove.call(item);
		}else{
            this.removeItem(guid) && this.afterRemove && this.afterRemove.call(item);
        }
    },
    "clone": function(data, guid){
        this.clone(guid);
    },
    "reset": function(data, guid){
        this.resetItem(guid);
    },
    "removeAll": function(){
        this.removeAll();
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

    })( module.exports , module , __context );
    __context.____MODULES[ "75c2ca6772bbf06cd6053622305dbeb2" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "b18730681ffc68abb30cdfad56a63b69" ,
        filename : "control.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /*
 * Comments: //
 * Author: guilin.li
 * Time: 2015-04-28 16:44:51
 */
var JClass =__context.____MODULES['67e950007cef71239228cdcac801f73c'];
var Data =__context.____MODULES['5d31359d662aed3f23916e3e9168061e'];
var View =__context.____MODULES['8224184e051dc90918d68c56fd511a96'];
var Events =__context.____MODULES['75c2ca6772bbf06cd6053622305dbeb2'];

//事件订阅发布
var pubSub  = $({});
//私有方法代理
var Proxy = {};
var slice = Array.prototype.slice;
var configs = {};
//Controllerler
var Controller = JClass.create();
//初始化
Controller.fn.initialize = function(options){
    //参数扩展
    configs = $.extend(configs, options);
    //创建view 和 data 对象
    var data = new Data(configs.model, configs.tpl);
    var view = new View(configs.tpl, configs.id);
    //执行命令
    Proxy.run = function(fnName){
        if(typeof fnName == "string"){
            var arr = fnName.split('.');
            var obj = arr[0] == 'data' ? data : view,
                fn = obj[arr[1]];

            if(typeof fn == 'function'){
                return fn.apply(obj, slice.call(arguments, 1));
            }
        }
        throw new Error("error: " + fnName);
    };
    //初始化
    this.initAll();
};

//初始化参数
Controller.fn.initAll = function(){
    //最外层绑定DOM元素
    this.container = $("#" + configs.id);
    //绑定事件
    this.bindEvent();
    //双向绑定
    this.bindTogether();
};

//添加Items对象
Controller.fn.addItems = function(list, idx){
    var that = this,
        arr = [],
        guids = [];

    if(this.length >= configs.max){
        return false;
    }
   
    arr = $.makeArray(list);

    if(arr.length === 0){
        arr.push({});
    }

    if(typeof idx !== 'number'){
        idx = this.length;
    }

    idx = idx >> 0;
    idx++;
    if(idx > this.length){
        idx = this.length;
    }

    $.each(arr, function(i, json){
        var dataModel, viewModel,
            guid = random(),
            index = idx + i;

        if(!$.isPlainObject(json)){
            json = {};
        }

        dataModel = Proxy.run('data.add', guid, json, index);

        json = dataModel.toJson();

        viewModel = Proxy.run('view.add', guid, json, index).hide().show(configs.fadeTime);

        configs.afterAdd && configs.afterAdd.call(viewModel, json);

        that.splice(index, 0, guid);
        guids.push(guid);
    });

    return guids;
};
//更新数据
Controller.fn.updateItem = function(guid, data){
    var idx = this.getIndexByGuid(guid);
    var view = this.getViewByGuid(guid);
    Proxy.run('data.update', idx, data);
    Proxy.run('view.updateAll', view, data);
};
//复制数据
Controller.fn.clone = function(guid){
    var idx = this.getIndexByGuid(guid);
    var model = Proxy.run('data.getByIndex', idx);

    this.addItems(model.toJson(), idx);
};
//删除单条数据
Controller.fn.removeItem = function(guid){
    var that = this,
        ret = false,
        idx = -1;

    if(configs.min > that.length){
        return ret;
    }

    idx = that.getIndexByGuid(guid);

    if(idx > -1){
        Proxy.run('data.remove', idx);
        Proxy.run('view.remove', idx);
        that.splice(idx, 1);
        ret = true;
    }
    return ret;
};
//删除所有
Controller.fn.removeAll = function(){
    var that = this,
        start = configs.min - 1,
        len = that.length;

    Proxy.run("data.remove", start, len);
    Proxy.run("view.remove", start, len);
    that.splice(start, len);
};
//重置数据为空
Controller.fn.resetItem = function(guid){
    var idx = this.getIndexByGuid(guid);

    if(idx > -1){
        var model = Proxy.run('data.reset', idx);console.log(model.toJson());
        Proxy.run('view.reset', idx, model.toJson());
    }
};
//获取所有的数据对象
Controller.fn.getAllItems = function(){
    return Proxy.run('data.getAll');
};
//根据guid获取index
Controller.fn.getIndexByGuid = function(guid){
    var idx = -1;

    if(guid){
        this.each(function(i, obj){
            if(obj == guid) idx = i;
        });
    }
    return idx;
};
//根据guid获取view
Controller.fn.getViewByGuid = function(guid){
    var idx = this.getIndexByGuid(guid);

    return Proxy.run('view.getByIndex', idx);
};

//绑定事件委托
Controller.fn.bindEvent = function(){
    var that = this;

    that.container.on("click", "[data-ebind]", function(evt){
        evt.preventDefault();

        var me = $(this),
            data = me.data(),
            guid = me.closest('[data-ubind]').data('ubind');

        Events.get(data.ebind).call(that, data, guid);
    });
};
//View数据变化时，更新data
Controller.fn.bindTogether = function(){
    var that = this;

    that.container.on('change keyup blur', '[data-dbind]', function(evt){
        var temp = {},
            me = $(this),
            val = me.val(),
            name = me.data('dbind'),
            guid = me.closest('[data-ubind]').data('ubind'),
            index = that.getIndexByGuid(guid);

        if(me.attr('type') == 'checkbox'){
            val = item.find('[data-dbind='+ name +']:checked').map(function(){return this.value;}).get();
        }
            
        temp[name] = val;

        Proxy.run('data.update', index, temp);
    });
};
//循环
Controller.fn.each = function(cb){
    for(var i = 0; i < this.length; i++){
        cb && cb(i, this[i]);
    }
};

//转类数组
Controller.fn.length = 0;
Controller.fn.splice = Array.prototype.splice;

function random(){
    return Math.round((new Date()).getTime() + Math.random() * 1e13);
};

module.exports = Controller;

    })( module.exports , module , __context );
    __context.____MODULES[ "b18730681ffc68abb30cdfad56a63b69" ] = module.exports;
})(this);


;(function(__context){
    var module = {
        id : "057d8525843632b91642b754e10dec8a" ,
        filename : "index.js" ,
        exports : {}
    };
    if( !__context.____MODULES ) { __context.____MODULES = {}; }
    var r = (function( exports , module , global ){

    /*
 * Comments: //
 * Author: guilin.li
 * Time: 2015-04-27 20:00:13
 */
var JClass =__context.____MODULES['67e950007cef71239228cdcac801f73c'];
var Control =__context.____MODULES['b18730681ffc68abb30cdfad56a63b69'];
var DataItem = JClass.create();

//默认参数
var configs = {
    id: 'body',
    max: 1E4,
    min: 0,
    fadeTime: 100,
    afterAdd: null, //function
    beforeRemove: null, //function
    afterRemove: null //function
};

DataItem.fn.initialize = function(opt){
    //参数扩展
    configs = $.extend(configs, opt);

    var control = new Control(configs);
    var slice = Array.prototype.slice;
    
    this.control = function(act){
        var fn = control[act];
        if(typeof fn == 'function'){
            return fn.apply(control, slice.call(arguments, 1));
        }
    };
};

DataItem.fn.add = function(list){
    this.control('addItems', list);
};

DataItem.fn.update = function(gui, data){
    this.control('updateItem', gui, data);
};

DataItem.fn.getAll = function(){
    return this.control('getAllItems');
};

DataItem.fn.remove = function(guid){
    return this.control('removeItem', guid);
};

DataItem.fn.removeAll = function(){
    return this.control('removeAll');
};

global.DataItems = DataItem;
module.exports = DataItem;


    })( module.exports , module , __context );
    __context.____MODULES[ "057d8525843632b91642b754e10dec8a" ] = module.exports;
})(this);
