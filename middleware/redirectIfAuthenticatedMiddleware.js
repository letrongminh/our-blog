module.exports = (req, res, next) => {
    if (req.session.userId) {
        // if user logged in, redirect to home page
        return redirect('/')
    }
    next()
}