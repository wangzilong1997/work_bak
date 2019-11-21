/**
 * @author wangzilong
 * @date 2019/11/19 9:40
 *
 * <div>
 *     <input type="file" id="fileData" accept="image/*" class="file-input"/>
 *     <div id = "input_imgs"></div>
 * </div>
 *
 *
 * input框图片预览功能组件
 * 如果你想用这个组件请把iput框id设置为fileData
 * 并且在module require 里面加入upLoadPicAndPreview 配置
 * 参照View_back.js
 *
 * PicAndPreview 实现图片预览功能
 */

angular.module("upLoadPicAndPreview",['ionic', 'myservices'])
    .factory("upLoadPicAndPreview",function ($ionicPopup, MyDialog) {
        return {
            PicAndPreview:function () {
                console.log("upLoadPicAndPreview执行");
                let list = [];
                console.log(document.getElementById("fileData"));
                document.getElementById("fileData").addEventListener("change",function (event) {
                    console.log("上传图片窗口变化");
                    let reads = new FileReader();
                    let input_imgs = document.getElementById("input_imgs");
                    let input_img_name = event.target.files[0].name;
                    console.log(input_img_name);
                    reads.readAsDataURL(event.target.files[0]);
                    console.log(reads);

                    reads.onload = function (e) {
                        let img_test = new Image();
                        img_test.src = this.result;
                        let div = document.createElement("div");
                        div.setAttribute("style", "display: inline; margin:0 10px;");
                        let img = new Image();
                        img.setAttribute('src', this.result);
                        img.setAttribute('height', '125px;');
                        img.setAttribute('name', input_img_name);
                        img_test.onload = function () {
                            let basewidth = this.width;
                            let baseheight = this.height;
                            console.log(baseheight);
                            console.log(basewidth);
                            img.onload = function () {
                                //每张图片添加点击事件
                                if (input_imgs.childNodes.length < 3) {
                                    this.addEventListener("click", function () {
                                        let confirmPopup = $ionicPopup.confirm({
                                            title: '提示',
                                            template: '确认是否删除',
                                            cancelText: '取消',
                                            okText: '确定'
                                        });
                                        confirmPopup.then(function (res) {
                                            if (res) {
                                                this.parentNode.remove();
                                                let file_empty = document.getElementById('fileData');
                                                file_empty.value = "";
                                            }

                                        }.bind(this));
                                    });
                                    console.log("图片加载成功");
                                    //将图片添加到新建div
                                    div.appendChild(this);
                                    let button = document.createElement("BUTTON");
                                    let text = document.createTextNode("点击图片删除");
                                    button.setAttribute("style", "color:red;background-color: rgba(255,255,255,0.6);;" +
                                        "margin-left:-5.589rem;border-radius:.1rem;margin-top:8rem;vertical-align:top !important;");
                                    button.appendChild(text);

                                    div.appendChild(button);
                                    document.getElementById("input_imgs").appendChild(div);

                                } else {
                                    MyDialog.alert("图片不能超过三张！")
                                }
                                //进行压缩部分
                                let canvas = document.createElement('canvas');
                                let context = canvas.getContext('2d');
                                console.log(baseheight);
                                console.log(basewidth);
                                // 图片原始尺寸
                                let originWidth = basewidth;
                                let originHeight = baseheight;
                                // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
                                let maxWidth = 800, maxHeight = 800;
                                // 目标尺寸
                                let targetWidth = originWidth, targetHeight = originHeight;
                                // 图片尺寸超过400x400的限制
                                if (originWidth > maxWidth || originHeight > maxHeight) {
                                    if (originWidth / originHeight > maxWidth / maxHeight) {
                                        // 更宽，按照宽度限定尺寸
                                        targetWidth = maxWidth;
                                        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                                    } else {
                                        targetHeight = maxHeight;
                                        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                                    }
                                }
                                canvas.width = targetWidth;
                                canvas.height = targetHeight;
                                // 核心JS就这个
                                context.drawImage(img, 0, 0, targetWidth, targetHeight);
                                let base64File = canvas.toDataURL('image/jpeg');
                                img.setAttribute('id', base64File)

                            }
                        }

                    }


                })
            }
        }
    });
