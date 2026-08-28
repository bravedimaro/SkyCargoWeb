
 $(document).on('click', '#action', function(){
    var id =  $(this).attr('data-id')
    var act =  "/expense/updatecategorytype/'"+id+"'"

     $('#name').attr('value', ($(this).attr('data-name')))
     $("#editexpcattype_form").attr('action',act)

})  

// <<<<<<< Expense category update 
$(document).on('click', '#expcataction', function(){
   var baseUrl = window.location.origin;
   var storeid = $(this).attr('data-storeid');
   var cattypeid = $(this).attr('data-exp_cat_type_id')
         $.ajax({
            type:'get',
            url: baseUrl+"/expense/cattypelist/"+storeid,
            dataType:'json',
            success:function(res){
               $('#cttyid').html('')
               $.each(res.data,function(index, value){
                     $('#cttyid').append('<option value="'+value.id+'">'+value.type_name+'</option>')
                     $('.default-select').selectpicker('refresh');
               })
               // $('#cttyid').val(cattypeid);
               $('select[name=type_id]').val(cattypeid);
               $('.default-select').selectpicker('refresh');
            }
         }) 
         
         
   var id =  $(this).attr('data-id')
   var act =  "/expense/updateexpcat/'"+id+"'"
   // $('#cttyid').val(cattypeid);
   // $('.default-select').selectpicker('refresh');
   $('#name').attr('value', ($(this).attr('data-catname')))
   $("#updateexpcat_form").attr('action',act)
   
}) 

// expences add by master admin
$('body').on("change", "#expense_add_admin", function () {
 
   var baseUrl = window.location.origin;
   var id = this.value
         $.ajax({
            type:'get',
            url: baseUrl+"/expense/expcatlist/"+id,
            dataType:'json',
            success:function(res){
               $('#exp_add_category').html('<option value selected disabled>Select One</option>')
               
               $.each(res.data,function(index, value){
                     $('#exp_add_category').append('<option value='+value.id+'>'+value.cat_name+'</option>')
               })

               $('#exp_add_payment').html('<option value selected disabled>Select One</option>')
               $.each(res.acountlist,function(index, value){
                  $('#exp_add_payment').append('<option value='+value.id+'>'+value.ac_name+'</option>')
               })

               $('.default-select').selectpicker('refresh');


            }
         })     
})

// Expence tax includ or not
$('#myexpen input[type=radio]').click(function(){
   
   if(this.value == "no"){
      $('#tex_perce').addClass('d-none')
      $('#tex_perce').prop('required',false)
   }else{
      $('#tex_perce').removeClass('d-none')
      $('#tex_perce').prop('required',true)
   }
})

// <<<<< expence update model open >>>>>
$(document).on('click', '#expaction', function(){
   var baseUrl = window.location.origin;
   var storeid = $(this).attr('data-storeid');
   var cat = $(this).attr('data-category')
   var payment = $(this).attr('data-payment')
         $.ajax({
            type:'get',
            url: baseUrl+"/expense/expcatlist/"+storeid,
            dataType:'json',
            success:function(res){
               $('#category_update').html('')
               $.each(res.data,function(index, value){
                  $('#category_update').append('<option value='+value.id+'>'+value.cat_name+'</option>')
                     $('.default-select').selectpicker('refresh');
               })

               $('#payment_update').html(' ')
               $.each(res.acountlist,function(index, value){
                  $('#payment_update').append('<option value='+value.id+'>'+value.ac_name+'</option>')
               })
               // $('#cttyid').val(cattypeid);
               $('select[name=expense_category]').val(cat);
               $('select[name=payment_update]').val(payment);
               $('.default-select').selectpicker('refresh');
            }
         }) 


   var id =  $(this).attr('data-id')
   var act =  "/expense/updateexp/'"+id+"'"
   var pay = $(this).attr('data-payment')
   var tax = $(this).attr('data-tex')
   const amount = Number($(this).attr('data-amount'))
   var date = ($(this).attr('data-date'))
   if(tax == "yes"){
      $('#yes_taxincluded_update').prop('checked', true)
      $('#tex_perce_update').removeClass('d-none')
      $('#tex_perce_update').prop('required',true)
   }else{
      $('#no_tax_included_update').prop('checked', true)
      $('#tex_perce_update').addClass('d-none')
      $('#tex_perce_update').prop('required',false)
   }
   $('#category_update').val(cat);
   $('.default-select').selectpicker('refresh');
   $('#amount_update').val(amount)
   $('#tex_perce_update').val(Number($(this).attr('data-texpercent')))
   
   $('#notes_update').attr('value', ($(this).attr('data-toward')))
   $("#expupdat_form").attr('action',act)
   $('#date_update').val(new Date(date).toLocaleDateString('en-CA'))
})

// Expence update tax includ or not
$('#expupdat_form input[type=radio]').click(function(){
   
   if(this.value == "no"){
      $('#tex_perce_update').addClass('d-none')
      $('#tex_perce_update').prop('required',false)
      $('#tex_perce_update').val(Number(0))
   }else{
      $('#tex_perce_update').removeClass('d-none')
      $('#tex_perce_update').prop('required',true)
      
   }
})

// update Roll
$(document).on('click', '#updateroll', function(){
  
   var id =  $(this).attr('data-id')
   var baseUrl = window.location.origin;
   var act =  "/tool/updateroll/"+id 
  
   $.ajax({
      type:'get',
      url: baseUrl+"/tool/rolldetails/"+id,
      dataType:'json',
      success:function({rolldata}){
         $('#name_update').attr('value', rolldata.roll)
         $("#updateroll_form").attr('action',act)
        
         $('#update_orders_read').attr('checked', rolldata.orders.includes('read'))
         $('#update_orders_write').attr('checked', rolldata.orders.includes('write') )
         $('#update_orders_edit').attr('checked', rolldata.orders.includes('edit'))
         $('#update_orders_delete').attr('checked', rolldata.orders.includes('delete'))

         $('#update_expense_read').attr('checked', rolldata.expense.includes('read') )
         $('#update_expense_write').attr('checked', rolldata.expense.includes('write') )
         $('#update_expense_edit').attr('checked', rolldata.expense.includes('edit') )
         $('#update_expense_delete').attr('checked', rolldata.expense.includes('delete') )

         $('#update_service_read').attr('checked', rolldata.service.includes('read') )
         $('#update_service_write').attr('checked', rolldata.service.includes('write') )
         $('#update_service_edit').attr('checked', rolldata.service.includes('edit') )
         $('#update_service_delete').attr('checked', rolldata.service.includes('delete') )

         $('#update_reports_read').attr('checked', rolldata.reports.includes('read') )
         $('#update_reports_write').attr('checked', rolldata.reports.includes('write') )
         $('#update_reports_edit').attr('checked', rolldata.reports.includes('edit'))
         $('#update_reports_delete').attr('checked', rolldata.reports.includes('delete') )

         $('#update_tools_read').attr('checked', rolldata.tools.includes('read'))
         $('#update_tools_write').attr('checked', rolldata.tools.includes('write') )
         $('#update_tools_edit').attr('checked', rolldata.tools.includes('edit'))
         $('#update_tools_delete').attr('checked', rolldata.tools.includes('delete'))

         $('#update_mail_read').attr('checked', rolldata.mail.includes('read') )
         $('#update_mail_write').attr('checked', rolldata.mail.includes('write') )
         $('#update_mail_edit').attr('checked', rolldata.mail.includes('edit') )
         $('#update_mail_delete').attr('checked', rolldata.mail.includes('delete') )

         $('#update_master_read').attr('checked', rolldata.master.includes('read') )
         $('#update_master_write').attr('checked', rolldata.master.includes('write') )
         $('#update_master_edit').attr('checked', rolldata.master.includes('edit') )
         $('#update_master_delete').attr('checked', rolldata.master.includes('delete') )

         $('#update_sms_read').attr('checked', rolldata.sms.includes('read') )
         $('#update_sms_write').attr('checked', rolldata.sms.includes('write') )
         $('#update_sms_edit').attr('checked', rolldata.sms.includes('edit') )
         $('#update_sms_delete').attr('checked', rolldata.sms.includes('delete') )
         
         $('#update_staff_read').attr('checked', rolldata.staff.includes('read') )
         $('#update_staff_write').attr('checked', rolldata.staff.includes('write') )
         $('#update_staff_edit').attr('checked', rolldata.staff.includes('edit') )
         $('#update_staff_delete').attr('checked', rolldata.staff.includes('delete') )

         $('#update_pos_read').attr('checked', rolldata.pos.includes('read') )
         $('#update_pos_write').attr('checked', rolldata.pos.includes('write') )
         $('#update_pos_edit').attr('checked', rolldata.pos.includes('edit') )
         $('#update_pos_delete').attr('checked', rolldata.pos.includes('delete') )

         $('#update_roll_read').attr('checked', rolldata.rollaccess.includes('read') )
         $('#update_roll_write').attr('checked', rolldata.rollaccess.includes('write') )
         $('#update_roll_edit').attr('checked', rolldata.rollaccess.includes('edit') )
         $('#update_roll_delete').attr('checked', rolldata.rollaccess.includes('delete') )

          $('#update_coupon_read').attr('checked', rolldata.coupon.includes('read') )
         $('#update_coupon_write').attr('checked', rolldata.coupon.includes('write') )
         $('#update_coupon_edit').attr('checked', rolldata.coupon.includes('edit') )
         $('#update_coupon_delete').attr('checked', rolldata.coupon.includes('delete') )

          $('#update_account_read').attr('checked', rolldata.account.includes('read') )
         $('#update_account_write').attr('checked', rolldata.account.includes('write') )
         $('#update_account_edit').attr('checked', rolldata.account.includes('edit') )
         $('#update_account_delete').attr('checked', rolldata.account.includes('delete') )


         $('#rollactive').attr('checked', rolldata.delet_flage == 0 ? true : false )

         
         
      }
  })
   
}) 

// <<<<<< update customer >>>>>>>>>>
$(document).on('click', '#action', function(){
   var id =  $(this).attr('data-id')
   var act =  "/coustomer/update/'"+id+"'"
    var approved = $(this).attr('data-approved');
    var active = $(this).attr('data-active')
    $('#name').attr('value', ($(this).attr('data-name')))
    $('#number').attr('value', ($(this).attr('data-number')))
    $('#email').attr('value', ($(this).attr('data-email')))
    $('#address').attr('value', ($(this).attr('data-addresh')))
    $('#tax').attr('value', ($(this).attr('data-tax')))
    $("#coustomer_form").attr('action',act)
   if(approved == 1){
    $('#Approved').attr('checked','true')
   }
   if(active == 0){
    $('#active').attr('checked','true')
   }
   $('#customroll').val( ($(this).attr('data-roll')))
})

// update service Type
$(document).on('click', '#serviceType', function(){
   var id =  $(this).attr('data-id')
   var act =  "/services/updateservicestype/"+id+""
   var tax = $(this).attr('data-status')

   $("#updateservicetype_form").attr('action',act)
   $('#servicetype_name_update').attr('value', ($(this).attr('data-serviceType')))
   if(tax == 0){
      $('#active_update').prop('checked', true)
   }
}) 

// add services service type dropdpwn
            // ======= Dynamic field ========== //
            var service_type_id = 0
            var service_price_id = 0
            $('body').on("click", "#add_service", function () {
               service_type_id++;
               service_price_id++;
               var baseUrl = window.location.origin;
               var id = $('#add_servie_storelist').val()
               
               $('#servalid').get(0).value++ 
                     $.ajax({
                        type:'get',
                        url: baseUrl+"/services/typelist/"+id,
                        dataType:'json',
                        success:function(res){
                           $("#tblPage").append('<tr>' +
                           '<td> <div class="form-group"><select class="default-select form-control  wide " name="service_type" id="service_type' + service_type_id + '">'+
                                    '</select> </div></td>' +

                           '<td> <div class="form-group"> <input type="flot" name="service_price" class="total form-control" id="service_price' + service_price_id + '" value="100"></div> </td>' +

                           '<td><a id="remove"><i class="fa fa-times"></i></a></td>' +
                           
                           '</tr>');
                           $.each(res.data,function(index, value){
                                 $('#service_type' + service_type_id + '').append('<option value='+value.id+'>'+value.services_type+'</option>')
                           })
                           $('.default-select').selectpicker('refresh');
                        }
                     })     
            })
            $('body').on("click", "#remove", function () {
               $('#servalid').get(0).value--
               $(this).parents('tr').remove();
            })
            // ======= Image ======== //

            function showPreview(event) {
               if (event.target.files.length > 0) {
                     var src = URL.createObjectURL(event.target.files[0]);
                     var preview = document.getElementById("file-preview");
                     preview.src = src;
                     preview.style.display = "block";
               }
            }

            function showfavicon(event) {
               if (event.target.files.length > 0) {
                     var src = URL.createObjectURL(event.target.files[0]);
                     var preview = document.getElementById("file-favicon");
                     preview.src = src;
                     preview.style.display = "block";
               }
            }

            $('body').on("change", "#add_servie_storelist", function () {
               $("#tblPage").html('');
               $('#servalid').val(0)
            })
// Add And Update Service Validation
            $('body').on("click", "#add", function(){
               if($('#tblPage tr').length === 0){
                  toastr.error('Please Add 1 Service Type',{
                     timeOut: 500000000,
                     closeButton: !0,
                     debug: !1,
                     newestOnTop: !0,
                     progressBar: !0,
                     positionClass: "toast-top-right",
                     preventDuplicates: !0,
                     onclick: null,
                     showDuration: "300",
                     hideDuration: "1000",
                     extendedTimeOut: "1000",
                     showEasing: "swing",
                     hideEasing: "linear",
                     showMethod: "fadeIn",
                     hideMethod: "fadeOut",
                     tapToDismiss: !1
                 })
                  return false
               }
            })


// >>>>update addons
   $(document).on('click', '#services_addons_update', function(){
      var id =  $(this).attr('data-id')
      var act =  "/services/updateaddon/"+id+""
      var status = $(this).attr('data-status')

      $("#updateaddon_form").attr('action',act)
      $('#active_addon_update').prop('checked', status == 0 )
      $('#addon_name_update').attr('value', ($(this).attr('data-addon')))
      $('#addon_price_update').attr('value', Number($(this).attr('data-price')))
   }) 


   //  <<<<<<<  update staff >>>>>>
   $(document).on('click', '#update_staff', function(){
      var id =  $(this).attr('data-id')
      var act =  "/tool/updatestaff/"+id
      var contect = Number($(this).attr('data-number'))
      var status =  $(this).attr('data-approved');
      var roll = $(this).attr('data-roll_id')

      var baseUrl = window.location.origin;
      $.ajax({
         type:'get',
         url: baseUrl+"/tool/rolllist/"+id,
         dataType:'json',
         success:function(res){
            $('#update_staff_roll1').html('')
            $.each(res.rolllist,function(index, value){
                  $('#update_staff_roll1').append('<option value="'+value.id+'">'+value.roll+'</option>')    
            })
            $('select[name=roll_list_update]').val(roll)
            $('.default-select').selectpicker('refresh');
         }
      })

      $("#update_staff_form").attr('action',act)
      $('#name_update').attr('value', ($(this).attr('data-name')))
      $('#number_update').attr('value', contect)
      $('#email_update').attr('value', $(this).attr('data-email'))
      $('#username_update').attr('value', $(this).attr('data-username'))
      $('#password_update').attr('value', $(this).attr('data-password'))
      
      $('#active_update').prop('checked', status == 1)
      $('.default-select').selectpicker('refresh');
      
   }) 

   //  <<<<<<<  update account >>>>>>
   $(document).on('click', '#update_Account', function(){
      var id =  $(this).attr('data-id')
      var act =  "/account/updateaccount/"+id
      var number = Number($(this).attr('data-number'))

      $("#account_form").attr('action',act)
      $('#ac_name_update').attr('value', ($(this).attr('data-titel')))
      $('#ac_number_update').attr('value', number)
      $('#ac_description_update').attr('value', ($(this).attr('data-descrip')))
      
   }) 

   //<<<<<<<< gen coupon code >>>>>>>
   function makeid(length) {
      var result = '';
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
  }

  $(document).on('click', '#gen_code', function () {
      $('#coupon_code').val(makeid(6));
      return false;
  });


//   <<<<<<<<<<< update coupon >>>>>>>>>>>>>>>>
$(document).on('click', '#coupons_update', function(){
   var id =  $(this).attr('data-id')
   var act =  "/coupon/update/"+id
   var storelist = ($(this).attr('data-storelist'));
   var storelistarray = storelist.split(',')

   $("#coupon_update_form").attr('action',act)
   $('#coupon_titel_update').attr('value', ($(this).attr('data-titel')))
   $('#coupon_type_update').val($(this).attr('data-type'))
   $('#coupon_limit_update').attr('value', $(this).attr('data-limit'))
   $('#coupon_start_date_update').val(new Date($(this).attr('data-start')).toLocaleDateString('en-CA'))
   $('#coupon_end_date_update').val(new Date($(this).attr('data-end')).toLocaleDateString('en-CA'))
   $('#coupon_purchase_update').attr('value', $(this).attr('data-minorder'))
   $('#coupon_discount_amount_update').attr('value', $(this).attr('data-discount'))
 
  $('select[name=storelist]').val(storelistarray);
//    $('.default-select').selectpicker('refresh');

//  $('#coupon_storlist_update').val(storelistarray)
 $('.default-select').selectpicker('refresh');
   $('#coupon_status_update').prop('checked', $(this).attr('data-status') == 0) 
}) 


// expences category add by master admin
$('body').on("change", "#expense_cat_add_admin", function () {
 
   var baseUrl = window.location.origin;
   var id = this.value
         $.ajax({
            type:'get',
            url: baseUrl+"/expense/cattypelist/"+id,
            dataType:'json',
            success:function(res){
               $('#type').html('')
               $.each(res.data,function(index, value){
                     $('#type').append('<option value='+value.id+'>'+value.type_name+'</option>')
               })
               $('.default-select').selectpicker('refresh');
            }
         })     
})


//  serach service in pos page

   $(document).on("keyup","#service_pos_search",  function () {
      let cards = document.querySelectorAll('.services')
      let search_query = this.value;
      for (var i = 0; i < cards.length; i++) {
         if(cards[i].innerText.toLowerCase().includes(search_query.toLowerCase())) {
            cards[i].classList.remove("is-hidden");
         }else {
            cards[i].classList.add("is-hidden");
          }
      }
   });


// POS customer list

   // let search_query = this.value;
   // var storeid = $('#pos_store_id').val()
   // var dataArray = $("#single-select").select2('data');
   // var baseUrl = window.location.origin;
   // $.ajax({
   //    type:'get',
   //    url: baseUrl+"/admin/customerlist/"+storeid,
   //    dataType:'json',
   //    success:function(res){
   //       $('#single-select').html('<option value="0" selected disabled>Select Customer </option>')
   //       $.each(res.customerList,function(index, value){
   //          $('#single-select').append('<option value='+ value.id +'>'+value.name+'</option>') 
   //       })  
   //    }
   // }) 


// POS  on store change new customer list addon and service
   $('body').on("change", "#pos_store_id",async function () {

     

     await clearcart();

      // new customer list
      var storeid = $('#pos_store_id').val()
      var baseUrl = window.location.origin;
     await $.ajax({
         type:'get',
         url: baseUrl+"/admin/customerlist/"+storeid,
         dataType:'json',
         success:function(res){
           
            if(res.customerList.length < 1){
               $('#single-select').html('<option value="0" selected disabled >No Any Customer Register Yet</option>')
            }else{
               $('#single-select').html('<option value="0" selected disabled >Select Customer </option>')
            }
            $.each(res.customerList,function(index, value){
               $('#single-select').append('<option value='+ value.id +'>'+value.name+'</option>') 
            })  
         }
      })

      //  new service list
     await $.ajax({
         type:'get',
         url: baseUrl+"/admin/servicelist/"+storeid,
         dataType:'json',
         success:function(res){
            $('#pos_service').html('')
            if(res.service_list.length < 1){
               $('#pos_service').html('<div class="p-2 center"><div class="card"><div class="card-body p-2 "> <h3 class="text-center text-danger">Not listed any services yet</h3> </div></div></div>')
            }
            $.each(res.service_list,function(index, value){
               $('#pos_service').append('<div class="col-md-2 col-4 p-2 services">'+
                                             '<div class="card pos_border">'+
                                               '<div class="card-body p-2 ">'+
                                                   '<div class="new-arrival-product text-center">'+
                                                     ' <a href="#" data-bs-toggle="modal" data-bs-target="#service_type" id="POS_service" data-id="'+ value.id +'">'+
                                                         '<div class="new-arrivals-img-contnent mb-2 p-0">'+
                                                            '<img class="img-fluid" width="50px" height="50px" src="../../uploads/'+value.image +'" alt="">'+
                                                         '</div>'+
                                                         
                                                         '<h6>'+value.name +'</h6>'+
                                                      '</a>'+
                                                  ' </div>'+
                                                '</div>'+
                                             '</div>'+
                                          '</div>') 
            })  
         }
      })
      
      // new addon list and store data in cart list
     await $.ajax({
         type:'get',
         url: baseUrl+"/admin/addonlist/"+storeid,
         dataType:'json',
         success:function(res){
            $('#POS_addons').html('')
            $('#POS_tax_percent').html('<p class="mb-0 mx-2 " id="POS_tax_percent"><small> Tax ('+res.cart.tax+' %) : </small></p>')
            
            if(res.addon_list.length < 1){
               $('#POS_addons').html('<div class="p-2 center"><div class="card"><div class="card-body p-2 "> <h3 class="text-center text-danger">No addon List Found</h3> </div></div></div>')
            }
            $.each(res.addon_list,function(index, value){
               $('#POS_addons').append(' <div class="col-6 d-flex mb-3">'+
                                             '<div class="mx-3">'+
                                                '<input class="form-check-input mt-3" type="checkbox"'+
                                                   'id="update_customer_read" name="addon" value="'+value.id+'">'+
                                            ' </div>'+
                                             '<div class="d-flex flex-column justify-content-between">'+
                                                '<h5>'+ value.addon +'</h5>'+
                                                '<h6>$ '+value.price +'</h6>'+
                                             '</div>'+
                                       '</div>') 
            })
           
         } 
      })
      
      
   })

// customer change and select save customer in cart

   $('body').on("change", "#single-select", async function () {
      // await clearcart();
      
      var id = this.value
      var baseUrl = window.location.origin;
      $.ajax({
         type:'get',
         url: baseUrl+"/admin/newcustomerid/"+id,
         dataType:'json',
         success:function(res){
           
         }
      })
   })

// POS service click open service type model
$(document).on("click","#POS_service",  function () {
   let id =  $(this).attr('data-id')
   var baseUrl = window.location.origin;
   $.ajax({
      type:'get',
      url: baseUrl+"/admin/getservicetype/"+id,
      dataType:'json',
      success:function(res){
        
         $('#pos_servicetypeselect').html('')
         $('#POS_serviceid1').attr('value', res.serviceid)
         $.each(res.data,function(index, value){
            
            $('#pos_servicetypeselect').append('<div class="form-check"><label>'+value.servicetype+'</label><input class="form-check-input" type="radio" name="servicetype" value="'+ value.id+','+value.price +','+value.servicetype+'" required></div>') 

         })
      }
   }) 
})

// Add Service to POS cart
$(document).ready(function(){
   var baseUrl = window.location.origin;
   
   $("#add_service_pos_cart_submit").click(function(e){
      e.preventDefault();
      $.ajax({
         type: 'POST',
         url:  baseUrl+"/admin/addservicelist",
         data: $('#add_service_pos_cart').serialize(), 
         success: function(res) {
            $('#service_type').modal('hide');
            $('#POS_gross_total').html(res.cart.gross_total.toFixed(2))
            $('#POS_sub_total').html(res.cart.sub_total.toFixed(2))
            $('#POS_addon_total').html(res.cart.addon_price.toFixed(2))
            $('#POS_coupon_total').html(res.cart.coupon_discount.toFixed(2))
            $('#POS_tax_total').html(res.cart.tax_amount.toFixed(2))


          


            $('#POS_service_added_list').html(' ')
            $.each(res.cartservice, function(index, value){
               $('#POS_service_added_list').append('<tr>'+
                                                         '<td>'+
                                                            '<h5 class="mb-0"> '+value.service_name +'</h5>'+
                                                            '<span class="mb-0 fs-6">['+value.service_type_name +']</span>'+
                                                         '</td>'+
                                                         '<td>'+
                                                            '<input type="color" class="p-2" value="'+ value.service_color +'" id="POS_service_color"  data-id="'+ value.id +'">'+
                                                         '</td>'+
                                                         '<td>'+
                                                            '<input type="number" class="form-control h-25 text-center px-2"'+
                                                            ' value="'+ value.service_type_price+'" name="service_type_price" id="POSservice_type_price" data-id="'+ value.id +'">'+
                                                         '</td>'+
                                                         '<td>'+
                                                            '<input type="number"'+
                                                              ' class="form-control h-25 text-center px-2" id="POSservice_type_quntity" value="'+ value.service_quntity +'" min="1" data-id="'+ value.id +'">'+
                                                         '</td>'+
                                                         '<td>'+
                                                            '<a class="btn btn-sm" id="remove_service_list" data-id="'+ value.id +'"><i class="fa fa-trash  text-danger"></i></a>'+
                                                         '</td>'+
                                                   '</tr> ')
                  

            })
            if(res.loginas == 0){
               $('input[name=service_type_price]').prop('readonly', true)
            }

            poscurrency()
         },
         
      });
      })
});


// POS service remove click 
$(document).on("click","#remove_service_list",  function () {
   let id =  $(this).attr('data-id')
   var baseUrl = window.location.origin;
   $.ajax({
      type:'get',
      url: baseUrl+"/admin/removeservicelist/"+id,
      dataType:'json',
      success:function(res){
         
         $('#POS_gross_total').html(res.cart.gross_total.toFixed(2))
         $('#POS_sub_total').html(res.cart.sub_total.toFixed(2))
         $('#POS_addon_total').html(res.cart.addon_price.toFixed(2))
         $('#POS_coupon_total').html(res.cart.coupon_discount.toFixed(2))
         $('#POS_tax_total').html(res.cart.tax_amount.toFixed(2))
            $('#POS_service_added_list').html(' ')
            $.each(res.cartservice, function(index, value){
               $('#POS_service_added_list').append('<tr>'+
                                                         '<td>'+
                                                            '<h5 class="mb-0"> '+value.service_name +'</h5>'+
                                                            '<span class="mb-0 fs-6">['+value.service_type_name +']</span>'+
                                                         '</td>'+
                                                         '<td>'+
                                                            '<input type="color" class="p-2" value="'+ value.service_color +'" id="POS_service_color"  data-id="'+ value.id +'">'+
                                                         '</td>'+
                                                         '<td>'+
                                                            '<input type="number" class="form-control h-25 text-center px-2"'+
                                                            ' value="'+ value.service_type_price+'" name="service_type_price" id="POSservice_type_price" data-id="'+ value.id +'">'+
                                                         '</td>'+
                                                         '<td>'+
                                                            '<input type="number"'+
                                                              ' class="form-control h-25 text-center px-2" id="POSservice_type_quntity" value="'+ value.service_quntity +'" min="1" data-id="'+ value.id +'">'+
                                                         '</td>'+
                                                         '<td>'+
                                                            '<a class="btn btn-sm" id="remove_service_list" data-id="'+ value.id +'"><i class="fa fa-trash  text-danger"></i></a>'+
                                                         '</td>'+
                                                   '</tr> ')

            })
            if(res.loginas == 0){
            $('input[name=service_type_price]').prop('readonly', true)
            }
            poscurrency()
      }
   }) 
})

// POS service Colour change
$(document).on("change","#POS_service_color",  function () {
   let id =  $(this).attr('data-id')
   let color = $(this).val()
   var baseUrl = window.location.origin;
   $.ajax({
      type:'post',
      url: baseUrl+"/admin/color",
      data:{id:id,color:color},
      dataType:'json',
      success:function(res){
         
      }
   }) 
})


// POS Date change
$(document).on("change","#POS_order_",  function () {
 
   let date = $(this).val()
   var baseUrl = window.location.origin;
   $.ajax({
      type:'post',
      url: baseUrl+"/admin/date",
      data:{date},
      dataType:'json',
      success:function(res){
         
      }
   }) 
})



// POS clear cart
$(document).on("click","#POS_clear",  function () {
   clearcart();
})

async function clearcart(){
   var baseUrl = window.location.origin;
   $.ajax({
      type:'get',
      url: baseUrl+"/admin/clearcart",
      dataType:'json',
      success:function(res){
         $('#POS_gross_total').html( res.cart.gross_total.toFixed(2))
            $('#POS_sub_total').html( res.cart.sub_total.toFixed(2))
            $('#POS_addon_total').html(res.cart.addon_price.toFixed(2))
            $('#POS_coupon_total').html(res.cart.coupon_discount.toFixed(2))
            $('#POS_tax_total').html(res.cart.tax_amount.toFixed(2))
         $('#POS_service_added_list').html(' ')
         $('input[name=addon]').prop('checked', false)
         poscurrency()
      }
   }) 
}


// POS service amount change in cart
$(document).on("change","#POSservice_type_price",  function () {
   var baseUrl = window.location.origin;
   var price = $(this).val();
   var id =  $(this).attr('data-id')
  
   $.ajax({
      type:'post',
      url: baseUrl+"/admin/changeamount",
      data:{id:id,price:price},
      dataType:'json',
      success:function(res){
         
            $('#POS_gross_total').html(res.cart.gross_total.toFixed(2))
            $('#POS_sub_total').html( res.cart.sub_total.toFixed(2))
            $('#POS_addon_total').html( res.cart.addon_price.toFixed(2))
            $('#POS_coupon_total').html( res.cart.coupon_discount.toFixed(2))
            $('#POS_tax_total').html( res.cart.tax_amount.toFixed(2))
         $('#POS_service_added_list').html(' ')
         $.each(res.cartservice, function(index, value){
            $('#POS_service_added_list').append('<tr>'+
                                                      '<td>'+
                                                         '<h5 class="mb-0"> '+value.service_name +'</h5>'+
                                                         '<span class="mb-0 fs-6">['+value.service_type_name +']</span>'+
                                                      '</td>'+
                                                      '<td>'+
                                                         '<input type="color" class="p-2" value="'+ value.service_color +'" id="POS_service_color"  data-id="'+ value.id +'">'+
                                                      '</td>'+
                                                      '<td>'+
                                                         '<input type="number" class="form-control h-25 text-center px-2"'+
                                                         ' value="'+ value.service_type_price+'" name="service_type_price" id="POSservice_type_price" data-id="'+ value.id +'">'+
                                                      '</td>'+
                                                      '<td>'+
                                                         '<input type="number"'+
                                                           ' class="form-control h-25 text-center px-2" id="POSservice_type_quntity" value="'+ value.service_quntity +'" min="1" data-id="'+ value.id +'">'+
                                                      '</td>'+
                                                      '<td>'+
                                                         '<a class="btn btn-sm" id="remove_service_list" data-id="'+ value.id +'"><i class="fa fa-trash  text-danger"></i></a>'+
                                                      '</td>'+
                                                '</tr> ')

         })
         if(res.loginas == 0){
         $('input[name=service_type_price]').prop('readonly', true)
         }
         poscurrency()
      }
   })  
})


// POS service amount change in cart
$(document).on("change","#POSservice_type_quntity",  function () {
   var baseUrl = window.location.origin;
   var qty = $(this).val();
   var id =  $(this).attr('data-id')
 
   $.ajax({
      type:'post',
      url: baseUrl+"/admin/changequntity",
      data:{id:id,qty:qty},
      dataType:'json',
      success:function(res){
         
         $('#POS_gross_total').html(res.cart.gross_total.toFixed(2))
            $('#POS_sub_total').html(res.cart.sub_total.toFixed(2))
            $('#POS_addon_total').html(res.cart.addon_price.toFixed(2))
            $('#POS_coupon_total').html( res.cart.coupon_discount.toFixed(2))
            $('#POS_tax_total').html(res.cart.tax_amount.toFixed(2))
         $('#POS_service_added_list').html(' ')
         $.each(res.cartservice, function(index, value){
            $('#POS_service_added_list').append('<tr>'+
                                                      '<td>'+
                                                         '<h5 class="mb-0"> '+value.service_name +'</h5>'+
                                                         '<span class="mb-0 fs-6">['+value.service_type_name +']</span>'+
                                                      '</td>'+
                                                      '<td>'+
                                                         '<input type="color" class="p-2" value="'+ value.service_color +'" id="POS_service_color"  data-id="'+ value.id +'">'+
                                                      '</td>'+
                                                      '<td>'+
                                                         '<input type="number" class="form-control h-25 text-center px-2"'+
                                                         ' value="'+ value.service_type_price+'" name="service_type_price" id="POSservice_type_price" data-id="'+ value.id +'">'+
                                                      '</td>'+
                                                      '<td>'+
                                                         '<input type="number"'+
                                                           ' class="form-control h-25 text-center px-2" id="POSservice_type_quntity" value="'+ value.service_quntity +'" min="1" data-id="'+ value.id +'">'+
                                                      '</td>'+
                                                      '<td>'+
                                                         '<a class="btn btn-sm" id="remove_service_list" data-id="'+ value.id +'"><i class="fa fa-trash  text-danger"></i></a>'+
                                                      '</td>'+
                                                '</tr> ')

         })
         if(res.loginas == 0){
         $('input[name=service_type_price]').prop('readonly', true)
         }
         poscurrency()
      }
   })  
})


// Add Addon's to POS cart
$(document).ready(function(){
   var baseUrl = window.location.origin;
   
   $("#add_addons_pos_cart_submit").click(function(e){
      e.preventDefault();
      $.ajax({
         type: 'POST',
         url:  baseUrl+"/admin/addonsadd", 
         data: $('#add_addons_pos_cart').serialize(), 
         success: function(res) {
            $('#addons').modal('hide');
            $('#POS_gross_total').html(res.cart.gross_total.toFixed(2))
            $('#POS_sub_total').html(res.cart.sub_total.toFixed(2))
            $('#POS_addon_total').html(res.cart.addon_price.toFixed(2))
            $('#POS_coupon_total').html(res.cart.coupon_discount.toFixed(2))
            $('#POS_tax_total').html(res.cart.tax_amount.toFixed(2))
            poscurrency()
         },
        
      });
      })
});


// open coupon model
$(document).on("click", '#POS_coupon_model_show',function(){
   var customer = $('#single-select').val()
   var baseUrl = window.location.origin;
   if(customer){
      $.ajax({
         type: 'GET',
         url:  baseUrl+"/admin/couponlist/"+customer, 
         dataType:'json',
         success: function(res) {
            console.log(res.couponlist);
            $('#coupon_area').html('');
            if(res.couponlist.length < 1){
               $('#coupon_search').html('');
               $('#coupon_area').html('<div class="p-2 center"><div class="card"><div class="card-body p-2 "> <h3 class="text-center text-danger">No Coupon List Found</h3> </div></div></div>')
            }
            $.each(res.couponlist, function(index,value){
            console.log(value);
               $('#coupon_area').append('<div class="card">'+
                                             '<div class="card-body p-0">'+
                                                '<div class="col-12 mb-1  p-2">'+
                                                   '<div class="d-flex justify-content-between">'+
                                                         '<h5> '+ value.titel +' </h5>'+
                                                         '<h5> Coupon code : '+ value.code +' </h5>'+
                                                   '</div>'+
                                                   '<div class="d-flex justify-content-between">'+
                                                         '<span>Discount : <strong class="couponsymbol"> '+ value.discount+'</strong> </span>'+
                                                         '<span>Min. Purchase Amount : <strong class="couponsymbol"> '+ value.min_purchase+' </strong></span>'+
                                                   '</div>'+
                                                   '<div class="d-flex justify-content-end mb-0">'+
                                                         '<button type="button" class="btn btn-xxs btn-whatsapp" id="POS_apply_coupon" data-id="'+ value.id +'" '+
                                                         ( res.cart.sub_total + res.cart.addon_price < value.min_purchase || res.cart.coupon_id == value.id ? 'disabled' : '') +
                                                         '   >Apply '+
                                                         '<span class="btn-icon-end"><i class="fas fa-save"></i></span>'+
                                                         '</button>'+
                                                   '</div>'+
                                                   (res.cart.coupon_id == value.id ? '<div class="d-flex justify-content-between"><span class="text-secondary"> This Coupon Currently Applied </span></div>':'')+
                                                '</div>'+
                                             '</div>'+
                                       '</div>');
            })
            couponcurrency();
            $('#POS_coupon_model').modal('show');
         },
        
      });
     
   }else{
     toastr.warning('Select Customer First ')
   }

})

// apply coupon
$(document).on('click',"#POS_apply_coupon", function(){
   var couponid = $(this).attr('data-id')
   var baseUrl = window.location.origin;
   $.ajax({
      type: 'GET',
      url:  baseUrl+"/admin/couponadd/"+couponid, 
      dataType:'json',
      success: function(res) {
         $('#POS_coupon_model').modal('hide');
         $('#POS_gross_total').html(res.cart.gross_total.toFixed(2))
         $('#POS_sub_total').html(res.cart.sub_total.toFixed(2))
         $('#POS_addon_total').html(res.cart.addon_price.toFixed(2))
         $('#POS_coupon_total').html(res.cart.coupon_discount.toFixed(2))
         $('#POS_tax_total').html(res.cart.tax_amount.toFixed(2))

         poscurrency()
      }

   })
})

//apply coupon by enter manual coupon code
$(document).on('click',"#POS_coupon_code", function(){
   var code = $('input[name=coupon_code]').val()
   if(code.length !== 6){
      toastr.warning('Please Enter Valid Coupon Code')
   }else{
      var baseUrl = window.location.origin;
      $.ajax({
         type: 'GET',
         url:  baseUrl+"/admin/manualcoupon/"+code, 
         dataType:'json',
         success: function(res) {
            if(res.status === "error"){
               toastr.error(res.message)
            }
            $('#POS_coupon_model').modal('hide');
            $('input[name=coupon_code]').val('')
            $('#POS_gross_total').html( res.cart.gross_total.toFixed(2))
            $('#POS_sub_total').html(res.cart.sub_total.toFixed(2))
            $('#POS_addon_total').html(res.cart.addon_price.toFixed(2))
            $('#POS_coupon_total').html(res.cart.coupon_discount.toFixed(2))
            $('#POS_tax_total').html(res.cart.tax_amount.toFixed(2))

            poscurrency()
         }
   
      })
   }
})

// open payment model
$(document).on("click", '#POS_payment_model_show',function(){
   var customer = $('#single-select').val()
   var serviselength = $('#POS_service_added_list tr').length
   var baseUrl = window.location.origin;
   if(!customer){
      toastr.warning('Please Select Coustomer')
   }else if(serviselength < 1){
      toastr.warning('Min One Service Required')
   }else{
      $.ajax({
         type: 'GET',
         url:  baseUrl+"/admin/paymentdata/", 
         dataType:'json',
         success: function(res) {
            $('#POS_payment_type_list').html('<option value="0" selected disabled>Choose Payment Type</option>')
            $.each(res.payment,function(index, value){
               $('#POS_payment_type_list').append(' <option value="'+ value.id +'">'+value.ac_name+'</option>') 
            }) 
            $("#POS_payment_type_list").prop('required',true);
            $('.default-select').selectpicker('refresh');
            $('input[name=deliverydate]').val(new Date(res.cart.delivery_date).toLocaleDateString('en-CA'))
            $('input[name=deliverydate]').attr('min', new Date(res.cart.delivery_date).toLocaleDateString('en-CA'))
            $('#deliverydate_hidden').val(new Date(res.cart.delivery_date).toLocaleDateString('en-CA'))
            $('input[name=extradiscount]').val(res.cart.extra_discount)
            $('input[name=paid_amount]').val(res.cart.paid_amount)
            $('input[name=note]').val(res.cart.notes)


            $('#payment_grosstotal').html(res.cart.gross_total.toFixed(2))
            $('#POS_gross_order').val(res.cart.gross_total.toFixed(2))
            $('#POS_subtotal_order').val(res.cart.sub_total.toFixed(2))
            $('#payment_subtotal').html(res.cart.sub_total.toFixed(2))
            $('#payment_addons').html( res.cart.addon_price.toFixed(2))
            $('#payment_coupondiscount').html(res.cart.coupon_discount.toFixed(2))
            $('#payment_text_amount').html(res.cart.tax_amount.toFixed(2))
            $('#payment_extradiscount').html(res.cart.extra_discount.toFixed(2))
            $('#payment_text_perdent').html(' Tax (' + res.cart.tax+' %)')
            $('#POS_total_balance').html(00)

            $('#paid_amount').attr('max',(res.cart.gross_total))
            paymentcurrency();
            $('#POS_payment_model').modal('show');
         }
      })
   }
})


// extra discount
$(document).on('input','#POS_extra_discount_order', function(){
   var disc = Number($('input[name=extradiscount]').val()) 
   var gross = Number($('#POS_gross_order').val())
   $('#payment_extradiscount').html(disc)
   $('#payment_grosstotal').html((gross-disc).toFixed(2))
   $('#paid_amount').attr('max',(gross-disc))
   var sub_total = Number($('input[name=sub]').val())
   var paid = Number($('input[name=paid_amount]').val())
   $('#POS_total_balance').html((gross-disc-paid).toFixed(2))

   if(disc > sub_total  ){
      $('#POS_worning').html('Discount Amount Not Greter Then Sub-Total Amount ' )
      $('#cart_submit_for_order').prop('disabled', true)
   }else if(paid > (gross-disc)){
      $('#POS_worning_paid').html('Paid Amount Not Greter Then Total Amount ' )
      $('#cart_submit_for_order').prop('disabled', true)
   }else{
      $('#POS_worning_paid').html(' ' )
      $('#POS_worning').html(' ' )
      $('#cart_submit_for_order').prop('disabled', false)
   }
   extracurrency()
})

// paid amount
$(document).on('input','#paid_amount', function(){
  
   var disc = Number($('input[name=extradiscount]').val()) 
   var gross = Number($('#POS_gross_order').val())
   var paid = Number($('input[name=paid_amount]').val())
   var sub_total = Number($('input[name=sub]').val())

   $('#POS_total_balance').html((gross-disc-paid).toFixed(2))
  
   
   if(paid > (gross-disc) ){
      $('#POS_worning_paid').html('Paid Amount Not Greter Then Total Amount ' )
      $('#cart_submit_for_order').prop('disabled', true)
   }else if(disc > sub_total  ){
      $('#POS_worning').html('Discount Amount Not Greter Then Sub-Total Amount ' )
      $('#cart_submit_for_order').prop('disabled', true)
   }else{
      $('#POS_worning_paid').html(' ' )
      $('#POS_worning').html(' ' )
      $('#cart_submit_for_order').prop('disabled', false)
   }

   if(paid < 0.1){
      $('#POS_worning_paid').html('Paid Amount Not in Negative' )
      $('#cart_submit_for_order').prop('disabled', true)
   }
   payamucurrency()
})

//confirm order and save
$("#cart_submit_for_order").click(function(e){
   e.preventDefault();
   var paid = Number($('input[name=paid_amount]').val())
   var date = $('input[name=deliverydate]').val()
   var date_hidden = $('input[name=deliverydate_hidden]').val()
   var payment_type = $('#POS_payment_type_list').val()
   var baseUrl = window.location.origin;

   
   
      if(paid > 0){
         if(!payment_type){
         return toastr.warning('Please Select Payment Type')
         } 
      
      }

      if(date < date_hidden){
         return document.getElementById("POS_worning").innerHTML = "Enter Delivery Date";
      }

         $.ajax({
            type: 'POST',
            url:  baseUrl+"/admin/order",
            data: $('#pyment_POS_cart').serialize(), 
            success: function(res) {
               $('#POS_payment_model').modal('hide');
               toastr.success('Order Success fully Save')


               $('#invoice_header').html('<h3 class="text-uppercase">'+res.shope.name+'</h3>'+
                                                '<h6>Phone : '+res.shope.mobile_number+'</h6>'+
                                                '<h6>Email : '+res.shope.store_email+'</h6>')

               $('#invoice_order_id').html('Order Id : '+res.order.order_id+'')
             
               $('#invoice_order_date').html('Order Date : '+new Date(res.order.order_date).toLocaleDateString('en-CA')+'')
               $('#invoice_delivery_date').html('Delivery Date : '+new Date(res.order.delivery_date).toLocaleDateString('en-CA') );

               $('#invoice_item').html('');
               $.each(res.cartservice, function(index,value){
               
                  $('#invoice_item').append('<tr>'+
                                             ' <td>'+ Number(index + 1) +'</td>'+
                                             ' <td>'+
                                             '   <h5 class="mb-0">'+value.service_name+'</h5>'+
                                             '   <span class="mb-0 fs-6">['+value.service_type_name+'] </span> <br>'+
                                             '</td>'+
                                             '<td> '+value.service_quntity+' </td>'+
                                             '<td class="invosymbol">'+value.service_type_price.toFixed(2)+'</td>'+
                                             '</tr>')
               })

               if(res.addonslist.length < 1){
                  $('#POS_addon_invoice_item').addClass('d-none')
               }
               $('#addon_item').html('');
               $.each(res.addonslist, function(index,value){
               
                  $('#addon_item').append('<tr>'+
                                             ' <td>'+ Number(index + 1) +'</td>'+
                                             '<td> '+value.name+' </td>'+
                                             '<td class="invosymbol">'+value.price.toFixed(2)+'</td>'+
                                             '</tr>')
               })



               $('#invoice_price').html(res.order.sub_total.toFixed(2) );
               $('#invoice_addon').html(res.order.addon_price.toFixed(2) );
               $('#invoice_tax').html(res.order.tax_amount.toFixed(2));
               $('#invoice_Discount').html(res.order.extra_discount.toFixed(2) );
               $('#invoice_Coupon').html(res.order.coupon_discount.toFixed(2));
               $('#invoice_gross').html(res.order.gross_total.toFixed(2));

               $('#invoice_paid_method').html('Payment Method : '+res.paymenttype );
               $('#invoice_paid_amount').html('Paid Amount : '+res.order.paid_amount.toFixed(2));
               $('#invoice_due_amount').html('Due Amount : '+res.order.balance_amount.toFixed(2));

               $('#invoice_Name_customer').html(res.customer.name);
               $('#invoice_Number_customer').html(res.customer.number);
               $('#invoice_Email_customer').html(res.customer.email);
               $('#invoice_Address_customer').html(res.customer.address);
               $('#invoice_Tax_customer').html(res.customer.taxnumber);

              

               $('#order_note').html(res.order.note );
              
               $('#invoice').modal('show');
               invocurrency()
            },
         
         });

   })


$(document).on('click','#pri_invo', function(){
      var printContents=document.getElementById('invoice_page').innerHTML;
          document.body.innerHTML=printContents;
          window.print();
          location.reload();
})

$(document).ready(function () {

   
   $('#POS_order_date').attr('min', new Date().toLocaleDateString('en-CA'))

   $('#invoice').modal({
          backdrop: 'static',
          keyboard: false
   })

   $('#POS_payment_model').modal({
          backdrop: 'static',
          keyboard: false
   })
});


// order list page serch script

   $(document).ready(function () {
      $("#order_list_serach").on("keyup", function () {
         var value = $(this).val().toLowerCase();
         $("#order_list_tbl tr").filter(function () {
               $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
         });
      });
   });



   $("#orders_list_status").on("change", function () {
      var value = $(this).val();
      $("#order_list_tbl tr").filter(function () {
         $(this).toggle($(this.children[3]).text().indexOf(value) > -1)              
      });
   });

// change order status

async function changeOrderStatus(statusid, orderid){

   var baseUrl = window.location.origin;
   $.ajax({
      type: 'GET',
      url:  baseUrl+"/order/changestatus/"+statusid+','+orderid,
      dataType:'json',
      success: function(res) {
         if(res.status =="error"){
               toastr.error(res.messge)
         }else if(res.status =="success"){
            toastr.success(res.messge)
            
            setTimeout(()=>{
               location.reload()
            },1000)
         }

      }
   })
}
      
// open payment model
async function open_patment_model(orderid){

  
   var baseUrl = window.location.origin;
   $.ajax({
      type: 'GET',
      url:  baseUrl+"/order/paymodel/"+orderid,
      dataType:'json',
      success: function(res) {
      
         $('#orderlistpaymentmodel').html( '<div class="row g-2 align-items-center">'+
                                    '<div class=" col-12">'+

                                        '<div class="row mb-50 align-items-center">'+
                                           ' <div class="col text-sm">Customer Name:</div>'+
                                            '<div class="col-auto text-sm">'+res.customer.name+'</div>'+
                                        '</div>'+

                                        '<div class="row mb-50 align-items-center">'+
                                            '<div class="col text-sm">Order ID: </div>'+
                                            '<div class="col-auto text-sm">'+res.order.order_id +'</div>'+
                                        '</div>'+

                                        '<div class="row mb-50 align-items-center">'+
                                            '<div class="col text-sm">Order Date: </div>'+
                                            '<div class="col-auto text-sm">'+new Date(res.order.order_date).toLocaleDateString('en-CA') +'</div>'+
                                        '</div>'+

                                        '<div class="row mb-50 align-items-center">'+
                                            '<div class="col text-sm"> Delivery Date:</div>'+
                                            '<div class="col-auto text-sm">'+new Date(res.order.delivery_date).toLocaleDateString('en-CA') +'</div>'+
                                        '</div>'+

                                        '<hr>'+

                                        '<div class="row mb-50 align-items-center">'+
                                            '<div class="col text-sm"> Order Amount:</div>'+
                                            '<div class="col-auto text-sm invosymbol">'+res.order.gross_total.toFixed(2) +'</div>'+
                                        '</div>'+

                                        '<div class="row mb-50 align-items-center">'+
                                            '<div class="col text-sm">Paid Amount:</div>'+
                                            '<div class="col-auto text-sm invosymbol">'+res.order.paid_amount.toFixed(2)+'</div>'+
                                        '</div>'+

                                        '<hr>'+

                                        '<div class="row align-items-center">'+
                                            '<div class="col text-sm">Balance:</div>'+
                                            '<div class="col-auto text-sm invosymbol">'+res.order.balance_amount.toFixed(2) +'</div>'+
                                        '</div>'+

                                        '<hr>'+

                                       ' <div class="row align-items-center">'+
                                            '<div class="col-md-6 mb-1">'+
                                                '<label class="form-label">Paid Amount</label>'+
                                                '<input type="flot" class="form-control" placeholder="Enter Amount" name="paid" value="0">'+
                                                '<input type="hidden"  name="orderid" value="'+res.order.id+'">'+
                                                '<input type="hidden"  name="balan" value="'+res.order.balance_amount+'">'+
                                            '</div>'+
                                            '<div class="col-md-6 mb-1">'+
                                                '<label class="form-label">Payment Type</label>'+
                                               ' <select class="default-select form-control wide" name="payment" id="payment">'+
                                                   ' <option value selected disabled>Choose Payment Type</option>'+    
                                               ' </select>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>')

         $.each(res.account, function(index,data){
            console.log(data);
            $('#payment').append('<option value='+data.id+'>'+data.ac_name+'</option>')
         })
         $('.default-select').selectpicker('refresh');
         $('#addpaymentmodel1').modal('show');

         invocurrency()
      }
   })
}

// add order payment insied order details
$('#add_order_payment_submit').click(function(e){
   e.preventDefault();
   
   var balance = Number($('input[name=balan]').val())
   var paid = Number($('input[name=paid]').val())
   var payment_type = $('#payment').val()
   var baseUrl = window.location.origin;

   if(balance <  paid){
      return toastr.warning('Paid amount is not more then Order Amount')
   }
   if(paid > 0){
      if(!payment_type){
      return toastr.warning('Please Select Payment Type')
      }   
   }
   if(paid < 0){
      return toastr.warning('Please Select Payment Amount') 
   }

   $.ajax({
      type: 'POST',
      url:  baseUrl+"/order/addpayment", 
      data: $('#add_order_payment').serialize(), 
      success: function(res) {
         if(res.status =="success"){
            toastr.success(res.message)
           
            setTimeout(()=>{
               location.reload()
            },1000)
         }
      }
   })

})

//  daily report date and store change
$('#daily_report_store').on("change", function () {
   
   var store = $(this).val()
   var date = $('#daily_report_date').val()
   dailyorder(date, store)
  
})

//  daily report date and store change date change
$('#daily_report_date').on("change", function () {
   
   var store = $('#daily_report_store').val()
   var date = $(this).val()
   dailyorder(date, store)
   
})


// order report store change
$('#order_report_store').on("change", function () {
   
   var store = $(this).val()
   var startdate = $('#order_report_start_date').val()
   var enddate = $('#order_report_end_date').val()
   var status = $('#order_report_status').val()
   
   orderreports(store, startdate, enddate, status)
})

// order report store change
$('#order_report_status').on("change", function () {
   
   var status = $(this).val()
   var store = $('#order_report_store').val()
   var startdate = $('#order_report_start_date').val()
   var enddate = $('#order_report_end_date').val()
   
   orderreports(store, startdate, enddate, status)
})

// order report start date change
$('#order_report_start_date').on("change", function () {
  
   var store = $('#order_report_store').val()
   var startdate =  $(this).val()
   var enddate = $('#order_report_end_date').val()
   var status = $('#order_report_status').val()
  
   orderreports(store, startdate, enddate, status)
})

// order report end date change
$('#order_report_end_date').on("change", function () {
  
   var store = $('#order_report_store').val()
   var startdate = $('#order_report_start_date').val()
   var enddate =$(this).val()
   var status = $('#order_report_status').val()
  
   orderreports(store, startdate, enddate, status)
})


// Sales report store change
$('#sales_report_store').on("change", function () {
   
   var store = $(this).val()
   var startdate = $('#sales_report_start_date').val()
   var enddate = $('#sales_report_end_date').val()
   
   salesreports(store, startdate, enddate)
})

// Sales report start date change
$('#sales_report_start_date').on("change", function () {
  
   var store = $('#sales_report_store').val()
   var startdate =  $(this).val()
   var enddate = $('#sales_report_end_date').val()
  
   salesreports(store, startdate, enddate)
})

// Sales report end date change
$('#sales_report_end_date').on("change", function () {
  
   var store = $('#sales_report_store').val()
   var startdate = $('#sales_report_start_date').val()
   var enddate =$(this).val()
  
   salesreports(store, startdate, enddate)
})


// Expence report store change
$('#Expence_report_store').on("change", function () {
   
   var store = $(this).val()
   var startdate = $('#Expence_report_start_date').val()
   var enddate = $('#Expence_report_end_date').val()
   
   expencereports(store, startdate, enddate)
})

// Expence report start date change
$('#Expence_report_start_date').on("change", function () {
  
   var store = $('#Expence_report_store').val()
   var startdate =  $(this).val()
   var enddate = $('#Expence_report_end_date').val()
  
   expencereports(store, startdate, enddate)
})

// Expence report end date change
$('#Expence_report_end_date').on("change", function () {
  
   var store = $('#Expence_report_store').val()
   var startdate = $('#Expence_report_start_date').val()
   var enddate =$(this).val()
  
   expencereports(store, startdate, enddate)
})




// Tax report store change
$('#tax_report_store').on("change", function () {
   
   var store = $(this).val()
   var startdate = $('#tax_report_start_date').val()
   var enddate = $('#tax_report_end_date').val()
   var filter = $('#tax_report_status').val()
   
   taxreports(store, startdate, enddate, filter)
})

// Tax report start date change
$('#tax_report_start_date').on("change", function () {
  
   var store = $('#tax_report_store').val()
   var startdate =  $(this).val()
   var enddate = $('#tax_report_end_date').val()
   var filter = $('#tax_report_status').val()
  
   taxreports(store, startdate, enddate, filter)
})

// Tax report end date change
$('#tax_report_end_date').on("change", function () {
  
   var store = $('#tax_report_store').val()
   var startdate = $('#tax_report_start_date').val()
   var enddate =$(this).val()
   var filter = $('#tax_report_status').val()
  
   taxreports(store, startdate, enddate, filter)
})

// Tax report status change
$('#tax_report_status').on("change", function () {
  
   var store = $('#tax_report_store').val()
   var startdate = $('#tax_report_start_date').val()
   var enddate =$('#tax_report_end_date').val()
   var filter = $(this).val()
  
   taxreports(store, startdate, enddate, filter)
})

// master seting change
$('#multy').on('change',function(){
  
  var multy = $('#multy').prop('checked')
  
  if(!multy){
   
   //   $('#multy_alert').model('show')
     $('#POS_coupon_model').modal('show');
  }
   
})






//  report Print
$(document).on('click','#order_report_print', function(){
   
   var printContents=document.getElementById('invoice_page').innerHTML;
       document.body.innerHTML=printContents;
       window.print();
       location.reload();
})



$(document).ready(function(){
   var list =  Intl.supportedValuesOf('timeZone')
   var timezone = $('#timezone').attr('data-id')
 
   $.each(list, function(index, value){
      $('#timezone').append(' <option value="'+value+'" >'+value+'</option>')
   })
  
   $('select[name=timezone]').val(timezone)
   $('.default-select').selectpicker('refresh');


})

// ======== Total Orders reports ========= //
$(document).ready(function () {
   orderreport()
});

function orderreport(){
   var rowCount = $("#tb_row_order_report tr").length;

   $("#orders_report").text(rowCount);
      var sum = 0;
      $("td:nth-child(4):visible").each(function () {
         sum += Number($(this).text()) 
      });
      $("#order_report_amount").html(sum.toFixed(2))  ;
}

// status filter on order report
// $("#order_report_status").on("change", function () {
//    var value = $(this).val();
//    $("#tb_row_order_report tr").filter(function () {
//       $(this).toggle($(this.children[4]).text().indexOf(value) > -1)
//    });
//    $("#orders_report").text($("#tb_row_order_report tr:visible").length);

      
//       var sum = 0;
//       $("td:nth-child(4)").each(function () {
 
//          var cellvalue =$(this).text();
//          sum += Number(cellvalue.split(' ')[1]) 
      
//       });


//       $("#order_report_amount").html(sum.toFixed(2))  ;
//       invocurrency()
// });


 // ======== Total sales reports ========= //

 $(document).ready(function () {
   sale()
  
});

function sale(){
   var rowCount = $("#tb_row_sales_report tr").length;

   $("#sales_report").text(rowCount);
      var tax = 0;
      $("td:nth-child(8):visible").each(function () {
         tax += Number($(this).text()) 
      });
      
      $("#sales_report_tax").html(tax.toFixed(2))  ;
      var sum = 0;   
      $("td:nth-child(9):visible").each(function () {
         sum += Number($(this).text()) 
      });
      
      $("#sales_report_amount").html(sum.toFixed(2))  ;
}



 // ======== Total Expence reports ========= //

 $(document).ready(function () {
   expence() 
});

function expence(){
   var rowCount = $("#tb_row_expence_report tr").length;
   $("#expence_report").text(rowCount);


   var tax = 0;
   $("td:nth-child(5):visible").each(function () {
      tax += Number($(this).text()) 
   });
   $("#expence_report_taxamount").html(tax.toFixed(2))  ;


   var sum = 0;
   $("td:nth-child(3):visible").each(function () {
      sum += Number($(this).text()) 
   });
   $("#expence_report_amount").html(sum.toFixed(2))  ;
}


 // ======== Total Tax reports ========= //

 $(document).ready(function () {
   tax() 
});

function tax(){
 
   var tax = 0;
   $("td:nth-child(5):visible").each(function () {
      tax += Number($(this).text()) 
   });
   $("#tax_report_tax").html(tax.toFixed(2))  ;


   var sum = 0;
   $("td:nth-child(6):visible").each(function () {
      sum += Number($(this).text()) 
   });
   $("#tax_report_amount").html(sum.toFixed(2))  ;
}




$(document).ready(function(){
   
currency();

})




function currency(){
   var sym = $('input[name=sym]').val()
   var pls = $('input[name=pls]').val()
   
      if(pls == 1){
         var users = document.getElementsByClassName('symbol');
         for (var i = 0; i < users.length; ++i) {
             var user = users[i];  
             user.innerHTML =  user.innerHTML+' '+ sym ;
         }
      }else{
         var users = document.getElementsByClassName('symbol');
         for (var i = 0; i < users.length; ++i) {
             var user = users[i];  
             user.innerHTML = sym+' ' + user.innerHTML ;
         }
      }
     
}

function couponcurrency(){
   var sym = $('input[name=sym]').val()
   var pls = $('input[name=pls]').val()
   
      if(pls == 1){
         var users = document.getElementsByClassName('couponsymbol');
         for (var i = 0; i < users.length; ++i) {
             var user = users[i];  
             user.innerHTML =  user.innerHTML+' '+ sym ;
         }
      }else{
         var users = document.getElementsByClassName('couponsymbol');
         for (var i = 0; i < users.length; ++i) {
             var user = users[i];  
             user.innerHTML = sym+' ' + user.innerHTML ;
         }
      }
     
}

function paymentcurrency(){
   var sym = $('input[name=sym]').val()
   var pls = $('input[name=pls]').val()
   
      if(pls == 1){
         var users = document.getElementsByClassName('paysymbol');
         for (var i = 0; i < users.length; ++i) {
             var user = users[i];  
             user.innerHTML =  user.innerHTML+' '+ sym ;
         }
      }else{
         var users = document.getElementsByClassName('paysymbol');
         for (var i = 0; i < users.length; ++i) {
             var user = users[i];  
             user.innerHTML = sym+' ' + user.innerHTML ;
         }
      }
     
}

function extracurrency(){
   var sym = $('input[name=sym]').val()
   var pls = $('input[name=pls]').val()
   
      if(pls == 1){
         var users = document.getElementsByClassName('extsymbol');
         for (var i = 0; i < users.length; ++i) {
             var user = users[i];  
             user.innerHTML =  user.innerHTML+' '+ sym ;
         }
      }else{
         var users = document.getElementsByClassName('extsymbol');
         for (var i = 0; i < users.length; ++i) {
             var user = users[i];  
             user.innerHTML = sym+' ' + user.innerHTML ;
         }
      }
     
}

function payamucurrency(){
   var sym = $('input[name=sym]').val()
   var pls = $('input[name=pls]').val()
   
      if(pls == 1){
         var users = document.getElementsByClassName('pamtsymbol');
         for (var i = 0; i < users.length; ++i) {
             var user = users[i];  
             user.innerHTML =  user.innerHTML+' '+ sym ;
         }
      }else{
         var users = document.getElementsByClassName('pamtsymbol');
         for (var i = 0; i < users.length; ++i) {
             var user = users[i];  
             user.innerHTML = sym+' ' + user.innerHTML ;
         }
      }
     
}

function poscurrency(){
   var sym = $('input[name=sym]').val()
   var pls = $('input[name=pls]').val()
   
      if(pls == 1){
         var users = document.getElementsByClassName('possymbol');
         for (var i = 0; i < users.length; ++i) {
             var user = users[i];  
             user.innerHTML =  user.innerHTML+' '+ sym ;
         }
      }else{
         var users = document.getElementsByClassName('possymbol');
         for (var i = 0; i < users.length; ++i) {
             var user = users[i];  
             user.innerHTML = sym+' ' + user.innerHTML ;
         }
      }
     
}

function invocurrency(){
   var sym = $('input[name=sym]').val()
   var pls = $('input[name=pls]').val()
   
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









function dailyorder(date, store){

   var baseUrl = window.location.origin;
   $.ajax({
      type: 'POST',
      url:  baseUrl+"/report/report",
      data:{date, store},
      dataType:'json',
      success: function(res) {

            $('#daily_report_date').val(new Date(res.date).toLocaleDateString('en-CA'))
            $('select[name=storeid]').val(res.store)
            $('.default-select').selectpicker('refresh');

            $('#daily_report_orders').html(res.orders)
            $('#daily_report_ordersdelivery').html(res.ordersdeliver)
            $('#daily_report_totalsale').html(res.orderstotalseal.toFixed(2))
            $('#daily_report_payment').html(res.totalpay.toFixed(2))
            $('#daily_report_expence').html(res.expence.toFixed(2))
            currency()
      }
   })

}



function orderreports(store, startdate, enddate, status){

   var baseUrl = window.location.origin;
   $.ajax({
      type: 'POST',
      url:  baseUrl+"/report/orderreports",
      data:{startdate, store, enddate, status},
      dataType:'json',
      success: function(res) {

            $('#order_report_start_date').val(new Date(res.startdate).toLocaleDateString('en-CA'))
            $('#order_report_end_date').val(new Date(res.enddate).toLocaleDateString('en-CA'))
            $('select[name=storeid]').val(res.store)
            // $('select[name=status]').val('e')
            $('.default-select').selectpicker('refresh');

            $('#tb_row_order_report').html('')
            $.each(res.orderdata,function(index, value){
            
            var status;

            if (value.status == "Pending") {
               status = 'badge badge-warning';
            } else if (value.status == "Processing") {
               status = 'badge badge-info';
            } else if (value.status == "Ready To deliver") {
               status = 'badge badge-secondary';
            } else if (value.status == "Deliver") {
               status = 'badge badge-primary';
            } else {
               status = 'badge badge-dark';
            }

            $('#tb_row_order_report').append('<tr>'+
                                             '<td> '+new Date(value.order_date).toLocaleDateString('en-CA')+' </td>'+
                                             '<td>'+ value.order_id+' </td>'+
                                             '<td>'+value.custoname +'</td>'+
                                             '<td class="symbol">'+ value.gross_total +'</td>'+
                                             // '<td><span class="symbol"> '+value.status +'</span></td>'+                 
                                             '<td><span class="'+status+'">'+value.status +'</span></td>'+                
                                             '</tr>')
            })

           
         var rowCount = $("#tb_row_order_report tr").length;
         
         $("#orders_report").text(rowCount);
         var table = document.getElementById("tb_row_order_report")
         
         var sum = 0;
         
         for (var i = 0; i < table.rows.length; i++) {
            sum = sum + parseFloat(table.rows[i].cells[3].innerHTML);
         }
         

         $("#order_report_amount").html(sum)  ;

            currency()
      }
   })

}


function salesreports(store, startdate, enddate){
   var baseUrl = window.location.origin;
   $.ajax({
      type: 'POST',
      url:  baseUrl+"/report/salesreports",
      data:{startdate, store,enddate},
      dataType:'json',
      success: function(res) {
            $('#sales_report_start_date').val(new Date(res.startdate).toLocaleDateString('en-CA'))
            $('#sales_report_end_date').val(new Date(res.enddate).toLocaleDateString('en-CA'))
            $('select[name=storeid]').val(res.store)
            $('.default-select').selectpicker('refresh');

            $('#tb_row_sales_report').html('')
           $.each(res.salesdata,function(index, value){
          
            $('#tb_row_sales_report').append('<tr>'+
                                                   '<td> '+new Date(value.order_date).toLocaleDateString('en-CA')+' </td>'+
                                                   '<td>'+ value.order_id+' </td>'+
                                                   '<td>'+value.custoname +'</td>'+
                                                   '<td class="symbol">'+value.sub_total +'</td>'+
                                                   '<td class="symbol">'+ value.addon_price+'</td>'+
                                                   '<td class="symbol">'+ value.extra_discount +'</td>'+
                                                   '<td class="symbol">'+value.coupon_discount +'</td>'+   
                                                   '<td class="symbol">'+ value.tax_amount +'</td>'+
                                                   '<td class="symbol">'+ value.gross_total +'</td>'+
                                                   
                                             '</tr>')
           });

           var rowCount = $("#tb_row_sales_report tr").length;
           $("#sales_report").text(rowCount);

          
           var table = document.getElementById("tb_row_sales_report")
            var sum = 0;
            var tax = 0;

            for (var i = 0; i < table.rows.length; i++) {
               tax = tax + parseFloat(table.rows[i].cells[7].innerHTML);
            }

            for (var i = 0; i < table.rows.length; i++) {
               sum = sum + parseFloat(table.rows[i].cells[8].innerHTML);
            }
            
            document.getElementById("sales_report_amount").innerHTML = sum.toFixed(2);
            document.getElementById("sales_report_tax").innerHTML = tax.toFixed(2);

            currency()



      }

   })
}


function expencereports(store, startdate, enddate){
   var baseUrl = window.location.origin;
   $.ajax({
      type: 'POST',
      url:  baseUrl+"/report/expencereport",
      data:{startdate, store,enddate},
      dataType:'json',
      success: function(res) {
             $('#Expence_report_start_date').val(new Date(res.startdate).toLocaleDateString('en-CA'))
            $('#Expence_report_end_date').val(new Date(res.enddate).toLocaleDateString('en-CA'))
            $('select[name=storeid]').val(res.store)
            $('.default-select').selectpicker('refresh');

            $('#tb_row_expence_report').html('')
            $.each(res.expencedata,function(index, value){
            
            $('#tb_row_expence_report').append('<tr>'+
                                                   '<td> '+new Date(value.date).toLocaleDateString('en-CA')+' </td>'+
                                                   '<td>'+ value.cat_name+'</td>'+
                                                   '<td class="symbol">'+ value.amount.toFixed(2)+'</td>'+
                                                   '<td>'+value.taxpercent +'</td>'+
                                                   '<td class="symbol">'+value.taxamount.toFixed(2)+'</td>'+
                                                   '<td>'+value.ac_name+'</td>'+
                                                   
                                             '</tr>')
           });

           var rowCount = $("#tb_row_expence_report tr").length;
           $("#expence_report").text(rowCount);

            var tax = 0;
            $("td:nth-child(5):visible").each(function () {
               tax += Number($(this).text()) 
            });
            $("#expence_report_taxamount").html(tax.toFixed(2))  ;


            var sum = 0;
            $("td:nth-child(3):visible").each(function () {
               sum += Number($(this).text()) 
            });
            $("#expence_report_amount").html(sum.toFixed(2))  ;

            currency()



      }

   })
}



function taxreports(store, startdate, enddate, filter){
   var baseUrl = window.location.origin;
   $.ajax({
      type: 'POST',
      url:  baseUrl+"/report/taxreport",
      data:{store, startdate, enddate, filter},
      dataType:'json',
      success: function(res) {
             $('#tax_report_start_date').val(new Date(res.startdate).toLocaleDateString('en-CA'))
            $('#tax_report_end_date').val(new Date(res.enddate).toLocaleDateString('en-CA'))
            $('select[name=storeid]').val(res.store)
            $('select[name=status]').val(res.filter)
            $('.default-select').selectpicker('refresh');

            $('#tb_row_tax_report').html('')
           $.each(res.taxdata,function(index, value){
          
            $('#tb_row_tax_report').append('<tr>'+
                                                   '<td>'+ Number(index + 1)+'</td>'+
                                                   '<td> '+new Date(value.date).toLocaleDateString('en-CA')+' </td>'+
                                                   '<td>'+value.particulars+'</td>'+
                                                   '<td class="symbol">'+value.befortax.toFixed(2)+'</td>'+
                                                   '<td class="symbol">'+value.taxamount.toFixed(2)+'</td>'+  
                                                   '<td class="symbol">'+value.amount.toFixed(2) +'</td>'+   
                                             '</tr>')
           });

           var tax = 0;
           $("td:nth-child(5):visible").each(function () {
              tax += Number($(this).text()) 
           });
           $("#tax_report_tax").html(tax.toFixed(2))  ;
        
        
           var sum = 0;
           $("td:nth-child(6):visible").each(function () {
              sum += Number($(this).text()) 
           });
           $("#tax_report_amount").html(sum.toFixed(2))  ;

            currency()



      }

   })
}

function downloadreport(){
   var baseUrl = window.location.origin;
      var store = $('#order_report_store').val()
      var startdate =  $('#order_report_start_date').val()
      var enddate = $('#order_report_end_date').val()

   window.location.href=baseUrl+"/report/export-order/"+startdate+"+"+store+"+"+enddate;  

}


function downloadsalesreport(){
   var baseUrl = window.location.origin;
      var store = $('#sales_report_store').val()
      var startdate =  $('#sales_report_start_date').val()
      var enddate = $('#sales_report_end_date').val()
   
   window.location.href=baseUrl+"/report/export-sales/"+startdate+"+"+store+"+"+enddate;  

}


function downloadExpencereport(){
   var baseUrl = window.location.origin;
   var store = $('#Expence_report_store').val()
   var startdate =  $('#Expence_report_start_date').val()
   var enddate = $('#Expence_report_end_date').val()

window.location.href=baseUrl+"/report/export-expence/"+startdate+"+"+store+"+"+enddate;  
}


function downloadtaxreport(){
   var baseUrl = window.location.origin;
   var store = $('#tax_report_store').val()
   var startdate = $('#tax_report_start_date').val()
   var enddate =$('#tax_report_end_date').val()
   var filter = $('#tax_report_status').val()
   window.location.href=baseUrl+"/report/export-tax/"+startdate+"+"+store+"+"+enddate+"+"+filter; 
}


let map;
		function initMap() {
			map = new google.maps.Map( document.getElementById( 'map' ), {
				center: {
					lat: 51.513329,
					lng: -0.088950
				},
				zoom: 14
			});
		}