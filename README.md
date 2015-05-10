cppy.js
=======
依照JSON數據，自動在地模版，簡化你的工作。

    [一般方式]
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
    
    
    [逐筆加入資料]

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
    
    [其餘參考範例]

