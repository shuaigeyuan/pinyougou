 //控制层 
app.controller('sellerController' ,function($scope,sellerService){
	//保存
	$scope.add=function() {
        sellerService.add($scope.entity).success(
            function (response) {
                if (response.success) {
                    //重新查询
                    window.location.href = '/shoplogin.html';
                } else {
                    alert(response.message);
                }
            }
        );
    }
});	
