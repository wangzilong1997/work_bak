
angular.module('custInfo', ['ionic', 'myservices','exif'])

  
    .controller('CustInfoCtrl', function ($scope, $stateParams, $state, $rootScope, $timeout, $ionicHistory, $ionicScrollDelegate, $ionicModal, $ionicPopover, $ionicLoading, $sce, PageQuery, HttpUtil, MyDialog, $ionicPopup, MyApp,$window,exif) {
 
       
		//点击拍照调用这个方法
        $scope.takephoto = function () {
            
            console.log("takephoto点击")
            /*清空canvas数据*/
            var images = document.getElementById('myImage');
            var content = images.getContext('2d');
            console.log(content);console.log(content.height);
            content.height = content.height;
            content.clearRect(0,0,400,600);
            if (navigator.camera){
                var image = document.getElementById('myImage');
                navigator.camera.getPicture(onSuccess,onFail,{
                    quality:100,
                    destinationType:Camera.DestinationType.DATA_URL
                });
            }
            console.log(navigator.camera);
			//拍照成功的回调函数
            function onSuccess(imageData) {
		
                var images = document.getElementById('myImage');
                var temp64 = "data:image/jpeg;base64," + imageData;
                var newImage = new Image();

                let btab = exif.base64ToArrayBuffer(temp64);
                console.log("base64ToArrayBuffer",btab);
                let orbtab = exif.getOrientation(btab);
                alert(orbtab)
                console.log("getOrientation",exif.getOrientation(btab));
                newImage.src = temp64;
                console.log("拍照所得6666",imageData);
                console.log("rootscrope",$rootScope.params);
                var content = images.getContext('2d');
                let date = new Date();
                console.log(date);
                let dateStr = date.getFullYear()+ '年'+ (date.getMonth() + 1) + '月'+date.getDate() + '日' + (date.getHours())+ ':' + date.getMinutes()+ ':' +date.getSeconds()
                console.log($scope.custSaleLangList)
                console.log(dateStr)
                newImage.onload = function(){
                    console.log('sdsadasthis',this);
                    console.log('width',this.width);
                    console.log('height',this.height);
                    var Iwidth = this.width;
                    var Iheight = this.height;
                    while(Iwidth  > 400){
                        Iwidth = Iwidth/1.25;
                        Iheight = Iheight/1.25;
                    }
                    if(orbtab == 1 || !orbtab){
                        //
                        //摄像标志在右边exif为1 或者不是相机所拍
                        content.save()
                        console.log("Iwidth",Iwidth)
                        console.log("Iheight",Iheight)
                        content.drawImage(newImage,0,0,Iwidth ,Iheight) ;

                        content.font = "14px 微软雅黑";
                        content.fillStyle = 'rgba(255,0,0,0.8)';
                        content.fillText('创建人ID: ' + $rootScope.params.login_user_name,20,Iheight  - 80 );
                        content.fillText('创建人TEL:' + $rootScope.params.login_mobile,20,Iheight  - 60);
                        content.fillText('创建时间:' + dateStr,20,Iheight  - 40);
                        content.fillText('订单IP:'+$scope.custSaleLangList[0].ACC_NBR,20,Iheight  - 20);
                        content.restore();
                        //images.setAttribute("width",Iwidth+1);
                        //images.setAttribute("height",Iheight+1);
                        $scope.gotodoorphoto = images.toDataURL('image/png', 1 );
                        console.log($scope.gotodoorphoto);
                    }else if(orbtab == 6){
                        //摄像标志在下边exif为6
                        content.save()
                        content.rotate(Math.PI / 2);
                        content.translate(0 ,-Iwidth);
                        content.drawImage(newImage,0,0,Iwidth ,Iheight) ;
                        content.rotate(-Math.PI / 2);
                        content.translate(0 ,Iwidth)
                        content.font = "14px 微软雅黑";
                        content.fillStyle = 'rgba(255,0,0,0.8)';
                        content.fillText('创建人ID: ' + $rootScope.params.login_user_name,-Iheight,-80);
                        content.fillText('创建人TEL:' + $rootScope.params.login_mobile,-Iheight,-60);
                        content.fillText('创建时间:' + dateStr,-Iheight,-40);
                        content.fillText('订单IP:'+$scope.custSaleLangList[0].ACC_NBR,-Iheight,-20);
                        content.restore();
                        $scope.gotodoorphoto = images.toDataURL('image/png', 1 );
                        console.log($scope.gotodoorphoto);
                    }else if (orbtab == 3){
                        //摄像标志在左边exif为3
                        content.save()
                        console.log("Iwidth",Iwidth)
                        console.log("Iheight",Iheight)
                        content.rotate(Math.PI);
                        content.translate(-Iwidth ,-Iheight)
                        content.drawImage(newImage,0,0,Iwidth ,Iheight) ;
                        content.rotate(-Math.PI);
                        content.translate(Iwidth ,Iheight)
                        content.font = "14px 微软雅黑";
                        content.fillStyle = 'rgba(255,0,0,0.8)';
                        content.fillText('创建人ID: ' + $rootScope.params.login_user_name,-Iwidth*2,-Iheight-80);
                        content.fillText('创建人TEL:' + $rootScope.params.login_mobile,-Iwidth*2,-Iheight-60);
                        content.fillText('创建时间:' + dateStr,-Iwidth*2,-Iheight-40);
                        content.fillText('订单IP:'+$scope.custSaleLangList[0].ACC_NBR,-Iwidth*2,-Iheight-20);
                        content.restore();
                        $scope.gotodoorphoto = images.toDataURL('image/png', 1 );
                        console.log($scope.gotodoorphoto);
                    }else{
                        MyDialog.alert("请正常横屏竖屏拍照")
                    }

                }
            }
			//拍照失败的回调函数
            function onFail(message) {
                MyDialog.alert('Failed beacuse:' + message);
            }
        };


     })


 