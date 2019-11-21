/**
 * @author wangzilong
 * @date 2019/11/15 20:46
 */

angular.module("view_back_item",['ionic', 'myservices'])
        .controller("view_back_item_ctrl",function ($stateParams,$rootScope, $scope,$ionicModal, MyDialog, $ionicPopup, HttpUtil,$state) {
            console.log("view_back_item_ctrl 页面进入");
            console.log($stateParams.msg);
            $scope.viewBackitemdata = [];
            $scope.viewBackitemdata =JSON.parse($stateParams.msg);

            $scope.Appraised = "0";



            //只有点赞部分交互
            $ionicModal.fromTemplateUrl('m-view-back.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.manageItem = modal;
            });

            $scope.managePower = function () {
                console.log("managePower被点击");
                console.log("$scope.viewBackitemdata",$scope.viewBackitemdata.power)
               /* $scope.manageItem.remove();
                $ionicModal.fromTemplateUrl('m-view-back.html', {
                    scope: $scope
                }).then(function (modal) {
                    $scope.manageItem = modal;
                });*/

                $scope.manageItem.show();
            };

            $scope.closePower = function () {
                $scope.manageItem.hide();
            };

            //管理员三大行为
            $scope.passAudit = function(){
                //完成点击后就关闭模态窗口
                $scope.closePower();
                console.log("通过审核被点击");
                let confirmPopup = $ionicPopup.confirm({
                    title: '提示',
                    template: '确认是否通过审核该建议',
                    cancelText: '取消',
                    okText: '确定'
                });
                confirmPopup.then(function (res) {

                    if (res) {
                       console.log("res",res);
                       console.log("$scope.viewBackitemdata",$scope.viewBackitemdata.blogid);
                       let auditdata = {};
                       auditdata.blogid = $scope.viewBackitemdata.blogid;
                       console.log(auditdata);
                       HttpUtil.ajax2({
                            url: '/ViewBack/ManageAudit',
                            data:auditdata,
                            success: function (data) {
                                console.log("成功",data);
                                console.log(data.power);
                                if(data.power == "true"){
                                    console.log("修改成功");


                                }

                            },
                            error:function (res) {
                                console.log("错误",res)
                            }
                        }).then(
                           () => {

                               console.log("调用结束");
                               $state.go('tab.view-back');
                           }
                       );

                    }
                })
            };
            $scope.delViewBack = function(){
                //完成点击后就关闭模态窗口
                $scope.closePower();
                console.log("删除被点击");
                let confirmPopup = $ionicPopup.confirm({
                    title: '提示',
                    template: '确认是否删除该建议',
                    cancelText: '取消',
                    okText: '确定'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        console.log("res",res);
                        console.log("$scope.viewBackitemdata",$scope.viewBackitemdata.blogid);
                        let auditdata = {};
                        auditdata.blogid = $scope.viewBackitemdata.blogid;
                        console.log(auditdata);
                        HttpUtil.ajax2({
                            url: '/ViewBack/delViewBack',
                            data:auditdata,
                            success: function (data) {
                                console.log("成功",data);
                                console.log(data.power);
                                if(data.power == "true"){
                                    console.log("修改成功")
                                }

                            },
                            error:function (res) {
                                console.log("错误",res)
                            }
                        }).then(
                            () => {
                                console.log("调用结束");
                                $state.go('tab.view-back');
                            }
                        );
                    }
                })
            };
            $scope.passOver = function(){
                //完成点击后就关闭模态窗口
                $scope.closePower();
                console.log("已解决被点击");
                let confirmPopup = $ionicPopup.confirm({
                    title: '提示',
                    template: '确认是否完成该建议',
                    cancelText: '取消',
                    okText: '确定'
                });
                confirmPopup.then(function (res) {

                    if (res) {
                        console.log("res",res);
                        console.log("$scope.viewBackitemdata",$scope.viewBackitemdata.blogid);
                        let auditdata = {};
                        auditdata.blogid = $scope.viewBackitemdata.blogid;
                        console.log(auditdata);
                        HttpUtil.ajax2({
                            url: '/ViewBack/ManageOver',
                            data:auditdata,
                            success: function (data) {
                                console.log("成功",data);
                                console.log(data.power);
                                if(data.power == "true"){
                                    console.log("修改成功")
                                }

                            },
                            error:function (res) {
                                console.log("错误",res)
                            }
                        }).then(
                            () => {
                                console.log("调用结束");
                                $state.go('tab.view-back');
                            }
                        );
                    }
                })
            };

            /*function goauditapi() {
                let auditdata = {};
                auditdata.blogid = $scope.viewBackitemdata.blogid;
                console.log(auditdata);
                HttpUtil.ajax2({
                    url: '/ViewBack/ManageAudit',
                    data:auditdata,
                    success: function (data) {
                        console.log("成功",data);

                    },
                    error:function (res) {
                        console.log("错误",res)
                    }
                }).then(
                    console.log("调用结束")
                );
            }
            goauditapi();*/

            $scope.addAppraise = function () {
                console.log("支持一下被点击");
                if($scope.Appraised == "0"){
                    var confirmPopup = $ionicPopup.confirm({
                        title: '提示',
                        template: '确认是否赞同该建议',
                        cancelText: '取消',
                        okText: '确定'
                    });
                }else {
                    var confirmPopup = $ionicPopup.confirm({
                        title: '提示',
                        template: '是否取消赞同该建议',
                        cancelText: '取消',
                        okText: '确定'
                    });
                }

                confirmPopup.then(function (res) {

                    if (res) {
                        console.log("res",res);
                        console.log("$scope.viewBackitemdata",$scope.viewBackitemdata.blogid);
                        let auditdata = {};
                        auditdata.blogid = $scope.viewBackitemdata.blogid;
                        $scope.Appraised = $scope.Appraised == "0" ? "1":"0";
                        console.log("$scope.Appraised$scope.Appraised",$scope.Appraised);
                        auditdata.Appraise = $scope.Appraised;
                        console.log(auditdata);
                        HttpUtil.ajax2({
                            url: '/ViewBack/addAppraise',
                            data:auditdata,
                            success: function (data) {
                                console.log("成功",data);
                            },
                            error:function (res) {
                                console.log("错误",res)
                            }
                        }).then(
                            () => {
                                console.log("调用结束");
                                let viewbacksupport = document.getElementsByClassName("view_back_item_support");
                                if ($scope.Appraised == "1"){

                                    viewbacksupport[0].style.background = "#0c60ee";
                                    viewbacksupport[0].childNodes[1].childNodes[2].textContent = "已支持";
                                    console.log(viewbacksupport[0].childNodes[1].childNodes[2].textContent);
                                }else {
                                    viewbacksupport[0].style.background = "#ffffff";
                                    viewbacksupport[0].childNodes[1].childNodes[2].textContent = "支持一下";
                                    console.log(viewbacksupport[0].childNodes[1].childNodes[2].textContent);
                                }

                            }
                        );
                    }
                })
            }

        });