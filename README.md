# Webpack-with-ASP.NET-MVC


今年三月剛到新公司報到，過試用期之後第一個任務，就是在 ASP.NET MVC 導入 Webpack。主管跟我提這個想法時，當下其實沒想太多，心想著 Webpack 又不是沒用過，就來試試看吧！實際執行後才發現自己對於 Webpack 其實一知半解。以前直接從網路上 Copy 設定檔下來用，根本沒去理解到底是怎麼運作的。像 Alias、Externals、DefinePlugin 一開始都搞不太清楚差別… 也不清楚該如何架構多入口頁面的專案，更不用說後續的優化打包檔案大小以及優化打包速度。幸好在不斷的閱讀文件並不斷嘗試後，逐漸摸索出一點心得。希望能透過這次IT鐵人賽分享這次導入 Webpack 的經驗。 


-----


> 拿出勇者鬥惡龍般的勇氣，我們一起超越不可能！


-----


## 任務
ASP.NET MVC 導入 Webpack 整合前端開發流程


-----



## 網站類型
一般中大型購物網站


-----



## 目前開發環境
- Visual Studio IDE
- ASP.NET MVC
- React
- Reactjs.NET 處理 SSR
- SASS 
- ASP.NET Bundling and Minification
- Gulp
- Sprite Smith


-----



## 專案現況
設計及切版是由設計部門處理，因此 SASS 檔是在不同的 repo 專案，使用 Gulp Compile SASS 並產生 Sprite 圖後，再搬移回主專案。開發流程繁瑣，不同部門的人員協作時，須注意兩個專案，檔案是否有不同步的情形。
專案使用的打包工具 Bundling and Minification 有一些缺點，比如所有的 Module 全部都會塞到 Window 底下汙染全域、需要維護 BundleConfig 檔、只能人工區分 Common 檔等等。因此希望透過導入 Webpack 來統整前端開發流程。


-----



## 希望優化 / 導入的項目
- 導入 Webpack 4 整合前端開發流程
- 透過 Webpack Compile SASS
- 導入CSS Module
- 集成 PostCSS / Autoprefixer
- 使用 Sprite-Smith-Plugin 產生雪碧圖
- 導入 ESLint & Prettier 確保團隊程式碼品質
- 導入 React Styleguidist
- 使用視覺化分析工具檢視打包策略是否須調整

