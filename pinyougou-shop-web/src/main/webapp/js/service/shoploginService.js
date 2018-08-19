app.service('shoplogin',function($http){
    this.loginName=function(){
        return $http.get("../shoplogin/getLoginName.do");
    }
})