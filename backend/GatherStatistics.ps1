﻿Param (
	[parameter(Mandatory=$false)] 
	[string]$iisLogsFolderPath = "C:\inetpub\logs\LogFiles\W3SVC1\",
	[parameter(Mandatory=$false)] 
	[string]$outputFolderPath = "C:\inetpub\wwwroot\analytics\data\",
	[parameter(Mandatory=$false)] 
	[string]$pathToLogParser = "C:\Program Files (x86)\Log Parser 2.2\LogParser.exe"
)

$yesterdaysLogFileName = [String]::Format("u_ex{0}.log", (get-date).ToUniversalTime().AddDays(-1).ToString('yyMMdd'))
$yesterdaysLogFilePath = [IO.Path]::Combine($iisLogsFolderPath,  $yesterdaysLogFileName)

Function RunQuery($queryPath, $urlFromLogFile)
{
	$urlPostfix = ''
	If ($urlFromLogFile -ne $NULL) {
		$urlPostfix = '. ' + $urlFromLogFile.Replace('/','⁄').Replace('+',' ')
	}
	$outputFileName = [IO.Path]::GetFileNameWithoutExtension($queryPath) + $urlPostfix + ".csv"	
	$outputFilePath = [IO.Path]::Combine($outputFolderPath, $outputFileName)
	Write-Host $urlFromLogFile
	$url = $NULL
	If ($urlFromLogFile -ne $NULL) {
		$url = $urlFromLogFile.Replace('+',' ')
	}
	Write-Host $outputFilePath
	$params = [String]::Format('file:"{0}"?outputPath="{1}"+logPath="{2}"+url="{3}" -i:IISW3C -o:CSV', $queryPath, $outputFilePath, $yesterdaysLogFilePath, $url)
	$executable = [String]::Format('& "{0}" {1}', $pathToLogParser, $params)
	Write-Host $executable
	$r = Invoke-Expression $executable
	return $outputFilePath
}

RunQuery "IIS. Top 15 popular requests.sql"
RunQuery "IIS. Requests per hour.sql"
$top15ExpensiveUrlsPath = RunQuery "IIS. Top 15 expensive requests.sql"

$a = (Get-Content $top15ExpensiveUrlsPath)
For ($i=1; $i -lt $a.Length; $i++)  { RunQuery "IIS. Time-taken depending on time of the day.sql" $a[$i].Split(',')[0]}

