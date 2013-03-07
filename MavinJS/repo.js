/****
 * Repo.js
 * Author: Eran Israeli
 * 
 */

var dataTables = 'http://cdnjs.cloudflare.com/ajax/libs/datatables/1.9.4/jquery.dataTables.min.js';
var backbonejs = 'http://cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.9/backbone-min.js';
var jqueryui = 'http://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js'; 

//var urlsToLoadInOrder = [dataTables,backbonejs,jqueryui];
var urlsToLoadInOrder = [jqueryui];

$.holdReady(true);

//http://docs.jquery.com/Plugins/Authoring
(function( $ ){
	  var methods = {
	   	init : function( options ) {	   		
	   		
			// Load Page Model Object
			$.ajax({				   
			    cache: "false",
			    type: "GET",
			    url: "pom.xml",
			    dataType: "xml",
			    success: function(xml) {			   
			    	clientID = $(xml).find("artifactId").text();
			    	//alert(clientID);
			    }			   
			});

			
			jQuery.ajaxSetup({
				  beforeSend: function() {
					  //alert('Fetching dependencies...');					  
				  },
				  complete: function(){
					  $('body').append('Done.');
				  },
				  success: function() {}
			});
	   		

			
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

    /* api.jquery.com/jQuery.ajax */
    $.ajax({
       async: false,    	
       dataType: "script",
       url: attemptedFile,
       //Enable caching for performance, disable with 'cache: false'
       cache: false, 

       /* Can be used for HTTP access authentication
       username: admin,
       password: password,
       */
       
       complete: function(jqXHR, textStatus) {
    	    switch (jqXHR.status) {
    	        case 200:
    	        	$('body').append('<font color="green"> Successfuly loaded <b>' + attemptedFile + '</b></font><br>');
    	            urlArrayPointer++;
    	            ProcessDependency(urlArrayPointer);                          	        	
    	            break;
    	        case 404:
    	        	$('body').append('<font color="red"> Failed to load <b>' + attemptedFile + '</b></font><br>');
    	            break;
    	        default:
    	            alert("?");
    	    }
    	},      
    });
}