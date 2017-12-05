/*
 * Comments: //
 * Author: guilin.li
 * Time: 2015-04-28 10:49:39
 */
var JClass = require('./JClass');
var DataModelFactory = require('./model/data');//model工厂

var Data = JClass.create();

Data.fn.initialize = function(modelFormat, viewTpl){

    if(!$.isPlainObject(modelFormat)){
        modelFormat = getModelFormat(viewTpl);
    }

    this.CreateModel = DataModelFactory(modelFormat);
};

//更换创建model方法
Data.fn.changeModel = Data.fn.initialize;

//添加数据
Data.fn.add = function(guid, json, index){
    var model = new this.CreateModel(guid, json, index);

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
