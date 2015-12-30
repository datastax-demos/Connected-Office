$(document).ready(function() {

    //insert UUID value

    function newUUID() {
        $.ajax({
            type:'get',
            url:"/api/uuid",
            success:function(resp){
                $("#user_uuid").val(resp);
            },
            fail:function(resp){
                alert('Failed to get UUID');
            }
        });
    }
    newUUID();

    $('#login_form').bootstrapValidator()
        .on('success.form.bv', function(e) {
            // Prevent form submission
            e.preventDefault();

            // Get the form instance
            var $form = $(e.target);

            // Get the BootstrapValidator instance
            var bv = $form.data('bootstrapValidator');

            // Use Ajax to submit form data
            $.ajax({
                type:'post',
                url:"/api/userinfo",
                data:$("input[name='user_id'], input[name='user_name'], input[name='user_phone'], input[name='datastax_employee']").serialize(),
                success:function(resp){

                    $.ajax({
                        type:'post',
                        url:"/api/whitelist",
                        data:$("input[name='user_id'], input[name='device_id'], input[name='device_name'], input[name='user_name']").serialize(),
                        success:function(resp){

                            $('#login_form').trigger("reset");
                            newUUID();
                            $("#flash_message").text('Thank you for registering!');

                        },
                        fail:function(resp){
                            alert('Failed to add to whitelist');
                        }
                    });

                },
                fail:function(resp){
                    alert('Failed to insert user');
                }
            });

        });


    $( "#device_id" ).autocomplete({
        source: "/api/live_mac_search",
        minLength: 1,
        select: function( event, ui ) {
            $('#login_form').bootstrapValidator('revalidateField', "device_id");
        }
    });

});



