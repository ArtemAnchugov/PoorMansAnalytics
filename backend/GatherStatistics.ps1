$iisLogsFolderPath = "C:\inetpub\logs\LogFiles\W3SVC1\"
$outputFolderPath = "C:\inetpub\wwwroot\data\"
$pathToLogParser = "C:\Program Files (x86)\Log Parser 2.2\LogParser.exe"

$yesterdaysLogFileName = [String]::Format("u_ex{0}.log", (get-date).ToUniversalTime().AddDays(-1).ToString('yyMMdd'))
$yesterdaysLogFilePath = [IO.Path]::Combine($iisLogsFolderPath,  $yesterdaysLogFileName)

Function RunQuery($queryPath, $url)
{
	$outputFilePath = [IO.Path]::Combine($outputFolderPath, [IO.Path]::ChangeExtension($queryPath,"csv"))
	$params = [String]::Format('file:"{0}"?outputPath="{1}"+logPath="{2}"+url="{3}" -i:IISW3C -o:CSV', $queryPath, $outputFilePath, $yesterdaysLogFilePath, $url)
	$executable = [String]::Format('& "{0}" {1}', $pathToLogParser, $params)
	Invoke-Expression $executable
}

RunQuery "IIS. Top 15 popular requests.sql"
RunQuery "IIS. Top 15 expensive requests.sql"
RunQuery "IIS. Requests per hour.sql"
RunQuery "IIS. Time-taken depending on time of the day.sql" "/"

