package com.pinyougou.manager.controller;

import com.pinyougou.FastDFSClient;
import entity.Result;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class UploadFile {

    @Value(value = "${IMAGE_SERVER_URL}")
    private String IMAGE_SERVER_URL;

    @RequestMapping("/uploadFile.do")
    public Result uploadFile(MultipartFile file){
          //1.获取文件扩展名
        String originalFilename = file.getOriginalFilename();
        String extName = originalFilename.substring(originalFilename.lastIndexOf(".")+1);
        //2.创建FistDFS客户端
        try {
            FastDFSClient fastDFSClient=new FastDFSClient("classpath:config/fdfs_client.conf");
            //3.执行上传处理
            byte[] bytes = file.getBytes();
            String path = fastDFSClient.uploadFile(bytes, extName);
            //4、拼接返回的url和ip地址，拼装成完整的url
            String realPath=IMAGE_SERVER_URL+path;
            return new Result(true,realPath);
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false,"上传失败");
        }

    }


}
