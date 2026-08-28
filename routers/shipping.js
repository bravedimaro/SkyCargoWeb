const express = require("express");
const app = express();
const router = express.Router();
const auth = require("../middleware/auth");
const multer  = require('multer');
const access = require('../middleware/access');
const { mySqlQury } = require("../middleware/db");
const nodemailer = require('nodemailer');
const ejs = require('ejs');
let sendNotification = require("../middleware/send");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("1111111", file.originalname);  
        cb(null, "./public/uploads")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)

    }
})

const upload = multer({storage : storage});


// ========== create_shipment ============ //

router.get("/create_shipment", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 3`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)

        const prefix_data = await mySqlQury(`SELECT * FROM tbl_shipping_prefix WHERE type = '2'`)
        const agencies_list = await mySqlQury(`SELECT * FROM tbl_agency_group`)
        const office_group_list = await mySqlQury(`SELECT * FROM tbl_office_group`)
        const customers_list = await mySqlQury(`SELECT * FROM tbl_customers WHERE customer_active = 1`)
        const logistics_service_list = await mySqlQury(`SELECT * FROM tbl_logistics_service`)
        const packaging_list = await mySqlQury("SELECT * FROM tbl_packaging")
        const courier_companies_list = await mySqlQury(`SELECT * FROM tbl_courier_companies`)
        const shipping_modes_list = await mySqlQury(`SELECT * FROM tbl_shipping_modes`)
        const shipping_times_list = await mySqlQury(`SELECT * FROM tbl_shipping_times`)
        const payment_type = await mySqlQury(`SELECT * FROM tbl_payment_type WHERE active = 1`)
        const payment_methods_data = await mySqlQury(`SELECT * FROM tbl_payment_methods`)
        const shipping_status_data = await mySqlQury(`SELECT * FROM tbl_shipping_status WHERE status_checkbox = '1'`)
        const taxe_data = await mySqlQury(`SELECT * FROM tbl_taxes`)

        const shipment_data = await mySqlQury(`SELECT * FROM tbl_shipment`)
        if (shipment_data.length < 100) {
            let invoice = '0000' + (shipment_data.length + 1)

            if (role_data.role == '1') {
                let drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE active = 1`)

                res.render("add_create_shipment", {
                    role_data : role_data,accessdata, lang_data, language_name, prefix_data, notification_data,
                    register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                    invoice, agencies_list, office_group_list, customers_list, logistics_service_list, payment_type,
                    packaging_list, courier_companies_list, shipping_modes_list, shipping_times_list, drivers_list,
                    payment_methods_data, shipping_status_data,
                    taxe_data : taxe_data[0]
                })
            } else {
                let drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE login_id = '${role_data.id}'`)

                res.render("add_create_shipment", {
                    role_data : role_data,accessdata, lang_data, language_name, prefix_data, notification_data,
                    register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                    invoice, agencies_list, office_group_list, customers_list, logistics_service_list, payment_type,
                    packaging_list, courier_companies_list, shipping_modes_list, shipping_times_list, drivers_list,
                    payment_methods_data, shipping_status_data,
                    taxe_data : taxe_data[0]
                })
            }

           
        }else if (shipment_data.length > 100) {
            let invoice = '000' + (shipment_data.length + 1)

            if (role_data.role == '1') {
                let drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE active = 1`)

                res.render("add_create_shipment", {
                    role_data : role_data,accessdata, lang_data, language_name, prefix_data, notification_data,
                    register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                    invoice, agencies_list, office_group_list, customers_list, logistics_service_list, payment_type,
                    packaging_list, courier_companies_list, shipping_modes_list, shipping_times_list, drivers_list,
                    payment_methods_data, shipping_status_data,
                    taxe_data : taxe_data[0]
                })
            } else {
                let drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE login_id = '${role_data.id}'`)

                res.render("add_create_shipment", {
                    role_data : role_data,accessdata, lang_data, language_name, prefix_data, notification_data,
                    register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                    invoice, agencies_list, office_group_list, customers_list, logistics_service_list, payment_type,
                    packaging_list, courier_companies_list, shipping_modes_list, shipping_times_list, drivers_list,
                    payment_methods_data, shipping_status_data,
                    taxe_data : taxe_data[0]
                })
            }
        }else if (shipment_data.length > 1000) {
            let invoice = '00' + (shipment_data.length + 1)

            if (role_data.role == '1') {
                let drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE active = 1`)

                res.render("add_create_shipment", {
                    role_data : role_data,accessdata, lang_data, language_name, prefix_data, notification_data,
                    register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                    invoice, agencies_list, office_group_list, customers_list, logistics_service_list, payment_type,
                    packaging_list, courier_companies_list, shipping_modes_list, shipping_times_list, drivers_list,
                    payment_methods_data, shipping_status_data,
                    taxe_data : taxe_data[0]
                })
            } else {
                let drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE login_id = '${role_data.id}'`)

                res.render("add_create_shipment", {
                    role_data : role_data,accessdata, lang_data, language_name, prefix_data, notification_data,
                    register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                    invoice, agencies_list, office_group_list, customers_list, logistics_service_list, payment_type,
                    packaging_list, courier_companies_list, shipping_modes_list, shipping_times_list, drivers_list,
                    payment_methods_data, shipping_status_data,
                    taxe_data : taxe_data[0]
                })
            }
        }else if (shipment_data.length > 10000) {
            let invoice = '0' + (shipment_data.length + 1)

            if (role_data.role == '1') {
                let drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE active = 1`)

                res.render("add_create_shipment", {
                    role_data : role_data,accessdata, lang_data, language_name, prefix_data, notification_data,
                    register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                    invoice, agencies_list, office_group_list, customers_list, logistics_service_list, payment_type,
                    packaging_list, courier_companies_list, shipping_modes_list, shipping_times_list, drivers_list,
                    payment_methods_data, shipping_status_data,
                    taxe_data : taxe_data[0]
                })
            } else {
                let drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE login_id = '${role_data.id}'`)

                res.render("add_create_shipment", {
                    role_data : role_data,accessdata, lang_data, language_name, prefix_data, notification_data,
                    register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                    invoice, agencies_list, office_group_list, customers_list, logistics_service_list, payment_type,
                    packaging_list, courier_companies_list, shipping_modes_list, shipping_times_list, drivers_list,
                    payment_methods_data, shipping_status_data,
                    taxe_data : taxe_data[0]
                })
            }
        }else {
            let invoice = (shipment_data.length + 1)

            if (role_data.role == '1') {
                let drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE active = 1`)

                res.render("add_create_shipment", {
                    role_data : role_data,accessdata, lang_data, language_name, prefix_data, notification_data,
                    register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                    invoice, agencies_list, office_group_list, customers_list, logistics_service_list, payment_type,
                    packaging_list, courier_companies_list, shipping_modes_list, shipping_times_list, drivers_list,
                    payment_methods_data, shipping_status_data,
                    taxe_data : taxe_data[0]
                })
            } else {
                let drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE login_id = '${role_data.id}'`)

                res.render("add_create_shipment", {
                    role_data : role_data,accessdata, lang_data, language_name, prefix_data, notification_data,
                    register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                    invoice, agencies_list, office_group_list, customers_list, logistics_service_list, payment_type,
                    packaging_list, courier_companies_list, shipping_modes_list, shipping_times_list, drivers_list,
                    payment_methods_data, shipping_status_data,
                    taxe_data : taxe_data[0]
                })
            }
        }

        
    } catch (error) {
        console.log(error);
    }
})

router.get("/create_shipment/ajax/:id", auth, async(req, res) => {
    try {
        const client_data = await mySqlQury(`SELECT * FROM tbl_client WHERE customer = '${req.params.id}'`)

        res.status(200).json({ client_data })
    } catch (error) {
        console.log(error);
    }
})

router.get("/client_address/ajax/:id", auth, async(req, res) => {
    try {
        const client_data = await mySqlQury(`SELECT * FROM tbl_client WHERE id = '${req.params.id}'`)
        console.log(client_data);

        const country = client_data[0].country.split(',');
        const state = client_data[0].state.split(',');
        const city = client_data[0].city.split(',');
        const zipcode = client_data[0].zipcode.split(',');
        const address = client_data[0].address.split(',');
        
        const countries_list = await mySqlQury("SELECT * FROM tbl_countries")
        const state_list = await mySqlQury("SELECT * FROM tbl_states")
        const city_list = await mySqlQury("SELECT * FROM tbl_city")
        console.log(city_list);
        
        res.status(200).json({ country, state, city, zipcode, address, countries_list, state_list, city_list })
    } catch (error) {
        console.log(error);
    }
})

router.post("/rate/ajax", auth, async(req, res) => {
    try {
        const {customer, client, customer_address, client_address, weight_vol} = req.body
        
        const customers_list = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${customer}'`)
        console.log(req.body);

        const country = customers_list[0].customers_country.split(',');
        const state = customers_list[0].customers_state.split(',');
        const city = customers_list[0].customers_city.split(',');
        const zipcode = customers_list[0].customers_zipcode.split(',');
        const address = customers_list[0].customers_address.split(',');
        
        address.forEach(async(data, i) => {
            if (customer_address == data) {
                let new_address = data
                let new_zip = zipcode[i]
                let new_city = city[i]
                let new_state = state[i]
                let new_country = country[i]

                let countries_list = await mySqlQury(`SELECT * FROM tbl_countries WHERE id = '${new_country}'`)
                let state_list = await mySqlQury(`SELECT * FROM tbl_states WHERE id = '${new_state}'`)
                let city_list = await mySqlQury(`SELECT * FROM tbl_city WHERE id = '${new_city}'`)

                // ====== client ====== //

                const client_list = await mySqlQury(`SELECT * FROM tbl_client WHERE id = '${client}'`)

                const client_country = client_list[0].country.split(',');
                const client_state = client_list[0].state.split(',');
                const client_city = client_list[0].city.split(',');
                const client_zipcode = client_list[0].zipcode.split(',');
                const client_address_list = client_list[0].address.split(',');

                client_address_list.forEach(async(data, i) => {
                    if (client_address == data) {
                        let new_client_address = data
                        let new_client_zip = client_zipcode[i]
                        let new_client_city = client_city[i]
                        let new_client_state = client_state[i]
                        let new_client_country = client_country[i]


                        const client_countries_list = await mySqlQury(`SELECT * FROM tbl_countries WHERE id = '${new_client_country}'`)
                        const client_state_list = await mySqlQury(`SELECT * FROM tbl_states WHERE id = '${new_client_state}'`)
                        const client_city_list = await mySqlQury(`SELECT * FROM tbl_city WHERE id = '${new_client_city}'`)
                    
                    
                        const rate_list = await mySqlQury(`SELECT * FROM tbl_rates WHERE origin = '${countries_list[0].id}' AND state = '${state_list[0].id}' AND city = '${city_list[0].id}' AND des_country = '${client_countries_list[0].id}' AND des_state = '${client_state_list[0].id}' AND des_city = '${client_city_list[0].id}' AND start_weight_range <= '${weight_vol}' AND end_weight_range >= '${weight_vol}'`)
                        console.log(rate_list[0]);
                    
                        if (rate_list[0] == undefined) {
                            return  res.status(200).json({status:'error', message:'There is no configured rate for the selected origin and destination'})
                        }
                    
                        res.status(200).json({
                            countries : countries_list[0].countries_name,
                            state : state_list[0].state_name,
                            city : city_list[0].city_name,
                            zip_code : new_zip,
                            address : new_address,
                            client_countries : client_countries_list[0].countries_name,
                            client_state : client_state_list[0].state_name,
                            client_city : client_city_list[0].city_name,
                            client_zip_code : new_client_zip,
                            client_address : new_client_address,
                            rate_list : rate_list[0]
                        })
                    }
                });
            }
        });
        

    } catch (error) {
        console.log(error);
    }
})

router.post("/create_shipment", auth, upload.single('image'), async(req, res) => {
    try {
        const role_data = req.user
        const accessdata = await access (req.user)

        const {prefix, invoice, agency, office_of_origin, customer, customer_address, client, client_address, shipping_mode, packaging, courier_company, service_mode,
            delivery_time, payment_type, payment_methods, delivery_status, assign_driver, package_name, package_description, package_amount, weight, length,
            width, height, weight_vol, f_charge, decvalue, total_weight, total_weight_vol, total_decvalue, add_price_kg, add_discount, add_value_assured, add_shipping_insurance, add_customs_duties, add_tax, tax_count,
            add_declared_value, subtotal, discount, shipping_insurance, customs_duties, tax, declared_value, fixed_charge, reissue, total} = req.body

        let image = req.file.filename

        if (req.file.mimetype != "image/png" && req.file.mimetype != "image/jpg" && req.file.mimetype != "image/jpeg") {
            req.flash('errors', `Only .png, .jpg and .jpeg format allowed!`)
            return res.redirect("back")
        }

        let date = new Date()
        let day = date.getDate()
        let month = date.getMonth()+1
        let year = date.getFullYear()
        let fullDate = `${year}-${month}-${day}`

        const payment_methods_list = await mySqlQury(`SELECT * FROM tbl_payment_methods WHERE id = '${payment_methods}'`)

        if (role_data.role == '1' || role_data.role == '3') {
                
            if (payment_methods_list[0].payment_days == '0') {
                
                let query = `INSERT INTO tbl_shipment (invoice, date, agency, office_of_origin, customer, customer_address, client, client_address, shipping_mode, packaging, 
                    courier_company, service_mode, delivery_time, payment_type, payment_methods, delivery_status, assign_driver, image, package_name, package_description, 
                    package_amount, weight, length, width, height, weight_vol, f_charge, decvalue, total_weight, total_weight_vol, total_decvalue, add_price_kg, add_discount, add_value_assured, add_shipping_insurance, 
                    add_customs_duties, add_tax, tax_count, add_declared_value, subtotal, discount, shipping_insurance, customs_duties, tax, declared_value, fixed_charge, 
                    reissue, total, paid_amount, store_id) VALUE ('${prefix}${invoice}', '${fullDate}', '${agency}', '${office_of_origin}', '${customer}', '${customer_address}', '${client}', 
                    '${client_address}', '${shipping_mode}', '${packaging}', '${courier_company}', '${service_mode}', '${delivery_time}', '${payment_type}', '${payment_methods}',
                    '${delivery_status}', '${assign_driver}', '${image}', '${package_name}', '${package_description}', '${package_amount}', '${weight}', '${length}', '${width}', 
                    '${height}', '${weight_vol}', '${f_charge}', '${decvalue}', '${total_weight}', '${total_weight_vol}', '${total_decvalue}', '${add_price_kg}', '${add_discount}', '${add_value_assured}', '${add_shipping_insurance}', 
                    '${add_customs_duties}', '${add_tax}', '${tax_count}', '${add_declared_value}', '${subtotal}', '${discount}', '${shipping_insurance}', '${customs_duties}', 
                    '${tax}', '${declared_value}', '${fixed_charge}', '${reissue}', '${total}', '${total}', '${role_data.role}')`
                    await mySqlQury(query)

                let payment_query = `INSERT INTO tbl_payment (store_id, date, invoice, type, paid_amount) VALUE ('${customer}', '${fullDate}', '${prefix}${invoice}', 'shipment', '${total}')`
                await mySqlQury(payment_query)

            } else {
                    
                let query = `INSERT INTO tbl_shipment (invoice, date, agency, office_of_origin, customer, customer_address, client, client_address, shipping_mode, packaging, 
                    courier_company, service_mode, delivery_time, payment_type, payment_methods, delivery_status, assign_driver, image, package_name, package_description, 
                    package_amount, weight, length, width, height, weight_vol, f_charge, decvalue, total_weight, total_weight_vol, total_decvalue, add_price_kg, add_discount, add_value_assured, add_shipping_insurance, 
                    add_customs_duties, add_tax, tax_count, add_declared_value, subtotal, discount, shipping_insurance, customs_duties, tax, declared_value, fixed_charge, 
                    reissue, total, due_amount, store_id) VALUE ('${prefix}${invoice}', '${fullDate}', '${agency}', '${office_of_origin}', '${customer}', '${customer_address}', '${client}', 
                    '${client_address}', '${shipping_mode}', '${packaging}', '${courier_company}', '${service_mode}', '${delivery_time}', '${payment_type}', '${payment_methods}',
                    '${delivery_status}', '${assign_driver}', '${image}', '${package_name}', '${package_description}', '${package_amount}', '${weight}', '${length}', '${width}', 
                    '${height}', '${weight_vol}', '${f_charge}', '${decvalue}', '${total_weight}', '${total_weight_vol}', '${total_decvalue}', '${add_price_kg}', '${add_discount}', '${add_value_assured}', '${add_shipping_insurance}', 
                    '${add_customs_duties}', '${add_tax}', '${tax_count}', '${add_declared_value}', '${subtotal}', '${discount}', '${shipping_insurance}', '${customs_duties}', 
                    '${tax}', '${declared_value}', '${fixed_charge}', '${reissue}', '${total}', '${total}', '${role_data.role}')`
                    await mySqlQury(query)
            }
        } else {
                
            if (payment_methods_list[0].payment_days == '0') {
                
                let query = `INSERT INTO tbl_shipment (invoice, date, agency, office_of_origin, customer, customer_address, client, client_address, shipping_mode, packaging, 
                    courier_company, service_mode, payment_type, payment_methods, image, package_name, package_description, 
                    package_amount, weight, length, width, height, weight_vol, f_charge, decvalue, total_weight, total_weight_vol, total_decvalue, add_price_kg, add_discount, add_value_assured, add_shipping_insurance, 
                    add_customs_duties, add_tax, tax_count, add_declared_value, subtotal, discount, shipping_insurance, customs_duties, tax, declared_value, fixed_charge, 
                    reissue, total, paid_amount, store_id) VALUE ('${prefix}${invoice}', '${fullDate}', '${agency}', '${office_of_origin}', '${customer}', '${customer_address}', '${client}', 
                    '${client_address}', '${shipping_mode}', '${packaging}', '${courier_company}', '${service_mode}', '${payment_type}', '${payment_methods}',
                    '${image}', '${package_name}', '${package_description}', '${package_amount}', '${weight}', '${length}', '${width}', 
                    '${height}', '${weight_vol}', '${f_charge}', '${decvalue}', '${total_weight}', '${total_weight_vol}', '${total_decvalue}', '${add_price_kg}', '${add_discount}', '${add_value_assured}', '${add_shipping_insurance}', 
                    '${add_customs_duties}', '${add_tax}', '${tax_count}', '${add_declared_value}', '${subtotal}', '${discount}', '${shipping_insurance}', '${customs_duties}', 
                    '${tax}', '${declared_value}', '${fixed_charge}', '${reissue}', '${total}', '${total}', '${role_data.role}')`
                    await mySqlQury(query)

                let payment_query = `INSERT INTO tbl_payment (store_id, date, invoice, type, paid_amount) VALUE ('${customer}', '${fullDate}', '${prefix}${invoice}', 'shipment', '${total}')`
                await mySqlQury(payment_query)

            } else {
                    
                let query = `INSERT INTO tbl_shipment (invoice, date, agency, office_of_origin, customer, customer_address, client, client_address, shipping_mode, packaging, 
                    courier_company, service_mode, payment_type, payment_methods, image, package_name, package_description, 
                    package_amount, weight, length, width, height, weight_vol, f_charge, decvalue, total_weight, total_weight_vol, total_decvalue, add_price_kg, add_discount, add_value_assured, add_shipping_insurance, 
                    add_customs_duties, add_tax, tax_count, add_declared_value, subtotal, discount, shipping_insurance, customs_duties, tax, declared_value, fixed_charge, 
                    reissue, total, due_amount, store_id) VALUE ('${prefix}${invoice}', '${fullDate}', '${agency}', '${office_of_origin}', '${customer}', '${customer_address}', '${client}', 
                    '${client_address}', '${shipping_mode}', '${packaging}', '${courier_company}', '${service_mode}', '${payment_type}', '${payment_methods}',
                    '${image}', '${package_name}', '${package_description}', '${package_amount}', '${weight}', '${length}', '${width}', 
                    '${height}', '${weight_vol}', '${f_charge}', '${decvalue}', '${total_weight}', '${total_weight_vol}', '${total_decvalue}', '${add_price_kg}', '${add_discount}', '${add_value_assured}', '${add_shipping_insurance}', 
                    '${add_customs_duties}', '${add_tax}', '${tax_count}', '${add_declared_value}', '${subtotal}', '${discount}', '${shipping_insurance}', '${customs_duties}', 
                    '${tax}', '${declared_value}', '${fixed_charge}', '${reissue}', '${total}', '${total}', '${role_data.role}')`
                    await mySqlQury(query)
            }
        }
        


        let today = new Date();
        let newtime = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })


        if (role_data.role == '1' || role_data.role == '3') {
            
            let query = `INSERT INTO tbl_tracking_history (invoice, type, office, delivery_status, date, time, message, page) VALUE
            ('${prefix}${invoice}', 'shipment', '${office_of_origin}', '${delivery_status}', '${fullDate}', '${newtime}', 'Shipment created', '1')`
            await mySqlQury(query)
        } else {
            
            let query = `INSERT INTO tbl_tracking_history (invoice, type, office, delivery_status, date, time, message, page) VALUE
            ('${prefix}${invoice}', 'shipment', '${office_of_origin}', '4', '${fullDate}', '${newtime}', 'Shipment created', '1')`
            await mySqlQury(query)
        }



        // =========== email ========== //

        const page = 'shipment'
        const new_data = await mySqlQury(`SELECT * FROM tbl_shipment WHERE invoice = '${prefix}${invoice}'`)
        
        const package_name_list = new_data[0].package_name.split(',')
        const package_description_list = new_data[0].package_description.split(',')
        const package_amount_list = new_data[0].package_amount.split(',')
        const weight_list = new_data[0].weight.split(',')
        const length_list = new_data[0].length.split(',')
        const width_list = new_data[0].width.split(',')
        const height_list = new_data[0].height.split(',')
        const weight_vol_list = new_data[0].weight_vol.split(',')
        const f_charge_list = new_data[0].f_charge.split(',')
        const decvalue_list = new_data[0].decvalue.split(',')
            
        const email_data = await mySqlQury(`SELECT * FROM tbl_email_settings`)
        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${customer}'`)
        const driver_data = await mySqlQury(`SELECT * FROM tbl_drivers WHERE id = '${assign_driver}'`)
        const client_data = await mySqlQury(`SELECT * FROM tbl_client WHERE id = '${client}'`)

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: email_data[0].email,
              pass: email_data[0].email_password
            }
        });

        const data = await ejs.renderFile(__dirname + "/../views" + "/email.ejs", {page, accessdata, package_name_list, package_description_list, client_data,
            package_amount_list, weight_list, length_list, width_list, height_list, weight_vol_list, f_charge_list, decvalue_list, new_data, customer_data});
        
        let mailOptions = {
            from: email_data[0].email,
            to: customer_data[0].email,
            subject: 'Shipment',
            attachments: [{
                filename: 'Logo.png',
                path: __dirname + '/../public' +'/uploads/'+ accessdata.data.site_logo,
                cid: 'logo'
           }],
           html: data
        }
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
              console.log(error);
            } else {
                console.log('Email sent to customer');
            }
        });


        // ========= sms ============ //

        let ACCOUNT_SID = accessdata.data.twilio_sid
        let AUTH_TOKEN = accessdata.data.twilio_auth_token
        const client_sms = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);
        
        client_sms.messages
        .create({
            body: `We have successfully processed your shipment and it is now en route to the destination. You can track your package using the tracking number ${prefix}${invoice}. Thank you for using our services, we appreciate your business!`,
            from: accessdata.data.twilio_phone_no,
            to: customer_data[0].country_code+customer_data[0].mobile
        })
        .then(message => console.log(message.sid))


        // ============== Notification ============= //

        if (role_data.role == '1' || role_data.role == '3') {

            const admin_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${prefix}${invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new shipment, please check it.', '1', '2')`
            await mySqlQury(admin_message)

            const cus_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${prefix}${invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new shipment, please check it.', '${customer_data[0].login_id}', '2')`
            await mySqlQury(cus_message)

            const dri_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${prefix}${invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new shipment, please check it.', '${driver_data[0].login_id}', '2')`
            await mySqlQury(dri_message)
            
            let message = {
                app_id: accessdata.data.onesignal_app_id,
                contents: {"en": "There is a new shipment, please check it."},
                headings: {"en": accessdata.data.site_title},
                included_segments: ["Subscribed Users"],
                // chrome_web_image: "https://unsplash.com/photos/e616t35Vbeg"
                filters: [
                    {"field": "tag", "key": "subscription_user_Type", "relation": "=", "value": "customer"}, 
                    {"operator": "AND"}, {"field": "tag", "key": "Login_ID", "relation": "=", "value": customer_data[0].login_id}, 
                    {"operator": "OR"},
                    {"field": "tag", "key": "subscription_user_Type", "relation": "=", "value": "admin"},
                    {"operator": "AND"}, {"field": "tag", "key": "Login_ID", "relation": "=", "value": "1"},
                    {"operator": "OR"},
                    {"field": "tag", "key": "subscription_user_Type", "relation": "=", "value": "driver"},
                    {"operator": "AND"}, {"field": "tag", "key": "Login_ID", "relation": "=", "value": driver_data[0].login_id}
                ]
            }
            sendNotification(message);
        } else {

            const admin_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${prefix}${invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new shipment, please check it.', '1', '2')`
            await mySqlQury(admin_message)

            const cus_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${prefix}${invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new shipment, please check it.', '${customer_data[0].login_id}', '2')`
            await mySqlQury(cus_message)
            
            let message = {
                app_id: accessdata.data.onesignal_app_id,
                contents: {"en": "There is a new shipment, please check it."},
                headings: {"en": accessdata.data.site_title},
                included_segments: ["Subscribed Users"],
                // chrome_web_image: "https://unsplash.com/photos/e616t35Vbeg"
                filters: [
                    {"field": "tag", "key": "subscription_user_Type", "relation": "=", "value": "customer"}, 
                    {"operator": "AND"}, {"field": "tag", "key": "Login_ID", "relation": "=", "value": customer_data[0].login_id}, 
                    {"operator": "OR"},
                    {"field": "tag", "key": "subscription_user_Type", "relation": "=", "value": "admin"},
                    {"operator": "AND"}, {"field": "tag", "key": "Login_ID", "relation": "=", "value": "1"}
                ]
            }
            sendNotification(message);
        }

        
        

        req.flash('success', `Added successfully`)
        res.redirect("/shipping/list_of_shipment")
    } catch (error) {
        console.log(error);
    }
})


// ======== list_of_shipment =========== //

router.get("/list_of_shipment", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 3`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)

        let customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE login_id = '${role_data.id}'`)

        if (role_data.role == '1') {

            let shipment_list = await mySqlQury(`SELECT tbl_shipment.*, (select tbl_customers.first_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_firstname,
                                                                        (select tbl_customers.last_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_lastname,
                                                                        (select tbl_client.first_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_firstname,
                                                                        (select tbl_client.last_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_lastname,
                                                                        (select tbl_payment_type.payment_type from tbl_payment_type where tbl_shipment.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                        (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_shipment.delivery_status = tbl_shipping_status.id) as shipping_status FROM tbl_shipment ORDER BY id DESC`)
            const drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE active = 1`)

            res.render("list_of_shipment", {
                role_data : role_data, accessdata, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                shipment_list : shipment_list,
                drivers_list
            })
        } else if (role_data.role == '2') {
            
            let shipment_list = await mySqlQury(`SELECT tbl_shipment.*, (select tbl_customers.first_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_firstname,
                                                                        (select tbl_customers.last_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_lastname,
                                                                        (select tbl_client.first_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_firstname,
                                                                        (select tbl_client.last_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_lastname,
                                                                        (select tbl_payment_type.payment_type from tbl_payment_type where tbl_shipment.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                        (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_shipment.delivery_status = tbl_shipping_status.id) as shipping_status FROM tbl_shipment WHERE customer = '${customer_data[0].id}' ORDER BY id DESC`)
            const drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE active = 1`)

            res.render("list_of_shipment", {
                role_data : role_data, accessdata, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                shipment_list : shipment_list,
                drivers_list
            })                                                      
        } else {
            const drivers_data = await mySqlQury(`SELECT * FROM tbl_drivers WHERE login_id = '${role_data.id}'`)

            let shipment_list = await mySqlQury(`SELECT tbl_shipment.*, (select tbl_customers.first_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_firstname,
                                                                        (select tbl_customers.last_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_lastname,
                                                                        (select tbl_client.first_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_firstname,
                                                                        (select tbl_client.last_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_lastname,
                                                                        (select tbl_payment_type.payment_type from tbl_payment_type where tbl_shipment.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                        (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_shipment.delivery_status = tbl_shipping_status.id) as shipping_status FROM tbl_shipment WHERE assign_driver = '${drivers_data[0].id}' ORDER BY id DESC`)
            const drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE active = 1`)

            res.render("list_of_shipment", {
                role_data : role_data, accessdata, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                shipment_list : shipment_list,
                drivers_list
            })
        }
        
        
        
    } catch (error) {
        console.log(error);
    }
})

router.post("/assigndriver", auth, async(req, res) => {
    try {
        const role_data = req.user
        const accessdata = await access (req.user)

        await mySqlQury(`UPDATE tbl_shipment SET assign_driver = '${req.body.assign_driver}' WHERE id = '${req.body.hidden_id}'`)

        // ============== Notification ============= //
        
        const shipment_data = await mySqlQury(`SELECT * FROM tbl_shipment WHERE id = '${req.body.hidden_id}'`)

        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${shipment_data[0].customer}'`)
        const driver_data = await mySqlQury(`SELECT * FROM tbl_drivers WHERE id = '${req.body.assign_driver}'`)

        let date = new Date()
        let day = date.getDate()
        let month = date.getMonth()+1
        let year = date.getFullYear()
        let fullDate = `${year}-${month}-${day}`

        let today = new Date();
        let newtime = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })


        if (role_data.role == '1') {
            
            const admin_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${shipment_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new driver assign, please check it.', '1', '2')`
            await mySqlQury(admin_message)
    
            const cus_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${shipment_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new driver assign, please check it.', '${customer_data[0].login_id}', '2')`
            await mySqlQury(cus_message)
    
            const dri_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${shipment_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new driver assign, please check it.', '${driver_data[0].login_id}', '2')`
            await mySqlQury(dri_message)
    
            let message = { 
                app_id: accessdata.data.onesignal_app_id,
                contents: {"en": "There is a new driver assign, please check it."},
                headings: {"en": accessdata.data.site_title},
                included_segments: ["Subscribed Users"],
                // chrome_web_image: "https://unsplash.com/photos/e616t35Vbeg"
                filters: [
                    {"field": "tag", "key": "subscription_user_Type", "relation": "=", "value": "customer"}, 
                    {"operator": "AND"}, {"field": "tag", "key": "Login_ID", "relation": "=", "value": customer_data[0].login_id}, 
                    {"operator": "OR"},
                    // {"field": "tag", "key": "subscription_user_Type", "relation": "=", "value": "admin"},
                    // {"operator": "AND"}, {"field": "tag", "key": "Login_ID", "relation": "=", "value": "1"},
                    // {"operator": "OR"},
                    {"field": "tag", "key": "subscription_user_Type", "relation": "=", "value": "driver"},
                    {"operator": "AND"}, {"field": "tag", "key": "Login_ID", "relation": "=", "value": driver_data[0].login_id}
                ]
            }
            sendNotification(message);
        } else {
            
            const admin_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${shipment_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new driver assign, please check it.', '1', '2')`
            await mySqlQury(admin_message)
    
            const cus_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${shipment_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new driver assign, please check it.', '${customer_data[0].login_id}', '2')`
            await mySqlQury(cus_message)
    
            const dri_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${shipment_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new driver assign, please check it.', '${driver_data[0].login_id}', '2')`
            await mySqlQury(dri_message)
    
        
            let message = { 
                app_id: accessdata.data.onesignal_app_id,
                contents: {"en": "There is a new driver assign, please check it."},
                headings: {"en": accessdata.data.site_title},
                included_segments: ["Subscribed Users"],
                // chrome_web_image: "https://unsplash.com/photos/e616t35Vbeg"
                filters: [
                    {"field": "tag", "key": "subscription_user_Type", "relation": "=", "value": "customer"}, 
                    {"operator": "AND"}, {"field": "tag", "key": "Login_ID", "relation": "=", "value": customer_data[0].login_id}, 
                    {"operator": "OR"},
                    {"field": "tag", "key": "subscription_user_Type", "relation": "=", "value": "admin"},
                    {"operator": "AND"}, {"field": "tag", "key": "Login_ID", "relation": "=", "value": "1"},
                    {"operator": "OR"},
                    {"field": "tag", "key": "subscription_user_Type", "relation": "=", "value": "driver"},
                    {"operator": "AND"}, {"field": "tag", "key": "Login_ID", "relation": "=", "value": driver_data[0].login_id}
                ]
            }
            sendNotification(message);
        }

        req.flash('success', `Added successfully`)
        res.redirect("/shipping/list_of_shipment")
    } catch (error) {
        console.log(error);
    }
})


// ========= show_create_shipment =========== //

router.get("/show_create_shipment/:id", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 3`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)

        const shipment_list = await mySqlQury(`SELECT tbl_shipment.*, (select tbl_customers.first_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_firstname,
                                                                    (select tbl_customers.last_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_lastname,
                                                                    (select tbl_client.first_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_firstname,
                                                                    (select tbl_client.last_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_lastname,
                                                                    (select tbl_agency_group.agency_name from tbl_agency_group where tbl_shipment.agency = tbl_agency_group.id) as agency_name,
                                                                    (select tbl_shipping_times.shipping_times from tbl_shipping_times where tbl_shipment.delivery_time = tbl_shipping_times.id) as deliverytime,
                                                                    (select tbl_office_group.office_name from tbl_office_group where tbl_shipment.office_of_origin = tbl_office_group.id) as office_group_name,
                                                                    (select tbl_packaging.packaging_type from tbl_packaging where tbl_shipment.packaging = tbl_packaging.id) as packaging_name,
                                                                    (select tbl_payment_type.payment_type from tbl_payment_type where tbl_shipment.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                    (select tbl_logistics_service.service_name from tbl_logistics_service where tbl_shipment.shipping_mode = tbl_logistics_service.id) as shipping_mode_name,
                                                                    (select tbl_courier_companies.companies_name from tbl_courier_companies where tbl_shipment.courier_company = tbl_courier_companies.id) as courier_companies_name,
                                                                    (select tbl_shipping_modes.shipping_modes from tbl_shipping_modes where tbl_shipment.service_mode = tbl_shipping_modes.id) as service_mode_name,
                                                                    (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_shipment.delivery_status = tbl_shipping_status.id) as shipping_status FROM tbl_shipment WHERE id = '${req.params.id}'`)

        

        const tracking_data = await mySqlQury(`SELECT tbl_tracking_history.*, (select tbl_countries.countries_name from tbl_countries where tbl_tracking_history.location = tbl_countries.id) as countries_name,
                                                                            (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_tracking_history.delivery_status = tbl_shipping_status.id) as status_name
                                                                            FROM tbl_tracking_history WHERE invoice = '${shipment_list[0].invoice}' AND type = 'shipment'`)
        console.log(shipment_list);

        const package_name_list = shipment_list[0].package_name.split(',')
        const package_description_list = shipment_list[0].package_description.split(',')
        const package_amount_list = shipment_list[0].package_amount.split(',')
        const weight_list = shipment_list[0].weight.split(',')
        const length_list = shipment_list[0].length.split(',')
        const width_list = shipment_list[0].width.split(',')
        const height_list = shipment_list[0].height.split(',')
        const weight_vol_list = shipment_list[0].weight_vol.split(',')
        const f_charge_list = shipment_list[0].f_charge.split(',')
        const decvalue_list = shipment_list[0].decvalue.split(',')

        const sender_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${shipment_list[0].customer}'`)

        const customers_address = sender_data[0].customers_address.split(',')
        const customers_country = sender_data[0].customers_country.split(',')
        const customers_city = sender_data[0].customers_city.split(',')
        
        const recipient_data = await mySqlQury(`SELECT * FROM tbl_client WHERE id = '${shipment_list[0].client}'`)

        const recipient_address = recipient_data[0].address.split(',')
        const recipient_country = recipient_data[0].country.split(',')
        const recipient_city = recipient_data[0].city.split(',')

        const country_name = await mySqlQury(`SELECT * FROM tbl_countries`)
        const city_name = await mySqlQury(`SELECT * FROM tbl_city`)

        const drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE active = 1`)
        
        res.render("show_create_shipment", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            shipment_list : shipment_list[0],
            tracking_data, package_name_list, package_description_list, package_amount_list, weight_list, length_list, 
            width_list, height_list, weight_vol_list, f_charge_list, decvalue_list, customers_address, customers_country,
            customers_city, country_name, city_name, recipient_address, recipient_country, recipient_city, drivers_list,
            sender_data : sender_data[0],
            recipient_data : recipient_data[0]
        })
    } catch (error) {
        console.log(error);
    }
})


// ========= edit_create_shipment ============ //

router.get("/edit_create_shipment/:id", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 3`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)

        const shipment_data = await mySqlQury(`SELECT * FROM tbl_shipment WHERE id = '${req.params.id}'`)
        console.log(shipment_data);
        
        const agencies_list = await mySqlQury(`SELECT * FROM tbl_agency_group`)
        const office_group_list = await mySqlQury(`SELECT * FROM tbl_office_group`)
        const customers_list = await mySqlQury(`SELECT * FROM tbl_customers WHERE customer_active = 1`)
        const edit_customers_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${shipment_data[0].customer}'`)
        const country = edit_customers_data[0].customers_country.split(',');
        const state = edit_customers_data[0].customers_state.split(',');
        const city = edit_customers_data[0].customers_city.split(',');
        const zipcode = edit_customers_data[0].customers_zipcode.split(',');
        const address = edit_customers_data[0].customers_address.split(',');
        const countries_list = await mySqlQury("SELECT * FROM tbl_countries")
        const state_list = await mySqlQury("SELECT * FROM tbl_states")
        const city_list = await mySqlQury("SELECT * FROM tbl_city")
        const client_list = await mySqlQury(`SELECT * FROM tbl_client WHERE customer = '${shipment_data[0].customer}'`)
        const edit_client_data = await mySqlQury(`SELECT * FROM tbl_client WHERE id = '${shipment_data[0].client}'`)
        const client_country = edit_client_data[0].country.split(',');
        const client_state = edit_client_data[0].state.split(',');
        const client_city = edit_client_data[0].city.split(',');
        const client_zipcode = edit_client_data[0].zipcode.split(',');
        const client_address = edit_client_data[0].address.split(',');
        const logistics_service_list = await mySqlQury(`SELECT * FROM tbl_logistics_service`)
        const packaging_list = await mySqlQury("SELECT * FROM tbl_packaging")
        const courier_companies_list = await mySqlQury(`SELECT * FROM tbl_courier_companies`)
        const shipping_modes_list = await mySqlQury(`SELECT * FROM tbl_shipping_modes`)
        const shipping_times_list = await mySqlQury(`SELECT * FROM tbl_shipping_times`)
        const drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE active = 1`)
        const payment_type = await mySqlQury(`SELECT * FROM tbl_payment_type`)
        const payment_methods_data = await mySqlQury(`SELECT * FROM tbl_payment_methods`)
        const shipping_status_data = await mySqlQury(`SELECT * FROM tbl_shipping_status WHERE status_checkbox = '1'`)
        const taxe_data = await mySqlQury(`SELECT * FROM tbl_taxes`)

        const package_name_list = shipment_data[0].package_name.split(',')
        const package_description_list = shipment_data[0].package_description.split(',')
        const package_amount_list = shipment_data[0].package_amount.split(',')
        const weight_list = shipment_data[0].weight.split(',')
        const length_list = shipment_data[0].length.split(',')
        const width_list = shipment_data[0].width.split(',')
        const height_list = shipment_data[0].height.split(',')
        const weight_vol_list = shipment_data[0].weight_vol.split(',')
        const f_charge_list = shipment_data[0].f_charge.split(',')
        const decvalue_list = shipment_data[0].decvalue.split(',')
        
        res.render("edit_create_shipment", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            shipment_data  : shipment_data[0],
            agencies_list, office_group_list, customers_list, country, state, city, zipcode, address,
            countries_list, state_list, city_list, client_list, client_country, client_state, client_city, 
            client_zipcode, client_address, logistics_service_list, packaging_list, courier_companies_list, payment_type,
            shipping_modes_list, shipping_times_list, drivers_list, payment_methods_data, shipping_status_data,
            taxe_data : taxe_data[0], package_name_list, package_description_list, package_amount_list, weight_list,
            length_list, width_list, height_list, weight_vol_list, f_charge_list, decvalue_list
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/edit_create_shipment/:id", auth, upload.single('image'), async(req, res) => {
    try {
        const {invoice, agency, office_of_origin, customer, customer_address, client, client_address, shipping_mode, packaging, courier_company, service_mode, delivery_time,
            payment_type, payment_methods, delivery_status, assign_driver, hidden_image, package_name, package_description, package_amount, weight, length, width, height, weight_vol,
            f_charge, decvalue, total_weight, total_weight_vol, total_decvalue, add_price_kg, add_discount, add_value_assured, add_shipping_insurance, add_customs_duties, 
            add_tax, tax_count, add_declared_value, subtotal, discount, shipping_insurance, customs_duties, tax, declared_value, fixed_charge, reissue, total} = req.body

            let date = new Date()
            let day = date.getDate()
            let month = date.getMonth()+1
            let year = date.getFullYear()
            let fullDate = `${year}-${month}-${day}`

            const shipment_data = await mySqlQury(`SELECT * FROM tbl_shipment WHERE id = '${req.params.id}'`)

            const payment_methods_list = await mySqlQury(`SELECT * FROM tbl_payment_methods WHERE id = '${payment_methods}'`)

            let due = parseFloat(total) - parseFloat(shipment_data[0].paid_amount)

            if (hidden_image == 0) {

                if (payment_methods_list[0].payment_days == '0') {

                    let query = `UPDATE tbl_shipment SET date = '${fullDate}', agency = '${agency}', office_of_origin = '${office_of_origin}', customer = '${customer}', customer_address = '${customer_address}',
                    client = '${client}', client_address = '${client_address}', shipping_mode = '${shipping_mode}', packaging = '${packaging}', courier_company = '${courier_company}',
                    service_mode = '${service_mode}', delivery_time = '${delivery_time}', payment_type = '${payment_type}', payment_methods = '${payment_methods}', delivery_status = '${delivery_status}',
                    assign_driver = '${assign_driver}', package_name = '${package_name}', package_description = '${package_description}', package_amount = '${package_amount}', weight = '${weight}',
                    length = '${length}', width = '${width}', height = '${height}', weight_vol = '${weight_vol}', f_charge = '${f_charge}', decvalue = '${decvalue}', total_weight = '${total_weight}', 
                    total_weight_vol = '${total_weight_vol}', total_decvalue = '${total_decvalue}', add_price_kg = '${add_price_kg}', add_discount = '${add_discount}', add_value_assured = '${add_value_assured}', 
                    add_shipping_insurance = '${add_shipping_insurance}', add_customs_duties = '${add_customs_duties}', add_tax = '${add_tax}', tax_count = '${tax_count}', add_declared_value = '${add_declared_value}', 
                    subtotal = '${subtotal}', discount = '${discount}', shipping_insurance = '${shipping_insurance}', customs_duties = '${customs_duties}', tax = '${tax}', declared_value = '${declared_value}',
                    fixed_charge = '${fixed_charge}', reissue = '${reissue}', total = '${total}', paid_amount = '${total}', due_amount = '0' WHERE id = '${req.params.id}'`
                    await mySqlQury(query)

                    let payment_query = `UPDATE tbl_payment SET date = '${fullDate}', paid_amount = '${total}' WHERE invoice = '${invoice}' AND type = 'shipment'`
                    await mySqlQury(payment_query)

                } else {
                    
                    let query = `UPDATE tbl_shipment SET date = '${fullDate}', agency = '${agency}', office_of_origin = '${office_of_origin}', customer = '${customer}', customer_address = '${customer_address}',
                    client = '${client}', client_address = '${client_address}', shipping_mode = '${shipping_mode}', packaging = '${packaging}', courier_company = '${courier_company}',
                    service_mode = '${service_mode}', delivery_time = '${delivery_time}', payment_type = '${payment_type}', payment_methods = '${payment_methods}', delivery_status = '${delivery_status}',
                    assign_driver = '${assign_driver}', package_name = '${package_name}', package_description = '${package_description}', package_amount = '${package_amount}', weight = '${weight}',
                    length = '${length}', width = '${width}', height = '${height}', weight_vol = '${weight_vol}', f_charge = '${f_charge}', decvalue = '${decvalue}', total_weight = '${total_weight}', 
                    total_weight_vol = '${total_weight_vol}', total_decvalue = '${total_decvalue}', add_price_kg = '${add_price_kg}', add_discount = '${add_discount}', add_value_assured = '${add_value_assured}', 
                    add_shipping_insurance = '${add_shipping_insurance}', add_customs_duties = '${add_customs_duties}', add_tax = '${add_tax}', tax_count = '${tax_count}', add_declared_value = '${add_declared_value}', 
                    subtotal = '${subtotal}', discount = '${discount}', shipping_insurance = '${shipping_insurance}', customs_duties = '${customs_duties}', tax = '${tax}', declared_value = '${declared_value}',
                    fixed_charge = '${fixed_charge}', reissue = '${reissue}', total = '${total}', due_amount = '${due}' WHERE id = '${req.params.id}'`
                    await mySqlQury(query)
                }
                
            } else {
                let image = req.file.filename

                if (req.file.mimetype != "image/png" || req.file.mimetype != "image/jpg" || req.file.mimetype != "image/jpeg") {
                    req.flash('errors', `Only .png, .jpg and .jpeg format allowed!`)
                    return res.redirect("back")
                }

                if (payment_methods_list[0].payment_days == '0') {

                    let query = `UPDATE tbl_shipment SET date = '${fullDate}', agency = '${agency}', office_of_origin = '${office_of_origin}', customer = '${customer}', customer_address = '${customer_address}',
                    client = '${client}', client_address = '${client_address}', shipping_mode = '${shipping_mode}', packaging = '${packaging}', courier_company = '${courier_company}',
                    service_mode = '${service_mode}', delivery_time = '${delivery_time}', payment_type = '${payment_type}', payment_methods = '${payment_methods}', delivery_status = '${delivery_status}',
                    assign_driver = '${assign_driver}', image = '${image}', package_name = '${package_name}', package_description = '${package_description}', package_amount = '${package_amount}', weight = '${weight}',
                    length = '${length}', width = '${width}', height = '${height}', weight_vol = '${weight_vol}', f_charge = '${f_charge}', decvalue = '${decvalue}', total_weight = '${total_weight}', 
                    total_weight_vol = '${total_weight_vol}', total_decvalue = '${total_decvalue}', add_price_kg = '${add_price_kg}', add_discount = '${add_discount}', add_value_assured = '${add_value_assured}', 
                    add_shipping_insurance = '${add_shipping_insurance}', add_customs_duties = '${add_customs_duties}', add_tax = '${add_tax}', tax_count = '${tax_count}', add_declared_value = '${add_declared_value}', 
                    subtotal = '${subtotal}', discount = '${discount}', shipping_insurance = '${shipping_insurance}', customs_duties = '${customs_duties}', tax = '${tax}', declared_value = '${declared_value}',
                    fixed_charge = '${fixed_charge}', reissue = '${reissue}', total = '${total}', paid_amount = '${total}', due_amount = '0' WHERE id = '${req.params.id}'`
                    await mySqlQury(query)

                    let payment_query = `UPDATE tbl_payment SET date = '${fullDate}', paid_amount = '${total}' WHERE invoice = '${invoice}' AND type = 'shipment'`
                    await mySqlQury(payment_query)
                    
                } else {
                    
                    let query = `UPDATE tbl_shipment SET date = '${fullDate}', agency = '${agency}', office_of_origin = '${office_of_origin}', customer = '${customer}', customer_address = '${customer_address}',
                    client = '${client}', client_address = '${client_address}', shipping_mode = '${shipping_mode}', packaging = '${packaging}', courier_company = '${courier_company}',
                    service_mode = '${service_mode}', delivery_time = '${delivery_time}', payment_type = '${payment_type}', payment_methods = '${payment_methods}', delivery_status = '${delivery_status}',
                    assign_driver = '${assign_driver}', image = '${image}', package_name = '${package_name}', package_description = '${package_description}', package_amount = '${package_amount}', weight = '${weight}',
                    length = '${length}', width = '${width}', height = '${height}', weight_vol = '${weight_vol}', f_charge = '${f_charge}', decvalue = '${decvalue}', total_weight = '${total_weight}', 
                    total_weight_vol = '${total_weight_vol}', total_decvalue = '${total_decvalue}', add_price_kg = '${add_price_kg}', add_discount = '${add_discount}', add_value_assured = '${add_value_assured}', 
                    add_shipping_insurance = '${add_shipping_insurance}', add_customs_duties = '${add_customs_duties}', add_tax = '${add_tax}', tax_count = '${tax_count}', add_declared_value = '${add_declared_value}', 
                    subtotal = '${subtotal}', discount = '${discount}', shipping_insurance = '${shipping_insurance}', customs_duties = '${customs_duties}', tax = '${tax}', declared_value = '${declared_value}',
                    fixed_charge = '${fixed_charge}', reissue = '${reissue}', total = '${total}', due_amount = '${due}' WHERE id = '${req.params.id}'`
                    await mySqlQury(query)
                }
            }

            let tracking_data = `UPDATE tbl_tracking_history SET delivery_status = '${delivery_status}' WHERE invoice = '${shipment_data[0].invoice}' AND page = '1'`
            await mySqlQury(tracking_data)
            
            req.flash('success', `Added successfully`)
            res.redirect("/shipping/list_of_shipment")
    } catch (error) {
        console.log(error);
    }
})


// ========== shipment_tracking ============ //

router.get("/shipment_tracking/:id", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 3`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)
        
        const shipment_data = await mySqlQury(`SELECT * FROM tbl_shipment WHERE id = '${req.params.id}'`)

        const countries_data = await mySqlQury(`SELECT * FROM tbl_countries `)
        const office = await mySqlQury(`SELECT * FROM tbl_office_group`)
        const shipping_status_data = await mySqlQury(`SELECT * FROM tbl_shipping_status WHERE status_checkbox = '1'`)

        
        res.render("shipment_tracking", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            shipment_data : shipment_data[0],
            countries_data, office, shipping_status_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/shipment_tracking/:id", auth, async(req, res) => {
    try {
        const role_data = req.user
        const accessdata = await access (req.user)

        const {location, address, office, delivery_status, message} = req.body

        const shipment_data = await mySqlQury(`SELECT * FROM tbl_shipment WHERE id = '${req.params.id}'`)

        let adddate = new Date()
        let day = adddate.getDate()
        let month = adddate.getMonth()+1
        let year = adddate.getFullYear()
        let fullDate = `${year}-${month}-${day}`

        let today = new Date();
        let newtime = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

        let query = `INSERT INTO tbl_tracking_history (invoice, type, location, address, office, delivery_status, date, time, message) VALUE
        ('${shipment_data[0].invoice}', 'shipment', '${location}', '${address}', '${office}', '${delivery_status}', '${fullDate}', '${newtime}', '${message}')`
        await mySqlQury(query)

        let edit_shipment = `UPDATE tbl_shipment SET delivery_status = '${delivery_status}' WHERE id = '${req.params.id}'`
        await mySqlQury(edit_shipment)

        // =========== email ========== //

        const page = 'shipment_status'
        
        const package_name_list = shipment_data[0].package_name.split(',')
        const package_description_list = shipment_data[0].package_description.split(',')
        const package_amount_list = shipment_data[0].package_amount.split(',')
        const weight_list = shipment_data[0].weight.split(',')
        const length_list = shipment_data[0].length.split(',')
        const width_list = shipment_data[0].width.split(',')
        const height_list = shipment_data[0].height.split(',')
        const weight_vol_list = shipment_data[0].weight_vol.split(',')
        const f_charge_list = shipment_data[0].f_charge.split(',')
        const decvalue_list = shipment_data[0].decvalue.split(',')
            
        const email_data = await mySqlQury(`SELECT * FROM tbl_email_settings`)
        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${shipment_data[0].customer}'`)
        const client_data = await mySqlQury(`SELECT * FROM tbl_client WHERE id = '${shipment_data[0].client}'`)
        const driver_data = await mySqlQury(`SELECT * FROM tbl_drivers WHERE id = '${shipment_data[0].assign_driver}'`)
        const status_data = await mySqlQury(`SELECT * FROM tbl_shipping_status WHERE id = '${delivery_status}'`)

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: email_data[0].email,
              pass: email_data[0].email_password
            }
        });

        const data = await ejs.renderFile(__dirname + "/../views" + "/email.ejs", {page, accessdata, package_name_list, package_description_list, client_data, status_data,
            package_amount_list, weight_list, length_list, width_list, height_list, weight_vol_list, f_charge_list, decvalue_list, new_data : shipment_data, customer_data});
        
        let mailOptions = {
            from: email_data[0].email,
            to: customer_data[0].email,
            subject: 'Shipment',
            attachments: [{
                filename: 'Logo.png',
                path: __dirname + '/../public' +'/uploads/'+ accessdata.data.site_logo,
                cid: 'logo'
           }],
           html: data
        }
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
              console.log(error);
            } else {
                console.log('Email sent to customer');
            }
        });



        // ========= sms ============ //

        let ACCOUNT_SID = accessdata.data.twilio_sid
        let AUTH_TOKEN = accessdata.data.twilio_auth_token
        const client_sms = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);
        
        client_sms.messages
        .create({
            body: `We have successfully processed your shipment and it is now en route to the destination. You can track your package using the tracking number ${shipment_data[0].invoice}. Thank you for using our services, we appreciate your business!`,
            from: accessdata.data.twilio_phone_no,
            to: customer_data[0].country_code+customer_data[0].mobile
        })
        .then(message => console.log(message.sid))



        // ============== Notification ============= //

        

        const admin_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${shipment_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'The shipment status has been updated, please check it', '1', '2')`
        await mySqlQury(admin_message)

        const cus_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${shipment_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'The shipment status has been updated, please check it', '${customer_data[0].login_id}', '2')`
        await mySqlQury(cus_message)

        const dri_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${shipment_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'The shipment status has been updated, please check it', '${driver_data[0].login_id}', '2')`
        await mySqlQury(dri_message)

        let notification_message = { 
            app_id: accessdata.data.onesignal_app_id,
            contents: {"en": "The shipment status has been updated, please check it"},
            headings: {"en": accessdata.data.site_title},
            included_segments: ["Subscribed Users"],
            // chrome_web_image: "https://unsplash.com/photos/e616t35Vbeg"
            filters: [
                {"field": "tag", "key": "subscription_user_Type", "relation": "=", "value": "customer"}, 
                {"operator": "AND"}, {"field": "tag", "key": "Login_ID", "relation": "=", "value": customer_data[0].login_id}, 
                {"operator": "OR"},
                {"field": "tag", "key": "subscription_user_Type", "relation": "=", "value": "admin"},
                {"operator": "AND"}, {"field": "tag", "key": "Login_ID", "relation": "=", "value": "1"},
                {"operator": "OR"},
                {"field": "tag", "key": "subscription_user_Type", "relation": "=", "value": "driver"},
                {"operator": "AND"}, {"field": "tag", "key": "Login_ID", "relation": "=", "value": driver_data[0].login_id}
            ]
        }
        sendNotification(notification_message);


        req.flash('success', `Added successfully`)
        res.redirect("/shipping/list_of_shipment")
    } catch (error) {
        console.log(error);
    }
})

// =========== deliver_shipment ============ //

router.get("/deliver_shipment/:id", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 3`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)

        const shipment_data = await mySqlQury(`SELECT * FROM tbl_shipment WHERE id = '${req.params.id}'`)
        const drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE active = 1`)

        
        res.render("deliver_shipment", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            shipment_data : shipment_data[0],
            drivers_list
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/deliver_shipment/:id", auth, upload.single('image'), async(req, res) => {
    try {
        const role_data = req.user
        const accessdata = await access (req.user)

        const {assign_driver, person_receives, hidden_image} = req.body

        const shipment_data = await mySqlQury(`SELECT * FROM tbl_shipment WHERE id = '${req.params.id}'`)

        let adddate = new Date()
        let day = adddate.getDate()
        let month = adddate.getMonth()+1
        let year = adddate.getFullYear()
        let fullDate = `${year}-${month}-${day}`

        let today = new Date();
        let newtime = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

        if (hidden_image == 0) {
            
            let query = `INSERT INTO tbl_tracking_history (invoice, type, date, time, assign_driver, person_receives, delivery_status) VALUE 
            ('${shipment_data[0].invoice}', 'shipment', '${fullDate}', '${newtime}', '${assign_driver}', '${person_receives}', '6')`
            await mySqlQury(query)
        } else {
            let image = req.file.filename

            if (req.file.mimetype != "image/png" || req.file.mimetype != "image/jpg" || req.file.mimetype != "image/jpeg") {
                req.flash('errors', `Only .png, .jpg and .jpeg format allowed!`)
                return res.redirect("back")
            }

            let query = `INSERT INTO tbl_tracking_history (invoice, type, date, time, assign_driver, person_receives, image, delivery_status) VALUE 
            ('${shipment_data[0].invoice}', 'shipment', '${fullDate}', '${newtime}', '${assign_driver}', '${person_receives}', '${image}', '6')`
            await mySqlQury(query)
        }

        let edit_shipment = `UPDATE tbl_shipment SET delivery_status = '6' WHERE id = '${req.params.id}'`
        await mySqlQury(edit_shipment)


        // =========== email ========== //

        const page = 'shipment_status'
        
        const package_name_list = shipment_data[0].package_name.split(',')
        const package_description_list = shipment_data[0].package_description.split(',')
        const package_amount_list = shipment_data[0].package_amount.split(',')
        const weight_list = shipment_data[0].weight.split(',')
        const length_list = shipment_data[0].length.split(',')
        const width_list = shipment_data[0].width.split(',')
        const height_list = shipment_data[0].height.split(',')
        const weight_vol_list = shipment_data[0].weight_vol.split(',')
        const f_charge_list = shipment_data[0].f_charge.split(',')
        const decvalue_list = shipment_data[0].decvalue.split(',')
            
        const email_data = await mySqlQury(`SELECT * FROM tbl_email_settings`)
        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${shipment_data[0].customer}'`)
        const client_data = await mySqlQury(`SELECT * FROM tbl_client WHERE id = '${shipment_data[0].client}'`)
        const driver_data = await mySqlQury(`SELECT * FROM tbl_drivers WHERE id = '${shipment_data[0].assign_driver}'`)
        const status_data = await mySqlQury(`SELECT * FROM tbl_shipping_status WHERE id = '6'`)

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: email_data[0].email,
              pass: email_data[0].email_password
            }
        });

        const data = await ejs.renderFile(__dirname + "/../views" + "/email.ejs", {page, accessdata, package_name_list, package_description_list, client_data, status_data,
            package_amount_list, weight_list, length_list, width_list, height_list, weight_vol_list, f_charge_list, decvalue_list, new_data : shipment_data, customer_data});
        
        let mailOptions = {
            from: email_data[0].email,
            to: customer_data[0].email,
            subject: 'Shipment',
            attachments: [{
                filename: 'Logo.png',
                path: __dirname + '/../public' +'/uploads/'+ accessdata.data.site_logo,
                cid: 'logo'
           }],
           html: data
        }
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
              console.log(error);
            } else {
                console.log('Email sent to customer');
            }
        });



        // ========= sms ============ //

        let ACCOUNT_SID = accessdata.data.twilio_sid
        let AUTH_TOKEN = accessdata.data.twilio_auth_token
        const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);
        
        client.messages
        .create({
            body: `Hi ${customer_data[0].first_name} ${customer_data[0].last_name}, your order #${shipment_data[0].invoice} has been delivered.`,
            from: accessdata.data.twilio_phone_no,
            to: customer_data[0].country_code+customer_data[0].mobile
        })
        .then(message => console.log(message.sid))



        // ============== Notification ============= //


        const admin_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${shipment_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'The shipment has been delivered, please check it', '1', '2')`
        await mySqlQury(admin_message)

        const cus_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${shipment_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'The shipment has been delivered, please check it', '${customer_data[0].login_id}', '2')`
        await mySqlQury(cus_message)

        const dri_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${shipment_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'The shipment has been delivered, please check it', '${driver_data[0].login_id}', '2')`
        await mySqlQury(dri_message)

        let notification_message = { 
            app_id: accessdata.data.onesignal_app_id,
            contents: {"en": "The shipment has been delivered, please check it"},
            headings: {"en": accessdata.data.site_title},
            included_segments: ["Subscribed Users"],
            // chrome_web_image: "https://unsplash.com/photos/e616t35Vbeg"
            filters: [
                {"field": "tag", "key": "subscription_user_Type", "relation": "=", "value": "customer"}, 
                {"operator": "AND"}, {"field": "tag", "key": "Login_ID", "relation": "=", "value": customer_data[0].login_id}, 
                {"operator": "OR"},
                {"field": "tag", "key": "subscription_user_Type", "relation": "=", "value": "admin"},
                {"operator": "AND"}, {"field": "tag", "key": "Login_ID", "relation": "=", "value": "1"},
                {"operator": "OR"},
                {"field": "tag", "key": "subscription_user_Type", "relation": "=", "value": "driver"},
                {"operator": "AND"}, {"field": "tag", "key": "Login_ID", "relation": "=", "value": driver_data[0].login_id}
            ]
        }
        sendNotification(notification_message);


        req.flash('success', `Added successfully`)
        res.redirect("/shipping/list_of_shipment")
    } catch (error) {
        console.log(error);
    }
})

router.get("/override_shipment/:id", auth, async(req, res) => {
    try {
        let query = `UPDATE tbl_shipment SET delivery_status = '2' WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        req.flash('success', `Cancelled successfully`)
        res.redirect("/shipping/list_of_shipment")
    } catch (error) {
        console.log(error);
    }
})



// ============ payment ============= //

router.post("/payment/:id", auth, async(req, res) => {
    try {
        const role_data = req.user
        const accessdata = await access (req.user)
        
        const {paid_amount} = req.body

        let date = new Date()
        let day = date.getDate()
        let month = date.getMonth()+1
        let year = date.getFullYear()
        let fullDate = `${year}-${month}-${day}`

        const shipment_data = await mySqlQury(`SELECT * FROM tbl_shipment WHERE id = '${req.params.id}'`)
        console.log(shipment_data);

        let query = `INSERT INTO tbl_payment (store_id, date, invoice, type, paid_amount) VALUE ('${shipment_data[0].customer}', '${fullDate}', '${shipment_data[0].invoice}',
        'shipment', '${paid_amount}')`
        await mySqlQury(query)

        let due = parseFloat(shipment_data[0].due_amount) - parseFloat(paid_amount)
        let paid = parseFloat(shipment_data[0].paid_amount) + parseFloat(paid_amount)
        
        let update_shipment_data = `UPDATE tbl_shipment SET paid_amount = '${paid}', due_amount = '${due}' WHERE id = '${req.params.id}'`
        await mySqlQury(update_shipment_data)


        // ============== Notification ============= //
    
        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${shipment_data[0].customer}'`)

        let today = new Date();
        let newtime = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

        const admin_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${shipment_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'Shipping payment has been added, please check', '1', '2')`
        await mySqlQury(admin_message)

        const cus_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${shipment_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'Shipping payment has been added, please check', '${customer_data[0].login_id}', '2')`
        await mySqlQury(cus_message)

        let notification_message = { 
            app_id: accessdata.data.onesignal_app_id,
            contents: {"en": "Shipping payment has been added, please check"},
            headings: {"en": accessdata.data.site_title},
            included_segments: ["Subscribed Users"],
            // chrome_web_image: "https://unsplash.com/photos/e616t35Vbeg"
            filters: [
                {"field": "tag", "key": "subscription_user_Type", "relation": "=", "value": "customer"}, 
                {"operator": "AND"}, {"field": "tag", "key": "Login_ID", "relation": "=", "value": customer_data[0].login_id}, 
                {"operator": "OR"},
                {"field": "tag", "key": "subscription_user_Type", "relation": "=", "value": "admin"},
                {"operator": "AND"}, {"field": "tag", "key": "Login_ID", "relation": "=", "value": "1"}
            ]
        }
        sendNotification(notification_message);


        req.flash('success', `Pay successfully`)
        res.redirect("/shipping/list_of_shipment")
    } catch (error) {
        console.log(error);
    }
})



// ========== print_shipment =========== //

router.get("/print_shipment/:id", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 3`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)

        const register_packages_data = await mySqlQury(`SELECT tbl_shipment.*, (select tbl_logistics_service.service_name from tbl_logistics_service where tbl_shipment.shipping_mode = tbl_logistics_service.id) as service_name,
                                                                                        (select tbl_courier_companies.companies_name from tbl_courier_companies where tbl_shipment.courier_company = tbl_courier_companies.id) as companies_name,
                                                                                        (select tbl_shipping_modes.shipping_modes from tbl_shipping_modes where tbl_shipment.service_mode = tbl_shipping_modes.id) as shipping_modes,
                                                                                        (select tbl_payment_type.payment_type from tbl_payment_type where tbl_shipment.payment_type = tbl_payment_type.id) as payment_type_name
                                                                                        FROM tbl_shipment WHERE id = '${req.params.id}'`)
                                                                                        
        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${register_packages_data[0].customer}'`)
        console.log(register_packages_data);

        const address = customer_data[0].customers_address.split(',')
        const country = customer_data[0].customers_country.split(',')
        const city = customer_data[0].customers_city.split(',')
        
        const country_name = await mySqlQury(`SELECT * FROM tbl_countries`)
        const city_name = await mySqlQury(`SELECT * FROM tbl_city`)

        const package_name_list = register_packages_data[0].package_name.split(',')
        const package_description_list = register_packages_data[0].package_description.split(',')
        const package_amount_list = register_packages_data[0].package_amount.split(',')
        const weight_list = register_packages_data[0].weight.split(',')
        const length_list = register_packages_data[0].length.split(',')
        const width_list = register_packages_data[0].width.split(',')
        const height_list = register_packages_data[0].height.split(',')
        const weight_vol_list = register_packages_data[0].weight_vol.split(',')
        const f_charge_list = register_packages_data[0].f_charge.split(',')
        const decvalue_list = register_packages_data[0].decvalue.split(',')
        
        res.render("print_shipment", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            register_packages_data : register_packages_data[0],
            customer_data : customer_data[0], address, country, city, country_name, city_name, package_name_list, package_description_list,
            package_amount_list, weight_list, length_list, width_list, height_list, weight_vol_list, f_charge_list, decvalue_list
        })
    } catch (error) {
        console.log(error);
    }
})

router.get("/print_label/:id", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 3`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)

        const data = await mySqlQury(`SELECT tbl_shipment.*, (select tbl_payment_type.payment_type from tbl_payment_type where tbl_shipment.payment_type = tbl_payment_type.id) as paymenttype_name
        FROM tbl_shipment WHERE id = '${req.params.id}'`)
        console.log(data);
        const cus_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${data[0].customer}'`)

        const cus_country = cus_data[0].customers_country.split(',')
        const cus_state = cus_data[0].customers_state.split(',')
        const cus_city = cus_data[0].customers_city.split(',')
        const cus_zipcode = cus_data[0].customers_zipcode.split(',')
        const cus_address = cus_data[0].customers_address.split(',')

        const weight_data = data[0].weight.split(',')
        const length_data = data[0].length.split(',')
        const width_data = data[0].width.split(',')
        const height_data = data[0].height.split(',')
        const weight_vol_data = data[0].weight_vol.split(',')

        let weight = 0
        let length = 0
        let width  = 0
        let height = 0
        let weight_vol = 0

        weight_data.forEach(data => {
            weight += parseFloat(data)

        });

        length_data.forEach(data => {
            length += parseFloat(data)

        });

        width_data.forEach(data => {
            width += parseFloat(data)

        });

        height_data.forEach(data => {
            height += parseFloat(data)

        });

        weight_vol_data.forEach(data => {
            weight_vol += parseFloat(data)

        });

        const country = await mySqlQury(`SELECT * FROM tbl_countries`)
        const state = await mySqlQury(`SELECT * FROM tbl_states`)
        const city = await mySqlQury(`SELECT * FROM tbl_city`)

        const admin_data = await mySqlQury(`SELECT * FROM tbl_admin ORDER BY id LIMIT 1`)

        let type = 2

        res.render("print_label_packages", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            data, cus_data, cus_country, cus_state, cus_city, cus_zipcode, cus_address, weight, length, width, height, weight_vol,
            country, state, city, admin_data, type
        })
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;