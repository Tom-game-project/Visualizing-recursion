import init,{sudoku} from "../wasm-sudoku/pkg/wasm_sudoku.js";

function draw(tree_map){
 
    var nodes = Array(tree_map[tree_map.length - 1].to)
        .fill(null)
        .map((_, i) => ({ id: i + 1, label: `${i + 1}` }));
    var edges = tree_map;
 
    // create a network
    var container = document.getElementById("mynetwork");
    var data = {
        nodes: new vis.DataSet(nodes),
        edges: new vis.DataSet(edges),
    };
    var options = {
        layout: {
            hierarchical: {
                direction: "UD",
                sortMethod: "hubsize",
            },
        },
        edges: {
            arrows: "to",
        }, physics: {
            enabled: false,
        }, interaction: {
            tooltipDelay: 200,
            hideEdgesOnDrag: true,
            dragNodes: false,
        },
        configure: {
            filter: function (option, path) {
                if (path.indexOf("hierarchical") !== -1) {
                    return true;
                }
                return false;
            },
            showButton: false,
        },
    };
    
    network = new vis.Network(container, data, options);
 
    // periodically change the layout
 
}

function draw_viz(data) {
    let string_list = [];
    for (const i of data) {
        string_list.push(`${i.from} -> ${i.to}`);
    }
    var graphviz = d3.select("#graph").graphviz();
    graphviz.renderDot(`
digraph { ${string_list.join("\n")} }
`);
}
    

console.log("開始します")
init().then(()=>{
    let q_2 = [
        ...[0, 0, 4, 9, 0, 0, 0, 6, 1],
        ...[2, 0, 6, 0, 0, 0, 0, 0, 0],
        ...[1, 0, 0, 3, 6, 0, 0, 2, 0],
        ...[0, 3, 7, 0, 0, 0, 0, 0, 4],
        ...[0, 0, 0, 1, 0, 0, 6, 0, 0],
        ...[0, 1, 0, 0, 4, 0, 3, 0, 5],
        ...[7, 4, 0, 0, 3, 0, 0, 0, 0],
        ...[0, 0, 0, 0, 1, 5, 0, 0, 9],
        ...[0, 0, 0, 0, 0, 2, 0, 4, 0],
    ]
 
    console.log("数独を解いています")
    let data = JSON.parse(sudoku(q_2));
    console.log("数独を解き終わりました");
    console.log("再帰構造をレンダリングしています")
 
    draw_viz(data.slice(0,3100));
    console.log("レンダリングを終了しました")
});
    
    