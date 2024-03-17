import init,{sudoku} from "../wasm-sudoku/pkg/wasm_sudoku.js";

function draw_viz(data) {
    let string_list = [];
    for (const i of data) {
        string_list.push(`${i.from} -> ${i.to}`);
    }
    let graphviz = d3.select("#graph").graphviz();
    graphviz.renderDot(`
digraph { ${string_list.join("\n")} }
`);
}
    

/**
 * # 数独用入力欄
 * 
 * もしクリックされたなら入力用ポップを出す
 */

const tbody = document.getElementById("input_area");
const  number_key_pad_tbody = document.getElementById("number_key_pad_tbody");

console.log(tbody);
console.log(number_key_pad_tbody);

let selected_box_row = null;
let selected_box_column = null;


// 範囲外をクリックしたときは数字キーパッドを隠す
document.addEventListener("click",function(event){
    if (!(tbody.contains(event.target) || number_key_pad_tbody.contains(event.target))){
        const number_key_pad = document.getElementById("number_key_pad");
        selected_box_row = null;
        selected_box_column = null;
        number_key_pad.style.display = "none";
    }
});


/**
 * # setting_boxes
 * @param {HTMLElement} elem 
 * @param {Number} width 
 * @param {Number} height 
 */
function settingBoxes(elem,width,height){
    for (let i = 0;i < height;i++){
        let row = document.createElement("tr");
        for (let j = 0;j < width;j++){
            let td = document.createElement("td");
            td.setAttribute("class","box");
            td.setAttribute("box-row",String(i));
            td.setAttribute("box-column",String(j));
            td.addEventListener("click",function(event){
                let rect = td.getBoundingClientRect(); 
                selected_box_row = event.target.getAttribute("box-row");
                selected_box_column = event.target.getAttribute("box-column");
                // 数字キーパッドを表示する
                const number_key_pad = document.getElementById("number_key_pad");
                number_key_pad.style.display = "inline";
                number_key_pad.style.left = (rect.left) + 'px';
                number_key_pad.style.top = (rect.bottom) + 'px';
            })
            row.appendChild(td);
        }
        elem.appendChild(row);
    }
}


/**
 * keylistは二次元配列
 * elem はtbody
 */
function settingNumberKeypad(elem,keylist){
    for (const i of keylist){
        let row = document.createElement("tr");
        for (const j of i){
            let td = document.createElement("td");
            td.setAttribute("class","num");
            if (j!=null){
                td.textContent = j;
            }else{
                td.style.visibility = "hidden";
            }
            td.addEventListener("click",function(event){
                let selected_position = document.querySelector(`[box-row="${selected_box_row}"][box-column="${selected_box_column}"]`);
                selected_position.textContent = String(td.textContent);
                console.log(selected_box_row,selected_box_column,td.textContent);
            })
            row.appendChild(td);
        }
        elem.appendChild(row);
    }
}

/**
 * # 
 * elem はtbody
 * @param {HTMLElement} elem 
 * @param {Array} defaultlist 
 */
function settingDefaultNumber(default_list){
    let row_ = 0;
    let column_ = 0;
    for (const i of default_list){
        column_ = 0;
        for (const j of i){
            let selected_position = document.querySelector(`[box-row="${row_}"][box-column="${column_}"]`);
            if (j == 0){
                selected_position.textContent = "";
            }else{
                selected_position.textContent = j;
            }
            column_++;
        }
        row_++;
    }
}


/**
 * # getSudokuArr
 * 
 * @returns {Array}
 */
function getSudokuArr(width,height){
    let rarr = [];
    for (let row_ = 0;row_ < width;row_++){
        for (let column_ = 0;column_ < height;column_++){
            let selected_position = document.querySelector(`[box-row="${row_}"][box-column="${column_}"]`);
            if (selected_position.textContent==""){
                rarr.push(0);
            }else{
                rarr.push(Number(selected_position.textContent))
            }
        }
    }
    return rarr;
}

// setting
settingBoxes(tbody,9,9);
settingNumberKeypad(
    number_key_pad_tbody,
    [
        [7,8,9],
        [4,5,6],
        [1,2,3],
        [null," ",null]
    ]    
);
// デフォルトの数独例
settingDefaultNumber([
        [0, 0, 4, 9, 0, 0, 0, 6, 1],
        [2, 0, 6, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 3, 6, 0, 0, 2, 0],
        [0, 3, 7, 0, 0, 0, 0, 0, 4],
        [0, 0, 0, 1, 0, 0, 6, 0, 0],
        [0, 1, 0, 0, 4, 0, 3, 0, 5],
        [7, 4, 0, 0, 3, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 5, 0, 0, 9],
        [0, 0, 0, 0, 0, 2, 0, 4, 0],
])

console.log("開始します")
init().then(()=>{
    let solve_button = document.getElementById("solve_button");
    solve_button.addEventListener("click",function(event){
        console.log("数独を解いています");
        let q_arr = getSudokuArr(9,9);
        let data = JSON.parse(sudoku(q_arr));
        console.log("数独を解き終わりました");
        console.log("再帰構造をレンダリングしています")
         
        draw_viz(data.slice(0,3100));
        console.log("レンダリングを終了しました")
    })
});
    
    