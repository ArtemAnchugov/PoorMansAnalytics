$iisLogsFolderPath = "C:\inetpub\logs\LogFiles\W3SVC1\"
$outputFolderPath = "C:\inetpub\wwwroot\data\"
$pathToLogParser = "C:\Program Files (x86)\Log Parser 2.2\LogParser.exe"

$yesterdaysLogFileName = [String]::Format("u_ex{0}.log", (get-date).ToUniversalTime().AddDays(-1).ToString('yyMMdd'))
$yesterdaysLogFilePath = [IO.Path]::Combine($iisLogsFolderPath,  $yesterdaysLogFileName)

Function RunQuery($queryPath, $url)
{
	$urlPostfix = ''
	If ($url -ne $NULL) {
		$urlPostfix = '. ' + $url.Replace('/','⁄')
	}
	$outputFileName = [IO.Path]::GetFileNameWithoutExtension($queryPath) + $urlPostfix + ".csv"	
	$outputFilePath = [IO.Path]::Combine($outputFolderPath, $outputFileName)
	Write-Host $url
	Write-Host $outputFilePath
	$params = [String]::Format('file:"{0}"?outputPath="{1}"+logPath="{2}"+url="{3}" -i:IISW3C -o:CSV', $queryPath, $outputFilePath, $yesterdaysLogFilePath, $url)
	$executable = [String]::Format('& "{0}" {1}', $pathToLogParser, $params)
	Write-Host $executable
	$r = Invoke-Expression $executable
	return $outputFilePath
}

RunQuery "IIS. Top 15 popular requests.sql"
RunQuery "IIS. Requests per hour.sql"
$top15ExpensiveQueryPath = RunQuery "IIS. Top 15 expensive requests.sql"


$a = (Get-Content $top15ExpensiveQueryPath)
For ($i=1; $i -lt $a.Length; $i++)  { RunQuery "IIS. Time-taken depending on time of the day.sql" $a[$i].Split(',')[0]}

