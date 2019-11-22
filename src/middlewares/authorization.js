export const Authorization = (roles) => {
  return (req, res, next) => {


    let isAuthorized = true;

    roles.forEach((role) => {
      if (!req.user[role]) {
        isAuthorized = false;
      }
    })

    if (!isAuthorized) {
      return next();
    }
    
    // send back the auth message
    return res.status(401).send({ msg: 'You are not authorized to access this route.' });
  };
}
