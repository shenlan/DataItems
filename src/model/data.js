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