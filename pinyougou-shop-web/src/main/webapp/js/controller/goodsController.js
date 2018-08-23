 //控制层 
app.controller('goodsController' ,function($scope,$controller,goodsService,$location,uploadService,itemCatService,typeTemplateService) {

    $controller('baseController', {$scope: $scope});//继承

    //读取列表数据绑定到表单中  
    $scope.findAll = function () {
        goodsService.findAll().success(
            function (response) {
                $scope.list = response;
            }
        );
    }

    //保存
    $scope.save = function () {
        var serviceObject;//服务层对象
        if ($scope.entity.tbGoods.id != null) {//如果有ID
            serviceObject = goodsService.update($scope.entity); //修改
        } else {
            //富文本编辑器的转化
            $scope.entity.tbGoodsDesc.introduction = editor.html();
            serviceObject = goodsService.add($scope.entity);//增加
        }
        serviceObject.success(
            function (response) {
                if (response.success) {
                    //清空表格
                    $scope.entity = {};
                    editor.html('');//清空富文本编辑器
                    //保存成功后跳转到商品列表页面
                    window.location.href="goods.html";
                } else {
                    alert(response.message);
                }
            }
        );
    }
//添加
   /* $scope.add = function () {
        //富文本编辑器的转化
        $scope.entity.tbGoodsDesc.introduction = editor.html();
        goodsService.add($scope.entity).success(
            function (response) {
                if (response.success) {
                    //清空表格
                    $scope.entity = {};
                    editor.html('');//清空富文本编辑器
                } else {
                    alert(response.message);
                }

            }
        )
    }*/
    //定义页面实体结构specificationItems用于规格遍历,tbItemList用于规格选取后,下端生成组合规格表
    $scope.entity = {tbGoods: {}, tbGoodsDesc: {itemImages: [], specificationItems: []}, tbItemList: []};

    //上传文件
    $scope.uploadFile = function () {
        uploadService.uploadFile().success(function (response) {
            if (response.success) {
                //如果上传成功，取出url
                $scope.image_entity.url = response.message;//设置文件地址
            } else {
                alert(response.message);
            }
        }).error(function () {
            alert("上传错误");

        })

    }

    //添加图片列表
    $scope.add_image_entity = function () {
        $scope.entity.tbGoodsDesc.itemImages.push($scope.image_entity)//设置文件地址
    }
    //列表中移除图片
    $scope.remove_image_entity = function (index) {
        $scope.entity.tbGoodsDesc.itemImages.splice(index, 1);
    }
    //读取一级分类
    $scope.selectItemCatList = function () {
        itemCatService.findByParentId(0).success(function (response) {
            $scope.itemCat1List = response;
        })
    }
    //监控一级分类(category1Id)的变化,从而实现二级分类的下拉列表
    $scope.$watch("entity.tbGoods.category1Id", function (newValue, oldValue) {
        if (newValue != null && newValue != undefined) {
            //根据选择的值，查询二级分类
            itemCatService.findByParentId(newValue).success(function (response) {
                $scope.itemCat2List = response;
            })
        }
    })
    //监控二级分类(category2Id)的变化,从而实现二级分类的下拉列表
    $scope.$watch("entity.tbGoods.category2Id", function (newValue, oldValue) {
        if (newValue != null && newValue != undefined) {
            //根据选择的值，查询三级分类
            itemCatService.findByParentId(newValue).success(function (response) {
                $scope.itemCat3List = response;
            })
        }
    })
    //监控三级分类(category3Id)的变化,读取模板id(typeTemplateId)
    $scope.$watch("entity.tbGoods.category3Id", function (newValue, oldValue) {
        if (newValue != null && newValue != undefined) {
            //根据选择的值，查询模板Id
            itemCatService.findOne(newValue).success(function (response) {
                $scope.entity.tbGoods.typeTemplateId = response.typeId;
            })
        }
    })

    //模板ID选择后  更新品牌列表
    $scope.$watch("entity.tbGoods.typeTemplateId", function (newValue, oldValue) {
        if (newValue != null && newValue != undefined) {
            //根据选择的值，查询模板Id
            typeTemplateService.findOne(newValue).success(function (response) {
                $scope.typeTemplate = response;//获取类型模板
                $scope.typeTemplate.brandIds = JSON.parse($scope.typeTemplate.brandIds);//品牌列表
                //在用户更新模板ID时，读取模板中的扩展属性赋给商品的扩展属性。
                if($location.search()['id']==null){  //判断是否存在id,id为空则新增空的模板
                $scope.entity.tbGoodsDesc.customAttributeItems = JSON.parse($scope.typeTemplate.customAttributeItems);
                }
                $scope.entity.tbGoodsDesc.specIds = angular.fromJson($scope.typeTemplate.specIds);
                //{"rows":[{"brandIds":"[{\"id\":1,\"text\":\"联想\"},{\"id\":3,\"text\":\"三星\"},{\"id\":2,\"text\":\"华为\"},{\"id\":5,\"text\":\"OPPO\"},{\"id\":4,\"text\":\"小米\"},{\"id\":9,\"text\":\"苹果\"},{\"id\":8,\"text\":\"魅族\"},{\"id\":6,\"text\":\"360\"},{\"id\":10,\"text\":\"VIVO\"},{\"id\":11,\"text\":\"诺基亚\"},{\"id\":12,\"text\":\"锤子\"}]","customAttributeItems":"[{\"text\":\"内存大小\"},{\"text\":\"颜色\"},{\"text\":\"核心\"}]","id":35,"name":"手机","specIds":"[{\"id\":27,\"text\":\"网络\"},{\"id\":32,\"text\":\"机身内存\"}]"},{"brandIds":"[{\"id\":16,\"text\":\"TCL\"},{\"id\":13,\"text\":\"长虹\"},{\"id\":14,\"text\":\"海尔\"},{\"id\":19,\"text\":\"创维\"},{\"id\":21,\"text\":\"康佳\"},{\"id\":18,\"text\":\"夏普\"},{\"id\":17,\"text\":\"海信\"},{\"id\":20,\"text\":\"东芝\"},{\"id\":15,\"text\":\"飞利浦\"},{\"id\":22,\"text\":\"LG\"}]","customAttributeItems":"[]","id":37,"name":"电视","specIds":"[{\"id\":33,\"text\":\"电视屏幕尺寸\"}]"},{"brandIds":"[{\"id\":3,\"text\":\"三星\"},{\"id\":7,\"text\":\"中兴\"},{\"id\":9,\"text\":\"苹果\"}]","customAttributeItems":"[{\"text\":\"外观\"},{\"text\":\"大小\"},{\"text\":\"重量\"}]","id":38,"name":null,"specIds":"[{\"id\":28,\"text\":\"手机屏幕尺寸\"},{\"id\":33,\"text\":\"电视屏幕尺寸\"},{\"id\":27,\"text\":\"网络\"}]"},{"brandIds":"[{\"id\":3,\"text\":\"三星\"},{\"id\":7,\"text\":\"中兴\"},{\"id\":13,\"text\":\"长虹\"}]","customAttributeItems":"[{\"text\":\"重量\"},{\"text\":\"大小\"}]","id":40,"name":"电脑","specIds":"[{\"id\":27,\"text\":\"网络\"},{\"id\":28,\"text\":\"手机屏幕尺寸\"}]"}],"total":4}
                /*从数据库中查询出来的是字符串，我们必须将其转换为json对象才能实现信息的回显，共有以下两种方式
                $scope.entity.brandIds=  JSON.parse($scope.entity.brandIds);//转换品牌列表
              $scope.entity.specIds=  JSON.parse($scope.entity.specIds);//转换规格列表
              $scope.entity.customAttributeItems= JSON.parse($scope.entity.customAttributeItems);//转换扩展属性*/
                /* $scope.entity.brandIds=angular.fromJson($scope.entity.brandIds);
                 $scope.entity.specIds=angular.fromJson($scope.entity.specIds);
                 $scope.entity.customAttributeItems=angular.fromJson($scope.entity.customAttributeItems);*/
            })
            //获取[{"id":27,"text":"网络","options":[{},{}] },"id":27,"text":"网络","options":[{},{}] }]
            typeTemplateService.findSpecList(newValue).success(function (response) {
                $scope.specList = response;
            })
        }
    })


//保存选中规格的选项   $scope.entity.goodsDesc.specificationItems=
// [{"attributeName":"网络制式","attributeValue":["移动3G","移动4G"]},{"attributeName":"屏幕尺寸","attributeValue":["6寸","5.5寸"]}]
    $scope.updateSpecAttribute = function ($event, specName, specValue) {
        //从已有的数组中获取对象
        var object = $scope.searchObjectByKey($scope.entity.tbGoodsDesc.specificationItems, specName, "attributeName");
//判断获取的对象是否存在
        if (object != null) {    //{"attributeName":"网络制式","attributeValue":["移动3G","移动4G"]}
            //在已有的数组中存在该属性,不需要新增规格属性
            //判断是否已经选中
            if ($event.target.checked) {
                //如果选项处于选中就直接添加
                object.attributeValue.push(specValue);
            } else {//如果选项取消了，将此条记录移除
                object.attributeValue.splice(object.attributeValue.indexOf(specValue), 1);
                //如果属性中都没有被勾选,就将该属性移除
                if (object.attributeValue.length == 0) {
                    $scope.entity.tbGoodsDesc.specificationItems.splice($scope.entity.tbGoodsDesc.specificationItems.indexOf(object), 1);
                }
            }
        } else {
            //已有的数组中,不存在该属性,需要新增规格属性
            $scope.entity.tbGoodsDesc.specificationItems.push(
                {"attributeName": specName, "attributeValue": [specValue]});
        }
    }
//创建SKU列表----每当点击规格中的属性attributeName的遍历的选项值时,创建列表
    $scope.createItemList = function () {
        //初始化tbItemList
        $scope.entity.tbItemList = [{spec: {}, price: 0, num: 99999, status: '0', isDefault: '0'}];
        //遍历specificationItems规格列表
        var specificationItems = $scope.entity.tbGoodsDesc.specificationItems;
//[{"attributeName":"网络制式","attributeValue":["移动3G","移动4G"]},{"attributeName":"屏幕尺寸","attributeValue":["6寸","5.5寸"]}]
        for (var i = 0; i < specificationItems.length; i++) {
//这个方法目的是 循环遍历网络 再循环遍历移动3G,最后拼接对象
//将[{"attributeName":"网络制式","attributeValue":["移动3G","移动4G"]},{"attributeName":"屏幕尺寸","attributeValue":["6寸","5.5寸"]}]中
// 的 网络制式 和 屏幕尺寸 取出,并将 移动3G 和 6寸 取出 ,最后拼接对象
            $scope.entity.tbItemList = addColumn(
                $scope.entity.tbItemList, specificationItems[i].attributeName, specificationItems[i].attributeValue);
//此时tbItemList=[{spec:{"网络制式":"移动3G","屏幕尺寸":"6寸"},price:0,num:99999,status:'0',isDefault:'0' },{spec:{"网络制式":"移动4G","屏幕尺寸":"6寸"},price:0,num:99999,status:'0',isDefault:'0' }]
        }
    }
//添加列值 columnName--列名,conlumnValues列值
    addColumn = function (list, columnName, conlumnValues) {
        var newList = [];//生成的新的集合
        for (var i = 0; i < list.length; i++) {   //list:[{spec:{},price:9999,num:999,status:’0’,isDefault:’0’}]
            var oldRow = list[i];    //list[i]:{spec:{},price:9999,num:999,status:’0’,isDefault:’0’}
            for (var j = 0; j< conlumnValues.length; j++) {
                var newRow = JSON.parse(JSON.stringify(oldRow));//深克隆
                // var newRow=angular.fromJson(angular.toJson(oldRow));
                //向新的对象添加属性  spec:{"网络制式":"移动3G","屏幕尺寸":"6寸"}
                //{"attributeName":"attributeValue"}即{"网络制式":"移动3G"}
                newRow.spec[columnName] = conlumnValues[j];
                //将对象添加到对象集合中
                newList.push(newRow);
            }
        }
            return newList;
    }

    $scope.searchEntity={};//定义搜索对象

    //搜索
    $scope.search=function(page,rows){
        goodsService.search(page,rows,$scope.searchEntity).success(
            function(response){
                $scope.list=response.rows;
                $scope.paginationConf.totalItems=response.total;//更新总记录数
            }
        );
    }
    //商品状态
    $scope.status=['未审核','已审核','审核未通过','关闭'];
    $scope.itemCatList=[];//商品分类列表
    //查询所有的TbItemCat
    $scope.findItemCatList=function(){
        itemCatService.findAll().success(function (response) {
            for(var i=0;i<response.length;i++){
               $scope.itemCatList[response[i].id]=response[i].name;
            }
        })
    }

    //查询实体(回显)
    $scope.findOne = function () {
        var id =$location.search()['id'];
        goodsService.findOne(id).success(
            function (response) {
                $scope.entity = response;
                //富文本编辑的回显---商品介绍哦
                editor.html($scope.entity.tbGoodsDesc.introduction);
                //图片列表的回显
              $scope.entity.tbGoodsDesc.itemImages=JSON.parse($scope.entity.tbGoodsDesc.itemImages);
                //扩展属性列表的回显需要在新建的方法上面添加判断获取的id是否为空
                $scope.entity.tbGoodsDesc.customAttributeItems=  JSON.parse($scope.entity.tbGoodsDesc.customAttributeItems);
                //规格属性的回显
               $scope.entity.tbGoodsDesc.specificationItems=JSON.parse($scope.entity.tbGoodsDesc.specificationItems);

                //SKU列表规格列转换--将"spec":"{\"网络\":\"移动3G\",\"机身内存\":\"16G\"}"
                // 转换成"spec":{"网络":"移动4G","机身内存":"32G"}
                var tbItemList=$scope.entity.tbItemList;
                for( var i=0;i<tbItemList.length;i++ ){
                    //将字符串装换成json
                  tbItemList[i].spec = JSON.parse(tbItemList[i].spec);
                    //或者tbItemList[i].spec = angular.fromJson(tbItemList[i].spec);
                }
            }
        );
    }
//根据规格名称和选项名称返回是否被勾选
    $scope.checkAttributeValue=function(specName,specValue) {
        var specificationItems = $scope.entity.tbGoodsDesc.specificationItems;
        var object = $scope.searchObjectByKey(specificationItems,specName,'attributeName');
        if(object==null){
            return false;
        }else{
               if(object.attributeValue.indexOf(specValue)!=-1){
                   return true;
               }else{
                   return false;
               }
        }
    }

    //商品列表的批量删除
    $scope.dele = function () {
        //获取选中的复选框
        goodsService.dele($scope.selectIds).success(
            function (response) {
                if (response.success) {
                    $scope.reloadList();//刷新列表
                }
            }
        );
    }
})
