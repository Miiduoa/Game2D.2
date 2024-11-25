package com.example.game2d
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch
import android.content.Context
import android.media.MediaPlayer

class Game(val scope: CoroutineScope, val screenW:Int, val screenH: Int, scale:Float, context: Context) {
    //背景音樂
    var mper1 = MediaPlayer.create(context, R.raw.lastletter)
    //結束音樂
    var mper2 = MediaPlayer.create(context, R.raw.gameover)

    var counter = 0
    val state = MutableStateFlow(0)
    val background = Background(screenW)
    val boy = Boy(screenH, scale)
    val virus = Virus(screenW, screenH, scale)
    var isPlaying = true

    fun Play(){
        scope.launch {
//counter = 0
            isPlaying = true
            while (isPlaying) {
                mper1.start()  //播放背景音樂
                delay(40)
                background.Roll()
                if (counter % 3 == 0){
                    boy.Walk()
                    virus.Fly()
                    //判斷是否碰撞，結束遊戲
                    if(boy.getRect().intersect(virus.getRect())) {
                        isPlaying = false
                        mper1.pause()
                        mper2.start()
                    }

                }
                counter++
                state.emit(counter)
            }
        }
    }
    fun Restart(){
        virus.Reset()
        counter = 0
        isPlaying = true
        Play()
    }
}