<%@ WebHandler Language="C#" Class="imageUp" %>
<%@ Assembly Src="Uploader.cs" %>

using System;
using System.Web;
using System.IO;
using System.Collections;

public class  imageUp: IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/html";

            //上传配置
            string pathbase = "upload/";                                                          //保存路径
            int size = 2;                     //文件大小限制,单位mb                                                                                   //文件大小限制，单位KB
            string[] filetype = { ".gif", ".png", ".jpg", ".jpeg", ".bmp" };                    //文件允许格式

            string type = context.Request["type"];
            string editorId = context.Request["editorid"];

        
            //上传图片
            Hashtable info = new Hashtable();
            Uploader up = new Uploader();
            info = up.upFile(context, pathbase, filetype, size); //获取上传状态

            if (type == "ajax")
            {
                HttpContext.Current.Response.Write(info["url"]);
            }
            else
            {
                HttpContext.Current.Response.Write("<script>parent.UM.getEditor('"+ editorId +"').getWidgetCallback('image')('" + info["url"] + "','" + info["state"] + "')</script>");//回调函数
                
            }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}