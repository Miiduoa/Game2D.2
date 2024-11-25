package com.example.game2d
import android.graphics.Rect

class Boy(screenH:Int, scale:Float) {
    var w = (100 * scale).toInt()  //小男孩寬度
    var h = (220 * scale).toInt()  //小男孩高度
    var x = 0  //小男孩x軸座標
    var y = screenH - h  //小男孩y軸座標
    var pictNo = 0  //切換圖片
    var zoomout = (10 * scale).toInt()  //圖片內縮

    fun Walk() {
        pictNo++
        if (pictNo > 7) {
            pictNo = 0
        }
    }
    //取得小男孩所在矩形區域
    fun getRect(): Rect {
        return Rect(x+zoomout, y+zoomout,x+w-zoomout, y+h-zoomout)
    }

}