package com.pinyougou.manager.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/login")
public class loginShowName {

    @RequestMapping("/getLoginName.do")
    public Map getShowName(){
        Map map=new HashMap();
       String name= SecurityContextHolder.getContext().getAuthentication().getName();
       map.put("name",name);
        System.out.println("111"+map);
        return map;
    }
}
