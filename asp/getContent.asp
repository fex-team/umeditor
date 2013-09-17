<% @LANGUAGE="VBSCRIPT" CODEPAGE="65001" %> 
<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
<%
	Dim content
	content = Request.Form("myEditor")
	content = Server.HTMLEncode(content)
	Response.Write("第1个编辑器的值")
	Response.Write("<div class='content'>" + content + "</div>")
%>