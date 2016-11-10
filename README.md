cppy.js
=======
添加 JSON 數據，自動在地模版，簡化你的工作。

# 使用方法
1.指定要的模板，想要替換的文字，使用 "$" 開頭，並添加屬性 data-cppy-temp，確保模板初始化之前不會顯示

````html
<div data-cppy-temp class="box" data-id="$id">
    $text
</div>
````

##添加顯示資料
- selector 選擇器
- data 餵入的資料
````javascript
$().cppy(selector, data)
````
例如
````javascript
$().cppy(".box", {
    id: 1,
    text: 'First'
})
````
或
````javascript
$().cppy(".box", [
    {
        id: 1,
        text: 'Pen'
    },
    {
        id: 2,
        text: 'Apple'
    }
]);
````

#指定圖片方式
為了避免 <img src="$url"> 這種方式，會讓瀏覽器先拋出 get 到伺服器所產生無法讀取圖片的錯誤。網址的部分要改成 data-cppy-background="$url" 。
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



