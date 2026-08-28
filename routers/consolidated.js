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

// ========= list_of_consolidated ========== //

router.get("/list_of_consolidated", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 5`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)

        let customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE login_id = '${role_data.id}'`)

        if (role_data.role == '1') {

            let consolidated_data = await mySqlQury(`SELECT tbl_consolidated.*, (select tbl_customers.first_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_firstname,
                                                                                    (select tbl_customers.last_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_lastname,
                                                                                    (select tbl_client.first_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_firstname,
                                                                                    (select tbl_client.last_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_lastname,
                                                                                    (select tbl_payment_type.payment_type from tbl_payment_type where tbl_consolidated.payment_type = tbl_payment_type.id) as payment,
                                                                                    (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_consolidated.delivery_status = tbl_shipping_status.id) as status,
                                                                                    (select tbl_drivers.first_name from tbl_drivers where tbl_consolidated.assign_driver = tbl_drivers.id) as driver_firstname,
                                                                                    (select tbl_drivers.last_name from tbl_drivers where tbl_consolidated.assign_driver = tbl_drivers.id) as driver_lastname FROM tbl_consolidated ORDER BY id DESC`)

            const drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE active = 1`)
        
            res.render("list_of_consolidated", {
                role_data : role_data, accessdata, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                consolidated_data : consolidated_data,
                drivers_list
            })
            
        } else if (role_data.role == '2') {

            let consolidated_data = await mySqlQury(`SELECT tbl_consolidated.*, (select tbl_customers.first_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_firstname,
                                                                                    (select tbl_customers.last_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_lastname,
                                                                                    (select tbl_client.first_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_firstname,
                                                                                    (select tbl_client.last_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_lastname,
                                                                                    (select tbl_payment_type.payment_type from tbl_payment_type where tbl_consolidated.payment_type = tbl_payment_type.id) as payment,
                                                                                    (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_consolidated.delivery_status = tbl_shipping_status.id) as status,
                                                                                    (select tbl_drivers.first_name from tbl_drivers where tbl_consolidated.assign_driver = tbl_drivers.id) as driver_firstname,
                                                                                    (select tbl_drivers.last_name from tbl_drivers where tbl_consolidated.assign_driver = tbl_drivers.id) as driver_lastname FROM tbl_consolidated WHERE customer = '${customer_data[0].id}' ORDER BY id DESC`)

            const drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE active = 1`)
        
            res.render("list_of_consolidated", {
                role_data : role_data, accessdata, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                consolidated_data : consolidated_data,
                drivers_list
            })
            
        } else {
            const drivers_data = await mySqlQury(`SELECT * FROM tbl_drivers WHERE login_id = '${role_data.id}'`)
            let consolidated_data = await mySqlQury(`SELECT tbl_consolidated.*, (select tbl_customers.first_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_firstname,
                                                                                    (select tbl_customers.last_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_lastname,
                                                                                    (select tbl_client.first_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_firstname,
                                                                                    (select tbl_client.last_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_lastname,
                                                                                    (select tbl_payment_type.payment_type from tbl_payment_type where tbl_consolidated.payment_type = tbl_payment_type.id) as payment,
                                                                                    (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_consolidated.delivery_status = tbl_shipping_status.id) as status,
                                                                                    (select tbl_drivers.first_name from tbl_drivers where tbl_consolidated.assign_driver = tbl_drivers.id) as driver_firstname,
                                                                                    (select tbl_drivers.last_name from tbl_drivers where tbl_consolidated.assign_driver = tbl_drivers.id) as driver_lastname FROM tbl_consolidated WHERE assign_driver = '${drivers_data[0].id}' ORDER BY id DESC`)
            
            const drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE active = 1`)
        
            res.render("list_of_consolidated", {
                role_data : role_data, accessdata, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                consolidated_data : consolidated_data,
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

        await mySqlQury(`UPDATE tbl_consolidated SET assign_driver = '${req.body.assign_driver}' WHERE id = '${req.body.hidden_id}'`)

        // ============== Notification ============= //
        
        const consolidated_data = await mySqlQury(`SELECT * FROM tbl_consolidated WHERE id = '${req.body.hidden_id}'`)

        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${consolidated_data[0].customer}'`)
        const driver_data = await mySqlQury(`SELECT * FROM tbl_drivers WHERE id = '${req.body.assign_driver}'`)

        let date = new Date()
        let day = date.getDate()
        let month = date.getMonth()+1
        let year = date.getFullYear()
        let fullDate = `${year}-${month}-${day}`

        let today = new Date();
        let newtime = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

        if (role_data.role == '1') {
            
            const admin_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${consolidated_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new driver assign, please check it.', '1', '4')`
            await mySqlQury(admin_message)
    
            const cus_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${consolidated_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new driver assign, please check it.', '${customer_data[0].login_id}', '4')`
            await mySqlQury(cus_message)
    
            const dri_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${consolidated_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new driver assign, please check it.', '${driver_data[0].login_id}', '4')`
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
            
            const admin_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${consolidated_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new driver assign, please check it.', '1', '4')`
            await mySqlQury(admin_message)
    
            const cus_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${consolidated_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new driver assign, please check it.', '${customer_data[0].login_id}', '4')`
            await mySqlQury(cus_message)
    
            const dri_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${consolidated_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new driver assign, please check it.', '${driver_data[0].login_id}', '4')`
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
        res.redirect("/consolidated/list_of_consolidated")
        
    } catch (error) {
        console.log(error);
    }
})


// =========== add_consolidated ========== //

router.get("/add_consolidated", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 5`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)

        const shipment_data = await mySqlQury(`SELECT * FROM tbl_consolidated`)
        if (shipment_data.length < 100) {
            let invoice = '0000' + (shipment_data.length + 1)

            const prefix_data = await mySqlQury(`SELECT * FROM tbl_shipping_prefix WHERE type = '4'`)
            const agencies_list = await mySqlQury(`SELECT * FROM tbl_agency_group`)
            const office_group_list = await mySqlQury(`SELECT * FROM tbl_office_group`)
            const customers_list = await mySqlQury(`SELECT * FROM tbl_customers WHERE customer_active = 1`)
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


            res.render("add_consolidated", {
                role_data : role_data,accessdata, lang_data, language_name, prefix_data, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                invoice, agencies_list, office_group_list, customers_list, logistics_service_list, payment_type,
                packaging_list, courier_companies_list, shipping_modes_list, shipping_times_list, drivers_list,
                payment_methods_data, shipping_status_data,
                taxe_data : taxe_data[0]
            })
        }else if (shipment_data.length > 100) {
            let invoice = '000' + (shipment_data.length + 1)

            const prefix_data = await mySqlQury(`SELECT * FROM tbl_shipping_prefix WHERE type = '4'`)
            const agencies_list = await mySqlQury(`SELECT * FROM tbl_agency_group`)
            const office_group_list = await mySqlQury(`SELECT * FROM tbl_office_group`)
            const customers_list = await mySqlQury(`SELECT * FROM tbl_customers WHERE customer_active = 1`)
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


            res.render("add_consolidated", {
                role_data : role_data,accessdata, lang_data, language_name, prefix_data, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                invoice, agencies_list, office_group_list, customers_list, logistics_service_list, payment_type,
                packaging_list, courier_companies_list, shipping_modes_list, shipping_times_list, drivers_list,
                payment_methods_data, shipping_status_data,
                taxe_data : taxe_data[0]
            })
        }else if (shipment_data.length > 1000) {
            let invoice = '00' + (shipment_data.length + 1)

            const prefix_data = await mySqlQury(`SELECT * FROM tbl_shipping_prefix WHERE type = '4'`)
            const agencies_list = await mySqlQury(`SELECT * FROM tbl_agency_group`)
            const office_group_list = await mySqlQury(`SELECT * FROM tbl_office_group`)
            const customers_list = await mySqlQury(`SELECT * FROM tbl_customers WHERE customer_active = 1`)
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


            res.render("add_consolidated", {
                role_data : role_data,accessdata, lang_data, language_name, prefix_data, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                invoice, agencies_list, office_group_list, customers_list, logistics_service_list, payment_type,
                packaging_list, courier_companies_list, shipping_modes_list, shipping_times_list, drivers_list,
                payment_methods_data, shipping_status_data,
                taxe_data : taxe_data[0]
            })
        }else if (shipment_data.length > 10000) {
            let invoice = '0' + (shipment_data.length + 1)

            const prefix_data = await mySqlQury(`SELECT * FROM tbl_shipping_prefix WHERE type = '4'`)
            const agencies_list = await mySqlQury(`SELECT * FROM tbl_agency_group`)
            const office_group_list = await mySqlQury(`SELECT * FROM tbl_office_group`)
            const customers_list = await mySqlQury(`SELECT * FROM tbl_customers WHERE customer_active = 1`)
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


            res.render("add_consolidated", {
                role_data : role_data,accessdata, lang_data, language_name, prefix_data, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                invoice, agencies_list, office_group_list, customers_list, logistics_service_list, payment_type,
                packaging_list, courier_companies_list, shipping_modes_list, shipping_times_list, drivers_list,
                payment_methods_data, shipping_status_data,
                taxe_data : taxe_data[0]
            })
        }else {
            let invoice = (shipment_data.length + 1)

            const prefix_data = await mySqlQury(`SELECT * FROM tbl_shipping_prefix WHERE type = '4'`)
            const agencies_list = await mySqlQury(`SELECT * FROM tbl_agency_group`)
            const office_group_list = await mySqlQury(`SELECT * FROM tbl_office_group`)
            const customers_list = await mySqlQury(`SELECT * FROM tbl_customers WHERE customer_active = 1`)
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


            res.render("add_consolidated", {
                role_data : role_data,accessdata, lang_data, language_name, prefix_data, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                invoice, agencies_list, office_group_list, customers_list, logistics_service_list, payment_type,
                packaging_list, courier_companies_list, shipping_modes_list, shipping_times_list, drivers_list,
                payment_methods_data, shipping_status_data,
                taxe_data : taxe_data[0]
            })
        }

        
    } catch (error) {
        console.log(error);
    }
})

router.get("/find_shipment/ajax", auth, async(req, res) => {
    try {
        const shipment_list = await mySqlQury(`SELECT tbl_shipment.*, (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_shipment.delivery_status = tbl_shipping_status.id) as shipping_status FROM tbl_shipment WHERE delivery_status = '3' OR delivery_status = '4'`)

        res.status(200).json({shipment_list})
    } catch (error) {
        console.log(error);
    }
})

router.post("/add_consolidated", auth, upload.single('image'), async(req, res) => {
    try {
      
        const accessdata = await access (req.user)
        const role_data = req.user

        const {prefix, invoice, stamps, agency, office_of_origin, customer, customer_address, client, client_address, shipping_mode, packaging,
            courier_company, service_mode, payment_type, delivery_time, estimated_date, delivery_status, assign_driver, shipment_invoice, shipment_weight,
            shipment_weight_vol, total_weight, total_weight_vol, add_price_kg, add_discount, add_value_assured, add_shipping_insurance, 
            add_customs_duties, add_tax, tax_count, subtotal, discount, shipping_insurance, customs_duties, tax, reissue, total} = req.body

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


            if (typeof shipment_invoice == 'string') {
                
                const shipment_data = mySqlQury(`UPDATE tbl_shipment SET delivery_status = '5' WHERE invoice = '${shipment_invoice}'`)
                console.log(shipment_data);

                let query = `INSERT INTO tbl_consolidated (invoice, date, stamps, agency, office_of_origin, customer, customer_address, client, client_address, shipping_mode, 
                    packaging, courier_company, service_mode, payment_type, delivery_time, estimated_date, delivery_status, assign_driver, image, shipment_invoice, 
                    shipment_weight, shipment_weight_vol, total_weight, total_weight_vol, add_price_kg, add_discount, add_value_assured, add_shipping_insurance, add_customs_duties,
                    add_tax, tax_count, subtotal, discount, shipping_insurance, customs_duties, tax, reissue, total, due_amount) VALUE ('${prefix}${invoice}', '${fullDate}', '${stamps}',
                    '${agency}', '${office_of_origin}', '${customer}', '${customer_address}', '${client}', '${client_address}', '${shipping_mode}', '${packaging}', '${courier_company}',
                    '${service_mode}', '${payment_type}', '${delivery_time}', '${estimated_date}', '${delivery_status}', '${assign_driver}', '${image}', '${shipment_invoice}',
                    '${shipment_weight}', '${shipment_weight_vol}', '${total_weight}', '${total_weight_vol}', '${add_price_kg}', '${add_discount}', '${add_value_assured}', 
                    '${add_shipping_insurance}', '${add_customs_duties}', '${add_tax}', '${tax_count}', '${subtotal}', '${discount}', '${shipping_insurance}', '${customs_duties}', 
                    '${tax}', '${reissue}', '${total}', '${total}')`
                await mySqlQury(query)

            } else {

                shipment_invoice.forEach((data) => {
                    
                    const shipment_data = mySqlQury(`UPDATE tbl_shipment SET delivery_status = '5' WHERE invoice = '${data}'`)
                    console.log(shipment_data);
                })

                let query = `INSERT INTO tbl_consolidated (invoice, date, stamps, agency, office_of_origin, customer, customer_address, client, client_address, shipping_mode, 
                    packaging, courier_company, service_mode, payment_type, delivery_time, estimated_date, delivery_status, assign_driver, image, shipment_invoice, 
                    shipment_weight, shipment_weight_vol, total_weight, total_weight_vol, add_price_kg, add_discount, add_value_assured, add_shipping_insurance, add_customs_duties,
                    add_tax, tax_count, subtotal, discount, shipping_insurance, customs_duties, tax, reissue, total, due_amount) VALUE ('${prefix}${invoice}', '${fullDate}', '${stamps}',
                    '${agency}', '${office_of_origin}', '${customer}', '${customer_address}', '${client}', '${client_address}', '${shipping_mode}', '${packaging}', '${courier_company}',
                    '${service_mode}', '${payment_type}', '${delivery_time}', '${estimated_date}', '${delivery_status}', '${assign_driver}', '${image}', '${shipment_invoice}',
                    '${shipment_weight}', '${shipment_weight_vol}', '${total_weight}', '${total_weight_vol}', '${add_price_kg}', '${add_discount}', '${add_value_assured}', 
                    '${add_shipping_insurance}', '${add_customs_duties}', '${add_tax}', '${tax_count}', '${subtotal}', '${discount}', '${shipping_insurance}', '${customs_duties}', 
                    '${tax}', '${reissue}', '${total}', '${total}')`
                await mySqlQury(query)
            }    
            
            
            let today = new Date();
            let newtime = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

            let query = `INSERT INTO tbl_tracking_history (invoice, type, office, delivery_status, date, time, message, page) VALUE
            ('${prefix}${invoice}', '5', '${office_of_origin}', '${delivery_status}', '${fullDate}', '${newtime}', 'Shipment created', '1')`
            await mySqlQury(query)

        // =========== email ========== //

        const page = 'consolidated'
        const new_data = await mySqlQury(`SELECT * FROM tbl_consolidated WHERE invoice = '${prefix}${invoice}'`)
        
        const shipment_invoice_list = new_data[0].shipment_invoice.split(',')
        const shipment_weight_list = new_data[0].shipment_weight.split(',')
        const shipment_weight_vol_list = new_data[0].shipment_weight_vol.split(',')
            
        const email_data = await mySqlQury(`SELECT * FROM tbl_email_settings`)
        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${customer}'`)
        const client_data = await mySqlQury(`SELECT * FROM tbl_client WHERE id = '${client}'`)
        const driver_data = await mySqlQury(`SELECT * FROM tbl_drivers WHERE id = '${assign_driver}'`)

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: email_data[0].email,
              pass: email_data[0].email_password
            }
        });

        const data = await ejs.renderFile(__dirname + "/../views" + "/email.ejs", {page, accessdata, shipment_invoice_list, shipment_weight_list, client_data,
            shipment_weight_vol_list, new_data, customer_data});
        
        let mailOptions = {
            from: email_data[0].email,
            to: customer_data[0].email,
            subject: 'Consolidated',
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

        const admin_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${prefix}${invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new shipment, please check it.', '1', '4')`
        await mySqlQury(admin_message)

        const cus_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${prefix}${invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new shipment, please check it.', '${customer_data[0].login_id}', '4')`
        await mySqlQury(cus_message)

        const dri_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${prefix}${invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'There is a new shipment, please check it.', '${driver_data[0].login_id}', '4')`
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


        req.flash('success', `Added successfully`)
        res.redirect("/consolidated/list_of_consolidated")
        
    } catch (error) {
        console.log(error);
    }
})


// ========= show_consolidated =========== //

router.get("/show_consolidated/:id", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 5`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)

        const consolidated_data = await mySqlQury(`SELECT tbl_consolidated.*, (select tbl_agency_group.agency_name from tbl_agency_group where tbl_consolidated.agency = tbl_agency_group.id) as agency_name,
                                                                            (select tbl_shipping_times.shipping_times from tbl_shipping_times where tbl_consolidated.delivery_time = tbl_shipping_times.id) as deliverytime,
                                                                            (select tbl_office_group.office_name from tbl_office_group where tbl_consolidated.office_of_origin = tbl_office_group.id) as office_group_name,
                                                                            (select tbl_packaging.packaging_type from tbl_packaging where tbl_consolidated.packaging = tbl_packaging.id) as packaging_name,
                                                                            (select tbl_payment_type.payment_type from tbl_payment_type where tbl_consolidated.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                            (select tbl_logistics_service.service_name from tbl_logistics_service where tbl_consolidated.shipping_mode = tbl_logistics_service.id) as shipping_mode_name,
                                                                            (select tbl_courier_companies.companies_name from tbl_courier_companies where tbl_consolidated.courier_company = tbl_courier_companies.id) as courier_companies_name,
                                                                            (select tbl_shipping_modes.shipping_modes from tbl_shipping_modes where tbl_consolidated.service_mode = tbl_shipping_modes.id) as service_mode_name,
                                                                            (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_consolidated.delivery_status = tbl_shipping_status.id) as shipping_status 
                                                                            FROM tbl_consolidated WHERE id = '${req.params.id}'`)
        console.log(consolidated_data);

        const tracking_data = await mySqlQury(`SELECT tbl_tracking_history.*, (select tbl_countries.countries_name from tbl_countries where tbl_tracking_history.location = tbl_countries.id) as countries_name,
                                                                            (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_tracking_history.delivery_status = tbl_shipping_status.id) as status_name
                                                                            FROM tbl_tracking_history WHERE invoice = '${consolidated_data[0].invoice}' AND type = 'consolidated'`)
        
        
        const shipment_invoice_list = consolidated_data[0].shipment_invoice.split(',')
        const shipment_weight_list = consolidated_data[0].shipment_weight.split(',')
        const shipment_weight_vol_list = consolidated_data[0].shipment_weight_vol.split(',')

        const sender_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${consolidated_data[0].customer}'`)

        const customers_address = sender_data[0].customers_address.split(',')
        const customers_country = sender_data[0].customers_country.split(',')
        const customers_city = sender_data[0].customers_city.split(',')

        const country_name = await mySqlQury(`SELECT * FROM tbl_countries`)
        const city_name = await mySqlQury(`SELECT * FROM tbl_city`)

        const drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE active = 1`)

        res.render("show_consolidated", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            consolidated_data : consolidated_data[0],
            tracking_data, shipment_invoice_list, shipment_weight_list, shipment_weight_vol_list,
            sender_data : sender_data[0],
            customers_address, customers_country, customers_city, country_name, city_name, drivers_list
        })
    } catch (error) {
        console.log(error);
    }
})


// ========= edit_consolidated ========== //

router.get("/edit_consolidated/:id", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 5`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)

        const consolidated_data = await mySqlQury(`SELECT * FROM tbl_consolidated WHERE id = '${req.params.id}'`)
        console.log(consolidated_data);

        const agencies_list = await mySqlQury(`SELECT * FROM tbl_agency_group`)
        const office_group_list = await mySqlQury(`SELECT * FROM tbl_office_group`)
        const customers_list = await mySqlQury(`SELECT * FROM tbl_customers WHERE customer_active = 1`)

        const edit_customers_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${consolidated_data[0].customer}'`)
        const country = edit_customers_data[0].customers_country.split(',');
        const state = edit_customers_data[0].customers_state.split(',');
        const city = edit_customers_data[0].customers_city.split(',');
        const zipcode = edit_customers_data[0].customers_zipcode.split(',');
        const address = edit_customers_data[0].customers_address.split(',');
        const countries_list = await mySqlQury("SELECT * FROM tbl_countries")
        const state_list = await mySqlQury("SELECT * FROM tbl_states")
        const city_list = await mySqlQury("SELECT * FROM tbl_city")
        const client_list = await mySqlQury(`SELECT * FROM tbl_client WHERE customer = '${consolidated_data[0].customer}'`)
        const edit_client_data = await mySqlQury(`SELECT * FROM tbl_client WHERE id = '${consolidated_data[0].client}'`)
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

        const shipment_invoice_data = consolidated_data[0].shipment_invoice.split(',')
        const shipment_weight_data = consolidated_data[0].shipment_weight.split(',')
        const shipment_weight_vol_data = consolidated_data[0].shipment_weight_vol.split(',')
        
        res.render("edit_consolidated", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            consolidated_data : consolidated_data[0],
            agencies_list, office_group_list, customers_list, country, state, city, zipcode, address, countries_list, state_list, city_list,
            client_list, client_country, client_state, client_city, client_zipcode, client_address, logistics_service_list, payment_type,
            packaging_list, courier_companies_list, shipping_modes_list, shipping_times_list, drivers_list,
            payment_methods_data, shipping_status_data,
            taxe_data : taxe_data[0], shipment_invoice_data, shipment_weight_data, shipment_weight_vol_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/edit_consolidated/:id", auth, upload.single('image'), async(req, res) => {
    try {
        
        const {stamps, agency, office_of_origin, customer, customer_address, client, client_address, shipping_mode, packaging,
            courier_company, service_mode, payment_type, delivery_time, estimated_date, delivery_status, assign_driver, hidden_image, 
            shipment_invoice, shipment_weight, shipment_weight_vol, total_weight, total_weight_vol, add_price_kg, add_discount, add_value_assured,
            add_shipping_insurance, add_customs_duties, add_tax, tax_count, subtotal, discount, shipping_insurance, customs_duties, tax,
            reissue, total} = req.body

            let date = new Date()
            let day = date.getDate()
            let month = date.getMonth()+1
            let year = date.getFullYear()
            let fullDate = `${year}-${month}-${day}`

            const consolidated_data = await mySqlQury(`SELECT * FROM tbl_consolidated WHERE id = '${req.params.id}'`)

            let due = parseFloat(total) - parseFloat(consolidated_data[0].paid_amount)

            if (hidden_image == 0) {

                let query = `UPDATE tbl_consolidated SET date = '${fullDate}', stamps = '${stamps}', agency = '${agency}', office_of_origin = '${office_of_origin}', customer = '${customer}',
                customer_address = '${customer_address}', client = '${client}', client_address = '${client_address}', shipping_mode = '${shipping_mode}', packaging = '${packaging}',
                courier_company = '${courier_company}', service_mode = '${service_mode}', payment_type = '${payment_type}', delivery_time = '${delivery_time}', estimated_date = '${estimated_date}',
                delivery_status = '${delivery_status}', assign_driver = '${assign_driver}', shipment_invoice = '${shipment_invoice}', shipment_weight = '${shipment_weight}', 
                shipment_weight_vol = '${shipment_weight_vol}', total_weight = '${total_weight}', total_weight_vol = '${total_weight_vol}', add_price_kg = '${add_price_kg}', 
                add_discount = '${add_discount}', add_value_assured = '${add_value_assured}', add_shipping_insurance = '${add_shipping_insurance}', add_customs_duties = '${add_customs_duties}', 
                add_tax = '${add_tax}', tax_count = '${tax_count}', subtotal = '${subtotal}', discount ='${discount}', shipping_insurance = '${shipping_insurance}', customs_duties = '${customs_duties}',
                tax = '${tax}', reissue = '${reissue}', total = '${total}', due_amount = '${due}' WHERE id = '${req.params.id}'`
                await mySqlQury(query)
            } else { 
                let image = req.file.filename

                if (req.file.mimetype != "image/png" && req.file.mimetype != "image/jpg" && req.file.mimetype != "image/jpeg") {
                    req.flash('errors', `Only .png, .jpg and .jpeg format allowed!`)
                    return res.redirect("back")
                }

                let query = `UPDATE tbl_consolidated SET date = '${fullDate}', stamps = '${stamps}', agency = '${agency}', office_of_origin = '${office_of_origin}', customer = '${customer}',
                customer_address = '${customer_address}', client = '${client}', client_address = '${client_address}', shipping_mode = '${shipping_mode}', packaging = '${packaging}',
                courier_company = '${courier_company}', service_mode = '${service_mode}', payment_type = '${payment_type}', delivery_time = '${delivery_time}', estimated_date = '${estimated_date}',
                delivery_status = '${delivery_status}', assign_driver = '${assign_driver}', image = '${image}', shipment_invoice = '${shipment_invoice}', shipment_weight = '${shipment_weight}', 
                shipment_weight_vol = '${shipment_weight_vol}', total_weight = '${total_weight}', total_weight_vol = '${total_weight_vol}', add_price_kg = '${add_price_kg}', 
                add_discount = '${add_discount}', add_value_assured = '${add_value_assured}', add_shipping_insurance = '${add_shipping_insurance}', add_customs_duties = '${add_customs_duties}', 
                add_tax = '${add_tax}', tax_count = '${tax_count}', subtotal = '${subtotal}', discount ='${discount}', shipping_insurance = '${shipping_insurance}', customs_duties = '${customs_duties}',
                tax = '${tax}', reissue = '${reissue}', total = '${total}', due_amount = '${due}' WHERE id = '${req.params.id}'`
                await mySqlQury(query)
            }
            

            let tracking_data = `UPDATE tbl_tracking_history SET delivery_status = '${delivery_status}' WHERE invoice = '${consolidated_data[0].invoice}' AND page = '1'`
            await mySqlQury(tracking_data)
            
            req.flash('success', `Added successfully`)
            res.redirect("/consolidated/list_of_consolidated")
            
    } catch (error) {
        console.log(error);
    }
})


// =========== shipment_tracking ========= //

router.get("/shipment_tracking/:id", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 5`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)

        const consolidated_data = await mySqlQury(`SELECT * FROM tbl_consolidated WHERE id = '${req.params.id}'`)

        const countries_data = await mySqlQury(`SELECT * FROM tbl_countries `)
        const office = await mySqlQury(`SELECT * FROM tbl_office_group`)
        const shipping_status_data = await mySqlQury(`SELECT * FROM tbl_shipping_status WHERE status_checkbox = '1'`)

        
        res.render("consolidated_shipment_tracking", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            consolidated_data : consolidated_data[0],
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

        const consolidated_data = await mySqlQury(`SELECT * FROM tbl_consolidated WHERE id = '${req.params.id}'`)

        let adddate = new Date()
        let day = adddate.getDate()
        let month = adddate.getMonth()+1
        let year = adddate.getFullYear()
        let fullDate = `${year}-${month}-${day}`

        let today = new Date();
        let newtime = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

        let query = `INSERT INTO tbl_tracking_history (invoice, type, location, address, office, delivery_status, date, time, message) VALUE
        ('${consolidated_data[0].invoice}', 'consolidated', '${location}', '${address}', '${office}', '${delivery_status}', '${fullDate}', '${newtime}', '${message}')`
        await mySqlQury(query)

        let edit_shipment = `UPDATE tbl_consolidated SET delivery_status = '${delivery_status}' WHERE id = '${req.params.id}'`
        await mySqlQury(edit_shipment)

        // =========== email ========== //

        const page = 'consolidated_status'
        
        const shipment_invoice_list = consolidated_data[0].shipment_invoice.split(',')
        const shipment_weight_list = consolidated_data[0].shipment_weight.split(',')
        const shipment_weight_vol_list = consolidated_data[0].shipment_weight_vol.split(',')
            
        const email_data = await mySqlQury(`SELECT * FROM tbl_email_settings`)
        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${consolidated_data[0].customer}'`)
        const client_data = await mySqlQury(`SELECT * FROM tbl_client WHERE id = '${consolidated_data[0].client}'`)
        const driver_data = await mySqlQury(`SELECT * FROM tbl_drivers WHERE id = '${consolidated_data[0].assign_driver}'`)
        const status_data = await mySqlQury(`SELECT * FROM tbl_shipping_status WHERE id = '${delivery_status}'`)

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: email_data[0].email,
              pass: email_data[0].email_password
            }
        });

        const data = await ejs.renderFile(__dirname + "/../views" + "/email.ejs", {page, accessdata, shipment_invoice_list, shipment_weight_list, client_data,
            shipment_weight_vol_list, new_data : consolidated_data, customer_data, status_data});
        
        let mailOptions = {
            from: email_data[0].email,
            to: customer_data[0].email,
            subject: 'Consolidated',
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
            body: `We have successfully processed your shipment and it is now en route to the destination. You can track your package using the tracking number ${consolidated_data[0].invoice}. Thank you for using our services, we appreciate your business!`,
            from: accessdata.data.twilio_phone_no,
            to: customer_data[0].country_code+customer_data[0].mobile
        })
        .then(message => console.log(message.sid))


        // ============== Notification ============= //

        const admin_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${consolidated_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'The shipment status has been updated, please check it', '1', '4')`
        await mySqlQury(admin_message)

        const cus_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${consolidated_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'The shipment status has been updated, please check it', '${customer_data[0].login_id}', '4')`
        await mySqlQury(cus_message)

        const dri_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${consolidated_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'The shipment status has been updated, please check it', '${driver_data[0].login_id}', '4')`
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
        res.redirect("/consolidated/list_of_consolidated")
        
    } catch (error) {
        console.log(error);
    }
})

// ========== deliver_shipment =========== //

router.get("/deliver_shipment/:id", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 5`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)
        
        const consolidated_data = await mySqlQury(`SELECT * FROM tbl_consolidated WHERE id = '${req.params.id}'`)
        const drivers_list = await mySqlQury(`SELECT * FROM tbl_drivers WHERE active = 1`)

        
        res.render("consolidated_deliver_shipment", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            consolidated_data : consolidated_data[0],
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

        const {assign_driver, address, hidden_image} = req.body

        const consolidated_data = await mySqlQury(`SELECT * FROM tbl_consolidated WHERE id = '${req.params.id}'`)

        let adddate = new Date()
        let day = adddate.getDate()
        let month = adddate.getMonth()+1
        let year = adddate.getFullYear()
        let fullDate = `${year}-${month}-${day}`

        let today = new Date();
        let newtime = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

        if (hidden_image == 0) {
            
            let query = `INSERT INTO tbl_tracking_history (invoice, type, date, time, assign_driver, address, delivery_status) VALUE 
            ('${consolidated_data[0].invoice}', 'consolidated', '${fullDate}', '${newtime}', '${assign_driver}', '${address}', '6')`
            await mySqlQury(query)
        } else {
            let image = req.file.filename

            if (req.file.mimetype != "image/png" && req.file.mimetype != "image/jpg" && req.file.mimetype != "image/jpeg") {
                req.flash('errors', `Only .png, .jpg and .jpeg format allowed!`)
                return res.redirect("back")
            }

            let query = `INSERT INTO tbl_tracking_history (invoice, type, date, time, assign_driver, address, image, delivery_status) VALUE 
            ('${consolidated_data[0].invoice}', 'consolidated', '${fullDate}', '${newtime}', '${assign_driver}', '${address}', '${image}', '6')`
            await mySqlQury(query)
        }

        let edit_shipment = `UPDATE tbl_consolidated SET delivery_status = '6' WHERE id = '${req.params.id}'`
        await mySqlQury(edit_shipment)

        // =========== email ========== //

        const page = 'consolidated_status'
        
        const shipment_invoice_list = consolidated_data[0].shipment_invoice.split(',')
        const shipment_weight_list = consolidated_data[0].shipment_weight.split(',')
        const shipment_weight_vol_list = consolidated_data[0].shipment_weight_vol.split(',')
            
        const email_data = await mySqlQury(`SELECT * FROM tbl_email_settings`)
        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${consolidated_data[0].customer}'`)
        const client_data = await mySqlQury(`SELECT * FROM tbl_client WHERE id = '${consolidated_data[0].client}'`)
        const driver_data = await mySqlQury(`SELECT * FROM tbl_drivers WHERE id = '${consolidated_data[0].assign_driver}'`)
        const status_data = await mySqlQury(`SELECT * FROM tbl_shipping_status WHERE id = '6'`)

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: email_data[0].email,
              pass: email_data[0].email_password
            }
        });

        const data = await ejs.renderFile(__dirname + "/../views" + "/email.ejs", {page, accessdata, shipment_invoice_list, shipment_weight_list, client_data,
            shipment_weight_vol_list, new_data : consolidated_data, customer_data, status_data});
        
        let mailOptions = {
            from: email_data[0].email,
            to: customer_data[0].email,
            subject: 'Consolidated',
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
            body: `Hi ${customer_data[0].first_name} ${customer_data[0].last_name}, your order #${consolidated_data[0].invoice} has been delivered.`,
            from: accessdata.data.twilio_phone_no,
            to: customer_data[0].country_code+customer_data[0].mobile
        })
        .then(message => console.log(message.sid))


        // ============== Notification ============= //

       

        const admin_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${consolidated_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'The shipment has been delivered, please check it', '1', '4')`
        await mySqlQury(admin_message)

        const cus_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${consolidated_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'The shipment has been delivered, please check it', '${customer_data[0].login_id}', '4')`
        await mySqlQury(cus_message)

        const dri_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${consolidated_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'The shipment has been delivered, please check it', '${driver_data[0].login_id}', '4')`
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
        res.redirect("/consolidated/list_of_consolidated")
        
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

        const shipment_data = await mySqlQury(`SELECT * FROM tbl_consolidated WHERE id = '${req.params.id}'`)
        console.log(shipment_data);

        let query = `INSERT INTO tbl_payment (store_id, date, invoice, type, paid_amount) VALUE ('${shipment_data[0].customer}', '${fullDate}', '${shipment_data[0].invoice}',
        'consolidated', '${paid_amount}')`
        await mySqlQury(query)

        let due = parseFloat(shipment_data[0].due_amount) - parseFloat(paid_amount)
        let paid = parseFloat(shipment_data[0].paid_amount) + parseFloat(paid_amount)
        
        let update_shipment_data = `UPDATE tbl_consolidated SET paid_amount = '${paid}', due_amount = '${due}' WHERE id = '${req.params.id}'`
        await mySqlQury(update_shipment_data)


        // ============== Notification ============= //
    
        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${shipment_data[0].customer}'`)
        
        
        let today = new Date();
        let newtime = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

        const admin_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${shipment_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'Shipping payment has been added, please check', '1', '4')`
        await mySqlQury(admin_message)

        const cus_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${shipment_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'Shipping payment has been added, please check', '${customer_data[0].login_id}', '4')`
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
        res.redirect("/consolidated/list_of_consolidated")
        
    } catch (error) {
        console.log(error);
    }
})


router.get("/override_shipment/:id", auth, async(req, res) => {
    try {
        
        
        let query = `UPDATE tbl_consolidated SET delivery_status = '2' WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        req.flash('success', `Cancelled successfully`)
        res.redirect("/consolidated/list_of_consolidated")
        
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
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 5`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)

        const register_packages_data = await mySqlQury(`SELECT tbl_consolidated.*, (select tbl_logistics_service.service_name from tbl_logistics_service where tbl_consolidated.shipping_mode = tbl_logistics_service.id) as service_name,
                                                                            (select tbl_courier_companies.companies_name from tbl_courier_companies where tbl_consolidated.courier_company = tbl_courier_companies.id) as companies_name,
                                                                            (select tbl_shipping_modes.shipping_modes from tbl_shipping_modes where tbl_consolidated.service_mode = tbl_shipping_modes.id) as shipping_modes,
                                                                            (select tbl_payment_type.payment_type from tbl_payment_type where tbl_consolidated.payment_type = tbl_payment_type.id) as payment_type_name
                                                                            FROM tbl_consolidated WHERE id = '${req.params.id}'`)
        
        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${register_packages_data[0].customer}'`)
        console.log(register_packages_data);

        const address = customer_data[0].customers_address.split(',')
        const country = customer_data[0].customers_country.split(',')
        const city = customer_data[0].customers_city.split(',')
        
        const country_name = await mySqlQury(`SELECT * FROM tbl_countries`)
        const city_name = await mySqlQury(`SELECT * FROM tbl_city`)
        
        const shipment_invoice_list = register_packages_data[0].shipment_invoice.split(',')
        const shipment_weight_list = register_packages_data[0].shipment_weight.split(',')
        const shipment_weight_vol_list = register_packages_data[0].shipment_weight_vol.split(',')
        
        res.render("print_consolidated", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            register_packages_data : register_packages_data[0],
            customer_data : customer_data[0], address, country, city, country_name, city_name, 
            shipment_invoice_list, shipment_weight_list, shipment_weight_vol_list
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
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 5`)
        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)

        const data = await mySqlQury(`SELECT tbl_consolidated.*, (select tbl_payment_type.payment_type from tbl_payment_type where tbl_consolidated.payment_type = tbl_payment_type.id) as paymenttype_name
        FROM tbl_consolidated WHERE id = '${req.params.id}'`)
        
        const cus_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${data[0].customer}'`)

        const cus_country = cus_data[0].customers_country.split(',')
        const cus_state = cus_data[0].customers_state.split(',')
        const cus_city = cus_data[0].customers_city.split(',')
        const cus_zipcode = cus_data[0].customers_zipcode.split(',')
        const cus_address = cus_data[0].customers_address.split(',')

        const weight_data = data[0].shipment_weight.split(',')
        const weight_vol_data = data[0].shipment_weight_vol.split(',')

        let weight = 0
        let weight_vol = 0

        weight_data.forEach(data => {
            weight += parseFloat(data)

        });

        weight_vol_data.forEach(data => {
            weight_vol += parseFloat(data)

        });

        const country = await mySqlQury(`SELECT * FROM tbl_countries`)
        const state = await mySqlQury(`SELECT * FROM tbl_states`)
        const city = await mySqlQury(`SELECT * FROM tbl_city`)

        const admin_data = await mySqlQury(`SELECT * FROM tbl_admin ORDER BY id LIMIT 1`)
        let type = 4

        res.render("print_label_packages", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            data, cus_data, cus_country, cus_state, cus_city, cus_zipcode, cus_address, weight, weight_vol,
            country, state, city, admin_data, type
        })
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;