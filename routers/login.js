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
const nodemailer = require('nodemailer')


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


// =========== contact form ============= //

function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function contactEmailWrapper(title, body) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Helvetica Neue',Arial,sans-serif;color:#0f172a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5eaf3;">
<tr><td style="background:linear-gradient(135deg,#1e3a8a,#2563eb);padding:24px;text-align:center;color:#fff;">
<h1 style="margin:0;font-size:20px;font-weight:700;letter-spacing:.3px;">SkyCargo</h1>
<p style="margin:6px 0 0;font-size:12px;opacity:.85;letter-spacing:1px;">Freight · Shipping · Logistics</p>
</td></tr>
<tr><td style="padding:30px;">${body}</td></tr>
<tr><td style="background:#0b1530;color:#9fb0d0;padding:18px;text-align:center;font-size:12px;">
&copy; ${new Date().getFullYear()} SkyCargo. All rights reserved.
</td></tr>
</table></td></tr></table></body></html>`;
}

function contactGuestEmail({ name, shipment_type, tracking_id, message }) {
    const body = `
        <h2 style="margin:0 0 14px;font-size:20px;color:#0f172a;">Thanks, ${escapeHtml(name)}!</h2>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">
            We've received your enquiry. A member of the SkyCargo team will get back to you within one business day.
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;border:1px solid #e5eaf3;border-radius:8px;background:#f8fafc;">
            <tr><td style="padding:14px 18px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#64748b;">Your submission</td></tr>
            ${shipment_type ? `<tr><td style="padding:6px 18px;font-size:13px;color:#64748b;width:120px;">Shipment type</td><td style="padding:6px 18px;font-size:14px;color:#0f172a;">${escapeHtml(shipment_type)}</td></tr>` : ''}
            ${tracking_id ? `<tr><td style="padding:6px 18px;font-size:13px;color:#64748b;width:120px;">Tracking ID</td><td style="padding:6px 18px;font-size:14px;color:#0f172a;">${escapeHtml(tracking_id)}</td></tr>` : ''}
            <tr><td style="padding:6px 18px;font-size:13px;color:#64748b;width:120px;vertical-align:top;">Message</td><td style="padding:6px 18px;font-size:14px;color:#0f172a;line-height:1.6;">${escapeHtml(message)}</td></tr>
        </table>
        <p style="margin:16px 0 0;font-size:14px;color:#64748b;">If your matter is urgent, please reply to this email.</p>`;
    return {
        subject: 'We received your message – SkyCargo',
        html: contactEmailWrapper('Thanks for contacting SkyCargo', body),
    };
}

function contactOwnerEmail({ name, email, phone, shipment_type, tracking_id, message, submittedAt }) {
    const body = `
        <h2 style="margin:0 0 14px;font-size:20px;color:#0f172a;">New contact enquiry</h2>
        <p style="margin:0 0 18px;font-size:14px;color:#64748b;">Submitted ${escapeHtml(submittedAt)}</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:14px 0;border:1px solid #e5eaf3;border-radius:8px;">
            <tr><td style="padding:10px 14px;font-size:13px;color:#64748b;width:120px;border-bottom:1px solid #eef2f7;">Name</td><td style="padding:10px 14px;font-size:14px;color:#0f172a;border-bottom:1px solid #eef2f7;font-weight:700;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:10px 14px;font-size:13px;color:#64748b;width:120px;border-bottom:1px solid #eef2f7;">Email</td><td style="padding:10px 14px;font-size:14px;border-bottom:1px solid #eef2f7;"><a href="mailto:${escapeHtml(email)}" style="color:#2563eb;">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding:10px 14px;font-size:13px;color:#64748b;width:120px;border-bottom:1px solid #eef2f7;">Phone</td><td style="padding:10px 14px;font-size:14px;border-bottom:1px solid #eef2f7;">${phone ? `<a href="tel:${escapeHtml(phone.replace(/\s/g,''))}" style="color:#2563eb;">${escapeHtml(phone)}</a>` : '<span style="color:#94a3b8;">Not provided</span>'}</td></tr>
            <tr><td style="padding:10px 14px;font-size:13px;color:#64748b;width:120px;border-bottom:1px solid #eef2f7;">Shipment type</td><td style="padding:10px 14px;font-size:14px;color:#0f172a;border-bottom:1px solid #eef2f7;">${shipment_type ? escapeHtml(shipment_type) : '<span style="color:#94a3b8;">Not specified</span>'}</td></tr>
            <tr><td style="padding:10px 14px;font-size:13px;color:#64748b;width:120px;border-bottom:1px solid #eef2f7;">Tracking ID</td><td style="padding:10px 14px;font-size:14px;color:#0f172a;border-bottom:1px solid #eef2f7;">${tracking_id ? escapeHtml(tracking_id) : '<span style="color:#94a3b8;">Not provided</span>'}</td></tr>
            <tr><td style="padding:10px 14px;font-size:13px;color:#64748b;width:120px;vertical-align:top;">Message</td><td style="padding:10px 14px;font-size:14px;color:#0f172a;line-height:1.6;">${escapeHtml(message)}</td></tr>
        </table>
        <p style="margin:18px 0 0;"><a href="mailto:${escapeHtml(email)}?subject=Re:%20Your%20SkyCargo%20Enquiry" style="display:inline-block;background:#2563eb;color:#fff;padding:11px 22px;border-radius:8px;text-decoration:none;font-weight:700;">Reply to ${escapeHtml((name||'').split(' ')[0] || 'enquirer')}</a></p>`;
    return {
        subject: `New contact enquiry – ${name}${shipment_type ? ' ('+shipment_type+')' : ''}`,
        html: contactEmailWrapper('New contact enquiry', body),
    };
}

router.post('/contact', async (req, res) => {
    try {
        const { name, email, phone, shipment_type, tracking_id, message, _honey } = req.body || {};

        // Honeypot — bots fill the hidden field
        if (_honey) return res.status(200).json({ success: true });

        const clean = {
            name: String(name || '').trim().slice(0, 200),
            email: String(email || '').trim().slice(0, 200),
            phone: String(phone || '').trim().slice(0, 60) || '',
            shipment_type: String(shipment_type || '').trim().slice(0, 60) || '',
            tracking_id: String(tracking_id || '').trim().slice(0, 100) || '',
            message: String(message || '').trim().slice(0, 5000),
        };

        if (!clean.name || !clean.email || !clean.message) {
            return res.status(400).json({ error: 'Please fill in your name, email and message.' });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email)) {
            return res.status(400).json({ error: 'Please enter a valid email address.' });
        }

        console.log('[contact] POST /contact hit');
        console.log('[contact] payload:', { name: clean.name, email: clean.email, phone: clean.phone || null, shipment_type: clean.shipment_type || null, tracking_id: clean.tracking_id || null, message_length: clean.message.length, honeypot: !!_honey });

        const [emailSettingsRows, adminRows] = await Promise.all([
            mySqlQury(`SELECT * FROM tbl_email_settings WHERE id = 1`),
            mySqlQury(`SELECT email FROM tbl_admin WHERE role = '1' ORDER BY id LIMIT 1`),
        ]);
        const es = emailSettingsRows[0];
        const adminEmail = adminRows[0] && adminRows[0].email;
        if (!es || !es.email || !es.email_host) {
            console.log('[contact] ERROR: SMTP settings missing (tbl_email_settings empty or host/email blank). Got:', es ? { host: es.email_host, port: es.email_port, email: es.email ? '(set)' : '(blank)' } : 'no row');
            return res.status(500).json({ error: 'Contact form is not configured yet. Please email us directly.' });
        }
        if (!adminEmail) {
            console.log('[contact] ERROR: no platform admin email found (tbl_admin role=1)');
            return res.status(500).json({ error: 'No platform admin email is configured.' });
        }

        const port = parseInt(es.email_port, 10) || 465;
        const secure = port === 465;
        console.log(`[contact] SMTP: host=${es.email_host} port=${port} secure=${secure} user=${es.email} | admin recipient=${adminEmail}`);

        const transporter = nodemailer.createTransport({
            host: es.email_host,
            port,
            secure,
            auth: { user: es.email, pass: es.email_password },
        });

        // Fail fast if SMTP credentials/connection are bad
        try {
            await transporter.verify();
            console.log('[contact] SMTP connection verified OK');
        } catch (verifyErr) {
            console.log('[contact] SMTP verify FAILED:', verifyErr && verifyErr.message ? verifyErr.message : verifyErr);
            return res.status(500).json({ error: 'Mail server connection failed. Please try again later.' });
        }

        const submittedAt = new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });
        const guest = contactGuestEmail(clean);
        const owner = contactOwnerEmail({ ...clean, submittedAt });

        const [guestSent, ownerSent] = await Promise.all([
            transporter.sendMail({ from: `"${es.email}" <${es.email}>`, to: clean.email, subject: guest.subject, html: guest.html })
                       .then(info => { console.log(`[contact] guest mail SENT -> to=${clean.email} messageId=${info && info.messageId ? info.messageId : 'n/a'}`); return true; })
                       .catch(err => { console.log(`[contact] guest mail FAILED -> to=${clean.email}:`, err && err.message ? err.message : err); if (err && err.response) console.log('[contact] guest mail SMTP response:', err.response); return false; }),
            transporter.sendMail({ from: `"${es.email}" <${es.email}>`, to: adminEmail, subject: owner.subject, html: owner.html, replyTo: clean.email })
                       .then(info => { console.log(`[contact] owner mail SENT -> to=${adminEmail} replyTo=${clean.email} messageId=${info && info.messageId ? info.messageId : 'n/a'}`); return true; })
                       .catch(err => { console.log(`[contact] owner mail FAILED -> to=${adminEmail}:`, err && err.message ? err.message : err); if (err && err.response) console.log('[contact] owner mail SMTP response:', err.response); return false; }),
        ]);

        console.log(`[contact] summary: ownerSent=${ownerSent} guestSent=${guestSent}`);

        if (!ownerSent) {
            return res.status(500).json({ error: 'We could not send your message. Please try again later.' });
        }

        return res.json({
            success: true,
            message: 'Your message has been sent. We will respond within one business day.',
            guestEmailSent: guestSent,
        });
    } catch (error) {
        console.log('[contact] error', error);
        return res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
    }
});


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