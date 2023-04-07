import User from "../Models/User.js";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import CryptoJS from "crypto-js";
import sendForgotPassMail from "../Mails/SendForgotPasswordMail.js";
dotenv.config();

export const register = {
    validator: async (req, res, next) => {
        if (!req.body.email || !req.body.password || !req.body.username || !req.currUser.usertype) {
            return res.status(400).send("Please Fill all the Fields");
        }
        next();
    },
    controller: async (req, res) => {
        if (req.currUser.usertype === "owner") {
            try {
                const encryptedPass = CryptoJS.AES.encrypt(req.body.password, process.env.AES_SEC_KEY);
                // console.log(encryptedPass);
                const newAdmin = await User.create({
                    username: req.body.username.toLowerCase(),
                    email: req.body.email.toLowerCase(),
                    password: encryptedPass,
                    usertype: req.body.usertype
                });

                return res.status(200).send("Registration Successful");
            }
            catch (e) {
                if (e.keyValue?.username) {
                    return res.status(409).send("Username Already Exists");
                }
                else if (e.keyValue?.email) {
                    return res.status(409).send("Email Address Already Exists");
                }
                else {
                    return res.status(500).send("Reqistration Failed Internal Server Error");
                }
            }
        } else {
            return res.status(400).send("You can't add the new faculty");
        }
    }
}

export const login = {
    validator: async (req, res, next) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send("Please Fill all the Fields");
        }
        next();
    },
    controller: async (req, res) => {
        try {
            const findUser = await User.findOne({
                email: req.body.email.toLowerCase()
            });


            if (!findUser) {
                return res.status(400).send("Invalid Credentials ");
            }

            const decryptedPass = CryptoJS.AES.decrypt(
                findUser.password,
                process.env.AES_SEC_KEY
            ).toString(CryptoJS.enc.Utf8);

            if (decryptedPass !== req.body.password && findUser.password !== req.body.password) {
                return res.status(400).json("Invalid Credentials");
            }

            const accessToken = JWT.sign(
                {
                    id: findUser._id,
                },
                process.env.JWT_SEC_KEY,
                { expiresIn: "24h" }
            );

            res.cookie('remotelearn', accessToken, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });

            const { password, ...others } = findUser._doc;

            return res.status(200).json({
                "success": true,
                ...others,
                accessToken
            });

        }
        catch (e) {
            return res.status(500).send("Login Failed Internal Server Error");
        }
    }
}

export const logout = {
    controller: async (req, res) => {
        try {
            res.cookie('remotelearn', '', { maxAge: 0, httpOnly: true });

            res.status(200).send("Logout Successfull");
        } catch (e) {
            console.log(e);
            res.status(500).send("Logout Failed");
        }
    }
}

export const checkAdmin = {
    controller: async (req, res) => {
        try {
            return res.status(200).json({
                "success": true,
                admin: req.currUser
            });
        }
        catch (e) {
            return res.status(500).send("Admin Check Failed Internal Server Error");
        }
    }
}

export const updateAdmin = {
    validator: async (req, res, next) => {
        if (!req.body.email || !req.body.username) {
            return res.status(400).send("Please Fill all the Fields");
        }
        next();
    },
    controller: async (req, res) => {
        try {
            const updateData = await User.findByIdAndUpdate(req.userId, {
                email: req.body.email.toLowerCase(),
                username: req.body.username
            }, { new: true })

            const { password, ...others } = updateData._doc;

            return res.status(200).send(others);
        }
        catch (e) {
            console.log(e);
            if (e.keyValue?.username) {
                return res.status(409).send("Username Already Exists");
            }
            else if (e.keyValue?.email) {
                return res.status(409).send("Email Address Already Exists");
            }
            else {
                return res.status(500).send("Reqistration Failed Internal Server Error");
            }
        }
    }
}

export const updateAdminPassword = {
    validator: async (req, res, next) => {
        if (!req.body.curPassword || !req.body.newPassword || !req.body.retypePassword) {
            return res.status(400).send("Please Fill all the Fields");
        } else if (req.body.newPassword !== req.body.retypePassword) {
            return res.status(400).send("New password and retype password must be same");
        }
        next();
    },
    controller: async (req, res) => {
        try {
            const findUser = await User.findById(req.userId);

            const decryptedPass = CryptoJS.AES.decrypt(
                findUser.password,
                process.env.AES_SEC_KEY
            ).toString(CryptoJS.enc.Utf8);

            if (decryptedPass !== req.body.curPassword) {
                return res.status(400).json("Invalid Credintials");
            }

            const encryptedPassword = CryptoJS.AES.encrypt(req.body.newPassword, process.env.AES_SEC_KEY).toString()

            const updatePassword = await User.findByIdAndUpdate(req.userId, {
                password: encryptedPassword
            }, { new: true })

            const { password, ...others } = updatePassword._doc;

            return res.status(200).send(others);
        }
        catch (e) {
            return res.status(500).send("Admin Data Update Failed");
        }
    }
}

export const forgotPassword = {
    validator: async (req, res, next) => {
        if (!req.body.email) {
            return res.status(400).send("Please Enter the Email Id");
        } else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email))) {
            return res.status(400).send("Please Enter Valid Email Address");
        }
        next();
    },
    controller: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email.toLowerCase() });

            if (!user) {
                return res.status(400).send("Invalid Credentials");
            }

            const accessToken = JWT.sign(
                {
                    id: user._id,
                    username: user.username
                },
                process.env.JWT_SEC_KEY,
                { expiresIn: 60 * 5 }
            );

            // sendMail(accessToken, req.body.email);
            await sendForgotPassMail({ email: req.body.email, url: `${process.env.CLIENT_URL}/admin/reset_password?reset_password_token=${accessToken}` });

            res.status(200).json("Password Reset Email Has been Sent.");

        } catch (e) {
            console.log(e);
            res.status(500).json("Password Reset Failed");
        }
    }
}

export const resetTokenVerify = {
    validator: async (req, res, next) => {
        if (!req.body.token) {
            return res.status(400).send("Invalid Password Reset URL");
        }
        next();
    },
    controller: async (req, res) => {
        try {
            const verified = JWT.verify(req.body.token, process.env.JWT_SEC_KEY);
            const rootUser = await User.findOne({
                _id: verified.id
            });

            if (!rootUser) {
                return res.status(400).send("User Not Found For Password Reset")
            }

            res.status(200).send({ userId: verified.id });
        }
        catch (e) {
            // console.log(e)
            // if (e instanceof ExpiredJwtException) {
            //     res.status(500).json("Password Reset URL is Expired");
            // } else {
            res.status(500).json(e);
            // }
        }
    }
}

export const resetPassword = {
    validator: async (req, res, next) => {
        if (!req.body.newPassword || !req.body.retypePassword) {
            return res.status(400).send("Please Fill all the Fields");
        } else if (req.body.newPassword.length < 6) {
            return res.status(400).send("Password should be more than 6 characters");
        } else if (req.body.newPassword !== req.body.retypePassword) {
            return res.status(400).send("New password and retype password must be same");
        }
        next();
    },
    controller: async (req, res) => {
        try {
            const findUser = await User.findById(req.body.userId);

            if (!findUser) {
                return res.status(400).send("User not found for reset Password");
            }

            const encryptedPassword = CryptoJS.AES.encrypt(req.body.newPassword, process.env.AES_SEC_KEY).toString()

            const updatePassword = await User.findByIdAndUpdate(req.body.userId, {
                password: encryptedPassword
            }, { new: true })

            return res.status(200).send("Password is Updated Successfully");
        }
        catch (e) {
            console.log(e);
            return res.status(500).send("Admin Data Update Failed");
        }
    }
}

export const getAllAdmins = {
    controller: async (req, res) => {
        if (req.currUser.usertype === "owner") {
            try {
                const findAdmins = await User.find();

                if (findAdmins.length == 0) {
                    return res.status(400).send("Users Not Found")
                }

                const otherAdmins = findAdmins.filter((admin) => {
                    return (
                        admin.username !== req.currUser.username
                    )
                })

                return res.status(200).send(otherAdmins);

            } catch (e) {
                console.log(e);
                return res.status(500).send("Users Fetching Failed");
            }
        } else {
            return res.status(400).send("You can't see the faculty list");
        }
    }
}


// export const updateAdminStatus = {
//     validator: async (req, res, next) => {
//         if (!req.body.status) {
//             return res.status(400).send("Please Select Status");
//         } else if (!req.params.id) {
//             return res.status(400).send("Invalid admin");
//         }
//         next();
//     },
//     controller: async (req, res) => {
//         try {
//             const updateData = await User.findByIdAndUpdate(req.params.id, {
//                 verified: req.body.status
//             }, { new: true })

//             const { password, ...others } = updateData._doc;

//             return res.status(200).send(others);
//         }
//         catch (e) {
//             console.log(e);
//             return res.status(500).send("Admin Status Update Failed");
//         }
//     }
// }

export const deleteAdmin = {
    validator: async (req, res, next) => {
        if (!req.params.id) {
            return res.status(400).send("Invalid admin");
        }
        next();
    },
    controller: async (req, res) => {
        if (req.currUser.usertype === "owner") {
            try {
                await User.findByIdAndDelete(req.params.id)

                return res.status(200).send("Faculty Deletion Successful");
            }
            catch (e) {
                console.log(e);
                return res.status(500).send("Faculty Deletion Failed");
            }
        } else {
            return res.status(400).send("You can't delete the faculty");
        }
    }
}
