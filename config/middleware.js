

module.exports.notLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.flash('error', 'That page is currently unavailable.');
        return res.redirect('/dashboard');
    } else {
        next();
    };
};
