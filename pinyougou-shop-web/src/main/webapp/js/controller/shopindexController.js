 //控制层 
app.controller('shopindex' ,function($scope,shoplogin){
    //读取列表数据绑定到表单中  
	$scope.getShowName=function(){
        shoplogin.loginName().success(
			function(response){
				$scope.entity=response.loginName;
			}			
		);
	}    

});	
