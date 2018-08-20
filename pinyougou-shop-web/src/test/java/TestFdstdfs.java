import org.csource.fastdfs.*;
import org.junit.Test;

public class TestFdstdfs {
//测试图片上传
    @Test
    public void test() throws Exception{
        //1.加载配置文件
        ClientGlobal.init("D:\\develop\\idea\\xiangmu-pinyougou-parent\\pinyougou-shop-web\\src\\main\\resources\\config\\fdfs_client.conf");
        //2.直接new创建trackerClient对象
        TrackerClient trackerClient=new TrackerClient();
        //3.通过客户端获取服务端对象
        TrackerServer trackerServer = trackerClient.getConnection();
        //4.先定义一个storageServer的引用,值为null
        StorageServer storageServer=null;
        //5.创建storageClient对象,并传参(TrackerServer对象,StorageServer的引用)
        StorageClient storageClient=new StorageClient(trackerServer,storageServer);
//6.使用storageClient对象上传图片,调用upload_file(参数1:本地文件路径,参数2:扩展名,参数3:元数据)方
   //扩展名不带".",即后缀名
        //返回数组,包含数组和图片路径
        String[] strings = storageClient.upload_file("C:\\Users\\袁华\\Pictures\\Camera Roll\\4.jpg", "jpg", null);
        //遍历数组并打印,输出图片在storageServer中的存储路径group1/M00/00/00/wKgZhVt64ceAFzJRAACNZYCCRTw146.jpg
        //另外加上服务器地址就可以访问http://192.168.25.133/group1/M00/00/00/wKgZhVt64ceAFzJRAACNZYCCRTw146.jpg
        for (String string:strings){
            System.out.println(string);
        }



    }

}
