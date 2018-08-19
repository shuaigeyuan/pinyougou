package com.pinyougou.shop.service;

import com.pinyougou.pojo.TbSeller;
import com.pinyougou.sellergoods.service.SellerService;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;

public class ShopUserDetailServiceImpl implements UserDetailsService{

    private SellerService sellerService;

    public void setSellerService(SellerService sellerService) {
        this.sellerService = sellerService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("经过了UserDetailsServiceImpl");
        //构建角色列表，设置权限
        List<GrantedAuthority> grantedAuthorities = AuthorityUtils.commaSeparatedStringToAuthorityList("ROLE_SELLER");
        //根据用户名从数据库获取用户数据
        TbSeller tbSeller = sellerService.findOne(username);
        System.out.println(tbSeller);
        //判断 用户名是否已经登陆
        if (tbSeller == null) {
                throw new UsernameNotFoundException("username not found");
            }
        if (!"1".equals(tbSeller.getStatus())) {
            throw new UsernameNotFoundException("username not found");
        }
        return new User(username, tbSeller.getPassword(), grantedAuthorities);
    }
    /*@Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
       //设置权限
          List<GrantedAuthority> grantedAuthorities = AuthorityUtils.commaSeparatedStringToAuthorityList("ROLE_SELLER");
        //匹配验证入门（spring security来自动完成验证）
        return new User(username,"123456",grantedAuthorities);
    }*/
}
