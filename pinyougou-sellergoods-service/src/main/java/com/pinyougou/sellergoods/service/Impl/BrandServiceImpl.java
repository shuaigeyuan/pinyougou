package com.pinyougou.sellergoods.service.Impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.pinyougou.mapper.TbBrandMapper;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.sellergoods.service.BrandService;
import entity.PageResult;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class BrandServiceImpl implements BrandService {

    @Autowired
    private TbBrandMapper tbBrandMapper;

    @Override
    public List<TbBrand> findAll() {
        List<TbBrand> tbBrands = tbBrandMapper.selectByExample(null);
        return tbBrands;
    }

    @Override
    public PageResult findByPage(Integer pageNum, Integer pageSize) {
        //设置插件的分页参数
        PageHelper.startPage(pageNum,pageSize);
        //获取所有数据
        List<TbBrand> tbBrandList = tbBrandMapper.selectByExample(null);
        System.out.println("222"+tbBrandList.toString());
        //强制转换成分页对象
        Page<TbBrand> page = (Page<TbBrand>) tbBrandList;
        System.out.println("111"+page.getResult());
        //创建返回前端的对象并设置参数
       PageResult pageResult=new PageResult();
       pageResult.setRows(page.getResult());
       pageResult.setTotal(page.getTotal());
        return pageResult;
    }
}
