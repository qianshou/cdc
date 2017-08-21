/**
 * Created by zhezhao on 2017/8/17.
 */

function get_bestway(map,hashmap,hashmap_block){
    var input = map.entrance;
    var output = map.exit;
    var precalculate_queue = [];
    var ret = {
        code:0,
        msg:'',
        stack:[]
    };
    if(map.entrance==null||typeof map.entrance=="undefined"){
        ret.code = -1;
        ret.msg = '入口位置未定义';
        return ret;
    }
    if(map.exit==null||typeof map.exit=="undefined"){
        ret.code = -1;
        ret.msg = '出口位置未定义';
        return ret;
    }
    precalculate_queue.push({x: input.x, y: input.y });
    hashmap[input.x][input.y] = 0;
    while(precalculate_queue.length != 0) {
        var current_place = precalculate_queue.shift();
        if(1 <= current_place.x && hashmap_block[parseInt(current_place.x)-1][current_place.y] == 0 && (
                hashmap[parseInt(current_place.x)-1][current_place.y] == -1 ||
                parseInt(hashmap[current_place.x][current_place.y]) + 1 < hashmap[current_place.x - 1][current_place.y]
            )
        ) {
            hashmap[parseInt(current_place.x)-1][current_place.y] = parseInt(hashmap[current_place.x][current_place.y]) + 1;
            precalculate_queue.push({x: parseInt(current_place.x)-1, y: current_place.y});
        };
        if(current_place.x < map.rows && hashmap_block[parseInt(current_place.x)+1][current_place.y] == 0 && (
                hashmap[parseInt(current_place.x)+1][current_place.y] == -1 ||
                parseInt(hashmap[current_place.x][current_place.y]) + 1 < hashmap[parseInt(current_place.x)+1][current_place.y]
            )
        ) {
            hashmap[parseInt(current_place.x) + 1][current_place.y] = parseInt(hashmap[current_place.x][current_place.y]) + 1;
            precalculate_queue.push({x: parseInt(current_place.x) + 1, y: current_place.y});
        };

        if(1 <= current_place.y && hashmap_block[current_place.x][parseInt(current_place.y)-1] == 0 && (
                hashmap[current_place.x][parseInt(current_place.y-1)] == -1 ||
                parseInt(hashmap[current_place.x][current_place.y]) + 1 < hashmap[current_place.x][parseInt(current_place.y)-1]
            )
        ) {
            hashmap[current_place.x][parseInt(current_place.y)-1] = parseInt(hashmap[current_place.x][current_place.y]) + 1;
            precalculate_queue.push({x: current_place.x, y: parseInt(current_place.y)-1});
        };

        if(current_place.y < map.cols && hashmap_block[current_place.x][parseInt(current_place.y)+1] == 0 && (
                hashmap[current_place.x][parseInt(current_place.y)+1] == -1 ||
                parseInt(hashmap[current_place.x][current_place.y]) + 1 < hashmap[current_place.x][parseInt(current_place.y)+1]
            )
        ) {
            hashmap[current_place.x][parseInt(current_place.y)+1] = parseInt(hashmap[current_place.x][current_place.y]) + 1;
            precalculate_queue.push({x: current_place.x, y: parseInt(current_place.y)+1});
        };
    }

    if(hashmap[output.x][output.y] == -1) {
        ret.code = -1;
        ret.msg = '不存在从入口到出口的路径';
        return ret;
    }
    else {
        var back_step = {x: output.x, y: output.y, step: hashmap[output.x][output.y]};

        while(back_step.step != 1) {
            var current_step = back_step.step;
            if(1 <= back_step.x && hashmap[parseInt(back_step.x)-1][back_step.y] == current_step - 1) {
                back_step.x = parseInt(back_step.x)-1;
                back_step.y = back_step.y;
                back_step.step = current_step - 1;
            }
            else if(back_step.x < map.cols - 1 && hashmap[parseInt(back_step.x)+1][back_step.y] == current_step - 1) {
                back_step.x = parseInt(back_step.x)+1;
                back_step.y = back_step.y;
                back_step.step = current_step - 1;
            }
            else if(1 <= back_step.y && hashmap[back_step.x][back_step.y - 1] == current_step - 1) {
                back_step.x = back_step.x;
                back_step.y = back_step.y - 1;
                back_step.step = current_step - 1;
            }
            else if(back_step.x < map.rows - 1 && hashmap[back_step.x][parseInt(back_step.y) + 1] == current_step - 1) {
                back_step.x = back_step.x;
                back_step.y = parseInt(back_step.y) + 1;
                back_step.step = current_step - 1;
            }
            var  key = "#td_"+back_step.x+"_"+back_step.y;
            ret.code = 1;
            ret.stack.push(key);
        };
        return ret;
    }
}