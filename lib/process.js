var cliTable = require("cli-table");



function processContent(content, parentIndex, parentArray)
{
	if (typeof content == "function")
	{
		content = content();
		
		// Merge contents into parent array
		if (parentArray && parentArray.length)
		{
			content.forEach( function(nestedContent, i)
			{
				// First index is returned to caller
				if (i)
				{
					parentArray.splice(parentIndex+i, 0, nestedContent);
				}
			});
			
			content = content[0];
		}
	}
	else if (content instanceof Array)
	{
		for (var i=0; i<content.length; i++)
		{
			content[i] = processContent( content[i], i, content );
		}
	}
	else if ( content instanceof Object && !(content instanceof Array) )
	{
		for (var i in content)
		{
			content[i] = processContent( content[i] );
		}
	}
	
	return content;
}



function processData(data, options)
{
	if (data.table != undefined || data.text != undefined)
	{
		var output = "";
		
		if (data.table)
		{
			var table = new cliTable( options.table );
			
			// Run any nested functions
			data.table = processContent(data.table);
			
			// Move rows from within obligatory array container into table instance
			data.table.forEach( function(row)
			{
				table.push(row);
			});
			
			output = table.toString();
		}
		else
		{
			output = processContent(data.text).toString();
		}
		
		if (output.length)
		{
			if (options.newLineBefore) output  = "\n"+output;
			if (options.newLineAfter)  output += "\n";
		}
		
		return output;
	}
}



module.exports = processData;
