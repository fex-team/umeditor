<%
' ASP 文件上传类
' Author: techird
' Usage:
' 	up = new Uploader
'   Set formValues = up.Process
'   filename = up.Item("filename")
'   Set stream = up.Item("stream")
'   stream.SaveToFile "upload/" & filename
'	stream.Close
Class Uploader
	Private adTypeBinary
	Private adTypeText
	Private adModeReadWrite
	Private binCtLf
	Private binCtLf2

	private Sub Class_Initialize()
		adTypeBinary = 1
		adTypeText = 2
		adModeReadWrite = 3
		binCtLf = ChrB(13) & ChrB(10)
		binCtLf2 = binCtLf & binCtLf
    End Sub

	Private Function OpenStream( optype )
		Set stream = Server.CreateObject("ADODB.Stream")
		stream.Type = optype
		stream.Mode = adModeReadWrite
		stream.Open
		Set OpenStream = stream
	End Function

	Private Function CopyStreamPart( stream, pBgn, pEnd )
		Dim iStream, oStream
		Set iStream = stream
		Set oStream = OpenStream( adTypeBinary )
		iStream.Position = pBgn
		iStream.CopyTo oStream, pEnd - pBgn
		Set CopyStreamPart = oStream
	End Function

	Private Function GetString( stream, pBgn, pEnd )
		Dim iStream, oStream
		Set iStream = stream
		Set oStream = OpenStream( adTypeBinary )
		iStream.Position = pBgn
		iStream.CopyTo oStream, pEnd - pBgn
		oStream.Position = 0
		oStream.Type = adTypeText
		oStream.Charset = GetCharset
		GetString = oStream.ReadText
		oStream.Close
	End Function

	Private Function GetCharset()
		If Charset = "" Then
			GetCharset = "utf-8"
		Else
			GetCharset = Charset
		End If
	End Function

	public Function Process()
		Dim formBytes, bLen, pBgn, pEnd, header, stream

		formBytes = Request.BinaryRead( Request.TotalBytes )
		Set stream = OpenStream( adTypeBinary )
		stream.Write formBytes

		bLen = InStrB( 1, formBytes, binCtLf ) - 1
		boundary = LeftB( formBytes, bLen )
		pBgn = 1

		Dim varPtn, filePtn
		Set varPtn = new RegExp
    	varPtn.Pattern = "(\w+?)=""(.+?)"""
    	varPtn.Global = True
    	Set filePtn = new RegExp
    	filePtn.Pattern = "filename="

    	Dim formValues, key, field
    	Set formValues = Server.CreateObject("Scripting.Dictionary")
		Do
			pBgn = pBgn + bLen + LenB( binCtLf ) - 1
			pEnd = InStrB( pBgn, formBytes, binCtLf2 )

			If pEnd = 0 Then
				Exit Do 'Load Finished
			End If

			header = GetString( stream, pBgn, pEnd )
			isFileBlock = filePtn.Test( header ) 

			pBgn = pEnd + LenB(binCtLf2) - 1
			pEnd = InStrB(pBgn, formBytes, boundary) - LenB( binCtLf ) - 1

			Set matches = varPtn.Execute( header )
			For Each match In matches
				key = match.SubMatches(0)
				field = match.SubMatches(1)
				If key = "filename" Then
					formValues.Add key, field 
				ElseIf key = "name" Then
					If isFileBlock Then
						formValues.Add field, CopyStreamPart(stream, pBgn, pEnd)
					Else
						formValues.Add field, GetString(stream, pBgn, pEnd)
					End If
				End If
			Next

			pBgn = pEnd + LenB( binCtLf ) + 1
		Loop
		stream.Close
		Set Process = formValues
	End Function
End Class

%>