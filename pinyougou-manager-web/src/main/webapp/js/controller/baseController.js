 //品牌控制层 
app.controller('baseController' ,function($scope){	
	
    //重新加载列表 数据
    $scope.reloadList=function(){
    	//切换页码
    	$scope.search( $scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);
    }
    
	//分页控件配置 
	$scope.paginationConf = {
         currentPage: 1,
         totalItems: 10,
         itemsPerPage: 5,
         perPageOptions: [5,10, 20, 30, 40, 50],
         onChange: function(){
        	 $scope.reloadList();//重新加载
     	 }
	}; 
	
	$scope.selectIds=[];//选中的ID集合 

	//更新复选
	$scope.updateSelection = function($event, id) {		
		if($event.target.checked){//如果是被选中,则增加到数组
			$scope.selectIds.push(id);
		}else{
			var idx = $scope.selectIds.indexOf(id);
            $scope.selectIds.splice(idx, 1);//删除 
		}
	}

     //将一个json字符串转成制定的格式（以其一个数组里面的对象的属性值 通过“，”拼接起来）
     $scope.jsonToString=function (jsonString,key) {
		 //1.将json字符转换成json对象  angular.fromJSON(jsonString);
		 var json =JSON.parse(jsonString);//[{"id":27,"text":"网络"},{"id":32,"text":"机身内存"}]
        var str="";
		 for(var i=0;i<json.length;i++){
             var object=json[i];      //{"id":27,"text":"网络"}
			str +=object[key]+",";   //object['text'] ==object.text
		}
		return str;
     }
});	