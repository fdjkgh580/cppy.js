(function ($) {

    var global_version           = "2.1.0";
    var global_org_template      = false; // 原始模板
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

        // 平坦化使用的鍵名稱。命名具有繼承關聯
        var _deep_key;

        // 模板黏接的符號
        var _glue = "-";

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


        var _deep_each_row = function (rowkey, row){

            // _deep_key 須要串接下去
            _deep_key = _deep_key_name(rowkey);

            $.each(row, function (cellkey, cell){

                if ($.type(cell) === "object"){
                
                    _deep_key = _deep_key_name(cellkey);
                    
                }
                
                row = _deep(row, cellkey, cell);
            });

            return row;
        }

        /**
         * 若不是物件
         * @param   list       
         * @param   key        
         * @param   info       
         * @param   delete_key 要刪除的 key
         */
        var _deep_is_val = function (list, key, info, delete_key){
            var str = _deep_key_name(key)
            list[str] = info;
            delete list[delete_key];
            return list;
        }


        // 深入
        var _deep = function (list, key, info){

            // 若 info 沒有物件，那返回 list
            if ($.type(info) !== "object") {
               return _deep_is_val(list, key, info, key);
            }

            // 若 info 是物件，批次取得
            $.each(info, function (rowkey, row){

                // 若欄位是物件
                if ($.type(row) === "object") {

                    // 建立新物件
                    var box = _deep_each_row(rowkey, row);

                    // 刪除這個項目, 並擴充多筆 row
                    $.extend(list, box);
                }

                // 若欄位不是物件，是字或數字
                else {

                    list = _deep_is_val(list, rowkey, row, key);
                }
            });

            // console.log(list);

            return list;
        }

        // 設定 _deep_key 名稱
        var _deep_key_name = function (name){
            // "-&gt;"
            return _deep_key + _glue + name;
        }

        // 設定 _deep_key 原始名稱
        var _deep_key_root = function (name){
            _deep_key = name; // 指定 _deep_key 源頭名稱
        }

        // 平坦化：將二維以上的物件平坦至二維
        this.flatten = function (datalist){

            // 批次取得一維
            $.each(datalist, function (lkey, datainfo){

                // 取得一維中的每個項目
                $.each(datainfo, function (rowkey, row){

                    // 若底下沒物件，不處理
                    if ($.type(row) !== "object") return true;

                    // 若是物件 
                    _deep_key_root(rowkey); // 設定 _deep_key 源頭名稱

                    // 深入判斷是否底下有物件，並組合
                    datainfo = _deep(datainfo, rowkey, row);
                });

            });

            // console.log('\n\n\n\n');
            // console.table(datalist);
            return datalist;
        }

        // 模板處理
        this.template = function (datalist){

            // 多維轉二維
            datalist = this.flatten(datalist);

            // 第一次?
            if (_is_init() === false){
                global_org_template = $(global_selector).clone()[0];
            }
            
            var timestamp = new Date().getTime(); // 時間戳記
            var cppy_class = "cppy-" + timestamp; // 類別

            $(global_org_template).attr("data-cppy-class", cppy_class)
            var template_html = global_org_template.outerHTML;


            var box    = [];
            var boxkey = 0;
            
            // 批次替換後合併。 如 {id: 100} ，會把 $id 替換為 100
            $.each(datalist, function (key, datainfo){
                box[boxkey] = _cppy.key2val(template_html, datainfo);
                box[boxkey] = _switch_background(box[boxkey]);
                boxkey++;
            })

            var mix_html_code = box.join('');

            return {
                cppy_class: cppy_class,
                timestamp: timestamp,
                html: mix_html_code,
                datalist: datalist
            };
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
            _display_cppy_result_template(global_selector)
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

        // 顯示複製後的成果
        var _display_cppy_result_template = function (selector){
            $(selector).removeAttr('data-cppy-temp')
        }

        this.main = function (param){

            _cppy    = this;
            _set_selector(param.ele);


            // 忽略不存在
            if (_is_exist_selector() === false) return false;

            // 無論如何都轉為二維
            var input_data = _cppy.prepare_data(param.data);

            var temp = _cppy.template(input_data);

            // 
            if (param.success) {
                // console.log(temp)
                param.success.call(this, temp);
                var leng = $("[data-cppy-class="+temp.cppy_class+"]").length;
                _display_cppy_result_template("[data-cppy-class="+temp.cppy_class+"]")
            }
            else {
                _cppy.put(temp.html);
            }

            // 初始化標記
            if (_is_init() === false) _set_init(true);


        }



        this.main(param);
    }
    
    $.fn.cppy = function(selector, data, success) {
        $.cppy.create({
            ele: selector,
            data: data,
            success: success
        })
    };

}( jQuery ));
