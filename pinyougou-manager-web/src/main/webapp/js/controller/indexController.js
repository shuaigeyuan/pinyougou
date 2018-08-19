app.controller('indexController',function($scope,loginService){
    $scope.getLoginName=function(){
    loginService.loginName().success(
        function (response) {
            $scope.entity=response.name;
    })
   }
})