/**
 * cppy - jQuery Plugin
 * version: 1.2.0 (2014/12/29)
 * https://github.com/fdjkgh580/cppy.js
 */
(function ($) {
    /**
     * 存放多筆複製後的模版元素
     * 如temp[選擇器名稱]作為辨識
     */
    var temp        = {}; 

    /**
     * 預先隱藏模板，避免取得AJAX回應較慢時會看到模版。
     */
    $("head").append("<style>[cppytemp]{display:none}</style>");

    /**
     * 使用
     * @param   datalist    務必使用二維數據如 json 格式，因為分別代表了列與行
     * @param   asc_desc    (選)排序方式 asc(預設) | desc
     * @return              this
     */
    $.fn.cppy = function(datalist, asc_desc) {
        
        //當前使用的選擇器
        var selector = this.selector; 

        // 模板 複製
        this.tmep_clone = function (){
            var find = $(selector).find("[cppytemp]");
            if (find.length == 0) 
            {
                console.log(selector + "請先設定模版屬性 [cppytemp]");
                return false;
            }
            temp[selector] = $(selector).find("[cppytemp]").clone();
            return this;
        }

        // 模板 移除
        this.temp_remove = function (){
            $(selector).find("[cppytemp]").remove();
            return this;
        }

        // 過濾模板的屬性
        this.temp_filter = function (){
            temp[selector].removeAttr("cppytemp")
        }

        //初始化
        this.init = function () {
            
            //若初始化過了
            if (temp[selector]) return this; 

            this
                .tmep_clone()
                .temp_remove()
                .temp_filter();

            // console.log(temp[selector].get(0))
            return this;
        }

        // 
        this.isuse_eachinfo = function (datalist){
            return ($.type(datalist) == "object") ? true : false;
        }

        // 列出每一列
        this.each = function (datalist){

            var _this = this;

            // 確認輸入的資料是否只有一列
            var bool = this.isuse_eachinfo(datalist);
            if (bool)
            {
                datainfo = datalist;
                this.each_info_pre(datainfo);
                return this;
            }

            // 若有多列
            $.each(datalist, function(index, datainfo) {
                _this.each_info_pre(datainfo);
            });

            return this;
        }

        // 提取要做為替換的模板, 將每個欄位對應到模版裡, 並取得替換後的模板來覆蓋上一個的模板。
        this.each_info_pre = function (datainfo){

            var for_replace_temp = temp[selector]; 

            for_replace_temp = this.each_info(for_replace_temp, datainfo);
            
            // 依照排序方式插入
            if (asc_desc == "desc") {
                $(selector).prepend(for_replace_temp);
            }
            else {
                $(selector).append(for_replace_temp);
            }
        }

        // 讀出該列的每個欄位
        this.each_info = function (for_replace_temp, datainfo){

            var _this = this;

            // 開始替換到模版裡。
            // 當替換第一個欄位後，會繼續使用當前html做第二個欄位替換的動作。
            // 
            // 例如模版 <div id="$key">$val</div>
            // 該列欄位有 {key: "001", val: "Chinese"}
            // 第一次替換完後會變成 <div id="001">$val</div>，
            // 此時務必再將 <div id="001">$val</div> 作為模版供第二次使用；
            // 而不是使用 <div id="$key">$val</div>
            $.each(datainfo, function(key, val) {
                
                var htmlcode = _this.key2val(for_replace_temp, key, val)
                
                //經過每個欄位替換後的模版重新賦予
                for_replace_temp = $(htmlcode);
            
            });

            //每個欄位都替換完了
            return for_replace_temp;
        }

        // 在模版裡對應的變數做替換, 如 {title: "標題"} 會尋找模版裡的 $title 替還為 "標題" 
        this.key2val = function (for_replace_temp, key, val){

            var re = new RegExp("\\$" + key, "g");
            
            // 需要從 [cppytemp] 的上一層做替換
            // 因為 $變數 也可以寫在與 [cppytemp] 相同的元素上
            var htmlcode = for_replace_temp
                .wrap("<span class='cppy_itemwrap'></span>")
                .parent()
                .html()
                .replace(re, val);

           return htmlcode;
        }


        this.init();
        if (datalist) return this.each(datalist); 
        return this;
    };

}( jQuery ));
