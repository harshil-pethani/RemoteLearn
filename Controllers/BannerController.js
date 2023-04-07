import Banner from "../Models/Banner.js";

export const bannerCreate = {
    validator: async (req, res, next) => {
        if (!req.body.bannertext || !req.body.startdate || !req.body.enddate || !req.body.bannercode || !req.body.discount) {
            return res.status(400).send("Please Fill all the Fields");
        }
        next();
    },
    controller: async (req, res) => {
        if (req.currUser.usertype === "owner") {
            try {
                const runningBanner = await Banner.findOne({ isrunning: true });

                if (runningBanner) {
                    const expireBanner = await Banner.findByIdAndUpdate(runningBanner._id, {
                        isrunning: false
                    })
                }
                const newBanner = await Banner.create({
                    bannertext: req.body.bannertext,
                    startdate: req.body.startdate,
                    enddate: req.body.enddate,
                    bannercode: req.body.bannercode.toLowerCase(),
                    discount: parseFloat(req.body.discount)
                })
                return res.status(201).json({
                    "message": "Banner Creation Successful",
                    ...newBanner._doc
                });
            } catch (e) {
                console.log(e);
                return res.status(500).send("Banner Creation Failed");
            }
        } else {
            return res.status(400).send("You can't create the Offer Banner")
        }
    }
}

export const bannerUpdate = {
    validator: async (req, res, next) => {
        if (!req.body.bannertext || !req.body.startdate || !req.body.enddate || !req.body.bannercode || !req.body.discount || !req.body.isrunning) {
            return res.status(400).send("Please Fill all the Fields");
        } else if (!req.params.id) {
            return res.status(400).send("Invalid Banner");
        }
        next();
    },
    controller: async (req, res) => {
        if (req.currUser.usertype === "owner") {
            try {
                const findBanner = await Banner.findById(req.params.id);

                if (!findBanner) {
                    return res.status(400).send("Banner Not Found")
                }

                if (req.body.isrunning) {
                    const runningBanner = await Banner.findOne({ isrunning: true });

                    if (runningBanner) {
                        const expireBanner = await Banner.findByIdAndUpdate(runningBanner._id, {
                            isrunning: false
                        })
                    }
                }

                const updateBanner = await Banner.findByIdAndUpdate(req.params.id, {
                    bannertext: req.body.bannertext,
                    startdate: req.body.startdate,
                    enddate: req.body.enddate,
                    bannercode: req.body.bannercode.toLowerCase(),
                    discount: req.body.discount,
                    isrunning: req.body.isrunning
                }, { new: true })

                return res.status(200).send({
                    "message": "Banner Updation Successful",
                    ...updateBanner._doc
                });
            } catch (e) {
                console.log(e);
                return res.status(500).send("Banner Updation Failed");
            }
        } else {
            return res.status(400).send("You can't Update the Offer details")
        }
    }
}

export const bannerExpire = {
    validator: async (req, res, next) => {
        if (!req.params.id) {
            return res.status(400).send("Invalid Banner");
        }
        next();
    },
    controller: async (req, res) => {
        if (req.currUser.usertype === "owner") {
            try {
                const findBanner = await Banner.findById(req.params.id);

                if (!findBanner) {
                    return res.status(400).send("Banner Not Found")
                }

                const expirebanner = await Banner.findByIdAndUpdate(req.params.id, {
                    isrunning: false
                }, { new: true })

                return res.status(200).send({
                    "message": "Banner Expire Successful",
                    ...expirebanner._doc
                });
            } catch (e) {
                console.log(e);
                return res.status(500).send("Banner Expire Failed");
            }
        } else {
            return res.status(400).send("You can't Expire the offer")
        }
    }
}

export const getAllBanners = {
    controller: async (req, res) => {
        if (req.currUser.usertype === "owner") {
            try {
                const findBanners = await Banner.find();

                if (findBanners.length == 0) {
                    return res.status(400).send("Banners Not Found")
                }

                return res.status(200).send(findBanners);

            } catch (e) {
                console.log(e);
                return res.status(500).send("Banners Fetching Failed");
            }

        } else {
            return res.status(400).send("You can't see all the offer details")
        }
    }
}

export const getSingleBanner = {
    validator: async (req, res, next) => {
        if (!req.params.id) {
            return res.status(400).send("Invalid Banner");
        }
        next();
    },
    controller: async (req, res) => {
        if (req.currUser.usertype === "owner") {
            try {
                const findBanner = await Banner.findById(req.params.id);

                if (!findBanner) {
                    return res.status(400).send("Banner Not Found")
                }

                return res.status(200).send(findBanner);

            } catch (e) {
                console.log(e);
                return res.status(500).send("Banner Fetching Failed");
            }
        } else {
            return res.status(400).send("You can't see the banner details")
        }
    }
}

export const getActiveBanner = {
    controller: async (req, res) => {
        try {
            const findActiveBanner = await Banner.findOne({ isrunning: true });

            if (!findActiveBanner) {
                return res.status(200).send("Not found");
            }

            return res.status(200).json({
                success: true,
                ...findActiveBanner._doc
            });

        } catch (e) {
            console.log(e);
            return res.status(500).send("Active Banner Fetching Failed");
        }
    }
}