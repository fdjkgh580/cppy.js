cppy.js
=======
添加 JSON 數據，自動在地模版，簡化你的工作。

# 單筆資料
1. 加入 data-cppy-temp 屬性, 這個屬性會讓模板預先隱藏
````html
<div data-cppy-temp></div>
````

2. 加入 class 屬性
````html
<div data-cppy-temp class="box"></div>
````

3. 加入 $ 開頭的變數作為銜接 Object 的值
````html
<div data-cppy-temp class="box" data-id="$id">$text</div>
````

4. 添加資料
````javascript
$().cppy(".box", {
    id: 1,
    text: 'First'
})
````
## 輸出
````html
<div class="box" data-id="1" data-cppy-class="cppy-1494581351983">First</div>
````


# 連續加入資料
````javascript
$().cppy(".box", {
    id: 1,
    text: 'First'
})

$().cppy(".box", {
    id: 2,
    text: 'Second'
})

$().cppy(".box", [
    {
        id: 3,
        text: 'Pen'
    },
    {
        id: 4,
        text: 'Apple'
    }
]);
````
````html
<div data-cppy-temp class="box" data-id="$id">$text</div>
````

## 輸出
````html
<div class="box" data-id="1" data-cppy-class="cppy-1494581351983">First</div>
<div class="box" data-id="2" data-cppy-class="cppy-1494581351986">Second</div>
<div class="box" data-id="3" data-cppy-class="cppy-1494581351986">Pen</div>
<div class="box" data-id="4" data-cppy-class="cppy-1494581351986">Apple</div>
````

# 巢狀資料
- 物件 id 以 $id 表示
- 物件 user.image.s 以 $user-image-s 表示
````javascript
// AJAX
var data = [{
    id: '001',
    user: {
        name: 'Chang',
        image: {
            s: 's.png',
            m: 'm.png'
        },
        phone: {
            tel: '07-3333333',
            mobile: '+886933-333-333'
        },
        age: 30
    }
}];
````

````html
<ul data-cppy-temp class="multi" id="$id">
    <li>$id</li>
    <ul>
        <li>$user-name</li>
        <li>$user-age</li>
        <li>$user-phone-tel</li>
        <li>$user-phone-mobile</li>
        <li>$user-image-s</li>
        <li>$user-image-m</li>
    </ul>
</ul>
````

````javascript
$().cppy(".multi", data);
````

## 輸出
````html
<ul class="multi" id="001" data-cppy-class="cppy-1494582772385">
    <li>001</li>
    <ul>
        <li>Chang</li>
        <li>30</li>
        <li>07-3333333</li>
        <li>+886933-333-333</li>
        <li>s.png</li>
        <li>m.png</li>
    </ul>
</ul>
````

# 將模板寫入其他位置
````javascript
var data = [{
    id: '001',
    user: {
        name: 'Chang',
        image: {
            s: 's.png',
            m: 'm.png'
        },
        phone: {
            tel: '07-3333333',
            mobile: '+886933-333-333'
        },
        age: 30
    }
}];
````
````html
<ul data-cppy-temp class="multi" id="$id">
    <li>$id</li>
    <ul>
        <li>$user-name</li>
        <li>$user-age</li>
        <li>$user-phone-tel</li>
        <li>$user-phone-mobile</li>
        <li>$user-image-s</li>
        <li>$user-image-m</li>
    </ul>
</ul>

<div class="area_a"></div>
````
````javascript
$().cppy(".multi", data, function(obj){
    $(".area_a").html(obj.html);
});
````
# 輸出
````html
<div class="area_a">
    <ul class="multi" id="001" data-cppy-class="cppy-1494582128250">
        <li>001</li>
        <ul>
            <li>Chang</li>
            <li>30</li>
            <li>07-3333333</li>
            <li>+886933-333-333</li>
            <li>s.png</li>
            <li>m.png</li>
        </ul>
    </ul>
</div>
````

# 圖片
為了避免 src="$url" 這種方式，會讓瀏覽器先拋出 get 到伺服器所產生無法讀取圖片的錯誤。網址的部分要改成 data-cppy-background="$url" ， cppy.js 會自動幫您替換為 src="" 的屬性或 CSS 背景。
````html
<div data-cppy-temp class="background">
    <img data-cppy-background="$url" width="100">
    <div data-cppy-background="$url" style="width:100px; height: 100px; background-size: cover; "></div>
</div>
````

````javascript
$().cppy(".background", {
    url : '../images/flower.jpg',
})
````
就這麼簡單。若要看更多範例，可以參考 Demo/ 底下的文件。


