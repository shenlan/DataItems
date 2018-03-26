/*
 * Comments: //
 * Author: guilin.li
 * Time: 2015-04-28 14:59:10
 */

var JClass = require('./JClass');

var View = JClass.create();

View.fn.initialize = function(tpl, id){
    this.template = tpl || '';
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
View.fn.add = function(guid, data, index, isShow){
    var that = this,
        html = that.render(data),
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
        that.update($view, key, data[key], isShow);
    }

    that.splice(index, 0, $view);
    
    that.updateIndex(index);

    if(isShow == true){
        $view.find('[data-ebind="reset"]').remove();
    }else{
        $view.find('[data-ebind="edit"]').remove();
    }

    return $view;
};


//修改View
View.fn.edit = function(index, data){
    var view = this.getByIndex(index);

    this.remove(index);

    return this.add(data.guid, data, index);
}

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
View.fn.update = function(view, name, val, isShow){
    var that = this;
    var dom = view.find('[data-dbind="'+ name +'"]');

    if(name == "index") val += 1;

    if($.isPlainObject(val)){
        val = JSON.stringify(val);
    }

    if(isShow == true){
        that.replaceWith(dom, val);
    }else{
        dom.each(function(){
            var me = $(this),
                tagName = this.tagName && this.tagName.toLowerCase();

            if(/(select|input|textarea)/gi.test(tagName)){
                if(this.type == 'checkbox' || this.type == 'radio'){
                    val = $.makeArray(val);
                }
                me.val(val);
            }else{
                me.text( val );
            }
        });
    }
};
//更新整条数据
View.fn.updateAll = function(view, data){
    for(var key in data){
        this.update(view, key, data[key]);
    }
};
//更新整条展示
View.fn.replaceWith = function(dom, val){
    var txt;

    dom.each(function(){
        var me = $(this),
            rme = me,
            tagName = this.tagName && this.tagName.toLowerCase();

        switch (tagName){
            case "input":
                if(/(text|password|hidden)/gi.test(this.type)){
                    txt = val;
                    break;
                }else if(/(radio|checkbox)/gi.test(this.type)){
                    var v = me.val();
                    val = $.makeArray(val);
                    rme = me.parent();
                    v = isNaN(v) ? v : v >> 0;
                    txt = $.inArray(v, val) > -1 && rme.text() || '';
                    break;
                }
            case "select":
                txt = dom.find('option[value="'+ val +'"]').text();
                break;
            case "textarea":
                txt = val;
                break;
            default:
                dom.text( val );
                return;
        }

        if(txt == undefined && txt == null){
            txt = "";
        }

        rme.replaceWith(txt + '');
    });
}
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

View.fn.render = function(data){
    if(this.template.render){
        return this.template.render(data);
    }else{
        return this.template.toString().replace(/\{\{(\w+)\}\}/g, function(m, key){
            return data[key] || '';
        });
    }
}

//循环
View.fn.each = function(cb, start, end){
    for(var i = start || 0, l = end || this.length; i < l; i++){
        cb && cb(i, this[i]);
    }
};

//更换模板
View.fn.changeTemplate= function(tpl){
    this.template = tpl || '';
};

//转为类数组
View.fn.length = 0;
View.fn.splice = Array.prototype.splice;
View.fn.slice = Array.prototype.slice;

module.exports = View;