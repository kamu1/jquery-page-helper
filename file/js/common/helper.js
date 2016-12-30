var Helper = {
	//下拉列表选择框
	/*selectBox:function(config,callback){
		var _obj = Helper.jQueryDom(config);
		if (_obj && _obj.length){
			var _children = _obj.children();
			if (_children.length){
				var _option = '<dl>';
				_children.each(function(){
					var _this = $(this);
					var _tagName = _this[0].tagName.toLocaleLowerCase();
					//如果存在分组标签
					if (_tagName == "optgroup"){
						_option += '<dt>'+ _this.attr("label") +'</dt>';
						_this.children().each(function(){
							var __this = $(this);
							_option += '<dd data-value="'+ __this.val() +'">'+ __this.text() +'</dd>';
						});
					}else{
						_option += '<dt data-value="'+ _this.val() +'">'+ _this.text() +'</dt>';
					}
				});
				_option += '</dl>';
			}
			var _selectList = $('<div tabindex="-1" class="_select-box_"><div>select</div><input type="text">'+ _option +'</div>');
			_selectList.off("click").on("click",function(){
				alert(5)
			});
			_selectList.insertAfter(_obj);
			
		}
	},*/
	//下拉选择框，封装了bootstrap-select
	selectpicker:function(config, arg2){
		var _obj = Helper.jQueryDom(config);
		if (_obj && _obj.length){
			var option = function(){
				this.style= 'btn-default';
            	this.noneSelectedText="请选择";
	            this.liveSearch=true; //开启搜索框
	            this.actionsBox=true; //在下拉选项添加选中所有和取消选中的按钮
	            this.selectAllText="全选";
	            this.deselectAllText="取消";
	            this.noneResultsText="未找到数据";
	            return this;
			}
			//参数以config.option优先，不存在则取第二个参数
			var _optionArg = config && config.option ? config.option : (arg2 ? arg2 : null);
			_obj.each(function(i){
				var _opt={};
				if (_optionArg){
					if (_optionArg instanceof Array){
						//如果传进的参数是数组则赋值，超出长度的用第一个
						_opt = _optionArg[i<=_optionArg.length-1 ? i : 0 ];
					}else if (_optionArg instanceof Object){
						_opt = _optionArg;
					}
				}
				var _option = new option();
				for (var Key in _opt){
					_option[Key] = _opt[Key];
				}
				$(this).selectpicker(_option);
				//释放内存
				_option = null;
				_opt = null;
			});
		}
	},
	//定位警告时的标记位置，如：定位验证失败的输入框
	markPosition:function(config, arg2){
		var _obj;
		if (config && config.target){
			_obj = config.target;
		}else{
			_obj = config;
		}
		if (typeof(_obj)=="string" || _obj instanceof HTMLElement){
			_obj = $(_obj);
		}
		var _style={};
		if (config && config.style instanceof Object){
			_style = config.style;
		}else if (arg2 instanceof Object){
			_style = arg2;
		}
		var _time=1000;
		if (config && typeof(config.time) == "number"){
			_time = config.style;
		}else if (typeof(arg2) == "number"){
			_time = arg2;
		}
		_obj.each(function(){
			var _this = $(this);
			$("body").append('<div class="_mark-position_ _new_"></div>');
			var _mark = $("body > ._mark-position_._new_");
			_mark.css({
				position:"absolute",
				border:"2px solid #C00",
				borderRadius:3,
				pointerEvents:"none",
				boxSizing:"border-box",
				top:_this.offset().top,
				left:_this.offset().left,
				width:_this.innerWidth(),
				height:_this.innerHeight()
				}).stop().fadeOut(_time,function(){
				_mark.remove();
			}).css(_style).removeClass("_new_");
		});
	},
	//轻提示，调用dialog()
	tip:function(config, arg2,position){
		if (config == "clear"){		//传入clear清除所有弹层
			$(window.top.document).find("._fixed-alert_._tip_").remove();
			return false;
		}
		var _content="";
		var _time = 2000;
		var _state = "default";
		if (typeof(config) == "string"){
			_content = config;
		}
		if (config && config.content){
			_content = config.content;
		}
		//最大的数量
		var _max=1;
		if (config && config.maximum && typeof(config.maximum) == "number"){
			_max = config.maximum ? config.maximum : 1;
		}
		//第二个参数可以是时间和状态值
		if (arg2 && typeof(arg2) == "number"){
			_time = arg2;
		}else if(arg2 && typeof(arg2) == "string"){
			_state = arg2;
		}
		if (config && config.time && typeof(config.time) == "number"){
			//优先于config.time，被替换
			_time = config.time;
		}
		//样式状态，info  error  success  warning
		if (config && config.state && typeof(config.state) == "string"){
			_state = config.state;
		}
		//位置
		var _top = 0,_bottom = "auto",_right="auto",_height="auto",_textAlign="center";
		//如果第二个参数包装位置，第二个参数忽略时间和类型
		if (["top","bottom","left","right","left-top","right-top","left-bottom","right-bottom"].indexOf(arg2)>=0){
			position = arg2;
		}
		//优先于config.position的属性值
		if (config && config.position && typeof(config.position) == "string"){
			position = config.position;
		}
		if ( !position ){
			position = "center";
		}
		if (position && position == "center"){
			_height="100%";
		}else if (position == "left-top"){
			_textAlign="left";
		}else if (position == "right-top"){
			_textAlign="right";
		}else if (position == "left-bottom"){
			_bottom=0;
			_top="auto";
			_textAlign="left";
		}else if (position == "right-bottom"){
			_top = "auto";
			_bottom=0;
			_textAlign="right";
		}else if (position == "left"){
			_textAlign="left";
			_height="100%";
		}else if (position == "right"){
			_textAlign="right";
			_height="100%";
		}else if (position == "top"){
			_height="auto";
		}else if (position == "bottom"){
			_bottom=0;
			_top="auto";
		}
		//未填位置时赋值
		position = position ? "_" + position + "_" : "_top_";
		var _tip = $(window.top.document).find("._tip_" + (position ? '.'+position : ''));
		//这里判断先隐藏已存在的提示项
		_tip.find("._dialog_").children().each(function(){
			var _this=$(this);
			if (_content == _this.text() || _content == _this.html()){
				_this.stop().slideUp(100,function(){
					_this.off("click");
				});
			}
		});
		//判断可见的是否超出限制数量
		var _visible=_tip.find("._dialog_").children(":visible");
		if (_visible.length && _visible.length >= _max){
			if (_max==1){
				_visible.remove();
			}else{
				_visible.each(function(i){
					if (i <= _visible.length - _max){
						$(this).remove();
					}
				});
			}
		}
		//开始渲染
		if (_tip.length){
			_tip.find("._dialog_").append('<div class="fixed-content _new_ '+ _state +'"><div class="_fixed-content_">'+ _content +'</div></div>');
		}else{
			Helper.dialog({
				content:_content,
				opacity:0,
				overlayClose:true,
				overlay:{
					pointerEvents:"none",
					top:_top,
					bottom:_bottom,
					right:_right,
					height:_height,
					textAlign:_textAlign
				},
				dialogStyle:{
					boxShadow:"none",
					margin:30
				},
				callback:function(target){
					target.addClass("_tip_ "+ position).find(".fixed-content").addClass(_state + " _new_");
					exitTip(target);
				}
			});
		}
		//定时关闭tip提示
		exitTip();
		function exitTip(obj){
			if (obj){
				_tip = obj;
			}
			_tip.find("._dialog_").children("._new_").each(function(){
				var _this = $(this);
				//清除新标签的标识，防止重复执行 并绑定事件，单击可关闭提示框
				_this.removeClass("._new_").css("cursor","pointer").off("click").on("click",function(){
					$(this).off("click").remove();
				});
				
				setTimeout(function(){
					_this.last().stop().animate({
						opacity:0,
						height:0
					},200,function(){
						_this.last().off("click").remove();
						//如果轻提示为0时，关闭父弹窗口
						if (!_tip.find("._dialog_").children().length){
							_tip.remove();
						}
					});
				},_time);
			});
		}
	},
	//回到顶部
	totop:function(obj,style){
		var _obj;
		if (typeof(obj) == "string" || obj instanceof HTMLElement){
			obj=$(obj);
		}
		_obj=obj;
		var _style =style ? style : {};
		if (!_obj || !_obj.length){
			if (!$("._totop_btn_").length){
				$("body").append('<div class="_totop_btn_"></div>');
			}
			_obj = $("._totop_btn_");
		}
		$(window).scroll(function(){
			$(window).scrollTop()>($(window).height()*.5) ? _obj.show() : _obj.hide();
		});
		//如果obj是原生对象，则赋给style
		if (style instanceof Object || !(obj instanceof jQuery)){
			if (typeof(obj) == "object"){
				_style = obj;
			}
			_obj.css(_style);
		}
		_obj.off("click").on("click",function(){
			Helper.position();
		});
	},
	//滚动条定位
	position:function(config){
		var _obj = config;
		var _x = 0, _y = 0;
		var _time =600;
		if (config && config.time && typeof(config["time"]) == "number" && config["time"]>=0){
			_time = config["time"];
		};
		//如果传的是字符串名或原生DOM对象，则通过jquery包装一下
		if (typeof(config) == "string" || config instanceof HTMLElement){
			_obj = $(config);
		//如果传入的是对象，则读target及x和y属性值
		}else if(config instanceof Object){
			if (config.target && (typeof(config.target) == "string" || config.target instanceof HTMLElement)){
				_obj = $(config.target);
			}
			if (config["x"] && typeof(config["x"]) == "number"){
				_x= config["x"];
			}
			if (config["y"] && typeof(config["y"]) == "number"){
				_y= config["y"];
			}
		}else{
			//如果第一个参数是数值，则赋给时间变量
			if (typeof(config) == "number" && config>=0){
				_time = config;
			}
		}
		//如果是jQuery对象并存在则赋值
		if (_obj instanceof jQuery && _obj.length){
			_x += _obj.offset().left;
			_y += _obj.offset().top;
		}
		//执行滚动动画
		$("html,body").stop().animate({
			scrollTop:  _y,
			scrollLeft: _x
		},_time);
		
	},
	//弹窗
	dialog: function(config, callback){
		if (config == "clear"){		//传入clear清除所有弹层
			$(window.top.document).find("._fixed-alert_").remove();
			return false;
		}
		var _title = config.title ? config.title : "";
		//右上角的关闭开关
		var _exit = config.exit == true ? config.exit : false;
		//自动关闭弹窗的捍间
		var _time = config["time"] ? config["time"] : 0;
		//背景颜色透明值
		var _opacity ="";
		if (!isNaN(config["opacity"]) && config["opacity"]>=0){
			_opacity = "rgba(0,0,0," + config["opacity"] + ")";
		}else if (typeof(config["opacity"]) == "string"){
			_opacity =config["opacity"];
		}
		//覆盖层的样式
		var _overlay = (config.overlay instanceof Object ? config.overlay : {});
		//覆盖层点击关闭
		var _overlayClose = (config.overlayClose === true ? true : false);
		//弹窗内容
		var _content = "";
		//弹窗容器样式定义
		var _dialogStyle = config.dialogStyle instanceof Object ? config.dialogStyle : {};
		//内容区容器样式定义
		var _style = config.style instanceof Object ? config.style : {};
		var _attr = config.attr instanceof Object ? config.attr : {};
		var _className = typeof(config.className) == "string" ? config.className : "";
		if (typeof(config) == "string"){
			_content = config;
		}else{
			_content = config.content;
		}
		var _btns="";
		if (config.buttons){
			for (var btn in config.buttons){
				_btns += '<button>'+ btn +'</button>';
			}
		}
		//引用加载CSS文件
		var _css = config.css instanceof Object ? config.css : {}; 
		if (_css){
			var _head = window.top.document.head;
			var _cssId = _css["id"] ? _css["id"] : "";
			//加载css链接文件
			if (_css["link"] && typeof(_css["link"]) == "string"){
				var _cssObj = $(_head).children("#css" + _cssId);
				if (_cssObj.length){
					//如果css地址是新的未加载，则加载
					if (_cssObj.attr("href") != _css["link"]){
						_cssObj.attr("href", _css["link"]);
					}
				}else{
					//如果cssId对象不存在，则新建一个<link />加载
					$("<link>").attr({id:"css" + _cssId, rel: "stylesheet",type: "text/css",href: _css["link"]}).appendTo(_head);
				}
			}
			//加载自定义style样式块
			if (_css["style"] && _css["style"].length && _css["style"] instanceof Object){
				var _styleObj = $(_head).children("#style" + _cssId);
				//如果style块存在，则先删除再加载
				if (_styleObj.length){
					_styleObj.remove();
				}
				$(_head).append(_css["style"].attr("id", "style" + _cssId));
			}
		}
		$(window.top.document.body).append('<div class="fixed-alert _fixed-alert_ vmc" style="'+ (_opacity != "" ? 'background-color:'+ _opacity +';' : '') +'">\
			<div class="_dialog_" '+ (_btns ? 'style="min-width:150px;min-height:100px"' : '') +'>\
			'+(_title || _exit ? '\
				<div class="fixed-title" '+ (!_exit ? 'style="text-align:center"' : '')+'>\
					<div>'+ _title +'</div>\
					'+ (_exit ? '<a class="_exit_" href="javascript:;"></a>' : '') +'\
				</div>\
			':'')+'\
				<div class="fixed-content"><div class="_fixed-content_">'+ (typeof(_content) == "string" ? _content : "") +'</div></div>\
			'+(_btns ? '\
				<div class="fixed-button">\
					'+ _btns +'\
				</div>\
			':'')+'\
			</div>\
		</div>');
		//将弹窗最外层作赋值为this对象
		var _this=$(window.top.document.body).children("._fixed-alert_:last");
		_this.css(_overlay).children().first().css(_dialogStyle).attr(_attr).addClass(_className).find("._fixed-content_").css(_style);
		//判断层的浮动类型,如果是absolute,则定义坐标为滚动条的位置,并使body隐藏滚动条,关闭弹窗时开启
		if (_this.css("position") == "absolute"){
			_this.css({top:$(window.top).scrollTop(),left:$(window.top).scrollLeft()});
			$(window.top.document.body).css("overflow","hidden");
		}
		//如果内容传的是对象,则克隆渲染
		if (_content instanceof Object){
			_this.find("._fixed-content_").html("").append(_content.clone(true));
		}
		//渐变显示弹出窗口
		_this.stop().fadeIn(300);
		//默认图标关闭按钮
		if (_exit){
			_this.find("._exit_").click(function(){
				_this.stop().fadeOut(200,function(){
					_this.remove();
				});
			});
		}
		//如果有按钮
		if (_btns){
			var k=0;
			for (var btn in config.buttons){
				var _obj = _this.find(".fixed-button button");
				var _btn = config.buttons[btn];
				if (_btn instanceof Function){
					_obj.eq(k).click(_btn.bind(_this));
				}else if (_btn instanceof Object){
					if (_btn['style'] instanceof Object){
						_obj.eq(k).css(_btn['style']);
					}
					if (typeof(_btn['className']) == "string"){
						_obj.eq(k).addClass(_btn['className']);
					}
					if (_btn['attr'] instanceof Object){
						_obj.eq(k).attr(_btn['attr']);
					}
					if (_btn['method'] instanceof Function){
						_obj.eq(k).click(_btn['method'].bind(_this));
					}
				}
				k++;
			}
		}
		//点覆盖层关闭
		if (_overlayClose){
			_this.click(function(){
				exit_dialog(_this)
			}).children().click(function(ev){
				//子标签阻止冒泡
				ev.stopPropagation();
			});
		}
		//如果设置了定时关闭
		if (_time){
			setTimeout(function(){
				exit_dialog(_this);
			},_time);
		}
		//窗口弹出后回调,优先于config.callback,无则执行dialog第二个回调参数
		if (config.callback && config.callback instanceof Function){
			config.callback(_this);
		}else{
			if (callback instanceof Function){
				callback(_this);
			}
		}
		//dialog公用的方法
		function exit_dialog(obj){
			obj.stop().fadeOut(200,function(){
				_this.remove();
			});
		}
	},
	//ajax数据请求
	ajax: function(config, callback){
			if (!config || !config.url) {
                return;
            }
            $.ajax({
                url: config.url ? config.url : config,
                type: config.type ? config.type : "get",
                data: config.data ? config.data : {},
                dataType: config.dataType ? config.dataType : "json",
                jsonpCallback: config.jsonpCallback ? config.jsonpCallback : (config.dataType == "jsonp" ? "jsonpCallback" : ""),
                success: (!config.success || !(config.success instanceof Function)) ? function(data){
                    if (callback) {
                        callback(data);
                    }
                } : config.success,
                error: (!config.error || !(config.error instanceof Function)) ? function(xhr,status,error){
                    if (callback) {
                        callback(xhr,status,error);
                    }
                } : config.error,
                complete: (!config.complete || !(config.complete instanceof Function)) ? function(xhr,status){
                    if (callback) {
                        callback(xhr,status);
                    }
                } : config.complete
            });
	},
	//节流响应
	throttle: function(func,time){
        var timer;
        var _time = time ? time : 0;
        return function(){
            var context = this;
            var args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function(){
                func.apply(context,args);
            },_time);
        }
    },
	//返回平台、设备和操作系统
    device: function(){
        var system = {
            win: false,
            mac: false,
            xll: false,
            ipad:false,
            phone:false
        };
        //检测平台
        var p = navigator.platform;
        system.win = p.indexOf("Win") == 0;
        system.mac = p.indexOf("Mac") == 0;
        system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
        system.ipad = (navigator.userAgent.match(/iPad/i) != null)?true:false;
        //跳转语句，如果是手机访问就自动跳转到wap.baidu.com页面
        if (!system.win && !system.mac && !system.xll && !system.ipad) {
        	system.phone =true;
        }
        return system;
    },
    //转换成jQueryDOM对象
    jQueryDom:function(obj){
    	var _obj = obj;
    	if (typeof(obj)=="string" || obj instanceof HTMLElement){
    		_obj = $(obj); 
    	}else if (obj && obj.target && (typeof(obj.target)=="string" || obj.target instanceof HTMLElement)){
    		_obj = $(obj.target); 
    	}else if(obj && obj.target && obj.target instanceof jQuery){
    		_obj = obj.target;
    	}
    	if (_obj instanceof jQuery){
	    	return _obj;
    	}else{
    		return false;
    	}
    },
	//上下左右键移动焦点（标识选择法)
    focusMove:function(config,callback){
    	//需传入的{}键值
    	//{target,rowLabel,cellLabel,inputLabel,minTop,minBottom};
    	var _block;
    	if (typeof(config) == "string" || config instanceof HTMLElement){
    		_block = $(config);
    	}else if (config instanceof jQuery){
    		_block = config;
    	}else if (config && (typeof(config.target) == "string" || config.target instanceof HTMLElement)){
			_block = $(config.target);
		}
		var arr = [];
		var blockObj=_block;
		var trLabel="tr";
		var tdLabel="td";
		var inputLabel="input:enabled";	//默认可编辑的输入框
		var _setTop = 20, _setBottom = 20;	//隔上下边的距离,默认20
		var _visual = false;		//开启以视觉定位
		if (config && typeof(config.minTop) == "number"){
			_setTop = config.minTop;
		}
		if (config && typeof(config.minBottom) == "number"){
			_setBottom = config.minBottom;
		}
		
		if (config && typeof(config.rowLabel) == "string"){
			trLabel = config.rowLabel;
		}
		if (config && typeof(config.cellLabel) == "string"){
			tdLabel = config.cellLabel;
		}
		if (config && typeof(config.inputLabel) == "string"){
			inputLabel = config.inputLabel;
		}
		if (config && config.visualPosition){
			_visual = config.visualPosition;
		}
		//遍历标识有输入框的块对象
		blockObj.each(function(){
			var This=$(this);
			if (This.find(inputLabel).length){
				This.find(trLabel).each(function(){
					var trThis=$(this);
					var inputLen = trThis.find(inputLabel).length;
					if (inputLen){
						trThis.addClass("J-tr-row").attr("data-record-num",inputLen);
						//读取输入框索引
						var inputArr=[];
						trThis.find(tdLabel).each(function(){
							var tdThis = $(this);
							if (tdThis.find(inputLabel).length){
								inputArr.push(tdThis.index());
								//遍历输入框在td上的索引
								tdThis.find(inputLabel).each(function(){
									$(this).attr({'data-record-index': tdThis.index()});
								});
							}
						});
						//记录输入框的排序
						trThis.find(inputLabel).each(function(i){
							$(this).attr({"data-record-num":i}).addClass("_input_" + i);
						});
						//保存每个输入框所在的索引
						if (inputArr){
							trThis.attr("data-record-td-index",inputArr);
						}
					}
				})
			}
		});
		//按键事件
		blockObj.find(trLabel).find(inputLabel).on("keydown",function(ev){
			var This = $(this);
			var _rows = $(".J-tr-row");
			var _row= $(this).parents(trLabel);
			var _index=Number(This.attr("data-record-index"));
			var kCode=ev.keyCode;
			var _tr,_td,_focused;
			//向上
			var trIndex = This.closest(".J-tr-row").index(".J-tr-row");
			_tr = $(".J-tr-row").eq(trIndex);
			if (kCode == 37){	//左键
				var _dnum = Number(This.attr("data-record-num"))-1;
					_dnum = trIndex==0 && _dnum<0 ? 0 : _dnum;	//第一行的第一个输入框时
				if (_dnum >= 0){
					_focused = _tr.find("._input_" + _dnum);
					_focused.focus().select();
				}else if(trIndex > 0){
					_dnum = _rows.eq(trIndex - 1).attr("data-record-td-index").split(",").length-1; 
					_focused = _rows.eq(trIndex - 1).find("._input_" + _dnum);
					_focused.focus().select();
				}
			}else if ([13,39].indexOf(kCode) >= 0){		//右键、回车键
				var _dnum = Number(This.attr("data-record-num"))+1;
				if (trIndex == _rows.length-1){		//最后一行的最后一个输入框时
					if (_dnum>=_tr.find(inputLabel).length-1){
						_dnum = _tr.find(inputLabel).length-1;
					}
				}
				if (_dnum < _tr.attr("data-record-td-index").split(",").length){
					_focused = _tr.find("._input_" + _dnum);
					_focused.focus().select();
				}else if (trIndex < _rows.length - 1){
					_focused = _rows.eq(trIndex + 1).find("._input_0");
					_focused.focus().select();
				}
			}else{
				if (trIndex>0 && [38].indexOf(kCode) >= 0){		//焦点大于第一行时
					_tr = _rows.eq(trIndex-1);
					//如果上一行的输入框被禁用,找到可输入的行
					if (!_tr.find(inputLabel+":enabled").length){
						for (var i=trIndex-1; i>=0; i--){
							if (_rows.eq(i).find(inputLabel+":enabled").length){
								_tr = _rows.eq(i);
								break;
							}
						}
					}
				}else if (trIndex < _rows.length-1 && [40].indexOf(kCode) >= 0){		//焦点小于最后一行时
					_tr = _rows.eq(trIndex+1);
					//如果下一行的输入框被禁用,找到可输入的行
					if (!_tr.find(inputLabel+":enabled").length){
						for (var i=trIndex+1; i<_rows.length; i++){
							if (_rows.eq(i).find(inputLabel+":enabled").length){
								_tr = _rows.eq(i);
								break;
							}
						}
					}
				}
				//按上下键执行
				if ( [38,40].indexOf(kCode) >= 0 ){
					var indexArr = _tr.attr("data-record-td-index").split(",");
					var tdIndex = This.attr("data-record-index");
					_td = _tr.find(tdLabel);
					//以视觉来判断定位
					var _visualPosition =false,
						_oneSide = false,
						_noSide = false;
					//如果开启了视频位即执行
					if (_visual && _td.length != _row.find(tdLabel).length){
						var _leftStart = This.offset().left;
						var _leftEnd = This.offset().left + This.innerWidth();
						var _min = -1;
						_td.find(inputLabel).each(function(){
							var _lStart = $(this).offset().left;
							var _lEnd = _lStart + $(this).innerWidth();
							//如果目标对像两头都在其范围内 或 都超出其范围 则 直接返回
							if ( (_lStart>=_leftStart && _lEnd<=_leftEnd) || (_lStart<=_leftStart && _lEnd>=_leftEnd) ){
								_visualPosition = $(this);
							  	_min = true;
								return false;
							}
							//取第一个单边存在其范围内的
							if ( (_lStart>=_leftStart && _lStart<_leftEnd) 
							  || (_lEnd>_leftStart && _lEnd<=_leftEnd)
							  || (_lStart<=_leftStart && _lEnd>=_leftEnd) ){
							  	_oneSide = _oneSide ? _oneSide : $(this);
							  	_min = true;
							//若无单边重合对象 则取最近的
							}else if (!_oneSide){
								if (_lEnd<_leftStart){	//无重叠在左边时
									if (_min < 0 || _min > _leftStart - _lEnd){
										_min = _leftStart - _lEnd;
										_noSide = $(this);
									}
								}
								if (_lStart>_leftEnd){	//无重叠在右边时
									if (_min < 0 || _min > _lStart - _leftEnd){
										_min = _lStart - _leftEnd;
										_noSide = $(this);
									}
								}
							}
						});
					}
					//按优先级取目标对象
					_visualPosition = _visualPosition || _oneSide || _noSide;
					//如果是视觉定位
					if (_visualPosition){
						_focused = _visualPosition;
						_focused.focus().select();
					//以索引值来判断定位，如果正好对应，则直接焦点到对应的框
					}else if (indexArr.indexOf(tdIndex)>=0){
						_focused = _td.eq(tdIndex).find(inputLabel)
						_focused.focus().select();
					}else{
						var _max=Math.max.apply(this,indexArr);
						var _min=Math.min.apply(this,indexArr);
						//如果超出最大值，则焦点到最后一个
						var _eq = 0;
						if (indexArr.length===1){	//如果只有一个则赴接选择
							_eq = indexArr[0];
						}else if (tdIndex > _max){	//超出最大索引，跳到最后一个
							_eq = _max;
						}else if (tdIndex < _min){	//小于最小索引，跳到最小值
							_eq = _min;
						}else{
							var _num = 0;
							_num = _max-tdIndex > tdIndex-_min ? _max-tdIndex : tdIndex-_min;
							tdIndex = Number(tdIndex);
							//已两端最大的长度循环判断
							for (var i=0; i<_num;i++){
								//对比后面
								if (indexArr.indexOf((tdIndex+1).toString()) >= 0){
									_eq = tdIndex+1;
									break;
								//对比前面
								}else if(indexArr.indexOf((tdIndex-1).toString()) >= 0){
									_eq = tdIndex-1;
									break;
								}
							}
							//如果溢出则处理
							_eq = _eq<0 ? 0 : (_eq>_max ? _max : _eq); 
						}
						_focused = _td.eq(_eq).find(inputLabel);
						_focused.focus().select();
					}
				}
			}
			//上下左右回车键时
			if ([13,37,38,39,40].indexOf(kCode) >= 0 && _focused.length){
				//如果目标输入框被禁用,则向前找到最近的一个
				if (_focused.prop("disabled") &&  [37,38].indexOf(kCode) >= 0 ){
					for (var i=_focused.index(".J-tr-row " + inputLabel); i > 0; i--){
						if ( !$(".J-tr-row " + inputLabel).eq(i).prop("disabled") ){
							$(".J-tr-row " + inputLabel).eq(i).focus().select();
							break;
						}
					}
				}
				//如果目标输入框被禁用,则向后找到最近的一个
				if (_focused.prop("disabled") &&  [39,40].indexOf(kCode) >= 0){
					for (var i=_focused.index(".J-tr-row " + inputLabel); i < $(".J-tr-row " + inputLabel).length; i++){
						if ( !$(".J-tr-row " + inputLabel).eq(i).prop("disabled") ){
							$(".J-tr-row " + inputLabel).eq(i).focus().select();
							break;
						}
					}
				}
				
				//自定义焦点滚动框对象
				var _scrolltop;
				//查询是否有指定DOM
				var _scrollDOM;
				if (config && config.scrollDOM){
					_scrollDOM = Helper.jQueryDom(config.scrollDOM);
				}
				if (!_scrollDOM || !_scrollDOM.length){
					_scrollDOM = $(window);
				}
				if (_focused.offset().top > _scrollDOM.scrollTop() + _scrollDOM.height() -_focused.height() - _setBottom){
					_scrolltop = _focused.offset().top - _scrollDOM.height() + _focused.height()  + _setBottom
				}
				if(_focused.offset().top < _scrollDOM.scrollTop() + _setTop){
					_scrolltop = _focused.offset().top - _setTop
				}
				if (_scrolltop){
					_scrollDOM.scrollTop(_scrolltop);
				}
				//阻止默认事件，比如number输入框的加减动作
				ev.preventDefault();
				//窗口弹出后回调,优先于config.callback,无则执行dialog第二个回调参数
				if (config.callback && config.callback instanceof Function){
					config.callback(_this);
				}else{
					if (callback instanceof Function){
						callback({
							target:This,
							focusTarget:_focused,
							keyCode:kCode
						});
					}
				}
			}
		});
	},
}
