cppy.js
=======
依照JSON數據，自動在地模版，簡化你的工作。

##步驟

- 使用 $(selector).cppy(json格式, 降冪或升冪排序) 綁定你要迴圈的區塊

- 使用關鍵字 cppytemp 屬性，添加在你希望的模板位置。

- 使用 $ 為開頭的文字，作為你的欄位名稱。例如資料 {title: "星期一"} 就使用「$title」，執行後 $title 未被轉換為「星期一」。

- 若需要從JSON數據指定圖片，避免 console.log 發出 404 ，所以我們需要使用屬性 data-cppyimg 作為指定路徑。

##一般方式

    $(".box").cppy(
        [
            {
                "id" : "0001",
                "title" : "星期一",
                "content" : "工作"
            },
            {   
                "id" : "0002",
                "title" : "星期二", 
                "content" : "旅遊"
            }
        ]
    , "asc");
    
    <div class="box">
        <ul cppytemp data-id="$id">
            <li>$title</li>
            <li>$content</li>
        </ul>
    </div>
    
    
##逐筆加入資料

    // 1. 一開始們以任何資料，只有模板
    $(".box").cppy();
    
    // 2. 加入一筆資料後渲染
    var data = {
        title: "蘋果",
        price: 50
    };

    $(".box").cppy(data);

    // 3. 再加入一筆資料後渲染
    var data = {
        title: "西瓜",
        price: 200
    };

    $(".box").cppy(data);


    <ul class="box">
        <li cppytemp>$title : $$price </li>
    </ul>
    
##圖片方式

    $(".not_img").cppy({
        title: "背景圖",
        img: "images/flower.jpg"
    });
    
    <div class="not_img">
        <div cppytemp>
            <img cppytemp class="callimg" title="$title" data-cppyimg="$img">
            <div class="callimg" title="$title" data-cppyimg="$img"></div>
            <i class="callimg" title="$title" data-cppyimg="$img"></i>
        </div>
    </div>
    
