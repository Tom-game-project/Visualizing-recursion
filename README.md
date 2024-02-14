# 再帰の可視化

## 遊び方

rustの色々が入ってる必要があります

```sh
cd wasm-sudoku
wasm-pack build --target web
cd ..
```

VS code のLive Serverとか使うとすぐに見れる

レンダリングに時間がかかるけど壊れてるわけじゃない

ほんとにずっと表示されないないときはdevelopertoolsを開いて確認、デバイスの性能が限界そうであれば、index.htmlの

```js
            draw_viz(data.slice(0,3100));
```

スライスの範囲を小さくしてあげれば良い
