package com.pinyougou.sellergoods.service.Impl;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.pinyougou.mapper.*;
import com.pinyougou.pojo.*;
import com.pinyougou.pojogroup.Goods;
import org.springframework.beans.factory.annotation.Autowired;
import com.alibaba.dubbo.config.annotation.Service;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.pinyougou.pojo.TbGoodsExample.Criteria;
import com.pinyougou.sellergoods.service.GoodsService;

import entity.PageResult;

/**
 * 服务实现层
 * @author Administrator
 *
 */
@Service
public class GoodsServiceImpl implements GoodsService {

	@Autowired
	private TbGoodsMapper goodsMapper;
	@Autowired
	private TbGoodsDescMapper goodsDescMapper;
     @Autowired
     private TbItemMapper tbItemMapper;
	@Autowired
	private TbBrandMapper tbBrandMapper;
	@Autowired
	private TbItemCatMapper tbItemCatMapper;
	@Autowired
	private TbSellerMapper tbSellerMapper;

	/**
	 * 查询全部
	 */
	@Override
	public List<TbGoods> findAll() {
		return goodsMapper.selectByExample(null);
	}

	/**
	 * 按分页查询
	 */
	@Override
	public PageResult findPage(int pageNum, int pageSize) {
		PageHelper.startPage(pageNum, pageSize);		
		Page<TbGoods> page=   (Page<TbGoods>) goodsMapper.selectByExample(null);
		return new PageResult(page.getTotal(), page.getResult());
	}

	/**
	 * 增加
	 */
	@Override
	public void add(Goods goods) {
		TbGoods tbGoods = goods.getTbGoods();
		TbGoodsDesc tbGoodsDesc = goods.getTbGoodsDesc();
//添加商品数据
		//设置为未审核状态
		tbGoods.setAuditStatus("0");
		//设置为不删除状态
		tbGoods.setIsDelete("0");
		//需要返回主键id
		goodsMapper.insert(tbGoods);
//添加商品介绍的数据
		//设置商品id
		tbGoodsDesc.setGoodsId(tbGoods.getId());
		goodsDescMapper.insert(tbGoodsDesc);
//设置商品类型
		setItemList(goods);
	}

	//提取方法---设置商品类型

	    private void setItemList(Goods goods) {
			//设置标题 三星 B9120 钛灰色 联通3G手机 双卡双待双通
			String title=goods.getTbGoods().getGoodsName();
			//如果自定义规格为勾选
			if("1".equals(goods.getTbGoods().getIsEnableSpec())) {
				List<TbItem> tbItemList = goods.getTbItemList();
				//遍历TbItem
				for (TbItem tbItem : tbItemList) {
					//转化成对象
					Map<String, String> specMap = JSON.parseObject(tbItem.getSpec(), Map.class);
					for (String key : specMap.keySet()) {
						title += " " + specMap.get(key);
					}
					tbItem.setTitle(title);
					//设置图片信息地址（取spu的第一个图片）
					String itemImages = goods.getTbGoodsDesc().getItemImages();
					List<Map> imageList = JSON.parseArray(itemImages, Map.class);
					if (imageList != null && imageList.size() > 0) {
						String image = (String) imageList.get(0).get("url");
						tbItem.setImage(image);
					}
					//设置商品SPU编号
					tbItem.setGoodsId(goods.getTbGoods().getId());
					//商家编号
					tbItem.setSellerId(goods.getTbGoods().getSellerId());
					//商品分类编号（3级)
					tbItem.setCategoryid(goods.getTbGoods().getCategory3Id());
					//创建时间
					tbItem.setCreateTime(new Date());
					//创建修改时间
					tbItem.setUpdateTime(new Date());
					//设置品牌名称
					TbBrand tbBrand = tbBrandMapper.selectByPrimaryKey(goods.getTbGoods().getBrandId());
					tbItem.setBrand(tbBrand.getName());
					//设置分类名称
					TbItemCat tbItemCat = tbItemCatMapper.selectByPrimaryKey(goods.getTbGoods().getCategory3Id());
					tbItem.setCategory(tbItemCat.getName());
					//设置商家名称
					TbSeller tbSeller = tbSellerMapper.selectByPrimaryKey(goods.getTbGoods().getSellerId());
					tbItem.setSeller(tbSeller.getNickName());

					tbItemMapper.insert(tbItem);
					System.out.println(tbItem);
				}
			}else {
				//如果自定义规格没有勾选，即没有自定义规格,单品设置
				TbItem item = new TbItem();
				item.setTitle(title);
				item.setPrice(goods.getTbGoods().getPrice());
				//状态
				item.setStatus("1");
				//是否默认
				item.setIsDefault("1");
				//库存数量
				item.setNum(99999);
				//设置规格为空
				item.setSpec("{}");
				//商品SPU编号
				item.setGoodsId(goods.getTbGoods().getId());
				//商家编号
				item.setSellerId(goods.getTbGoods().getSellerId());
				//商品分类编号（3级）
				item.setCategoryid(goods.getTbGoods().getCategory3Id());
				//创建日期
				item.setCreateTime(new Date());
				//修改日期
				item.setUpdateTime(new Date());
				//品牌名称
				TbBrand brand = tbBrandMapper.selectByPrimaryKey(goods.getTbGoods().getBrandId());
				item.setBrand(brand.getName());
				//分类名称
				TbItemCat itemCat = tbItemCatMapper.selectByPrimaryKey(goods.getTbGoods().getCategory3Id());
				item.setCategory(itemCat.getName());
				//商家名称
				TbSeller seller = tbSellerMapper.selectByPrimaryKey(goods.getTbGoods().getSellerId());
				item.setSeller(seller.getNickName());
				//图片地址（取spu的第一个图片）
				List<Map> imageList = JSON.parseArray(goods.getTbGoodsDesc().getItemImages(), Map.class);
				if (imageList.size() > 0) {
					item.setImage((String) imageList.get(0).get("url"));
					tbItemMapper.insert(item);
				}
			}
			}
	
	/**
	 * 修改
	 * 设置审核状态为未审核
	 */
	  @Override
	  public void update(Goods goods){
       TbGoods tbGoods=goods.getTbGoods();
		//设置未申请状态:如果是经过修改的商品，需要重新设置状态,另外新启用方法来修改状态值。
		tbGoods.setAuditStatus("0");
		//保存商品表
		goodsMapper.updateByPrimaryKey(tbGoods);
		TbGoodsDesc tbGoodsDesc = goods.getTbGoodsDesc();
		//保存商品扩展表
		goodsDescMapper.updateByPrimaryKey(tbGoodsDesc);
		//sku列表数据需要先删除原有的sku列表数据
       TbItemExample example =new TbItemExample();
       example.createCriteria().andGoodsIdEqualTo(tbGoods.getId());
       tbItemMapper.deleteByExample(example);
       //插入新的商品SKU列表tbItemList数据
		  setItemList(goods);
	}
	
	/**
	 * 根据ID获取实体
	 * @param id
	 * @return
	 */
	@Override
	public Goods findOne(Long id){
		Goods goods=new Goods();
		//设置spu数据
		TbGoods tbGoods=goodsMapper.selectByPrimaryKey(id);
		goods.setTbGoods(tbGoods);
		//设置商品描述的数据
		TbGoodsDesc tbGoodsDesc=goodsDescMapper.selectByPrimaryKey(id);
		goods.setTbGoodsDesc(tbGoodsDesc);
		//设置sku列表
		TbItemExample example=new TbItemExample();
		TbItemExample.Criteria criteria = example.createCriteria();
		criteria.andGoodsIdEqualTo(id);
		List<TbItem> tbItemList = tbItemMapper.selectByExample(example);
		goods.setTbItemList(tbItemList);
		return goods;
	}

	/**
	 * 批量删除
	 */
	@Override
	public void delete(Long[] ids) {
		for(Long id:ids){
			//goodsMapper.deleteByPrimaryKey(id);//物理删除（数据库删除）
		//虚拟删除，即改变数据在数据库状态
			TbGoods tbGoods = goodsMapper.selectByPrimaryKey(id);
			tbGoods.setIsDelete("1");//删除
			goodsMapper.updateByPrimaryKey(tbGoods);
		}
	}
	
	
	@Override
	public PageResult findPage(TbGoods goods, int pageNum, int pageSize) {
		PageHelper.startPage(pageNum, pageSize);
		
		TbGoodsExample example=new TbGoodsExample();
		Criteria criteria = example.createCriteria();
		//仅仅查询没有被删除的数据，即没删除的状态设置为0----删除的状态设置为1
		criteria.andIsDeleteEqualTo("0");
		if(goods!=null){
			if(goods.getSellerId()!=null && goods.getSellerId().length()>0){
				criteria.andSellerIdEqualTo(goods.getSellerId());
			}
			if(goods.getGoodsName()!=null && goods.getGoodsName().length()>0){
				criteria.andGoodsNameLike("%"+goods.getGoodsName()+"%");
			}
			if(goods.getAuditStatus()!=null && goods.getAuditStatus().length()>0){
				criteria.andAuditStatusLike("%"+goods.getAuditStatus()+"%");
			}
			if(goods.getIsMarketable()!=null && goods.getIsMarketable().length()>0){
				criteria.andIsMarketableLike("%"+goods.getIsMarketable()+"%");
			}
			if(goods.getCaption()!=null && goods.getCaption().length()>0){
				criteria.andCaptionLike("%"+goods.getCaption()+"%");
			}
			if(goods.getSmallPic()!=null && goods.getSmallPic().length()>0){
				criteria.andSmallPicLike("%"+goods.getSmallPic()+"%");
			}
			if(goods.getIsEnableSpec()!=null && goods.getIsEnableSpec().length()>0){
				criteria.andIsEnableSpecLike("%"+goods.getIsEnableSpec()+"%");
			}
			if(goods.getIsDelete()!=null && goods.getIsDelete().length()>0){
				criteria.andIsDeleteLike("%"+goods.getIsDelete()+"%");
			}
	
		}
		
		Page<TbGoods> page= (Page<TbGoods>)goodsMapper.selectByExample(example);		
		return new PageResult(page.getTotal(), page.getResult());
	}
//批量修改状态
	@Override
	public void updateStatus(Long[] ids, String status) {
		for (Long id:ids){
			TbGoods tbGoods=goodsMapper.selectByPrimaryKey(id);
			tbGoods.setAuditStatus(status);
			goodsMapper.updateByPrimaryKey(tbGoods);
		}
	}

}
