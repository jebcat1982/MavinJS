/****
 * MavinJS
 * Author: Eran Israeli
 * GPL License
 */
 

 // http://docs.jquery.com/Plugins/Authoring
 
var dataTables = 'http://cdnjs.cloudflare.com/ajax/libs/datatables/1.9.4/jquery.dataTables.min.js';
var backbonejs = 'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.9/backbone-min.js';
var jqueryui = 'http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js'; 

//var urlsToLoadInOrder = [dataTables,backbonejs,jqueryui];
var urlsToLoadInOrder = [jqueryui];

$.holdReady(true);


(function( $ ){
	  var methods = {
	   	init : function( options ) {	   		
		    //Array of fileName to include in loader      	    		   		
	    	ProcessDependency(0);	    		    	
	  	}
	  };



	    $.fn.repo = function( method ) {	        
	        // Method calling logic
	        if ( methods[method] ) {
	        	return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	        } else if ( typeof method === 'object' || ! method ) {
	        	return methods.init.apply( this, arguments );
	        } else {
	        	$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
	        }    	      
	    };	    	    	 
})( jQuery );



function ProcessDependency(urlArrayPointer) 
{

    if (urlArrayPointer >= urlsToLoadInOrder.length) {
    	$.holdReady(false);
    	return;
    }

    var attemptedFile = urlsToLoadInOrder[urlArrayPointer];

    $.ajax({
       dataType: "script",
       url: attemptedFile,
       //Enable caching for performance, disable with 'cache: false'
       cache: false, 
       success: function() {
    	   $('body').append('<font color="green"> Successfuly loaded <b>' + attemptedFile + '</b></font><br>');
    	   
           //  code to execute on script load success
           urlArrayPointer++;
           ProcessDependency(urlArrayPointer);                      
       },
       statusCode: {
    	   404: function() {
    		   alert('here');
    		   $('body').append('<font color="red"> Failed to load <b>' + attemptedFile + '</b></font>');
    	   }
       }
    });
}