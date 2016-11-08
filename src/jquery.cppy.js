(function ($) {

    var global_version           = "2.0.0";
    var global_org_template_html = false; // 原始模板
    var global_isinit            = false;
    var global_selector          = false; // 選擇棄
    $.cppy                       = {}

    // 預先隱藏
    $("head").append("<style>[data-cppy-temp]{display:none}</style>");

    // 版本
    $.cppy.version = function (){
        return global_version;
    }
    

    $.cppy.create = function (param){
    
        var _cppy;


        // 無論如何都轉為二維
        this.prepare_data = function (data){
            var obj = {};
            $.each(data, function (key, ele){
                // 二維
                if ($.type(ele) === "object"){
                    obj = data;
                }
                // 一維
                else {
                    obj[0] = data;
                }
                return false;
            })
            return obj;
        }

        var _switch_background = function (html){

            var target = $(html);

            target.find("[data-cppy-background]").each(function (key, element){
                
                var url = $(element).attr("data-cppy-background");

                if ($(element)[0].tagName === "IMG") {
                    $(element).attr("src", url);
                }
                else {
                    $(element).css("background-image", "url("+url+")")
                }

                var result = $(element).removeAttr('data-cppy-background');

            })

            return target[0].outerHTML;
        }

        // 模板處理
        this.template = function (datalist){

            // 第一次?
            if (_is_init() === false){
                global_org_template_html = $(global_selector)[0].outerHTML;
            }

            var box    = [];
            var boxkey = 0;
            
            // 批次替換後合併。 如 {id: 100} ，會把 $id 替換為 100
            $.each(datalist, function (key, datainfo){
                box[boxkey] = _cppy.key2val(global_org_template_html, datainfo);
                box[boxkey] = _switch_background(box[boxkey]);
                boxkey++;
            })

            var mix_html_code = box.join('');

            return mix_html_code;
        }

        this.key2val = function (code, datainfo){
            var target = code;
            $.each(datainfo, function (key, val){
                var re = new RegExp("\\$" + key, "g");
                target = target.replace(re, val)
            })
            return target;
        }

        // 初始化?
        var _is_init = function (){
            return global_isinit === true;
        }

        // 設定初始標記
        var _set_init = function (bool){
            global_isinit = bool;
        }

        // 將新的編碼換置原來的模板位置
        this.put = function (newcode){

            //第一次，就加入模板後方，並將模板移除
            if (_is_init() === false) {
                $(global_selector).after(newcode);
                $(global_selector).first().remove();
            }
            //第二次以後，在所有元素的後方加入
            else {
                $(global_selector).last().after(newcode)
            }

            // 顯示
            $(global_selector).removeAttr('data-cppy-temp');
        }

        // 指派選擇器
        var _set_selector = function (ele){

            if (global_selector === ele) return false;
            
            // 若是新的選擇器，需要將重設初始化標記
            global_selector = ele;
            _set_init(false);

            return true;
        }

        // 目標存在？
        var _is_exist_selector = function (){
            return $(global_selector).length >= 0;
        }

        this.main = function (param){

            _cppy    = this;
            _set_selector(param.ele);

            // 忽略不存在
            if (_is_exist_selector() === false) return false;

            // 無論如何都轉為二維
            var input_data = _cppy.prepare_data(param.data);

            var newcode = _cppy.template(input_data);

            _cppy.put(newcode);


            // 初始化標記
            if (_is_init() === false) _set_init(true);
        }



        this.main(param);
    }
    
    $.fn.cppy = function(selector, data) {
        $.cppy.create({
            ele: selector,
            data: data
        })
    };

}( jQuery ));
