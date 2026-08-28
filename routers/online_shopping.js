const express = require("express");
const app = express();
const router = express.Router();
const auth = require("../middleware/auth");
const { mySqlQury } = require("../middleware/db");
const { route } = require("./users");
const multer  = require('multer');
const access = require('../middleware/access');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
let sendNotification = require("../middleware/send");



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)

    }
})

const upload = multer({storage : storage});


router.get("/pre_alert", auth, async(req, res) => {
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
        
        if (role_data.id == 1) {
            
            let pre_alert_data = await mySqlQury(`SELECT tbl_pre_alert.*, (select tbl_customers.first_name from tbl_customers where tbl_pre_alert.customer_name = tbl_customers.login_id) as customer_firstname,
                                                                        (select tbl_customers.last_name from tbl_customers where tbl_pre_alert.customer_name = tbl_customers.login_id) as customer_lastname,
                                                                        (select tbl_courier_companies.companies_name from tbl_courier_companies where tbl_pre_alert.courier_company = tbl_courier_companies.id) as company FROM tbl_pre_alert ORDER BY id DESC`)
            res.render("pre_alert_list", {
                role_data : role_data, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                pre_alert_data : pre_alert_data,
                accessdata
            })
                                                                        
        } else {
            
            let pre_alert_data = await mySqlQury(`SELECT tbl_pre_alert.*, (select tbl_customers.first_name from tbl_customers where tbl_pre_alert.customer_name = tbl_customers.login_id) as customer_firstname,
                                                                        (select tbl_customers.last_name from tbl_customers where tbl_pre_alert.customer_name = tbl_customers.login_id) as customer_lastname,
                                                                        (select tbl_courier_companies.companies_name from tbl_courier_companies where tbl_pre_alert.courier_company = tbl_courier_companies.id) as company FROM tbl_pre_alert WHERE customer_name = '${role_data.id}' ORDER BY id DESC`)
            res.render("pre_alert_list", {
                role_data : role_data, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                pre_alert_data : pre_alert_data,
                accessdata
            })
        }
        
    } catch (error) {
        console.log(error);
    }
})


router.get("/add_pre_alert", auth, async(req, res) => {
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

        const courier_company_data = await mySqlQury(`SELECT * FROM tbl_courier_companies`)
        
        res.render("add_pre_alert", {
            role_data : role_data, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            courier_company_data : courier_company_data,
            accessdata
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/add_pre_alert", auth, upload.single('image'), async(req, res) => {
    try {
        const role_data = req.user
        const accessdata = await access (req.user)

        const {date, courier_company, tracking, store_supplier, purchase_price, description} = req.body
        const image = req.file.filename

        let da = new Date(date)
        let day = da.getDate()
        let month = da.getMonth()+1
        let year = da.getFullYear()
        let fullDate = `${year}-${month}-${day}`

        if (req.file.mimetype != "image/png" && req.file.mimetype != "image/jpg" && req.file.mimetype != "image/jpeg") {
            req.flash('errors', `Only .png, .jpg and .jpeg format allowed!`)
            return res.redirect("back")
        }

        let query = `INSERT INTO tbl_pre_alert (date, courier_company, tracking, store_supplier, purchase_price, description, image, customer_name, status, store_id) VALUE 
        ('${fullDate}', '${courier_company}', '${tracking}', '${store_supplier}', '${purchase_price}', '${description}', '${image}', '${role_data.id}', 'Pending', '${role_data.role}')`
        await mySqlQury(query)

        // ============== Notification ============= //

        let today = new Date();
        let newtime = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

        const admin_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${tracking}', '${fullDate}', '${newtime}', '${role_data.id}', 'A New Pre-Alert Has Been Registered, Please Review It', '1', '5')`
        await mySqlQury(admin_message)

        let message = {
            app_id: accessdata.data.onesignal_app_id,
            contents: {"en": "A New Pre-Alert Has Been Registered, Please Review It"},
            headings: {"en": accessdata.data.site_title},
            included_segments: ["Subscribed Users"],
            filters: [
                {"field": "tag", "key": "subscription_user_Type", "relation": "=", "value": "admin"},
                {"operator": "AND"}, {"field": "tag", "key": "Login_ID", "relation": "=", "value": "1"}
            ]
        }
        sendNotification(message);


        const cus_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${tracking}', '${fullDate}', '${newtime}', '${role_data.id}', 'The Shipment Has Been Delivered, Please Check It', '${role_data.id}', '5')`
        await mySqlQury(cus_message)

        let customer_message = {
            app_id: accessdata.data.onesignal_app_id,
            contents: {"en": "The Shipment Has Been Delivered, Please Check It"},
            headings: {"en": accessdata.data.site_title},
            included_segments: ["Subscribed Users"],
            filters: [
                {"field": "tag", "key": "subscription_user_Type", "relation": "=", "value": "customer"}, 
                {"operator": "AND"}, {"field": "tag", "key": "Login_ID", "relation": "=", "value": role_data.id}, 
            ]
        }
        sendNotification(customer_message);


        // ========= sms ============ //

        let ACCOUNT_SID = accessdata.data.twilio_sid
        let AUTH_TOKEN = accessdata.data.twilio_auth_token
        const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);
        
        client.messages
        .create({
            body: `hello ${accessdata.sms_data.add_pre_alert}`,
            from: accessdata.data.twilio_phone_no,
            to: '+916352217701'
        })
        .then(message => console.log(message.sid))



        req.flash('success', `Added successfully`)
        res.redirect("/online_shopping/pre_alert")
    } catch (error) {
        console.log(error);
    }
})

router.get("/show_image/:id", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)

        const img = req.params.id

        res.render("pre_alert_img", {
            role_data, lang_data, language_name, accessdata, img
        })
    } catch (error) {
        console.log(error);
    }
})



// ========== register_packages =============== //


router.get("/register_packages", auth, async(req, res) => {
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
        
        const prefix_data = await mySqlQury(`SELECT * FROM tbl_shipping_prefix WHERE type = '1'`)
        const agencies_list = await mySqlQury(`SELECT * FROM tbl_agency_group`)
        const office_group_list = await mySqlQury(`SELECT * FROM tbl_office_group`)
        const customers_list = await mySqlQury(`SELECT * FROM tbl_customers WHERE customer_active = 1`)
        const logistics_service_list = await mySqlQury(`SELECT * FROM tbl_logistics_service`)
        const packaging_list = await mySqlQury("SELECT * FROM tbl_packaging")
        const courier_companies_list = await mySqlQury(`SELECT * FROM tbl_courier_companies`)
        const shipping_modes_list = await mySqlQury(`SELECT * FROM tbl_shipping_modes`)
        const shipping_times_list = await mySqlQury(`SELECT * FROM tbl_shipping_times`)
        const drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE active = 1`)

        const register_packages = await mySqlQury(`SELECT * FROM tbl_register_packages`)

        const taxe_data = await mySqlQury(`SELECT * FROM tbl_taxes`)
        console.log(taxe_data);

        let table = 'register_packages'

        if (register_packages.length < 100) {
            let invoice = '0000' + (register_packages.length + 1)

            res.render("add_register_packages", {
                role_data : role_data, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                agencies_list : agencies_list,
                office_group_list : office_group_list,
                customers_list : customers_list,
                logistics_service_list : logistics_service_list,
                packaging_list : packaging_list,
                courier_companies_list : courier_companies_list,
                shipping_modes_list : shipping_modes_list,
                shipping_times_list : shipping_times_list,
                drivers_list : drivers_list,
                invoice, prefix_data,
                table,
                taxe_data : taxe_data[0],
                accessdata,
                
            })
        }else if (register_packages.length > 100) {
            let invoice = '000' + (register_packages.length + 1)
            
            res.render("add_register_packages", {
                role_data : role_data, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                agencies_list : agencies_list,
                office_group_list : office_group_list,
                customers_list : customers_list,
                logistics_service_list : logistics_service_list,
                packaging_list : packaging_list,
                courier_companies_list : courier_companies_list,
                shipping_modes_list : shipping_modes_list,
                shipping_times_list : shipping_times_list,
                drivers_list : drivers_list,
                invoice, prefix_data,
                table,
                taxe_data : taxe_data[0],
                accessdata,
                
            })
        }else if (register_packages.length > 1000) {
            let invoice = '00' + (register_packages.length + 1)
            
            res.render("add_register_packages", {
                role_data : role_data, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                agencies_list : agencies_list,
                office_group_list : office_group_list,
                customers_list : customers_list,
                logistics_service_list : logistics_service_list,
                packaging_list : packaging_list,
                courier_companies_list : courier_companies_list,
                shipping_modes_list : shipping_modes_list,
                shipping_times_list : shipping_times_list,
                drivers_list : drivers_list,
                invoice, prefix_data,
                table,
                taxe_data : taxe_data[0],
                accessdata,
                
            })
        } else if (register_packages.length > 10000) {
            let invoice = '0' + (register_packages.length + 1)
            
            res.render("add_register_packages", {
                role_data : role_data, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                agencies_list : agencies_list,
                office_group_list : office_group_list,
                customers_list : customers_list,
                logistics_service_list : logistics_service_list,
                packaging_list : packaging_list,
                courier_companies_list : courier_companies_list,
                shipping_modes_list : shipping_modes_list,
                shipping_times_list : shipping_times_list,
                drivers_list : drivers_list,
                invoice, prefix_data,
                table,
                taxe_data : taxe_data[0],
                accessdata,
                
            })
        }else {
            let invoice = (register_packages.length + 1)
            
            res.render("add_register_packages", {
                role_data : role_data, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                agencies_list : agencies_list,
                office_group_list : office_group_list,
                customers_list : customers_list,
                logistics_service_list : logistics_service_list,
                packaging_list : packaging_list,
                courier_companies_list : courier_companies_list,
                shipping_modes_list : shipping_modes_list,
                shipping_times_list : shipping_times_list,
                drivers_list : drivers_list,
                invoice, prefix_data,
                table,
                taxe_data : taxe_data[0],
                accessdata,
                
            })
        }


    } catch (error) {
        console.log(error);
    }
})

router.get("/add_pre_alert_packages/:id", auth, async(req, res) => {
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

        const pre_alert_data = await mySqlQury(`SELECT * FROM tbl_pre_alert WHERE id = '${req.params.id}'`)
        

        const prefix_data = await mySqlQury(`SELECT * FROM tbl_shipping_prefix WHERE type = '1'`)
        const agencies_list = await mySqlQury(`SELECT * FROM tbl_agency_group`)
        const office_group_list = await mySqlQury(`SELECT * FROM tbl_office_group`)
        const customers_list = await mySqlQury(`SELECT * FROM tbl_customers WHERE customer_active = 1`)
        const logistics_service_list = await mySqlQury(`SELECT * FROM tbl_logistics_service`)
        const packaging_list = await mySqlQury("SELECT * FROM tbl_packaging")
        const courier_companies_list = await mySqlQury(`SELECT * FROM tbl_courier_companies`)
        const shipping_modes_list = await mySqlQury(`SELECT * FROM tbl_shipping_modes`)
        const shipping_times_list = await mySqlQury(`SELECT * FROM tbl_shipping_times`)
        const drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE active = 1`)


        const edit_customers_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE login_id = '${pre_alert_data[0].customer_name}'`)
        const country = edit_customers_data[0].customers_country.split(',');
        const state = edit_customers_data[0].customers_state.split(',');
        const city = edit_customers_data[0].customers_city.split(',');
        const zipcode = edit_customers_data[0].customers_zipcode.split(',');
        const address = edit_customers_data[0].customers_address.split(',');
        const countries_list = await mySqlQury("SELECT * FROM tbl_countries")
        const state_list = await mySqlQury("SELECT * FROM tbl_states")
        const city_list = await mySqlQury("SELECT * FROM tbl_city")


        const register_packages = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const taxe_data = await mySqlQury(`SELECT * FROM tbl_taxes`)

        let table = 'pre_alert'

        if (register_packages.length < 100) {
            let invoice = '0000' + (register_packages.length + 1)

            res.render("add_register_packages", {
                role_data : role_data, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                agencies_list : agencies_list,
                office_group_list : office_group_list,
                customers_list : customers_list,
                logistics_service_list : logistics_service_list,
                packaging_list : packaging_list,
                courier_companies_list : courier_companies_list,
                shipping_modes_list : shipping_modes_list,
                shipping_times_list : shipping_times_list,
                drivers_list : drivers_list,
                invoice, prefix_data,
                taxe_data : taxe_data[0],
                accessdata,
                table, country, state, city, zipcode, address, countries_list, state_list, city_list,
                pre_alert_data : pre_alert_data[0]
                
            })
        }else if (register_packages.length > 100) {
            let invoice = '000' + (register_packages.length + 1)
            
            res.render("add_register_packages", {
                role_data : role_data, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                agencies_list : agencies_list,
                office_group_list : office_group_list,
                customers_list : customers_list,
                logistics_service_list : logistics_service_list,
                packaging_list : packaging_list,
                courier_companies_list : courier_companies_list,
                shipping_modes_list : shipping_modes_list,
                shipping_times_list : shipping_times_list,
                drivers_list : drivers_list,
                invoice, prefix_data,
                taxe_data : taxe_data[0],
                accessdata,
                table, country, state, city, zipcode, address, countries_list, state_list, city_list,
                pre_alert_data : pre_alert_data[0]
                
            })
        }else if (register_packages.length > 1000) {
            let invoice = '00' + (register_packages.length + 1)
            
            res.render("add_register_packages", {
                role_data : role_data, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                agencies_list : agencies_list,
                office_group_list : office_group_list,
                customers_list : customers_list,
                logistics_service_list : logistics_service_list,
                packaging_list : packaging_list,
                courier_companies_list : courier_companies_list,
                shipping_modes_list : shipping_modes_list,
                shipping_times_list : shipping_times_list,
                drivers_list : drivers_list,
                invoice, prefix_data,
                taxe_data : taxe_data[0],
                accessdata,
                table, country, state, city, zipcode, address, countries_list, state_list, city_list,
                pre_alert_data : pre_alert_data[0]
                
            })
        }else if (register_packages.length > 10000) {
            let invoice = '0' + (register_packages.length + 1)
            
            res.render("add_register_packages", {
                role_data : role_data, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                agencies_list : agencies_list,
                office_group_list : office_group_list,
                customers_list : customers_list,
                logistics_service_list : logistics_service_list,
                packaging_list : packaging_list,
                courier_companies_list : courier_companies_list,
                shipping_modes_list : shipping_modes_list,
                shipping_times_list : shipping_times_list,
                drivers_list : drivers_list,
                invoice, prefix_data,
                taxe_data : taxe_data[0],
                accessdata,
                table, country, state, city, zipcode, address, countries_list, state_list, city_list,
                pre_alert_data : pre_alert_data[0]
                
            })
        }else {
            let invoice = (register_packages.length + 1)
            
            res.render("add_register_packages", {
                role_data : role_data, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                agencies_list : agencies_list,
                office_group_list : office_group_list,
                customers_list : customers_list,
                logistics_service_list : logistics_service_list,
                packaging_list : packaging_list,
                courier_companies_list : courier_companies_list,
                shipping_modes_list : shipping_modes_list,
                shipping_times_list : shipping_times_list,
                drivers_list : drivers_list,
                invoice, prefix_data,
                taxe_data : taxe_data[0],
                accessdata,
                table, country, state, city, zipcode, address, countries_list, state_list, city_list,
                pre_alert_data : pre_alert_data[0]
                
            })
        }

    } catch (error) {
        console.log(error);
    }
})

router.get("/address/ajax/:id", auth, async(req, res) => {
    try {
        const edit_customers_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${req.params.id}'`)
        console.log(edit_customers_data);
        
        const country = edit_customers_data[0].customers_country.split(',');
        const state = edit_customers_data[0].customers_state.split(',');
        const city = edit_customers_data[0].customers_city.split(',');
        const zipcode = edit_customers_data[0].customers_zipcode.split(',');
        const address = edit_customers_data[0].customers_address.split(',');
        
        const countries_list = await mySqlQury("SELECT * FROM tbl_countries")
        const state_list = await mySqlQury("SELECT * FROM tbl_states")
        const city_list = await mySqlQury("SELECT * FROM tbl_city")
        console.log(city_list);

        res.status(200).json({ edit_customers_data : edit_customers_data[0], country, countries_list, state, state_list, city, city_list, zipcode, address })
    } catch (error) {
        console.log(error);
    }
})

router.post("/register_packages", auth, upload.single('image'), async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const accessdata = await access (req.user)
        
        const {prefix, invoice, agency, office_of_origin, customer, customer_address, tracking_no, supplier, purchase_price, shipping_mode, packaging, courier_company, service_mode,
            delivery_time, assign_driver, package_name, package_description, package_amount, weight, length, width, height, weight_vol, f_charge, decvalue, total_weight,
            total_weight_vol, total_decvalue, add_price_kg, add_discount, add_value_assured, 
            add_shipping_insurance, add_customs_duties, add_tax, tax_count, add_declared_value, subtotal, discount, shipping_insurance, customs_duties, tax, declared_value, fixed_charge, reissue, total } = req.body
        const image = req.file.filename

        if (req.file.mimetype != "image/png" && req.file.mimetype != "image/jpg" && req.file.mimetype != "image/jpeg") {
            req.flash('errors', `Only .png, .jpg and .jpeg format allowed!`)
            return res.redirect("back")
        }
        
        let date = new Date()
        let day = date.getDate()
        let month = date.getMonth()+1
        let year = date.getFullYear()

        let fullDate = `${year}-${month}-${day}`
            
        let register_packages_query = `INSERT INTO tbl_register_packages (invoice, date, agency, office_of_origin, customer, customer_address, tracking_no, supplier, purchase_price, shipping_mode, packaging, courier_company,
            service_mode, delivery_time, assign_driver, status, image, package_name, package_description, package_amount, weight, length, width, height, weight_vol, f_charge, decvalue,
            total_weight, total_weight_vol, total_decvalue, add_price_kg, add_discount, add_value_assured, add_shipping_insurance, add_customs_duties, add_tax, tax_count, add_declared_value, subtotal, discount, shipping_insurance,
            customs_duties, tax, declared_value, fixed_charge, reissue, total, due_amount, store_id) VALUE ('${prefix}${invoice}', '${fullDate}', '${agency}', '${office_of_origin}', '${customer}', '${customer_address}', '${tracking_no}', '${supplier}',
            '${purchase_price}', '${shipping_mode}', '${packaging}', '${courier_company}', '${service_mode}', '${delivery_time}', '${assign_driver}', '${1}', '${image}', '${package_name}', '${package_description}',
            '${package_amount}', '${weight}', '${length}', '${width}', '${height}', '${weight_vol}', '${f_charge}', '${decvalue}', '${total_weight}', '${total_weight_vol}',
            '${total_decvalue}', '${add_price_kg}', '${add_discount}', '${add_value_assured}',
            '${add_shipping_insurance}', '${add_customs_duties}', '${add_tax}', '${tax_count}', '${add_declared_value}', '${subtotal}', '${discount}', '${shipping_insurance}', '${customs_duties}',
            '${tax}', '${declared_value}', '${fixed_charge}', '${reissue}', '${total}', '${total}', '${role_data.role}')`

        await mySqlQury(register_packages_query)

        if (req.body.pre_alert_data_id) {
            let pre_alert_data =`UPDATE tbl_pre_alert SET status = 'Approved' WHERE id = '${req.body.pre_alert_data_id}'`
            await mySqlQury(pre_alert_data)
        }

        
        let today = new Date();
        let newtime = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

        let query = `INSERT INTO tbl_tracking_history (invoice, type, office, delivery_status, date, time, message, page) VALUE
        ('WIL${invoice}', 'register_packages', '${office_of_origin}', '1', '${fullDate}', '${newtime}', 'Shipment created', '1')`
        await mySqlQury(query)
        

        // =========== email ========== //

        const page = 'register_packages'
        const new_data = await mySqlQury(`SELECT * FROM tbl_register_packages WHERE invoice = 'WIL${invoice}'`)

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

        let transporter = nodemailer.createTransport({
            // service: 'gmail',
            host: 'smtp.hostinger.com',
            port: 465,
            auth: {
              user: email_data[0].email,
              pass: email_data[0].email_password
            }
        });

        const data = await ejs.renderFile(__dirname + "/../views" + "/email.ejs", {page, accessdata, lang_data, package_name_list, package_description_list,
            package_amount_list, weight_list, length_list, width_list, height_list, weight_vol_list, f_charge_list, decvalue_list, new_data, customer_data});
    
        let mailOptions = {
            from: email_data[0].email,
            to: customer_data[0].email,
            subject: 'Register Packages',
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
            body: `We have successfully processed your shipment and it is now en route to the destination. You can track your package using the tracking number ${prefix}${invoice}. Thank you for using our services, we appreciate your business!`,
            from: accessdata.data.twilio_phone_no,
            to: customer_data[0].country_code+customer_data[0].mobile
        })
        .then(message => console.log(message.sid))


        // ============== Notification ============= //

        const admin_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${prefix}${invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new package registered, please check it.', '1', '1')`
        await mySqlQury(admin_message)

        const cus_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${prefix}${invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new package registered, please check it.', '${customer_data[0].login_id}', '1')`
        await mySqlQury(cus_message)

        const dri_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${prefix}${invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new package registered, please check it.', '${driver_data[0].login_id}', '1')`
        await mySqlQury(dri_message)

        let message = { 
            app_id: accessdata.data.onesignal_app_id,
            contents: {"en": "There is a new package registered, please check it."},
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


        req.flash('success', `Added successfully`)
        res.redirect("/online_shopping/list_of_packages")
    } catch (error) {
        console.log(error);
    }
})


// ========== list_of_packages =============== //

router.get("/list_of_packages", auth, async(req, res) => {
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
       
        if (role_data.role == '1') {
            
            let register_packages = await mySqlQury(`SELECT tbl_register_packages.*, (select tbl_customers.first_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_firstname,
                                                                                        (select tbl_customers.last_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_lastname,
                                                                                        (select tbl_courier_companies.companies_name from tbl_courier_companies where tbl_register_packages.courier_company = tbl_courier_companies.id) as courier_companies,
                                                                                        (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_register_packages.status = tbl_shipping_status.id) as shipping_status,
                                                                                        (select tbl_drivers.first_name from tbl_drivers where tbl_register_packages.assign_driver = tbl_drivers.id) as driver_firstname,
                                                                                        (select tbl_drivers.last_name from tbl_drivers where tbl_register_packages.assign_driver = tbl_drivers.id) as driver_lastname
                                                                                        FROM tbl_register_packages ORDER BY id DESC`)
                                                                                                                                         
            const drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE active = 1`)
            
            res.render("list_of_packages", {
                role_data : role_data, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                register_packages : register_packages,
                accessdata, drivers_list
            })
        } else if (role_data.role == '2') {
            
            const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE login_id = '${role_data.id}'`)

            let register_packages = await mySqlQury(`SELECT tbl_register_packages.*, (select tbl_customers.first_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_firstname,
                                                                                        (select tbl_customers.last_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_lastname,
                                                                                        (select tbl_courier_companies.companies_name from tbl_courier_companies where tbl_register_packages.courier_company = tbl_courier_companies.id) as courier_companies,
                                                                                        (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_register_packages.status = tbl_shipping_status.id) as shipping_status,
                                                                                        (select tbl_drivers.first_name from tbl_drivers where tbl_register_packages.assign_driver = tbl_drivers.id) as driver_firstname,
                                                                                        (select tbl_drivers.last_name from tbl_drivers where tbl_register_packages.assign_driver = tbl_drivers.id) as driver_lastname
                                                                                        FROM tbl_register_packages WHERE customer = '${customer_data[0].id}' ORDER BY id DESC`)
                                                                                                                                         
            const drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE active = 1`)
            
            res.render("list_of_packages", {
                role_data : role_data, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                register_packages : register_packages,
                accessdata, drivers_list
            })
        } else {
            const drivers_data = await mySqlQury(`SELECT * FROM tbl_drivers WHERE login_id = '${role_data.id}'`)

            let register_packages = await mySqlQury(`SELECT tbl_register_packages.*, (select tbl_customers.first_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_firstname,
                                                                                        (select tbl_customers.last_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_lastname,
                                                                                        (select tbl_courier_companies.companies_name from tbl_courier_companies where tbl_register_packages.courier_company = tbl_courier_companies.id) as courier_companies,
                                                                                        (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_register_packages.status = tbl_shipping_status.id) as shipping_status,
                                                                                        (select tbl_drivers.first_name from tbl_drivers where tbl_register_packages.assign_driver = tbl_drivers.id) as driver_firstname,
                                                                                        (select tbl_drivers.last_name from tbl_drivers where tbl_register_packages.assign_driver = tbl_drivers.id) as driver_lastname
                                                                                        FROM tbl_register_packages WHERE assign_driver = '${drivers_data[0].id}' ORDER BY id DESC`)
                                                                                                                                         
            const drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE active = 1`)
            
            res.render("list_of_packages", {
                role_data : role_data, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                register_packages : register_packages,
                accessdata, drivers_list
            })
        }
         
    } catch (error) {
        console.log(error);
    }
})


// ========== assigndriver ============ //

router.post("/assigndriver", auth, async(req, res) => {
    try {
        const role_data = req.user
        const accessdata = await access (req.user)
        
        await mySqlQury(`UPDATE tbl_register_packages SET assign_driver = '${req.body.assign_driver}' WHERE id = '${req.body.hidden_id}'`)
        
        // ============== Notification ============= //
        
        const register_package_data = await mySqlQury(`SELECT * FROM tbl_register_packages WHERE id = '${req.body.hidden_id}'`)

        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${register_package_data[0].customer}'`)
        const driver_data = await mySqlQury(`SELECT * FROM tbl_drivers WHERE id = '${req.body.assign_driver}'`)

        let date = new Date()
        let day = date.getDate()
        let month = date.getMonth()+1
        let year = date.getFullYear()
        let fullDate = `${year}-${month}-${day}`

        let today = new Date();
        let newtime = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })


        if (role_data.role == '1') {
            
            const admin_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${register_package_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new driver assign, please check it.', '1', '1')`
            await mySqlQury(admin_message)
    
            const cus_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${register_package_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new driver assign, please check it.', '${customer_data[0].login_id}', '1')`
            await mySqlQury(cus_message)
    
            const dri_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${register_package_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new driver assign, please check it.', '${driver_data[0].login_id}', '1')`
            await mySqlQury(dri_message)
    
            let message = { 
                app_id: accessdata.data.onesignal_app_id,
                contents: {"en": "There is a new driver assign, please check it."},
                headings: {"en": accessdata.data.site_title},
                included_segments: ["Subscribed Users"],
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
            
            const admin_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${register_package_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new driver assign, please check it.', '1', '1')`
            await mySqlQury(admin_message)
    
            const cus_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${register_package_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new driver assign, please check it.', '${customer_data[0].login_id}', '1')`
            await mySqlQury(cus_message)
    
            const dri_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${register_package_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new driver assign, please check it.', '${driver_data[0].login_id}', '1')`
            await mySqlQury(dri_message)
    
            let message = {
                app_id: accessdata.data.onesignal_app_id,
                contents: {"en": "There is a new driver assign, please check it."},
                headings: {"en": accessdata.data.site_title},
                included_segments: ["Subscribed Users"],
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
        res.redirect("/online_shopping/list_of_packages")
    } catch (error) {
        console.log(error);
    }
})


// ========== show_register_packages =========== //

router.get("/show_register_packages/:id", auth, async(req, res) => {
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

        const register_packages = await mySqlQury(`SELECT * FROM tbl_register_packages WHERE id = '${req.params.id}'`)

        const shipping_status_data = await mySqlQury(`SELECT * FROM tbl_shipping_status WHERE status_checkbox = '1'`)
        const agency_group_data = await mySqlQury(`SELECT * FROM tbl_agency_group WHERE id = '${register_packages[0].agency}'`)
        const office_group_list = await mySqlQury(`SELECT * FROM tbl_office_group WHERE id = '${register_packages[0].office_of_origin}'`)
        const shipping_times_list = await mySqlQury(`SELECT * FROM tbl_shipping_times WHERE id = '${register_packages[0].delivery_time}'`)
        const packaging_list = await mySqlQury(`SELECT * FROM tbl_packaging WHERE id = '${register_packages[0].packaging}'`)
        const courier_companies_list = await mySqlQury(`SELECT * FROM tbl_courier_companies WHERE id = '${register_packages[0].courier_company}'`)
        const shipping_modes_list = await mySqlQury(`SELECT * FROM tbl_shipping_modes WHERE id = '${register_packages[0].service_mode}'`)
        const logistics_service_list = await mySqlQury(`SELECT * FROM tbl_logistics_service WHERE id = '${register_packages[0].shipping_mode}'`)

        const package_name_list = register_packages[0].package_name.split(',')
        const package_description_list = register_packages[0].package_description.split(',')
        const package_amount_list = register_packages[0].package_amount.split(',')
        const weight_list = register_packages[0].weight.split(',')
        const length_list = register_packages[0].length.split(',')
        const width_list = register_packages[0].width.split(',')
        const height_list = register_packages[0].height.split(',')
        const weight_vol_list = register_packages[0].weight_vol.split(',')
        const f_charge_list = register_packages[0].f_charge.split(',')
        const decvalue_list = register_packages[0].decvalue.split(',')

        const sender_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${register_packages[0].customer}'`)

        const customers_address = sender_data[0].customers_address.split(',')
        const customers_country = sender_data[0].customers_country.split(',')
        const customers_city = sender_data[0].customers_city.split(',')

        const country_name = await mySqlQury(`SELECT * FROM tbl_countries`)
        const city_name = await mySqlQury(`SELECT * FROM tbl_city`)

        const drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE active = 1`)

        const tracking_data = await mySqlQury(`SELECT tbl_tracking_history.*, (select tbl_countries.countries_name from tbl_countries where tbl_tracking_history.location = tbl_countries.id) as countries_name,
                                                                            (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_tracking_history.delivery_status = tbl_shipping_status.id) as status_name
                                                                            FROM tbl_tracking_history WHERE invoice = '${register_packages[0].invoice}' AND type = 'register_packages'`)
        console.log(tracking_data);
        
        res.render("show_register_packages", {
            role_data : role_data, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            accessdata,
            data : register_packages[0],
            shipping_status_data : shipping_status_data,
            agency : agency_group_data[0],
            office : office_group_list[0],
            delivery_time : shipping_times_list[0],
            packaging : packaging_list[0],
            courier_companies : courier_companies_list[0],
            shipping_modes : shipping_modes_list[0],
            logistics_service : logistics_service_list[0],
            package_name_list, package_description_list, package_amount_list, weight_list, length_list, width_list, height_list, drivers_list,
            weight_vol_list, f_charge_list, decvalue_list, customers_address, customers_country, customers_city, country_name, city_name,
            sender_data : sender_data[0], tracking_data
        })
    } catch (error) {
        console.log(error);
    }
})


// =========== edit_register_packages ============== //

router.get("/edit_register_packages/:id", auth, async(req, res) => {
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

        const register_packages = await mySqlQury(`SELECT * FROM tbl_register_packages WHERE id = '${req.params.id}'`)
        console.log(register_packages);

        const agencies_list = await mySqlQury(`SELECT * FROM tbl_agency_group`)
        const office_group_list = await mySqlQury(`SELECT * FROM tbl_office_group`)
        const customers_list = await mySqlQury(`SELECT * FROM tbl_customers WHERE customer_active = 1`)
        const logistics_service_list = await mySqlQury(`SELECT * FROM tbl_logistics_service`)
        const packaging_list = await mySqlQury("SELECT * FROM tbl_packaging")
        const courier_companies_list = await mySqlQury(`SELECT * FROM tbl_courier_companies`)
        const shipping_modes_list = await mySqlQury(`SELECT * FROM tbl_shipping_modes`)
        const shipping_times_list = await mySqlQury(`SELECT * FROM tbl_shipping_times`)
        const shipping_status_list = await mySqlQury(`SELECT * FROM tbl_shipping_status WHERE status_checkbox = '1'`)
        const taxe_data = await mySqlQury(`SELECT * FROM tbl_taxes`)

        const edit_customers_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${register_packages[0].customer}'`)
        const country = edit_customers_data[0].customers_country.split(',');
        const state = edit_customers_data[0].customers_state.split(',');
        const city = edit_customers_data[0].customers_city.split(',');
        const zipcode = edit_customers_data[0].customers_zipcode.split(',');
        const address = edit_customers_data[0].customers_address.split(',');
        const countries_list = await mySqlQury("SELECT * FROM tbl_countries")
        const state_list = await mySqlQury("SELECT * FROM tbl_states")
        const city_list = await mySqlQury("SELECT * FROM tbl_city")

        const package_name_list = register_packages[0].package_name.split(',')
        const package_description_list = register_packages[0].package_description.split(',')
        const package_amount_list = register_packages[0].package_amount.split(',')
        const weight_list = register_packages[0].weight.split(',')
        const length_list = register_packages[0].length.split(',')
        const width_list = register_packages[0].width.split(',')
        const height_list = register_packages[0].height.split(',')
        const weight_vol_list = register_packages[0].weight_vol.split(',')
        const f_charge_list = register_packages[0].f_charge.split(',')
        const decvalue_list = register_packages[0].decvalue.split(',')
        
        res.render("edit_register_packages", {
            role_data : role_data, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            agencies_list : agencies_list,
            office_group_list : office_group_list,
            customers_list : customers_list,
            logistics_service_list : logistics_service_list,
            packaging_list : packaging_list,
            courier_companies_list : courier_companies_list,
            shipping_modes_list : shipping_modes_list,
            shipping_times_list : shipping_times_list,
            shipping_status_list : shipping_status_list,
            taxe_data : taxe_data[0],
            register_packages : register_packages[0],
            accessdata,
            country, state, city, zipcode, address, countries_list, state_list, city_list,
            package_name_list, package_description_list, package_amount_list, weight_list, length_list, width_list, height_list, weight_vol_list, f_charge_list, decvalue_list
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/edit_register_packages/:id", auth, upload.single('image'), async(req, res) => {
    try {
        const {agency, office_of_origin, customer, customer_address, tracking_no, supplier, purchase_price, shipping_mode, packaging, courier_company, service_mode,
            delivery_time, status_name, hidden_image, package_name, package_description, package_amount, weight, length, width, height, weight_vol, f_charge, decvalue,
            total_weight, total_weight_vol, total_decvalue, add_price_kg, add_discount, add_value_assured, add_shipping_insurance, add_customs_duties, add_tax, tax_count, add_declared_value, subtotal, discount, shipping_insurance,
            customs_duties, tax, declared_value, fixed_charge, reissue, total} = req.body

            let date = new Date()
            let day = date.getDate()
            let month = date.getMonth()+1
            let year = date.getFullYear()
            let fullDate = `${year}-${month}-${day}`

            const register_packages = await mySqlQury(`SELECT * FROM tbl_register_packages WHERE id = '${req.params.id}'`)
            
            let due = parseFloat(total) - parseFloat(register_packages[0].paid_amount)

            if (hidden_image == 0) {

                let query = `UPDATE tbl_register_packages SET date = '${fullDate}', agency = '${agency}', office_of_origin = '${office_of_origin}', customer = '${customer}', customer_address = '${customer_address}',
                tracking_no = '${tracking_no}', supplier = '${supplier}', purchase_price = '${purchase_price}', shipping_mode = '${shipping_mode}', packaging = '${packaging}', courier_company = '${courier_company}',
                service_mode = '${service_mode}', delivery_time = '${delivery_time}', status = '${status_name}', package_name = '${package_name}', package_description = '${package_description}',
                package_amount = '${package_amount}', weight = '${weight}', length = '${length}', width = '${width}', height = '${height}', weight_vol = '${weight_vol}', f_charge = '${f_charge}', decvalue = '${decvalue}',
                total_weight = '${total_weight}', total_weight_vol = '${total_weight_vol}', total_decvalue = '${total_decvalue}', add_price_kg = '${add_price_kg}', 
                add_discount = '${add_discount}', add_value_assured = '${add_value_assured}', add_shipping_insurance = '${add_shipping_insurance}', add_customs_duties = '${add_customs_duties}',
                add_tax = '${add_tax}', tax_count = '${tax_count}', add_declared_value = '${add_declared_value}', subtotal = '${subtotal}', discount = '${discount}', shipping_insurance = '${shipping_insurance}',
                customs_duties = '${customs_duties}', tax = '${tax}', declared_value = '${declared_value}', fixed_charge = '${fixed_charge}', reissue = '${reissue}', total = '${total}', due_amount = '${due}' WHERE id = '${req.params.id}'`
                
                await mySqlQury(query)
            } else {
                let image = req.file.filename

                if (req.file.mimetype == "image/png" && req.file.mimetype == "image/jpg" && req.file.mimetype == "image/jpeg") {
                    
                    let query = `UPDATE tbl_register_packages SET date = '${fullDate}', agency = '${agency}', office_of_origin = '${office_of_origin}', customer = '${customer}', customer_address = '${customer_address}',
                    tracking_no = '${tracking_no}', supplier = '${supplier}', purchase_price = '${purchase_price}', shipping_mode = '${shipping_mode}', packaging = '${packaging}', courier_company = '${courier_company}',
                    service_mode = '${service_mode}', delivery_time = '${delivery_time}', status = '${status_name}', image = '${image}', package_name = '${package_name}', package_description = '${package_description}',
                    package_amount = '${package_amount}', weight = '${weight}', length = '${length}', width = '${width}', height = '${height}', weight_vol = '${weight_vol}', f_charge = '${f_charge}', decvalue = '${decvalue}',
                    add_price_kg = '${add_price_kg}', add_discount = '${add_discount}', add_value_assured = '${add_value_assured}', add_shipping_insurance = '${add_shipping_insurance}', add_customs_duties = '${add_customs_duties}',
                    add_tax = '${add_tax}', tax_count = '${tax_count}', add_declared_value = '${add_declared_value}', subtotal = '${subtotal}', discount = '${discount}', shipping_insurance = '${shipping_insurance}',
                    customs_duties = '${customs_duties}', tax = '${tax}', declared_value = '${declared_value}', fixed_charge = '${fixed_charge}', reissue = '${reissue}', total = '${total}', due_amount = '${due}' WHERE id = '${req.params.id}'`
                    
                    await mySqlQury(query)
                } else {
                    req.flash('errors', `Only .png, .jpg and .jpeg format allowed!`)
                    return res.redirect("back")
                }
                
            }


            let tracking_data = `UPDATE tbl_tracking_history SET delivery_status = '${status_name}' WHERE invoice = '${register_packages[0].invoice}' AND page = '1'`
            await mySqlQury(tracking_data)


        req.flash('success', `Added successfully`)
        res.redirect("/online_shopping/list_of_packages")
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

        const register_packages_data = await mySqlQury(`SELECT * FROM tbl_register_packages WHERE id = '${req.params.id}'`)
        console.log(register_packages_data);

        const countries_data = await mySqlQury(`SELECT * FROM tbl_countries `)
        const office = await mySqlQury(`SELECT * FROM tbl_office_group`)
        const shipping_status_data = await mySqlQury(`SELECT * FROM tbl_shipping_status WHERE status_checkbox = '1'`)

        
        res.render("register_packages_tracking", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            register_packages_data : register_packages_data[0],
            countries_data, office, shipping_status_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/shipment_tracking/:id", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const accessdata = await access (req.user)

        const {location, address, office, delivery_status, message} = req.body

        const packages_data = await mySqlQury(`SELECT * FROM tbl_register_packages WHERE id = '${req.params.id}'`)
        console.log(packages_data);

        let adddate = new Date()
        let day = adddate.getDate()
        let month = adddate.getMonth()+1
        let year = adddate.getFullYear()
        let fullDate = `${year}-${month}-${day}`

        let today = new Date();
        let newtime = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

        let query = `INSERT INTO tbl_tracking_history (invoice, type, location, address, office, delivery_status, date, time, message) VALUE
        ('${packages_data[0].invoice}', 'register_packages', '${location}', '${address}', '${office}', '${delivery_status}', '${fullDate}', '${newtime}', '${message}')`
        await mySqlQury(query)

        let edit_package = `UPDATE tbl_register_packages SET status = '${delivery_status}' WHERE id = '${req.params.id}'`
        await mySqlQury(edit_package)
        

        // =========== email ========== //

        const page = 'register_packages_status'

        const package_name_list = packages_data[0].package_name.split(',')
        const package_description_list = packages_data[0].package_description.split(',')
        const package_amount_list = packages_data[0].package_amount.split(',')
        const weight_list = packages_data[0].weight.split(',')
        const length_list = packages_data[0].length.split(',')
        const width_list = packages_data[0].width.split(',')
        const height_list = packages_data[0].height.split(',')
        const weight_vol_list = packages_data[0].weight_vol.split(',')
        const f_charge_list = packages_data[0].f_charge.split(',')
        const decvalue_list = packages_data[0].decvalue.split(',')

        const email_data = await mySqlQury(`SELECT * FROM tbl_email_settings`)
        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${packages_data[0].customer}'`)
        console.log(customer_data);
        const driver_data = await mySqlQury(`SELECT * FROM tbl_drivers WHERE id = '${packages_data[0].assign_driver}'`)
        const status_data = await mySqlQury(`SELECT * FROM tbl_shipping_status WHERE id = '${delivery_status}'`)

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: email_data[0].email,
              pass: email_data[0].email_password
            }
        });

        const data = await ejs.renderFile(__dirname + "/../views" + "/email.ejs", {page, accessdata, lang_data, package_name_list, package_description_list, status_data,
            package_amount_list, weight_list, length_list, width_list, height_list, weight_vol_list, f_charge_list, decvalue_list, new_data : packages_data, customer_data});
    
        let mailOptions = {
            from: email_data[0].email,
            to: customer_data[0].email,
            subject: 'Register Packages',
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
            body: `We have successfully processed your shipment and it is now en route to the destination. You can track your package using the tracking number ${packages_data[0].invoice}. Thank you for using our services, we appreciate your business!`,
            from: accessdata.data.twilio_phone_no,
            to: customer_data[0].country_code+customer_data[0].mobile
        })
        .then(message => console.log(message.sid))


        // ============== Notification ============= //

        const admin_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${packages_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'The shipment status has been updated, please check it', '1', '1')`
        await mySqlQury(admin_message)

        const cus_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${packages_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'The shipment status has been updated, please check it', '${customer_data[0].login_id}', '1')`
        await mySqlQury(cus_message)

        const dri_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${packages_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'The shipment status has been updated, please check it', '${driver_data[0].login_id}', '1')`
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
        res.redirect("/online_shopping/list_of_packages")
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

        const packages_data = await mySqlQury(`SELECT * FROM tbl_register_packages WHERE id = '${req.params.id}'`)
        const drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE active = 1`)
        
        
        res.render("register_packages_deliver", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            packages_data : packages_data[0],
            drivers_list
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/deliver_shipment/:id", auth, upload.single('image'), async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const accessdata = await access (req.user)
        
        const {assign_driver, person_receives, hidden_image} = req.body

        const packages_data = await mySqlQury(`SELECT * FROM tbl_register_packages WHERE id = '${req.params.id}'`)

        let adddate = new Date()
        let day = adddate.getDate()
        let month = adddate.getMonth()+1
        let year = adddate.getFullYear()
        let fullDate = `${year}-${month}-${day}`

        let today = new Date();
        let newtime = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

        if (hidden_image == 0) {
            
            let query = `INSERT INTO tbl_tracking_history (invoice, type, date, time, assign_driver, person_receives, delivery_status) VALUE 
            ('${packages_data[0].invoice}', 'register_packages', '${fullDate}', '${newtime}', '${assign_driver}', '${person_receives}', '6')`
            await mySqlQury(query)
        } else {
            let image = req.file.filename
            if (req.file.mimetype != "image/png" && req.file.mimetype != "image/jpg" && req.file.mimetype != "image/jpeg") {
                req.flash('errors', `Only .png, .jpg and .jpeg format allowed!`)
                return res.redirect("back")
            }

            let query = `INSERT INTO tbl_tracking_history (invoice, type, date, time, assign_driver, person_receives, image, delivery_status) VALUE 
            ('${packages_data[0].invoice}', 'register_packages', '${fullDate}', '${newtime}', '${assign_driver}', '${person_receives}', '${image}', '6')`
            await mySqlQury(query)
        }

        let edit_packages = `UPDATE tbl_register_packages SET status = '6' WHERE id = '${req.params.id}'`
        await mySqlQury(edit_packages)


        // =========== email ========== //

        const page = 'register_packages_status'

        const package_name_list = packages_data[0].package_name.split(',')
        const package_description_list = packages_data[0].package_description.split(',')
        const package_amount_list = packages_data[0].package_amount.split(',')
        const weight_list = packages_data[0].weight.split(',')
        const length_list = packages_data[0].length.split(',')
        const width_list = packages_data[0].width.split(',')
        const height_list = packages_data[0].height.split(',')
        const weight_vol_list = packages_data[0].weight_vol.split(',')
        const f_charge_list = packages_data[0].f_charge.split(',')
        const decvalue_list = packages_data[0].decvalue.split(',')

        const email_data = await mySqlQury(`SELECT * FROM tbl_email_settings`)
        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${packages_data[0].customer}'`)
        const driver_data = await mySqlQury(`SELECT * FROM tbl_drivers WHERE id = '${packages_data[0].assign_driver}'`)
        const status_data = await mySqlQury(`SELECT * FROM tbl_shipping_status WHERE id = '6'`)

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: email_data[0].email,
              pass: email_data[0].email_password
            }
        });

        const data = await ejs.renderFile(__dirname + "/../views" + "/email.ejs", {page, accessdata, lang_data, package_name_list, package_description_list, status_data,
            package_amount_list, weight_list, length_list, width_list, height_list, weight_vol_list, f_charge_list, decvalue_list, new_data : packages_data, customer_data});
    
        let mailOptions = {
            from: email_data[0].email,
            to: customer_data[0].email,
            subject: 'Register Packages',
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
            body: `Hi ${customer_data[0].first_name} ${customer_data[0].last_name}, your order #${packages_data[0].invoice} has been delivered.`,
            from: accessdata.data.twilio_phone_no,
            to: customer_data[0].country_code+customer_data[0].mobile
        })
        .then(message => console.log(message.sid))



        // ============== Notification ============= //

        

        const admin_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${packages_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'The shipment has been delivered, please check it', '1', '1')`
        await mySqlQury(admin_message)

        const cus_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${packages_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'The shipment has been delivered, please check it', '${customer_data[0].login_id}', '1')`
        await mySqlQury(cus_message)

        const dri_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${packages_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'The shipment has been delivered, please check it', '${driver_data[0].login_id}', '1')`
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
        res.redirect("/online_shopping/list_of_packages")
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

        const register_data = await mySqlQury(`SELECT * FROM tbl_register_packages WHERE id = '${req.params.id}'`)
        console.log(register_data);

        let query = `INSERT INTO tbl_payment (store_id, date, invoice, type, paid_amount) VALUE ('${register_data[0].customer}', '${fullDate}', '${register_data[0].invoice}',
        'register_packages', '${paid_amount}')`
        await mySqlQury(query)

        let due = parseFloat(register_data[0].due_amount) - parseFloat(paid_amount)
        let paid = parseFloat(register_data[0].paid_amount) + parseFloat(paid_amount)
        
        let update_register_data = `UPDATE tbl_register_packages SET paid_amount = '${paid}', due_amount = '${due}' WHERE id = '${req.params.id}'`
        await mySqlQury(update_register_data)


        // ============== Notification ============= //
    
        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${register_data[0].customer}'`)

        
        let today = new Date();
        let newtime = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

        const admin_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${register_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'Shipping payment has been added, please check', '1', '1')`
        await mySqlQury(admin_message)

        const cus_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${register_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'Shipping payment has been added, please check', '${customer_data[0].login_id}', '1')`
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
        res.redirect("/online_shopping/list_of_packages")
    } catch (error) {
        console.log(error);
    }
})


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

        const register_packages_data = await mySqlQury(`SELECT tbl_register_packages.*, (select tbl_logistics_service.service_name from tbl_logistics_service where tbl_register_packages.shipping_mode = tbl_logistics_service.id) as service_name,
                                                                                        (select tbl_courier_companies.companies_name from tbl_courier_companies where tbl_register_packages.courier_company = tbl_courier_companies.id) as companies_name,
                                                                                        (select tbl_shipping_modes.shipping_modes from tbl_shipping_modes where tbl_register_packages.service_mode = tbl_shipping_modes.id) as shipping_modes
                                                                                        FROM tbl_register_packages WHERE id = '${req.params.id}'`)
                                                                                        
        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${register_packages_data[0].customer}'`)
        console.log(customer_data);

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
        
        res.render("print_packages", {
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

        const data = await mySqlQury(`SELECT * FROM tbl_register_packages WHERE id = '${req.params.id}'`)
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
        let type = 1

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