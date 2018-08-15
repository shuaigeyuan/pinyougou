package com.pinyougou.sellergoods.service;

import entity.PageResult;
import com.pinyougou.pojo.TbBrand;

import java.util.List;

public interface BrandService {
    public List<TbBrand> findAll();

    PageResult findByPage(Integer pageNum, Integer pageSize);

}
