extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

pub fn possibility(x:i8,y:i8,arr:&Vec<Vec<u8>>)->Vec<u8>{
    let cx = (x/3)*3;
    let cy = (y/3)*3;
    //横
    let rs = &arr[y as usize];
    //縦
    let mut cs:Vec<u8> = Vec::new();
    for i in arr{
        cs.push(i[x as usize]);
    }
    let a = &arr[cy as usize][cx as usize..(cx+3) as usize];
    let b = &arr[(cy+1) as usize][cx as usize..(cx+3) as usize];
    let c = &arr[(cy+2) as usize][cx as usize..(cx+3) as usize];

    let mut rlist:Vec<u8> = Vec::new();
    for i in 0..10{
        if !(
            rs.contains(&i) || 
            cs.contains(&i) ||
            a.contains(&i) ||
            b.contains(&i) ||
            c.contains(&i)
        ){
            rlist.push(i);
        }
    }
    return rlist;
}


pub fn remain_zero(list:Vec<Vec<u8>>)->bool{
    for i in list{
        if i.contains(&0){
            return true
        }
    }
    return false
}

pub fn find_zero(list:&Vec<Vec<u8>>)->[i8;2]{
    for (y,row) in list.iter().enumerate(){
        for (x,d) in row.iter().enumerate(){
            if d==&0{
                return [x as i8,y as i8]
            }
        }
    }
    return [-1,-1]
}


pub fn solver(arr:&Vec<Vec<u8>>)->Option<Vec<Vec<u8>>>{
    //再帰的に数独の問題を解決する
    if remain_zero((&arr).to_vec()){
        let [x,y] = find_zero(&arr);
        
        let plist = possibility(x, y, &arr);
        if plist.len()==0{
            return None
        }
        for i in plist{
            let mut new_arr:Vec<Vec<u8>> = arr.clone();
            new_arr[y as usize][x as usize]=i;
            let s = solver(&new_arr);
            if let Some(value) = s{
                return Some(value);
            }else{
                //pass
            }
        }
        return None;
    }else{
        return Some((&arr).to_vec());
    }
}

#[wasm_bindgen]
pub fn sudoku(arr:Vec<u8>)->Vec<u8>{
    let mut arglist = Vec::new();
    for i in 0..9{
        let row:Vec<u8>=arr[i*9..i*9+9].to_vec();
        arglist.push(row);
    }
    let rlist=solver(&arglist).unwrap();
    let mut rarr = Vec::new();
    for i in rlist{
        rarr.push(i)
    }
    return rarr.concat()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let arr=vec![
            0,7,0,0,0,1,0,0,4,
            0,6,0,0,0,0,0,2,0,
            2,0,1,0,5,0,0,0,3,
            0,2,0,0,0,0,0,0,0,
            8,0,4,0,0,6,0,3,0,
            0,0,0,9,0,0,0,0,5,
            0,0,0,0,6,0,4,0,0,
            1,0,3,0,0,4,0,8,0,
            0,0,7,0,0,0,0,0,0
        ];

        let result = sudoku(arr);

        println!("{:?}",result)
    }
}
