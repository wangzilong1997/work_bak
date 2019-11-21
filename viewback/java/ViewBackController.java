package com.ztesoft.cq.community.controller;

import com.alibaba.fastjson.JSONObject;
import com.ztesoft.cq.base.controller.BaseController;
import com.ztesoft.cq.base.model.BaseRes;
import com.ztesoft.cq.community.model.FeedBackPicInfo;
import com.ztesoft.cq.community.model.MstSubdisViewback;
import com.ztesoft.cq.community.model.MstSubdisCompete;
import com.ztesoft.cq.community.model.MstSubdisFeedback;
import com.ztesoft.cq.community.service.UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author wangzilong
 * @date 2019/11/18 9:23
 */
@Controller
@RequestMapping(value = "/ViewBack")
public class ViewBackController extends BaseController{

    @Autowired
    private static String MAPPER_URL = "com.ztesoft.cq.community.mapper.MstSubdisViewbackMapper.";
    /**
     * 点赞接口
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value= "addAppraise",method = {RequestMethod.GET,RequestMethod.POST})
    public BaseRes addAppraise(HttpServletRequest request,@RequestParam Map<String, Object> param){
        System.out.println(param);
        Map<String, Object> paramMap = getParameterMap(request);
        System.out.println(paramMap);
        Map<String, Object> map = new HashMap<String, Object>();
        List<Map<String, Object>> hadinsert = baseService.queryForList(MAPPER_URL+"queryAppraise", paramMap);

        System.out.println(hadinsert);

        if(hadinsert.size() == 0){
            System.out.println("并没有记录");
            List<Map<String, Object>> insert = baseService.queryForList(MAPPER_URL+"addAppraise", paramMap);
            //不拥有权限返回nopower
            map.put("power","false");
        } else if (hadinsert.size() >= 1){
            System.out.println("拥有记录");
            List<Map<String, Object>> updata = baseService.queryForList(MAPPER_URL+"updataAppraise", paramMap);
            //拥有权限返回power
            map.put("power","true");
        }

        //返回false代表之前并没有数据返回true代表之前有数据并覆盖掉之前的数据
        return BaseRes.getSuccess(map);
    }
    /**
     * 完成通过接口
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value= "delViewBack",method = {RequestMethod.GET,RequestMethod.POST})
    public BaseRes delViewBack(HttpServletRequest request,@RequestParam Map<String, Object> param){
        System.out.println(param);
        Map<String, Object> paramMap = getParameterMap(request);
        System.out.println(paramMap);
        Map<String, Object> map = new HashMap<String, Object>();
        List<Map<String, Object>> power = baseService.queryForList(MAPPER_URL+"power", paramMap);
        System.out.println(power);

        if(power.size() == 0){
            System.out.println("并没有权限");
            //不拥有权限返回nopower
            map.put("power","false");
        } else if (power.size() >= 1){
            System.out.println("拥有权限");
            List<Map<String, Object>> passAudit = baseService.queryForList(MAPPER_URL+"delViewBack", paramMap);
            //拥有权限返回power
            map.put("power","true");
        }


        return BaseRes.getSuccess(map);
    }
    /**
     * 完成通过接口
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value= "ManageOver",method = {RequestMethod.GET,RequestMethod.POST})
    public BaseRes ManageOver(HttpServletRequest request,@RequestParam Map<String, Object> param){
        System.out.println(param);
        Map<String, Object> paramMap = getParameterMap(request);
        System.out.println(paramMap);
        Map<String, Object> map = new HashMap<String, Object>();
        List<Map<String, Object>> power = baseService.queryForList(MAPPER_URL+"power", paramMap);
        System.out.println(power);

        if(power.size() == 0){
            System.out.println("并没有权限");
            //不拥有权限返回nopower
            map.put("power","false");
        } else if (power.size() >= 1){
            System.out.println("拥有权限");
            List<Map<String, Object>> passAudit = baseService.queryForList(MAPPER_URL+"passOver", paramMap);
            //拥有权限返回power
            map.put("power","true");
        }


        return BaseRes.getSuccess(map);
    }
    /**
     * 审批通过接口
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value= "ManageAudit",method = {RequestMethod.GET,RequestMethod.POST})
    public BaseRes ManageAudit(HttpServletRequest request,@RequestParam Map<String, Object> param){
        System.out.println(param);
        Map<String, Object> paramMap = getParameterMap(request);
        System.out.println(paramMap);
        Map<String, Object> map = new HashMap<String, Object>();
        List<Map<String, Object>> power = baseService.queryForList(MAPPER_URL+"power", paramMap);
        System.out.println(power);

        if(power.size() == 0){
            System.out.println("并没有权限");
            //不拥有权限返回nopower
            map.put("power","false");
        } else if (power.size() >= 1){
            System.out.println("拥有权限");
            List<Map<String, Object>> passAudit = baseService.queryForList(MAPPER_URL+"passAudit", paramMap);
            //拥有权限返回power
            map.put("power","true");
        }


        return BaseRes.getSuccess(map);
    }
    /**
     * 意见列表查询
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "list",method = {RequestMethod.GET,RequestMethod.POST})
    public BaseRes updateData(HttpServletRequest request,@RequestParam Map<String, Object> param){
        System.out.println(param);
        Map<String, Object> paramMap = getParameterMap(request);
        System.out.println(paramMap);
        Map<String, Object> map = null;
        List<Map<String, Object>> power = baseService.queryForList(MAPPER_URL+"power", paramMap);

        System.out.println(power);
        if(power.size() == 0){
            System.out.println("并没有权限");
            map = baseService.queryForPage(MAPPER_URL+"querySome", paramMap);
            //不拥有权限返回nopower
            map.put("power","false");
        } else if (power.size() >= 1){
            System.out.println("拥有权限");
            map = baseService.queryForPage(MAPPER_URL+"queryAll", paramMap);
            //拥有权限返回power
            map.put("power","true");
        }
        return BaseRes.getSuccess(map);
    }
    /**
     * 新增意见接口
     * @param request
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "addData",method = {RequestMethod.GET,RequestMethod.POST})
    public BaseRes addData(HttpServletRequest request, @RequestParam Map<String, Object> param){

        System.out.println(param);
        MstSubdisViewback mstSubdisViewback = new MstSubdisViewback();
        mstSubdisViewback.setTitle(param.get("viewBackTitle").toString());
        mstSubdisViewback.setContent(param.get("viewBackContent").toString());
        mstSubdisViewback.setContact(param.get("viewBackPhone").toString());
        mstSubdisViewback.setCrtUser(Long.parseLong(param.get("login_user_id").toString()));
        baseService.getSqlSession().insert(MAPPER_URL+"addViewBackInfo",mstSubdisViewback);

        return BaseRes.getSuccess("true");
    }
}
