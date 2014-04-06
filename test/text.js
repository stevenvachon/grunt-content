var expect  = require("chai").expect;
var process = require("../");



describe("Text", function()
{
	it("should work with static strings", function(done)
	{
		var output = process( {text:"Test"}, {} );
		
		expect(output).to.equal("Test");
		
		done();
	});
	
	
	
	it("should work with static non-strings", function(done)
	{
		var output1 = process( {text:[]       }, {} );
		var output2 = process( {text:{}       }, {} );
		var output3 = process( {text:0        }, {} );
		var output4 = process( {text:1        }, {} );
		var output5 = process( {text:false    }, {} );
		var output6 = process( {text:true     }, {} );
		var output7 = process( {text:undefined}, {} );
		
		expect(output1).to.equal("");
		expect(output2).to.equal("[object Object]");
		expect(output3).to.equal("0");
		expect(output4).to.equal("1");
		expect(output5).to.equal("false");
		expect(output6).to.equal("true");
		expect(output7).to.equal("");
		
		done();
	});
	
	
	
	it("should work with dynamic data (function) returning a string", function(done)
	{
		var output = process( {text:function(){return "Test"}}, {} );
		
		expect(output).to.equal("Test");
		
		done();
	});
	
	
	
	it("should work with dynamic data (function) returning a non-string", function(done)
	{
		var output1 = process( {text:function(){return []       }}, {} );
		var output2 = process( {text:function(){return {}       }}, {} );
		var output3 = process( {text:function(){return 0        }}, {} );
		var output4 = process( {text:function(){return 1        }}, {} );
		var output5 = process( {text:function(){return false    }}, {} );
		var output6 = process( {text:function(){return true     }}, {} );
		var output7 = process( {text:function(){return undefined}}, {} );
		
		expect(output1).to.equal("");
		expect(output2).to.equal("[object Object]");
		expect(output3).to.equal("0");
		expect(output4).to.equal("1");
		expect(output5).to.equal("false");
		expect(output6).to.equal("true");
		expect(output7).to.equal("");
		
		done();
	});
});
