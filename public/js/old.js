function selectRefresh() {
    $(".js-example-basic-single").select2();
  }
  $(document).ready(function () {
    selectRefresh();


    var list =  Intl.supportedValuesOf('timeZone')
    var timezone = $('#settings_timezone').attr('data-id')
    
    $.each(list, function(index, value){
      $('#settings_timezone').append(' <option value="'+value+'" >'+value+'</option>')
    })
    
    $('select[name=site_timezone]').val(timezone)

    // =========== lang ================ //

      if ($("#hidden_lang").val() == 'in') {
        $("#in").addClass("bg-primary")
      } else if ($("#hidden_lang").val() == 'de') {
        $("#de").addClass("bg-primary")
      } else if ($("#hidden_lang").val() == 'en') {
        $("#en").addClass("bg-primary")
      } else if ($("#hidden_lang").val() == 'pt') {
        $("#pt").addClass("bg-primary")
      } else if ($("#hidden_lang").val() == 'es') {
        $("#es").addClass("bg-primary")
      } else if ($("#hidden_lang").val() == 'fr') {
        $("#fr").addClass("bg-primary")
      } else if ($("#hidden_lang").val() == 'cn') {
        $("#cn").addClass("bg-primary")
      } else if ($("#hidden_lang").val() == 'ae') {
        $("#ae").addClass("bg-primary")
        $("html").attr("dir", "rtl")
      }

      $(document).on("click", ".lang", function () {
        var lang = $(this).attr("data-value")
        var base_url = window.location.origin;
      
        $.ajax({
          url: base_url + "/lang/" + lang,
          type: "GET",
          dataType: "JSON",
          success: function (res) {
            location.reload();
          }
        })
      })


      // =========== sing in ================ //

      $(document).on("select2:select", "#singup_country",  function () {
          var value = $("#singup_country").select2('val')
    
          var base_url = window.location.origin;
    
          $.ajax({
              url: base_url + "/country/ajax/" + value,
              type: "GET",
              dataType: "JSON",
              success: function (res) {
                $("#singup_state").html('<option value selected disabled>Select State</option>')
    
                $.each(res.state_data, function (index, value) {
    
                  $("#singup_state").append('<option value="' + value.id + '"> ' + value.state_name + ' </option>')
                })
              } 
          })
    
      })
    
      $(document).on("select2:select", "#singup_state",  function () {
        var value = $("#singup_state").select2('val')
        
        var base_url = window.location.origin;
        
        $.ajax({
            url: base_url + "/state/ajax/" + value,
            type: "GET",
            dataType: "JSON",
            success: function (res) {
              $("#singup_city").html('<option value selected disabled>Select State</option>')
              
              $.each(res.city_data, function (index, value) {
                  
                $("#singup_city").append('<option value="' + value.id + '"> ' + value.city_name + ' </option>')
              })
            }
        })
    
      })


      // =========== customers ================ //

      // -------- add customer -------- //

      $(document).on("click", "#btn_address", function () {
        $("#add_address").append(
            '<div class="row g-3 client_add">'+

              '<h5>'+ $("#json_Address").text() +'</h5>'+ 
              
              '<div class="col-4">'+
                  '<div class="col-form-label">'+ $("#json_Country").text() +'</div>'+
                  '<select class="js-example-basic-single customers_country" name="country" id="" required>'+
                      '<option value selected disabled>Search Country</option>'+
                      
                  '</select>'+
              '</div>'+

              '<div class="col-4">'+
                  '<div class="col-form-label">'+ $("#json_State").text() +'</div>'+
                  '<select class="js-example-basic-single customers_state" name="state" id="" required>'+
                      '<option value selected disabled>Search State</option>'+
                      
                  '</select>'+
              '</div>'+

              '<div class="col-4">'+
                  '<div class="col-form-label">'+ $("#json_City").text() +'</div>'+
                  '<select class="js-example-basic-single customers_city" name="city" id="" required>'+
                      '<option value selected disabled>Search City</option>'+
                      
                  '</select>'+
              '</div>'+

              '<div class="col-4">'+
                  '<label class="form-label">'+ $("#json_Zip_Code").text() +'</label>'+
                  '<input class="form-control" type="number" name="zipcode" placeholder="Enter Zip Code">'+
              '</div>'+

              '<div class="col-4">'+
                  '<label class="form-label">'+ $("#json_Address").text() +'</label>'+
                  '<input class="form-control" type="text" name="address" placeholder="Enter Address">'+
              '</div>'+

              '<div class="col-4 pt-4">'+
                  '<button class="btn btn-square btn-danger btn-air-danger mt-1" id="client_address_delete" type="button">Delete Address</button>'+
              '</div>'+

              '<hr class="my-4"></hr>'+

              '</div>'
        );
        selectRefresh();
          
        var base_url = window.location.origin;
        
        $.ajax({
            url: base_url + "/users/customers/ajax",
            type: "GET",
            dataType: "JSON",
            success: function (res) {
            
              $.each(res.countries_data, function (index, value) {
                  
                $(".customers_country").append('<option value="' + value.id + '"> ' + value.countries_name + ' </option>')
              })
            }
        })

      })

      $(document).on("select2:select", ".customers_country",  function () {
        var currentRow=$(this).closest(".client_add");
        var value = currentRow.find(".customers_country").select2('val')
        
        var base_url = window.location.origin;
        
        $.ajax({
            url: base_url + "/settings/city/ajax/" + value,
            type: "GET",
            dataType: "JSON",
            success: function (res) {
              currentRow.find(".customers_state").html('<option value selected disabled>Select State</option>')
              
              $.each(res.state_data, function (index, value) {
                  
                currentRow.find(".customers_state").append('<option value="' + value.id + '"> ' + value.state_name + ' </option>')
              })
            }
        })

      })

      $(document).on("select2:select", ".customers_state",  function () {
        var currentRow=$(this).closest(".client_add");
        var value = currentRow.find(".customers_state").select2('val')
        
        var base_url = window.location.origin;
        
        $.ajax({
            url: base_url + "/settings/add_rates/ajax/" + value,
            type: "GET",
            dataType: "JSON",
            success: function (res) {
              currentRow.find(".customers_city").html('<option value selected disabled>Select State</option>')
              
              $.each(res.city_data, function (index, value) {
                  
                currentRow.find(".customers_city").append('<option value="' + value.id + '"> ' + value.city_name + ' </option>')
              })
            }
        })

      })
      
      $('body').on("click", "#client_address_delete", function () {
        
        $(this).parents('.client_add').remove();
      })



      // =========  countries  ============ //

      $(document).on("click", "#countries_modal", function () {
        let dataid = $(this).attr("data-id");
        let dataname = $(this).attr("data-name");
        let dataiso = $(this).attr("data-iso");


        $("#countries_modal_from").attr('action', '/settings/countries/' + dataid);
        $('#countries_modal_name').attr('value', dataname);
        $('#countries_modal_iso').attr('value', dataiso);
      });



      // ========== packaging =========== //

      $(document).on("click", "#edit_packaging", function () {
        let dataid = $(this).attr("data-id");
        let datatype = $(this).attr("data-type");
        let datadetails = $(this).attr("data-details");


        $("#edit_type_from").attr('action', '/settings/packaging/' + dataid);
        $('#packaging_type').attr('value', datatype);
        $('#packaging_details').attr('value', datadetails);
      });



      // ========== shipping_modes =========== //

      $(document).on("click", "#edit_shipping_modes", function () {
        let dataid = $(this).attr("data-id");
        let datamodes = $(this).attr("data-modes");
        let datadetails = $(this).attr("data-details");


        $("#shipping_id").attr('action', '/settings/shipping_modes/' + dataid);
        $('#shipping_modes').attr('value', datamodes);
        $('#shipping_modes_details').attr('value', datadetails);
      });


      // ========== shipping_times =========== //

      $(document).on("click", "#edit_shipping_times", function () {
        let dataid = $(this).attr("data-id");
        let datatimes = $(this).attr("data-times");
        let datadetails = $(this).attr("data-details");


        $("#shipping_id").attr('action', '/settings/shipping_times/' + dataid);
        $('#shipping_times').attr('value', datatimes);
        $('#shipping_details').attr('value', datadetails);
      });



      // ========== shipping_status =========== //

      $(document).on("click", "#edit_shipping_status", function () {
        let dataid = $(this).attr("data-id");
        let dataname = $(this).attr("data-name");
        let datadetails = $(this).attr("data-details");


        $("#status_id").attr('action', '/settings/shipping_status/' + dataid);
        $('#status_names').attr('value', dataname);
        $('#status_detailss').attr('value', datadetails);
      });


      
      // ========== logistics_service =========== //

      $(document).on("click", "#edit_logistics_service", function () {
        let dataid = $(this).attr("data-id");
        let dataname = $(this).attr("data-name");
        let datadetails = $(this).attr("data-details");


        $("#service_id").attr('action', '/settings/logistics_service/' + dataid);
        $('#service_name').attr('value', dataname);
        $('#service_details').attr('value', datadetails);
      });


      
      // ========== Shipping Prefix =========== //

      $(document).on("click", "#edit_prefix_service", function () {
        let dataid = $(this).attr("data-id");
        let dataprefix = $(this).attr("data-prefix");
        let datatype = $(this).attr("data-type");

        if (datatype == '1') {
          var type = 'Registered packages'
        } else if(datatype == '2') {
          var type = 'Shipments'
        } else if(datatype == '3') {
          var type = 'Pickups'
        } else {
          var type = 'Consolidated'
        }

        $("#service_id").attr('action', '/settings/prefix_service/' + dataid);
        $('#service_name').attr('value', dataprefix);
        $('#service_details').attr('value', type);
      });


      
      // ========== payment_type =========== //

      $(document).on("click", "#edit_payment_type", function () {
        let dataid = $(this).attr("data-id");
        let datatype = $(this).attr("data-type");
        let datadescription = $(this).attr("data-description");


        $("#payment_type_id").attr('action', '/settings/payment_type/' + dataid);
        $('#payment_type').attr('value', datatype);
        $('#description').attr('value', datadescription);
      });



      // ========== payment_methods =========== //

      $(document).on("click", "#edit_payment_modal", function () {
        let dataid = $(this).attr("data-id");
        let datamethods = $(this).attr("data-methods");
        let datadays = $(this).attr("data-days");


        $("#payment_id").attr('action', '/settings/payment_methods/' + dataid);
        $('#payment_methods').attr('value', datamethods);
        $('#payment_days').attr('value', datadays);
      });


      // ========== length_units =========== //

      $(document).on("click", "#length_units_modal", function () {
        let dataid = $(this).attr("data-id");
        let dataname = $(this).attr("data-name");


        $("#length_units_modal_from").attr('action', '/settings/length_units/' + dataid);
        $('#length_units_modal_name').attr('value', dataname);
      });


      // ========== weight_units =========== //

      $(document).on("click", "#weight_units_modal", function () {
        let dataid = $(this).attr("data-id");
        let dataname = $(this).attr("data-name");


        $("#weight_units_modal_from").attr('action', '/settings/weight_units/' + dataid);
        $('#weight_units_modal_name').attr('value', dataname);
      });

      
      // ========== states =========== //

      $(document).on("click", "#states_modal", function () {
        let dataid = $(this).attr("data-id");
        let datacountries = $(this).attr("data-countries");
        let datastate = $(this).attr("data-state");
        

        $("#state_id").attr('action', '/settings/states/' + dataid);
        $('#countries_id').select2().select2('val', datacountries);
        $('#state_name').attr('value', datastate);
      });



      // ========== city =========== //
      
      $(document).on("select2:select", "#countries_id",  function () {
        var value = $("#countries_id").select2('val')
        
        var base_url = window.location.origin;
        
        $.ajax({
            url: base_url + "/settings/city/ajax/" + value,
            type: "GET",
            dataType: "JSON",
            success: function (res) {
              $("#state_id").html('<option value selected disabled>Select State</option>')
              
              $.each(res.state_data, function (index, value) {
                  
                $("#state_id").append('<option value="' + value.id + '"> ' + value.state_name + ' </option>')
              })
            }
        })

      })


      // --------- edit city ---------- //

      $(document).on("click", "#edit_city_modal", function () {
        let dataid = $(this).attr("data-id");
        let datacountries = $(this).attr("data-countries");
        let datastate = $(this).attr("data-state");
        let datacity = $(this).attr("data-city");
        

        $("#city_id").attr('action', '/settings/city/' + dataid);
        $('.city_countryname').select2().select2('val', datacountries);
        //  $('.city_statename').select2().select2('val', datastate);
        $('#city_name').attr('value', datacity);


        var base_url = window.location.origin;
        
        $.ajax({
            url: base_url + "/settings/city/ajax/" + datacountries,
            type: "GET",
            dataType: "JSON",
            success: function (res) {
              $('.city_statename').empty();

              $.each(res.state_data, function (index, value) {
              
                $(".city_statename").append('<option value="'+ value.id +'"> '+ value.state_name +' </option>')
              })

              $('.city_statename').select2().select2('val', datastate);
            }
        })

      });

      $(document).on("select2:select", ".city_countryname",  function () {
        var value = $(".city_countryname").select2('val')
        
        
        var base_url = window.location.origin;
        
        $.ajax({
            url: base_url + "/settings/city/ajax/" + value,
            type: "GET",
            dataType: "JSON",
            success: function (res) {
              $(".city_statename").html('<option value selected disabled>Select State</option>')
              
              $.each(res.state_data, function (index, value) {
                // alert(value.state_name)
                $(".city_statename").append('<option value="' + value.id + '"> ' + value.state_name + ' </option>')
              })
            }
        })

      })


      // ========== general_settings ========== // 

      $(document).on("change", "#site_logo", function () {
        $("#site_logo_hidden").val( parseInt($("#site_logo_hidden").val()) + 1 )
      })


      // ========= rates =========== //


      $(document).on("select2:select", "#rate_origin",  function () {
        var value = $("#rate_origin").select2('val')
        
        var base_url = window.location.origin;
        
        $.ajax({
            url: base_url + "/settings/city/ajax/" + value,
            type: "GET",
            dataType: "JSON",
            success: function (res) {
              $("#origin_state").html('<option value selected disabled>Select State</option>')
              
              $.each(res.state_data, function (index, value) {
                  
                $("#origin_state").append('<option value="' + value.id + '"> ' + value.state_name + ' </option>')
              })
            }
        })

      })

      $(document).on("select2:select", "#origin_state",  function () {
        var value = $("#origin_state").select2('val')
        
        var base_url = window.location.origin;
        
        $.ajax({
            url: base_url + "/settings/add_rates/ajax/" + value,
            type: "GET",
            dataType: "JSON",
            success: function (res) {
              $("#origin_city").html('<option value selected disabled>Select State</option>')
              
              $.each(res.city_data, function (index, value) {
                  
                $("#origin_city").append('<option value="' + value.id + '"> ' + value.city_name + ' </option>')
              })
            }
        })

      })


      $(document).on("select2:select", "#rate_country",  function () {
        var value = $("#rate_country").select2('val')
        
        var base_url = window.location.origin;
        
        $.ajax({
            url: base_url + "/settings/city/ajax/" + value,
            type: "GET",
            dataType: "JSON",
            success: function (res) {
              $("#rate_state").html('<option value selected disabled>Select State</option>')
              
              $.each(res.state_data, function (index, value) {
                $("#rate_state").append('<option value="' + value.id + '"> ' + value.state_name + ' </option>')
              })
            }
        })

      })

      $(document).on("select2:select", "#rate_state",  function () {
        var value = $("#rate_state").select2('val')
        
        var base_url = window.location.origin;
        
        $.ajax({
            url: base_url + "/settings/add_rates/ajax/" + value,
            type: "GET",
            dataType: "JSON",
            success: function (res) {
              $("#rate_city").html('<option value selected disabled>Select State</option>')
              
              $.each(res.city_data, function (index, value) {
                $("#rate_city").append('<option value="' + value.id + '"> ' + value.city_name + ' </option>')
              })
            }
        })

      })


      // ======== pre alert =========== //

      $(document).on("click", "#add_pre_alert_submit", function () {
        if ($("#file-1").val() == "") {
          
          $("#image_error").text("Please Select Image")
        }else {
          $("#image_error").text("")
        }
      })



      // ========== register_packages ========== //

      $(document).on("select2:select", "#register_packages_customer", function () {
        var value = $("#register_packages_customer").select2('val')
        
        var base_url = window.location.origin;
        
        $.ajax({
            url: base_url + "/online_shopping/address/ajax/" + value,
            type: "GET",
            dataType: "JSON",
            success: function (res) {
              $("#customer_address").html('<option value selected disabled>Select State</option>')
              
              $.each(res.country, function (index, value) {

                res.countries_list.forEach((data, i) => {
                  if (data.id == value) {

                    res.state_list.forEach((state_list) => {
                      if (state_list.id == res.state[index]) {

                        res.city_list.forEach((city_list) => {
                          if (city_list.id == res.city[index]) {
                            
                            $("#customer_address").append('<option value="' + res.address[index] + '"> ' + "Country : " + data.countries_name + " | State : " + state_list.state_name + " | City : " + city_list.city_name + " | Zip COde : " + res.zipcode[index] + " | Address : " + res.address[index] +' </option>')
                          }
                        })

                      }
                    })
                    
                  }
                });

              })
            }
        })
      })


      $(document).on("click", "#register_add_box", function () {
        $("#register_add_row").append(
            '<div class="row mb-3 package_information">'+
                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Package_Name").text() +'</label>'+
                  '<input class="form-control form-control-sm" type="text" name="package_name" placeholder="Name">'+
                '</div>'+

                '<div class="col-lg-2 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Package_Description").text() +'</label>'+
                  '<input class="form-control form-control-sm" type="text" name="package_description" placeholder="Description">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Amount").text() +'</label>'+
                  '<input class="form-control form-control-sm" type="number" name="package_amount" placeholder="Amount">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Weight").text() +'</label>'+
                  '<input class="form-control form-control-sm register_packages_weight" type="number" name="weight" value="0" min="0" step="">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Length").text() +'</label>'+
                  '<input class="form-control form-control-sm register_packages_sum" type="number" name="length" id="register_packages_length" value="0" min="0">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Width").text() +'</label>'+
                  '<input class="form-control form-control-sm register_packages_sum" type="number" name="width" id="register_packages_width" value="0" min="0">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Height").text() +'</label>'+
                  '<input class="form-control form-control-sm register_packages_sum" type="number" name="height" id="register_packages_height" value="0" min="0">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Weight_Vol").text() +' <i class="fa fa-info-circle" data-bs-toggle="tooltip" data-bs-placement="top" title="L x W x H / Volume percentage"></i></label>'+
                  '<input class="form-control form-control-sm register_packages_weight_vol" type="number" name="weight_vol" id="register_packages_weight_vol" placeholder="0" readonly>'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Fixed_charge").text() +'</label>'+
                  '<input class="form-control form-control-sm register_packages_f_charge" type="number" name="f_charge" value="0" min="0">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_DecValue").text() +'</label>'+
                  '<input class="form-control form-control-sm register_packages_decvalue" type="number" name="decvalue" value="0" min="0">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-center mt-4">'+
                  '<a type="submit" id="package_information_remove"><i class="icon-trash f-20 font-danger"></i></a>'+
                '</div>'+
            '</div>'
        )
      })

      $(document).on("click", "#package_information_remove", function () {
        
        $(this).parents('.package_information').remove();

        var weight_vol = 0;
        $('.register_packages_weight_vol').each(function(){
          weight_vol += parseFloat($(this).val());
        });
        
        var weight = 0;
        $('.register_packages_weight').each(function(){
          weight += parseFloat($(this).val());
        });
        
        var decvalue = 0;
        $('.register_packages_decvalue').each(function(){
          decvalue += parseFloat($(this).val());
        });
        
        var f_charge = 0;
        $('.register_packages_f_charge').each(function(){
          f_charge += parseFloat($(this).val());
        });

        subtotal = (weight_vol * $("#add_price_kg").val()).toFixed(2)
        
        $("#total_weight").val(weight.toFixed(2))
        $("#total_weight_vol").val(weight_vol.toFixed(2))
        $("#total_decvalue").val(decvalue.toFixed(2))
        $("#subtotal").val(subtotal)
        $("#discount").val(( (subtotal / 100) * $("#add_discount").val() ).toFixed(2))

        if (parseFloat(subtotal) < parseFloat($("#discount").val())) {
          toastr.error('The discount cannot be greater than the subtotal')
          $("#shipment_submit").addClass('disabled')
        }else{
          $("#shipment_submit").removeClass('disabled')
        }

        $("#shipping_insurance").val( (($("#add_value_assured").val() / 100) * $("#add_shipping_insurance").val()).toFixed(2) )
        $("#customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )
        $("#hidden_customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )

        if ($("#tax_count").val() == 1) {
          
          $("#tax").val( ( (subtotal / 100 ) * $("#add_tax").val()).toFixed(2) )
        } else {
          
          $("#tax").val( $("#add_tax").val() )
        }

        $("#declared_value").val( ( ( decvalue / 100) * $("#add_declared_value").val() ).toFixed(2) )
        $("#fixed_charge").val(f_charge)
        $("#reissue").val($("#add_reissue").val())

        $("#total").val( ( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#declared_value").val()) + parseFloat($("#fixed_charge").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2) )
        
      })

      $(document).on("input", ".register_packages_sum", function () {
        var currentRow=$(this).closest(".package_information");
        
        currentRow.find("#register_packages_weight_vol").val( (parseFloat(currentRow.find("#register_packages_length").val()) * parseFloat(currentRow.find("#register_packages_width").val()) * parseFloat(currentRow.find("#register_packages_height").val()) / $("#register_packages_vol_per").val()).toFixed(2) )

        var weight_vol = 0;
        $('.register_packages_weight_vol').each(function(){
          weight_vol += parseFloat($(this).val());
        });
        
        var weight = 0;
        $('.register_packages_weight').each(function(){
          weight += parseFloat($(this).val());
        });
        
        var decvalue = 0;
        $('.register_packages_decvalue').each(function(){
          decvalue += parseFloat($(this).val());
        });
        
        var f_charge = 0;
        $('.register_packages_f_charge').each(function(){
          f_charge += parseFloat($(this).val());
        });

        subtotal = (weight_vol * $("#add_price_kg").val()).toFixed(2)
        
        $("#total_weight").val(weight.toFixed(2))
        $("#total_weight_vol").val(weight_vol.toFixed(2))
        $("#total_decvalue").val(decvalue.toFixed(2))
        $("#subtotal").val(subtotal)
        $("#discount").val(( (subtotal / 100) * $("#add_discount").val() ).toFixed(2))
        
        if (parseFloat(subtotal) < parseFloat($("#discount").val())) {
          toastr.error('The discount cannot be greater than the subtotal')
          $("#shipment_submit").addClass('disabled')
        }else{
          $("#shipment_submit").removeClass('disabled')
        }

        $("#shipping_insurance").val( (($("#add_value_assured").val() / 100) * $("#add_shipping_insurance").val()).toFixed(2) )
        $("#customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )
        $("#hidden_customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )

        if ($("#tax_count").val() == 1) {
          
          $("#tax").val( ( (subtotal / 100 ) * $("#add_tax").val()).toFixed(2) )
        } else {
          
          $("#tax").val( $("#add_tax").val() )
        }

        $("#declared_value").val( ( ( decvalue / 100) * $("#add_declared_value").val() ).toFixed(2) )
        $("#fixed_charge").val(f_charge)
        $("#reissue").val($("#add_reissue").val())

        $("#total").val( ( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#declared_value").val()) + parseFloat($("#fixed_charge").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2) )
        
      })

      $(document).on("input", ".register_packages_weight", function () {
        var currentRow=$(this).closest(".package_information");
        
        currentRow.find("#register_packages_weight_vol").val( (currentRow.find("#register_packages_length").val() * currentRow.find("#register_packages_width").val() * currentRow.find("#register_packages_height").val() / $("#register_packages_vol_per").val()).toFixed(2) )

        var weight_vol = 0;
        $('.register_packages_weight_vol').each(function(){
          weight_vol += parseFloat($(this).val());
        });
        
        var weight = 0;
        $('.register_packages_weight').each(function(){
          weight += parseFloat($(this).val());
        });
        
        var decvalue = 0;
        $('.register_packages_decvalue').each(function(){
          decvalue += parseFloat($(this).val());
        });
        
        var f_charge = 0;
        $('.register_packages_f_charge').each(function(){
          f_charge += parseFloat($(this).val());
        });

        subtotal = (weight_vol * $("#add_price_kg").val()).toFixed(2)

        $("#total_weight").val(weight.toFixed(2))
        $("#total_weight_vol").val(weight_vol.toFixed(2))
        $("#total_decvalue").val(decvalue.toFixed(2))
        $("#subtotal").val(subtotal)
        $("#discount").val(( (subtotal / 100) * $("#add_discount").val() ).toFixed(2))
        
        if (parseFloat(subtotal) < parseFloat($("#discount").val())) {
          toastr.error('The discount cannot be greater than the subtotal')
          $("#shipment_submit").addClass('disabled')
        }else{
          $("#shipment_submit").removeClass('disabled')
        }

        $("#shipping_insurance").val( (($("#add_value_assured").val() / 100) * $("#add_shipping_insurance").val()).toFixed(2) )
        $("#customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )
        $("#hidden_customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )

        if ($("#tax_count").val() == 1) {
          
          $("#tax").val( ( (subtotal / 100 ) * $("#add_tax").val()).toFixed(2) )
        } else {
          
          $("#tax").val( $("#add_tax").val() )
        }

        $("#declared_value").val( ( ( decvalue / 100) * $("#add_declared_value").val() ).toFixed(2) )
        $("#fixed_charge").val(f_charge)
        $("#reissue").val($("#add_reissue").val())

        $("#total").val( ( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#declared_value").val()) + parseFloat($("#fixed_charge").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2) )
        
      })

      $(document).on("input", ".register_packages_f_charge", function () {
        var currentRow=$(this).closest(".package_information");
        
        currentRow.find("#register_packages_weight_vol").val( (currentRow.find("#register_packages_length").val() * currentRow.find("#register_packages_width").val() * currentRow.find("#register_packages_height").val() / $("#register_packages_vol_per").val()).toFixed(2) )

        var weight_vol = 0;
        $('.register_packages_weight_vol').each(function(){
          weight_vol += parseFloat($(this).val());
        });
        
        var weight = 0;
        $('.register_packages_weight').each(function(){
          weight += parseFloat($(this).val());
        });
        
        var decvalue = 0;
        $('.register_packages_decvalue').each(function(){
          decvalue += parseFloat($(this).val());
        });
        
        var f_charge = 0;
        $('.register_packages_f_charge').each(function(){
          f_charge += parseFloat($(this).val());
        });

        subtotal = (weight_vol * $("#add_price_kg").val()).toFixed(2)
        
        $("#total_weight").val(weight.toFixed(2))
        $("#total_weight_vol").val(weight_vol.toFixed(2))
        $("#total_decvalue").val(decvalue.toFixed(2))
        $("#subtotal").val(subtotal)
        $("#discount").val(( (subtotal / 100) * $("#add_discount").val() ).toFixed(2))
        
        if (parseFloat(subtotal) < parseFloat($("#discount").val())) {
          toastr.error('The discount cannot be greater than the subtotal')
          $("#shipment_submit").addClass('disabled')
        }else{
          $("#shipment_submit").removeClass('disabled')
        }

        $("#shipping_insurance").val( (($("#add_value_assured").val() / 100) * $("#add_shipping_insurance").val()).toFixed(2) )
        $("#customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )
        $("#hidden_customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )

        if ($("#tax_count").val() == 1) {
          
          $("#tax").val( ( (subtotal / 100 ) * $("#add_tax").val()).toFixed(2) )
        } else {
          
          $("#tax").val( $("#add_tax").val() )
        }

        $("#declared_value").val( ( ( decvalue / 100) * $("#add_declared_value").val() ).toFixed(2) )
        $("#fixed_charge").val(f_charge)
        $("#reissue").val($("#add_reissue").val())

        $("#total").val( ( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#declared_value").val()) + parseFloat($("#fixed_charge").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2) )
        
      })

      $(document).on("input", ".register_packages_decvalue", function () {
        var currentRow=$(this).closest(".package_information");
        
        currentRow.find("#register_packages_weight_vol").val( (currentRow.find("#register_packages_length").val() * currentRow.find("#register_packages_width").val() * currentRow.find("#register_packages_height").val() / $("#register_packages_vol_per").val()).toFixed(2) )
        
        var weight_vol = 0;
        $('.register_packages_weight_vol').each(function(){
          weight_vol += parseFloat($(this).val());
        });
        
        var weight = 0;
        $('.register_packages_weight').each(function(){
          weight += parseFloat($(this).val());
        });
        
        var decvalue = 0;
        $('.register_packages_decvalue').each(function(){
          decvalue += parseFloat($(this).val());
        });
        
        var f_charge = 0;
        $('.register_packages_f_charge').each(function(){
          f_charge += parseFloat($(this).val());
        });

        subtotal = (weight_vol * $("#add_price_kg").val()).toFixed(2)
        
        $("#total_weight").val(weight.toFixed(2))
        $("#total_weight_vol").val(weight_vol.toFixed(2))
        $("#total_decvalue").val(decvalue.toFixed(2))
        $("#subtotal").val(subtotal)
        $("#discount").val(( (subtotal / 100) * $("#add_discount").val() ).toFixed(2))
        
        if (parseFloat(subtotal) < parseFloat($("#discount").val())) {
          toastr.error('The discount cannot be greater than the subtotal')
          $("#shipment_submit").addClass('disabled')
        }else{
          $("#shipment_submit").removeClass('disabled')
        }

        $("#shipping_insurance").val( (($("#add_value_assured").val() / 100) * $("#add_shipping_insurance").val()).toFixed(2) )
        $("#customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )
        $("#hidden_customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )

        if ($("#tax_count").val() == 1) {
          
          $("#tax").val( ( (subtotal / 100 ) * $("#add_tax").val()).toFixed(2) )
        } else {
          
          $("#tax").val( $("#add_tax").val() )
        }

        $("#declared_value").val( ( ( decvalue / 100) * $("#add_declared_value").val() ).toFixed(2) )
        $("#fixed_charge").val(f_charge)
        $("#reissue").val($("#add_reissue").val())

        $("#total").val( ( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#declared_value").val()) + parseFloat($("#fixed_charge").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2) )
        
      })

      $(document).on("click", "#online_shopping_assign_driver", function () {
          let dataid = $(this).attr("data-id");
          let dataname = $(this).attr("data-name");

          $("#hidden_id").attr('value', dataid);
          $('#assign_driver_toggle').select2().select2('val', dataname);
      })

      $(document).on("click", "#online_shopping_add_payment", function () {
          let dataid = $(this).attr("data-id");
          let datainvoice = $(this).attr("data-invoice");
          let datadue = $(this).attr("data-due");

          $("#payment_action").attr('action', '/online_shopping/payment/' + dataid);
          $('#invoice').attr('value', datainvoice);
          $('#payable_amount').attr('value', datadue);
          $('#paid_amount').attr('value', datadue);
      })


      // ========== edit register_packages ========== //

      $(document).on("click", "#edit_register_add_box", function () {
        
        $("#register_add_row").append(
            '<div class="row mb-3 package_information">'+
                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Package_Name").text() +'</label>'+
                  '<input class="form-control form-control-sm" type="text" name="package_name" placeholder="Name">'+
                '</div>'+

                '<div class="col-lg-2 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Package_Description").text() +'</label>'+
                  '<input class="form-control form-control-sm" type="text" name="package_description" placeholder="Description">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Amount").text() +'</label>'+
                  '<input class="form-control form-control-sm" type="number" name="package_amount" placeholder="Amount">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Weight").text() +'</label>'+
                  '<input class="form-control form-control-sm edit_register_packages_weight" type="number" name="weight" value="0" min="0" step="">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Length").text() +'</label>'+
                  '<input class="form-control form-control-sm edit_register_packages_sum" type="number" name="length" id="register_packages_length" value="0" min="0">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Width").text() +'</label>'+
                  '<input class="form-control form-control-sm edit_register_packages_sum" type="number" name="width" id="register_packages_width" value="0" min="0">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Height").text() +'</label>'+
                  '<input class="form-control form-control-sm edit_register_packages_sum" type="number" name="height" id="register_packages_height" value="0" min="0">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Weight_Vol").text() +' <i class="fa fa-info-circle" data-bs-toggle="tooltip" data-bs-placement="top" title="L x W x H / Volume percentage"></i></label>'+
                  '<input class="form-control form-control-sm edit_register_packages_weight_vol" type="number" name="weight_vol" id="register_packages_weight_vol" placeholder="0" readonly>'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Fixed_charge").text() +'</label>'+
                  '<input class="form-control form-control-sm edit_register_packages_f_charge" type="number" name="f_charge" value="0" min="0">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_DecValue").text() +'</label>'+
                  '<input class="form-control form-control-sm edit_register_packages_decvalue" type="number" name="decvalue" value="0" min="0">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-center mt-4">'+
                  '<a type="submit" id="edit_package_information_remove"><i class="icon-trash f-20 font-danger"></i></a>'+
                '</div>'+
            '</div>'
        )
      })

      $(document).on("input", ".edit_register_packages_sum", function () {
        var string = $("#hidden_loop_val").val()
        var hidden_loop_val = string.split(',')

        var currentRow=$(this).closest(".package_information");
        currentRow.find("#register_packages_weight_vol").val( (currentRow.find("#register_packages_length").val() * currentRow.find("#register_packages_width").val() * currentRow.find("#register_packages_height").val() / $("#edit_register_packages_vol_per").val()).toFixed(2) )
        
        for (let i = 0; i < hidden_loop_val.length; i++) {
          
          $("#edit_register_packages_weight_vol_"+i).val( ((parseFloat($("#edit_register_packages_length_"+i).val()) * parseFloat($("#edit_register_packages_width_"+i).val() * parseFloat($("#edit_register_packages_height_"+i).val()))) / parseFloat($("#edit_register_packages_vol_per").val())).toFixed(2) )
        }


        var weight_vol = 0;
        $('.edit_register_packages_weight_vol').each(function(){
          weight_vol += parseFloat($(this).val());
        });
        
        var weight = 0;
        $('.edit_register_packages_weight').each(function(){
          weight += parseFloat($(this).val());
        });
        
        var decvalue = 0;
        $('.edit_register_packages_decvalue').each(function(){
          decvalue += parseFloat($(this).val());
        });
        
        var f_charge = 0;
        $('.edit_register_packages_f_charge').each(function(){
          f_charge += parseFloat($(this).val());
        });
        
        subtotal = (weight_vol * $("#add_price_kg").val()).toFixed(2)
        
        $("#total_weight").val(weight.toFixed(2))
        $("#total_weight_vol").val(weight_vol.toFixed(2))
        $("#total_decvalue").val(decvalue.toFixed(2))
        $("#subtotal").val(subtotal)
        $("#discount").val(( (subtotal / 100) * $("#add_discount").val() ).toFixed(2))

        

        $("#shipping_insurance").val( (($("#add_value_assured").val() / 100) * $("#add_shipping_insurance").val()).toFixed(2) )
        $("#customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )
        $("#hidden_customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )

        if ($("#tax_count").val() == 1) {
          
          $("#tax").val( ( (subtotal / 100 ) * $("#add_tax").val()).toFixed(2) )
        } else {
          
          $("#tax").val( $("#add_tax").val() )
        }

        $("#declared_value").val( ( ( decvalue / 100) * $("#add_declared_value").val() ).toFixed(2) )
        $("#fixed_charge").val(f_charge)
        $("#reissue").val($("#add_reissue").val())

        $("#total").val( ( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#declared_value").val()) + parseFloat($("#fixed_charge").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2) )
        
        if (parseFloat($("#total").val()) < parseFloat($("#hidden_paid_amount").val()) || parseFloat(subtotal) < parseFloat($("#discount").val())) {
          if (parseFloat(subtotal) < parseFloat($("#discount").val())) {
            toastr.error('The discount cannot be greater than the subtotal')
          } else {
            toastr.error('Since the payment has already been made, it is not possible for you to make any changes.')
          }
          $("#edit_register_packages_save").addClass('disabled')
        } else {
          $("#edit_register_packages_save").removeClass('disabled')
        }

      })

      $(document).on("input", ".edit_register_packages_weight", function () {
        var string = $("#hidden_loop_val").val()
        var hidden_loop_val = string.split(',')
      
        var currentRow=$(this).closest(".package_information");
        currentRow.find("#register_packages_weight_vol").val( (currentRow.find("#register_packages_length").val() * currentRow.find("#register_packages_width").val() * currentRow.find("#register_packages_height").val() / $("#edit_register_packages_vol_per").val()).toFixed(2) )
        

        for (let i = 0; i < hidden_loop_val.length; i++) {
          
          $("#edit_register_packages_weight_vol_"+i).val( ((parseFloat($("#edit_register_packages_length_"+i).val()) * parseFloat($("#edit_register_packages_width_"+i).val() * parseFloat($("#edit_register_packages_height_"+i).val()))) / parseFloat($("#edit_register_packages_vol_per").val())).toFixed(2) )
        }


        var weight_vol = 0;
        $('.edit_register_packages_weight_vol').each(function(){
          weight_vol += parseFloat($(this).val());
        });
        
        var weight = 0;
        $('.edit_register_packages_weight').each(function(){
          weight += parseFloat($(this).val());
        });
        
        var decvalue = 0;
        $('.edit_register_packages_decvalue').each(function(){
          decvalue += parseFloat($(this).val());
        });
        
        var f_charge = 0;
        $('.edit_register_packages_f_charge').each(function(){
          f_charge += parseFloat($(this).val());
        });
        
        subtotal = (weight_vol * $("#add_price_kg").val()).toFixed(2)
        
        $("#total_weight").val(weight.toFixed(2))
        $("#total_weight_vol").val(weight_vol.toFixed(2))
        $("#total_decvalue").val(decvalue.toFixed(2))
        $("#subtotal").val(subtotal)
        $("#discount").val(( (subtotal / 100) * $("#add_discount").val() ).toFixed(2))
        $("#shipping_insurance").val( (($("#add_value_assured").val() / 100) * $("#add_shipping_insurance").val()).toFixed(2) )
        $("#customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )
        $("#hidden_customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )

        if ($("#tax_count").val() == 1) {
          
          $("#tax").val( ( (subtotal / 100 ) * $("#add_tax").val()).toFixed(2) )
        } else {
          
          $("#tax").val( $("#add_tax").val() )
        }

        $("#declared_value").val( ( ( decvalue / 100) * $("#add_declared_value").val() ).toFixed(2) )
        $("#fixed_charge").val(f_charge)
        $("#reissue").val($("#add_reissue").val())

        $("#total").val( ( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#declared_value").val()) + parseFloat($("#fixed_charge").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2) )

        if (parseFloat($("#total").val()) < parseFloat($("#hidden_paid_amount").val()) || parseFloat(subtotal) < parseFloat($("#discount").val())) {
          if (parseFloat(subtotal) < parseFloat($("#discount").val())) {
            toastr.error('The discount cannot be greater than the subtotal')
          } else {
            toastr.error('Since the payment has already been made, it is not possible for you to make any changes.')
          }
          $("#edit_register_packages_save").addClass('disabled')
        } else {
          $("#edit_register_packages_save").removeClass('disabled')
        }
      })

      $(document).on("input", ".edit_register_packages_f_charge", function () {
        var string = $("#hidden_loop_val").val()
        var hidden_loop_val = string.split(',')
      
        var currentRow=$(this).closest(".package_information");
        currentRow.find("#register_packages_weight_vol").val( (currentRow.find("#register_packages_length").val() * currentRow.find("#register_packages_width").val() * currentRow.find("#register_packages_height").val() / $("#edit_register_packages_vol_per").val()).toFixed(2) )
        
        
        for (let i = 0; i < hidden_loop_val.length; i++) {
          
          $("#edit_register_packages_weight_vol_"+i).val( ((parseFloat($("#edit_register_packages_length_"+i).val()) * parseFloat($("#edit_register_packages_width_"+i).val() * parseFloat($("#edit_register_packages_height_"+i).val()))) / parseFloat($("#edit_register_packages_vol_per").val())).toFixed(2) )
        }


        var weight_vol = 0;
        $('.edit_register_packages_weight_vol').each(function(){
          weight_vol += parseFloat($(this).val());
        });
        
        var weight = 0;
        $('.edit_register_packages_weight').each(function(){
          weight += parseFloat($(this).val());
        });
        
        var decvalue = 0;
        $('.edit_register_packages_decvalue').each(function(){
          decvalue += parseFloat($(this).val());
        });
        
        var f_charge = 0;
        $('.edit_register_packages_f_charge').each(function(){
          f_charge += parseFloat($(this).val());
        });
        
        subtotal = (weight_vol * $("#add_price_kg").val()).toFixed(2)
        
        $("#total_weight").val(weight.toFixed(2))
        $("#total_weight_vol").val(weight_vol.toFixed(2))
        $("#total_decvalue").val(decvalue.toFixed(2))
        $("#subtotal").val(subtotal)
        $("#discount").val(( (subtotal / 100) * $("#add_discount").val() ).toFixed(2))
        $("#shipping_insurance").val( (($("#add_value_assured").val() / 100) * $("#add_shipping_insurance").val()).toFixed(2) )
        $("#customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )
        $("#hidden_customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )

        if ($("#tax_count").val() == 1) {
          
          $("#tax").val( ( (subtotal / 100 ) * $("#add_tax").val()).toFixed(2) )
        } else {
          
          $("#tax").val( $("#add_tax").val() )
        }

        $("#declared_value").val( ( ( decvalue / 100) * $("#add_declared_value").val() ).toFixed(2) )
        $("#fixed_charge").val(f_charge)
        $("#reissue").val($("#add_reissue").val())

        $("#total").val( ( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#declared_value").val()) + parseFloat($("#fixed_charge").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2) )
        
        if (parseFloat($("#total").val()) < parseFloat($("#hidden_paid_amount").val()) || parseFloat(subtotal) < parseFloat($("#discount").val())) {
          if (parseFloat(subtotal) < parseFloat($("#discount").val())) {
            toastr.error('The discount cannot be greater than the subtotal')
          } else {
            toastr.error('Since the payment has already been made, it is not possible for you to make any changes.')
          }
          $("#edit_register_packages_save").addClass('disabled')
        } else {
          $("#edit_register_packages_save").removeClass('disabled')
        }
      })

      $(document).on("input", ".edit_register_packages_decvalue", function () {
        var string = $("#hidden_loop_val").val()
        var hidden_loop_val = string.split(',')
      
        var currentRow=$(this).closest(".package_information");
        currentRow.find("#register_packages_weight_vol").val( (currentRow.find("#register_packages_length").val() * currentRow.find("#register_packages_width").val() * currentRow.find("#register_packages_height").val() / $("#edit_register_packages_vol_per").val()).toFixed(2) )
        

        for (let i = 0; i < hidden_loop_val.length; i++) {
          
          $("#edit_register_packages_weight_vol_"+i).val( ((parseFloat($("#edit_register_packages_length_"+i).val()) * parseFloat($("#edit_register_packages_width_"+i).val() * parseFloat($("#edit_register_packages_height_"+i).val()))) / parseFloat($("#edit_register_packages_vol_per").val())).toFixed(2) )
        }


        var weight_vol = 0;
        $('.edit_register_packages_weight_vol').each(function(){
          weight_vol += parseFloat($(this).val());
        });
        
        var weight = 0;
        $('.edit_register_packages_weight').each(function(){
          weight += parseFloat($(this).val());
        });
        
        var decvalue = 0;
        $('.edit_register_packages_decvalue').each(function(){
          decvalue += parseFloat($(this).val());
        });
        
        var f_charge = 0;
        $('.edit_register_packages_f_charge').each(function(){
          f_charge += parseFloat($(this).val());
        });
        
        subtotal = (weight_vol * $("#add_price_kg").val()).toFixed(2)
        
        $("#total_weight").val(weight.toFixed(2))
        $("#total_weight_vol").val(weight_vol.toFixed(2))
        $("#total_decvalue").val(decvalue.toFixed(2))
        $("#subtotal").val(subtotal)
        $("#discount").val(( (subtotal / 100) * $("#add_discount").val() ).toFixed(2))
        $("#shipping_insurance").val( (($("#add_value_assured").val() / 100) * $("#add_shipping_insurance").val()).toFixed(2) )
        $("#customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )
        $("#hidden_customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )

        if ($("#tax_count").val() == 1) {
          
          $("#tax").val( ( (subtotal / 100 ) * $("#add_tax").val()).toFixed(2) )
        } else {
          
          $("#tax").val( $("#add_tax").val() )
        }

        $("#declared_value").val( ( ( decvalue / 100) * $("#add_declared_value").val() ).toFixed(2) )
        $("#fixed_charge").val(f_charge)
        $("#reissue").val($("#add_reissue").val())

        $("#total").val( ( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#declared_value").val()) + parseFloat($("#fixed_charge").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2) )
        
        if (parseFloat($("#total").val()) < parseFloat($("#hidden_paid_amount").val()) || parseFloat(subtotal) < parseFloat($("#discount").val())) {
          if (parseFloat(subtotal) < parseFloat($("#discount").val())) {
            toastr.error('The discount cannot be greater than the subtotal')
          } else {
            toastr.error('Since the payment has already been made, it is not possible for you to make any changes.')
          }
          $("#edit_register_packages_save").addClass('disabled')
        } else {
          $("#edit_register_packages_save").removeClass('disabled')
        }
      })

      $(document).on("click", "#edit_package_information_remove", function () {
        
        $(this).parents('.package_information').remove();

        var weight_vol = 0;
        $('.edit_register_packages_weight_vol').each(function(){
          weight_vol += parseFloat($(this).val());
        });
        
        var weight = 0;
        $('.edit_register_packages_weight').each(function(){
          weight += parseFloat($(this).val());
        });
        
        var decvalue = 0;
        $('.edit_register_packages_decvalue').each(function(){
          decvalue += parseFloat($(this).val());
        });
        
        var f_charge = 0;
        $('.edit_register_packages_f_charge').each(function(){
          f_charge += parseFloat($(this).val());
        });
        
        subtotal = (weight_vol * $("#add_price_kg").val()).toFixed(2)
        
        $("#total_weight").val(weight.toFixed(2))
        $("#total_weight_vol").val(weight_vol.toFixed(2))
        $("#total_decvalue").val(decvalue.toFixed(2))
        $("#subtotal").val(subtotal)
        $("#discount").val(( (subtotal / 100) * $("#add_discount").val() ).toFixed(2))
        $("#shipping_insurance").val( (($("#add_value_assured").val() / 100) * $("#add_shipping_insurance").val()).toFixed(2) )
        $("#customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )
        $("#hidden_customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )

        if ($("#tax_count").val() == 1) {
          
          $("#tax").val( ( (subtotal / 100 ) * $("#add_tax").val()).toFixed(2) )
        } else {
          
          $("#tax").val( $("#add_tax").val() )
        }

        $("#declared_value").val( ( ( decvalue / 100) * $("#add_declared_value").val() ).toFixed(2) )
        $("#fixed_charge").val(f_charge)
        $("#reissue").val($("#add_reissue").val())

        $("#total").val( ( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#declared_value").val()) + parseFloat($("#fixed_charge").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2) )
        
      })


      // ========= create_shipment =========== //

      $(document).on("select2:select", "#shipment_customer", function () {
        var value = $("#shipment_customer").select2('val')
        $("#shipment_submit").addClass("disabled")
        var base_url = window.location.origin;
        
        $.ajax({
            url: base_url + "/online_shopping/address/ajax/" + value,
            type: "GET",
            dataType: "JSON",
            success: function (res) {
              $("#customer_address").html('<option value selected disabled>Select State</option>')
              
              $.each(res.country, function (index, value) {

                res.countries_list.forEach((data, i) => {
                  if (data.id == value) {

                    res.state_list.forEach((state_list) => {
                      if (state_list.id == res.state[index]) {

                        res.city_list.forEach((city_list) => {
                          if (city_list.id == res.city[index]) {
                            
                            $("#customer_address").append('<option value="' + res.address[index] + '"> ' + "Country : " + data.countries_name + " | State : " + state_list.state_name + " | City : " + city_list.city_name + " | Zip COde : " + res.zipcode[index] + " | Address : " + res.address[index] +' </option>')
                          }
                        })

                      }
                    })
                    
                  }
                });

              })
            }
        })

        $.ajax({
          url: base_url + "/shipping/create_shipment/ajax/" + value,
          type: "GET",
          dataType: "JSON",
          success: function (res) {
            $("#shipment_client").html('<option value selected disabled>Select State</option>')
            
            $.each(res.client_data, function (index, value) { 

              $("#shipment_client").append('<option value="' + value.id  + '">' + value.first_name + " " + value.last_name + '</option>')
            })
          }
        })

      })

      $(document).on("select2:select", "#shipment_client", function () {
        var value = $("#shipment_client").select2('val')
        $("#shipment_submit").addClass("disabled")
        
        var base_url = window.location.origin;
        
        $.ajax({
            url: base_url + "/shipping/client_address/ajax/" + value,
            type: "GET",
            dataType: "JSON",
            success: function (res) {
              $("#client_address").html('<option value selected disabled>Select State</option>')
              
              $.each(res.country, function (index, value) {

                res.countries_list.forEach((data, i) => {
                  if (data.id == value) {

                    res.state_list.forEach((state_list) => {
                      if (state_list.id == res.state[index]) {

                        res.city_list.forEach((city_list) => {
                          if (city_list.id == res.city[index]) {
                            
                            $("#client_address").append('<option value="' + res.address[index] + '"> ' + "Country : " + data.countries_name + " | State : " + state_list.state_name + " | City : " + city_list.city_name + " | Zip COde : " + res.zipcode[index] + " | Address : " + res.address[index] +' </option>')
                          }
                        })

                      }
                    })
                    
                  }
                });

              })
            }
        })



      })


      $(document).on("click", "#shipment_add_box", function () {
        $("#register_add_row").append(
            '<div class="row mb-3 package_information">'+
                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Package_Name").text() +'</label>'+
                  '<input class="form-control form-control-sm" type="text" name="package_name" placeholder="Name">'+
                '</div>'+

                '<div class="col-lg-2 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Package_Description").text() +'</label>'+
                  '<input class="form-control form-control-sm" type="text" name="package_description" placeholder="Description">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Amount").text() +'</label>'+
                  '<input class="form-control form-control-sm" type="number" name="package_amount" placeholder="Amount">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Weight").text() +'</label>'+
                  '<input class="form-control form-control-sm shipment_weight" type="number" name="weight" value="0" min="0" step="">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Length").text() +'</label>'+
                  '<input class="form-control form-control-sm shipment_sum" type="number" name="length" id="register_packages_length" value="0" min="0">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Width").text() +'</label>'+
                  '<input class="form-control form-control-sm shipment_sum" type="number" name="width" id="register_packages_width" value="0" min="0">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Height").text() +'</label>'+
                  '<input class="form-control form-control-sm shipment_sum" type="number" name="height" id="register_packages_height" value="0" min="0">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Weight_Vol").text() +' <i class="fa fa-info-circle" data-bs-toggle="tooltip" data-bs-placement="top" title="L x W x H / Volume percentage"></i></label>'+
                  '<input class="form-control form-control-sm shipment_weight_vol" type="number" name="weight_vol" id="shipment_weight_vol" value="0" readonly>'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Fixed_charge").text() +'</label>'+
                  '<input class="form-control form-control-sm shipment_f_charge" type="number" name="f_charge" value="0" min="0">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_DecValue").text() +'</label>'+
                  '<input class="form-control form-control-sm shipment_decvalue" type="number" name="decvalue" value="0" min="0">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-center mt-4">'+
                  '<a type="submit" id="shipment_remove"><i class="icon-trash f-20 font-danger"></i></a>'+
                '</div>'+
            '</div>'
        )
        $("#shipment_submit").addClass("disabled")
      })


      $(document).on("click", "#shipment_calculate", function () {
        
        var weight_vol = 0;
        $('.shipment_weight_vol').each(function(){
          weight_vol += parseFloat($(this).val());
        });

        var customer = $("#shipment_customer").val()
        var client = $("#shipment_client").val()
        var customer_address = $("#customer_address").val()
        var client_address = $("#client_address").val()
        
        if (customer_address == null) {
          toastr.error("Please Enter Customer Address")
          
        } else if (client_address == null) {
          toastr.error("Please Enter Client Address")

        } else if (weight_vol <= 0 ) {
          toastr.error("Please Enter Length, Width And Height")

        } else{
          var base_url = window.location.origin;

          $.ajax({
            url: base_url + "/shipping/rate/ajax",
            type: "POST",
            dataType: "JSON",
            data: {customer, client, customer_address, client_address, weight_vol},
            success: function (res) {
              if(res.status === "error"){
                toastr.error(res.message)
              }
              $("#add_price_kg").val(res.rate_list.rate_price)
              $("#hidden_start_price").val(res.rate_list.start_weight_range)
              $("#hidden_end_price").val(res.rate_list.end_weight_range)
              $("#shipment_submit").removeClass("disabled")
              $("#shipment_details").removeClass("d-none")
              $("#subtotal").val(res.rate_list.rate_price)
              if ($("#tax_count").val() == 1) {

                $("#tax").val( ( (parseFloat($("#subtotal").val()) / 100 ) * parseFloat($("#add_tax").val())).toFixed(2) )
              } else {
                
                $("#tax").val( $("#add_tax").val() )
              }
              $("#total").val( ( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#declared_value").val()) + parseFloat($("#fixed_charge").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2) )
              if (parseFloat($("#subtotal").val()) < parseFloat($("#discount").val())) {
                toastr.error('The discount cannot be greater than the subtotal')
                $("#shipment_submit").addClass("disabled")
              }
            }
          })


        }
        
      })


      $(document).on("input", ".shipment_sum", function () {
        var currentRow=$(this).closest(".package_information");
        
        currentRow.find("#shipment_weight_vol").val( (currentRow.find("#register_packages_length").val() * currentRow.find("#register_packages_width").val() * currentRow.find("#register_packages_height").val() / $("#register_packages_vol_per").val()).toFixed(2) )

        var weight_vol = 0;
        $('.shipment_weight_vol').each(function(){
          weight_vol += parseFloat($(this).val());
        });
        
        var weight = 0;
        $('.shipment_weight').each(function(){
          weight += parseFloat($(this).val());
        });
        
        var decvalue = 0;
        $('.shipment_decvalue').each(function(){
          decvalue += parseFloat($(this).val());
        });
        
        var f_charge = 0;
        $('.shipment_f_charge').each(function(){
          f_charge += parseFloat($(this).val());
        });

        subtotal = ($("#add_price_kg").val())

        
        $("#total_weight").val(weight.toFixed(2))
        $("#total_weight_vol").val(weight_vol.toFixed(2))
        $("#total_decvalue").val(decvalue.toFixed(2))
        $("#subtotal").val(subtotal)
        $("#discount").val(( (subtotal / 100) * $("#add_discount").val() ).toFixed(2))
        $("#shipping_insurance").val( (($("#add_value_assured").val() / 100) * ($("#add_shipping_insurance").val())).toFixed(2) )
        $("#customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )
        $("#hidden_customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )

        if ($("#tax_count").val() == 1) {
          
          $("#tax").val( ( (subtotal / 100 ) * $("#add_tax").val()).toFixed(2) )
        } else {
          
          $("#tax").val( $("#add_tax").val() )
        }

        $("#declared_value").val( ( ( decvalue / 100) * $("#add_declared_value").val() ).toFixed(2) )
        $("#fixed_charge").val(f_charge.toFixed(2))
        $("#reissue").val($("#add_reissue").val())

        $("#total").val( ( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#declared_value").val()) + parseFloat($("#fixed_charge").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2) )
        $("#shipment_submit").addClass("disabled")

        if (subtotal < parseFloat($("#discount").val())) {
          toastr.error('The discount cannot be greater than the subtotal')
        }
      })

      $(document).on("input", ".shipment_weight", function () {
        var currentRow=$(this).closest(".package_information");
        
        currentRow.find("#shipment_weight_vol").val( (currentRow.find("#register_packages_length").val() * currentRow.find("#register_packages_width").val() * currentRow.find("#register_packages_height").val() / $("#register_packages_vol_per").val()).toFixed(2) )

        var weight_vol = 0;
        $('.shipment_weight_vol').each(function(){
          weight_vol += parseFloat($(this).val());
        });
        
        var weight = 0;
        $('.shipment_weight').each(function(){
          weight += parseFloat($(this).val());
        });
        
        var decvalue = 0;
        $('.shipment_decvalue').each(function(){
          decvalue += parseFloat($(this).val());
        });
        
        var f_charge = 0;
        $('.shipment_f_charge').each(function(){
          f_charge += parseFloat($(this).val());
        });

        subtotal = ($("#add_price_kg").val())
        
        $("#total_weight").val(weight.toFixed(2))
        $("#total_weight_vol").val(weight_vol.toFixed(2))
        $("#total_decvalue").val(decvalue.toFixed(2))
        $("#subtotal").val(subtotal)
        $("#discount").val(( (subtotal / 100) * $("#add_discount").val() ).toFixed(2))
        $("#shipping_insurance").val( (($("#add_value_assured").val() / 100) * $("#add_shipping_insurance").val()).toFixed(2) )
        $("#customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )
        $("#hidden_customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )

        if ($("#tax_count").val() == 1) {
          
          $("#tax").val( ( (subtotal / 100 ) * $("#add_tax").val()).toFixed(2) )
        } else {
          
          $("#tax").val( $("#add_tax").val() )
        }

        $("#declared_value").val( ( ( decvalue / 100) * $("#add_declared_value").val() ).toFixed(2) )
        $("#fixed_charge").val(f_charge)
        $("#reissue").val($("#add_reissue").val())

        $("#total").val( ( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#declared_value").val()) + parseFloat($("#fixed_charge").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2) )
        $("#shipment_submit").addClass("disabled")

        if (subtotal < parseFloat($("#discount").val())) {
          toastr.error('The discount cannot be greater than the subtotal')
        }
      })

      $(document).on("input", ".shipment_f_charge", function () {
        var currentRow=$(this).closest(".package_information");
        
        currentRow.find("#shipment_weight_vol").val( (currentRow.find("#register_packages_length").val() * currentRow.find("#register_packages_width").val() * currentRow.find("#register_packages_height").val() / $("#register_packages_vol_per").val()).toFixed(2) )

        var weight_vol = 0;
        $('.shipment_weight_vol').each(function(){
          weight_vol += parseFloat($(this).val());
        });
        
        var weight = 0;
        $('.shipment_weight').each(function(){
          weight += parseFloat($(this).val());
        });
        
        var decvalue = 0;
        $('.shipment_decvalue').each(function(){
          decvalue += parseFloat($(this).val());
        });
        
        var f_charge = 0;
        $('.shipment_f_charge').each(function(){
          f_charge += parseFloat($(this).val());
        });

        subtotal = ($("#add_price_kg").val())
        
        $("#total_weight").val(weight.toFixed(2))
        $("#total_weight_vol").val(weight_vol.toFixed(2))
        $("#total_decvalue").val(decvalue.toFixed(2))
        $("#subtotal").val(subtotal)
        $("#discount").val(( (subtotal / 100) * $("#add_discount").val() ).toFixed(2))
        $("#shipping_insurance").val( (($("#add_value_assured").val() / 100) * $("#add_shipping_insurance").val()).toFixed(2) )
        $("#customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )
        $("#hidden_customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )

        if ($("#tax_count").val() == 1) {
          
          $("#tax").val( ( (subtotal / 100 ) * $("#add_tax").val()).toFixed(2) )
        } else {
          
          $("#tax").val( $("#add_tax").val() )
        }

        $("#declared_value").val( ( ( decvalue / 100) * $("#add_declared_value").val() ).toFixed(2) )
        $("#fixed_charge").val(f_charge)
        $("#reissue").val($("#add_reissue").val())

        $("#total").val( ( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#declared_value").val()) + parseFloat($("#fixed_charge").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2) )
        $("#shipment_submit").addClass("disabled")

        if (subtotal < parseFloat($("#discount").val())) {
          toastr.error('The discount cannot be greater than the subtotal')
        }
      })

      $(document).on("input", ".shipment_decvalue", function () {
        var currentRow=$(this).closest(".package_information");
        
        currentRow.find("#shipment_weight_vol").val( (currentRow.find("#register_packages_length").val() * currentRow.find("#register_packages_width").val() * currentRow.find("#register_packages_height").val() / $("#register_packages_vol_per").val()).toFixed(2) )

        var weight_vol = 0;
        $('.shipment_weight_vol').each(function(){
          weight_vol += parseFloat($(this).val());
        });
        
        var weight = 0;
        $('.shipment_weight').each(function(){
          weight += parseFloat($(this).val());
        });
        
        var decvalue = 0;
        $('.shipment_decvalue').each(function(){
          decvalue += parseFloat($(this).val());
        });
        
        var f_charge = 0;
        $('.shipment_f_charge').each(function(){
          f_charge += parseFloat($(this).val());
        });

        subtotal = ($("#add_price_kg").val())
        
        $("#total_weight").val(weight.toFixed(2))
        $("#total_weight_vol").val(weight_vol.toFixed(2))
        $("#total_decvalue").val(decvalue.toFixed(2))
        $("#subtotal").val(subtotal)
        $("#discount").val(( (subtotal / 100) * $("#add_discount").val() ).toFixed(2))
        $("#shipping_insurance").val( (($("#add_value_assured").val() / 100) * $("#add_shipping_insurance").val()).toFixed(2) )
        $("#customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )
        $("#hidden_customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )

        if ($("#tax_count").val() == 1) {
          
          $("#tax").val( ( (subtotal / 100 ) * $("#add_tax").val()).toFixed(2) )
        } else {
          
          $("#tax").val( $("#add_tax").val() )
        }

        $("#declared_value").val( ( ( decvalue / 100) * $("#add_declared_value").val() ).toFixed(2) )
        $("#fixed_charge").val(f_charge)
        $("#reissue").val($("#add_reissue").val())

        $("#total").val( ( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#declared_value").val()) + parseFloat($("#fixed_charge").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2) )
        $("#shipment_submit").addClass("disabled")

        if (subtotal < parseFloat($("#discount").val())) {
          toastr.error('The discount cannot be greater than the subtotal')
        }
      })

      $(document).on("click", ".shipment_submit", function () {

        if ($("#file-1").val() == "") {
          return $("#image_error").text("Image not selected")
        }
      })

      $(document).on("click", "#shipment_remove", function () {
        
        $(this).parents('.package_information').remove();

        var weight_vol = 0;
        $('.shipment_weight_vol').each(function(){
          weight_vol += parseFloat($(this).val());
        });
        
        var weight = 0;
        $('.shipment_weight').each(function(){
          weight += parseFloat($(this).val());
        });
        
        var decvalue = 0;
        $('.shipment_decvalue').each(function(){
          decvalue += parseFloat($(this).val());
        });
        
        var f_charge = 0;
        $('.shipment_f_charge').each(function(){
          f_charge += parseFloat($(this).val());
        });

        subtotal = ($("#add_price_kg").val())
        
        $("#total_weight").val(weight.toFixed(2))
        $("#total_weight_vol").val(weight_vol.toFixed(2))
        $("#total_decvalue").val(decvalue.toFixed(2))
        $("#subtotal").val(subtotal)
        $("#discount").val(( (subtotal / 100) * $("#add_discount").val() ).toFixed(2))
        $("#shipping_insurance").val( (($("#add_value_assured").val() / 100) * $("#add_shipping_insurance").val()).toFixed(2) )
        $("#customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )
        $("#hidden_customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )
        
        if ($("#tax_count").val() == 1) {

          $("#tax").val( ( (subtotal / 100 ) * $("#add_tax").val()).toFixed(2) )
        } else {
          
          $("#tax").val( $("#add_tax").val() )
        }

        $("#declared_value").val( ( ( decvalue / 100) * $("#add_declared_value").val() ).toFixed(2) )
        $("#fixed_charge").val(f_charge)
        $("#reissue").val($("#add_reissue").val())

        $("#total").val( ( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#declared_value").val()) + parseFloat($("#fixed_charge").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2) )
        $("#shipment_submit").addClass("disabled")

        if (subtotal < parseFloat($("#discount").val())) {
          toastr.error('The discount cannot be greater than the subtotal')
        }
      })

      $(document).on("click", "#shipping_assign_driver", function () {
        let dataid = $(this).attr("data-id");
        let dataname = $(this).attr("data-name");

        $("#hidden_id").attr('value', dataid);
        $('#assign_driver_toggle').select2().select2('val', dataname);
      })



      $(document).on("input", "#deliver_shipment_img", function () {
        $("#hidden_image").val(1)
      })


      $(document).on("click", "#shipping_add_payment", function () {
        let dataid = $(this).attr("data-id");
        let datainvoice = $(this).attr("data-invoice");
        let datadue = $(this).attr("data-due");

        $("#payment_action").attr('action', '/shipping/payment/' + dataid);
        $('#invoice').attr('value', datainvoice);
        $('#payable_amount').attr('value', datadue);
        $('#paid_amount').attr('value', datadue);
      })


      $(document).on('click','#print_shipment', function () {
          var printContents=document.getElementById('invo_print').innerHTML;
          document.body.innerHTML=printContents;
          window.print();
          location.reload();
      })


      // ========= edit create_shipment =========== //

      $(document).on("click", "#edit_shipment_add_box", function () {
        $("#register_add_row").append(
            '<div class="row mb-3 package_information">'+
                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Package_Name").text() +'</label>'+
                  '<input class="form-control form-control-sm" type="text" name="package_name" placeholder="Name">'+
                '</div>'+

                '<div class="col-lg-2 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Package_Description").text() +'</label>'+
                  '<input class="form-control form-control-sm" type="text" name="package_description" placeholder="Description">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Amount").text() +'</label>'+
                  '<input class="form-control form-control-sm" type="number" name="package_amount" placeholder="Amount">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Weight").text() +'</label>'+
                  '<input class="form-control form-control-sm edit_shipment_weight" type="number" name="weight" value="0" min="0" step="">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Length").text() +'</label>'+
                  '<input class="form-control form-control-sm edit_shipment_sum" type="number" name="length" id="register_packages_length" value="0" min="0">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Width").text() +'</label>'+
                  '<input class="form-control form-control-sm edit_shipment_sum" type="number" name="width" id="register_packages_width" value="0" min="0">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Height").text() +'</label>'+
                  '<input class="form-control form-control-sm edit_shipment_sum" type="number" name="height" id="register_packages_height" value="0" min="0">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Weight_Vol").text() +' <i class="fa fa-info-circle" data-bs-toggle="tooltip" data-bs-placement="top" title="L x W x H / Volume percentage"></i></label>'+
                  '<input class="form-control form-control-sm edit_shipment_weight_vol" type="number" name="weight_vol" id="shipment_weight_vol" value="0" readonly>'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_Fixed_charge").text() +'</label>'+
                  '<input class="form-control form-control-sm edit_shipment_f_charge" type="number" name="f_charge" value="0" min="0">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-start flex-column">'+
                  '<label class="form-label mb-auto" for="validationCustom01">'+ $("#json_DecValue").text() +'</label>'+
                  '<input class="form-control form-control-sm edit_shipment_decvalue" type="number" name="decvalue" value="0" min="0">'+
                '</div>'+

                '<div class="col-lg-1 col-md-4 d-flex align-items-center mt-4">'+
                  '<a type="submit" id="edit_shipment_remove"><i class="icon-trash f-20 font-danger"></i></a>'+
                '</div>'+
            '</div>'
        )
        $("#shipment_submit").addClass("disabled")
      })

      $(document).on("click", "#edit_shipment_calculate", function () {
        
        var weight_vol = 0;
        $('.edit_shipment_weight_vol').each(function(){
          weight_vol += parseFloat($(this).val());
        });

        var customer = $("#shipment_customer").val()
        var client = $("#shipment_client").val()
        var customer_address = $("#customer_address").val()
        var client_address = $("#client_address").val()
        

        if (customer_address == null) {
          toastr.error("Please Enter Customer Address")
          
        } else if (client_address == null) {
          toastr.error("Please Enter Client Address")

        } else if (weight_vol <= 0 ) {
          toastr.error("Please Enter Length, Width And Height")

        } else if ( parseFloat($("#total").val())  < parseFloat($("#hidden_paid_amount").val()) ) {
          toastr.error('Your Total Amount Is Less Than Due Amount')
          
        } else{
          var base_url = window.location.origin;

          $.ajax({
            url: base_url + "/shipping/rate/ajax",
            type: "POST",
            dataType: "JSON",
            data: {customer, client, customer_address, client_address, weight_vol},
            success: function (res) {
              if(res.status === "error"){
                alert(res.message)
              }
              $("#add_price_kg").val(res.rate_list.rate_price)
              $("#hidden_start_price").val(res.rate_list.start_weight_range)
              $("#hidden_end_price").val(res.rate_list.end_weight_range)
              $("#shipment_submit").removeClass("disabled")
              $("#shipment_details").removeClass("d-none")
              $("#subtotal").val(res.rate_list.rate_price)
              if ($("#tax_count").val() == 1) {
              
                $("#tax").val( ( (parseFloat($("#subtotal").val()) / 100 ) * parseFloat($("#add_tax").val())).toFixed(2) )
              } else {
              
                $("#tax").val( $("#add_tax").val() )
              }
              $("#total").val( ( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#declared_value").val()) + parseFloat($("#fixed_charge").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2) )
              if (parseFloat($("#subtotal").val()) < parseFloat($("#discount").val())) {
                toastr.error('The discount cannot be greater than the subtotal')
                $("#shipment_submit").addClass("disabled")
              }
            }
          })


        }
        
      })

      $(document).on("input", ".edit_shipment_sum", function () {

        var string = $("#hidden_loop_val").val()
        var hidden_loop_val = string.split(',')
        var currentRow=$(this).closest(".package_information");
        
        currentRow.find("#shipment_weight_vol").val( (currentRow.find("#register_packages_length").val() * currentRow.find("#register_packages_width").val() * currentRow.find("#register_packages_height").val() / $("#register_packages_vol_per").val()).toFixed(2) )

        for (let i = 0; i < hidden_loop_val.length; i++) {

          $("#edit_register_packages_weight_vol_"+i).val( ((parseFloat($("#edit_register_packages_length_"+i).val()) * parseFloat($("#edit_register_packages_width_"+i).val() * parseFloat($("#edit_register_packages_height_"+i).val()))) / parseFloat($("#register_packages_vol_per").val())).toFixed(2) )
        }

        var weight_vol = 0;
        $('.edit_shipment_weight_vol').each(function(){
          weight_vol += parseFloat($(this).val());
        });
        
        var weight = 0;
        $('.edit_shipment_weight').each(function(){
          weight += parseFloat($(this).val());
        });
        
        var decvalue = 0;
        $('.edit_shipment_decvalue').each(function(){
          decvalue += parseFloat($(this).val());
        });
        
        var f_charge = 0;
        $('.edit_shipment_f_charge').each(function(){
          f_charge += parseFloat($(this).val());
        });

        subtotal = ($("#add_price_kg").val())

        
        $("#total_weight").val(weight.toFixed(2))
        $("#total_weight_vol").val(weight_vol.toFixed(2))
        $("#total_decvalue").val(decvalue.toFixed(2))
        $("#subtotal").val(subtotal)
        $("#discount").val(( (subtotal / 100) * $("#add_discount").val() ).toFixed(2))
        $("#shipping_insurance").val( (($("#add_value_assured").val() / 100) * $("#add_shipping_insurance").val()).toFixed(2) )
        $("#customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )
        $("#hidden_customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )

        if ($("#tax_count").val() == 1) {
          
          $("#tax").val( ( (subtotal / 100 ) * $("#add_tax").val()).toFixed(2) )
        } else {
          
          $("#tax").val( $("#add_tax").val() )
        }

        $("#declared_value").val( ( ( decvalue / 100) * $("#add_declared_value").val() ).toFixed(2) )
        $("#fixed_charge").val(f_charge)
        $("#reissue").val($("#add_reissue").val())

        $("#total").val( ( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#declared_value").val()) + parseFloat($("#fixed_charge").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2) )
        $("#shipment_submit").addClass("disabled")

        if (subtotal < parseFloat($("#discount").val())) {
          toastr.error('The discount cannot be greater than the subtotal')
        }
      })

      $(document).on("input", ".edit_shipment_weight", function () {

        var string = $("#hidden_loop_val").val()
        var hidden_loop_val = string.split(',')
        var currentRow=$(this).closest(".package_information");
        
        currentRow.find("#shipment_weight_vol").val( (currentRow.find("#register_packages_length").val() * currentRow.find("#register_packages_width").val() * currentRow.find("#register_packages_height").val() / $("#register_packages_vol_per").val()).toFixed(2) )

        for (let i = 0; i < hidden_loop_val.length; i++) {

          $("#edit_register_packages_weight_vol_"+i).val( ((parseFloat($("#edit_register_packages_length_"+i).val()) * parseFloat($("#edit_register_packages_width_"+i).val() * parseFloat($("#edit_register_packages_height_"+i).val()))) / parseFloat($("#register_packages_vol_per").val())).toFixed(2) )
        }

        var weight_vol = 0;
        $('.edit_shipment_weight_vol').each(function(){
          weight_vol += parseFloat($(this).val());
        });
        
        var weight = 0;
        $('.edit_shipment_weight').each(function(){
          weight += parseFloat($(this).val());
        });
        
        var decvalue = 0;
        $('.edit_shipment_decvalue').each(function(){
          decvalue += parseFloat($(this).val());
        });
        
        var f_charge = 0;
        $('.edit_shipment_f_charge').each(function(){
          f_charge += parseFloat($(this).val());
        });

        subtotal = ($("#add_price_kg").val())

        
        $("#total_weight").val(weight.toFixed(2))
        $("#total_weight_vol").val(weight_vol.toFixed(2))
        $("#total_decvalue").val(decvalue.toFixed(2))
        $("#subtotal").val(subtotal)
        $("#discount").val(( (subtotal / 100) * $("#add_discount").val() ).toFixed(2))
        $("#shipping_insurance").val( (($("#add_value_assured").val() / 100) * $("#add_shipping_insurance").val()).toFixed(2) )
        $("#customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )
        $("#hidden_customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )

        if ($("#tax_count").val() == 1) {
          
          $("#tax").val( ( (subtotal / 100 ) * $("#add_tax").val()).toFixed(2) )
        } else {
          
          $("#tax").val( $("#add_tax").val() )
        }

        $("#declared_value").val( ( ( decvalue / 100) * $("#add_declared_value").val() ).toFixed(2) )
        $("#fixed_charge").val(f_charge)
        $("#reissue").val($("#add_reissue").val())

        $("#total").val( ( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#declared_value").val()) + parseFloat($("#fixed_charge").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2) )
        $("#shipment_submit").addClass("disabled")

        if (subtotal < parseFloat($("#discount").val())) {
          toastr.error('The discount cannot be greater than the subtotal')
        }
      })

      $(document).on("input", ".edit_shipment_f_charge", function () {

        var string = $("#hidden_loop_val").val()
        var hidden_loop_val = string.split(',')
        var currentRow=$(this).closest(".package_information");
        
        currentRow.find("#shipment_weight_vol").val( (currentRow.find("#register_packages_length").val() * currentRow.find("#register_packages_width").val() * currentRow.find("#register_packages_height").val() / $("#register_packages_vol_per").val()).toFixed(2) )

        for (let i = 0; i < hidden_loop_val.length; i++) {

          $("#edit_register_packages_weight_vol_"+i).val( ((parseFloat($("#edit_register_packages_length_"+i).val()) * parseFloat($("#edit_register_packages_width_"+i).val() * parseFloat($("#edit_register_packages_height_"+i).val()))) / parseFloat($("#register_packages_vol_per").val())).toFixed(2) )
        }

        var weight_vol = 0;
        $('.edit_shipment_weight_vol').each(function(){
          weight_vol += parseFloat($(this).val());
        });
        
        var weight = 0;
        $('.edit_shipment_weight').each(function(){
          weight += parseFloat($(this).val());
        });
        
        var decvalue = 0;
        $('.edit_shipment_decvalue').each(function(){
          decvalue += parseFloat($(this).val());
        });
        
        var f_charge = 0;
        $('.edit_shipment_f_charge').each(function(){
          f_charge += parseFloat($(this).val());
        });

        subtotal = ($("#add_price_kg").val())

        
        $("#total_weight").val(weight.toFixed(2))
        $("#total_weight_vol").val(weight_vol.toFixed(2))
        $("#total_decvalue").val(decvalue.toFixed(2))
        $("#subtotal").val(subtotal)
        $("#discount").val(( (subtotal / 100) * $("#add_discount").val() ).toFixed(2))
        $("#shipping_insurance").val( (($("#add_value_assured").val() / 100) * $("#add_shipping_insurance").val()).toFixed(2) )
        $("#customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )
        $("#hidden_customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )

        if ($("#tax_count").val() == 1) {
          
          $("#tax").val( ( (subtotal / 100 ) * $("#add_tax").val()).toFixed(2) )
        } else {
          
          $("#tax").val( $("#add_tax").val() )
        }

        $("#declared_value").val( ( ( decvalue / 100) * $("#add_declared_value").val() ).toFixed(2) )
        $("#fixed_charge").val(f_charge)
        $("#reissue").val($("#add_reissue").val())

        $("#total").val( ( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#declared_value").val()) + parseFloat($("#fixed_charge").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2) )
        $("#shipment_submit").addClass("disabled")

        if (subtotal < parseFloat($("#discount").val())) {
          toastr.error('The discount cannot be greater than the subtotal')
        }
      })

      $(document).on("input", ".edit_shipment_decvalue", function () {

        var string = $("#hidden_loop_val").val()
        var hidden_loop_val = string.split(',')
        var currentRow=$(this).closest(".package_information");
        
        currentRow.find("#shipment_weight_vol").val( (currentRow.find("#register_packages_length").val() * currentRow.find("#register_packages_width").val() * currentRow.find("#register_packages_height").val() / $("#register_packages_vol_per").val()).toFixed(2) )

        for (let i = 0; i < hidden_loop_val.length; i++) {

          $("#edit_register_packages_weight_vol_"+i).val( ((parseFloat($("#edit_register_packages_length_"+i).val()) * parseFloat($("#edit_register_packages_width_"+i).val() * parseFloat($("#edit_register_packages_height_"+i).val()))) / parseFloat($("#register_packages_vol_per").val())).toFixed(2) )
        }

        var weight_vol = 0;
        $('.edit_shipment_weight_vol').each(function(){
          weight_vol += parseFloat($(this).val());
        });
        
        var weight = 0;
        $('.edit_shipment_weight').each(function(){
          weight += parseFloat($(this).val());
        });
        
        var decvalue = 0;
        $('.edit_shipment_decvalue').each(function(){
          decvalue += parseFloat($(this).val());
        });
        
        var f_charge = 0;
        $('.edit_shipment_f_charge').each(function(){
          f_charge += parseFloat($(this).val());
        });

        subtotal = ($("#add_price_kg").val())

        
        $("#total_weight").val(weight.toFixed(2))
        $("#total_weight_vol").val(weight_vol.toFixed(2))
        $("#total_decvalue").val(decvalue.toFixed(2))
        $("#subtotal").val(subtotal)
        $("#discount").val(( (subtotal / 100) * $("#add_discount").val() ).toFixed(2))
        $("#shipping_insurance").val( (($("#add_value_assured").val() / 100) * $("#add_shipping_insurance").val()).toFixed(2) )
        $("#customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )
        $("#hidden_customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )

        if ($("#tax_count").val() == 1) {
          
          $("#tax").val( ( (subtotal / 100 ) * $("#add_tax").val()).toFixed(2) )
        } else {
          
          $("#tax").val( $("#add_tax").val() )
        }

        $("#declared_value").val( ( ( decvalue / 100) * $("#add_declared_value").val() ).toFixed(2) )
        $("#fixed_charge").val(f_charge)
        $("#reissue").val($("#add_reissue").val())

        $("#total").val( ( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#declared_value").val()) + parseFloat($("#fixed_charge").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2) )
        $("#shipment_submit").addClass("disabled")

        if (subtotal < parseFloat($("#discount").val())) {
          toastr.error('The discount cannot be greater than the subtotal')
        }
      })

      $(document).on("click", "#edit_shipment_remove", function () {
        
        $(this).parents('.package_information').remove();

        var weight_vol = 0;
        $('.edit_shipment_weight_vol').each(function(){
          weight_vol += parseFloat($(this).val());
        });
        
        var weight = 0;
        $('.edit_shipment_weight').each(function(){
          weight += parseFloat($(this).val());
        });
        
        var decvalue = 0;
        $('.edit_shipment_decvalue').each(function(){
          decvalue += parseFloat($(this).val());
        });
        
        var f_charge = 0;
        $('.edit_shipment_f_charge').each(function(){
          f_charge += parseFloat($(this).val());
        });

        subtotal = ($("#add_price_kg").val())

        
        $("#total_weight").val(weight.toFixed(2))
        $("#total_weight_vol").val(weight_vol.toFixed(2))
        $("#total_decvalue").val(decvalue.toFixed(2))
        $("#subtotal").val(subtotal)
        $("#discount").val(( (subtotal / 100) * $("#add_discount").val() ).toFixed(2))
        $("#shipping_insurance").val( (($("#add_value_assured").val() / 100) * $("#add_shipping_insurance").val()).toFixed(2) )
        $("#customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )
        $("#hidden_customs_duties").val( ( (weight + weight_vol) * $("#add_customs_duties").val() ).toFixed(2) )

        if ($("#tax_count").val() == 1) {
          
          $("#tax").val( ( (subtotal / 100 ) * $("#add_tax").val()).toFixed(2) )
        } else {
          
          $("#tax").val( $("#add_tax").val() )
        }

        $("#declared_value").val( ( ( decvalue / 100) * $("#add_declared_value").val() ).toFixed(2) )
        $("#fixed_charge").val(f_charge)
        $("#reissue").val($("#add_reissue").val())

        $("#total").val( ( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#declared_value").val()) + parseFloat($("#fixed_charge").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2) )
        $("#shipment_submit").addClass("disabled")

        if (subtotal < parseFloat($("#discount").val())) {
          toastr.error('The discount cannot be greater than the subtotal')
        }
      })


      $(document).on("click", "#pickup_assign_driver", function () {
        let dataid = $(this).attr("data-id");
        let dataname = $(this).attr("data-name");

        $("#hidden_id").attr('value', dataid);
        $('#assign_driver_toggle').select2().select2('val', dataname);
      })


      // ============ pickup =========== //

      $(document).on("click", "#pickup_add_payment", function () {
        let dataid = $(this).attr("data-id");
        let datainvoice = $(this).attr("data-invoice");
        let datadue = $(this).attr("data-due");

        $("#payment_action").attr('action', '/pickup/payment/' + dataid);
        $('#invoice').attr('value', datainvoice);
        $('#payable_amount').attr('value', datadue);
        $('#paid_amount').attr('value', datadue);
      })

      // =========== consolidated ============= //


      $(document).on("click", "#find_shipment_data", function () {
        var base_url = window.location.origin;

        $.ajax({
          url: base_url + "/consolidated/find_shipment/ajax",
          type: "GET",
          dataType: "JSON",
          success: function (res) {
            $("#shipment_list").html("")

            $.each(res.shipment_list, function (index, value) {
                  
              $("#shipment_list").append(
                '<tr>'+
                  '<td class="invoice">' + value.invoice + '</td>'+
                  '<td class="weight">' + value.total_weight + '</td>'+
                  '<td class="weight_vol">' + value.total_weight_vol + '</td>'+
                  '<td> <span class="badge badge-warning p-2">Pending</span> </td>'+
                  '<td class="invosymbol">' + value.total + '</td>'+
                  '<td class="hidden d-none">0</td>'+
                  '<td class="hidden_id d-none">' + value.id + '</td>'+
                  '<td> <button class="btn btn-info" type="button" id="add_consolidated">Add</button> </td>'+
                '</tr>'
              )
            })
          }
        })


      })
      var id = []

      $(document).on("click", "#add_consolidated", function () {
        $(".add_shipment_table").removeClass("d-none")
        var currentRow=$(this).closest("tr");

        var invoice = currentRow.find(".invoice").text()
        var hidden_id = currentRow.find(".hidden_id").text()
        console.log(2222222, hidden_id);
        var abc = 0

        id.forEach((data) => {
          if(hidden_id == data){
            abc++
          }
        })
        
        if (abc == 0) {
          
          id.push(parseInt(hidden_id))
    
          var weight = currentRow.find(".weight").text()
          var weight_vol = currentRow.find(".weight_vol").text()
            
            $(".table_line").text("")
    
            $("#add_shipment_list").append(
              '<tr>'+
                '<td><input class="form-control" type="text" name="shipment_invoice" value="' + invoice + '" readonly></td>'+
                '<td class="d-none"><input class="form-control shipment_list_id" type="text" id="shipment_list_id" name="" value="' + hidden_id + '" readonly></td>'+
                '<td class=""><input class="form-control weight_sum" type="number" name="shipment_weight" value="' + weight + '" readonly></td>'+
                '<td class=""><input class="form-control weight_vol_sum" type="number" name="shipment_weight_vol" value="' + weight_vol + '" readonly></td>'+
                '<td> <a type="submit" id="add_shipment_remove"><i class="icon-trash f-20 font-danger"></i></a> </td>'+
              '</tr>'
            )
            $("#total_weight").val(( parseFloat($("#total_weight").val()) + parseFloat(weight) ).toFixed(2))
            $("#total_weight_vol").val(( parseFloat($("#total_weight_vol").val()) + parseFloat(weight_vol) ).toFixed(2))
            
            $("#subtotal").val( (parseFloat($("#total_weight_vol").val()).toFixed(2)) * $("#add_price_kg").val() )
            $("#discount").val(( (parseFloat($("#subtotal").val()) / 100) * parseFloat($("#add_discount").val()) ).toFixed(2))
            $("#shipping_insurance").val(( (parseFloat($("#add_value_assured").val()) / 100) * parseFloat($("#add_shipping_insurance").val()) ).toFixed(2))
            $("#customs_duties").val(( (parseFloat($("#total_weight").val()) + parseFloat($("#total_weight_vol").val())) * parseFloat($("#add_customs_duties").val()) ).toFixed(2))
            $("#reissue").val($("#add_reissue").val())
      
            if ($("#tax_count").val() == 1) {
              
              $("#tax").val( ( (parseFloat($("#subtotal").val()) / 100 ) * parseFloat($("#add_tax").val())).toFixed(2) )
            } else {
              
              $("#tax").val( $("#add_tax").val() )
            }
      
            $("#total").val(( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2))
      
            if (parseFloat($("#subtotal").val()) < parseFloat($("#discount").val())) {
              toastr.error('The discount cannot be greater than the subtotal')
              $("#consolidation_submit").addClass("disabled")
            } else{
              $("#consolidation_submit").removeClass("disabled")
            }
        } else {
          $(".table_line").text("already added")
        }

      })


      $(document).on("input", ".consolidation_sum", function () {

        $("#subtotal").val( (parseFloat($("#total_weight_vol").val()).toFixed(2)) * $("#add_price_kg").val() )

        $("#discount").val(( (parseFloat($("#subtotal").val()) / 100) * parseFloat($("#add_discount").val()) ).toFixed(2))

        $("#shipping_insurance").val(( (parseFloat($("#add_value_assured").val()) / 100) * parseFloat($("#add_shipping_insurance").val()) ).toFixed(2))

        $("#customs_duties").val(( (parseFloat($("#total_weight").val()) + parseFloat($("#total_weight_vol").val())) * parseFloat($("#add_customs_duties").val()) ).toFixed(2))

        $("#reissue").val($("#add_reissue").val())

        if ($("#tax_count").val() == 1) {
          
          $("#tax").val( ( (parseFloat($("#subtotal").val()) / 100 ) * parseFloat($("#add_tax").val())).toFixed(2) )
        } else {
          
          $("#tax").val( $("#add_tax").val() )
        }

        $("#total").val(( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2))

        if (parseFloat($("#subtotal").val()) < parseFloat($("#discount").val())) {
          toastr.error('The discount cannot be greater than the subtotal')
          $("#consolidation_submit").addClass("disabled")
        } else{
          $("#consolidation_submit").removeClass("disabled")
        }
      })


      $(document).on("click", "#add_shipment_remove", function () {
        var currentRow=$(this).closest("tr");
        
        var hidden_id = currentRow.find(".shipment_list_id").val()

        for (var i = 0; i < id.length; i++) {
          if (id[i] === parseFloat(hidden_id)) {
              var spliced = id.splice(i, 1);
              console.log("Removed element: " + spliced);
          }
        }

        var weight = currentRow.find(".weight_sum").val()
        var weight_vol = currentRow.find(".weight_vol_sum").val()

        $("#total_weight").val(( parseFloat($("#total_weight").val()) - parseFloat(weight) ).toFixed(2))
        $("#total_weight_vol").val(( parseFloat($("#total_weight_vol").val()) - parseFloat(weight_vol) ).toFixed(2))

        $(this).parents('tr').remove();
        
        // $("#subtotal").val( (parseFloat($("#total_weight_vol").val())).toFixed(2) * $("#add_price_kg").val() )
        // $("#customs_duties").val( ( (parseFloat($("#total_weight").val()) + parseFloat($("#total_weight_vol").val())) * parseFloat($("#add_customs_duties").val()) ).toFixed(2) )
        $("#subtotal").val( (parseFloat($("#total_weight_vol").val()).toFixed(2)) * $("#add_price_kg").val() )

        $("#discount").val(( (parseFloat($("#subtotal").val()) / 100) * parseFloat($("#add_discount").val()) ).toFixed(2))

        $("#shipping_insurance").val(( (parseFloat($("#add_value_assured").val()) / 100) * parseFloat($("#add_shipping_insurance").val()) ).toFixed(2))

        $("#customs_duties").val(( (parseFloat($("#total_weight").val()) + parseFloat($("#total_weight_vol").val())) * parseFloat($("#add_customs_duties").val()) ).toFixed(2))

        $("#reissue").val($("#add_reissue").val())

        if ($("#tax_count").val() == 1) {
          
          $("#tax").val( ( (parseFloat($("#subtotal").val()) / 100 ) * parseFloat($("#add_tax").val())).toFixed(2) )
        } else {
          
          $("#tax").val( $("#add_tax").val() )
        }

        $("#total").val(( parseFloat($("#subtotal").val()) + parseFloat($("#shipping_insurance").val()) + parseFloat($("#customs_duties").val()) + parseFloat($("#tax").val()) + parseFloat($("#reissue").val()) - parseFloat($("#discount").val()) ).toFixed(2))

        if (parseFloat($("#subtotal").val()) < parseFloat($("#discount").val())) {
          toastr.error('The discount cannot be greater than the subtotal')
          $("#consolidation_submit").addClass("disabled")
        } else{
          $("#consolidation_submit").removeClass("disabled")
        }
      })

      $(document).on("click", "#consolidated_assign_driver", function () {
        let dataid = $(this).attr("data-id");
        let dataname = $(this).attr("data-name");

        $("#hidden_id").attr('value', dataid);
        $('#assign_driver_toggle').select2().select2('val', dataname);
      })


      $(document).on("click", "#consolidated_add_payment", function () {
        let dataid = $(this).attr("data-id");
        let datainvoice = $(this).attr("data-invoice");
        let datadue = $(this).attr("data-due");

        $("#payment_action").attr('action', '/consolidated/payment/' + dataid);
        $('#invoice').attr('value', datainvoice);
        $('#payable_amount').attr('value', datadue);
        $('#paid_amount').attr('value', datadue);
      })


      // ========= list_of_payment =========== //

      $(document).on("select2:select", ".list_of_payment", function () {
        var customer_name = $("#customer_name").val()
        var shipping_type = $("#shipping_type").val()
        var base_url = window.location.origin;

        $.ajax({
          url: base_url + "/transactions/list_of_payment/ajax",
          type: "POST",
          dataType: "JSON",
          data: {customer_name, shipping_type},
          success: function (res) {
            $("#add_data").html('')

            var number = 1
            $.each(res.payment_data, function(index, value) {
              $("#add_data").append(
                '<tr>'+
                    '<td>'+ number +'</td>'+
                    '<td>'+ value.invoice +'</td>'+
                    '<td>'+ value.date +'</td>'+
                    '<td>'+ value.first_name +' '+ value.last_name +'</td>'+
                    '<td>'+ value.type +'</td>'+
                    '<td class="invosymbol">'+ value.paid_amount +'</td>'+
                '<tr>'
              )
              number++
            })
            currency()
          }
        })

      })

      // ========= pre_alert =========== //

      $(document).on("input", ".prealert_report", function () {
        var start_date = $("#start_date").val()
        var end_date = $("#end_date").val()
        var base_url = window.location.origin;

        $.ajax({
          url: base_url + "/report/pre_alert/ajax",
          type: "POST",
          dataType: "JSON",
          data: {start_date, end_date},
          success: function (res) {
            $("#report_pa").html('')
            
            if (res.pre_alert_data == "") {
              $("#report_pa").html('<h5 class=text-nowrap font-danger> data not available in table </h5>')
              
            } else {
              
              var number = 1
              $.each(res.pre_alert_data, function(index, value) {
    
                if (value.status == 'Pending') {
                  var color = 'danger'
                  var status_name = 'Pending'
                } else {
                  var color = 'success'
                  var status_name = 'Approved'
                }
    
                $("#report_pa").append(
                  '<tr>'+
                      '<td>'+ number +'</td>'+
                      '<td>'+ value.date +'</td>'+
                      '<td>'+ value.tracking +'</td>'+
                      '<td>'+ value.customers_firstname +' '+ value.customers_lastname +'</td>'+
                      '<td>'+ value.courier_companies +'</td>'+
                      '<td class="invosymbol">'+ value.purchase_price +'</td>'+
                      '<td><span class="badge badge-'+ color +'" p-2">'+ status_name +'</span></td>'+
                  '<tr>'
                )
                number++
              })
              currency()
            }

          }
        })

      })


      // ========= register_package =========== //

      $(document).on("input", ".report_package", function () {
        var start_date = $("#r_package_start_date").val()
        var end_date = $("#r_package_end_date").val()
        var base_url = window.location.origin;

        $.ajax({
          url: base_url + "/report/report_package/ajax",
          type: "POST",
          dataType: "JSON",
          data: {start_date, end_date},
          success: function (res) {
            $("#r_package_tbody").html('')
            
            if (res.pre_alert_data == "") {
              $("#r_package_tbody").html('<h5 class=text-nowrap font-danger> data not available in table </h5>')
              
            } else {
              
              var number = 1
              $.each(res.report_package_data, function(index, value) {
    
                if (value.due_amount == '0') {
                  var color = 'warning'
                  var status_name = 'Pending'
                } else {
                  var color = 'success'
                  var status_name = 'Paid'
                }

                if (value.status_name == '6') {
                  var statuscolore = 'success'
                } else {
                  var statuscolore = 'primary'
                }
    
                $("#r_package_tbody").append(
                  '<tr>'+
                      '<td>'+ number +'</td>'+
                      '<td>'+ value.invoice +'</td>'+
                      '<td>'+ value.date +'</td>'+
                      '<td>'+ value.customers_firstname +' '+ value.customers_lastname +'</td>'+
                      '<td><span class="badge badge-'+ statuscolore +'" p-2">'+ value.status_name +'</span></td>'+
                      '<td>'+ value.drivers_firstname +' '+ value.drivers_lastname +'</td>'+
                      '<td class="invosymbol">'+ value.total +'</td>'+
                      '<td><span class="badge badge-'+ color +'" p-2">'+ status_name +'</span></td>'+
                  '<tr>'
                )
                number++
              })
              currency()
            }

          }
        })

      })



      // ========= shipment =========== //

      $(document).on("input", ".shipment", function () {
        var start_date = $("#shipment_start_date").val()
        var end_date = $("#shipment_end_date").val()
        var base_url = window.location.origin;

        $.ajax({
          url: base_url + "/report/shipment/ajax",
          type: "POST",
          dataType: "JSON",
          data: {start_date, end_date},
          success: function (res) {
            $("#shipment_tbody").html('')
            
            if (res.pre_alert_data == "") {
              $("#shipment_tbody").html('<h5 class=text-nowrap font-danger> data not available in table </h5>')
              
            } else {
              
              var number = 1
              $.each(res.shipment_data, function(index, value) {
    
                if (value.due_amount == '0') {
                  var color = 'warning'
                  var status_name = 'Pending'
                } else {
                  var color = 'success'
                  var status_name = 'Paid'
                }

                if (value.delivery_status == '6') {
                  var statuscolore = 'success'
                } else if (value.delivery_status == '4') {
                  var statuscolore = 'primary'
                } else if (value.delivery_status == '3') {
                  var statuscolore = 'warning'
                } else if (value.delivery_status == '2') {
                  var statuscolore = 'danger'
                } else {
                  var statuscolore = 'info'
                }
    
                $("#shipment_tbody").append(
                  '<tr>'+
                      '<td>'+ number +'</td>'+
                      '<td>'+ value.invoice +'</td>'+
                      '<td>'+ value.date +'</td>'+
                      '<td>'+ value.customers_firstname +' '+ value.customers_lastname +'</td>'+
                      '<td>'+ value.client_firstname +' '+ value.client_lastname +'</td>'+
                      '<td>'+ value.payment_type_name +'</td>'+
                      '<td><span class="badge badge-'+ statuscolore +'" p-2">'+ value.delivery_status_name +'</span></td>'+
                      '<td class="invosymbol">'+ value.total +'</td>'+
                      '<td><span class="badge badge-'+ color +'" p-2">'+ status_name +'</span></td>'+
                  '<tr>'
                )
                number++
              })
              currency()
            }

          }
        })

      })



      // ========= pickup =========== //

      $(document).on("input", ".pickup", function () {
        var start_date = $("#pickup_start_date").val()
        var end_date = $("#pickup_end_date").val()
        var base_url = window.location.origin;

        $.ajax({
          url: base_url + "/report/pickup/ajax",
          type: "POST",
          dataType: "JSON",
          data: {start_date, end_date},
          success: function (res) {
            $("#pickup_tbody").html('')
            
            if (res.pre_alert_data == "") {
              $("#pickup_tbody").html('<h5 class=text-nowrap font-danger> data not available in table </h5>')
              
            } else {
              
              var number = 1
              $.each(res.pickup_data, function(index, value) {

                if (value.delivery_status == '6') {
                  var statuscolore = 'success'
                } else if (value.delivery_status == '8') {
                  var statuscolore = 'danger'
                } else {
                  var statuscolore = 'primary'
                }
    
                $("#pickup_tbody").append(
                  '<tr>'+
                      '<td>'+ number +'</td>'+
                      '<td>'+ value.invoice +'</td>'+
                      '<td>'+ value.date +'</td>'+
                      '<td>'+ value.customers_firstname +' '+ value.customers_lastname +'</td>'+
                      '<td>'+ value.client_firstname +' '+ value.client_lastname +'</td>'+
                      '<td><span class="badge badge-'+ statuscolore +'" p-2">'+ value.delivery_status_name +'</span></td>'+
                      '<td>'+ value.payment_type_name +'</td>'+
                  '<tr>'
                )
                number++
              })
              currency()
            }

          }
        })

      })



      // ========= consolidated =========== //

      $(document).on("input", ".consolidated", function () {
        var start_date = $("#consolidated_start_date").val()
        var end_date = $("#consolidated_end_date").val()
        var base_url = window.location.origin;

        $.ajax({
          url: base_url + "/report/consolidated/ajax",
          type: "POST",
          dataType: "JSON",
          data: {start_date, end_date},
          success: function (res) {
            $("#consolidated_tbody").html('')
            
            if (res.pre_alert_data == "") {
              $("#consolidated_tbody").html('<h5 class=text-nowrap font-danger> data not available in table </h5>')
              
            } else {
              
              var number = 1
              $.each(res.consolidated_data, function(index, value) {

                if (value.due_amount == '0') {
                  var color = 'warning'
                  var status_name = 'Pending'
                } else {
                  var color = 'success'
                  var status_name = 'Paid'
                }

                if (value.delivery_status == '6') {
                  var statuscolore = 'success'
                } else if (value.delivery_status == '8') {
                  var statuscolore = 'danger'
                } else if (value.delivery_status == '3') {
                  var statuscolore = 'warning'
                } else {
                  var statuscolore = 'info'
                }
    
                $("#consolidated_tbody").append(
                  '<tr>'+
                      '<td>'+ number +'</td>'+
                      '<td>'+ value.invoice +'</td>'+
                      '<td>'+ value.date +'</td>'+
                      '<td>'+ value.customers_firstname +' '+ value.customers_lastname +'</td>'+
                      '<td>'+ value.client_firstname +' '+ value.client_lastname +'</td>'+
                      '<td>'+ value.payment_type_name +'</td>'+
                      '<td><span class="badge badge-'+ statuscolore +'" p-2">'+ value.delivery_status_name +'</span></td>'+
                      '<td class="invosymbol">'+ value.total +'</td>'+
                      '<td><span class="badge badge-'+ color +'" p-2">'+ status_name +'</span></td>'+
                  '<tr>'
                )
                number++
              })
              currency()
            }

          }
        })

      })


      // ========== payment_type ============= //

      $(document).on("change", "#payment_type_active", function () {
        let dataid = $(this).attr("data-id");
        var checkbox_val = 0

        if(this.checked) {
          checkbox_val++
        }

        var base_url = window.location.origin;
        
        $.ajax({
          url: base_url + "/settings/payment_type_ajax",
          type: "POST",
          dataType: "JSON",
          data: {dataid, checkbox_val},
          success: function (res) {
            
          }
        })
        
      })  

      // ========== payment_methods ============= //

      $(document).on("change", "#payment_methods_active", function () {
        let dataid = $(this).attr("data-id");
        var checkbox_val = 0

        if(this.checked) {
          checkbox_val++
        }

        var base_url = window.location.origin;
        
        $.ajax({
          url: base_url + "/settings/payment_methods_ajax",
          type: "POST",
          dataType: "JSON",
          data: {dataid, checkbox_val},
          success: function (res) {
            
          }
        })
        
      })  


      // ========== status_checkbox ============= //

      $(document).on("change", "#status_checkbox", function () {
        let dataid = $(this).attr("data-id");
        var checkbox_val = 0

        if(this.checked) {
          checkbox_val++
        }

        var base_url = window.location.origin;
        
        $.ajax({
          url: base_url + "/settings/shipping_status_ajax",
          type: "POST",
          dataType: "JSON",
          data: {dataid, checkbox_val},
          success: function (res) {
            
          }
        })
        
      })  


      // ========== Shipment Tracking ========== //

      $(document).on("click", "#track_shipment", function () {
        var invoice_no = $("#invoice_no").val()
        var shipment_type = $("#shipment_type").val()
        
        if ( invoice_no == "" && shipment_type == null) {
          $("#invoice_no_error").text("Enter Invoice Number")
          $("#shipment_type_error").text("Select Shipment Type")
          
        } else if (invoice_no == "") {
          $("#invoice_no_error").text("Enter Invoice Number")
          $("#shipment_type_error").text("")
          
        } else if (shipment_type == null) {
          $("#shipment_type_error").text("Select Shipment Type")
          $("#invoice_no_error").text("")

        } else {
          $("#invoice_no_error").text("")
          $("#shipment_type_error").text("")
          $("#history_table").text("")

          var base_url = window.location.origin;
          
          $.ajax({
            url: base_url + "/tracking/ajax",
            type: "POST",
            dataType: "JSON",
            data: {invoice_no, shipment_type},
            success: function (res) {
              if(res.status === "error"){
                return toastr.error(res.message)
              }
              
              if (shipment_type == '1') {
                $("#qwe").addClass("d-none")
                $("#poi").removeClass("d-none")
                $("#mnb").removeClass("d-none")
                $("#tracking_page").css("height" , "100%")
                $("#customer_name").text(res.data[0].customer_firstname + ' ' + res.data[0].customer_lastname)
                $("#date_of_shipment").text(res.data[0].date)
                $("#total_weight").text(res.data[0].total_weight)
                $("#client_name").text(res.data[0].client_firstname + ' ' + res.data[0].client_lastname)
                
                
                res.address.forEach((address, x) => {
                  if (address == res.data[0].customer_address) {
                    $("#customer_address").text(address)
    
                    res.countries_list.forEach((countries_list) => {
                      if (countries_list.id == res.country[x]) {
                        $("#origin_country").text(countries_list.countries_name)
                      }
                    })
    
                    res.city_list.forEach((city_list) => {
                      if (city_list.id == res.city[x]) {
                        $("#origin_city").text(city_list.city_name)
                      }
                    })
    
                  }
                })
    
                $.each(res.tracking_data, function(index, value) {
                  $("#history_table").append(
                    '<div class="activity-line line-dot"></div>'+
                    '<div class="d-flex">'+                    
                      '<div class="activity-dot-primary"></div>'+
                      '<div class="flex-grow-1"><span class="f-w-600 d-block">'+ value.status_name +'</span>'+
                        '<p class="mb-0">'+ value.date +'</p>'+
                      '</div>'+
                    '</div>'
                  )
                })
                
              } else {
                $("#poi").addClass("d-none")
                $("#qwe").removeClass("d-none")
                $("#mnb").removeClass("d-none")
                $("#tracking_page").css("height" , "100%")
                $("#customer_name").text(res.data[0].customer_firstname + ' ' + res.data[0].customer_lastname)
                $("#date_of_shipment").text(res.data[0].date)
                $("#total_weight").text(res.data[0].total_weight)
                $("#client_name").text(res.data[0].client_firstname + ' ' + res.data[0].client_lastname)
                
                
                res.address.forEach((address, x) => {
                  if (address == res.data[0].customer_address) {
                    $("#customer_address").text(address)
    
                    res.countries_list.forEach((countries_list) => {
                      if (countries_list.id == res.country[x]) {
                        $("#origin_country").text(countries_list.countries_name)
                      }
                    })
    
                    res.city_list.forEach((city_list) => {
                      if (city_list.id == res.city[x]) {
                        $("#origin_city").text(city_list.city_name)
                      }
                    })
    
                  }
                })
    
                $.each(res.tracking_data, function(index, value) {
                  $("#history_table").append(
                    '<div class="activity-line line-dot"></div>'+
                    '<div class="d-flex">'+
                      '<div class="activity-dot-primary"></div>'+
                      '<div class="flex-grow-1"><span class="f-w-600 d-block">'+ value.status_name +'</span>'+
                        '<p class="mb-0">'+ value.date +'</p>'+
                      '</div>'+
                    '</div>'
                  )
                })

                res.client_address.forEach((address, x) => {
                  if (address == res.data[0].client_address) {
                    $("#destination_address").text(address)
    
                    res.countries_list.forEach((countries_list) => {
                      if (countries_list.id == res.client_country[x]) {
                        $("#destination_country").text(countries_list.countries_name)
                      }
                    })
    
                    res.city_list.forEach((city_list) => {
                      if (city_list.id == res.client_city[x]) {
                        $("#destination_city").text(city_list.city_name)
                      }
                    })
    
                  }
                })
              }
              
            }
          })
        }


      })


      // ========== all_payment pdf ============= //

      $(document).on("click", "#all_payment", function () {
        html2canvas($('.payment')[0], {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500
                    }]
                };
                pdfMake.createPdf(docDefinition).download("Payment Report.pdf");
            }
        });
      });


      // ========== report_pre_alert pdf ============= //

      $(document).on("click", "#report_pre_alert", function () {
        html2canvas($('.pre_alert_pdf')[0], {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500
                    }]
                };
                pdfMake.createPdf(docDefinition).download("Pre Alert Report.pdf");
            }
        });
      });


      // ========== report_register_packages pdf ============= //

      $(document).on("click", "#report_register_packages", function () {
        html2canvas($('.register_packages_report')[0], {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500
                    }]
                };
                pdfMake.createPdf(docDefinition).download("register packages Report.pdf");
            }
        });
      });


      // ========== report_shipment pdf ============= //

      $(document).on("click", "#report_shipment", function () {
        html2canvas($('.shipment_report')[0], {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500
                    }]
                };
                pdfMake.createPdf(docDefinition).download("Shipping Report.pdf");
            }
        });
      });


      // ========== report_pickup pdf ============= //

      $(document).on("click", "#report_pickup", function () {
        html2canvas($('.pickup_report')[0], {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500
                    }]
                };
                pdfMake.createPdf(docDefinition).download("Pickup Report.pdf");
            }
        });
      });


      // ========== report_consolidated pdf ============= //

      $(document).on("click", "#report_consolidated", function () {
        html2canvas($('.consolidated_report')[0], {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500
                    }]
                };
                pdfMake.createPdf(docDefinition).download("Consolidated Report.pdf");
            }
        });
      });


      // ============ login ============= //
      
      
      $(document).on("click", '#login_admin', function(){
          $('input[name=email]').val('admin@admin.com')
          $('input[name=password]').val('123')
          document.getElementById("login_form").submit();
        })
    
        $(document).on("click", '#login_customer', function(){
          $('input[name=email]').val('vivek@gmail.com')
          $('input[name=password]').val('123')
          document.getElementById("login_form").submit();
        })
    
        $(document).on("click", '#login_driver', function(){
          $('input[name=email]').val('ram@gmail.com')
          $('input[name=password]').val('123')
          document.getElementById("login_form").submit();
        })
    

        currency()

      $(".dropbtn").click(function(){
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
    
            openDropdown.classList.remove('show');
          }
        }
    
        var currentRow=$(this).closest(".dropdown");
        currentRow.find(".myDropdown").toggleClass("show");
    });
    
    
    window.onclick = function(event) {
      if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
    
            openDropdown.classList.remove('show');
          }
        }
      }
    }


  })


  function showPreview(event) {
    if (event.target.files.length > 0) {
          var src = URL.createObjectURL(event.target.files[0]);
          var preview = document.getElementById("file-preview");
          preview.src = src;
          preview.style.display = "block";
          // $("#hidden_image").val(1)
      }
  }

  function currency(){
    var sym = $('#rates_sym').val()
    var pls = $('#rates_pla').val()
  
     if(pls == 1){
        var users = document.getElementsByClassName('invosymbol');
        for (var i = 0; i < users.length; ++i) {
            var user = users[i];  
            user.innerHTML =  user.innerHTML+' '+ sym ;
        }
     }else{
        var users = document.getElementsByClassName('invosymbol');
        for (var i = 0; i < users.length; ++i) {
            var user = users[i];  
            user.innerHTML = sym+' ' + user.innerHTML ;
        }
     }
    
  }