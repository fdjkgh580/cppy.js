
var cppy         = {};
cppy.root        = {}; // 存放多筆根選擇器，如$("[cppy]")。
cppy.temp        = {}; // 存放多筆複製後的模版元素

/**
 * 初始化
 * @param   name           自訂唯一辨識名稱, 在使用 each() 的時候會使用
 * @param   selector_root  根的選擇器, 可指定 class 名稱
 * @param   is_temp_remove 是否顯示模板
 */
cppy.init = function (name, selector_root, is_temp_remove){

    //若已經初始化過了
    if (this.root[name]) return this;
    
    //根對應記錄起來
    this.root[name] = $(selector_root);

    //模板對應記錄起來
    this.tmep_clone(name);

    //移除模版？
    if (is_temp_remove == true) {
        this.temp_remove(name);
    }

    //過濾模板的屬性
    this.temp_filter(name);
    
    return this;
}


/**
 * 移除模板
 * @param   name 辨識名稱
 */
cppy.temp_remove = function (name){
    this.root[name].find("[cppytemp]").remove();
}

/**
 * 複製模板
 * @param   name 辨識名稱
 */
cppy.tmep_clone = function (name){
    this.temp[name] = this.root[name].find("[cppytemp]").clone();
    return this;
}

/**
 * 過濾模板的屬性, 避免出現不必要的 cppytemp 屬性
 * @param   name 辨識名稱
 */
cppy.temp_filter = function (name){
    this.temp[name].removeAttr("cppytemp")
}

/**
 * 在模板中賦予替換值, 如將 $title 替換成 標題
 * @param   newtemp 新模板
 * @param   key     要替換的符號值, 如 $title $content
 * @param   val     替換後的值
 * @return          HTML的編碼
 */
cppy.key2val = function (newtemp, key, val){
    var re = new RegExp("\\$" + key, "g");

    // 由上一層來取得包含自己的程式碼，因為符號值可能存在 cppytemp 的屬性。
    // 取得後再去替換符號值
    var htmlcode = newtemp
        .wrap("<span class='cppy_itemwrap'></span>")
        .parent()
        .html()
        .replace(re, val);

    return htmlcode;
}

/**
 * 批次每一列的鍵轉換為值
 * @param   name     辨識名稱
 * @param   datainfo 每一列
 * @return           替換符號值後的新模板
 */
cppy.each_info = function (name, datainfo){
    var _this = this;
    var newtemp = this.temp[name].clone();

    $.each(datainfo, function(key, val) {
        var htmlcode = _this.key2val(newtemp, key, val);
        // 替換整個模板，因為有可能要替換的值位於 cppytemp 的屬性
        newtemp = $(htmlcode);
    });

    return newtemp;
}

/**
 * 輸出數據的每一列, 並添加到基本位置
 * @param   name        辨識名稱
 * @param   obj         物件或陣列的對應值。例如 {"0":{"title":"標題","content":"內容"}}
 * @param   asc_desc    插入資料的排序方式：asc 順著 | desc 逆著
 * @return       this
 */
cppy.each = function (name, obj, asc_desc){
    var _this = this;
    $.each(obj, function(key, datainfo) {

        // 替換該列後的資料
        var replace_datainfo = _this.each_info(name, datainfo);  

        if (asc_desc == "desc") {
            _this.root[name].prepend(replace_datainfo);
        }
        else {
            _this.root[name].append(replace_datainfo);
        }
    });
    return this;
}