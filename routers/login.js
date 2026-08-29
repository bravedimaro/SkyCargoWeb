const express = require("express");
const app = express();
const router = express.Router();
const {mySqlQury} = require('../middleware/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const access = require('../middleware/access');
const FCM = require('fcm-node');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const fs = require('fs')
const countryCodes = require('country-codes-list')


// =========== helpers ============= //

async function loadSettings() {
    const rows = await mySqlQury(`SELECT * FROM tbl_general_settings`);
    return rows[0];
}

async function customerLoginEnabled() {
    const s = await loadSettings();
    return !!s && (s.customer_login_enabled == 1 || s.customer_login_enabled === true);
}

const ROLE_PORTALS = {
    admin:    { role: '1', action: '/platformAuth',     title: 'Admin Login',    roleLabel: 'Admin',    icon: 'user-shield' },
    driver:   { role: '3', action: '/platformdriver',   title: 'Driver Login',   roleLabel: 'Driver',   icon: 'truck' },
    customer: { role: '2', action: '/platformcustomer', title: 'Customer Login', roleLabel: 'Customer', icon: 'user' },
};

async function renderPortal(req, res, key) {
    try {
        const cfg = ROLE_PORTALS[key];
        const data = await loadSettings();
        res.render('platform_login', {
            data, title: cfg.title, action: cfg.action, roleLabel: cfg.roleLabel, icon: cfg.icon,
        });
    } catch (error) {
        console.log('[portal] error', error);
        res.redirect('/');
    }
}

async function doLogin(req, res, expectedRole, backUrl) {
    try {
        const { email, password } = req.body;

        const data = await mySqlQury(`SELECT * FROM tbl_admin WHERE email = ?`, [email]);

        if (!data[0]) {
            req.flash('errors', `Invalid email or password`);
            return res.redirect(backUrl);
        }

        const hash_pass = await bcrypt.compare(password, data[0].password);
        if (!hash_pass) {
            req.flash('errors', `Invalid email or password`);
            return res.redirect(backUrl);
        }

        if (String(data[0].role) !== String(expectedRole)) {
            req.flash('errors', `This account cannot sign in from here.`);
            return res.redirect(backUrl);
        }

        if (expectedRole === '2') {
            const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE email = ?`, [data[0].email]);
            if (!customer_data[0] || customer_data[0].customer_active == '0') {
                req.flash('errors', `Your account is waiting for approval.`);
                return res.redirect(backUrl);
            }
        }

        if (expectedRole === '3') {
            const drivers_data = await mySqlQury(`SELECT * FROM tbl_drivers WHERE email = ?`, [data[0].email]);
            if (!drivers_data[0] || drivers_data[0].active == '0') {
                req.flash('errors', `Your account is waiting for approval.`);
                return res.redirect(backUrl);
            }
        }

        const token = jwt.sign({ id: data[0].id, name: data[0].first_name, email: data[0].email, role: data[0].role }, process.env.TOKEN_KEY);
        res.cookie("jwt", token, { expires: new Date(Date.now() + 60000 * 60) });

        const lang = req.cookies.lang;
        if (lang == undefined) {
            const lang_data = jwt.sign({ lang: 'en' }, process.env.TOKEN);
            res.cookie("lang", lang_data);
        }

        req.flash('success', `login successfully`);
        res.redirect("/index");
    } catch (error) {
        console.log('[login] error', error);
        req.flash('errors', `Something went wrong. Please try again.`);
        res.redirect(backUrl);
    }
}


// =========== landing page ============= //

router.get("/", async(req, res) => {
    try {
        const data = await loadSettings();
        res.render("landing", { data });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
})


// =========== platform logins ============= //

router.get("/platformAuth", (req, res) => renderPortal(req, res, 'admin'));
router.get("/platformdriver", (req, res) => renderPortal(req, res, 'driver'));
router.get("/platformcustomer", async(req, res) => {
    if (!(await customerLoginEnabled())) return res.redirect("/");
    renderPortal(req, res, 'customer');
});

router.post("/platformAuth", (req, res) => doLogin(req, res, '1', '/platformAuth'));
router.post("/platformdriver", (req, res) => doLogin(req, res, '3', '/platformdriver'));
router.post("/platformcustomer", async(req, res) => {
    if (!(await customerLoginEnabled())) return res.redirect("/");
    doLogin(req, res, '2', '/platformcustomer');
});


router.get("/validate", async(req, res) => {
    try {
        const accessdata = await access (req.user)

        const data = await mySqlQury(`SELECT * FROM tbl_general_settings`)

        const customer_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE customer_active = '1' ORDER BY id LIMIT 1`)

        res.render("validate", {data, customer_data, accessdata})
    } catch (error) {
        console.log(error);
    }
})


// =========== lang ============= //

router.get("/lang/:id", async(req, res) => {
    try {
        console.log(req.params.id);
        const token = jwt.sign({lang : req.params.id}, process.env.TOKEN)
        res.cookie("lang", token)
        
        res.status(200).json({token})
    } catch (error) {
        console.log(error);
    }
})


// =========== customers sign_up ============= //

router.get("/sign_up", async(req, res) => {
    try {
        if (!(await customerLoginEnabled())) return res.redirect("/");

        const accessdata = await access (req.user)

        const data = await mySqlQury(`SELECT * FROM tbl_general_settings`)

        const countries = await mySqlQury(`SELECT * FROM tbl_countries`)
        const states = await mySqlQury(`SELECT * FROM tbl_states`)
        const city = await mySqlQury(`SELECT * FROM tbl_city`)

        const Country_name = countryCodes.customList('countryCode', '{countryCode}')
        const nameCode = Object.values(Country_name)

        const myCountryCodesObject = countryCodes.customList('countryCode', '+{countryCallingCode}')
        const CountryCode = Object.values(myCountryCodesObject)
        
        res.render("sign_up", {data, countries, states, city, accessdata, nameCode, CountryCode})
    } catch (error) {
        console.log(error);
    }
})

router.get("/country/ajax/:id", async(req, res) => {
    try {
        
        const state_data = await mySqlQury(`SELECT * FROM tbl_states WHERE countries_id = '${req.params.id}'`)
        console.log(1111111, state_data);
        
        res.status(200).json({ state_data })
    } catch (error) {
        console.log(error);
    }
})

router.get("/state/ajax/:id", async(req, res) => {
    try {
        const query = `SELECT * FROM tbl_city WHERE state_id = '${req.params.id}'`
        const city_data = await mySqlQury(query)
        
        res.status(200).json({ city_data })
    } catch (error) {
        console.log(error);
    }
})

router.post("/sign_up", async(req, res) => {
    try {
        if (!(await customerLoginEnabled())) return res.redirect("/");

        const {first_name, last_name, email, country_code, phone_no, password, address, country, state, city, zip_code} = req.body

        const hash = await bcrypt.hash(password, 10)

        let query = `INSERT INTO tbl_admin (first_name, last_name, email, country_code, phone_no, password, role) VALUE ('${first_name}', '${last_name}', '${email}', '${country_code}', '${phone_no}', '${hash}', 2)`
        await mySqlQury(query)

        const admin_data = await mySqlQury(`SELECT * FROM tbl_admin WHERE email = '${email}'`)
        console.log(admin_data);

        let customer_data = `INSERT INTO tbl_customers (first_name, last_name, email, country_code, mobile, customers_country, customers_state, customers_city, customers_zipcode, customers_address, customer_active, login_id) VALUE
        ('${first_name}', '${last_name}', '${email}', '${country_code}', '${phone_no}', '${country}', '${state}', '${city}', '${zip_code}', '${address}', '0', '${admin_data[0].id}')`
        await mySqlQury(customer_data)

        req.flash('success', `Your information will be sent to the administration for approval.!`)
        res.redirect("/")
    } catch (error) {
        console.log(error);
    }
})


// ========== drivers sing_up ========= //

router.get("/driver_singup", async(req, res) => {
    try {
        const accessdata = await access (req.user)
        const data = await mySqlQury(`SELECT * FROM tbl_general_settings`)

        res.render("sing_up_driver", {data, accessdata})
    } catch (error) {
        console.log(error);
    }
})

router.post("/driver_singup", async(req, res) => {
    try {
        const {first_name, last_name, email, phone_no, vehicle_plate, password} = req.body

        const hash = await bcrypt.hash(password, 10)

        let query = "INSERT INTO tbl_admin (first_name, last_name, email, phone_no, password, role) VALUE ('"+ first_name +"', '"+ last_name +"', '"+ email +"', '"+ phone_no +"', '"+ hash +"', 3)"
        await mySqlQury(query)

        const admin_data = await mySqlQury(`SELECT * FROM tbl_admin WHERE email = '${email}'`)
        console.log(admin_data);

        let drivers_data = `INSERT INTO tbl_drivers (first_name, last_name, email, mobile, vehicle_plate, active, login_id) VALUE
        ('${first_name}', '${last_name}', '${email}', '${phone_no}', '${vehicle_plate}', '0', '${admin_data[0].id}')`
        await mySqlQury(drivers_data)

        req.flash('success', `Your information will be sent to the administration for approval.!`)
        res.redirect("/")
    } catch (error) {
        console.log(error);
    }
})


// =========== logout ============ //
router.get("/logout", (req, res) => {
    res.clearCookie("jwt")

    res.redirect('/');
});


// ========= tracking ============= //

router.get("/tracking", async(req, res) => {
    try {
        const accessdata = await access (req.user)
        console.log(accessdata);
        const general_settings_data = await mySqlQury(`SELECT * FROM tbl_general_settings`)

        res.render("tracking", {
            general_settings_data : general_settings_data[0],
            accessdata
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/tracking/ajax", async(req, res) => {
    try {
        const {invoice_no, shipment_type} = req.body

        if (shipment_type == '1') {
            let data = await mySqlQury(`SELECT tbl_register_packages.*, (select tbl_customers.first_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customer_firstname,
                                                                        (select tbl_customers.last_name from tbl_customers where tbl_register_packages.customer = tbl_customers.id) as customer_lastname
                                                                        FROM tbl_register_packages WHERE invoice ='${invoice_no}'`)

            if (data == "") {
                return  res.status(200).json({status:'error', message:'Tracking Number Not Found'}) 
            }
            
            const edit_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${data[0].customer}'`)
            const country = edit_data[0].customers_country.split(',');
            const city = edit_data[0].customers_city.split(',');
            const address = edit_data[0].customers_address.split(',');
            
            const countries_list = await mySqlQury("SELECT * FROM tbl_countries")
            const city_list = await mySqlQury("SELECT * FROM tbl_city")
            
            const tracking_data = await mySqlQury(`SELECT tbl_tracking_history.*, (select tbl_countries.countries_name from tbl_countries where tbl_tracking_history.location = tbl_countries.id) as countries_name,
                                                                                (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_tracking_history.delivery_status = tbl_shipping_status.id) as status_name
                                                                                FROM tbl_tracking_history WHERE invoice = '${invoice_no}'`)

            if (shipment_type == '1') {
                
                res.status(200).json({data, country, city, address, countries_list, city_list, tracking_data})
            } else {
                        
                const edit_client_data = await mySqlQury(`SELECT * FROM tbl_client WHERE id = '${data[0].client}'`)
                const client_country = edit_client_data[0].country.split(',');
                const client_city = edit_client_data[0].city.split(',');
                const client_address = edit_client_data[0].address.split(',');
                
                res.status(200).json({data, country, city, address, tracking_data, client_country, client_city, client_address, countries_list, city_list})
            }

        } else if (shipment_type == '2') {
            let data = await mySqlQury(`SELECT tbl_shipment.*, (select tbl_customers.first_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customer_firstname,
                                                                (select tbl_customers.last_name from tbl_customers where tbl_shipment.customer = tbl_customers.id) as customer_lastname,
                                                                (select tbl_client.first_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_firstname,
                                                                (select tbl_client.last_name from tbl_client where tbl_shipment.client = tbl_client.id) as client_lastname
                                                                FROM tbl_shipment WHERE invoice ='${invoice_no}'`)
            
            if (data == "") {
                return  res.status(200).json({status:'error', message:'Tracking Number Not Found'}) 
            }
            
            const edit_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${data[0].customer}'`)
            const country = edit_data[0].customers_country.split(',');
            const city = edit_data[0].customers_city.split(',');
            const address = edit_data[0].customers_address.split(',');
            
            const countries_list = await mySqlQury("SELECT * FROM tbl_countries")
            const city_list = await mySqlQury("SELECT * FROM tbl_city")
            
            const tracking_data = await mySqlQury(`SELECT tbl_tracking_history.*, (select tbl_countries.countries_name from tbl_countries where tbl_tracking_history.location = tbl_countries.id) as countries_name,
                                                                                (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_tracking_history.delivery_status = tbl_shipping_status.id) as status_name
                                                                                FROM tbl_tracking_history WHERE invoice = '${invoice_no}'`)
            
            if (shipment_type == '1') {
                
                res.status(200).json({data, country, city, address, countries_list, city_list, tracking_data})
            } else {
                        
                const edit_client_data = await mySqlQury(`SELECT * FROM tbl_client WHERE id = '${data[0].client}'`)
                const client_country = edit_client_data[0].country.split(',');
                const client_city = edit_client_data[0].city.split(',');
                const client_address = edit_client_data[0].address.split(',');
                
                res.status(200).json({data, country, city, address, tracking_data, client_country, client_city, client_address, countries_list, city_list})
            }

        } else if (shipment_type == '3') {
            let data = await mySqlQury(`SELECT tbl_pickup.*, (select tbl_customers.first_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customer_firstname,
                                                            (select tbl_customers.last_name from tbl_customers where tbl_pickup.customer = tbl_customers.id) as customer_lastname,
                                                            (select tbl_client.first_name from tbl_client where tbl_pickup.client = tbl_client.id) as client_firstname,
                                                            (select tbl_client.last_name from tbl_client where tbl_pickup.client = tbl_client.id) as client_lastname
                                                            FROM tbl_pickup WHERE invoice ='${invoice_no}'`)

                                                            
            if (data == "") {
                return  res.status(200).json({status:'error', message:'Tracking Number Not Found'}) 
            }
            
            const edit_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${data[0].customer}'`)
            const country = edit_data[0].customers_country.split(',');
            const city = edit_data[0].customers_city.split(',');
            const address = edit_data[0].customers_address.split(',');
            
            const countries_list = await mySqlQury("SELECT * FROM tbl_countries")
            const city_list = await mySqlQury("SELECT * FROM tbl_city")
            
            const tracking_data = await mySqlQury(`SELECT tbl_tracking_history.*, (select tbl_countries.countries_name from tbl_countries where tbl_tracking_history.location = tbl_countries.id) as countries_name,
                                                                                (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_tracking_history.delivery_status = tbl_shipping_status.id) as status_name
                                                                                FROM tbl_tracking_history WHERE invoice = '${invoice_no}'`)

            if (shipment_type == '1') {
                
                res.status(200).json({data, country, city, address, countries_list, city_list, tracking_data})
            } else {
                        
                const edit_client_data = await mySqlQury(`SELECT * FROM tbl_client WHERE id = '${data[0].client}'`)
                const client_country = edit_client_data[0].country.split(',');
                const client_city = edit_client_data[0].city.split(',');
                const client_address = edit_client_data[0].address.split(',');
                
                res.status(200).json({data, country, city, address, tracking_data, client_country, client_city, client_address, countries_list, city_list})
            }

        } else if (shipment_type == '4') {
            let data = await mySqlQury(`SELECT tbl_consolidated.*, (select tbl_customers.first_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customer_firstname,
                                                                    (select tbl_customers.last_name from tbl_customers where tbl_consolidated.customer = tbl_customers.id) as customer_lastname,
                                                                    (select tbl_client.first_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_firstname,
                                                                    (select tbl_client.last_name from tbl_client where tbl_consolidated.client = tbl_client.id) as client_lastname
                                                                    FROM tbl_consolidated WHERE invoice ='${invoice_no}'`)

                                                                    
            if (data == "") {
                return  res.status(200).json({status:'error', message:'Tracking Number Not Found'}) 
            }
            
            const edit_data = await mySqlQury(`SELECT * FROM tbl_customers WHERE id = '${data[0].customer}'`)
            const country = edit_data[0].customers_country.split(',');
            const city = edit_data[0].customers_city.split(',');
            const address = edit_data[0].customers_address.split(',');
            
            const countries_list = await mySqlQury("SELECT * FROM tbl_countries")
            const city_list = await mySqlQury("SELECT * FROM tbl_city")
            
            const tracking_data = await mySqlQury(`SELECT tbl_tracking_history.*, (select tbl_countries.countries_name from tbl_countries where tbl_tracking_history.location = tbl_countries.id) as countries_name,
                                                                                (select tbl_shipping_status.status_name from tbl_shipping_status where tbl_tracking_history.delivery_status = tbl_shipping_status.id) as status_name
                                                                                FROM tbl_tracking_history WHERE invoice = '${invoice_no}'`)

            if (shipment_type == '1') {
                
                res.status(200).json({data, country, city, address, countries_list, city_list, tracking_data})
            } else {
                        
                const edit_client_data = await mySqlQury(`SELECT * FROM tbl_client WHERE id = '${data[0].client}'`)
                const client_country = edit_client_data[0].country.split(',');
                const client_city = edit_client_data[0].city.split(',');
                const client_address = edit_client_data[0].address.split(',');
                
                res.status(200).json({data, country, city, address, tracking_data, client_country, client_city, client_address, countries_list, city_list})
            }

        }

        
        
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;