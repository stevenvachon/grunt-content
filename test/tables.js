var process = require("../lib/process");
var stripColors = require("colors").stripColors;



var tableOptions =
{
	default:
	{
		colWidths: [12,12]
	},
	vertical:
	{
		colWidths: [14,12]
	},
	cross:
	{
		colWidths: [14,14,14],
		head: ["","table header","table header"]
	}
};



function errored(tableData)
{
	try
	{
		process( {table:tableData}, {table:tableOptions.default} );
	}
	catch (error)
	{
		return true;
	}
	
	return false;
}



describe("Tables", function()
{
	it("should work with static data (array containing array or object)", function(done)
	{
		var expected1 = "";
		expected1 += "┌────────────┬────────────┐\n";
		expected1 += "│ table cell │ table cell │\n";
		expected1 += "├────────────┼────────────┤\n";
		expected1 += "│ table cell │ table cell │\n";
		expected1 += "└────────────┴────────────┘";
		
		var expected2 = "";
		expected2 += "┌──────────────┬────────────┐\n";
		expected2 += "│ table header │ table cell │\n";
		expected2 += "├──────────────┼────────────┤\n";
		expected2 += "│ table header │ table cell │\n";
		expected2 += "└──────────────┴────────────┘";
		
		var expected3 = "";
		expected3 += "┌──────────────┬──────────────┬──────────────┐\n";
		expected3 += "│              │ table header │ table header │\n";
		expected3 += "├──────────────┼──────────────┼──────────────┤\n";
		expected3 += "│ table header │ table cell   │ table cell   │\n";
		expected3 += "├──────────────┼──────────────┼──────────────┤\n";
		expected3 += "│ table header │ table cell   │ table cell   │\n";
		expected3 += "└──────────────┴──────────────┴──────────────┘";
		
		var tableData1 =
		[
			[ ["table cell"],["table cell"] ],
			[ ["table cell"],["table cell"] ]
		];
		
		var tableData2 =
		[
			{ "table header": "table cell" },
			{ "table header": "table cell" }
		];
		
		var tableData3 =
		[
			{ "table header": ["table cell","table cell"] },
			{ "table header": ["table cell","table cell"] }
		];
		
		var output1 = process( {table:tableData1}, {table:tableOptions.default}  );
		var output2 = process( {table:tableData2}, {table:tableOptions.vertical} );
		var output3 = process( {table:tableData3}, {table:tableOptions.cross}    );
		
		expect( stripColors(output1) ).to.equal(expected1);
		expect( stripColors(output2) ).to.equal(expected2);
		expect( stripColors(output3) ).to.equal(expected3);
		
		done();
	});
	
	
	
	it("should fail with static data (non-array)", function(done)
	{
		expect( errored({}    ) ).to.be.true;
		expect( errored(0     ) ).to.be.true;
		expect( errored(1     ) ).to.be.true;
		expect( errored(false ) ).to.be.true;
		expect( errored(true  ) ).to.be.true;
		expect( errored("text") ).to.be.true;
		
		done();
	});
	
	
	
	it("should work with dynamic data (function) returning an array", function(done)
	{
		var expected = "";
		expected += "┌────────────┬────────────┐\n";
		expected += "│ table cell │ table cell │\n";
		expected += "├────────────┼────────────┤\n";
		expected += "│ table cell │ table cell │\n";
		expected += "├────────────┼────────────┤\n";
		expected += "│ table cell │ table cell │\n";
		expected += "└────────────┴────────────┘";
		
		var tableData = function()
		{
			var rows = [];
			
			for (var i=0; i<3; i++)
			{
				rows.push([ ["table cell"],["table cell"] ]);
			}
			
			return rows;
		};
		
		var output = process( {table:tableData}, {table:tableOptions.default} );
		
		expect( stripColors(output) ).to.equal(expected);
		
		done();
	});
	
	
	
	it("should fail with dynamic data (function) returning a non-array", function(done)
	{
		expect( errored(function(){return {}    }) ).to.be.true;
		expect( errored(function(){return 0     }) ).to.be.true;
		expect( errored(function(){return 1     }) ).to.be.true;
		expect( errored(function(){return false }) ).to.be.true;
		expect( errored(function(){return true  }) ).to.be.true;
		expect( errored(function(){return "text"}) ).to.be.true;
		
		done();
	});
	
	
	
	it("should work with dynamic row data (functions)", function(done)
	{
		var expected = "";
		expected += "┌────────────┬────────────┐\n";
		expected += "│ table cell │ table cell │\n";
		expected += "├────────────┼────────────┤\n";
		expected += "│ table cell │ table cell │\n";
		expected += "├────────────┼────────────┤\n";
		expected += "│ table cell │ table cell │\n";
		expected += "├────────────┼────────────┤\n";
		expected += "│ table cell │ table cell │\n";
		expected += "└────────────┴────────────┘";
		
		var tableData =
		[
			[ ["table cell"],["table cell"] ],
			
			function()
			{
				var newRows = [];
				for (var i=0; i<2; i++)
				{
					newRows.push([ ["table cell"],["table cell"] ]);
				}
				return newRows;
			},
			
			[ ["table cell"],["table cell"] ]
		];
		
		var output = process( {table:tableData}, {table:tableOptions.default} );
		
		expect( stripColors(output) ).to.equal(expected);
		
		done();
	});
	
	
	
	it("should work with dynamic row data (functions) in \"cross tables\"", function(done)
	{
		var expected = "";
		expected += "┌──────────────┬──────────────┬──────────────┐\n";
		expected += "│              │ table header │ table header │\n";
		expected += "├──────────────┼──────────────┼──────────────┤\n";
		expected += "│ table header │ table cell   │ table cell   │\n";
		expected += "├──────────────┼──────────────┼──────────────┤\n";
		expected += "│ table header │ table cell   │ table cell   │\n";
		expected += "├──────────────┼──────────────┼──────────────┤\n";
		expected += "│ table header │ table cell   │ table cell   │\n";
		expected += "├──────────────┼──────────────┼──────────────┤\n";
		expected += "│ table header │ table cell   │ table cell   │\n";
		expected += "└──────────────┴──────────────┴──────────────┘";
		
		var tableData =
		[
			{ "table header": ["table cell","table cell"] },
			
			function()
			{
				var newRows = [];
				for (var i=0; i<2; i++)
				{
					newRows.push({ "table header": ["table cell","table cell"] });
				}
				return newRows;
			},
			
			{ "table header": ["table cell","table cell"] }
		];
		
		var output = process( {table:tableData}, {table:tableOptions.cross} );
		
		expect( stripColors(output) ).to.equal(expected);
		
		done();
	});
	
	
	
	it("should work with dynamic cell data (functions)", function(done)
	{
		var expected = "";
		expected += "┌────────────┬────────────┐\n";
		expected += "│ table cell │ table cell │\n";
		expected += "├────────────┼────────────┤\n";
		expected += "│ table cell │ table cell │\n";
		expected += "├────────────┼────────────┤\n";
		expected += "│ table cell │ table cell │\n";
		expected += "└────────────┴────────────┘";
		
		var tableData =
		[
			[ ["table cell"],["table cell"] ],
			
			[ function()
			{
				var newCells = [];
				for (var i=0; i<2; i++)
				{
					newCells.push( ["table cell"] );
				}
				return newCells;
			} ],
			
			[ ["table cell"],["table cell"] ]
		];
		
		var output = process( {table:tableData}, {table:tableOptions.default} );
		
		expect( stripColors(output) ).to.equal(expected);
		
		done();
	});
	
	
	
	it("should work with dynamic cell data (functions) in \"cross tables\"", function(done)
	{
		var expected = "";
		expected += "┌──────────────┬──────────────┬──────────────┐\n";
		expected += "│              │ table header │ table header │\n";
		expected += "├──────────────┼──────────────┼──────────────┤\n";
		expected += "│ table header │ table cell   │ table cell   │\n";
		expected += "├──────────────┼──────────────┼──────────────┤\n";
		expected += "│ table header │ table cell   │ table cell   │\n";
		expected += "└──────────────┴──────────────┴──────────────┘";
		
		var tableData =
		[
			{ "table header": ["table cell","table cell"] },
			{
				"table header": function()
				{
					var newCells = [];
					for (var i=0; i<2; i++)
					{
						newCells.push("table cell");
					}
					return newCells;
				}
			}
		];
		
		var output = process( {table:tableData}, {table:tableOptions.cross} );
		
		expect( stripColors(output) ).to.equal(expected);
		
		done();
	});
});
