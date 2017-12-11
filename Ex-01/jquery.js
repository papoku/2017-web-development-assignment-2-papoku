
// Function to hide and show client information div
$(document).ready(function(){
    $("#btn_hide").click(function(){
        $("#centre_div").slideToggle("slow");
        if($(this).text().trim() == 'Hide') {
        $(this).html('Show');
            }
        else {
            $(this).html('Hide');
            }
    });
});


// Slice barcode and show information
$(document).ready(function(){
    $("#dcode").click(function(){
        var value= $("#virtaul-barcode").val().trim();
        
        if(value[0]!= 5){               // check barcode version
            $("#iban").val(value.slice(1, 17));
            $("#amount").val(function(){
                
                var amount = value.slice(17, 25).replace(/^0+/,'');
                if(amount.length ==0)
                    return "0,00";
                else
                    return amount.slice(0,amount.length-2) + "," + amount.slice((amount.length)-2 , amount.length);
                
                });
            $("#ref").val(value.slice(25, 48).replace(/^0+/,''));
            $("#date").val(function(){
                
                var date = value.slice(48, 54).replace(/^0+/,'');
                date = value.slice(0, date.length).replace(/^0+/,'');
                if(date.length==0)
                    return "N/A";
                else
                    return date.slice(0, date.length-4) + "." + date.slice(2 , date.length-2) + "." + date.slice(4, date.length);
                
                });
            $("#cnvas").JsBarcode(value);
            }
        
//code for barcode version 4, can be done in lots of efficient ways, but time matters.
        else {  
            
            $("#iban").val(function(){
                
                var bank = value.slice(1,17);
                if(bank.startsWith("02"))
                {
                    return "Op."+ bank;
                
                }
                else if (bank.startsWith("73"))
                       return "Handelsbanken "+ bank;              
                                     });
            
            $("#amount").val(function(){
                
                var amount = value.slice(17, 25).replace(/^0+/,'');
                if(amount.length ==0)
                    return "0,00";
                else
                    return amount.slice(0,amount.length-2) + "," + amount.slice((amount.length)-2 , amount.length);
                
                });
                
                                     
                                     
            $("#ref").val("RF" + value.slice(25, 48).replace(/^0+/,''));
            
            $("#date").val(function(){
                
                var date = value.slice(48, 54).replace(/^0+/,'');
                if(date.length==0)
                    return "N/A";
                else
                    return date.slice(0, date.length-4) + "." + date.slice(2 , date.length-2) + "." + date.slice(4, date.length);
                
                });
            $("#cnvas").JsBarcode(value);
        }
    });
});