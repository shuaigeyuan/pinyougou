 //控制层 
app.controller('itemCatController' ,function($scope,$controller,itemCatService,typeTemplateService){
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		itemCatService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		itemCatService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(id){				
		itemCatService.findOne(id).success(
			function(response){
				$scope.entity= response;					
			}
		);				
	}

	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){			
		itemCatService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}


    //当第一次打开页面的时候HTML有初始化ng-init="findByParentId(0)"或者 ng-init="findByParentId(parentId)"初始化parentID=0,此时通过entity.parentId查询,即0,
    // 并且初始化完毕时已经给每一行的 查询下一级 按键 绑定了每一行的对象,
    //当点击 查询下一级 时,此时先调用 等级的方法 改变等级,然后调用 查询该对象集合 的方法,将对象绑定给 面包屑标签,
    //然后再通过该对象的id查询该对象所有的集合,并返回前端
    //查询子级列表
    $scope.parentId=0;

	$scope.findByParentId=function(parentId){
		//记住上一级的parentId
		$scope.parentId=parentId;
        itemCatService.findByParentId(parentId).success(
        	function (response) {
				$scope.list=response;
            })
	}
	//面包屑查询,默认等级为1
	 $scope.grade=1;
   //等级的方法 绑定查询下一级按键,用于改变等级
	$scope.setGrade=function (value) {
	    $scope.grade=value;
    }
	//查询该对象集合
	$scope.selectList=function (p_entity) {
		if ($scope.grade==1){
			$scope.entity_1=null;
			$scope.entity_2=null;
		}
        if ($scope.grade==2){
            $scope.entity_1=p_entity;
            $scope.entity_2=null;
        }
        if ($scope.grade==3){
            $scope.entity_2=p_entity;
        }
        $scope.findByParentId(p_entity.id);
    }


    $scope.typeList=[];//模板列表
    //读取模板列表
    $scope.findTypeList=function () {
        typeTemplateService.selectTypeList().success(
            function(response){
                $scope.typeList=response;
            }
        );
    }

    //保存
    $scope.save=function(){
        var serviceObject;//服务层对象
        if($scope.entity.id!=null){//如果有ID
            serviceObject=itemCatService.update( $scope.entity ); //修改
        }else{
             $scope.entity.parentId= $scope.parentId;
            serviceObject=itemCatService.add( $scope.entity  );//增加
        }
        serviceObject.success(
            function(response){
                if(response.success){
                    //重新查询
                    $scope.findByParentId($scope.parentId);//重新加载
                }else{
                    alert(response.message);
                }
            }
        );
    }


    //批量删除
    $scope.dele=function(){
        //获取选中的复选框
        itemCatService.dele($scope.selectIds).success(
            function(response){
                if(response.success){
                 $scope.findByParentId($scope.parentId);//刷新列表
                    //  itemCatService.findByParentId(parentId);
                }
            }
        );
    }

});	
