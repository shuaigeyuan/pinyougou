package com.pinyougou.sellergoods.service.Impl;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.pinyougou.mapper.TbSpecificationOptionMapper;
import com.pinyougou.pojo.TbSpecificationOption;
import com.pinyougou.pojo.TbSpecificationOptionExample;
import com.pinyougou.pojogroup.Specification;
import org.springframework.beans.factory.annotation.Autowired;
import com.alibaba.dubbo.config.annotation.Service;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.pinyougou.mapper.TbSpecificationMapper;
import com.pinyougou.pojo.TbSpecification;
import com.pinyougou.pojo.TbSpecificationExample;
import com.pinyougou.pojo.TbSpecificationExample.Criteria;
import com.pinyougou.sellergoods.service.SpecificationService;

import entity.PageResult;

/**
 * 服务实现层
 * @author Administrator
 *
 */
@Service
public class SpecificationServiceImpl implements SpecificationService {

	@Autowired
	private TbSpecificationMapper specificationMapper;
	@Autowired
	private TbSpecificationOptionMapper specificationOptionMapper;

	/**
	 * 查询全部
	 */
	@Override
	public List<TbSpecification> findAll() {
		return specificationMapper.selectByExample(null);
	}

	/**
	 * 按分页查询
	 */
	@Override
	public PageResult findPage(int pageNum, int pageSize) {
		PageHelper.startPage(pageNum, pageSize);		
		Page<TbSpecification> page=   (Page<TbSpecification>) specificationMapper.selectByExample(null);
		return new PageResult(page.getTotal(), page.getResult());
	}

	/**
	 * 增加
	 */
	@Override
	public void add(Specification specification) {
		//设置规格名称
		specificationMapper.insert(specification.getTbSpecification());
		//设置规格属性
		List<TbSpecificationOption> tbSpecificationOptionList = specification.getTbSpecificationOptionList();
		//遍历设置
		for(TbSpecificationOption option : tbSpecificationOptionList) {
			//将规格的ID设置到规格选项的---规格ID属性中
			option.setSpecId(specification.getTbSpecification().getId());
			specificationOptionMapper.insert(option);
		}
	}

	
	/**
	 * 修改
	 */
	@Override
	public void update(Specification specification){
		//保存修改的规格
		specificationMapper.updateByPrimaryKey(specification.getTbSpecification());
		//删除原有的规格选项
		TbSpecificationOptionExample example=new TbSpecificationOptionExample();
		TbSpecificationOptionExample.Criteria criteria = example.createCriteria();
		criteria.andSpecIdEqualTo(specification.getTbSpecification().getId());
		specificationOptionMapper.deleteByExample(example);
		//添加更改后的规格选项
		for (TbSpecificationOption option:specification.getTbSpecificationOptionList()) {
		  option.setSpecId(specification.getTbSpecification().getId());
		  specificationOptionMapper.insert(option);
		 }
	}	
	
	/**
	 * 根据ID获取实体
	 * @param id
	 * @return
	 */
	@Override
	public Specification findOne(Long id){
		//创建代理对象
		Specification spec=new Specification();
		//通过规格id获取规格对象
		TbSpecification tbSpecification=specificationMapper.selectByPrimaryKey(id);
		//查询规格选项列表
		TbSpecificationOptionExample example=new TbSpecificationOptionExample();
		TbSpecificationOptionExample.Criteria criteria = example.createCriteria();
		//根据规格ID查询(创建查询条件)
		criteria.andSpecIdEqualTo(id);
		List<TbSpecificationOption> tbSpecificationOptionList = specificationOptionMapper.selectByExample(example);
		//将查询获得的信息设置到代理对象中,返回前端
		spec.setTbSpecification(tbSpecification);
		spec.setTbSpecificationOptionList(tbSpecificationOptionList);
		return spec ;
	}

	/**
	 * 批量删除
	 */
	@Override
	public void delete(Long[] ids){
		for(Long id:ids){
			specificationMapper.deleteByPrimaryKey(id);
			//删除原有规格属性
			TbSpecificationOptionExample example=new TbSpecificationOptionExample();
			TbSpecificationOptionExample.Criteria criteria = example.createCriteria();
			//指定规格ID为条件
			criteria.andSpecIdEqualTo(id);
			//删除
			specificationOptionMapper.deleteByExample(example);
		}
	}
		@Override
	    public PageResult findPage(TbSpecification specification, int pageNum, int pageSize) {
		PageHelper.startPage(pageNum, pageSize);
		
		TbSpecificationExample example=new TbSpecificationExample();
		Criteria criteria = example.createCriteria();
		
		if(specification!=null){			
				if(specification.getSpecName()!=null && specification.getSpecName().length()>0){
				criteria.andSpecNameLike("%"+specification.getSpecName()+"%");
			}
	
		}
		
		Page<TbSpecification> page= (Page<TbSpecification>)specificationMapper.selectByExample(example);		
		return new PageResult(page.getTotal(), page.getResult());
	}

	@Override
	public List<Map> selectSpecList() {
		List<Map> maps= specificationMapper.selectSpecList();
		return  maps;
	}

}
