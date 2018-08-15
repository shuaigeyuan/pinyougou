package com.pinyougou.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import entity.PageResult;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.sellergoods.service.BrandService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/brand")
public class BrandController {

    @Reference
    private BrandService brandService;
//查询所有
    @RequestMapping("/findAll.do")
    @ResponseBody
    public List<TbBrand> findAll(){
        List<TbBrand> tbBrands = brandService.findAll();
        return tbBrands;
    }
  //分页
    @RequestMapping("/findByPage.do")
    @ResponseBody
    public PageResult findByPage(Integer pageNum, Integer pageSize){
        PageResult   pageResult = brandService.findByPage(pageNum,pageSize);
        return pageResult;
    }
}
