var cliClear = require("cli-clear");
var cliTable = require("cli-table");



module.exports = function(grunt)
{
	require("grunt-log-headers")(grunt);
	
	
	
	// Avoid issues with multiple grunt.loadNpmTasks() calls
	if ( grunt.config("content.options.gruntLogHeader") === undefined)
	{
		// Default value -- this one must be defined here before task is run
		grunt.config("content.options.gruntLogHeader", false);
	}
	
	
	
	function processContent(content)
	{
		if (typeof content == "function")
		{
			content = content.apply(grunt);
		}
		else if (content instanceof Array)
		{
			content.forEach( function(nestedContent, i)
			{
				content[i] = processContent(nestedContent);
			});
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
	
	
	
	grunt.registerMultiTask("content", "Display beautiful, informative content in a Grunt task.", function()
	{
		function content()
		{
			if (this.data.table || this.data.text)
			{
				var output = "";
				
				if (this.data.table)
				{
					if (this.data.table instanceof Array)
					{
						var table = new cliTable( options.table );
						
						this.data.table.forEach( function(row)
						{
							table.push( processContent(row) );
						});
						
						output = table.toString();
					}
				}
				else
				{
					output = processContent(this.data.text);
				}
				
				if (output.length)
				{
					if (options.newLineBefore)
					{
						output = "\n"+output;
					}
					
					if (options.newLineAfter)
					{
						output += "\n";
					}
				}
				
				grunt.log.writeln(output);
			}
		}
		
		
		// Target options
		var options = this.options();
		
		var clearBefore    = (options.clearBefore    !== undefined ? options.clearBefore    : false);
		var gruntLogHeader = (options.gruntLogHeader !== undefined ? options.gruntLogHeader : false);
		var newLineAfter   = (options.newLineAfter   !== undefined ? options.newLineAfter   : !gruntLogHeader);
		var newLineBefore  = (options.newLineBefore  !== undefined ? options.newLineBefore  : !gruntLogHeader && !clearBefore);
		
		options = this.options(
		{
			clearBefore:    clearBefore,
			gruntLogHeader: gruntLogHeader,
			newLineAfter:   newLineAfter,
			newLineBefore:  newLineBefore
		});
		
		
		grunt.verbose.writeflags(options, "Options");
		
		
		if (options.clearBefore)
		{
			var done = this.async();
			
			cliClear( function()
			{
				content.call(this);
				done();
			}.bind(this) );
		}
		else
		{
			content.call(this);
		}
	});
}
