const express = require("express");
const app = express();
const router = express.Router();
const {mySqlQury} = require('../middleware/db');
const auth = require("../middleware/auth");
const { query } = require("express");
const multer  = require('multer');
const access = require('../middleware/access');

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

// ========== General Settings ========= //

router.get("/general_settings", auth, async(req, res) => {
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
        
        const general_settings_data = await mySqlQury(`SELECT * FROM tbl_general_settings`)
        
        res.render("general_settings", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            general_settings_data : general_settings_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/general_settings", auth, upload.single('site_logo'), async(req, res) => {
    try {
       
        const {site_title, site_currency, site_timezone, currency_placement, thousands_separator, site_logo_hidden, onesignal_app_id, onesignal_api_key, twilio_sid, twilio_auth_token, twilio_phone_no} = req.body 
           
        if (site_logo_hidden == 0) {
            
            let query = `UPDATE tbl_general_settings SET site_title = '${site_title}', site_currency = '${site_currency}', site_timezone = '${site_timezone}', currency_placement = '${currency_placement}',
            thousands_separator = '${thousands_separator}', onesignal_app_id = '${onesignal_app_id}', onesignal_api_key = '${onesignal_api_key}', twilio_sid = '${twilio_sid}', twilio_auth_token = '${twilio_auth_token}', 
            twilio_phone_no = '${twilio_phone_no}' WHERE id = 1`
            await mySqlQury(query)

        } else {
            const site_logo = req.file.filename

            if (req.file.mimetype != "image/png" && req.file.mimetype != "image/jpg" && req.file.mimetype != "image/jpeg") {
                req.flash('errors', `Only .png, .jpg and .jpeg format allowed!`)
                return res.redirect("back")
            }

            let query = `UPDATE tbl_general_settings SET site_title = '${site_title}', site_logo = '${site_logo}', site_currency = '${site_currency}', site_timezone = '${site_timezone}', currency_placement = '${currency_placement}', 
            thousands_separator = '${thousands_separator}', onesignal_app_id = '${onesignal_app_id}', onesignal_api_key = '${onesignal_api_key}', twilio_sid = '${twilio_sid}', twilio_auth_token = '${twilio_auth_token}', 
            twilio_phone_no = '${twilio_phone_no}' WHERE id = 1`
            await mySqlQury(query)
        }
        
        req.flash('success', `Added successfully`)
        res.redirect("/settings/general_settings")
        
    } catch (error) {
        console.log(error);
    }
})


// ========== E-Mail Settings ========= //

router.get("/email_settings", auth, async(req, res) => {
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

        const emails_data = await mySqlQury(`SELECT * FROM tbl_email_settings`)
        
        res.render("email_settings", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            emails_data : emails_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/email_settings", auth, async(req, res) => {
    try {
        
        const {email_host, email_port, email_email, email_password} = req.body
        
        const emails_data = await mySqlQury(`SELECT * FROM tbl_email_settings`)
        
        if (emails_data == "") {
            
            let query = `INSERT INTO tbl_email_settings (email_host, email_port, email, email_password) VALUE ('${email_host}', '${email_port}', '${email_email}', '${email_password}')`
            await mySqlQury(query)

        } else {

            let query = `UPDATE tbl_email_settings SET email_host = '${email_host}', email_port = '${email_port}', email = '${email_email}', email_password = '${email_password}' WHERE id = 1`
            await mySqlQury(query)
            
        }

        
        req.flash('success', `Added successfully`)
        res.redirect("/settings/email_settings")
        
    } catch (error) {
        console.log(error);
    }
})


// ========== Payment ========= //

router.get("/payment_type", auth, async(req, res) => {
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

        const payment_type = await mySqlQury(`SELECT * FROM tbl_payment_type ORDER BY id DESC`)
        
        res.render("payment_type", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            payment_type
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/payment_type_ajax", auth, async(req, res) => {
    try {
         
        const {dataid, checkbox_val} = req.body

        let query = `UPDATE tbl_payment_type SET active = '${checkbox_val}' WHERE id = '${dataid}'`
        await mySqlQury(query)
  
    } catch (error) {
        console.log(error);
    }
})

router.post("/payment_type", auth, async(req, res) => {
    try {
       
        const {payment_type, description} = req.body

        let query = `INSERT INTO tbl_payment_type (payment_type, description) VALUE ('${payment_type}', '${description}')`
        await mySqlQury(query)
        
        req.flash('success', `Added successfully`)
        res.redirect("/settings/payment_type")
        
    } catch (error) {
        console.log(error);
    }
})

router.post("/payment_type/:id", auth, async(req, res) => {
    try {
         
        const {payment_type, description} = req.body

        let query = `UPDATE tbl_payment_type SET payment_type = '${payment_type}', description = '${description}' WHERE id = '${req.params.id}'`
        await mySqlQury(query)
        
        req.flash('success', `Added successfully`)
        res.redirect("/settings/payment_type")
        
    } catch (error) {
        console.log(error);
    }
})

router.get("/payment_type/delete/:id", auth, async(req, res) => {
    try {
         
        let query = `DELETE FROM tbl_payment_type WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        req.flash('success', `Deleted successfully`)
        res.redirect("/settings/payment_type")
        
    } catch (error) {
        console.log(error);
    }
})



router.get("/payment_methods", auth, async(req, res) => {
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

        const payment_methods_data = await mySqlQury(`SELECT * FROM tbl_payment_methods ORDER BY id DESC`)
        
        res.render("payment_methods", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            payment_methods_data : payment_methods_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/payment_methods_ajax", auth, async(req, res) => {
    try {
         
        const {dataid, checkbox_val} = req.body

        let query = `UPDATE tbl_payment_methods SET active = '${checkbox_val}' WHERE id = '${dataid}'`
        await mySqlQury(query)
 
    } catch (error) {
        console.log(error);
    }
})

router.post("/payment_methods", auth, async(req, res) => {
    try {
        
        
        const {payment_methods, payment_days} = req.body

        let query = `INSERT INTO tbl_payment_methods (payment_methods, payment_days) VALUE ('${payment_methods}', '${payment_days}')`
        await mySqlQury(query)
        
        req.flash('success', `Added successfully`)
        res.redirect("/settings/payment_methods")
        
    } catch (error) {
        console.log(error);
    }
})

router.post("/payment_methods/:id", auth, async(req, res) => {
    try {
        
        const {payment_methods, payment_days} = req.body

        let query = `UPDATE tbl_payment_methods SET payment_methods = '${payment_methods}', payment_days = '${payment_days}' WHERE id = '${req.params.id}'`
        await mySqlQury(query)
        
        req.flash('success', `Added successfully`)
        res.redirect("/settings/payment_methods")
        
    } catch (error) {
        console.log(error);
    }
})

router.get("/payment_methods/delete/:id", auth, async(req, res) => {
    try {
        
        let query = `DELETE FROM tbl_payment_methods WHERE id = '${req.params.id}'`
        await mySqlQury(query)
        
        req.flash('success', `Deleted successfully`)
        res.redirect("/settings/payment_methods")
        
    } catch (error) {
        console.log(error);
    }
})


// ========== Miscellaneous ========= //



// ==== office_group ==== //

router.get("/office_group", auth, async(req, res) => {
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

        const office_group_data = await mySqlQury(`SELECT * FROM tbl_office_group ORDER BY id DESC`)
        
        res.render("office_group", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            office_group_data : office_group_data
        })
    } catch (error) {
        console.log(error);
    }
})


router.get("/add_office_group", auth, async(req, res) => {
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
        
        res.render("add_office_group", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/add_office_group", auth, async(req, res) => {
    try {
       
        const {office_name, office_code, office_address, office_city, office_mobile} = req.body

        let query = `INSERT INTO tbl_office_group (office_name, office_code, office_address, office_city, office_mobile) VALUE ('${office_name}', 
                        '${office_code}', '${office_address}', '${office_city}', '${office_mobile}')`
        await mySqlQury(query)

        req.flash('success', `Added successfully`)
        res.redirect("/settings/office_group")
        
    } catch (error) {
        console.log(error);
    }
})


router.get("/edit_office_group/:id", auth, async(req, res) => {
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

        let query = `SELECT * FROM tbl_office_group WHERE id = '${req.params.id}'`
        const office_group_data = await mySqlQury(query)
        
        res.render("edit_office_group", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            office_group_data : office_group_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/edit_office_group/:id", auth, async(req, res) => {
    try {
       
        const {office_name, office_code, office_address, office_city, office_mobile} = req.body
        
        let query = `UPDATE tbl_office_group SET office_name = '${office_name}', office_code = '${office_code}', office_address = '${office_address}', 
        office_city = '${office_city}', office_mobile = '${office_mobile}' WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        req.flash('success', `Added successfully`)
        res.redirect("/settings/office_group")
        
    } catch (error) {
        console.log(error);
    }
})


router.get("/office_group/delete/:id", auth, async(req, res) => {
    try {
        
        let query = `DELETE FROM tbl_office_group WHERE id = '${req.params.id}'`
        await mySqlQury(query)
        
        req.flash('success', `Deleted successfully`)
        res.redirect("/settings/office_group")
        
    } catch (error) {
        console.log(error);
    }
})


// ==== agency_group ==== //

router.get("/agency_group", auth, async(req, res) => {
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

        const agency_group_data = await mySqlQury(`SELECT * FROM tbl_agency_group ORDER BY id DESC`)
        
        res.render("agency_group", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            agency_group_data : agency_group_data
        })
    } catch (error) {
        console.log(error);
    }
})


router.get("/add_agency_group", auth, async(req, res) => {
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
        
        res.render("add_agency_group", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/add_agency_group", auth, async(req, res) => {
    try {
        
        const {agency_name, agency_address, agency_city, agency_mobile} = req.body

        let query = `INSERT INTO tbl_agency_group (agency_name, agency_address, agency_city, agency_mobile) VALUE ('${agency_name}', '${agency_address}', '${agency_city}', '${agency_mobile}')`
        await mySqlQury(query)
        
        req.flash('success', `Added successfully`)
        res.redirect("/settings/agency_group")
        
    } catch (error) {
        console.log(error);
    }
})

router.get("/edit_agency_group/:id", auth, async(req, res) => {
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

        let query = `SELECT * FROM tbl_agency_group WHERE id = '${req.params.id}'`
        const agency_group_data = await mySqlQury(query)
        
        res.render("edit_agency_group", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            agency_group_data : agency_group_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/edit_agency_group/:id", auth, async(req, res) => {
    try {
        
        const {agency_name, agency_address, agency_city, agency_mobile} = req.body
        
        let query = `UPDATE tbl_agency_group SET agency_name = '${agency_name}', agency_address = '${agency_address}', agency_city = '${agency_city}', agency_mobile = '${agency_mobile}' WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        req.flash('success', `Added successfully`)
        res.redirect("/settings/agency_group")
        
    } catch (error) {
        console.log(error);
    }
})

router.get("/agency_group/delete/:id", auth, async(req, res) => {
    try {
        
        let query = `DELETE FROM tbl_agency_group WHERE id = '${req.params.id}'`
        await mySqlQury(query)
        
        req.flash('success', `Deleted successfully`)
        res.redirect("/settings/agency_group")
        
    } catch (error) {
        console.log(error);
    }
})


// ==== courier_companies ==== //

router.get("/courier_companies", auth, async(req, res) => {
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

        const courier_companies_data = await mySqlQury(`SELECT * FROM tbl_courier_companies ORDER BY id DESC`)
        
        res.render("courier_companies", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            courier_companies_data : courier_companies_data
        })
    } catch (error) {
        console.log(error);
    }
})


router.get("/add_courier_companies", auth, async(req, res) => {
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
        
        res.render("add_courier_companies", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/add_courier_companies", auth, async(req, res) => {
    try {
       
        const {companies_name, companies_mobile, companies_address, companies_city, companies_country, companies_zipcode} = req.body

        let query = `INSERT INTO tbl_courier_companies (companies_name, companies_mobile, companies_address, companies_city, companies_country, companies_zipcode) VALUE
        ('${companies_name}', '${companies_mobile}', '${companies_address}', '${companies_city}', '${companies_country}', '${companies_zipcode}')`
        await mySqlQury(query)
        
        req.flash('success', `Added successfully`)
        res.redirect("/settings/courier_companies")
        
    } catch (error) {
        console.log(error);
    }
})


router.get("/edit_courier_companies/:id", auth, async(req, res) => {
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

        let query = `SELECT * FROM tbl_courier_companies WHERE id = '${req.params.id}'`
        const courier_companies_data = await mySqlQury(query)
        
        res.render("edit_courier_companies", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            courier_companies_data : courier_companies_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/edit_courier_companies/:id", auth, async(req, res) => {
    try {
       
        
        const {companies_name, companies_mobile, companies_address, companies_city, companies_country, companies_zipcode} = req.body

        let query = `UPDATE tbl_courier_companies SET companies_name = '${companies_name}', companies_mobile = '${companies_mobile}', companies_address = '${companies_address}', companies_city = '${companies_city}', companies_country = '${companies_country}', companies_zipcode = '${companies_zipcode}' WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        req.flash('success', `Added successfully`)
        res.redirect("/settings/courier_companies")
        
    } catch (error) {
        console.log(error);
    }
})


router.get("/courier_companies/delete/:id", auth, async(req, res) => {
    try {
       
        let query = `DELETE FROM tbl_courier_companies WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        req.flash('success', `Delete successfully`)
        res.redirect("/settings/courier_companies")
        
    } catch (error) {
        console.log(error);
    }
})


// ==== shipping_status ==== //

router.get("/shipping_status", auth, async(req, res) => {
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

        const shipping_status_data = await mySqlQury(`SELECT * FROM tbl_shipping_status ORDER BY id DESC`)
        
        res.render("shipping_status", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            shipping_status_data : shipping_status_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/shipping_status", auth, async(req, res) => {
    try {
        
        const {status_name, status_details} = req.body

        let query = `INSERT INTO tbl_shipping_status (status_name, status_details) VALUE ('${status_name}', '${status_details}')`
        await mySqlQury(query)
        
        req.flash('success', `Added successfully`)
        res.redirect("/settings/shipping_status")
        
    } catch (error) {
        console.log(error);
    }
})

router.post("/shipping_status/:id", auth, async(req, res) => {
    try {
       
        const {status_name, status_details} = req.body

        let query = `UPDATE tbl_shipping_status SET status_name = '${status_name}', status_details = '${status_details}' WHERE id = '${req.params.id}'`
        await mySqlQury(query)
        
        req.flash('success', `Added successfully`)
        res.redirect("/settings/shipping_status")
        
    } catch (error) {
        console.log(error);
    }
})


router.get("/shipping_status/delete/:id", auth, async(req, res) => {
    try {
        
        let query = `DELETE FROM tbl_shipping_status WHERE id = '${req.params.id}'`
        await mySqlQury(query)
        
        req.flash('success', `Deleted successfully`)
        res.redirect("/settings/shipping_status")
        
    } catch (error) {
        console.log(error);
    }
})

router.post("/shipping_status_ajax", auth, async(req, res) => {
    try {
         
        const {dataid, checkbox_val} = req.body

        let query = `UPDATE tbl_shipping_status SET status_checkbox = '${checkbox_val}' WHERE id = '${dataid}'`
        await mySqlQury(query)

        req.flash('success', `Added successfully`)
        res.redirect("/settings/shipping_status")
        
    } catch (error) {
        console.log(error);
    }
})



// ==== logistics_service ==== //

router.get("/logistics_service", auth, async(req, res) => {
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

        const logistics_service_data = await mySqlQury(`SELECT * FROM tbl_logistics_service ORDER BY id DESC`)
        
        res.render("logistics_service", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            logistics_service_data : logistics_service_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/logistics_service", auth, async(req, res) => {
    try {
        
        const {service_name, service_details} = req.body

        let query = `INSERT INTO tbl_logistics_service (service_name, service_details) VALUE ('${service_name}', '${service_details}')`
        await mySqlQury(query)
        
        req.flash('success', `Added successfully`)
        res.redirect("/settings/logistics_service")
        
    } catch (error) {
        console.log(error);
    }
})

router.post("/logistics_service/:id", auth, async(req, res) => {
    try {
       
        const {service_name, service_details} = req.body

        let query = `UPDATE tbl_logistics_service SET service_name = '${service_name}', service_details = '${service_details}' WHERE id = '${req.params.id}'`
        await mySqlQury(query)
        
        req.flash('success', `Added successfully`)
        res.redirect("/settings/logistics_service")
        
    } catch (error) {
        console.log(error);
    }
})

router.get("/logistics_service/delete/:id", auth, async(req, res) => {
    try {
        
        let query = `DELETE FROM tbl_logistics_service WHERE id = '${req.params.id}'`
        await mySqlQury(query)
        
        req.flash('success', `Delete successfully`)
        res.redirect("/settings/logistics_service")
        
    } catch (error) {
        console.log(error);
    }
})


// =========== Shipping Prefix =========== //

router.get("/prefix_service", auth, async(req, res) => {
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

        const shipping_prefix_data = await mySqlQury(`SELECT * FROM tbl_shipping_prefix ORDER BY id DESC`)
        
        res.render("shipping_prefix", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            shipping_prefix_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/prefix_service/:id", auth, async(req, res) => {
    try {
        
        const {prefix} = req.body

        let query = `UPDATE tbl_shipping_prefix SET prefix = '${prefix}' WHERE id = '${req.params.id}'`
        await mySqlQury(query)
        
        req.flash('success', `Added successfully`)
        res.redirect("/settings/prefix_service")
        
    } catch (error) {
        console.log(error);
    }
})

// ==== Shipping taxes ==== //

router.get("/taxes", auth, async(req, res) => {
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

        const taxe_data = await mySqlQury(`SELECT * FROM tbl_taxes`)

        if (taxe_data == "") {
            
            let query = `INSERT INTO tbl_taxes (min_tax_apply, tax, tax_count, min_declared_tax, declared_tax, shipping_insurance, custom_duties, vol_per, length_units, weight_val, weight_units) VALUE 
            ('${0}', '${0}', '${0}', '${0}', '${0}', '${0}', '${0}', '${0}', '${"Inch"}', '${0}', '${"KG"}' )`
            await mySqlQury(query)
        }

        const new_data = await mySqlQury(`SELECT * FROM tbl_taxes`)
        const length_units_data = await mySqlQury("SELECT * FROM tbl_length_units")
        const weight_units_data = await mySqlQury("SELECT * FROM tbl_weight_units")
        
        res.render("tax", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            taxe_data : new_data, length_units_data, weight_units_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/taxes", auth, async(req, res) => {
    try {
        
        const {min_tax_apply, tax, tax_count, min_declared_tax, declared_tax, shipping_insurance, custom_duties, vol_per, length_units, weight_val, weight_units} = req.body

        if (tax_count == undefined) {
            let count = 0
            let query = `UPDATE tbl_taxes SET min_tax_apply = '${min_tax_apply}', tax = '${tax}', tax_count = '${count}', min_declared_tax = '${min_declared_tax}', declared_tax = '${declared_tax}', shipping_insurance = '${shipping_insurance}', custom_duties = '${custom_duties}', vol_per = '${vol_per}', length_units = '${length_units}', weight_val = '${weight_val}', weight_units = '${weight_units}' WHERE id = '1'`
            await mySqlQury(query)
        } else {

            let query = `UPDATE tbl_taxes SET min_tax_apply = '${min_tax_apply}', tax = '${tax}', tax_count = '${tax_count}', min_declared_tax = '${min_declared_tax}', declared_tax = '${declared_tax}', shipping_insurance = '${shipping_insurance}', custom_duties = '${custom_duties}', vol_per = '${vol_per}', length_units = '${length_units}', weight_val = '${weight_val}', weight_units = '${weight_units}' WHERE id = '1'`
            await mySqlQury(query)
        }


        req.flash('success', `Added successfully`)
        res.redirect("/settings/taxes")
        
    } catch (error) {
        console.log(error);
    }
})


// ========== length_units ============== //

router.get("/length_units", auth, async(req, res) => {
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
        
        const length_units_data = await mySqlQury("SELECT * FROM tbl_length_units ORDER BY id DESC")

        res.render("length_units", {
            role_data, lang_data, language_name, accessdata, notification_data, length_units_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/length_units", auth, async(req, res) => {
    try {
         
        const {unit_name} = req.body

        let query = `INSERT INTO tbl_length_units (unit_name) VALUE ('${unit_name}')`
        await mySqlQury(query)

        req.flash('success', `Added successfully`)
        res.redirect("/settings/length_units")
        
    } catch (error) {
        console.log(error);
    }
})

router.post("/length_units/:id", auth, async(req, res) => {
    try {
       
        const {unit_name} = req.body

        let query = `UPDATE tbl_length_units SET unit_name = '${unit_name}' WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        req.flash('success', `Added successfully`)
        res.redirect("/settings/length_units")
        
    } catch (error) {
        console.log(error);
    }
})

router.get("/length_units/delete/:id", auth, async(req, res) => {
    try {
        
        let query = `DELETE FROM tbl_length_units WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        req.flash('success', `Unit Deleted successfully`)
        res.redirect("/settings/length_units")
        
    } catch (error) {
        console.log(error);
    }
})


// ========== weight_units ============== //

router.get("/weight_units", auth, async(req, res) => {
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
        
        const weight_units_data = await mySqlQury("SELECT * FROM tbl_weight_units ORDER BY id DESC")

        res.render("weight_units", {
            role_data, lang_data, language_name, accessdata, weight_units_data, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/weight_units", auth, async(req, res) => {
    try {
        
        const {unit_name} = req.body

        let query = `INSERT INTO tbl_weight_units (unit_name) VALUE ('${unit_name}')`
        await mySqlQury(query)

        req.flash('success', `Added successfully`)
        res.redirect("/settings/weight_units")
        
    } catch (error) {
        console.log(error);
    }
})

router.post("/weight_units/:id", auth, async(req, res) => {
    try {
         
        const {unit_name} = req.body

        let query = `UPDATE tbl_weight_units SET unit_name = '${unit_name}' WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        req.flash('success', `Added successfully`)
        res.redirect("/settings/weight_units")
        
    } catch (error) {
        console.log(error);
    }
})

router.get("/weight_units/delete/:id", auth, async(req, res) => {
    try {
         
        let query = `DELETE FROM tbl_weight_units WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        req.flash('success', `Unit Deleted successfully`)
        res.redirect("/settings/weight_units")
        
    } catch (error) {
        console.log(error);
    }
})


// ==== rates ==== //

router.get("/rates", auth, async(req, res) => {
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

        const rates_data = await mySqlQury(`SELECT tbl_rates.*, (select tbl_countries.countries_name from tbl_countries where tbl_rates.origin = tbl_countries.id) as counrty_origin,
                                                                (select tbl_states.state_name from tbl_states where tbl_rates.state = tbl_states.id) as state_name,
                                                                (select tbl_city.city_name from tbl_city where tbl_rates.city = tbl_city.id) as city_name,
                                                                (select tbl_countries.countries_name from tbl_countries where tbl_rates.des_country = tbl_countries.id) as destination_counrty,
                                                                (select tbl_states.state_name from tbl_states where tbl_rates.des_state = tbl_states.id) as destination_state,
                                                                (select tbl_city.city_name from tbl_city where tbl_rates.des_city = tbl_city.id) as destination_city FROM tbl_rates ORDER BY id DESC`)
        
        res.render("rates", {
            role_data : role_data, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            rates_data : rates_data,
            accessdata : accessdata
        })
    } catch (error) {
        console.log(error);
    }
})


router.get("/add_rates", auth, async(req, res) => {
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

        const countries_data = await mySqlQury(`SELECT * FROM tbl_countries `)
        
        res.render("add_rates", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            countries_data : countries_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.get("/add_rates/ajax/:id", auth, async(req, res) => {
    try {
        let query = `SELECT * FROM tbl_city WHERE state_id = '${req.params.id}'`
        const city_data = await mySqlQury(query)
        
        res.status(200).json({ city_data })
    } catch (error) {
        console.log(error);
    }
})

router.post("/add_rates", auth, async(req, res) => {
    try {
        
        const {origin, state, city, des_country, des_state, des_city, start_weight_range, end_weight_range, rate_price} = req.body

        const rate_data = await mySqlQury(`SELECT * FROM tbl_rates WHERE origin = '${origin}' AND state = '${state}' AND city = '${city}' AND des_country = '${des_country}' AND 
        des_state = '${des_state}' AND des_city = '${des_city}' AND start_weight_range = '${start_weight_range}' AND end_weight_range = '${end_weight_range}' AND rate_price = '${rate_price}'`)

        if (rate_data == "") {
            let query = `INSERT INTO tbl_rates (origin, state, city, des_country, des_state, des_city, start_weight_range, end_weight_range, rate_price) VALUE ('${origin}', '${state}', '${city}', '${des_country}', '${des_state}', '${des_city}', '${start_weight_range}', '${end_weight_range}', '${rate_price}')`
            await mySqlQury(query)
        } else {
            req.flash('errors', `data already exists`)
            res.redirect("/settings/add_rates")
        }

        req.flash('success', `Added successfully`)
        res.redirect("/settings/rates")
        
    } catch (error) {
        console.log(error);
    }
})


router.get("/edit_rates/:id", auth, async(req, res) => {
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

        const rates_data = await mySqlQury(`SELECT * FROM tbl_rates WHERE id = '${req.params.id}'`)

        const states_data = await mySqlQury(`SELECT * FROM tbl_states WHERE countries_id = '${rates_data[0].origin}'`)
        const city_data = await mySqlQury(`SELECT * FROM tbl_city WHERE state_id = '${rates_data[0].state}'`)

        const countries_data = await mySqlQury(`SELECT * FROM tbl_countries `)
        const destination_states_data = await mySqlQury(`SELECT * FROM tbl_states WHERE countries_id = '${rates_data[0].des_country}'`)
        const destination_city_data = await mySqlQury(`SELECT * FROM tbl_city WHERE state_id = '${rates_data[0].des_state}'`)

        
        res.render("edit_rates", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            countries_data : countries_data,
            states_data : states_data,
            city_data : city_data,
            destination_states : destination_states_data,
            destination_city : destination_city_data,
            rates_data : rates_data[0]
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/edit_rates/:id", auth, async(req, res) => {
    try {
       
        const {origin, state, city, des_country, des_state, des_city, start_weight_range, end_weight_range, rate_price} = req.body

        let query = `UPDATE tbl_rates SET origin = '${origin}', state = '${state}', city = '${city}', des_country = '${des_country}', des_state = '${des_state}', des_city = '${des_city}', start_weight_range = '${start_weight_range}', end_weight_range = '${end_weight_range}', rate_price = '${rate_price}' WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        req.flash('success', `Added successfully`)
        res.redirect("/settings/rates")
        
    } catch (error) {
        console.log(error);
    }
})

router.get("/rates/delete/:id", auth, async(req, res) => {
    try {
       
        let query = `DELETE FROM tbl_rates WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        req.flash('success', `Deleted successfully`)
        res.redirect("/settings/rates")
        
        
    } catch (error) {
        console.log(error);
    }
})



// ==== packaging ==== //

router.get("/packaging", auth, async(req, res) => {
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

        const packaging_data = await mySqlQury("SELECT * FROM tbl_packaging ORDER BY id DESC")
        
        res.render("packaging", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            packaging_data : packaging_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/packaging", auth, async(req, res) => {
    try {
        
        const {packaging_type, packaging_details} = req.body

        let query = `INSERT INTO tbl_packaging (packaging_type, packaging_details) VALUE ('${packaging_type}', '${packaging_details}')`
        await mySqlQury(query)

        req.flash('success', `${packaging_type} type add successfully`)
        res.redirect("/settings/packaging")
        
    } catch (error) {
        console.log(error);
    }
})

router.post("/packaging/:id", auth, async(req, res) => {
    try {
       
        const {packaging_type, packaging_details} = req.body

        let query = `UPDATE tbl_packaging SET packaging_type = '${packaging_type}', packaging_details = '${packaging_details}' WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        req.flash('success', `${packaging_type} type add successfully`)
        res.redirect("/settings/packaging")
        
    } catch (error) {
        console.log(error);
    }
})

router.get("/packaging/delete/:id", auth, async(req, res) => {
    try {
         
        let query = `DELETE FROM tbl_packaging WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        req.flash('success', `Packaging type is deleted successfully`)
        res.redirect("/settings/packaging")
        
    } catch (error) {
        console.log(error);
    }
})


// ==== modes ==== //

router.get("/shipping_modes", auth, async(req, res) => {
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

        const shipping_modes_data = await mySqlQury(`SELECT * FROM tbl_shipping_modes ORDER BY id DESC`)
        
        res.render("shipping_modes", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            shipping_modes_data : shipping_modes_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/shipping_modes", auth, async(req, res) => {
    try {
       
        const {shipping_modes, shipping_modes_details} = req.body

        let query = `INSERT INTO tbl_shipping_modes (shipping_modes, shipping_modes_details) VALUE ('${shipping_modes}', '${shipping_modes_details}')`
        await mySqlQury(query)
        
        req.flash('success', `Added successfully`)
        res.redirect("/settings/shipping_modes")
        
    } catch (error) {
        console.log(error);
    }
})

router.post("/shipping_modes/:id", auth, async(req, res) => {
    try {
        
        const {shipping_modes, shipping_modes_details} = req.body

        let query = `UPDATE tbl_shipping_modes SET shipping_modes = '${shipping_modes}', shipping_modes_details = '${shipping_modes_details}' WHERE id = '${req.params.id}'`
        await mySqlQury(query)
        
        req.flash('success', `Added successfully`)
        res.redirect("/settings/shipping_modes")
       
    } catch (error) {
        console.log(error);
    }
})

router.get("/shipping_modes/delete/:id", auth, async(req, res) => {
    try {
        
        let query = `DELETE FROM tbl_shipping_modes WHERE id = '${req.params.id}'`
        await mySqlQury(query)
        
        req.flash('success', `deleted successfully`)
        res.redirect("/settings/shipping_modes")
        
    } catch (error) {
        console.log(error);
    }
})


// ==== shipping_times ==== //

router.get("/shipping_times", auth, async(req, res) => {
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

        const shipping_times_data = await mySqlQury(`SELECT * FROM tbl_shipping_times ORDER BY id DESC`)
        
        res.render("shipping_times", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            shipping_times_data : shipping_times_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/shipping_times", auth, async(req, res) => {
    try {
        
        const {shipping_times, shipping_details} = req.body

        let query = `INSERT INTO tbl_shipping_times (shipping_times, shipping_details) VALUE ('${shipping_times}', '${shipping_details}')`
        await mySqlQury(query)

        req.flash('success', `Added successfully`)
        res.redirect("/settings/shipping_times")
        
    } catch (error) {
        console.log(error);
    }
})

router.post("/shipping_times/:id", auth, async(req, res) => {
    try {
         
        const {shipping_times, shipping_details} = req.body

        let query = `UPDATE tbl_shipping_times SET shipping_times = '${shipping_times}', shipping_details = '${shipping_details}' WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        req.flash('success', `Added successfully`)
        res.redirect("/settings/shipping_times")
        
    } catch (error) {
        console.log(error);
    }
})

router.get("/shipping_times/delete/:id", auth, async(req, res) => {
    try {
        
        const query = `DELETE FROM tbl_shipping_times WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        req.flash('success', `Deleted successfully`)
        res.redirect("/settings/shipping_times")
        
    } catch (error) {
        console.log(error);
    }
})


// ==== countries ==== //

router.get("/countries", auth, async(req, res) => {
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

        const countries_data = await mySqlQury("SELECT * FROM tbl_countries ORDER BY id DESC")

        res.render("countries", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            countries_data : countries_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/countries", auth, async(req, res) => {
    try {
         
        const {countries_name, countries_iso} = req.body

        const old_countries = await mySqlQury(`SELECT * FROM tbl_countries WHERE countries_name = '${countries_name}'`)

        if (old_countries == "") {
            
            let query = "INSERT INTO tbl_countries (countries_name, countries_iso) VALUE ('"+ countries_name +"', '"+ countries_iso +"')"
            await mySqlQury(query)
        } else {
            req.flash('errors', `data already exists`)
            res.redirect("/settings/countries")
        }

        
        req.flash('success', `${countries_name} is add successfully`)
        res.redirect("/settings/countries")
        
    } catch (error) {
        console.log(error);
    }
})

router.post("/countries/:id", auth, async(req, res) => {
    try {
       
        const {countries_name, countries_iso} = req.body
        

        let query = `UPDATE tbl_countries SET countries_name = '${countries_name}', countries_iso = '${countries_iso}' WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        req.flash('success', `${countries_name} is add successfully`)
        res.redirect("/settings/countries")
        
    } catch (error) {
        console.log(error);
    }
})

router.get("/countries/delete/:id", auth, async(req, res) => {
    try {
        
        let query = `DELETE FROM tbl_countries WHERE id = '${req.params.id}'`
        await mySqlQury(query)

        req.flash('success', `Country is delete successfully`)
        res.redirect("/settings/countries")
        
    } catch (error) {
        console.log(error);
    }
})


// ==== states ==== //

router.get("/states", auth, async(req, res) => {
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

        const countries_data = await mySqlQury("SELECT * FROM tbl_countries")

        const states_data = await mySqlQury(`SELECT tbl_states.*,tbl_countries.countries_name as countries_name FROM tbl_states join tbl_countries on tbl_states.countries_id=tbl_countries.id ORDER BY id DESC`)

        res.render("states", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            countries_data : countries_data,
            states_data : states_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/states", auth, async(req, res) => {
    try {
        
        const {countries_id, state_name} = req.body

        const old_states = await mySqlQury(`SELECT * FROM tbl_states WHERE countries_id = '${countries_id}' AND state_name = '${state_name}'`)

        if (old_states == "") {
            let query = `INSERT INTO tbl_states (countries_id, state_name) VALUE ('${countries_id}', '${state_name}')`
            await mySqlQury(query)
        } else {
            req.flash('errors', `data already exists`)
            res.redirect("/settings/states")
        }
        
        req.flash('success', `Added successfully`)
        res.redirect("/settings/states")
        
    } catch (error) {
        console.log(error);
    }
})

router.post("/states/:id", auth, async(req, res) => {
    try {
         
        const {countries_id, state_name} = req.body

        let query = `UPDATE tbl_states SET countries_id = '${countries_id}', state_name = '${state_name}' WHERE id = '${req.params.id}'`
        await mySqlQury(query)
        
        req.flash('success', `Added successfully`)
        res.redirect("/settings/states")
        
    } catch (error) {
        console.log(error);
    }
})

router.get("/states/delete/:id", auth, async(req, res) => {
    try {
        
        let query = `DELETE FROM tbl_states WHERE id = '${req.params.id}'`
        await mySqlQury(query)
        
        req.flash('success', `Deleted successfully`)
        res.redirect("/settings/states")
        
    } catch (error) {
        console.log(error);
    }
})


// ==== city ==== //

router.get("/city", auth, async(req, res) => {
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

        const countries_data = await mySqlQury("SELECT * FROM tbl_countries")
        
        const city_data = await mySqlQury(`SELECT tbl_city.*, tbl_states.state_name as state_name FROM tbl_city join tbl_states on tbl_city.state_id = tbl_states.id ORDER BY id DESC`)
        
        const states_data = await mySqlQury(`SELECT * FROM tbl_states`)
        
        res.render("city", {
            role_data : role_data, accessdata, lang_data, language_name, notification_data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification,
            countries_data : countries_data,
            city_data : city_data,
            states_data : states_data
        })
    } catch (error) {
        console.log(error);
    }
})

router.get("/city/ajax/:id", auth, async(req, res) => {
    try {
        
        const state_data = await mySqlQury(`SELECT * FROM tbl_states WHERE countries_id = '${req.params.id}'`)
        
        res.status(200).json({ state_data })
    } catch (error) {
        console.log(error);
    }
})

router.post("/city", auth, async(req, res) => {
    try {
        
        const {countries_id, state_id, city_name} = req.body

        const old_city = await mySqlQury(`SELECT * FROM tbl_city WHERE countries_id = '${countries_id}' AND state_id = '${state_id}' AND city_name = '${city_name}'`)

        if (old_city == "") {
            
            let query = `INSERT INTO tbl_city (countries_id, state_id, city_name) VALUE ('${countries_id}', '${state_id}', '${city_name}')`
            await mySqlQury(query)
        } else {
            req.flash('errors', `data already exists`)
            res.redirect("/settings/city")
        }

        
        req.flash('success', `Added successfully`)
        res.redirect("/settings/city")
        
    } catch (error) {
        console.log(error);
    }
})

router.post("/city/:id", auth, async(req, res) => {
    try {
        
        const {countries_id, state_id, city_name} = req.body

        let query = `UPDATE tbl_city SET countries_id = '${countries_id}', state_id = '${state_id}', city_name = '${city_name}' WHERE id = '${req.params.id}' `
        await mySqlQury(query)
        
        req.flash('success', `Added successfully`)
        res.redirect("/settings/city")
        
    } catch (error) {
        console.log(error);
    }
})

router.get("/city/delete/:id", auth, async(req, res) => {
    try {
        
        let query = `DELETE FROM tbl_city WHERE id = '${req.params.id}' `
        await mySqlQury(query)
        
        req.flash('success', `Deleted successfully`)
        res.redirect("/settings/city")
        
    } catch (error) {
        console.log(error);
    }
})


// ========== notification ============ //

router.get("/notification", auth, async(req, res) => {
    try {
        const role_data = req.user
        const lang_data = req.language_data
        const language_name = req.lang
        const accessdata = await access (req.user)
        const notification_data = await mySqlQury(`SELECT * FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC LIMIT 3`)

        const data = await mySqlQury(`SELECT tbl_notification.*, (select tbl_admin.first_name from tbl_admin where tbl_notification.sender = tbl_admin.id) as firstname,
                                                                                (select tbl_admin.last_name from tbl_admin where tbl_notification.sender = tbl_admin.id) as lastname
                                                                                FROM tbl_notification WHERE received = '${role_data.id}' ORDER BY id DESC`)
        console.log(data);

        const register_packages_notification = await mySqlQury(`SELECT * FROM tbl_register_packages`)
        const shipment_notification = await mySqlQury(`SELECT * FROM tbl_shipment`)
        const pickup_notification = await mySqlQury(`SELECT * FROM tbl_pickup`)
        const consolidated_notification = await mySqlQury(`SELECT * FROM tbl_consolidated`)

        res.render("notification",{
            role_data, lang_data, language_name, accessdata, notification_data, data,
            register_packages_notification, shipment_notification, pickup_notification, consolidated_notification
        })
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;