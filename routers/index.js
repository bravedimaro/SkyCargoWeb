const express = require("express");
const app = express();
const router = express.Router();
const {mySqlQury} = require('../middleware/db');
const auth = require("../middleware/auth");
const bcrypt = require('bcryptjs');
const access = require('../middleware/access');



router.get("/", auth, async(req, res) => {
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
        let drivers_data = await mySqlQury(`SELECT * FROM tbl_drivers WHERE login_id = '${role_data.id}'`)


        if (role_data.role == '1') {
            
            let registered_packages = await mySqlQury(`SELECT SUM(total) AS registered_packages_total FROM tbl_register_packages`)
            let shipments = await mySqlQury(`SELECT SUM(total) AS shipments_total FROM tbl_shipment`)
            let pickups = await mySqlQury(`SELECT SUM(total) AS pickups_total FROM tbl_pickup`)
            let consolidated = await mySqlQury(`SELECT SUM(total) AS consolidated_total FROM tbl_consolidated`)
    
            let packages_total = registered_packages[0].registered_packages_total
            let shipments_total = shipments[0].shipments_total
            let pickups_total = pickups[0].pickups_total
            let consolidated_total = consolidated[0].consolidated_total
    
            let registered_packages_data = await mySqlQury(`SELECT tbl_register_packages.*, (select tbl_customers.first_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_firstname,
                                                                                            (select tbl_customers.last_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_lastname,
                                                                                            (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_register_packages.status = tbl_shipping_status.id) as shipping_status
                                                                                            FROM tbl_register_packages ORDER BY id DESC LIMIT 5`)

            let shipments_data = await mySqlQury(`SELECT tbl_shipment.*, (select tbl_customers.first_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_firstname,
                                                                        (select tbl_customers.last_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_lastname,
                                                                        (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_shipment.delivery_status = tbl_shipping_status.id) as shipping_status
                                                                        FROM tbl_shipment ORDER BY id DESC LIMIT 5`)

            let pickups_data = await mySqlQury(`SELECT tbl_pickup.*, (select tbl_customers.first_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customers_firstname,
                                                                    (select tbl_customers.last_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customers_lastname,
                                                                    (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_pickup.delivery_status = tbl_shipping_status.id) as shipping_status
                                                                    FROM tbl_pickup ORDER BY id DESC LIMIT 5`)

            let consolidated_data = await mySqlQury(`SELECT tbl_consolidated.*, (select tbl_customers.first_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_firstname,
                                                                                (select tbl_customers.last_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_lastname,
                                                                                (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_consolidated.delivery_status = tbl_shipping_status.id) as status
                                                                                FROM tbl_consolidated ORDER BY id DESC LIMIT 5`)


            let customers_data = await mySqlQury(`SELECT * FROM tbl_customers`)
            let clients_data = await mySqlQury(`SELECT * FROM tbl_client`)
            let drivers_data = await mySqlQury(`SELECT * FROM tbl_drivers`)
            let pre_alert_data = await mySqlQury(`SELECT * FROM tbl_pre_alert`)
            let office_group_data = await mySqlQury(`SELECT * FROM tbl_office_group`)
            let agency_group_data = await mySqlQury(`SELECT * FROM tbl_agency_group`)
            let courier_companies_data = await mySqlQury(`SELECT * FROM tbl_courier_companies`)
            let shipping_status_data = await mySqlQury(`SELECT * FROM tbl_shipping_status`)
            let logistics_service_data = await mySqlQury(`SELECT * FROM tbl_logistics_service`)

            

            res.render("index",{
                role_data : role_data, accessdata, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                registered_packages : ((packages_total == null) ? 0 : packages_total.toFixed(2)),
                shipments : ((shipments_total == null) ? 0 : shipments_total.toFixed(2)),
                pickups : ((pickups_total == null) ? 0 : pickups_total.toFixed(2)),
                consolidated : ((consolidated_total == null) ? 0 : consolidated_total.toFixed(2)),
                registered_packages_data, shipments_data, pickups_data, consolidated_data,
                customers_data : customers_data.length,
                clients_data : clients_data.length,
                drivers_data : drivers_data.length,
                pre_alert_data : pre_alert_data.length,
                office_group_data : office_group_data.length,
                agency_group_data : agency_group_data.length,
                courier_companies_data : courier_companies_data.length,
                shipping_status_data : shipping_status_data.length,
                logistics_service_data : logistics_service_data.length,
            })

        } else if (role_data.role == '2') {
            
            let registered_packages = await mySqlQury(`SELECT SUM(total) AS registered_packages_total FROM tbl_register_packages WHERE customer = '${customer_data[0].id}'`)
            let shipments = await mySqlQury(`SELECT SUM(total) AS shipments_total FROM tbl_shipment WHERE customer = '${customer_data[0].id}'`)
            let pickups = await mySqlQury(`SELECT SUM(total) AS pickups_total FROM tbl_pickup WHERE customer = '${customer_data[0].id}'`)
            let consolidated = await mySqlQury(`SELECT SUM(total) AS consolidated_total FROM tbl_consolidated WHERE customer = '${customer_data[0].id}'`)
    
            let packages_total = registered_packages[0].registered_packages_total
            let shipments_total = shipments[0].shipments_total
            let pickups_total = pickups[0].pickups_total
            let consolidated_total = consolidated[0].consolidated_total
    
            let registered_packages_data = await mySqlQury(`SELECT tbl_register_packages.*, (select tbl_customers.first_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_firstname,
                                                                                            (select tbl_customers.last_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_lastname,
                                                                                            (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_register_packages.status = tbl_shipping_status.id) as shipping_status
                                                                                            FROM tbl_register_packages WHERE customer = '${customer_data[0].id}' ORDER BY id DESC LIMIT 5`)

            let shipments_data = await mySqlQury(`SELECT tbl_shipment.*, (select tbl_customers.first_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_firstname,
                                                                        (select tbl_customers.last_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_lastname,
                                                                        (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_shipment.delivery_status = tbl_shipping_status.id) as shipping_status
                                                                        FROM tbl_shipment WHERE customer = '${customer_data[0].id}' ORDER BY id DESC LIMIT 5`)

            let pickups_data = await mySqlQury(`SELECT tbl_pickup.*, (select tbl_customers.first_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customers_firstname,
                                                                    (select tbl_customers.last_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customers_lastname,
                                                                    (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_pickup.delivery_status = tbl_shipping_status.id) as shipping_status
                                                                    FROM tbl_pickup WHERE customer = '${customer_data[0].id}' ORDER BY id DESC LIMIT 5`)

            let consolidated_data = await mySqlQury(`SELECT tbl_consolidated.*, (select tbl_customers.first_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_firstname,
                                                                                (select tbl_customers.last_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_lastname,
                                                                                (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_consolidated.delivery_status = tbl_shipping_status.id) as status
                                                                                FROM tbl_consolidated WHERE customer = '${customer_data[0].id}' ORDER BY id DESC LIMIT 5`)

            
            res.render("index",{
                role_data : role_data, accessdata, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                registered_packages : ((packages_total == null) ? 0 : packages_total.toFixed(2)),
                shipments : ((shipments_total == null) ? 0 : shipments_total.toFixed(2)),
                pickups : ((pickups_total == null) ? 0 : pickups_total.toFixed(2)),
                consolidated : ((consolidated_total == null) ? 0 : consolidated_total.toFixed(2)),
                registered_packages_data, shipments_data, pickups_data, consolidated_data,
                customers_data : 0,
                clients_data : 0,
                drivers_data : 0,
                pre_alert_data : 0,
                office_group_data : 0,
                agency_group_data : 0,
                courier_companies_data : 0,
                shipping_status_data : 0,
                logistics_service_data : 0,
            })
        } else {
            let registered_packages = await mySqlQury(`SELECT SUM(total) AS registered_packages_total FROM tbl_register_packages WHERE assign_driver = '${drivers_data[0].id}'`)
            let shipments = await mySqlQury(`SELECT SUM(total) AS shipments_total FROM tbl_shipment WHERE assign_driver = '${drivers_data[0].id}'`)
            let pickups = await mySqlQury(`SELECT SUM(total) AS pickups_total FROM tbl_pickup WHERE assign_driver = '${drivers_data[0].id}'`)
            let consolidated = await mySqlQury(`SELECT SUM(total) AS consolidated_total FROM tbl_consolidated WHERE assign_driver = '${drivers_data[0].id}'`)
    
            let packages_total = registered_packages[0].registered_packages_total
            let shipments_total = shipments[0].shipments_total
            let pickups_total = pickups[0].pickups_total
            let consolidated_total = consolidated[0].consolidated_total
    
            let registered_packages_data = await mySqlQury(`SELECT tbl_register_packages.*, (select tbl_customers.first_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_firstname,
                                                                                            (select tbl_customers.last_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customers_lastname,
                                                                                            (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_register_packages.status = tbl_shipping_status.id) as shipping_status
                                                                                            FROM tbl_register_packages WHERE assign_driver = '${drivers_data[0].id}' ORDER BY id DESC LIMIT 5`)

            let shipments_data = await mySqlQury(`SELECT tbl_shipment.*, (select tbl_customers.first_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_firstname,
                                                                        (select tbl_customers.last_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customers_lastname,
                                                                        (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_shipment.delivery_status = tbl_shipping_status.id) as shipping_status
                                                                        FROM tbl_shipment WHERE assign_driver = '${drivers_data[0].id}' ORDER BY id DESC LIMIT 5`)

            let pickups_data = await mySqlQury(`SELECT tbl_pickup.*, (select tbl_customers.first_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customers_firstname,
                                                                    (select tbl_customers.last_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customers_lastname,
                                                                    (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_pickup.delivery_status = tbl_shipping_status.id) as shipping_status
                                                                    FROM tbl_pickup WHERE assign_driver = '${drivers_data[0].id}' ORDER BY id DESC LIMIT 5`)

            let consolidated_data = await mySqlQury(`SELECT tbl_consolidated.*, (select tbl_customers.first_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_firstname,
                                                                                (select tbl_customers.last_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customers_lastname,
                                                                                (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_consolidated.delivery_status = tbl_shipping_status.id) as status
                                                                                FROM tbl_consolidated WHERE assign_driver = '${drivers_data[0].id}' ORDER BY id DESC LIMIT 5`)
                   
                                                                
            res.render("index",{
                role_data : role_data, accessdata, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                registered_packages : ((packages_total == null) ? 0 : packages_total.toFixed(2)),
                shipments : ((shipments_total == null) ? 0 : shipments_total.toFixed(2)),
                pickups : ((pickups_total == null) ? 0 : pickups_total.toFixed(2)),
                consolidated : ((consolidated_total == null) ? 0 : consolidated_total.toFixed(2)),
                registered_packages_data, shipments_data, pickups_data, consolidated_data,
                customers_data : 0,
                clients_data : 0,
                drivers_data : 0,
                pre_alert_data : 0,
                office_group_data : 0,
                agency_group_data : 0,
                courier_companies_data : 0,
                shipping_status_data : 0,
                logistics_service_data : 0,
            })
        }


    } catch (error) {
        console.log(error);
    }
})

router.get("/profile", auth, async(req, res) => {
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

        const data = await mySqlQury(`SELECT * FROM tbl_admin WHERE id = '${role_data.id}'`)
        
        res.render("profile", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            data : data[0]
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/profile/:id", auth, async(req, res) => {
    try {
        
        const {first_name, last_name, email, phone_no, password} = req.body

        
        if (password != "") {
            
            const hash = await bcrypt.hash(password, 10)
            
            await mySqlQury(`UPDATE tbl_admin SET first_name = '${first_name}', last_name = '${last_name}', email = '${email}', phone_no = '${phone_no}', password = '${hash}' WHERE id = '${req.params.id}'`)
            
            await mySqlQury(`UPDATE tbl_customers SET first_name = '${first_name}', last_name = '${last_name}', email = '${email}', mobile = '${phone_no}' WHERE login_id = '${req.params.id}'`)
        } else {
            
            await mySqlQury(`UPDATE tbl_admin SET first_name = '${first_name}', last_name = '${last_name}', email = '${email}', phone_no = '${phone_no}' WHERE id = '${req.params.id}'`)
            
            await mySqlQury(`UPDATE tbl_customers SET first_name = '${first_name}', last_name = '${last_name}', email = '${email}', mobile = '${phone_no}' WHERE login_id = '${req.params.id}'`)
            
        }


        req.flash('success', `Update successfully`)
        res.redirect("/index/profile")
        
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;