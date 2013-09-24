<%@ LANGUAGE="VBSCRIPT" CODEPAGE="65001" %> 
<!--#include file="Uploader.Class.asp"-->
<%
    Dim MAX_SIZE, ALLOW_FILES, UPLOAD_PATH, DEBUG


'配置
'MAX_SIZE 在这里设定了之后如果出现大上传失败，请执行以下步骤
'IIS 6 
    '找到位于 C:\Windows\System32\Inetsrv 中的 metabase.XML 打开，找到ASPMaxRequestEntityAllowed 把他修改为需要的值（如10240000即10M）
'IIS 7
    '打开IIS控制台，选择 ASP，在限制属性里有一个“最大请求实体主题限制”，设置需要的值

    MAX_SIZE = 10 * 1024 * 1024 ' = 10M'
    ALLOW_FILES = Array(".gif", ".png", ".jpg", ".jpeg", ".bmp")
    UPLOAD_PATH = "upload/"
    DEBUG = False

    Upload

    Sub Upload()
        Dim url, filename, filestream, savepath, up, formValues

        If Request.TotalBytes > MAX_SIZE Then           
            SetResult "", "文件大小超过服务器限制（" & (MAX_SIZE / 1024 / 1024) & "M）"
            Exit Sub
        End If

        Set up = new Uploader
        Set formValues = up.Process()

        filename = formValues.Item("filename")

        If CheckExt(filename) = False Then
            SetResult "","不允许的文件类型！"
            Exit Sub
        End If

        savepath = GetSavePath()
        CheckOrCreatePath(Server.MapPath(savepath))

        url = savepath + GetSaveName(filename)

        Set filestream = formValues.Item("upfile")
        filestream.SaveToFile Server.MapPath(url)
        filestream.Close

        SetResult url, "SUCCESS", formValues
    End Sub

    Sub SetResult( url, state, ByRef formValues )   
        Session.CodePage = 65001
        Response.AddHeader "Content-Type", "text/html;charset=utf-8"
        SetLocale 2052
        If Request.QueryString("type") = "ajax" Then
            Response.Write( url )
        ElseIf DEBUG Then
            Response.Write( "<img src='" + url + "' /><br />")
            For Each key In formValues.Keys
                If key <> "upfile" Then
                    Response.Write( key & " = " & formValues.Item(key) & "<br />" )
                End If
            Next
        Else
            Response.Write( "<script>parent.UM.getEditor('" + Request.QueryString("editorId") + "').getWidgetCallback('image')('" + url + "','" + state + "')</script>" )
        End If
    End Sub

    Function CheckExt( file )
        For Each ext In ALLOW_FILES
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
            If fs.FolderExists( path ) = False Then
                fs.CreateFolder( path )
            End If
        Next
    End Function

%>