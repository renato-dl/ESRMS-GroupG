export const Authorization = (roles) => {
  return (req, res, next) => {

    let isAuthorized = false;
    
    roles.forEach((role) => {
      if (req.user[role]) {
        isAuthorized = true;
        return;
      }
    })

    if (isAuthorized) {
      return next();
    }
    
    // send back the auth message
    return res.status(401).send({ msg: 'You are not authorized to access this route.' });
  };
}
