var fs = require("fs");
const {PerformanceObserver, performance } = require('perf_hooks');
const rp = require('request-promise');
const $ = require('cheerio');
const url='https://www.bankmega.com';
const scrapurl = 'https://www.bankmega.com/promolainnya.php?';
const Promise = require("bluebird");

global.category;
global.links=[];
global.data = {};
global.func = [];
const page = [5,7,14,1,0,1];
var t0 = performance.now();
 async function get(i,kategori){
    tmp=[];
    var konten = [];
    for(let j=1;j<=page[i-1];j++){
        await rp(scrapurl+"&subcat="+i+"&page="+j).then(async function(html){
                for(let k = 0;k<6;k++){
                    try{
                        var link_tmp = await url+"/"+$('#promolain > li > a',html)[k].attribs.href;
                        await rp(link_tmp).then(async function(html){    
                            console.clear();
                            console.log("=== Dimas Adiyaksa ===");
                            console.log("Mengeksplore : "+kategori);
                            console.log("Mengunduh "+bytes(JSON.stringify(data).length));
                            console.log("Waktu : "+Math.floor((performance.now()-t0)/1000)+" detik");
                            tmp = {
                                    title:  $('.titleinside > h3', html).text(),
                                    link: link_tmp,
                                    area:  $('.area > b', html).text(),
                                    periode:  $('.periode > b',html).text(),
                                    image:   url+$('img',html)[11].attribs.src
                                    
                                }
                                konten.push(tmp);
                            });
                    }catch(err){
                        k++;
                    }
                }
            });
        data[kategori] = konten;
    }
        
}

function bytes(bytes) {
    var label = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + label[i];
 };

async function main(){
    for(let i=1;i<7;i++){
        await rp(scrapurl+"&subcat="+i).then(async function(html){
                    category = $('#subcatselected >  img',html)[0].attribs.title;
        })
        func.push(get(i,category));        
    }
    Promise.all(func).then(function(){
        obj = JSON.stringify(data,null,2);
        fs.writeFile("./solution.json", obj, (err) => {
            if (err) {
                console.error("Gagal Menulis file...");
                return;
            };
            console.clear();
            console.log("=== Dimas Adiyaksa ===")
            console.log("Data Terunduh : "+bytes(JSON.stringify(data).length));
            console.log("Waktu : "+Math.floor((performance.now()-t0)/1000)+" detik");
        });
    },function(){
        console.log("Gagal");
    });
    
    
}

main();