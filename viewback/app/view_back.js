/**
 * @author wangzilong
 * @date 2019/11/15 11:51
 */
angular.module("ViewBack",['ionic', 'myservices',"view_back_item","upLoadPicAndPreview"])
    .controller('viewBackCtrl', function ($rootScope, $scope, $state,$ionicModal, HttpUtil ,$timeout,MyDialog,$ionicPopup,upLoadPicAndPreview) {
        console.log("意见反馈页面进入");
        $scope.viewbacksearch = "";
        //获取全部的数据
        $scope.reallydata = [];
        //获取未解决部分的数据
        $scope.WillSolveData = [];
        //获取未审核部分的数据
        $scope.WillAuditData = [];
        //获取已解决部分的数据
        $scope.AlreadySolveData = [];

        $scope.lastitem = "";

        //根据点击显示数据
        $scope.show = {WillSolve:true,AlreadySolve:false,WillAudit:false};

        //模态窗口获取数据部分
        $scope.modalparams = {
            title:"",
            content:"",
            phone:"",
        };

        //判断用户是否拥有权限
        $scope.power = "";

        //为查找关键字input框绑定事件
        //筛选想要查询的问题

        $scope.changeview = function(){
            console.log(this.viewbacksearch);
            console.log($scope.lastitem);
            //如果数组输入的为空了则重置数组
            if (this.viewbacksearch != ""){
                if (this.viewbacksearch.length > $scope.lastitem.length){
                    console.log("新增长度")
                    //更新真的数组
                    let fack = [];
                    //console.log($scope.reallydata);
                    for (var i=0;i<$scope.reallydata.length;i++){
                        //console.log($scope.reallydata[i].title);
                        let t = String($scope.reallydata[i].title);
                        //console.log(typeof(t));
                        //console.log(t.indexOf(this.viewbacksearch))
                        if (t.indexOf(this.viewbacksearch) != -1){
                            fack.push($scope.reallydata[i]);
                        }else{
                            continue
                        }
                        //console.log(fack);
                    }
                    $scope.reallydata = fack;
                    //三部分数据刷新
                    dealdata($scope.reallydata);
                } else {
                    console.log("减少长度执行");
                    console.log(this.viewbacksearch);
                    HttpUtil.ajax2({
                        url: '/ViewBack/list',
                        success: function (data) {
                            console.log("成功",data)
                            console.log(data.rows);
                            $scope.reallydata = data.rows;

                        },
                        error:function (res) {
                            console.log("错误",res)
                        }
                    }).then(
                        ()=>{
                            console.log("promise执行完成");
                            //更新真的数组
                            let fack = [];
                            //console.log($scope.reallydata);
                            for (var i=0;i<$scope.reallydata.length;i++){
                                //console.log($scope.reallydata[i].title);
                                let t = String($scope.reallydata[i].title);
                                //console.log(typeof(t));
                                //console.log(t.indexOf(this.viewbacksearch))
                                if (t.indexOf(this.viewbacksearch) != -1){
                                    fack.push($scope.reallydata[i]);
                                }else{
                                    continue
                                }
                                //console.log(fack);
                            }
                            $scope.reallydata = fack;
                            //三部分数据刷新
                            dealdata($scope.reallydata);
                        }
                    );
                    //结束刷新
                    $scope.$broadcast('scroll.refreshComplete');

                    /*let promise = new Promise(function(resolve){
                        console.log("promise执行")
                        $scope.doRefresh();
                        resolve();
                    });
                    promise.then(
                        ()=>{
                            console.log("promise执行完成");
                            //更新真的数组
                            let fack = [];
                            //console.log($scope.reallydata);
                            for (var i=0;i<$scope.reallydata.length;i++){
                                //console.log($scope.reallydata[i].title);
                                let t = String($scope.reallydata[i].title);
                                //console.log(typeof(t));
                                //console.log(t.indexOf(this.viewbacksearch))
                                if (t.indexOf(this.viewbacksearch) != -1){
                                    fack.push($scope.reallydata[i]);
                                }else{
                                    continue
                                }
                                //console.log(fack);
                            }
                            $scope.reallydata = fack;
                        }
                    )*/
                }

            } else {
                $scope.doRefresh();
            }
            $scope.lastitem = this.viewbacksearch;

        };


        //跳转到详情界面
        $scope.goitem = function (msg) {

            //把类型也传到详情页面
            if ($scope.show.WillSolve){
                console.log("未解决被点击");
                msg.type = "未解决";
            }
            if ($scope.show.WillAudit){
                console.log("待审核被点击");
                msg.type = "待审核";
            }
            if ($scope.show.AlreadySolve){
                console.log("已解决被点击");
                msg.type = "已解决";
            }
            msg.power = $scope.power;
            msg = JSON.stringify(msg);
            $state.go('tab.view-back-item', {msg:msg});
            console.log('msggggggggggggggggggggggggg',msg);
        };
        //刷新并且请求数据
        $scope.doRefresh = function () {
            console.log("dorefresh执行");
            HttpUtil.ajax2({
                url: '/ViewBack/list',
                data:{},
                success: function (data) {
                    console.log("成功",data);
                    console.log(data.rows);
                    $scope.power = data.power;
                    console.log("$scope.power",$scope.power);
                    $scope.reallydata = data.rows;
                    dealdata($scope.reallydata)

                },
                error:function (res) {
                    console.log("错误",res)
                }
            }).then(
                console.log("调用结束")
            );
            //结束刷新
            $scope.$broadcast('scroll.refreshComplete');
        };

        //处理数据分为三部分的函数
        function dealdata(data){
            //防止数据重复
            $scope.WillSolveData = [];
            $scope.WillAuditData = [];
            $scope.AlreadySolveData = [];
            console.log(data.length);
            for (var i=0;i<data.length;i++){
                if (data[i].is_solve == "0" && data[i].is_audit == "0"){
                    console.log("进入待审核目录");
                    $scope.WillAuditData.push(data[i]);
                    continue
                }
                if (data[i].is_solve == "0" && data[i].is_audit == "1"){
                    console.log("进入未解决目录");
                    $scope.WillSolveData.push(data[i]);
                    continue
                }
                if (data[i].is_solve == "1" && data[i].is_audit == "1"){
                    console.log("进入已经解决目录");
                    $scope.AlreadySolveData.push(data[i]);
                    continue
                }
            }
            console.log("进入已经解决目录",$scope.AlreadySolveData);
            console.log("进入未解决目录",$scope.WillSolveData);
            console.log("进入待审核目录",$scope.WillAuditData);
        }
        //模态窗口部分
        $ionicModal.fromTemplateUrl('add-view-back.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.ViewBackitem = modal;
        });
        $scope.openViewBack = function () {
            console.log("addViewBack被点击");
            $scope.ViewBackitem.show();

            //加载外部文件调用公用上传图片方法
            $scope.modalPicAndPreview();
        };
        $scope.closeModal = function () {
            $scope.ViewBackitem.hide();
            //防止图片上传部分残留
            $scope.ViewBackitem.remove();
            $ionicModal.fromTemplateUrl('add-view-back.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.ViewBackitem = modal;
            });
            //刷新数据
            $scope.doRefresh();
        };

        //用户添加新增问题反馈
        $scope.addViewBack = function () {
            console.log("提交按钮被点击");
            console.log($scope.modalparams.title);
            console.log($scope.modalparams.content);
            console.log($scope.modalparams.phone);
            let activitInfo = {};
            activitInfo.viewBackTitle =  $scope.modalparams.title;
            activitInfo.viewBackContent = $scope.modalparams.content;
            activitInfo.viewBackPhone = $scope.modalparams.phone;
            console.log(activitInfo);

            if((activitInfo.viewBackTitle == "" || activitInfo.viewBackContent == "") || activitInfo.viewBackPhone == ""){
                MyDialog.alert("标题、内容、联系方式为必填项");
                return false;
            }

            HttpUtil.ajax2({
                url: '/ViewBack/addData',
                data: activitInfo,
                success: function (data) {
                    if (data != null) {
                        MyDialog.alert('上传成功', function () {
                            $scope.ViewBackitem.hide();

                        });
                    }
                },
                error:function (err) {
                    console.log("上传失败");
                    console.log(err);
                    MyDialog.alert('上传失败', function () {
                        $scope.ViewBackitem.hide();

                    });
                }

            }).then(()=>{
                //模态窗口获取数据部分
                $scope.modalparams = {
                    title:"",
                    content:"",
                    phone:"",
                };
                //防止模态窗口重复加载
                $scope.ViewBackitem.remove();
                $ionicModal.fromTemplateUrl('add-view-back.html', {
                    scope: $scope
                }).then(function (modal) {
                    $scope.ViewBackitem = modal;
                });
                //无论成功失败刷新数据
                $scope.doRefresh();
            })

        };

        //请求接口数据部分
        //未解决接口
        $scope.getWillSolve = function () {
            //$scope.reallydata.length = Math.ceil($scope.reallydata.length /2);
            console.log("请求未解决接口");
            console.log($scope.WillSolveData);
            $scope.show.AlreadySolve = false;
            $scope.show.WillSolve = true;
            $scope.show.WillAudit = false;
            $scope.$broadcast('scroll.refreshComplete');

        };
        //已解决接口
        $scope.getAlreadySolve = function () {
            //$scope.reallydata.length = Math.ceil($scope.reallydata.length /2);
            console.log("已解决接口调用");
            console.log($scope.AlreadySolveData);
            $scope.show.AlreadySolve = true;
            $scope.show.WillSolve = false;
            $scope.show.WillAudit = false;
            $scope.$broadcast('scroll.refreshComplete');

        };
        //待审核接口
        $scope.getWillAudit = function () {
           // $scope.reallydata.length = Math.ceil($scope.reallydata.length /2);
            $scope.show.AlreadySolve = false;
            $scope.show.WillSolve = false;
            $scope.show.WillAudit = true;
            console.log("请求待审核接口");
            console.log($scope.WillAuditData);
            $scope.$broadcast('scroll.refreshComplete');

        };

        $scope.init = function () {
            let sum = $(".viewBackTypeList").length;
            $(".viewBackTypeList")[0].style.borderBottom = "solid 2px #00aced";
            for (var i=0;i<sum;i++){
                $(".viewBackTypeList")[i].addEventListener("click",function () {
                    //操作dom完成属性改变
                    if (this.style.borderBottom == ""){
                        for (var i=0;i<6;i++){
                            if(i%2){
                                //取到div节点并且全赋值为空
                                this.parentElement.childNodes[i].style.borderBottom = "";
                            }
                        }
                        this.style.borderBottom = "solid 2px #00aced";

                    } else {
                        this.style.borderBottom = "solid 2px #00aced";
                    }

                    //点击请求数据部分
                    //判断应该请求的接口

                    let ins = this.innerHTML.replace(/^\s*|\s*$/g,"");
                    console.log(ins);
                    if(ins == "已解决"){
                        $scope.getAlreadySolve();

                    }else if(ins == "未解决"){
                        $scope.getWillSolve();

                    }else if(ins == "待审核"){
                        $scope.getWillAudit();

                    }

                })
            }
            //初始化的时候进行请求第一次数据
            $scope.doRefresh();
        };
        $scope.init();


        $scope.modalPicAndPreview = function(){
            console.log("模态窗口处理部分");
            console.log(upLoadPicAndPreview);
            upLoadPicAndPreview.PicAndPreview();
            /*//模态窗口处理部分
            //动态加载外部js中的需要的图片预览方法
            console.log("模态窗口部分执行");
            //document.head.write("<script language=javascript src='../www/components/common/upLoadPicAndPreview.js'></script>");
            let new_element = document.createElement("script");
            new_element.setAttribute("type", "text/javascript");

            new_element.onload = new_element.onreadystatechange = function(){
                if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete" ) {
                    // Handle memory leak in IE
                    new_element.onload = new_element.onreadystatechange = null;
                 };
        };

            new_element.setAttribute("src", "../www/components/common/upLoadPicAndPreview.js");
            document.head.appendChild(new_element);
            //console.log(document.head)*/
        };
        $scope.$on('$locationChangeStart', function(event, next, current) {
            //expression
            console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
            $scope.doRefresh();
        });


    });