function $(selector){
    return document.querySelector(selector)
}

function $$(selector){
    return document.querySelectorAll(selector)
}

function fixtime(t){
    if(`${t}`.length===1){
        return `0${t}`
    } else{
        return t
    }
}

function fixday(d){
    var arrDay = ["周日","周一","周二","周三","周四","周五","周六"]
    return arrDay[d]
}

let app = {
    init(){
        var _this = this
        this.getData(function(data){
            console.log(data)
            _this.bindEvent(data)
            _this.render(data) 
        })
    },
    getData(callback){
        let xhr = new XMLHttpRequest()
        xhr.open("get", "https://weixin.jirengu.com/weather", true)
        xhr.onload = function(){
            callback(JSON.parse(xhr.responseText))
        }
        xhr.send()
    },
    bindEvent(data){
        $$('section .cover .tab-header li').forEach((ele,index)=>{
            ele.addEventListener('click',function(){
                $$('section .cover .tab-header li').forEach(node=>{
                    node.classList.remove('active')
                })
                this.classList.add('active')
                $$('section .cover .tab-content li').forEach(node=>{
                    node.classList.remove('active')
                })
                $$('section .cover .tab-content li')[index].classList.add('active')
            })
        })
    },
    render(data){
        $('section .cover .location .city').innerText = data.weather[0].city_name
        var d = new Date(data.weather[0].last_update)
        $('section .cover .location .time').innerText = `${d.getHours()}:${fixtime(d.getMinutes())}`
        $('section .weather-data .now .temperature').innerText = `${data.weather[0].now.temperature}°`
        $('section .weather-data .now .date').innerText = `${d.getMonth()+1}月${fixtime(d.getDate())}日 ${fixday(d.getDay())}`
        $('section .weather-data .now .weather-pic img').src = `http://weixin.jirengu.com/images/weather/code/${data.weather[0].now.code}.png`
        $('section .weather-data .now .more').innerText = `${data.weather[0].now.text} ${data.weather[0].now.air_quality.city.quality}`
        $$('section .weather-data .future li').forEach(function(node,index){
            node.querySelector('.day').innerText = data.weather[0].future[index+1].day
            node.querySelector('.weather-pic img').src = `http://weixin.jirengu.com/images/weather/code/${data.weather[0].future[index+1].code1}.png`
            node.querySelector('.temperature').innerText = data.weather[0].future[index+1].low + '°~' + data.weather[0].future[index+1].high + '°'
        })
        var ind = 0
        for(var key in data.weather[0].today.suggestion){
            $$('section .cover .tab-content li')[ind].innerText = data.weather[0].today.suggestion[key].details
            ind++
        }
    }
}

app.init()