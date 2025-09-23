var jwt = require('jsonwebtoken');
const AccountAdmin = require('../../models/account-admin.model');
const Role = require("../../models/role.model");

module.exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if(!token) {
      res.redirect(`/${pathAdmin}/account/login`);
      return;
    };

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, email } = decoded;

    const existAccount = await AccountAdmin.findOne({
      _id: id,
      email: email,
      status: "active"
    });


    if(!existAccount) {
      res.clearCookie("token");
      res.redirect(`/${pathAdmin}/account/login`);
      return;
    };

    const role = await Role.findOne({
      _id: existAccount.role
    });

    existAccount.roleName = role.name;

    req.account = existAccount;

    req.permissions = role.permissions;

    res.locals.account = existAccount;

    res.locals.permissions = role.permissions;
    
    next();
  } catch (error) {
    res.clearCookie("token");
    res.redirect(`/${pathAdmin}/account/login`);
  }
}