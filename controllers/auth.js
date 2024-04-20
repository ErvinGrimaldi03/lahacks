
module.exports.getLogin = (req, res) => {
    res.render('login');
};

module.exports.getAdminSignup = (req, res) => {
    if (plugins.isTrusted(req.query.email) && req.query.smcode == process.env.SMCODE) {
        res.render('adminSignup');
    } else {
        res.redirect('/login');
    }
};

module.exports.postAdminSignup = (req, res) => {
    // do admin signup stuff
};