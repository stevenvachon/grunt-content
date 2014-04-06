var cliTable = require("cli-table");



function processContent(content, parentIndex, parentArray)
{
	if (typeof content == "function")
	{
		content = content();
		
		// Merge contents into parent array
		if (parentArray && parentArray.length)
		{
			if (content instanceof Array)
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
	}
	else if (content instanceof Array)
	{
		var i = 0;
		
		while (i < content.length)
		{
			var newContent = processContent( content[i], i, content );
			
			if (newContent != undefined)
			{
				content[i] = newContent;
				i++;
			}
			else
			{
				// Remove invalid row/cell
				content.splice(i, 1);
			}
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
	var output = "";
	
	if (data.table instanceof Array || typeof data.table == "function")
	{
		// Run any nested functions
		data.table = processContent(data.table);
		
		if (data.table instanceof Array)
		{
			var table = new cliTable( options.table );
			
			// Move rows from within obligatory array container into table instance
			data.table.forEach( function(row)
			{
				table.push(row);
			});
			
			output = table.toString();
		}
	}
	else if (data.text != undefined)
	{
		data.text = processContent(data.text);
		
		if (data.text != undefined)
		{
			output = data.text.toString();
		}
	}
	
	if (output.length)
	{
		if (options.newLineBefore) output  = "\n"+output;
		if (options.newLineAfter)  output += "\n";
	}
	
	return output;
}



module.exports = processData;
