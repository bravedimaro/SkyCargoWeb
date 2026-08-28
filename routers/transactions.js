const express = require("express");
const app = express();
const router = express.Router();
const auth = require("../middleware/auth");
const { mySqlQury } = require("../middleware/db");
const access = require('../middleware/access');
let sendNotification = require("../middleware/send");



router.get("/add_payment", auth, async(req, res) => {
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


        const register_packages_amount_data = await mySqlQury(`SELECT id, customer, ROUND(SUM(total),2) as total, ROUND(SUM(paid_amount),2) as total_paid_amount, ROUND(SUM(due_amount),2) as total_due_amount FROM tbl_register_packages GROUP BY customer`)
        const shipment_amount_data = await mySqlQury(`SELECT id, customer, ROUND(SUM(total),2) as total, ROUND(SUM(paid_amount),2) as total_paid_amount, ROUND(SUM(due_amount),2) as total_due_amount FROM tbl_shipment GROUP BY customer`)
        const pickup_amount_data = await mySqlQury(`SELECT id, customer, ROUND(SUM(total),2) as total, ROUND(SUM(paid_amount),2) as total_paid_amount, ROUND(SUM(due_amount),2) as total_due_amount FROM tbl_pickup GROUP BY customer`)
        const consolidated_amount_data = await mySqlQury(`SELECT id, customer, ROUND(SUM(total),2) as total, ROUND(SUM(paid_amount),2) as total_paid_amount, ROUND(SUM(due_amount),2) as total_due_amount FROM tbl_consolidated GROUP BY customer`)

        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers`)

        res.render("add_payment", {
            role_data, lang_data, language_name, accessdata, notification_data, 
            register_packages_notification, shipment_notification, pickup_notification, 
            consolidated_notification, register_packages_amount_data, customer_data, shipment_amount_data,
            pickup_amount_data, consolidated_amount_data
        })
    } catch (error) {
        console.log(error);
    }
})


router.get("/register_packages_payment_list/:id", auth, async(req, res) => {
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


        const payment_data = await mySqlQury(`SELECT * FROM tbl_register_packages WHERE customer = '${req.params.id}'`)

        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers`)
        const c_name = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${req.params.id}'`)

        res.render("add_payment_list", {
            role_data, lang_data, language_name, accessdata, notification_data, c_name,
            register_packages_notification, shipment_notification, pickup_notification, 
            consolidated_notification, payment_data, customer_data, data_type : '1'
        })
    } catch (error) {
        console.log(error);
    }
})

router.get("/shipmentd_payment_list/:id", auth, async(req, res) => {
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


        const payment_data = await mySqlQury(`SELECT * FROM tbl_shipment WHERE customer = '${req.params.id}'`)
        console.log(payment_data);

        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers`)

        res.render("add_payment_list", {
            role_data, lang_data, language_name, accessdata, notification_data, 
            register_packages_notification, shipment_notification, pickup_notification, 
            consolidated_notification, payment_data, customer_data, data_type : '2'
        })
    } catch (error) {
        console.log(error);
    }
})

router.get("/pickup_payment_list/:id", auth, async(req, res) => {
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


        const payment_data = await mySqlQury(`SELECT * FROM tbl_pickup WHERE customer = '${req.params.id}'`)
        console.log(payment_data);

        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers`)

        res.render("add_payment_list", {
            role_data, lang_data, language_name, accessdata, notification_data, 
            register_packages_notification, shipment_notification, pickup_notification, 
            consolidated_notification, payment_data, customer_data, data_type : '3'
        })
    } catch (error) {
        console.log(error);
    }
})

router.get("/consolidated_payment_list/:id", auth, async(req, res) => {
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


        const payment_data = await mySqlQury(`SELECT * FROM tbl_consolidated WHERE customer = '${req.params.id}'`)
        console.log(payment_data);

        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers`)

        res.render("add_payment_list", {
            role_data, lang_data, language_name, accessdata, notification_data, 
            register_packages_notification, shipment_notification, pickup_notification, 
            consolidated_notification, payment_data, customer_data, data_type : '4'
        })
    } catch (error) {
        console.log(error);
    }
})

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

        if (req.body.datatype == '1') {

            const register_data = await mySqlQury(`SELECT * FROM tbl_register_packages WHERE id = '${req.params.id}'`)

            let query = `INSERT INTO tbl_payment (store_id, date, invoice, type, paid_amount) VALUE ('${register_data[0].customer}', '${fullDate}', '${register_data[0].invoice}',
            'register_packages', '${paid_amount}')`
            await mySqlQury(query)

            let due = parseFloat(register_data[0].due_amount) - parseFloat(paid_amount)
            let paid = parseFloat(register_data[0].paid_amount) + parseFloat(paid_amount)
            
            let update_register_data = `UPDATE tbl_register_packages SET paid_amount = '${paid}', due_amount = '${due}' WHERE id = '${req.params.id}'`
            await mySqlQury(update_register_data)

            
            // ============== Notification ============= //
    
            let customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${register_data[0].customer}'`)

            
            let today = new Date();
            let newtime = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

            const admin_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${register_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'Shipping payment has been added, please check', '1', '1')`
            await mySqlQury(admin_message)

            const cus_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${register_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'Shipping payment has been added, please check', '${customer_data[0].login_id}', '1')`
            await mySqlQury(cus_message)

            
        } else if (req.body.datatype == '2') {
            
            const shipment_data = await mySqlQury(`SELECT * FROM tbl_shipment WHERE id = '${req.params.id}'`)
    
            let query = `INSERT INTO tbl_payment (store_id, date, invoice, type, paid_amount) VALUE ('${shipment_data[0].customer}', '${fullDate}', '${shipment_data[0].invoice}',
            'shipment', '${paid_amount}')`
            await mySqlQury(query)
    
            let due = parseFloat(shipment_data[0].due_amount) - parseFloat(paid_amount)
            let paid = parseFloat(shipment_data[0].paid_amount) + parseFloat(paid_amount)
            
            let update_shipment_data = `UPDATE tbl_shipment SET paid_amount = '${paid}', due_amount = '${due}' WHERE id = '${req.params.id}'`
            await mySqlQury(update_shipment_data)


            // ============== Notification ============= //
    
            let customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${shipment_data[0].customer}'`)

            let today = new Date();
            let newtime = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

            const admin_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${shipment_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'Shipping payment has been added, please check', '1', '2')`
            await mySqlQury(admin_message)

            const cus_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${shipment_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'Shipping payment has been added, please check', '${customer_data[0].login_id}', '2')`
            await mySqlQury(cus_message)


        } else if (req.body.datatype == '3') {

            const shipment_data = await mySqlQury(`SELECT * FROM tbl_pickup WHERE id = '${req.params.id}'`)
            console.log(shipment_data);

            let query = `INSERT INTO tbl_payment (store_id, date, invoice, type, paid_amount) VALUE ('${shipment_data[0].customer}', '${fullDate}', '${shipment_data[0].invoice}',
            'pickup', '${paid_amount}')`
            await mySqlQury(query)

            let due = parseFloat(shipment_data[0].due_amount) - parseFloat(paid_amount)
            let paid = parseFloat(shipment_data[0].paid_amount) + parseFloat(paid_amount)
            
            let update_shipment_data = `UPDATE tbl_pickup SET paid_amount = '${paid}', due_amount = '${due}' WHERE id = '${req.params.id}'`
            await mySqlQury(update_shipment_data)


            // ============== Notification ============= //
    
            let customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${shipment_data[0].customer}'`)

            let today = new Date();
            let newtime = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

            const admin_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${shipment_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'Shipping payment has been added, please check', '1', '3')`
            await mySqlQury(admin_message)

            const cus_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${shipment_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'Shipping payment has been added, please check', '${customer_data[0].login_id}', '3')`
            await mySqlQury(cus_message)

        } else {

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
    
            let customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${shipment_data[0].customer}'`)
            
            let today = new Date();
            let newtime = today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })

            const admin_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${shipment_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'Shipping payment has been added, please check', '1', '4')`
            await mySqlQury(admin_message)

            const cus_message = `INSERT INTO tbl_notification (invoice, date, time, sender, notification, received, type) VALUE ('${shipment_data[0].invoice}', '${fullDate}', '${newtime}', '${role_data.id}', 'Shipping payment has been added, please check', '${customer_data[0].login_id}', '4')`
            await mySqlQury(cus_message)

        }



        // ============== Notification ============= //
    
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
        res.redirect("/transactions/add_payment")
    } catch (error) {
        console.log(error);
    }
})


router.get("/list_of_payment", auth, async(req, res) => {
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
        
        if (role_data.role == 1) {
            
            let payment_data = await mySqlQury(`SELECT tbl_payment.*, (select tbl_customers.first_name from tbl_customers where tbl_payment.store_id = tbl_customers.id) as first_name,
                                                                    (select tbl_customers.last_name from tbl_customers where tbl_payment.store_id = tbl_customers.id) as last_name
                                                                    FROM tbl_payment ORDER BY id DESC`)
            const customer_data = await mySqlQury(`SELECT * FROM tbl_customers`)

            res.render("list_of_payments", {
                role_data : role_data, accessdata, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                payment_data, customer_data, 
            })
        } else {
            
            let payment_data = await mySqlQury(`SELECT tbl_payment.*, (select tbl_customers.first_name from tbl_customers where tbl_payment.store_id = tbl_customers.id) as first_name,
                                                                    (select tbl_customers.last_name from tbl_customers where tbl_payment.store_id = tbl_customers.id) as last_name
                                                                    FROM tbl_payment WHERE store_id = '${role_data.id}' ORDER BY id DESC`)
            const customer_data = await mySqlQury(`SELECT * FROM tbl_customers`)

            res.render("list_of_payments", {
                role_data : role_data, accessdata, lang_data, language_name, notification_data,
                register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
                payment_data, customer_data, 
            })
        }
        
       
    } catch (error) {
        console.log(error);
    }
})

router.post("/list_of_payment/ajax", auth, async(req, res) => {
    try {
        if (req.body.shipping_type == '') {
            
            let payment_data = await mySqlQury(`SELECT tbl_payment.*, (select tbl_customers.first_name from tbl_customers where tbl_payment.store_id = tbl_customers.id) as first_name,
                                                                        (select tbl_customers.last_name from tbl_customers where tbl_payment.store_id = tbl_customers.id) as last_name
                                                                        FROM tbl_payment WHERE store_id = '${req.body.customer_name}'`)
                                                                        res.status(200).json({payment_data})
        } else if (req.body.customer_name == '') {
            
            let payment_data = await mySqlQury(`SELECT tbl_payment.*, (select tbl_customers.first_name from tbl_customers where tbl_payment.store_id = tbl_customers.id) as first_name,
                                                                        (select tbl_customers.last_name from tbl_customers where tbl_payment.store_id = tbl_customers.id) as last_name
                                                                        FROM tbl_payment WHERE type = '${req.body.shipping_type}'`)
                                                                        res.status(200).json({payment_data})
        } else {
            let payment_data = await mySqlQury(`SELECT tbl_payment.*, (select tbl_customers.first_name from tbl_customers where tbl_payment.store_id = tbl_customers.id) as first_name,
                                                                        (select tbl_customers.last_name from tbl_customers where tbl_payment.store_id = tbl_customers.id) as last_name
                                                                        FROM tbl_payment WHERE type = '${req.body.shipping_type}' AND store_id = '${req.body.customer_name}'`)
                                                                        res.status(200).json({payment_data})
        }
        
        
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;