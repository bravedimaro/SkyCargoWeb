const express = require("express");
const app = express();
const router = express.Router();
const {mySqlQury} = require('../middleware/db');
const auth = require("../middleware/auth");
const access = require('../middleware/access');


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

        let customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE login_id = '${role_data.id}'`)

        if (role_data.role == '1') {
            let pre_alert_data = await mySqlQury(`SELECT tbl_pre_alert.*, (select tbl_customers.first_name from tbl_customers where tbl_pre_alert.customer_name = tbl_customers.login_id) as customer_firstname,
                                                                            (select tbl_customers.last_name from tbl_customers where tbl_pre_alert.customer_name = tbl_customers.login_id) as customer_lastname,
                                                                            (select tbl_courier_companies.companies_name from tbl_courier_companies where tbl_pre_alert.courier_company = tbl_courier_companies.id) as company FROM tbl_pre_alert ORDER BY id DESC`)                                                     

            res.render("report_pre_alert", {
                role_data : role_data, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                pre_alert_data, accessdata
            })
        } else {
            let pre_alert_data = await mySqlQury(`SELECT tbl_pre_alert.*, (select tbl_customers.first_name from tbl_customers where tbl_pre_alert.customer_name = tbl_customers.login_id) as customer_firstname,
                                                                            (select tbl_customers.last_name from tbl_customers where tbl_pre_alert.customer_name = tbl_customers.login_id) as customer_lastname,
                                                                            (select tbl_courier_companies.companies_name from tbl_courier_companies where tbl_pre_alert.courier_company = tbl_courier_companies.id) as company 
                                                                            FROM tbl_pre_alert WHERE customer_name = '${customer_data[0].login_id}' ORDER BY id DESC`)

            res.render("report_pre_alert", {
                role_data : role_data, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                pre_alert_data, accessdata
            })
        }
        
       
    } catch (error) {
        console.log(error);
    }
})

router.post("/pre_alert/ajax", auth, async(req, res) => {
    try {
        let role_data = req.user
        
        const {start_date, end_date} = req.body

        if (role_data.role == '1') {
            
            if (start_date == "") {
                let pre_alert_data = await mySqlQury(`SELECT tbl_pre_alert.*, (select tbl_customers.first_name from tbl_customers where tbl_pre_alert.customer_name = tbl_customers.login_id) as customers_firstname,
                                                                                (select tbl_customers.last_name from tbl_customers where tbl_pre_alert.customer_name = tbl_customers.login_id) as customers_lastname,
                                                                                (select tbl_courier_companies.companies_name from tbl_courier_companies where tbl_pre_alert.courier_company = tbl_courier_companies.id) as courier_companies
                                                                                FROM tbl_pre_alert WHERE date <= '${end_date}'`)

                res.status(200).json({pre_alert_data})
            } else if (end_date == "") {
                let pre_alert_data = await mySqlQury(`SELECT tbl_pre_alert.*, (select tbl_customers.first_name from tbl_customers where tbl_pre_alert.customer_name = tbl_customers.login_id) as customers_firstname,
                                                                                (select tbl_customers.last_name from tbl_customers where tbl_pre_alert.customer_name = tbl_customers.login_id) as customers_lastname,
                                                                                (select tbl_courier_companies.companies_name from tbl_courier_companies where tbl_pre_alert.courier_company = tbl_courier_companies.id) as courier_companies
                                                                                FROM tbl_pre_alert WHERE date >= '${start_date}'`)

                res.status(200).json({pre_alert_data})

            } else {
                let pre_alert_data = await mySqlQury(`SELECT tbl_pre_alert.*, (select tbl_customers.first_name from tbl_customers where tbl_pre_alert.customer_name = tbl_customers.login_id) as customers_firstname,
                                                                                (select tbl_customers.last_name from tbl_customers where tbl_pre_alert.customer_name = tbl_customers.login_id) as customers_lastname,
                                                                                (select tbl_courier_companies.companies_name from tbl_courier_companies where tbl_pre_alert.courier_company = tbl_courier_companies.id) as courier_companies
                                                                                FROM tbl_pre_alert WHERE date >= '${start_date}' AND date <= '${end_date}'`)

                res.status(200).json({pre_alert_data})

            }
        } else {
            
            if (start_date == "") {
                let pre_alert_data = await mySqlQury(`SELECT tbl_pre_alert.*, (select tbl_customers.first_name from tbl_customers where tbl_pre_alert.customer_name = tbl_customers.login_id) as customers_firstname,
                                                                                (select tbl_customers.last_name from tbl_customers where tbl_pre_alert.customer_name = tbl_customers.login_id) as customers_lastname,
                                                                                (select tbl_courier_companies.companies_name from tbl_courier_companies where tbl_pre_alert.courier_company = tbl_courier_companies.id) as courier_companies
                                                                                FROM tbl_pre_alert WHERE date <= '${end_date}' AND customer_name = '${role_data.id}'`)
                                                                                
                res.status(200).json({pre_alert_data})
            } else if (end_date == "") {
                let pre_alert_data = await mySqlQury(`SELECT tbl_pre_alert.*, (select tbl_customers.first_name from tbl_customers where tbl_pre_alert.customer_name = tbl_customers.login_id) as customers_firstname,
                                                                                (select tbl_customers.last_name from tbl_customers where tbl_pre_alert.customer_name = tbl_customers.login_id) as customers_lastname,
                                                                                (select tbl_courier_companies.companies_name from tbl_courier_companies where tbl_pre_alert.courier_company = tbl_courier_companies.id) as courier_companies
                                                                                FROM tbl_pre_alert WHERE date >= '${start_date}' AND customer_name = '${role_data.id}'`)
                                                                                
                res.status(200).json({pre_alert_data})
            } else {
                let pre_alert_data = await mySqlQury(`SELECT tbl_pre_alert.*, (select tbl_customers.first_name from tbl_customers where tbl_pre_alert.customer_name = tbl_customers.login_id) as customers_firstname,
                                                                                (select tbl_customers.last_name from tbl_customers where tbl_pre_alert.customer_name = tbl_customers.login_id) as customers_lastname,
                                                                                (select tbl_courier_companies.companies_name from tbl_courier_companies where tbl_pre_alert.courier_company = tbl_courier_companies.id) as courier_companies
                                                                                FROM tbl_pre_alert WHERE date >= '${start_date}' AND date <= '${end_date}' AND customer_name = '${role_data.id}'`)
                                                                                
                res.status(200).json({pre_alert_data})
            }
        }

    } catch (error) {
        console.log(error);
    }
})


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

        let customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE login_id = '${role_data.id}'`)

        if (role_data.role == '1') {
            let register_packages = await mySqlQury(`SELECT tbl_register_packages.*, (select tbl_customers.first_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_firstname,
                                                                                        (select tbl_customers.last_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_lastname,
                                                                                        (select tbl_courier_companies.companies_name from tbl_courier_companies where tbl_register_packages.courier_company = tbl_courier_companies.id) as courier_companies,
                                                                                        (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_register_packages.status = tbl_shipping_status.id) as shipping_status,
                                                                                        (select tbl_drivers.first_name from tbl_drivers where tbl_register_packages.assign_driver = tbl_drivers.id) as driver_firstname,
                                                                                        (select tbl_drivers.last_name from tbl_drivers where tbl_register_packages.assign_driver = tbl_drivers.id) as driver_lastname
                                                                                        FROM tbl_register_packages ORDER BY id DESC`)

            res.render("report_register_packages", {
                role_data : role_data, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                register_packages : register_packages,
                accessdata
            })
        } else {
            let register_packages = await mySqlQury(`SELECT tbl_register_packages.*, (select tbl_customers.first_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_firstname,
                                                                                        (select tbl_customers.last_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_lastname,
                                                                                        (select tbl_courier_companies.companies_name from tbl_courier_companies where tbl_register_packages.courier_company = tbl_courier_companies.id) as courier_companies,
                                                                                        (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_register_packages.status = tbl_shipping_status.id) as shipping_status,
                                                                                        (select tbl_drivers.first_name from tbl_drivers where tbl_register_packages.assign_driver = tbl_drivers.id) as driver_firstname,
                                                                                        (select tbl_drivers.last_name from tbl_drivers where tbl_register_packages.assign_driver = tbl_drivers.id) as driver_lastname
                                                                                        FROM tbl_register_packages WHERE customer = '${customer_data[0].id}' ORDER BY id DESC`)

            res.render("report_register_packages", {
                role_data : role_data, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                register_packages : register_packages,
                accessdata
            })
        }

        
    } catch (error) {
        console.log(error);
    }
})

router.post("/report_package/ajax", auth, async(req, res) => {
    try {
        let role_data = req.user

        const {start_date, end_date} = req.body
        
        if (role_data.role == '1') {

            if (start_date == "") {
    
                let report_package_data = await mySqlQury(`SELECT tbl_register_packages.*, (select tbl_customers.first_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_firstname,
                                                                                            (select tbl_customers.last_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_lastname,
                                                                                            (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_register_packages.status = tbl_shipping_status.id) as status_name, 
                                                                                            (select tbl_drivers.first_name from tbl_drivers where tbl_register_packages.assign_driver = tbl_drivers.id) as drivers_firstname,
                                                                                            (select tbl_drivers.last_name from tbl_drivers where tbl_register_packages.assign_driver = tbl_drivers.id) as drivers_lastname
                                                                                            FROM tbl_register_packages WHERE date <= '${end_date}'`)
                                                                                            res.status(200).json({report_package_data})
            } else if (end_date == "") {
                let report_package_data = await mySqlQury(`SELECT tbl_register_packages.*, (select tbl_customers.first_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_firstname,
                                                                                            (select tbl_customers.last_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_lastname,
                                                                                            (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_register_packages.status = tbl_shipping_status.id) as status_name, 
                                                                                            (select tbl_drivers.first_name from tbl_drivers where tbl_register_packages.assign_driver = tbl_drivers.id) as drivers_firstname,
                                                                                            (select tbl_drivers.last_name from tbl_drivers where tbl_register_packages.assign_driver = tbl_drivers.id) as drivers_lastname
                                                                                            FROM tbl_register_packages WHERE date >= '${start_date}'`)
                                                                                            res.status(200).json({report_package_data})
            } else {
                let report_package_data = await mySqlQury(`SELECT tbl_register_packages.*, (select tbl_customers.first_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_firstname,
                                                                                            (select tbl_customers.last_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_lastname,
                                                                                            (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_register_packages.status = tbl_shipping_status.id) as status_name, 
                                                                                            (select tbl_drivers.first_name from tbl_drivers where tbl_register_packages.assign_driver = tbl_drivers.id) as drivers_firstname,
                                                                                            (select tbl_drivers.last_name from tbl_drivers where tbl_register_packages.assign_driver = tbl_drivers.id) as drivers_lastname
                                                                                            FROM tbl_register_packages WHERE date >= '${start_date}' AND date <= '${end_date}'`)
                                                                                            res.status(200).json({report_package_data})
            }
        } else {

            if (start_date == "") {
    
                let report_package_data = await mySqlQury(`SELECT tbl_register_packages.*, (select tbl_customers.first_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_firstname,
                                                                                            (select tbl_customers.last_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_lastname,
                                                                                            (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_register_packages.status = tbl_shipping_status.id) as status_name, 
                                                                                            (select tbl_drivers.first_name from tbl_drivers where tbl_register_packages.assign_driver = tbl_drivers.id) as drivers_firstname,
                                                                                            (select tbl_drivers.last_name from tbl_drivers where tbl_register_packages.assign_driver = tbl_drivers.id) as drivers_lastname
                                                                                            FROM tbl_register_packages WHERE date <= '${end_value}' AND customer_name = '${role_data.id}'`)
                                                                                            res.status(200).json({report_package_data})
            } else if (end_date == "") {
                let report_package_data = await mySqlQury(`SELECT tbl_register_packages.*, (select tbl_customers.first_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_firstname,
                                                                                            (select tbl_customers.last_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_lastname,
                                                                                            (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_register_packages.status = tbl_shipping_status.id) as status_name, 
                                                                                            (select tbl_drivers.first_name from tbl_drivers where tbl_register_packages.assign_driver = tbl_drivers.id) as drivers_firstname,
                                                                                            (select tbl_drivers.last_name from tbl_drivers where tbl_register_packages.assign_driver = tbl_drivers.id) as drivers_lastname
                                                                                            FROM tbl_register_packages WHERE date >= '${start_date}' AND customer_name = '${role_data.id}'`)
                                                                                            res.status(200).json({report_package_data})
            } else {
                let report_package_data = await mySqlQury(`SELECT tbl_register_packages.*, (select tbl_customers.first_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_firstname,
                                                                                            (select tbl_customers.last_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_lastname,
                                                                                            (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_register_packages.status = tbl_shipping_status.id) as status_name, 
                                                                                            (select tbl_drivers.first_name from tbl_drivers where tbl_register_packages.assign_driver = tbl_drivers.id) as drivers_firstname,
                                                                                            (select tbl_drivers.last_name from tbl_drivers where tbl_register_packages.assign_driver = tbl_drivers.id) as drivers_lastname
                                                                                            FROM tbl_register_packages WHERE date >= '${start_date}' AND date <= '${end_date}' AND customer_name = '${role_data.id}'`)
                                                                                            res.status(200).json({report_package_data})
            }
        }
        
    } catch (error) {
        console.log(error);
    }
})


router.get("/shipment", auth, async(req, res) => {
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
                                                                            (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_shipment.delivery_status = tbl_shipping_status.id) as shipping_status 
                                                                            FROM tbl_shipment ORDER BY id DESC`)
            res.render("report_shipment", {
                role_data : role_data, accessdata, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                shipment_list
            })

        } else {
            let shipment_list = await mySqlQury(`SELECT tbl_shipment.*, (select tbl_customers.first_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_firstname,
                                                                            (select tbl_customers.last_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_lastname,
                                                                            (select tbl_client.first_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_firstname,
                                                                            (select tbl_client.last_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_lastname,
                                                                            (select tbl_payment_type.payment_type from tbl_payment_type where tbl_shipment.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                            (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_shipment.delivery_status = tbl_shipping_status.id) as shipping_status 
                                                                            FROM tbl_shipment WHERE customer = '${customer_data[0].id}' ORDER BY id DESC`)
            res.render("report_shipment", {
                role_data : role_data, accessdata, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                shipment_list
            })
        }

    } catch (error) {
        console.log(error);
    }
})

router.post("/shipment/ajax", auth, async(req, res) => {
    try {
        let role_data = req.user

        const {start_date, end_date} = req.body
        

        if (role_data.role == '1') {

            if (start_date == "") {
                let shipment_data = await mySqlQury(`SELECT tbl_shipment.*, (select tbl_customers.first_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_firstname,
                                                                            (select tbl_customers.last_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_lastname,
                                                                            (select tbl_client.first_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_firstname,
                                                                            (select tbl_client.last_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_lastname,
                                                                            (select tbl_payment_type.payment_type from tbl_payment_type where tbl_shipment.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                            (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_shipment.delivery_status = tbl_shipping_status.id) as delivery_status_name
                                                                            FROM tbl_shipment WHERE date <= '${end_date}'`)
                                                                            res.status(200).json({shipment_data})
            } else if (end_date == "") {
                let shipment_data = await mySqlQury(`SELECT tbl_shipment.*, (select tbl_customers.first_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_firstname,
                                                                            (select tbl_customers.last_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_lastname,
                                                                            (select tbl_client.first_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_firstname,
                                                                            (select tbl_client.last_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_lastname,
                                                                            (select tbl_payment_type.payment_type from tbl_payment_type where tbl_shipment.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                            (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_shipment.delivery_status = tbl_shipping_status.id) as delivery_status_name
                                                                            FROM tbl_shipment WHERE date >= '${start_date}'`)
                                                                            res.status(200).json({shipment_data})
            } else {
                let shipment_data = await mySqlQury(`SELECT tbl_shipment.*, (select tbl_customers.first_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_firstname,
                                                                            (select tbl_customers.last_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_lastname,
                                                                            (select tbl_client.first_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_firstname,
                                                                            (select tbl_client.last_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_lastname,
                                                                            (select tbl_payment_type.payment_type from tbl_payment_type where tbl_shipment.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                            (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_shipment.delivery_status = tbl_shipping_status.id) as delivery_status_name
                                                                            FROM tbl_shipment WHERE date >= '${start_date}' AND date <= '${end_date}'`)
                                                                            res.status(200).json({shipment_data})
            }
        } else {

            if (start_date == "") {
                let shipment_data = await mySqlQury(`SELECT tbl_shipment.*, (select tbl_customers.first_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_firstname,
                                                                            (select tbl_customers.last_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_lastname,
                                                                            (select tbl_client.first_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_firstname,
                                                                            (select tbl_client.last_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_lastname,
                                                                            (select tbl_payment_type.payment_type from tbl_payment_type where tbl_shipment.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                            (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_shipment.delivery_status = tbl_shipping_status.id) as delivery_status_name
                                                                            FROM tbl_shipment WHERE date <= '${end_date}' AND customer_name = '${role_data.id}'`)
                                                                            res.status(200).json({shipment_data})
            } else if (end_date == "") {
                let shipment_data = await mySqlQury(`SELECT tbl_shipment.*, (select tbl_customers.first_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_firstname,
                                                                            (select tbl_customers.last_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_lastname,
                                                                            (select tbl_client.first_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_firstname,
                                                                            (select tbl_client.last_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_lastname,
                                                                            (select tbl_payment_type.payment_type from tbl_payment_type where tbl_shipment.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                            (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_shipment.delivery_status = tbl_shipping_status.id) as delivery_status_name
                                                                            FROM tbl_shipment WHERE date >= '${start_date}' AND customer_name = '${role_data.id}'`)
                                                                            res.status(200).json({shipment_data})
            } else {
                let shipment_data = await mySqlQury(`SELECT tbl_shipment.*, (select tbl_customers.first_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_firstname,
                                                                            (select tbl_customers.last_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_lastname,
                                                                            (select tbl_client.first_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_firstname,
                                                                            (select tbl_client.last_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_lastname,
                                                                            (select tbl_payment_type.payment_type from tbl_payment_type where tbl_shipment.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                            (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_shipment.delivery_status = tbl_shipping_status.id) as delivery_status_name
                                                                            FROM tbl_shipment WHERE date >= '${start_date}' AND date <= '${end_date}' AND customer_name = '${role_data.id}'`)
                                                                            res.status(200).json({shipment_data})
            }
        }
        
    } catch (error) {
        console.log(error);
    }
})


router.get("/pickup", auth, async(req, res) => {
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
            let pickup_data = await mySqlQury(`SELECT tbl_pickup.*, (select tbl_customers.first_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customers_firstname,
                                                                        (select tbl_customers.last_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customers_lastname,
                                                                        (select tbl_client.first_name from tbl_client where tbl_pickup.client = tbl_client.id) as client_firstname,
                                                                        (select tbl_client.last_name from tbl_client where tbl_pickup.client = tbl_client.id) as client_lastname,
                                                                        (select tbl_payment_type.payment_type from tbl_payment_type where tbl_pickup.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                        (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_pickup.delivery_status = tbl_shipping_status.id) as shipping_status 
                                                                        FROM tbl_pickup ORDER BY id DESC`)

            res.render("report_pickup", {
                role_data : role_data, accessdata, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                pickup_data
            })
        } else {
            let pickup_data = await mySqlQury(`SELECT tbl_pickup.*, (select tbl_customers.first_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customers_firstname,
                                                                        (select tbl_customers.last_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customers_lastname,
                                                                        (select tbl_client.first_name from tbl_client where tbl_pickup.client = tbl_client.id) as client_firstname,
                                                                        (select tbl_client.last_name from tbl_client where tbl_pickup.client = tbl_client.id) as client_lastname,
                                                                        (select tbl_payment_type.payment_type from tbl_payment_type where tbl_pickup.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                        (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_pickup.delivery_status = tbl_shipping_status.id) as shipping_status 
                                                                        FROM tbl_pickup WHERE customer = '${customer_data[0].id}' ORDER BY id DESC`)

            res.render("report_pickup", {
                role_data : role_data, accessdata, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                pickup_data
            })
        }

    } catch (error) {
        console.log(error);
    }
})

router.post("/pickup/ajax", auth, async(req, res) => {
    try {
        let role_data = req.user

        const {start_date, end_date} = req.body

        if (role_data.role == '1') {

            if (start_date == "") {
    
                let pickup_data = await mySqlQury(`SELECT tbl_pickup.*, (select tbl_customers.first_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customers_firstname,
                                                                        (select tbl_customers.last_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customers_lastname,
                                                                        (select tbl_client.first_name from tbl_client where tbl_pickup.client = tbl_client.id) as client_firstname,
                                                                        (select tbl_client.last_name from tbl_client where tbl_pickup.client = tbl_client.id) as client_lastname,
                                                                        (select tbl_payment_type.payment_type from tbl_payment_type where tbl_pickup.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                        (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_pickup.delivery_status = tbl_shipping_status.id) as delivery_status_name
                                                                        FROM tbl_pickup WHERE date <= '${end_date}'`)
    
                                                                        res.status(200).json({pickup_data})
            } else if (end_date == "") {
                let pickup_data = await mySqlQury(`SELECT tbl_pickup.*, (select tbl_customers.first_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customers_firstname,
                                                                        (select tbl_customers.last_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customers_lastname,
                                                                        (select tbl_client.first_name from tbl_client where tbl_pickup.client = tbl_client.id) as client_firstname,
                                                                        (select tbl_client.last_name from tbl_client where tbl_pickup.client = tbl_client.id) as client_lastname,
                                                                        (select tbl_payment_type.payment_type from tbl_payment_type where tbl_pickup.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                        (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_pickup.delivery_status = tbl_shipping_status.id) as delivery_status_name
                                                                        FROM tbl_pickup WHERE date >= '${start_date}'`)
                                                                        res.status(200).json({pickup_data})
            } else {
                let pickup_data = await mySqlQury(`SELECT tbl_pickup.*, (select tbl_customers.first_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customers_firstname,
                                                                        (select tbl_customers.last_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customers_lastname,
                                                                        (select tbl_client.first_name from tbl_client where tbl_pickup.client = tbl_client.id) as client_firstname,
                                                                        (select tbl_client.last_name from tbl_client where tbl_pickup.client = tbl_client.id) as client_lastname,
                                                                        (select tbl_payment_type.payment_type from tbl_payment_type where tbl_pickup.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                        (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_pickup.delivery_status = tbl_shipping_status.id) as delivery_status_name
                                                                        FROM tbl_pickup WHERE date >= '${start_date}' AND date <= '${end_date}'`)
                                                                        res.status(200).json({pickup_data})
            }
        } else {

            if (start_date == "") {
    
                let pickup_data = await mySqlQury(`SELECT tbl_pickup.*, (select tbl_customers.first_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customers_firstname,
                                                                        (select tbl_customers.last_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customers_lastname,
                                                                        (select tbl_client.first_name from tbl_client where tbl_pickup.client = tbl_client.id) as client_firstname,
                                                                        (select tbl_client.last_name from tbl_client where tbl_pickup.client = tbl_client.id) as client_lastname,
                                                                        (select tbl_payment_type.payment_type from tbl_payment_type where tbl_pickup.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                        (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_pickup.delivery_status = tbl_shipping_status.id) as delivery_status_name
                                                                        FROM tbl_pickup WHERE date <= '${end_date}' AND customer_name = '${role_data.id}'`)
                                                                        res.status(200).json({pickup_data})
    
            } else if (end_date == "") {
                let pickup_data = await mySqlQury(`SELECT tbl_pickup.*, (select tbl_customers.first_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customers_firstname,
                                                                        (select tbl_customers.last_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customers_lastname,
                                                                        (select tbl_client.first_name from tbl_client where tbl_pickup.client = tbl_client.id) as client_firstname,
                                                                        (select tbl_client.last_name from tbl_client where tbl_pickup.client = tbl_client.id) as client_lastname,
                                                                        (select tbl_payment_type.payment_type from tbl_payment_type where tbl_pickup.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                        (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_pickup.delivery_status = tbl_shipping_status.id) as delivery_status_name
                                                                        FROM tbl_pickup WHERE date >= '${start_date}' AND customer_name = '${role_data.id}'`)
                                                                        res.status(200).json({pickup_data})
            } else {
                let pickup_data = await mySqlQury(`SELECT tbl_pickup.*, (select tbl_customers.first_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customers_firstname,
                                                                        (select tbl_customers.last_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customers_lastname,
                                                                        (select tbl_client.first_name from tbl_client where tbl_pickup.client = tbl_client.id) as client_firstname,
                                                                        (select tbl_client.last_name from tbl_client where tbl_pickup.client = tbl_client.id) as client_lastname,
                                                                        (select tbl_payment_type.payment_type from tbl_payment_type where tbl_pickup.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                        (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_pickup.delivery_status = tbl_shipping_status.id) as delivery_status_name
                                                                        FROM tbl_pickup WHERE date >= '${start_date}' AND date <= '${end_date}' AND customer_name = '${role_data.id}'`)
                                                                        res.status(200).json({pickup_data})
            }
        }

    } catch (error) {
        console.log(error);
    }
})


router.get("/consolidated", auth, async(req, res) => {
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
            let consolidated_data = await mySqlQury(`SELECT tbl_consolidated.*, (select tbl_customers.first_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_firstname,
                                                                                    (select tbl_customers.last_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_lastname,
                                                                                    (select tbl_client.first_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_firstname,
                                                                                    (select tbl_client.last_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_lastname,
                                                                                    (select tbl_payment_type.payment_type from tbl_payment_type where tbl_consolidated.payment_type = tbl_payment_type.id) as payment,
                                                                                    (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_consolidated.delivery_status = tbl_shipping_status.id) as status,
                                                                                    (select tbl_drivers.first_name from tbl_drivers where tbl_consolidated.assign_driver = tbl_drivers.id) as driver_firstname,
                                                                                    (select tbl_drivers.last_name from tbl_drivers where tbl_consolidated.assign_driver = tbl_drivers.id) as driver_lastname 
                                                                                    FROM tbl_consolidated ORDER BY id DESC`)
            res.render("report_consolidated", {
                role_data : role_data, accessdata, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                consolidated_data
            })

        } else {
            let consolidated_data = await mySqlQury(`SELECT tbl_consolidated.*, (select tbl_customers.first_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_firstname,
                                                                                    (select tbl_customers.last_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_lastname,
                                                                                    (select tbl_client.first_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_firstname,
                                                                                    (select tbl_client.last_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_lastname,
                                                                                    (select tbl_payment_type.payment_type from tbl_payment_type where tbl_consolidated.payment_type = tbl_payment_type.id) as payment,
                                                                                    (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_consolidated.delivery_status = tbl_shipping_status.id) as status,
                                                                                    (select tbl_drivers.first_name from tbl_drivers where tbl_consolidated.assign_driver = tbl_drivers.id) as driver_firstname,
                                                                                    (select tbl_drivers.last_name from tbl_drivers where tbl_consolidated.assign_driver = tbl_drivers.id) as driver_lastname 
                                                                                    FROM tbl_consolidated WHERE customer = '${customer_data[0].id}' ORDER BY id DESC`)
            res.render("report_consolidated", {
                role_data : role_data, accessdata, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                consolidated_data
            })
        }
    } catch (error) {
       console.log(error); 
    }
})

router.post("/consolidated/ajax", auth, async(req, res) => {
    try {
        let role_data = req.user

        const {start_date, end_date} = req.body


        if (role_data.role == '1') {

            if (start_date == "") {
                let consolidated_data = await mySqlQury(`SELECT tbl_consolidated.*, (select tbl_customers.first_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_firstname,
                                                                                    (select tbl_customers.last_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_lastname,
                                                                                    (select tbl_client.first_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_firstname,
                                                                                    (select tbl_client.last_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_lastname,
                                                                                    (select tbl_payment_type.payment_type from tbl_payment_type where tbl_consolidated.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                                    (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_consolidated.delivery_status = tbl_shipping_status.id) as delivery_status_name
                                                                                    FROM tbl_consolidated WHERE date <= '${end_date}'`)
                                                                                    res.status(200).json({consolidated_data})
            } else if (end_date == "") {
                let consolidated_data = await mySqlQury(`SELECT tbl_consolidated.*, (select tbl_customers.first_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_firstname,
                                                                                    (select tbl_customers.last_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_lastname,
                                                                                    (select tbl_client.first_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_firstname,
                                                                                    (select tbl_client.last_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_lastname,
                                                                                    (select tbl_payment_type.payment_type from tbl_payment_type where tbl_consolidated.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                                    (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_consolidated.delivery_status = tbl_shipping_status.id) as delivery_status_name
                                                                                    FROM tbl_consolidated WHERE date >= '${start_date}'`)
                                                                                    res.status(200).json({consolidated_data})
            } else {
                let consolidated_data = await mySqlQury(`SELECT tbl_consolidated.*, (select tbl_customers.first_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_firstname,
                                                                                    (select tbl_customers.last_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_lastname,
                                                                                    (select tbl_client.first_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_firstname,
                                                                                    (select tbl_client.last_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_lastname,
                                                                                    (select tbl_payment_type.payment_type from tbl_payment_type where tbl_consolidated.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                                    (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_consolidated.delivery_status = tbl_shipping_status.id) as delivery_status_name
                                                                                    FROM tbl_consolidated WHERE date >= '${start_date}' AND date <= '${end_date}'`)
                                                                                    res.status(200).json({consolidated_data})
            }
        } else {

            if (start_date == "") {
                let consolidated_data = await mySqlQury(`SELECT tbl_consolidated.*, (select tbl_customers.first_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_firstname,
                                                                                    (select tbl_customers.last_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_lastname,
                                                                                    (select tbl_client.first_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_firstname,
                                                                                    (select tbl_client.last_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_lastname,
                                                                                    (select tbl_payment_type.payment_type from tbl_payment_type where tbl_consolidated.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                                    (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_consolidated.delivery_status = tbl_shipping_status.id) as delivery_status_name
                                                                                    FROM tbl_consolidated WHERE date <= '${end_date}' AND customer_name = '${role_data.id}'`)
                                                                                    res.status(200).json({consolidated_data})
            } else if (end_date == "") {
                let consolidated_data = await mySqlQury(`SELECT tbl_consolidated.*, (select tbl_customers.first_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_firstname,
                                                                                    (select tbl_customers.last_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_lastname,
                                                                                    (select tbl_client.first_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_firstname,
                                                                                    (select tbl_client.last_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_lastname,
                                                                                    (select tbl_payment_type.payment_type from tbl_payment_type where tbl_consolidated.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                                    (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_consolidated.delivery_status = tbl_shipping_status.id) as delivery_status_name
                                                                                    FROM tbl_consolidated WHERE date >= '${start_date}' AND customer_name = '${role_data.id}'`)
                                                                                    res.status(200).json({consolidated_data})
            } else {
                let consolidated_data = await mySqlQury(`SELECT tbl_consolidated.*, (select tbl_customers.first_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_firstname,
                                                                                    (select tbl_customers.last_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_lastname,
                                                                                    (select tbl_client.first_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_firstname,
                                                                                    (select tbl_client.last_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_lastname,
                                                                                    (select tbl_payment_type.payment_type from tbl_payment_type where tbl_consolidated.payment_type = tbl_payment_type.id) as payment_type_name,
                                                                                    (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_consolidated.delivery_status = tbl_shipping_status.id) as delivery_status_name
                                                                                    FROM tbl_consolidated WHERE date >= '${start_date}' AND date <= '${end_date}' AND customer_name = '${role_data.id}'`)
                                                                                    res.status(200).json({consolidated_data})
            }
        }
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;