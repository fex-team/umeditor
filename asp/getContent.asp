<% @LANGUAGE="VBSCRIPT" CODEPAGE="65001" %>
<script src="../third-party/jquery.min.js"></script>
<script src="../third-party/mathquill/mathquill.min.js"></script>
<link rel="stylesheet" href="../third-party/mathquill/mathquill.css"/>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
<%
	Dim content
	content = Request.Form("myEditor")
	Response.Write("<div class='content'>" + content + "</div>")
%>