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
//---------------------------------------------------------
    /**
     *获取项目部列表 旧
     */
    this.getDeptInfo = function () {
        var delay = $q.defer();
        var url_join= url+"rs/co/deptInfoList";
        $http.get(url_join)
            .success(function (data) {
                delay.resolve(data);
            }).error(function (data, status) {
                delay.reject(data);
            });
        return delay.promise;
    };
 
    //批量删除协作
    this.removeAll = function(params){
        var params = JSON.stringify(params);
        var delay = $q.defer();
        $.ajax({
            type: "DELETE",
            url: basePath+'rs/co/removeAll',
            data:params,
            contentType:'application/json',
            success: function(data){
                delay.resolve(data);
            },
            error:function(error){
                delay.reject(JSON.parse(error.responseText));
            }
        });
        return delay.promise;
    }
});