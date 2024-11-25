package com.example.game2d
import android.graphics.Rect

class Virus(val screenW:Int, val screenH:Int, scale:Float) {
    var w = (80 * scale).toInt()  //病毒寬度
    var h = (80 * scale).toInt()  //病毒高度
    var x = screenW  //病毒x軸座標
    var y = (screenH/2).toInt()  //病毒y軸座標
    var zoomout = (10 * scale).toInt()  //圖片內縮

    var pictNo = 0  //切換圖片

    fun Reset(){
        x = screenW
        y = (screenH/2).toInt()
    }
    fun Fly() {
        pictNo++
        if (pictNo > 1) {
            pictNo = 0
        }

        x -= 10
        y += (-20 .. 20).random()
        if((x+w) < 0){
            Reset()
        }
    }
    //取得病毒所在矩形區域
    fun getRect(): Rect {
        return Rect(x+zoomout, y+zoomout,x+w-zoomout, y+h-zoomout)
    }

}