package com.stegappasaurus.bitmap

import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Color
import android.graphics.ImageDecoder
import android.net.Uri
import android.os.Environment
import android.provider.MediaStore
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableNativeArray
import java.io.File
import java.io.FileOutputStream
import java.lang.Math

class BitmapModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "Bitmap"
    }

    @ReactMethod
    fun getPixels(filePath: String, bitsRequired: Int, promise: Promise) {
        try {

            val bitmap = this.getBitmap(filePath)
            val pixelsRequired = Math.ceil(bitsRequired / 3.0).toInt()

            val width = bitmap.getWidth()
            val height = bitmap.getHeight()
            var requiredWidth = pixelsRequired % width
            var requiredHeight = pixelsRequired.div(width) + 1

            if(requiredWidth == 0) {
                requiredWidth = width
            }
            if (requiredHeight > height) {
                requiredHeight = height
            }

            val pixels = WritableNativeArray()
            for (y in 0 until requiredHeight) {
                for (x in 0 until requiredWidth) {
                    val color = bitmap.getPixel(x, y)
                    pixels.pushInt(Color.red(color))
                    pixels.pushInt(Color.green(color))
                    pixels.pushInt(Color.blue(color))
                }
            }

            promise.resolve(pixels)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun setPixels(filePath: String, pixels: ReadableArray, promise: Promise) {
        try {

            val bitmap = this.getBitmap(filePath)
            val width = bitmap.getWidth()
            val height = bitmap.getHeight()
            val pixelsRequired = pixels.size().div(3)

            for (i in 0 until pixelsRequired) {
                val color = Color.argb(255, pixels.getInt(i * 3), pixels.getInt(i * 3 + 1), pixels.getInt(i * 3 + 2))
                val x = i % width
                val y = i.toInt().div(height)
                bitmap.setPixel(x, y, color)
            }

            val myDir = File(Environment.getExternalStorageDirectory(), "Stegappasaurus")

            if (!myDir.exists()) {
                if (!myDir.mkdirs()) {
                    promise.reject("failed_create_folder", "failed to create directory")
                }
            }

            val date = System.currentTimeMillis()
            val fname = "$date.png"
            val file = File(myDir, fname)
            val out = FileOutputStream(file)
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, out)

            out.flush()
            out.close()
            val uri = Uri.fromFile(file)
            getReactApplicationContext().sendBroadcast(Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, Uri.fromFile(file)))
            promise.resolve(uri.toString())
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    fun getBitmap(filePath: String): Bitmap {
        val context = getReactApplicationContext()
        val cr = context.getContentResolver()
        val uri = Uri.parse(filePath)

        val bitmap: Bitmap
        if (android.os.Build.VERSION.SDK_INT >= 28) {
            val source = ImageDecoder.createSource(cr, uri)
            val onHeaderListener = ImageDecoder.OnHeaderDecodedListener { decoder, _, _ ->
                decoder.setMutableRequired(true)
            }
            bitmap = ImageDecoder.decodeBitmap(source, onHeaderListener)
        } else {
            bitmap = MediaStore.Images.Media.getBitmap(cr, uri)
        }

        return bitmap
    }
}