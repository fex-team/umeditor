<%@ LANGUAGE="VBSCRIPT" CODEPAGE="65001" %> 
<%
	Dim MAX_SIZE, ALLOW_FILES, UPLOAD_PATH


'配置
'MAX_SIZE 在这里设定了之后如果出现大上传失败，请执行以下步骤
'IIS 6 
	'找到位于 C:\Windows\System32\Inetsrv 中的 metabase.XML 打开，找到ASPMaxRequestEntityAllowed 把他修改为需要的值（如10240000即10M）
'IIS 7
	'打开IIS控制台，选择 ASP，在限制属性里有一个“最大请求实体主题限制”，设置需要的值

	MAX_SIZE = 10 * 1024 * 1024 ' = 10M'
	ALLOW_FILES = Array(".gif", ".png", ".jpg", ".jpeg", ".bmp")
	UPLOAD_PATH = "upload/"

	Upload

	Sub Upload() 

		Dim boundary, parts, contentBytes, url, state, formValues, filename, filebyte, savepath, instream, outstream

		boundary = GetBoundary()
		If boundary = False Then
			SetResult "", "不正确的表单提交方式，请保证 enctype = ""multipart/form-data"""
			Exit Sub
		End If

		If Request.TotalBytes > MAX_SIZE Then			
			SetResult "", "文件大小超过服务器限制（" + (MAX_SIZE / 1024 / 1024) + "M）"
			Exit Sub
		End If

		contentBytes = Request.BinaryRead( Request.TotalBytes )

		ProcessBytes contentBytes, formValues

		filename = formValues.Item("filename")
		filebyte = formValues.Item("upfile")

		savepath = GetSavePath()
		CheckOrCreatePath( Server.MapPath(savepath) )
		url = savepath + GetSaveName(filename)

		Set instream = Server.CreateObject("ADODB.Stream")
		instream.Type = 1
		instream.Mode = 3
		instream.Open
		instream.Write contentBytes

		Set outstream = Server.CreateObject("ADODB.Stream")
		outstream.Type = 1
		outstream.Mode = 3
		outstream.Open

		instream.Position = InStrB( contentBytes, filebyte ) - 1
		instream.CopyTo outstream, LenB(filebyte)
		Response.Write(url)
		Response.End
		outstream.SaveToFile Server.MapPath(url)

		instream.Close
		outstream.Close

		SetResult url, "SUCCESS"
	End Sub

	Sub ProcessBytes( ByVal bytes, ByRef formValues)
		Dim byteCrLf, bytePtr, byteBoundary, blocks, block, head, content
    	byteCrLf = ChrB(13) + ChrB(10)
    	bytePtr = InStrB( bytes, byteCrLf )
    	byteBoundary = LeftB( bytes, bytePtr - 1 )
	    'Response.BinaryWrite byteBoundary
    	blocks = SplitB( bytes, byteBoundary, -1, vbBinaryCompare )    	
    	Set formValues = Server.CreateObject("Scripting.Dictionary")
    	For Each block In blocks
    		If LenB(block) > 10 Then
		    	block = MidB( block, 3, LenB(block) - 4 )
    			ProcessBlock block, formValues
	    	End If
    	Next
	End Sub

	Sub ProcessBlock( ByRef block, ByRef formValues )
		Dim bytePtr, head, content, byteCrLf		
		Dim valuePtn, valueMatches, valueMatch, key, field, value

    	byteCrLf = ChrB(13) + ChrB(10)

		Set valuePtn = new RegExp
    	valuePtn.Pattern = "(\w+?)=""(.+?)"""
    	valuePtn.Global = True
		bytePtr = InStrB( block, byteCrLf + byteCrLf )
		If bytePtr > 0 Then     		
    		head = LeftB( block, bytePtr - 1 )
    		head = ByteToStr(head)
    		content = MidB( block, bytePtr + 4 )
    		Set valueMatches = valuePtn.Execute( head )
			For Each valueMatch In valueMatches
    			key = valueMatch.SubMatches(0)
    			field = valueMatch.SubMatches(1)
    			Select Case key
	    			Case "name"
	    				formValues.Add field, content 
	    			Case "filename"
	    				formValues.Add key, field
    			End Select
    		Next
    		
		End If
	End Sub

	Sub SetResult( url, state )	
		Session.CodePage = 65001
		Response.AddHeader "Content-Type", "text/html;charset=utf-8"
		SetLocale 2052
		If Request.QueryString("ajax") = "ajax" Then
			Response.Write( url )
		Else
			Response.Write( "<script>parent.UM.getEditor('" + Request.QueryString("editorId") + "').getWidgetCallback('image')('" + url + "','" + state + "')</script>" )
		End If
	End Sub

	Function GetBoundary()
		Dim ct, regex, match
		ct = Request.ServerVariables("CONTENT_TYPE")
		Set regex = new RegExp
		regex.Pattern = "boundary=(.+)"
		regex.Global = True
		regex.IgnoreCase = true
		Set match = regex.Execute( ct )
		If match.Count > 0 Then
			Set match = match(0)
			GetBoundary = match.SubMatches(0)
			Exit Function
		End If
		GetBoundary = False
	End Function

	Function CheckExt( file )
		For Each ext In allowfiles
				'Response.Write(ext & ", " & GetExt(file) & "<br>")
			If GetExt(file) = ext Then 
				CheckExt = true
				Exit Function
			End If
		Next
		CheckExt = false
	End Function

	Function GetExt( file )
		GetExt = Right( file, Len(file) - InStrRev(file, ".") + 1 )
	End Function

	Function GetSavePath()
		GetSavePath = UPLOAD_PATH & GetFormatedDate() & "/"
	End Function

	Function GetSaveName( ByVal filename )
		GetSaveName = TimeStamp() & "_" & Rand(1e12, 1e13 - 1) & "_" & filename
	End Function

	Function TimeStamp()
		Dim hh, mm, ss
		hh = LeadZero(Hour(Now))
		mm = LeadZero(Minute(Now))
		ss = LeadZero(Second(Now))
		TimeStamp = hh & mm & ss
	End Function

	Function Rand( min, max )
	 	Randomize 
	 	Rand = Int( (max - min + 1) * Rnd + min )
	End Function

	Function GetFormatedDate()
		Dim yyyy, mm, dd
		yyyy = Year(Date)
		mm = LeadZero(Month(Date))
		dd = LeadZero(Day(Date))
		GetFormatedDate = yyyy & mm & dd
	End Function

	Function LeadZero( number )
		If number < 10 Then
			LeadZero = "0" & number
		Else
			LeadZero = number
		End If
	End Function

	Function CheckOrCreatePath( ByVal path )
		Set fs = Server.CreateObject("Scripting.FileSystemObject")
		Dim parts
		parts = Split( path, "\" )
		path = ""
		For Each part in parts
			path = path + part + "\"
			'Response.Write "Checking " + path + Chr(10)
			If fs.FolderExists( path ) = False Then
				fs.CreateFolder( path )
			End If
		Next
	End Function

	Function SplitB(ByVal expr, ByVal splitExpr, ByVal count, ByVal vbCompare) 
	    Dim ubnd, lastel, arrTemp, begPtr, bytePtr 
	    If IsEmpty(expr) Or IsNull(expr) Or IsEmpty(splitExpr) Or IsNull(splitExpr) Then 
	        Exit Function 
	    End If 
	    
	    ReDim arrTemp(16) 
	    count = count - 1 
	    lastel = 0 
	    bytePtr = 1 
	    ubnd = 16 
	    Do 
	        begPtr = InStrB(bytePtr, expr, splitExpr, vbCompare) 
	        If begPtr = 0 Then 
	            arrTemp(lastel) = MidB(expr, bytePtr) 
	            Exit Do 
	        Else 
	            arrTemp(lastel) = MidB(expr, bytePtr, begPtr - bytePtr) 
	        End If 
	        bytePtr = begPtr + LenB(splitExpr) 
	        If lastel = count Then Exit Do 
	        lastel = lastel + 1 
	        If (lastel Mod 16) = 0 Then 
	            ubnd = ubnd + 16 
	            ReDim Preserve arrTemp(ubnd) 
	        End If 
	    Loop 
	    ReDim Preserve arrTemp(lastel) 
	    SplitB = arrTemp 
	End Function 

	Function ByteToStr( ByRef bytes ) 
	    Dim i, str
	    For i = 1 To LenB(bytes)
	        str = str & MidB(bytes, i, 1) & ChrB(0) 
	    Next 
	    ByteToStr = str
	End Function
%>