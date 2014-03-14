var process = require("../lib/process");
var stripColors = require("colors").stripColors;



function defaultTable(tableData)
{
	return process( {table:tableData},
	{
		table:
		{
			colWidths: [12,12]
		}
	});
}

function verticalTable(tableData)
{
	return process( {table:tableData},
	{
		table:
		{
			colWidths: [14,12]
		}
	});
}

function crossTable(tableData)
{
	return process( {table:tableData},
	{
		table:
		{
			colWidths: [14,14,14],
			head: ["","table header","table header"]
		}
	});
}



/*function errored(tableData)
{
	try
	{
		defaultTable(tableData);
	}
	catch (error)
	{
		return true;
	}
	
	return false;
}*/



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
		
		var output1 = defaultTable(
		[
			[ ["table cell"],["table cell"] ],
			[ ["table cell"],["table cell"] ]
		]);
		
		var output2 = verticalTable(
		[
			{ "table header": "table cell" },
			{ "table header": "table cell" }
		]);
		
		var output3 = crossTable(
		[
			{ "table header": ["table cell","table cell"] },
			{ "table header": ["table cell","table cell"] }
		]);
		
		expect( stripColors(output1) ).to.equal(expected1);
		expect( stripColors(output2) ).to.equal(expected2);
		expect( stripColors(output3) ).to.equal(expected3);
		
		done();
	});
	
	
	
	it("should skip with static data (non-array)", function(done)
	{
		expect( defaultTable({}       ) ).to.equal("");
		expect( defaultTable(0        ) ).to.equal("");
		expect( defaultTable(1        ) ).to.equal("");
		expect( defaultTable(false    ) ).to.equal("");
		expect( defaultTable(true     ) ).to.equal("");
		expect( defaultTable("text"   ) ).to.equal("");
		expect( defaultTable(undefined) ).to.equal("");
		
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
		
		var output = defaultTable( function()
		{
			var rows = [];
			
			for (var i=0; i<3; i++)
			{
				rows.push([ ["table cell"],["table cell"] ]);
			}
			
			return rows;
		});
		
		expect( stripColors(output) ).to.equal(expected);
		
		done();
	});
	
	
	
	it("should skip with dynamic data (function) returning a non-array", function(done)
	{
		expect( defaultTable(function(){return {}       }) ).to.equal("");
		expect( defaultTable(function(){return 0        }) ).to.equal("");
		expect( defaultTable(function(){return 1        }) ).to.equal("");
		expect( defaultTable(function(){return false    }) ).to.equal("");
		expect( defaultTable(function(){return true     }) ).to.equal("");
		expect( defaultTable(function(){return "text"   }) ).to.equal("");
		expect( defaultTable(function(){return undefined}) ).to.equal("");
		
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
		
		var output = defaultTable(
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
		]);
		
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
		
		var output = crossTable(
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
		]);
		
		expect( stripColors(output) ).to.equal(expected);
		
		done();
	});
	
	
	
	it("should skip with dynamic row data (functions) returning incompatible formats", function(done)
	{
		var expected = "";
		expected += "┌────────────┬────────────┐\n";
		expected += "│ table cell │ table cell │\n";
		expected += "├────────────┼────────────┤\n";
		expected += "│ table cell │ table cell │\n";
		expected += "└────────────┴────────────┘";
		
		var output = defaultTable(
		[
			[ ["table cell"],["table cell"] ],
			
			function(){return []},
			//function(){return {}},	// these cause an error in cli-table
			/*function(){return 0},
			function(){return 1},
			function(){return false},
			function(){return true},
			function(){return "text"},*/
			function(){return undefined},
			
			[ ["table cell"],["table cell"] ]
		]);
		
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
		
		var output = defaultTable(
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
		]);
		
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
		
		var output = crossTable(
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
		]);
		
		expect( stripColors(output) ).to.equal(expected);
		
		done();
	});
	
	
	
	it("should skip with dynamic cell data (functions) returning incompatible formats", function(done)
	{
		var expected = "";
		expected += "┌────────────┬────────────┐\n";
		expected += "│ table cell │ table cell │\n";
		expected += "├────────────┼────────────┤\n";
		expected += "├────────────┼────────────┤\n";
		expected += "├────────────┼────────────┤\n";
		expected += "│ [object O… │\n"             ;
		expected += "├────────────┼────────────┤\n";
		expected += "│ 0          │ 1          │\n";
		expected += "├────────────┼────────────┤\n";
		expected += "│ false      │ true       │\n";
		expected += "├────────────┼────────────┤\n";
		expected += "│ text       │\n"             ;
		expected += "├────────────┼────────────┤\n";
		expected += "├────────────┼────────────┤\n";
		expected += "├────────────┼────────────┤\n";
		expected += "│ table cell │ table cell │\n";
		expected += "└────────────┴────────────┘";
		
		var output = defaultTable(
		[
			[ ["table cell"],               ["table cell"]                ],
			
			[ function(){return []}                                       ],
			[ function(){return []},        function(){return []}         ],
			[ function(){return {}}                                       ],
			[ function(){return 0},         function(){return 1}          ],
			[ function(){return false},     function(){return true}       ],
			[ function(){return "text"}                                   ],
			[ function(){return undefined}                                ],
			[ function(){return undefined}, function(){return undefined}  ],
			
			[ ["table cell"],               ["table cell"]                ]
		]);
		
		expect( stripColors(output) ).to.equal(expected);
		
		done();
	});
});
