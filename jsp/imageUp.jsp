    <%@ page language="java" contentType="text/html; charset=utf-8"
        pageEncoding="utf-8"%>
    <%@ page import="ueditor.Uploader" %>

    <%
    request.setCharacterEncoding("utf-8");
	response.setCharacterEncoding("utf-8");
    Uploader up = new Uploader(request);
    up.setSavePath("upload");
    String[] fileType = {".gif" , ".png" , ".jpg" , ".jpeg" , ".bmp"};
    up.setAllowFiles(fileType);
    up.setMaxSize(10000); //单位KB
    up.upload();

    String type = request.getParameter("type");

    if( type != null &&  "ajax".equals( type ) ){
        response.getWriter().print( up.getUrl() );
    }else{
        response.getWriter().print("<script>parent.UE.getWidgetCallback('image')('" + up.getUrl() + "','" + up.getState() + "')</script>");
    }
    %>
