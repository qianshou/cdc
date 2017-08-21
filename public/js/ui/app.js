$(document).ready(function(){
    window.map = {
        rows:0,
        cols:0
    }
    $('#init_map').modal({
        closeViaDimmer:false
    });
});

// 提交模态框
function submit_modal() {
    var maxsize = 30;
    var rows = ($("#map_rows").val()=='')? 0:parseInt($("#map_rows").val());
    var cols = ($("#map_cols").val()=='')? 0:parseInt($("#map_cols").val());
    if(parseInt(rows)<=0 || parseInt(rows)>maxsize){
        if(!$("#rows_container").hasClass("am-form-error")){
            $("#rows_container").addClass("am-form-error");
        }
        return false;
    }
    if(parseInt(cols)<=0 || parseInt(rows)>maxsize){
        if(!$("#cols_container").hasClass("am-form-error")){
            $("#cols_container").addClass("am-form-error");
        }
        return false;
    }
    var hashmap = new Array(rows+1);
    var hashmap_block = new Array(rows+1);
    for(var i = 0; i <= rows; i++) {
        hashmap[i] = new Array(cols+1);
        hashmap_block[i] = new Array(cols+1);
        for(var j = 0; j <= cols; j++) {
            hashmap[i][j] = -1;
            hashmap_block[i][j] = (i==0||j==0)? 1:0;
        };
    }
    window.map.rows = rows;
    window.map.cols = cols;
    window.map.entrance = null;
    window.map.exit = null;
    window.hashmap = hashmap;
    window.hashmap_block = hashmap_block;
    $('#init_map').modal('close');
    init_map();
}

// 初始化地图
function init_map() {
    var map = window.map;
    var table = "<table class=\"am-table am-table-bordered\">";
    for(var i=1;i<=map.rows;i++){
        table += "<tr>";
        for(var j=1;j<=map.cols;j++){
            table += "<td id='td_"+i+'_'+j+"'>&nbsp;</td>";
        }
        table += "</tr>";
    }
    table += "</table>";
    $("#map_container").empty();
    $("#map_container").append(table);

    var _time = null;
    $('td').click(function () {
        //定义或清除障碍物
       clearTimeout(_time);
       window.td_obj = $(this);
       _time = setTimeout(function () {
            var obj = window.td_obj;
            var pos = obj.attr("id").split('_');
            if(obj.hasClass("td_block")){
                obj.removeClass("td_block");
                window.hashmap_block[pos[1]][pos[2]] = 0;
            }else{
                obj.addClass("td_block");
                window.hashmap_block[pos[1]][pos[2]] = 1;
            }
       },200);
    }).dblclick(function () {
        //定义或清除出入口
        clearTimeout(_time);
        var obj = $(this);
        var pos = obj.attr("id").split('_');
        if(obj.hasClass("td_entrance")){
            obj.removeClass("td_entrance");
            window.map.entrance = null;
            return;
        }
        if(obj.hasClass("td_exit")){
            obj.removeClass("td_exit");
            window.map.exit = null;
            return;
        }
        var entrance_num = $("td[class~=td_entrance]").length;
        var exit_num = $("td[class~=td_exit]").length;
        if(exit_num == 0){
            if(entrance_num == 0){
                //定义入口
                obj.addClass("td_entrance");
                window.map.entrance = {
                    x:pos[1],
                    y:pos[2]
                }
            }else{
                //定义出口
                obj.addClass("td_exit");
                window.map.exit = {
                    x:pos[1],
                    y:pos[2]
                }
            }
        }
    });
}

// 显示最优路径
function findBestPath() {
    var map = window.map;
    var hashmap = window.hashmap;
    var hashmap_block = window.hashmap_block;
    var res = get_bestway(map,hashmap,hashmap_block);
    if(res.code <= 0){
        $("#map_res").empty();
        $("#map_res").append("<p class=\"am-text-danger\">"+res.msg+"</p>");
    }else{
        $("#map_res").empty();
        var content = "<p class=\"am-text-danger\">";
        var path_stack = res.stack;
        content += "("+map.entrance.x+","+map.entrance.y+") ";
        while (path_stack.length != 0){
            var step = path_stack.pop();
            $(step).addClass("td_path");
            var pos = step.split('_');
            content += "("+pos[1]+","+pos[2]+") ";
        }
        content += "("+map.exit.x+","+map.exit.y+") ";
        content += '</p>';
        $("#map_res").append(content);
    }
}

// 回车方法
function enter_call(callback) {
    if (event.keyCode==13)
        callback();
}