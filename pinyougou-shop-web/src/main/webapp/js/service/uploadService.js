//服务层
app.service('uploadService',function($http){
    //上传
    this.uploadFile=function(){
//创建的表单对象
       var formData=new FormData();
        //第一个参数：file和controller中的参数一致
     // 第二个参数：file 和input 中的id的file一致 这里支持多图片，现在只要一个所以就选一张即可.
        formData.append("file",file.files[0]);
        //anjularjs对于post和get请求默认的Content-Type header 是application/json。
        //headers:用于设置媒体类型 通过设置‘Content-Type’: undefined，这样浏览器会帮我们把Content-Type 设置为 multipart/form-data.
       //通过设置transformRequest: angular.identity，
        // anjularjstransformRequest function 将序列化我们的formdata object.
        return  $http({
            method:'post',
            url:'../uploadFile.do',
            data:formData,
            headers: {'Content-Type':undefined},
        transformRequest:angular.identity
        })
    }
})