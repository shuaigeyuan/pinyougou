 //控制层 
app.controller('typeTemplateController' ,function($scope,$controller,typeTemplateService,brandService,specificationService){
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		typeTemplateService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		typeTemplateService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(id){				
		typeTemplateService.findOne(id).success(
			function(response){
				$scope.entity= response;
                //{"rows":[{"brandIds":"[{\"id\":1,\"text\":\"联想\"},{\"id\":3,\"text\":\"三星\"},{\"id\":2,\"text\":\"华为\"},{\"id\":5,\"text\":\"OPPO\"},{\"id\":4,\"text\":\"小米\"},{\"id\":9,\"text\":\"苹果\"},{\"id\":8,\"text\":\"魅族\"},{\"id\":6,\"text\":\"360\"},{\"id\":10,\"text\":\"VIVO\"},{\"id\":11,\"text\":\"诺基亚\"},{\"id\":12,\"text\":\"锤子\"}]","customAttributeItems":"[{\"text\":\"内存大小\"},{\"text\":\"颜色\"},{\"text\":\"核心\"}]","id":35,"name":"手机","specIds":"[{\"id\":27,\"text\":\"网络\"},{\"id\":32,\"text\":\"机身内存\"}]"},{"brandIds":"[{\"id\":16,\"text\":\"TCL\"},{\"id\":13,\"text\":\"长虹\"},{\"id\":14,\"text\":\"海尔\"},{\"id\":19,\"text\":\"创维\"},{\"id\":21,\"text\":\"康佳\"},{\"id\":18,\"text\":\"夏普\"},{\"id\":17,\"text\":\"海信\"},{\"id\":20,\"text\":\"东芝\"},{\"id\":15,\"text\":\"飞利浦\"},{\"id\":22,\"text\":\"LG\"}]","customAttributeItems":"[]","id":37,"name":"电视","specIds":"[{\"id\":33,\"text\":\"电视屏幕尺寸\"}]"},{"brandIds":"[{\"id\":3,\"text\":\"三星\"},{\"id\":7,\"text\":\"中兴\"},{\"id\":9,\"text\":\"苹果\"}]","customAttributeItems":"[{\"text\":\"外观\"},{\"text\":\"大小\"},{\"text\":\"重量\"}]","id":38,"name":null,"specIds":"[{\"id\":28,\"text\":\"手机屏幕尺寸\"},{\"id\":33,\"text\":\"电视屏幕尺寸\"},{\"id\":27,\"text\":\"网络\"}]"},{"brandIds":"[{\"id\":3,\"text\":\"三星\"},{\"id\":7,\"text\":\"中兴\"},{\"id\":13,\"text\":\"长虹\"}]","customAttributeItems":"[{\"text\":\"重量\"},{\"text\":\"大小\"}]","id":40,"name":"电脑","specIds":"[{\"id\":27,\"text\":\"网络\"},{\"id\":28,\"text\":\"手机屏幕尺寸\"}]"}],"total":4}
                /*从数据库中查询出来的是字符串，我们必须将其转换为json对象才能实现信息的回显，共有以下两种方式
                $scope.entity.brandIds=  JSON.parse($scope.entity.brandIds);//转换品牌列表
              $scope.entity.specIds=  JSON.parse($scope.entity.specIds);//转换规格列表
              $scope.entity.customAttributeItems= JSON.parse($scope.entity.customAttributeItems);//转换扩展属性*/
                $scope.entity.brandIds=angular.fromJson($scope.entity.brandIds);
                $scope.entity.specIds=angular.fromJson($scope.entity.specIds);
                $scope.entity.customAttributeItems=angular.fromJson($scope.entity.customAttributeItems);
			}
		);				
	}
	
	//保存 
	$scope.save=function(){				
		var serviceObject;//服务层对象  				
		if($scope.entity.id!=null){//如果有ID
			serviceObject=typeTemplateService.update($scope.entity); //修改
		}else{
			serviceObject=typeTemplateService.add($scope.entity);//增加
		}				
		serviceObject.success(
			function(response){
				if(response.success){
					//重新查询 
		        	$scope.reloadList();//重新加载
				}else{
					alert(response.message);
				}
			}		
		);				
	}
	
	 
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		typeTemplateService.dele( $scope.selectIds ).success(
			function(response){
				if(response.success){
					$scope.reloadList();//刷新列表
				}						
			}		
		);				
	}
	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){			
		typeTemplateService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
    $scope.brandList={data:[]};//品牌列表
    //读取品牌列表
	$scope.findBrandList=function () {
       brandService.selectOptionList().success(
            function(response){
            	//	$scope.brandList={data:response};
                $scope.brandList.data=response;
            }
        );
    }
    $scope.specList={data:[]};//规格列表
    //读取规格列表
    $scope.findSpecList=function () {
       specificationService.selectSpecList().success(
            function(response){
                //	$scope.specList={data:response};
                $scope.specList.data=response;
            }
        );
    }
    // $scope.entity={tbSpecification:{},tbSpecificationOptionList:[{},{}]}
    //新增添加规格选项的方法,在点击新增规格时调用,将对象添加到数组中
    $scope.addTableRow = function() {
        $scope.entity.customAttributeItems.push({});
    }
    $scope.deleteTableRow = function(index) {
        $scope.entity.customAttributeItems.splice(index,1);
    }


});	
