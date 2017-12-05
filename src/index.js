/*
 * Comments: //
 * Author: guilin.li
 * Time: 2015-04-27 20:00:13
 */
var JClass = require('./JClass');
var Control = require('./control');
var DataItem = JClass.create();

DataItem.fn.initialize = function(opt){
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
    //参数扩展
    configs = $.extend(configs, opt);

    var control = new Control(configs);
    var slice = Array.prototype.slice;
    
    this.run = function(act){
        var fn = control[act];
        if(typeof fn == 'function'){
            return fn.apply(control, slice.call(arguments, 1));
        }
    };
};

DataItem.fn.show = function(list){
    this.run('addItems', list, null, true);
};

DataItem.fn.add = function(list){
    this.run('addItems', list);
};

DataItem.fn.update = function(gui, data){
    this.run('updateItem', gui, data);
};

DataItem.fn.getAll = function(){
    return this.run('getAllItems');
};

DataItem.fn.remove = function(guid){
    return this.run('removeItem', guid);
};

DataItem.fn.removeAll = function(){
    return this.run('removeAll');
};

DataItem.fn.changeTemplate = function(tpl){
    return this.run('changeTemplate', tpl);
};

global.DataItems = DataItem;
module.exports = DataItem;
