//fucntion to check user role and authorize access to routes based on roles

import { RoleEnum } from "../constants/roles";

// paramerter (role , access)
export function roleMiddleware(roles: RoleEnum[]): (req: any, res: any, next: any) => void {
  return (req: any, res: any, next: any) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: `only ${roles.join(", ")} allowed` });
    }
  };
}

// route create admin access -->> user.role , whooCanAccess : admin
// user.role === whooCanAccess
//if true next() else res.status(403).json({message : "only ${ whoCanAccess} -"})
// route getByUserId access 


