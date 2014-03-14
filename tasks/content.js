var cliClear = require("cli-clear");
var process  = require("../lib/process");



module.exports = function(grunt)
{
	require("grunt-log-headers")(grunt);
	
	
	
	// Avoid issues with multiple grunt.loadNpmTasks() calls
	if ( grunt.config("content.options.gruntLogHeader") === undefined)
	{
		// Default value -- this one must be defined here before task is run
		grunt.config("content.options.gruntLogHeader", false);
	}
	
	
	
	function content(data, options)
	{
		var output = process(data, options);
		
		if (output.length)
		{
			grunt.log.writeln(output);
		}
	}
	
	
	
	grunt.registerMultiTask("content", "Display beautiful, informative content in a Grunt task.", function()
	{
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
				content(this.data, options);
				done();
			}.bind(this) );
		}
		else
		{
			content(this.data, options);
		}
	});
}
