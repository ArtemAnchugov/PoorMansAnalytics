Poor man's analytics
=================

The tool consists of two pieces:
* frontend - an html page responsible for displaying the data,
* backend - a powershell script that gathers the data.
  
## Frontend
Is a simple html page with a stylesheet and a little bit of javascript.

It uses [dygraphs](http://dygraphs.com/) for plotting the data and some of [jQuery](http://jquery.com/) goodness.

Frontend has to be deployed to a web server.

./data folder contains *.csv files, with data to be displayed.
The data normally would be updated by backend.


## Backend
./GatherStatistics.ps1 is a script that is, when executed, gathers data from the server. Normally the script would be run by some scheduling tool (e.g nightly).

Under the hood ./GatherStatistics.ps1 uses [LogParser](http://www.microsoft.com/en-us/download/details.aspx?id=24659) - a nice command-line tool from Microsoft that "provides universal query access to text-based data such as log files". So, LogParser has to be installed before running the script.

LogParser takes an *.sql file as a parameter. This SQL describes what data to gather and where from.

The data is gathered to ./data folder of frontend.
