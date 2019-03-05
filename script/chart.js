var url = 'http://47.98.53.200:5000/' ;

// 折线图
var LineChart = {
    setData: function(canId, data, padding, lineColors, dotColor, isBg, isMultiData, xkedu) {
        this.lineColors = lineColors;
        this.dotColor = dotColor;
        this.can = document.getElementById(canId);
        this.ctx = this.can.getContext("2d");
        this.isBg = isBg;
        this.isMultiData = isMultiData;
        this.drawXY(data, 0, padding, this.can, xkedu, lineColors);

    },
    update: function(data){
      var perwidth = 30; //x 轴每一个数据占据的宽度
      var maxY = this.getMax(data, 0, this.isMultiData); //获得Y轴上的最大值
      var ylimt = this.getYLimtByMaxData(maxY).ylimt; // y轴 刻度
      var yPixel = this.getYPixel(maxY, can.height, padding, ylimt).pixel; // y轴 刻度之间的间距
      var yCanMove = 8; //整体向下走 解决到顶部的问题
      this.drawData(data, 0, padding, perwidth, yPixel, this.isMultiData, this.lineColors, ylimt, this.can, yCanMove);
    },
    //是否是多条数据线
    isMultiData: function(data) {
        if (data.values.length > 1) {
            this.isMultiData = true;
        }
    },
    //绘制XY坐标值及坐标线 背景线
    drawXY: function(data, key, padding, can, xkedu, lineColors) {
        this.ctx.font = '14px';
        var perwidth = 30; //x 轴每一个数据占据的宽度
        can.width = this.getCoordX(padding, perwidth, data.values[0].value0.length); //canvas的宽度
        var maxY = this.getMax(data, 0, this.isMultiData); //获得Y轴上的最大值
        var ylimt = this.getYLimtByMaxData(maxY).ylimt; // y轴 刻度
        var yPixel = this.getYPixel(maxY, can.height, padding, ylimt).pixel; // y轴 刻度之间的间距
        can.height = yPixel * (ylimt.length - 1) + padding; // y轴图像真实的高度  解决：yPixel改变， 总体高度改变问题
        var yCanMove = 8; //整体向下走 解决到顶部的问题
        // // 一个x刻度对应4个值
        /*for( var i=0;i<xkedu.length;i++ ){
            var dotxlimt = this.getCoordX(padding,perwidth,2) - this.getCoordX(padding,perwidth,1); // 每个点之间横坐标的差值
            var x_x = perwidth + perwidth * 4 * i + padding;// x刻度的横坐标
            var x_y = can.height-padding+20 + yCanMove;
            this.ctx.fillStyle = '#fff';
            this.ctx.fillText(xkedu[i], x_x, x_y, 100);
        }*/
        // 每个x刻度对应着一个值
        for (var i = 0; i < data.values[key]["value" + key].length; i++) {
            ptindex = i + 1;
            var x_x = this.getCoordX(padding, perwidth, ptindex);
            var x_y = can.height - padding + 20;
            this.ctx.fillText(data.values[key]["value" + key][i].x, x_x, x_y, perwidth);
        }
        this.ctx.fillStyle = '#000';
        this.ctx.textAlign = "right" //y轴文字靠右写
        this.ctx.textBaseline = "middle"; //文字的中心线的调整
        for (var i = 0; i < ylimt.length; i++) {
            // y轴坐标 数值和坐标要倒着放
            var unit = this.getYLimtByMaxData(maxY).unit;
            this.ctx.fillText(ylimt[i], padding - 10, ylimt[ylimt.length - 1 - i] / unit * yPixel + yCanMove);
            // 背景横线
            this.ctx.lineWidth = "1px";
            this.ctx.strokeStyle = "rgb(230,230,230)";
            var y = ylimt[ylimt.length - 1 - i] / unit * yPixel + yCanMove;
            this.ctx.moveTo(padding, y);
            this.ctx.lineTo(can.width - padding, y)
                // this.ctx.lineTo(perwidth * (data.values[0].value0.length -1) + padding, y);
            this.ctx.lineJoin = 'round';
            this.ctx.stroke();
        }
        this.ctx.lineWidth = "1";
        this.ctx.strokeStyle = "#ccc"; // 刻度颜色
        this.ctx.beginPath();
        // 画y轴那条线
        this.ctx.moveTo(padding, yCanMove);
        this.ctx.lineTo(padding, can.height - padding + yCanMove);
        // 画右侧闭合那条线
        // this.ctx.moveTo(perwidth * (data.values[0].value0.length -1) + padding, yCanMove);
        // this.ctx.lineTo(perwidth * (data.values[0].value0.length -1) + padding,can.height-padding + yCanMove);
        this.ctx.stroke();
        this.ctx.closePath();
        this.drawData(data, 0, padding, perwidth, yPixel, this.isMultiData, lineColors, ylimt, can, yCanMove);
    },
    //绘制数据线和数据点
    drawData: function(data, key, padding, perwidth, yPixel, isMultiData, lineColors, ylimt, can, yCanMove) {
        if (!isMultiData) {
            var keystr = "value" + key;
            this.ctx.beginPath();
            this.ctx.lineWidth = "1";
            this.ctx.strokeStyle = "rgb(100,100,100)";
            /*下面绘制数据线*/
            var startX = this.getCoordX(padding, perwidth, 0);
            this.ctx.beginPath();
            this.ctx.lineWidth = "2";
            for (var i = 0; i < data.values[key][keystr].length; i++) {
                var x = this.getCoordX(padding, perwidth, i);
                // y轴坐标计算：y轴总体的高度(can.height-padding) 减去 应该在的坐标  等于  显示在图上的坐标
                var y = can.height - padding - ((can.height - padding) * data.values[key][keystr][i].y / ylimt[ylimt.length - 1]) + yCanMove;
                this.ctx.lineTo(x, y);
                this.ctx.lineJoin = 'round';
            }
            this.ctx.stroke();
            this.ctx.closePath();
            /*下面绘制数据线上的点*/
            this.ctx.beginPath();
            // this.ctx.fillStyle=this.dotColor;
            this.ctx.fillStyle = "#FF0000";
            for (var i = 0; i < data.values[key][keystr].length; i++) {
                // 圆点x轴开始的位置
                var x = this.getCoordX(padding, perwidth, i);
                var y = can.height - padding - ((can.height - padding) * data.values[key][keystr][i].y / ylimt[ylimt.length - 1]) + yCanMove;
                this.ctx.moveTo(x, y);
                this.ctx.arc(x, y, 3, 0, Math.PI * 2, true); //绘制数据线上的点
                this.ctx.fill();
            }
            this.ctx.closePath();
        } else { //如果是多条数据线
            for (var i = 0; i < data.values.length; i++) {
                LineChart.drawData(data, i, padding, perwidth, yPixel, false, lineColors[i], ylimt, can, yCanMove);
            }
        }
    },
    //宽度
    getPixel: function(data, key, width, padding) {
        var count = data.values[key]["value" + key].length;
        return (width - 20 - padding) / (count + (count - 1) * 1.5);
    },
    //横坐标X 随ptindex 获得
    getCoordX: function(padding, perwidth, ptindex) { //下标从1开始 不是从0开始
        return perwidth * ptindex + padding;
    },
    //y轴的之间间距
    getYPixel: function(maxY, height, padding, ylimt) {
        return {
            pixel: (height - padding) / (ylimt.length - 1)
        };
    },
    // 获取y轴刻度、unit  params：数据的最大值
    getYLimtByMaxData: function(maxY) {
        var ylimt = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        // var ylimt = [0, 2, 4, 6, 8, 10];
        var unit = 10;
        if (maxY > 0 && maxY <= 10) {
            unit = 1;
        } else if (maxY <= 100) {
            unit = 10;
        } else if (maxY <= 1000) {
            unit = 100;
        } else if (maxY <= 10000) {
            unit = 1000;
        } else if (maxY <= 100000) {
            unit = 10000;
        } else {
            alert('最大数据值不在0至100000之间');
        }
        for (var i = 0; i < ylimt.length; i++) {
            ylimt[i] = ylimt[i] * unit;
        };
        return {
            ylimt: ylimt,
            unit: unit
        };
    },
    getMax: function(data, key, isMultiData) {
        if (!isMultiData) {
            var maxY = data.values[key]["value" + key][0].y;
            var length = data.values[key]["value" + key].length;
            var keystr = "value" + key;
            for (var i = 1; i < length; i++) {
                if (maxY < data.values[key][keystr][i].y) maxY = data.values[key][keystr][i].y;
            }
            return maxY; //返回最大值 如果不是多数据
        } else {
            var maxarr = [];
            var count = data.values.length; //多条数据的数据长度
            for (var i = 0; i < count; i++) {
                maxarr.push(LineChart.getMax(data, i, false));
            }
            var maxvalue = maxarr[0];
            for (var i = 1; i < maxarr.length; i++) {
                maxvalue = (maxvalue < maxarr[i]) ? maxarr[i] : maxvalue;
            }
            return maxvalue;
        } //如果是多条数据
    },
}



//动态图






//词云
var wordCloud = {
    setData: function() {
        this.radius = 180; //3D 球的半径
        this.this.dtr = Math.PI / 180;
        this.d = 600;

        this.mcList = [];
        this.active = false;
        this.lasta = 1;
        this.lastb = 1;
        this.distr = true;
        this.tspeed = 20; //文字移动速度
        this.size = 250;

        this.mouseX = 0;
        this.mouseY = 0;

        this.howElliptical = 1;

        this.aA;
        this.oDiv;

    },
    update: function() {
        var a;
        var b;

        if (this.active) {
            a = (-Math.min(Math.max(-this.mouseY, -this.size), this.size) / this.radius) * this.tspeed;
            b = (Math.min(Math.max(-this.mouseX, -this.size), this.size) / this.radius) * this.tspeed;
        } else {
            a = this.lasta * 0.98;
            b = this.lastb * 0.98;
        }

        this.lasta = a;
        this.lastb = b;

        if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01) {
            return;
        }

        var c = 0;
        sineCosine(a, b, c);
        for (var j = 0; j < this.mcList.length; j++) {
            var rx1 = this.mcList[j].cx;
            var ry1 = this.mcList[j].cy * ca + this.mcList[j].cz * (-sa);
            var rz1 = this.mcList[j].cy * sa + this.mcList[j].cz * ca;

            var rx2 = rx1 * cb + rz1 * sb;
            var ry2 = ry1;
            var rz2 = rx1 * (-sb) + rz1 * cb;

            var rx3 = rx2 * cc + ry2 * (-sc);
            var ry3 = rx2 * sc + ry2 * cc;
            var rz3 = rz2;

            this.mcList[j].cx = rx3;
            this.mcList[j].cy = ry3;
            this.mcList[j].cz = rz3;

            per = d / (d + rz3);

            this.mcList[j].x = (this.howElliptical * rx3 * per) - (this.howElliptical * 2);
            this.mcList[j].y = ry3 * per;
            this.mcList[j].scale = per;
            this.mcList[j].alpha = per;

            this.mcList[j].alpha = (this.mcList[j].alpha - 0.6) * (10 / 6);
        }

        doPosition();
        depthSort();
    },

    depthSort: function() {
        var i = 0;
        var aTmp = [];

        for (i = 0; i < this.aA.length; i++) {
            aTmp.push(this.aA[i]);
        }

        aTmp.sort(
            function(vItem1, vItem2) {
                if (vItem1.cz > vItem2.cz) {
                    return -1;
                } else if (vItem1.cz < vItem2.cz) {
                    return 1;
                } else {
                    return 0;
                }
            }
        );

        for (i = 0; i < aTmp.length; i++) {
            aTmp[i].style.zIndex = i;
        }
    },

    positionAll: function() {
        var phi = 0;
        var theta = 0;
        var max = this.mcList.length;
        var i = 0;

        var aTmp = [];
        var oFragment = document.createDocumentFragment();

        //�������
        for (i = 0; i < this.aA.length; i++) {
            aTmp.push(this.aA[i]);
        }

        aTmp.sort(
            function() {
                return Math.random() < 0.5 ? 1 : -1;
            }
        );

        for (i = 0; i < aTmp.length; i++) {
            oFragment.appendChild(aTmp[i]);
        }

        this.oDiv.appendChild(oFragment);

        for (var i = 1; i < max + 1; i++) {
            if (this.distr) {
                phi = Math.acos(-1 + (2 * i - 1) / max);
                theta = Math.sqrt(max * Math.PI) * phi;
            } else {
                phi = Math.random() * (Math.PI);
                theta = Math.random() * (2 * Math.PI);
            }
            //���任
            this.mcList[i - 1].cx = this.radius * Math.cos(theta) * Math.sin(phi);
            this.mcList[i - 1].cy = this.radius * Math.sin(theta) * Math.sin(phi);
            this.mcList[i - 1].cz = this.radius * Math.cos(phi);

            this.aA[i - 1].style.left = this.mcList[i - 1].cx + this.oDiv.offsetWidth / 2 - this.mcList[i - 1].offsetWidth / 2 + 'px';
            this.aA[i - 1].style.top = this.mcList[i - 1].cy + this.oDiv.offsetHeight / 2 - this.mcList[i - 1].offsetHeight / 2 + 'px';
        }
    },

    doPosition: function() {
        var l = this.oDiv.offsetWidth / 2;
        var t = this.oDiv.offsetHeight / 2;
        for (var i = 0; i < this.mcList.length; i++) {
            this.aA[i].style.left = this.mcList[i].cx + l - this.mcList[i].offsetWidth / 2 + 'px';
            this.aA[i].style.top = this.mcList[i].cy + t - this.mcList[i].offsetHeight / 2 + 'px';
            //this.aA[i].style.fontthis.size=Math.ceil(12*this.mcList[i].scale/2)+8+'px';
            this.aA[i].style.filter = "alpha(opacity=" + 100 * this.mcList[i].alpha + ")";
            this.aA[i].style.opacity = this.mcList[i].alpha;
        }
    },

    sineCosine: function(a, b, c) {
        sa = Math.sin(a * this.dtr);
        ca = Math.cos(a * this.dtr);
        sb = Math.sin(b * this.dtr);
        cb = Math.cos(b * this.dtr);
        sc = Math.sin(c * this.dtr);
        cc = Math.cos(c * this.dtr);
    },

    ready: function() {
        var i = 0;
        var oTag;
        $.getJSON("test.json", function(data) {
            console.log("这里getjson");
            var items = [];
            $.each(data, function(key, val) {
                items.push("<a href=#  style=font-this.size:" + val + "px>" + key + "</a>");
            });
            $("<div/>", {
                "id": "div1",
                style: "border:solid 2px black",
                ALIGN: "center",
                html: items.join("")
            }).appendTo("body");
            //console.log($('div'));

            this.oDiv = document.getElementById('div1');
            this.aA = this.oDiv.getElementsByTagName('a');

            for (i = 0; i < this.aA.length; i++) {
                oTag = {};
                oTag.offsetWidth = this.aA[i].offsetWidth;
                oTag.offsetHeight = this.aA[i].offsetHeight;
                this.mcList.push(oTag);
            }

            sineCosine(0, 0, 0);

            positionAll();

            this.oDiv.onmouseover = function() {
                this.active = true;
            };

            this.oDiv.onmouseout = function() {
                this.active = false;
            };

            this.oDiv.onmousemove = function(ev) {
                var oEvent = window.event || ev;

                this.mouseX = oEvent.clientX - (this.oDiv.offsetLeft + this.oDiv.offsetWidth / 2);
                this.mouseY = oEvent.clientY - (this.oDiv.offsetTop + this.oDiv.offsetHeight / 2);

                this.mouseX /= 5;
                this.mouseY /= 5;
            };

            setInterval(update, 30);
        });
    }
}

//倒序函数
bottomAboveTop = function(ret){
  ret.results = Turn(ret.results);
  return ret;
}
Turn = function(arr) {
  var temp = [];
  for (var i in arr){
    temp[i] = arr[arr.length-i-1];
  }
  return temp;
}
