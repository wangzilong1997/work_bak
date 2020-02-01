/**
 * @author wangzilong
 * @date 2020/1/10 18:20
 *
 * 获取到图片的拍摄方向////////////
 * 相机拍照返回base64编码  
 * base64ToArrayBuffer 传入base64编码转化为ArrayBuffer对象 
 * getOrientation 传入ArrayBuffer获取到相机拍照方向 
 */

angular.module("exif",[])
        .factory("exif",function () {
            return {
                //base64转ArrayBuffer对象
                base64ToArrayBuffer:function(base64) {
                    base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
                    let binary = atob(base64);
                    let len = binary.length;
                    let buffer = new ArrayBuffer(len);
                    let view = new Uint8Array(buffer);
                    for (let i=0;i < len;i++){
                        view[i] = binary.charCodeAt(i);
                    }
                    return buffer;
                },
                getOrientation:function (arrayBuffer) {
                    function getStringFromCharCode(dataView,start,length){
			console.log("getStringFromCharCode执行")
                        let str = '';
                        let i;
                        for(i=start,length+=start;i<length;i++){
                            str += String.fromCharCode(dataView.getUint8(i));
                        }
                        return str;
                    }
                    let dataView = new DataView(arrayBuffer);
                    let length = dataView.byteLength;
                    let orientation;
                    let exifIDCode;
                    let tiffOffset;
                    let firstIFDOffset;
                    let littleEndian;
                    let endianness;
                    let app1Start;
                    let ifdStart;
                    let offset;
                    let i;

                    if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8){
			console.log("dataView.getUint8(0)执行")
			console.log("length",length)
                        offset = 2;
                        while (offset < length) {
				//console.log("dataView.getUint8(offset)",dataView.getUint8(offset));
				//console.log("dataView.getUint8(offset) === 0xFF",dataView.getUint8(offset) === 0xFF);
				//console.log("dataView.getUint8(offset + 1)",dataView.getUint8(offset + 1));
				//console.log("dataView.getUint8(offset + 1) === 0xE1",dataView.getUint8(offset + 1) === 0xE1)
                            if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1){
				console.log("offset",offset);
                                app1Start = offset;
				console.log("app1Start",app1Start);
                                break;
                            }
                            offset++;
                        }
                    }
		
                    if(app1Start){
			console.log("(app1Start)执行")
                        exifIDCode = app1Start + 4;
                        tiffOffset = app1Start + 10;
                        if (getStringFromCharCode(dataView,exifIDCode,4) === 'Exif'){
                            endianness = dataView.getUint16(tiffOffset);
                            littleEndian = endianness === 0x4949;

                            if(littleEndian || endianness === 0x4D4D) {
                                if (dataView.getUint16(tiffOffset + 2,littleEndian) === 0x002A){
                                    firstIFDOffset = dataView.getUint32(tiffOffset + 4,littleEndian);
                                    if (firstIFDOffset >= 0x00000008){
                                        ifdStart = tiffOffset + firstIFDOffset;
                                    }
                                }
                            }
                        }
                    }
                    if (ifdStart){
			console.log("(ifdStart)执行")
                        length = dataView.getUint16(ifdStart,littleEndian);
                        for (i=0;i<length;i++){
                            offset = ifdStart + i * 12 + 2;
                            if (dataView.getUint16(offset,littleEndian) === 0x0112){
                                offset += 8;
                                orientation = dataView.getUint16(offset,littleEndian);

                                if (/(iPhone|iPod|iPad).*AppleWebKit/i.test(navigator.userAgent)){
                                    dataView.setUint16(offset,1,littleEndian);
                                }
                                break;
                            }
                        }
                    }
                    return orientation;
                }
            }
        });