var url = 'http://47.98.53.200:5000/' ;

// 折线图

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


transTime = function(time) {
    time = time.replace('T', ' ');
    var str = time.split(".");
    time = str[0];
    return time;
}

transToPersent = function(dot){
   var percent = parseInt(dot*100) + "%"
   return percent;
}
