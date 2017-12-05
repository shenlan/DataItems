/*
 * Comments: //
 * Author: guilin.li
 * Time: 2015-04-28 16:44:51
 */
var JClass = require('./JClass');
var Data = require('./data');
var View = require('./view');
var Events = require('./events');

//私有方法代理
//var Proxy = {};
var slice = Array.prototype.slice;
//Controllerler
var Controller = JClass.create();
//初始化
Controller.fn.initialize = function(options){
    //参数扩展
    var configs = $.extend({}, options);
    //创建view 和 data 对象
    var data = new Data(configs.model, configs.tpl);
    var view = new View(configs.tpl, configs.id);

    //执行命令
    this.run = function(args){
        if(args == "config") return configs;
        if(typeof args == "string"){
            var arr = args.split('.');
            var temp = arr[0] == 'data' ? data : view,
                fn = temp[arr[1]];

            if(typeof fn == 'function'){
                return fn.apply(temp, slice.call(arguments, 1));
            }
        }
        throw new Error("error: " + args);
    };
    //初始化
    this.initAll();
};

//初始化参数
Controller.fn.initAll = function(){
    var cfg = this.run('config');
    //最外层绑定DOM元素
    this.container = $("#" + cfg.id);
    //绑定事件
    this.bindEvent();
    //双向绑定
    this.bindTogether();
};

//添加Items对象
Controller.fn.addItems = function(list, idx, isShow){
    var that = this,
        arr = [],
        guids = [],
        cfg = this.run('config');

    if(this.length >= cfg.max){
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
        var dataModel, viewModel, newJson,
            guid = random(),
            index = idx + i;

        if(!$.isPlainObject(json)){
            json = {};
        }

        dataModel = that.run('data.add', guid, json, index);

        newJson = dataModel.toJson();

        viewModel = that.run('view.add', guid, newJson, index, isShow).hide().show(cfg.fadeTime);

        cfg.afterAdd && cfg.afterAdd.call(viewModel, newJson);

        that.splice(index, 0, guid);

        guids.push(guid);
    });

    return guids;
};
//编辑
Controller.fn.edit = function(guid, data){
    var idx = this.getIndexByGuid(guid);

    if(idx > -1){
        var model = this.run('data.getByIndex', idx);
        var view = this.run('view.edit', idx, model.toJson());
    }
};
//保存
Controller.fn.save = function(guid, data){
    var idx = this.getIndexByGuid(guid),
        cfg = this.run('config');

    if(idx > -1){
        var view = this.run('view.getByIndex', idx);
        var data = this.run('data.getByIndex', idx).toJson();
        cfg.beforeSave && cfg.beforeSave.call(view, data);
    }
};
//更新数据
Controller.fn.updateItem = function(guid, data){
    var idx = this.getIndexByGuid(guid);
    var view = this.getViewByGuid(guid);
    this.run('data.update', idx, data);
    this.run('view.updateAll', view, data);
};
//复制数据
Controller.fn.clone = function(guid){
    var idx = this.getIndexByGuid(guid);
    var model = this.run('data.getByIndex', idx);

    this.addItems(model.toJson(), idx);
};
//删除单条数据
Controller.fn.removeItem = function(guid){
    var that = this,
        ret = false,
        idx = -1,
        cfg = that.run('config');

    if(cfg.min >= that.length){
        return ret;
    }

    idx = that.getIndexByGuid(guid);

    if(idx > -1){
        var view = that.run('view.getByIndex', idx);
        var data = that.run('data.getByIndex', idx).toJson();
        
        if(cfg.beforeRemove && cfg.beforeRemove.call(view, data) === false){
            ret = false;
        }else{
            that.run('data.remove', idx);
            that.run('view.remove', idx);
            that.splice(idx, 1);
            ret = true;
            cfg.afterRemove && cfg.afterRemove.call(view, data);
        }
    }
    return ret;
};
//删除所有
Controller.fn.removeAll = function(isClear){
    var that = this,
        cfg = that.run('config'),
        start = cfg.min,
        len = that.length;

    start = isClear ? 0 : start;

    that.run("data.remove", start, len);
    that.run("view.remove", start, len);
    that.splice(start, len);
};
//重置数据为空
Controller.fn.resetItem = function(guid){
    var idx = this.getIndexByGuid(guid);

    if(idx > -1){
        var model = this.run('data.reset', idx);
        this.run('view.reset', idx, model.toJson());
    }
};
//重置所有数据为空
Controller.fn.resetAll = function(){
    var that = this;
    this.each(function(i){
        var model = that.run('data.reset', i);
        that.run('view.reset', i, model.toJson());
    });
};
//获取所有的数据对象
Controller.fn.getAllItems = function(){
    return this.run('data.getAll');
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

    return this.run('view.getByIndex', idx);
};

//更换模板
Controller.fn.changeTemplate= function(tpl){
    var _json = this.getAllItems();

    this.removeAll(true);

    this.run('data.changeModel', null, tpl);
    this.run('view.changeTemplate', tpl);

    _json.length && this.addItems(_json);
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
            view = me.closest('[data-ubind]'),
            guid = me.closest('[data-ubind]').data('ubind'),
            index = that.getIndexByGuid(guid);

        if(me.attr('type') == 'checkbox'){
            val = view.find('[data-dbind='+ name +']:checked').map(function(){return $(this).val();}).get();
        }
            
        temp[name] = val;

        that.run('data.update', index, temp);
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
    return Math.round((new Date()).getTime() * 1e4 + Math.random() * 1e6);
};

module.exports = Controller;