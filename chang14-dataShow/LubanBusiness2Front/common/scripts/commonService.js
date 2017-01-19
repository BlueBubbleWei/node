'use strict';

app.service('commonService', function ($http, $q) {
    
    var url = "http://"+dbPort+"/rest/";

    /**
     * [testApi get-jquery-版本]
     * @param  {[type]} param [description]
     * @return {[type]}       [description]
     */
    this.testApi = function(param){
        // param = JSON.stringify(param);
        var delay = $q.defer();
        $.ajax({
            type: "GET",
            url: url+'feedback/problem/attach/'+param,
            contentType:'application/json;',
            success: function(data){
                delay.resolve(data);
            },
            error:function(error){
                delay.reject(JSON.parse(error.responseText));
            }
        });
        return delay.promise;
    }

    /**
     * [testApi1 get-$http-版本]
     * @param  {[type]} param [description]
     * @return {[type]}       [description]
     */
    this.testApi1 = function(param){
        alert('1');
        // param = JSON.stringify(param);
        var delay = $q.defer();
        var url_join = url+'feedback/problem/attach/'+param;
        $http.get(url_join).success(function(data){
            delay.resolve(data)
        }).error(function(err){
            delay.reject(err)
        });
        return delay.promise;
    };
    //产品列表
    this.producturl=function () {
        var delay = $q.defer();
        var url_join = url+'/enterprise/list/queryClientIdList';
        $http.get(url_join,{'withCredentials':true}).success(function(data){
            delay.resolve(data)
        }).error(function(err){
            delay.reject(err)
        });
        return delay.promise;
    };
    //日均访问量
    this.dailylonline = function (param) {
        var delay = $q.defer();
        var url_join = url+'analysis/loginlog/daily/user/average/'+param.timestamp+'/'+param.pids;
        $http.get(url_join,{'withCredentials':true}).success(function(data){
            delay.resolve(data)
        }).error(function(err){
            delay.reject(err)
        });
        return delay.promise;
    };
    //每日最高访问量
    this.dailyonlinemax=function (param) {
        var delay = $q.defer();
        var url_join = url+'analysis/loginlog/daily/user/max/'+param.dailymax;
        $http.get(url_join,{'withCredentials':true}).success(function(data){
            delay.resolve(data)
        }).error(function(err){
            delay.reject(err)
        });
        return delay.promise;
    };
    //累计装机量
    this.countdowning=function () {
        var delay = $q.defer();
        var url_join = url+'analysis/loginlog/daily/client/inclement';
        $http.get(url_join,{'withCredentials':true}).success(function(data){
            delay.resolve(data)
        }).error(function(err){
            delay.reject(err)
        });
        return delay.promise;
    };
    //累计访问人数
    this.countuser=function () {
        var delay = $q.defer();
        var url_join = url+'analysis/loginlog/daily/user/inclement';
        $http.get(url_join,{'withCredentials':true}).success(function(data){
            delay.resolve(data)
        }).error(function(err){
            delay.reject(err)
        });
        return delay.promise;
    };
    //在线用户
    this.onlineuser=function () {
        var delay = $q.defer();
        var url_join = url+'analysis/online/user_current';
        $http.get(url_join,{'withCredentials':true}).success(function(data){
            delay.resolve(data)
        }).error(function(err){
            delay.reject(err)
        });
        return delay.promise;
    }
    //今日累计登录
    this.todayTotal=function () {
        var delay = $q.defer();
        var url_join = url+'analysis/loginlog/daily/user/logintimes';
        $http.get(url_join,{'withCredentials':true}).success(function(data){
            delay.resolve(data)
        }).error(function(err){
            delay.reject(err)
        });
        return delay.promise;
    }

    //功能分析-查询功能列表
    this.functionList = function(params){
        var delay = $q.defer();
        var url_join = url + 'function/analysis/functionList';
        $http.post(url_join,params,{'withCredentials':true}).success(function(data){
            delay.resolve(data);
        }).error(function(error){
            delay.error(error);
        })
        return delay.promise;
    }
    //功能分析-置顶制底设置
    this.functionStatus = function(params){
        var delay = $q.defer();
        var url_join = url + 'function/analysis/functionStatus';
        $http.post(url_join,params,{'withCredentials':true}).success(function(data){
            delay.resolve(data);
        }).error(function(error){
            delay.error(error);
        })
        return delay.promise;
    }
    //功能分析-查询功能每日使用次数
    this.functionDetail = function(params){
        var delay = $q.defer();
        var url_join = url + 'function/analysis/functionDetail/'+'';
        $http.get(url_join).success(function(data){
            delay.resolve();
        }).error(function(error){
            delay.error();
        })
    }
    //菜单管理接口
    this.getMenu = function(param){
        var delay = $q.defer();
        var url_join = url + 'menu/'+param;
        $http.get(url_join,{'withCredentials':true}).success(function(data){
            delay.resolve(data);
        }).error(function(error){
            delay.reject(error);
        })
        return delay.promise;
    }

});